import { connect } from 'react-redux';
import { drawer } from '../actions/ui';

export default connect(
    ({ ui, room }) => ({
        open: ui.get('drawer'),
        room,
    }),
    (dispatch) => ({
        onRequestChange: (state) => dispatch(drawer(state)),
    })
);
