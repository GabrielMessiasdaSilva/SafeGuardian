import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Perfil from './telas/Informações_Pessoais/Perfil';
import Historico from './telas/Historico-de-Quedas/Historico';
import Contatos from './telas/Contatos/Contatos_Emergenciais';
import QuedaSonoro from '../src/components/Queda/QuedaSonoro';




const Tab = createBottomTabNavigator();

function Route() {
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: true,
            tabBarStyle: {
                marginBottom: 10,
                backgroundColor: "#1E2F6C",
                borderRadius: 20,
                margin: 20,
                elevation: 50,
                height: 60,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                color: "#fff",
                paddingBottom: 4,
            }
        }}>
          

     
      

            <Tab.Screen name="Perfil" component={Perfil} options={{
                headerShown: false,
                tabBarLabel: "Perfil",
                tabBarIcon: ({ color, focused }) => (
                    focused
                        ? <Ionicons name="person-circle" size={25} color="#fff" />
                        : <Ionicons name="person-circle-outline" size={25} color="#fff" />
                )
            }} />

            <Tab.Screen name="Contatos" component={Contatos} options={{
                headerShown: false,
                tabBarLabel: "Contato",
                tabBarIcon: ({ color, focused }) => (
                    focused
                        ? <MaterialCommunityIcons name="card-account-details" size={25} color="#fff" />
                        : <MaterialCommunityIcons name="card-account-details-outline" size={25} color="#fff" />
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



        </Tab.Navigator>
    );
}

export default Route;
