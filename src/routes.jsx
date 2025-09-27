import React from "react";
import { StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";

// --- Telas ---
import Perfil from "./telas/Informações_Pessoais/Perfil";
import Historico from "./telas/Historico-de-Quedas/Historico";
import Contatos from "./telas/Contatos/Contatos_Emergenciais";
import Configuracoes from "./telas/Configuracoes/Configuracoes";
import Dashboard from "./telas/dashboard/home";
import AssociateEsp32 from "./components/AssociateEsp32/AssociateEsp32";
import BatteryStatus from "./components/BatteryStatus/BatteryStatus";

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// --- 🎨 Paleta ---
const COLORS = {
  primary: "#1E1E2F",
  secondary: "#2A2C3C",
  accent: "#2E4A8F",
  white: "#FFFFFF",
  gray: "#A0A0B0",
};

// --- Stack Dashboard ---
function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardScreen" component={Dashboard} />
      <Stack.Screen
        name="AssociateEsp32"
        component={AssociateEsp32}
        options={{ title: "Associar ESP32" }}
      />
    </Stack.Navigator>
  );
}

// --- Rotas principais ---
function Route() {
  return (
    <>
      <BatteryStatus />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.gray,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Perfil: focused ? "person-circle" : "person-circle-outline",
              Dashboard: "home",
              Contatos: "account-group-outline",
              Historico: "history",
              Configuracoes: "cog",
            };

            if (route.name === "Perfil") {
              return <Ionicons name={icons[route.name]} size={size} color={color} />;
            }
            if (route.name === "Dashboard") {
              return <MaterialIcons name={icons[route.name]} size={size + 2} color={color} />;
            }
            if (route.name === "Contatos" || route.name === "Historico") {
              return (
                <MaterialCommunityIcons
                  name={icons[route.name]}
                  size={size}
                  color={color}
                />
              );
            }
            if (route.name === "Configuracoes") {
              return <Entypo name={icons[route.name]} size={size} color={color} />;
            }
          },
        })}
      >
        <Tab.Screen name="Perfil" component={Perfil} options={{ tabBarLabel: "Perfil" }} />
        <Tab.Screen name="Historico" component={Historico} options={{ tabBarLabel: "Histórico" }} />
        <Tab.Screen name="Dashboard" component={DashboardStack} options={{ tabBarLabel: "Início" }} />
        <Tab.Screen name="Contatos" component={Contatos} options={{ tabBarLabel: "Contatos" }} />
        <Tab.Screen name="Configuracoes" component={Configuracoes} options={{ tabBarLabel: "Config." }} />
      </Tab.Navigator>
    </>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    backgroundColor: COLORS.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 65,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default Route;
