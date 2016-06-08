import { connect } from 'react-redux';
import Router from '../components/Router';

export default connect(({ route }) => ({ route }))(Router);
