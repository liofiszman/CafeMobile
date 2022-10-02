import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, RefreshControl, StyleSheet} from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { useNavigation, NavigationContainer,useFocusEffect } from '@react-navigation/native';

export default ClienteView = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);

  

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch('https://cafe21.herokuapp.com/api/cliente');
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
    return (
      <View style={styles.listItem}>
        <View style={{alignItems:"center",flex:1}}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold"
          }}>
          {item.nombre} {item.apellido}
        </Text>
      </View>
      <View style={{flex:2}}>
        <Text
          style={{
            fontSize: 14,
            padding: 1
          }}>
          DNI: {item.dni}
        </Text>
      </View>
      <View style={{flex:3}}>
        <Text
          style={{
            fontSize: 14,
            padding: 1,
          }}>
          Email: {item.email}
        </Text>
        <Text
          style={{
            fontSize: 14,
            padding: 1,
          }}>
          Telefono: {item.telefono}
        </Text>
      </View>
      <View style={{flex:4}}>
        <Text
          style={{
            fontSize: 14,
            padding: 1
          }}>
          Direccion: {item.direccion}
        </Text>
        </View>
      </View>
    );
  };



  const actions = [
    {
      text: "Agregar Cliente",
      icon: require("../res/ic_plus.png"),
      name: "bt_Cliene",
      position: 1,
      color: "#013028",
      size: 150
    }
  ];

  return (
    <View style={styles.container}>
      <FlatList
        style={{flex:1}}
        data={data}
        keyExtractor={({ id }, index) => id}
        enableEmptySections={true}
        renderItem={ItemView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <FloatingAction
        size={150}
        color="#013028"
        actions={actions}
        overrideWithAction
        onPressItem={name => {
          navigation.navigate('ClienteForm')

        }}
      />
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginTop:10
  },
  listItem:{
    margin:5,
    padding:10,
    backgroundColor:"#FFF",
    width:"95%",
    flex:1,
    alignSelf:"center",
    flexDirection:"column",
    borderRadius:20
  }
});