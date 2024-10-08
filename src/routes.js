import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Home from './telas/Home/index';
import Perfil from './telas/Informações_Pessoais/Perfil';
import Historico from './telas/Historico-de-Quedas/Historico';
import Som from './telas/Som/Som';
import ContatosNavigator from './ContatosNavigator'; // Importando o navigator de contatos

const Tab = createBottomTabNavigator();

function Route() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: true,
            tabBarStyle: {
                position: "absolute",
                backgroundColor: "#1E2F6C",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                elevation: 40,
                height: 60,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                color: "#fff",
                paddingBottom: 5,
            }
        }}>
            <Tab.Screen name="Home" component={Home} options={{
                headerShown: false,
                tabBarLabel: "Home",
                tabBarIcon: ({ color, focused }) => (
                    focused
                        ? <Ionicons name="home" size={25} color="#fff" />
                        : <Ionicons name="home-outline" size={25} color="#fff" />
                )
            }} />
            
            <Tab.Screen name="Perfil" component={Perfil} options={{
                headerShown: false,
                tabBarLabel: "Perfil",
                tabBarIcon: ({ color, focused }) => (
                    focused
                        ? <Ionicons name="person-circle" size={25} color="#fff" />
                        : <Ionicons name="person-circle-outline" size={25} color="#fff" />
                )
            }} />

            {/* Substitua a tela ContatosEmergenciais pelo seu Stack Navigator */}
            <Tab.Screen name="Contatos" component={ContatosNavigator} options={{
                headerShown: false,
                tabBarLabel: "Contatos",
                tabBarIcon: ({ color, focused }) => (
                    <MaterialCommunityIcons name="file-document-multiple-outline" size={25} color="#fff" />
                )
            }} />

            <Tab.Screen name="Historico" component={Historico} options={{
                headerShown: false,
                tabBarLabel: "Histórico",
                tabBarIcon: ({ color, focused }) => (
                    focused
                        ? <MaterialCommunityIcons name="card-account-details" size={25} color="#fff" />
                        : <MaterialCommunityIcons name="card-account-details-outline" size={25} color="#fff" />
                )
            }} />

            <Tab.Screen name="Som" component={Som} options={{
                headerShown: false,
                tabBarLabel: "Som",
                tabBarIcon: ({ color, focused }) => (
                    focused
                        ? <Ionicons name="musical-note" size={25} color="#fff" />
                        : <Ionicons name="musical-note-outline" size={25} color="#fff" />
                )
            }} />
        </Tab.Navigator>
    );
}

export default Route;
