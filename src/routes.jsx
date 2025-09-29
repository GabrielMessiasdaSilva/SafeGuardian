import React from "react";
import { StyleSheet, Platform, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";

import Perfil from "./telas/Informações_Pessoais/Perfil";
import Historico from "./telas/Historico-de-Quedas/Historico";
import Contatos from "./telas/Contatos/Contatos_Emergenciais";
import Configuracoes from "./telas/Configuracoes/Configuracoes";
import Dashboard from "./telas/dashboard/home";
import AssociateEsp32 from "./components/AssociateEsp32/AssociateEsp32";

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const COLORS = {
  primary: "#1A1A2E",
  accent: "#2196F3",
  barBackground: "#2C2C44", // Fundo da Tab Bar
  white: "#FFFFFF",
  gray: "#9090A0", // Inativo
};

// --- Stack Dashboard --- (Mantido, para navegação interna)
function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.primary, elevation: 0 },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen name="DashboardScreen" component={Dashboard} options={{ headerShown: false }} />
      <Stack.Screen
        name="AssociateEsp32"
        component={AssociateEsp32}
        options={{ title: "Conectar Dispositivo" }}
      />
    </Stack.Navigator>
  );
}

function Route() {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.gray,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,

          tabBarIcon: ({ focused, color, size }) => {

            let iconName;
            let iconSize = size * 1.1;

            switch (route.name) {
              case "Perfil":
                iconName = focused ? "account-details" : "account-details-outline";
                break;
              case "Historico":
                iconName = focused ? "history" : "history";
                break;
              case "Contatos":
                iconName = focused ? "account-group" : "account-group-outline";
                break;
              case "Configuracoes":
                iconName = focused ? "cog" : "cog-outline";
                break;
              case "Dashboard":
                iconName = focused ? "home" : "home-outline";
                iconSize = size * 1.3; 
                break;
              default:
                iconName = "circle-slice-8";
            }

            return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Perfil" component={Perfil} options={{ tabBarLabel: "Perfil" }} />
        <Tab.Screen name="Contatos" component={Contatos} options={{ tabBarLabel: "Contatos" }} />
        <Tab.Screen name="Dashboard" component={DashboardStack} options={{ tabBarLabel: "Início" }} />
        <Tab.Screen name="Historico" component={Historico} options={{ tabBarLabel: "Histórico" }} />
        <Tab.Screen name="Configuracoes" component={Configuracoes} options={{ tabBarLabel: "Config." }} />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.barBackground,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: 70,
    paddingBottom: Platform.OS === "ios" ? 25 : 10,
    borderTopWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  tabBarLabel: {
    fontWeight: '600',
    fontSize: 11,
  },
});

export default Route;