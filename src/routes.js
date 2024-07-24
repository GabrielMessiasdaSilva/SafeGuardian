import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Home from './telas/Home/index';
import Perfil from './telas/Informações_Pessoais/Perfil'
import ContatosEmergenciais from './telas/Contatos/Contatos_Emergenciais';
import Historico from './telas/Historico-de-Quedas/Historico';






const Tab = createBottomTabNavigator();

function Route() {
    return (

        //Tirando as labels do icones do tabBar
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: false, tabBarStyle: {
                position: "absolute",
                backgroundColor: "#FFFFFF",
                borderTopWidth: 0,

                bottom: 14,
                left: 14,
                right: 14,
                elevation: 0,
                borderRadius: 15,
                height: 80,
            }
        }}>   
          
          <Tab.Screen name="Home" component={Home} options={{
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (focused) {
                        return <Ionicons name="home" size={44} color="#1E2F6C" />
                    }
                    return <Ionicons name="home-outline" size={44} color="#1E2F6C" />
                }
            }} />
          <Tab.Screen name="Perfil" component={Perfil} options={{
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (focused) {
                        return <Ionicons name="person-circle" size={46} color="#1E2F6C" />
                    }
                    return <Ionicons name="person-circle-outline" size={46} color="#1E2F6C" />
                }
            }} />


            <Tab.Screen name="ContatosEmergenciais" component={ContatosEmergenciais} options={{
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (focused) {
                        return <MaterialCommunityIcons name="file-document-multiple-outline" size={37} color="#1E2F6C" />
                    }
                    return <MaterialCommunityIcons name="file-document-multiple-outline" size={37} color="#1E2F6C" />
                }
            }} />




            <Tab.Screen name="Historico" component={Historico} options={{
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    if (focused) {
                        return <MaterialCommunityIcons name="card-account-details" size={36} color="#1E2F6C" />
                    }
                    return <MaterialCommunityIcons name="card-account-details-outline" size={36} color="#1E2F6C" />
                }
            }} />





        </Tab.Navigator>
    )
}


export default Route;