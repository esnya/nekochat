import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-tower/lib/actions';
import { join } from '../actions/room';
import dialog from './dialog';

export default compose(
    connect(() => ({}), dispatch => ({
        onJoinRoom: room => dispatch(join(room)),
        onPushLocation: location => dispatch(push(location)),
    })),
    dialog('room-password'),
);
