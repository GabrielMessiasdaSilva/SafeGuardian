#include "arduino_secrets.h"

#include <Wire.h>
#include <WiFiManager.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <UrlEncode.h>
#include <math.h>

// IdentificaÃ§Ã£o Ãºnica para o ESP32
String uniqueID;

// ConfiguraÃ§Ãµes do MPU6050 e variÃ¡veis de aceleraÃ§Ã£o
Adafruit_MPU6050 mpu;
const int MPU_addr = 0x68;                             // EndereÃ§o I2C do MPU-6050
int16_t AcX, AcY, AcZ, Tmp, GyX, GyY, GyZ;             //Dados brutos do aceletÃ´metro e giroscÃ³pio
float ax = 0, ay = 0, az = 0, gx = 0, gy = 0, gz = 0;  //Dados convertidos
int angleChange = 0;                                   //MundanÃ§a de orientaÃ§Ã£o

//Estado de detecÃ§Ã£o de queda

boolean fall = false;      // Armazena se ocorreu uma queda
boolean trigger1 = false;  // Armazena se o primeiro trigger (limiar inferior) ocorreu
boolean trigger2 = false;  // Armazena se o segundo trigger (limiar superior) ocorreu
boolean trigger3 = false;  // Armazena se o terceiro trigger (mudanÃ§a de orientaÃ§Ã£o) ocorreu
byte trigger1count = 0;    // Armazena o nÃºmero de contagens passadas desde que o trigger 1 foi ativado
byte trigger2count = 0;    // Armazena o nÃºmero de contagens passadas desde que o trigger 2 foi ativado
byte trigger3count = 0;    // Armazena o nÃºmero de contagens passadas desde que o trigger 3 foi ativado

//API CallMeBot
String phoneNumber = "+5511950574114";  // NÃºmero para o CallMeBot
String apiKey = "6764260";              // Chave da API do CallMeBot

//Firebase
const String FIREBASE_HOST = "https://safeguardian-49e3d-default-rtdb.firebaseio.com/";
const String FIREBASE_AUTH = "AIzaSyB8t7z4PqtYkN6pBRHKb1lXN14r8EPKFd4";

//Bateria
int analogInPin = 32;      // Pin analÃ³gico
float calibration = 0.30;  // CalibraÃ§Ã£o
float voltage;
int bat_percentage;

// ParÃ¢metros do filtro complementar
float alpha = 0.98;

unsigned long lastBatteryRead = 0;                // Armazena o tempo da Ãºltima leitura da bateria
const unsigned long batteryReadInterval = 60000;  // Intervalo de 30 segundos

// VariÃ¡vel para armazenar o Ãºltimo status de conexÃ£o
bool lastStatus = false;

// FunÃ§Ã£o para mapear valores float
float mapfloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// Tamanho do buffer de aceleraÃ§Ã£o
const int bufferSize = 5;
float accelerationBuffer[bufferSize] = { 0 };

