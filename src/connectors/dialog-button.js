import { connect } from 'react-redux';
import { open } from '../actions/dialog';

/**
 * Connenctor for a button to open a dialig
 * @param{string} type - Dialog type Dialog
 * @param{object} options - Optons for connect
 * @returns{function} connector
 */
export default (type, options) => connect(() => ({}), dispatch => ({
    onOpenDialog: data => dispatch(open(type, data)),
}), options);
