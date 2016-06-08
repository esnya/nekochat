import { focus, blur } from '../actions/dom';
import store from './store';

window.addEventListener('focus', () => store.dispatch(focus()));
window.addEventListener('blur', () => store.dispatch(blur()));
