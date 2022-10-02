
import * as React from 'react';
import { Button } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PedidosView from './components/PedidosView';
import ClienteView from './components/ClienteView';
import ClienteForm from './components/ClienteForm';
import PedidoForm from './components/PedidoForm';

const Stack = createNativeStackNavigator();

function GoToClientesButton() {
  const navigation = useNavigation();

  return (
    <Button
      title={`Clientes`}
      onPress={() => navigation.navigate('ClienteView')}
      color='transparent'
    />
  );
}



function App({ navigation }) {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Pedidos" component={PedidosView} options={{
          title: 'Pedidos',
          headerStyle: {
            backgroundColor: '#013028',
            borderWidth: 0
          },

          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <GoToClientesButton
            />
          ),
        }} />
        <Stack.Group screenOptions={{
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }}>
          <Stack.Screen name="ClienteView" component={ClienteView}
            options={{
              title: 'Clientes',
              headerStyle: {
                backgroundColor: '#013028',
                borderWidth: 0
              },

              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              }
            }}
          />
          <Stack.Screen name="ClienteForm" component={ClienteForm}
            options={{
              title: 'Agregar Cliente',
              headerStyle: {
                backgroundColor: '#013028',
                borderWidth: 0
              },

              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              }
            }}
          />
          <Stack.Screen name="PedidoForm" component={PedidoForm}
            options={{
              title: 'Agregar Pedido',
              headerStyle: {
                backgroundColor: '#013028',
                borderWidth: 0
              },

              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              }
            }}
          />
        </Stack.Group>
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default App;
