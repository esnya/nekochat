import { connect } from 'react-redux';
import { open } from '../actions/dialog';
import { drawer } from '../actions/ui';
import ChatAppBar from '../components/ChatAppBar';

export default connect(
    ({ room }) => ({
        room,
    }),
    (dispatch) => ({
        onEditRoom: () => dispatch(open('room-edit')),
        onOpenDrawer: () => dispatch(drawer(true)),
    })
)(ChatAppBar);
