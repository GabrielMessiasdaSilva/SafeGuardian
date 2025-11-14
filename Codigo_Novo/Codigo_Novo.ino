#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <UrlEncode.h>
#include <math.h>
#include <time.h>
#include <WiFiManager.h>  // Biblioteca WiFiManager

Adafruit_MPU6050 mpu;

String phoneNumber = "+14386015034";
String apiKey = "2043303";

const String FIREBASE_HOST = "https://safeguardian-49e3d-default-rtdb.firebaseio.com/";
const String FIREBASE_AUTH = "AIzaSyB8t7z4PqtYkN6pBRHKb1lXN14r8EPKFd4";

unsigned long lastFallTime = 0;
const unsigned long fallCooldown = 72000;
bool quedaDetectada = false;

unsigned long tempoUltimaLeitura = 0;
const unsigned long intervaloLeitura = 100;

unsigned long tempoUltimaLeituraBateria = 0;
const unsigned long intervaloLeituraBateria = 120000; // 2 minutos

#define BATTERY_PIN 32

// ========================= FUNÇÕES =========================
void sendMessage(String message) {
  String url = "https://api.callmebot.com/whatsapp.php?phone=" + phoneNumber + "&apikey=" + apiKey + "&text=" + urlEncode(message);
  HTTPClient http;
  http.begin(url);
  http.GET();
  http.end();
}

void sendToFirebase(String message) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = FIREBASE_HOST + "Dispositivo/SafeGuardian/Quedas.json?auth=" + FIREBASE_AUTH;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    time_t now;
    struct tm timeinfo;
    time(&now);
    localtime_r(&now, &timeinfo);

    char data[11]; 
    char hora[9];  

    strftime(data, sizeof(data), "%d/%m/%Y", &timeinfo);
    strftime(hora, sizeof(hora), "%H:%M:%S", &timeinfo);

    String json = "{";
    json += "\"MEC\": \"" + WiFi.macAddress() + "\",";
    json += "\"data\": \"" + String(data) + "\",";
    json += "\"hora\": \"" + String(hora) + "\",";
    json += "\"alerta\": \"" + message + "\",";
    json += "\"conectado\": " + String(WiFi.status() == WL_CONNECTED ? "true" : "false");
    json += "}";

    http.POST(json);
    http.end();
  }
}

void sendBatteryToFirebase(float percentage) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = FIREBASE_HOST + "Bateria.json?auth=" + FIREBASE_AUTH;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"percentual\": " + String(percentage, 2) + "}";
    http.PATCH(json);
    http.end();
  }
}

void sendToFirebaseSensores(float accTotal, float angulo) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = FIREBASE_HOST + "Sensores.json?auth=" + FIREBASE_AUTH;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");

    String json = "{";
    json += "\"aceleracao_total\": " + String(accTotal, 2) + ",";
    json += "\"angulo\": " + String(angulo, 2);
    json += "}";

    http.PATCH(json);
    http.end();
  }
}

float readBatteryPercentage() {
  int raw = analogRead(BATTERY_PIN);
  float voltage = raw * (3.3 / 4095.0) * 2;
  float percentage = (voltage - 3.0) / (4.2 - 3.0) * 100.0;
  percentage = constrain(percentage, 0, 100);
  return percentage;
}

// ========================= SETUP =========================
void setup() {
  Serial.begin(115200);
  Wire.begin(22, 21);
  analogReadResolution(12);

  // ---------- WiFiManager ----------
  WiFiManager wm;
  wm.setConfigPortalTimeout(180); // Portal expira em 3 min se não conectar
  if (!wm.autoConnect("SafeGuardian-Setup", "12345678")) {  
    Serial.println("Falha ao conectar. Reiniciando...");
    ESP.restart();
  }
  Serial.println("WiFi conectado com sucesso!");

  configTime(-10800, 0, "pool.ntp.org", "time.nist.gov");

  if (!mpu.begin()) {
    Serial.println("Falha ao inicializar o MPU6050!");
    while (1) delay(10);
  }
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);
}

// ========================= LOOP =========================
void loop() {
  unsigned long tempoAtual = millis();

  if (tempoAtual - tempoUltimaLeituraBateria >= intervaloLeituraBateria) {
    tempoUltimaLeituraBateria = tempoAtual;
    float batteryPercentage = readBatteryPercentage();
    sendBatteryToFirebase(batteryPercentage);
  }

  if (tempoAtual - tempoUltimaLeitura >= intervaloLeitura) {
    tempoUltimaLeitura = tempoAtual;

    sensors_event_t a, g, temp;
    mpu.getEvent(&a, &g, &temp);

    float accTotal = sqrt(pow(a.acceleration.x, 2) + pow(a.acceleration.y, 2) + pow(a.acceleration.z, 2));
    float angulo = acos(a.acceleration.z / accTotal) * (180.0 / PI);

    sendToFirebaseSensores(accTotal, angulo);

    bool anguloSeguro = (angulo < 25 || angulo > 110);

    if (accTotal > 2.5 && anguloSeguro) {
      if (!quedaDetectada && (tempoAtual - lastFallTime > fallCooldown)) {
        quedaDetectada = true;
        lastFallTime = tempoAtual;

        sendMessage("⚠️ Alerta: Uma queda foi detectada pelo dispositivo SafeGuardian.");
        sendToFirebase("⚠️ Alerta: Uma queda foi detectada.");
      }
    } else {
      quedaDetectada = false;
    }
  }
}
