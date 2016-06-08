import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React, { Component, PropTypes } from 'react';
import RoomEditForm from './RoomEditForm';

export default class RoomCreateDialog extends Component {
    static get propTypes() {
        return {
            open: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired,
            onCreateRoom: PropTypes.func.isRequired,
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.open !== this.props.open;
    }

    render() {
        const {
            open,
            onClose,
            onCreateRoom,
        } = this.props;

        const handleCreateRoom = (e) => {
            onCreateRoom(e, this.form.data);
            onClose(e);
        };

        const Actions = [
            <FlatButton primary
                key="create"
                label="Create"
                onTouchTap={handleCreateRoom}
            />,
            <FlatButton secondary
                key="cancel"
                label="Cancel"
                onTouchTap={onClose}
            />,
        ];

        return (
            <Dialog
                autoScrollBodyContent
                actions={Actions}
                open={open}
                title="Create Room"
                onRequestClose={onClose}
            >
                <RoomEditForm
                    ref={(c) => (this.form = c)}
                    onSubmit={handleCreateRoom}
                />
            </Dialog>
        );
    }
}
