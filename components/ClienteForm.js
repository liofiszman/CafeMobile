import React, { useRef, useState } from 'react';
import { Button, ScrollView, TextInput, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import { useNavigation, NavigationContainer } from '@react-navigation/native';

const ClienteSchema = Yup.object().shape({
  firstName: Yup.string().required('Nombre Requerido'),
  lastName: Yup.string().required('Apellido Requerido'),
  dni: Yup.string(),
  email: Yup.string().email('Email invalido').required('Email Requerido'),
  tel: Yup.string(),
  dir: Yup.string()
});

export default function ClienteForm() {

  const [isLoading, setLoading] = useState(false);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched
  } = useFormik({
    validationSchema: ClienteSchema,
    initialValues: {
      id: '',
      firstName: '',
      lastName: '',
      dni: '',
      email: '',
      tel: '',
      dir: ''
    },
    onSubmit: values => { postCliente(values); }
  })


  const postCliente = async (values) => {
    try {
      setLoading(true);
      const response = await fetch('https://cafe21.herokuapp.com/api/cliente', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: values.firstName,
          apellido: values.lastName,
          dni: values.dni,
          email: values.email,
          telefono: values.tel,
          direccion: values.dir
        })
      });
      const json = await response.json();
      showOKToast();
    } catch (error) {
      showErrorToast();
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const navigate = useNavigation();
  const showOKToast = () => {
    // Add a Toast on screen.
    let toast = Toast.show('Cliente Guardado', {
      duration: Toast.durations.LONG,
    });
    setTimeout(function hideToast() {
      Toast.hide(toast);

      navigate.goBack();
    }, 500);
  };

  const showErrorToast = () => {
    // Add a Toast on screen.
    let toast = Toast.show('Error inesperado', {
      duration: Toast.durations.LONG,
    });
    setTimeout(function hideToast() {
      Toast.hide(toast);
    }, 500);
  };


  const refFirstName = useRef(null);
  const reflastName = useRef(null);
  const refDni = useRef(null);
  const refemail = useRef(null);
  const refTel = useRef(null);
  const refDir = useRef(null);

  return (
    <RootSiblingParent>
      <ScrollView >
        {isLoading ? <ActivityIndicator justifyContent="center" size="large" color="#013028" /> : (
          <View style={styles.container} >
            <View style={styles.textView}>
              <TextInput style={styles.input}
                placeholder='Nombre'
                autoCapitalize='none'
                keyboardType='default'
                returnKeyType='next'
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                error={errors.firstName}
                touched={touched.firstName}
                ref={refFirstName}
                onSubmitEditing={() => reflastName.current?.focus()}
              />
            </View>
            {errors.firstName &&
              <Text style={{ fontSize: 12, color: 'red' }}>{errors.firstName}</Text>
            }
            <View style={styles.textView}>
              <TextInput style={styles.input}
                placeholder='Apellido'
                autoCapitalize='none'
                keyboardType='default'
                returnKeyType='next'
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                error={errors.lastName}
                touched={touched.lastName}
                ref={reflastName}
                onSubmitEditing={() => refDni.current?.focus()}
              />
            </View>
            {errors.lastName &&
              <Text style={{ fontSize: 12, color: 'red' }}>{errors.lastName}</Text>
            }
            <View style={styles.textView}>
              <TextInput style={styles.input}
                placeholder='DNI'
                autoCapitalize='none'
                keyboardType='default'
                returnKeyType='next'
                onChangeText={handleChange('dni')}
                onBlur={handleBlur('dni')}
                touched={touched.dni}
                ref={refDni}
                onSubmitEditing={() => refemail.current?.focus()}
              />
            </View>
            {errors.dni &&
              <Text style={{ fontSize: 12, color: 'red' }}>{errors.dni}</Text>
            }
            <View style={styles.textView}>
              <TextInput style={styles.input}
                placeholder='Email'
                autoCapitalize='none'
                autoCompleteType='email'
                keyboardType='email-address'
                returnKeyType='next'
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                ref={refemail}
                onSubmitEditing={() => refTel.current?.focus()}
              />
            </View>
            {errors.email &&
              <Text style={{ fontSize: 12, color: 'red' }}>{errors.email}</Text>
            }
            <View style={styles.textView}>
              <TextInput style={styles.input}
                placeholder='Telefono'
                autoCapitalize='none'
                keyboardType='phone-pad'
                returnKeyType='next'
                onChangeText={handleChange('tel')}
                onBlur={handleBlur('tel')}
                error={errors.tel}
                touched={touched.tel}
                ref={refTel}
                onSubmitEditing={() => refDir.current?.focus()}
              />
            </View>
            <View style={styles.textView}>
              <TextInput style={styles.input}
                placeholder='Dirección'
                autoCapitalize='none'
                keyboardType='default'
                returnKeyType='go'
                onChangeText={handleChange('dir')}
                onBlur={handleBlur('dir')}
                error={errors.dir}
                touched={touched.dir}
                ref={refDir}
                onSubmitEditing={() => handleSubmit()}
              />
            </View>
            <View style={styles.textView}>
              <Button title='Guardar Cliente' color="#013028" onPress={handleSubmit} style={styles.button} />
            </View>
          </View>
        )}
      </ScrollView>
    </RootSiblingParent>
  );

}


const styles = StyleSheet.create({
  textView: {
    paddingHorizontal: 0, marginTop: 16, width: '100%'
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
    paddingTop: 10,
    borderRadius: 4,
  },
});