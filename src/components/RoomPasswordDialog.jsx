import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import connect from '../connectors/roomPasswordDialog';
import { singleState, pureRender } from '../utility/enhancer';

const RoomPasswordDialog = (props) => {
    const {
        open,
        password,
        dialog,
        onChange,
        onClose,
        onJoinRoom,
        onPushLocation,
    } = props;

    const handleJoinRoom = (e) => {
        onClose(e);
        onJoinRoom({ id: dialog.get('room').id, password });
    };
    const handleCancel = (e) => {
        onClose(e);
        onPushLocation('/');
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
                value={password || ''}
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
    password: PropTypes.string,
    dialog: IPropTypes.contains({
        room: PropTypes.shape({
            id: PropTypes.string.isRequired,
        }).isRequired,
    }),
};
export default connect(singleState('password')(pureRender(RoomPasswordDialog)));
