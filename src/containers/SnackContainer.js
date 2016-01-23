import { connect } from 'react-redux';
import { remove } from '../actions/SnackActions';
import { Snack } from '../components/Snack';
import { bindState, bindActions } from './utility';

export const SnackContainer = connect(
    bindState('snackList'),
    bindActions({remove})
)(Snack);