import { connect } from 'react-redux';
import { compose } from 'redux';
import { join } from '../actions/room';
import dialog from './dialog';
import pushLocation from './pushLocation';

export default compose(
    pushLocation,
    connect(() => ({}), (dispatch) => ({
        onJoinRoom: (room) => dispatch(join(room)),
    })),
    dialog('room-password')
);
