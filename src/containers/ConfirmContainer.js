import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ok, cancel } from '../actions/dialog';
import { Confirm } from '../components/Confirm';

export const ConfirmContainer = connect(
    ({ confirmList }) => ({ confirmList }),
    (dispatch) => bindActionCreators({ ok, cancel }, dispatch)
)(Confirm);