// FunÃ§Ã£o para enviar mensagens via CallMeBot
void sendMessage(String message) {
  String url = "https://api.callmebot.com/whatsapp.php?phone=" + phoneNumber + "&apikey=" + apiKey + "&text=" + urlEncode(message);
  HTTPClient http;
  http.begin(url);

  int httpResponseCode = http.GET();
  if (httpResponseCode == 200) {
    Serial.println("Mensagem enviada com sucesso!");
  } else {
    Serial.println("Falha no envio da mensagem");
    Serial.print("CÃ³digo de resposta HTTP: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}

// FunÃ§Ã£o para enviar dados para o Firebase Realtime Database
void sendToFirebase(String path, String message, bool isPost = true, bool printMessage = false) {
  String url = FIREBASE_HOST + path + ".json?auth=" + FIREBASE_AUTH;
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode;
  if (isPost) {
    httpResponseCode = http.POST(message);
  } else {
    // Se isPost for falso, usamos PUT
    httpResponseCode = http.PUT(message);
  }

  // Imprime mensagem apenas se solicitado
  if (printMessage && httpResponseCode == 200) {
    Serial.println("Dados enviados ao Firebase com sucesso!");
  }
  http.end();
}

void sendFirebaseConfirmation(bool status) {
  String url = FIREBASE_HOST + "Dispositivo/SafeGuardian.json?auth=" + FIREBASE_AUTH;
  HTTPClient http;

  // Configura a URL para o Firebase Realtime Database
  http.begin(url);

  // Define o mÃ©todo HTTP como PATCH para atualizar o valor existente
  http.addHeader("Content-Type", "application/json");

  String uniqueID = WiFi.macAddress();

  // Envia os dados para o Firebase
  String payload = "{\"conectado\": " + String(status ? "true" : "false") + ", \"UserId\": \"\", " + "\"MEC\": \"" + uniqueID + "\"}";

  // Faz a requisiÃ§Ã£o PATCH
  int httpResponseCode = http.PATCH(payload);

  if (httpResponseCode > 0) {
    Serial.println("Valor atualizado no Firebase");
  } else {
    Serial.print("Erro ao atualizar no Firebase: ");
    Serial.println(httpResponseCode);
  }

  // Fecha a conexÃ£o HTTP
  http.end();
}

// FunÃ§Ã£o para ler a bateria
void readBattery() {
  int sensorValue = analogRead(analogInPin);
  voltage = (((sensorValue * 3.3) / 4095) * 2 + calibration);  // Divisor de tensÃ£o
  bat_percentage = mapfloat(voltage, 2.8, 4.2, 0, 100);        // Mapeamento

  if (bat_percentage > 100) bat_percentage = 100;
  if (bat_percentage < 0) bat_percentage = 1;

  /*
  Serial.print("Leitura da bateria: ");
  Serial.print(sensorValue);
  Serial.print(", TensÃ£o: ");
  Serial.print(voltage);
  Serial.print(" V, Percentual: ");
  Serial.println(bat_percentage);
  */

  // Enviar dados da bateria para o Firebase
  String batteryPath = "Bateria";  // Caminho no Firebase
  String batteryMessage = "{\"tensao\": " + String(voltage, 2) + ", \"percentual\": " + String(bat_percentage) + "}";
  sendToFirebase(batteryPath, batteryMessage, false, false);  // Chamada com isPost = false para usar PUT
}

void setup() {
  Serial.begin(115200);
  Wire.begin(22, 21);  // Usando GPIO 22 como SDA e GPIO 21 como SCL
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // Acorda o MPU-6050
  Wire.endTransmission(true);

  WiFi.setHostname("safeguardian");

  // Inicializa o WiFiManager
  WiFiManager wifiManager;

  // ForÃ§a o dispositivo a entrar no modo de configuraÃ§Ã£o se nÃ£o estiver conectado
  const char* portalSenha = "12345678";
  if (!wifiManager.autoConnect("SafeGuardian", portalSenha)) {
    wifiManager.startConfigPortal("SafeGuardian", portalSenha);  // ForÃ§a a entrada no portal de configuraÃ§Ã£o
  }

  Serial.println("Wi-Fi conectado");

  // Enviar a confirmaÃ§Ã£o para o Firebase (sÃ³ envia se o status mudar)
  sendFirebaseConfirmation(true);

  // ConfiguraÃ§Ã£o de NTP para obter a data e hora
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  setenv("TZ", "BRT3", 1);  // Fuso horÃ¡rio do Brasil
}

String getDateTime() {
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Falha ao obter a hora");
    return "";
  }
  char buffer[25];
  strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
  return String(buffer);
}

// FunÃ§Ã£o para ler os dados do MPU6050
void mpu_read() {
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x3B);  // Inicia com o registro 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_addr, 14, true);  // Solicita 14 registros

  AcX = Wire.read() << 8 | Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)
  AcY = Wire.read() << 8 | Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  AcZ = Wire.read() << 8 | Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
  Tmp = Wire.read() << 8 | Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
  GyX = Wire.read() << 8 | Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
  GyY = Wire.read() << 8 | Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
  GyZ = Wire.read() << 8 | Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0
}

// FunÃ§Ã£o para atualizar o buffer de aceleraÃ§Ã£o
void updateAccelerationBuffer(float value) {
  for (int i = bufferSize - 1; i > 0; i--) {
    accelerationBuffer[i] = accelerationBuffer[i - 1];
  }
  accelerationBuffer[0] = value;
}

// Verifica se houve movimento significativo antes da queda
bool significantMovementBefore() {
  for (int i = 0; i < bufferSize; i++) {
    if (accelerationBuffer[i] > 2.5) {
      return true;
    }
  }
  return false;
}

