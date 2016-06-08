import { pick } from 'lodash';
import { fetch } from '../actions/message';
import { connect } from 'react-redux';
import MessageList from '../components/MessageList';

export default connect(
    (state) => pick(state, [
        'messages',
        'rooms',
        'typings',
    ]),
    (dispatch) => ({
        onFetchLog: (minId) => dispatch(fetch(minId)),
    })
)(MessageList);
