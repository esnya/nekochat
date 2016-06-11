import { pick } from 'lodash';
import { fetch } from '../actions/message';
import { connect } from 'react-redux';
import MessageList from '../components/MessageList';

export default connect(
    (state) => ({
        ...pick(state, [
            'messages',
            'rooms',
            'typings',
        ]),
        first_message: state.room.get('first_message'),
    }),
    (dispatch) => ({
        onFetchLog: (minId) => dispatch(fetch(minId)),
    })
)(MessageList);
