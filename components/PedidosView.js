import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, RefreshControl, StyleSheet } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { useNavigation, NavigationContainer, useFocusEffect } from '@react-navigation/native';
import Moment from 'moment';
import 'moment/locale/es';

export default PedidosView = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);



  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch('https://cafe21.herokuapp.com/api/pedido');
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  })

  useEffect(() => {
    onRefresh();
  }, []);


  const ItemView = ({ item }) => {
    var total = 0;
    return (
      <View style={styles.listItem}>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold"
            }}>
            {item.cliente.nombre} {item.cliente.apellido}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              padding: 5,
            }}>
            Fecha de entrega:  {Moment(item.fecha_hora).format('DD/MM/YY HH:mm')} Hs.
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              padding: 5,
              fontWeight: "bold"
            }}>
            Productos:
          </Text>
        
            {      
                item.pedidoProductoses.map((element) => {
                total = total + element.precioTotal 
                return(<View style={{  flexDirection: "row", width:"100%"}} key={element.id}>
                  <Text style={{fontSize: 14,padding: 5,flex:1}}>{element.producto.nombre}:</Text>
                  <Text style={{fontSize: 14,padding: 5, alignSelf:'flex-end'}}>{element.cantidad}</Text>
                  <Text style={{fontSize: 14,padding: 5, alignSelf:'flex-end'}}>(${element.precioTotal})</Text>
                </View>)
                })
            }
        </View>
        <View style={{  flexDirection: "row", width:"100%"}}>
            <Text style={{fontSize: 16,padding: 5,flex:1, fontWeight: "bold"}}>TOTAL:</Text>
            <Text style={{fontSize: 16,padding: 5, alignSelf:'flex-end', fontWeight: "bold"}}>${total}</Text>
        </View>
      </View>
    );
  };


 
  const actions = [
    {
      text: "Crear Pedido",
      icon: require("../res/ic_plus.png"),
      name: "bt_pedido",
      position: 1,
      color: "#013028",
      size: 150
    }
  ];

  return (
    <View style={{ flex: 1, padding: 5 }}>
      <FlatList
        data={data}
        keyExtractor={({ id }, index) => id}
        enableEmptySections={true}
        renderItem={ItemView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <FloatingAction
        overrideWithAction
        color="#013028"
        actions={actions}
        onPressItem={name => {
          navigation.navigate('PedidoForm')
        }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginTop: 10
  },
  listItem: {
    margin: 5,
    padding: 10,
    backgroundColor: "#FFF",
    width: "95%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "column",
    borderRadius: 20
  }
});