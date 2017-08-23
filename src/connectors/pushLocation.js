import { connect } from 'react-redux';
import { push } from 'redux-router';

export default connect(
    () => ({}),
    dispatch => ({
        onPushLocation: path => dispatch(push(path)),
    }),
);