void loop() {
  bool currentStatus = WiFi.isConnected();

  if (currentStatus != lastStatus) {
    // Se o status mudou, envie a atualizaÃ§Ã£o para o Firebase
    sendFirebaseConfirmation(currentStatus);
    lastStatus = currentStatus;  // Atualiza o Ãºltimo status
  }

  // Se o ESP32 perder a conexÃ£o com a rede, entra no modo de configuraÃ§Ã£o novamente
  if (!WiFi.isConnected()) {
    WiFi.disconnect();  // Desconecta da rede Wi-Fi
    delay(1000);        // Aguarda um pouco antes de reentrar no modo de configuraÃ§Ã£o
    WiFiManager wifiManager;
    wifiManager.startConfigPortal("SafeGuardian", "12345678");  // ForÃ§a a entrada no portal de configuraÃ§Ã£o
  }

  unsigned long currentMillis = millis();  // Obter o tempo atual

  mpu_read();

  // Convertendo os dados do acelerÃ´metro e giroscÃ³pio
  ax = (AcX - 2050) / 16384.00;
  ay = (AcY - 77) / 16384.00;
  az = (AcZ - 1947) / 16384.00;
  gx = (GyX + 270) / 131.07;
  gy = (GyY - 351) / 131.07;
  gz = (GyZ + 136) / 131.07;

  // Calculando o vetor de amplitude para os 3 eixos
  float Raw_Amp = pow(pow(ax, 2) + pow(ay, 2) + pow(az, 2), 0.5);
  int Amp = Raw_Amp * 10;  // Multiplicado por 10 para ajustar o valor

  updateAccelerationBuffer(Amp);
  Serial.println(Amp);

  // Gatilho 1: DetecÃ§Ã£o de aceleraÃ§Ã£o baixa
  if (Amp <= 2 && trigger2 == false) {  //Valor funcional: 1 | 0.8 = valor para teste
    trigger1 = true;
    Serial.println("GATILHO 1 ATIVADO");
  }

  // Gatilho 2: DetecÃ§Ã£o de aceleraÃ§Ã£o alta
  if (trigger1 == true) {
    trigger1count++;
    if (Amp >= 12) {  //Valor funcional: ? | 2 a 2.5 = Valor para teste | 5 = Valor funcional para teste na mÃ£o
      trigger2 = true;
      Serial.println("GATILHO 2 ATIVADO");
      trigger1 = false;
      trigger1count = 0;
    }
  }

  //Gatilho 3: MudanÃ§a de orientaÃ§Ã£o
  if (trigger2 == true) {
    trigger2count++;
    angleChange = pow(pow(gx, 2) + pow(gy, 2) + pow(gz, 2), 0.5);
    Serial.println(angleChange);
    if (angleChange >= 30 && angleChange <= 400) {  // 60 a 120 = Valor funcional para teste na mÃ£o | 30 a 150 graus = Teste
      trigger3 = true;
      trigger2 = false;
      trigger2count = 0;
      Serial.println(angleChange);
      Serial.println("GATILHO 3 ATIVADO");
    }
  }

  //Verifica se todos os gatilhos foram ativados
  if (trigger3 == true) {
    trigger3count++;
    if (trigger3count >= 10) {
      angleChange = pow(pow(gx, 2) + pow(gy, 2) + pow(gz, 2), 0.5);
      Serial.println(angleChange);
      if ((angleChange >= 0) && (angleChange <= 10)) {  // Se a orientaÃ§Ã£o mudar entre 0-? graus
        fall = true;
        trigger3 = false;
        trigger3count = 0;
        Serial.println(angleChange);
      } else {  // Se o usuÃ¡rio voltou Ã  orientaÃ§Ã£o normal
        trigger3 = false;
        trigger3count = 0;
        Serial.println("GATILHO 3 DESATIVADO");
      }
    }
  }

  if (fall == true) {  // Caso uma queda seja detectada
    Serial.println("QUEDA DETECTADA");
    sendMessage("Alerta: Queda detectada!");
    // Obter data e hora
    String dateTime = getDateTime();
    String date = dateTime.substring(0, 10);   // YYYY-MM-DD
    String time = dateTime.substring(11, 19);  // HH:MM:SS

    String uniqueID = WiFi.macAddress();

    // Enviar dados agrupados ao Firebase
    String payload = "{\"id\": \"" + uniqueID + "\", \"alerta\": \"Queda detectada!\", \"data\": \"" + date + "\", \"hora\": \"" + time + "\"}";
    sendToFirebase("Dispositivo/SafeGuardian/Quedas", payload);

    fall = false;  //Reinicia o estado de queda
  }

  //ReinÃ­cio dos gatilhos
  if (trigger2count >= 6) {  // Permitir 0,6 segundos para mudanÃ§a de orientaÃ§Ã£o
    trigger2 = false;
    trigger2count = 0;
    Serial.println("GATILHO 2 DESATIVADO");
  }

  if (trigger1count >= 6) {  // Permitir 0,6 segundos para quebra de limite superior
    trigger1 = false;
    trigger1count = 0;
    Serial.println("GATILHO 1 DESATIVADO");
  }

  // Verifica se Ã© hora de ler a bateria
  if (currentMillis - lastBatteryRead >= batteryReadInterval) {
    readBattery();
    lastBatteryRead = currentMillis;  // Atualiza o tempo da Ãºltima leitura
  }

  delay(100);
}