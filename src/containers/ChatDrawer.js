import { connect } from 'react-redux';
import { set } from '../actions/route';
import { drawer } from '../actions/ui';
import ChatDrawer from '../components/ChatDrawer';

export default connect(
    ({ ui, room }) => ({
        open: ui.get('drawer'),
        room,
    }),
    (dispatch) => ({
        onRequestChange: (state) => dispatch(drawer(state)),
        onRoute: (e, path) => dispatch(set(path, e)),
    })
)(ChatDrawer);
