import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React, { Component, PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';
import RoomEditForm from './RoomEditForm';

class RoomEditDialog extends Component {
    static get propTypes() {
        return {
            room: IPropTypes.map.isRequired,
            onClose: PropTypes.func.isRequired,
            onUpdateRoom: PropTypes.func.isRequired,
            open: PropTypes.bool,
        };
    }

    render() {
        const {
            open,
            room,
            onClose,
            onUpdateRoom,
        } = this.props;

        const handleUpdateRoom = (e) => {
            onUpdateRoom(e, this.form.data);
            onClose(e);
        };

        const actions = [
            <FlatButton
                primary
                key="update"
                label="Update"
                onTouchTap={handleUpdateRoom}
            />,
            <FlatButton
                secondary
                key="cancel"
                label="Cancel"
                onTouchTap={onClose}
            />,
        ];

        return (
            <Dialog
                autoScrollBodyContent
                actions={actions}
                open={open}
                title="Edit Room"
                onRequestClose={onClose}
            >
                <RoomEditForm
                    ref={(c) => (this.form = c)}
                    room={room}
                    onSubmit={handleUpdateRoom}
                />
            </Dialog>
        );
    }
}

export default pureRender(RoomEditDialog);
