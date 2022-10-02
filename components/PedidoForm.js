import React, { useRef, useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, ActivityIndicator, Pressable, FlatList } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import NumericInput from 'react-native-numeric-input'

import Moment from 'moment';
import 'moment/locale/es';
import { createIconSetFromFontello } from 'react-native-vector-icons';



export default PedidoForm = ({ navigation }) => {



  const [isLoading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState("");
  const [productos, setProductos] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [total, setTotal] = useState(0.0);

  const postPedido = async (values) => {
    try {
      setLoading(true);
      var postBody = JSON.stringify({
        cliente_id: selectedCliente.toString(),
        fecha_hora: Moment(date).format('YYYY-MM-DD HH:mm:ss'),
        entregado: "true",
        pedidoProductos: selectedProductos
      });

      console.log(postBody);

      const response = await fetch('https://cafe21.herokuapp.com/api/pedido', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: postBody
      });
      const json = await response.text;
      if (response.status == 200) {
        showOKToast();
      } else {

        showErrorToast();
      }
      console.log(json);

    } catch (error) {
      showErrorToast();
      console.error(error);
    } finally {
      setLoading(false);
    }
  }


  const getClientes = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://cafe21.herokuapp.com/api/cliente');
      const json = await response.json();
      setClientes(json);
      setSelectedCliente(json[0].id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  })

  const getProductos = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://cafe21.herokuapp.com/api/producto');
      const json = await response.json();
      setProductos(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  })

  const navigate = useNavigation();
  const showOKToast = () => {
    // Add a Toast on screen.
    let toast = Toast.show('Cliente Guardado', {
      duration: Toast.durations.LONG,
    });
    setTimeout(function hideToast() {
      Toast.hide(toast);

      navigate.goBack();
    }, 1000);
  };

  const showErrorToast = () => {
    // Add a Toast on screen.
    let toast = Toast.show('Error inesperado', {
      duration: Toast.durations.LONG,
    });
    setTimeout(function hideToast() {
      Toast.hide(toast);
    }, 1000);
  };


  useEffect(() => {
    Moment.locale('es');
    getClientes();
    getProductos();
  }, []);


  const refFecha = useRef(null);
  const refCliente = useRef(null);


  const renderClientList = () => {
    return clientes.map((client) => {
      return <Picker.Item key={client.id} label={client.nombre + ' ' + client.apellido} value={client.id} />
    })
  }



  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const ItemProductView = ({ item }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
          >
            {item.nombre + " ($" + item.precio + ")"}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <NumericInput
            rounded
            totalHeight={30}
            totalWidth={100}
            minValue={0}
            maxValue={20}
            iconStyle={{ color: 'white' }}
            rightButtonBackgroundColor='#013028'
            leftButtonBackgroundColor='#013028'

            onChange={value => setProductosChoosed(item, value)} />
        </View>
      </View>
    );
  };

  const setProductosChoosed = (item, value) => {

    var found = false;
    var index = 0;
    var sps = selectedProductos

    console.log("SIZE:" + sps.length);
    while (!found && index < sps.length) {
      console.log("ITEM:" + sps[index].id);
      if (item.id.toString() == sps[index].id) {

        if (value == 0)
          sps.splice(index, 1);
        else {
          const sp = sps[index];
          sp.cantidad = value.toString();
          selectedProductos[index] = sp
        }
        found = true;

      } else
        index++;
    }

    if (!found) {
      const sp = {
        id: item.id.toString(),
        cantidad: value.toString()
      };
      sps.push(sp);
    }
    setSelectedProductos(sps);

    setTotal(0.0);
    var t = 0.0;
    index = 0;
    while (index < sps.length) {
        t = t + (sps[index].cantidad * item.precio);
        index++;
    }

    setTotal(t);
    console.log(selectedProductos);
  }


  const ItemProductDivider = () => {
    return (
      <View
        style={{
          height: 1, width: '100%', borderRadius: 1, borderWidth: 1, borderColor: '#013028', borderStyle: 'dashed', zIndex: 0,
        }}
      />
    );
  }

  return (
    <RootSiblingParent>
      {isLoading ? <ActivityIndicator justifyContent="center" size="large" color="#013028" /> : (
        <View style={styles.container} >
          <Text style={styles.textView}>Cliente</Text>
          <View style={styles.picker}>
            <Picker
              placeholder='Seleccione un Cliente'
              selectedValue={selectedCliente}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCliente(itemValue);
                console.log(itemValue);
              }}
            >
              {renderClientList()}

            </Picker>
          </View>
          <Text style={styles.textView}>Fecha</Text>
          <Pressable onPress={showDatepicker} style={styles.input}>
            <Text>{Moment(date).format('DD/MM/YY')}</Text>
          </Pressable>
          <Text style={styles.textView}>Hora</Text>
          <Pressable onPress={showTimepicker} style={styles.input}>
            <Text>{Moment(date).format('HH:mm') + "Hs"}</Text>
          </Pressable>
          <Text style={styles.textView}>Productos</Text>
          <FlatList style={styles.input}

            data={productos}
            keyExtractor={({ id }, index) => id}
            enableEmptySections={true}
            renderItem={ItemProductView}
            ItemSeparatorComponent={ItemProductDivider}
          />
          <Text style={styles.textViewTotal}>Total:  ${total}</Text>
          <View style={styles.textView}>
            <Button title='Guardar Pedido' color="#013028" onPress={postPedido} style={styles.button} />
          </View>
        </View>
      )}
    </RootSiblingParent>
  );

}


const styles = StyleSheet.create({
  picker: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 40,
    marginHorizontal: 15,
    marginTop: 5,
    padding: 0,
    borderRadius: 4,
    alignContent: 'center'
  },
  textView: {
    paddingHorizontal: 15, marginTop: 10, width: '100%'
  },
  textViewTotal: {
    paddingHorizontal: 15, marginTop: 10, width: '100%',
    fontSize: 20, fontWeight: 'bold'
  },
  button: {
    paddingTop: 40,
    marginTop: 40,
    height: 40,
    backgroundColor: '#013028',
    borderRadius: 4,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 40,
    marginHorizontal: 15,
    marginTop: 5,
    padding: 10,
    borderRadius: 4,
  },

  listItem: {
    margin: 5,
    padding: 10,
    width: "100%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
  }
});