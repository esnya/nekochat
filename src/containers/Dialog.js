import { connect } from 'react-redux';
import { ok, cancel, close } from '../actions/dialog';
import Dialog from '../components/Dialog';

export default connect(
    ({ dialogs }) => ({
        dialogs,
    }),
    (dispatch) => ({
        onOK: (e, id) => dispatch(ok(id)),
        onCalcel: (e, id) => dispatch(cancel(id)),
        onClose: (e, id) => dispatch(close(id)),
    })
)(Dialog);
