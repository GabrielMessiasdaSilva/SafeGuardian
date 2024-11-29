import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Perfil from './telas/Informações_Pessoais/Perfil';
import Historico from './telas/Historico-de-Quedas/Historico';
import Contatos from './telas/Contatos/Contatos_Emergenciais';
import Dashboard from './telas/dashboard/home';
import AssociateEsp32 from './components/AssociateEsp32/AssociateEsp32';
import BatteryStatus from './components/BatteryStatus/BatteryStatus';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DashboardStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Dashboard"
                component={Dashboard}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AssociateEsp32"
                component={AssociateEsp32}
                options={{
                    headerShown: true,
                    title: 'Associar ESP32',
                    headerTintColor: '#fff',
                    headerStyle: {
                        backgroundColor: '#1E2F6C',
                        height: 60,
                        borderBottomWidth: 0,
                    },
                    headerTitleStyle: {
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#fff',
                    },
                }}
            />
        </Stack.Navigator>
    );
}

function Route() {
    return (
        <>
            <BatteryStatus
                screenOptions={{ backgroundColor: '#4CAF50' }}
            />
            <Tab.Navigator
                screenOptions={{
                    animationEnabled: true, // Ativa animações nativas
                    tabBarStyle: {
                        height: 60,
                        marginHorizontal: 20,
                        backgroundColor: "#1E2F6C",
                        borderRadius: 20,
                        marginBottom: 7,
                        elevation: 10,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        paddingBottom: 10,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.5,
                        padding: 5,
                    },
                    tabBarLabelStyle: {
                        fontSize: 15,
                        color: "#fff",
                    }
                }}
            >
                <Tab.Screen
                    name="Dashboard"
                    component={DashboardStack} // Usa o stack navigator para a tela Dashboard
                    options={{
                        headerShown: false,
                        tabBarLabel: "Dashboard",
                        tabBarIcon: ({ color, focused }) => (
                            focused
                                ? <MaterialIcons name="dashboard" size={24} color="#fff" />
                                : <MaterialIcons name="dashboard" size={24} color="#fff" />
                        )
                    }}
                />

                <Tab.Screen
                    name="Perfil"
                    component={Perfil}
                    options={{
                        headerShown: false,
                        tabBarLabel: "Perfil",
                        tabBarIcon: ({ color, focused }) => (
                            focused
                                ? <Ionicons name="person-circle" size={25} color="#fff" />
                                : <Ionicons name="person-circle-outline" size={25} color="#fff" />
                        )
                    }}
                />

                <Tab.Screen
                    name="Contatos"
                    component={Contatos}
                    options={{
                        headerShown: false,
                        tabBarLabel: "Contato",
                        tabBarIcon: ({ color, focused }) => (
                            focused
                                ? <MaterialCommunityIcons name="card-account-details" size={25} color="#fff" />
                                : <MaterialCommunityIcons name="card-account-details-outline" size={25} color="#fff" />
                        )
                    }}
                />

                <Tab.Screen
                    name="Historico"
                    component={Historico}
                    options={{
                        headerShown: false,
                        tabBarLabel: "Histórico",
                        tabBarIcon: ({ color, focused }) => (
                            focused
                                ? <MaterialCommunityIcons name="card-account-details" size={25} color="#fff" />
                                : <MaterialCommunityIcons name="card-account-details-outline" size={25} color="#fff" />
                        )
                    }}
                />
            </Tab.Navigator>
        </>
    );
}

export default Route;
