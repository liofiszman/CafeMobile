/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import PedidosView from './components/PedidosView';
import ClienteView from './components/ClienteView';
import ClienteForm from './components/ClienteForm';
import PedidoForm from './components/PedidoForm';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
