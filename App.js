import Route from './src/routes'; // Verifique o caminho
//import Home from './src/telas/Home/index'; 
import { db } from './src/Services/FirebaseConnection'
import { NavigationContainer } from '@react-navigation/native'

const App = () => {
  return (
    <NavigationContainer>    

      <Route />
    </NavigationContainer>

  );
};

export default App;
