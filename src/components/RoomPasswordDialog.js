import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import React, { PropTypes } from 'react';
import { singleState, pureRender } from '../utility/enhancer';

const RoomPasswordDialog = (props) => {
    const {
        open,
        password,
        room,
        onChange,
        onClose,
        onJoinRoom,
        onSetRoute,
    } = props;

    const handleCancel = (e) => {
        onSetRoute(e, '/');
        onClose(e);
    };

    const handleJoinRoom = (e) => {
        onJoinRoom(e, { id: room.id, password });
        onClose(e);
    };

    const actions = [
        <FlatButton
            primary
            key="join"
            label="Join"
            onTouchTap={handleJoinRoom}
        />,
        <FlatButton
            secondary
            key="cancel"
            label="Cancel"
            onTouchTap={handleCancel}
        />,
    ];

    return (
        <Dialog
            autoScrollBodyContent
            actions={actions}
            open={open}
            title="Join Room"
            onRequestClose={handleCancel}
        >
            <TextField
                fullWidth
                floatingLabelText="Password"
                name="password"
                type="password"
                value={password}
                onChange={onChange}
            />
        </Dialog>
    );
};
RoomPasswordDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onJoinRoom: PropTypes.func.isRequired,
    onSetRoute: PropTypes.func.isRequired,
    password: PropTypes.string,
    room: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }),
};
export default singleState(pureRender(RoomPasswordDialog), 'password');
