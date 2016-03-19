import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import React, { Component, PropTypes } from 'react';

export class RoomUpdateDialog extends Component {
    static get propTypes() {
        return {
            open: PropTypes.bool.isRequired,
            room: PropTypes.shape({
                title: PropTypes.string.isRequired,
            }),
            onUpdate: PropTypes.func.isRequired,
            onClose: PropTypes.func.isRequired,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            passwordChanged: false,
        };
    }

    handleUpdate(e) {
        if (e) e.preventDefault();

        const {
            onClose,
            onUpdate,
        } = this.props;

        const room = {
            title: this.title.getValue() || null,
        };
        if (this.state.passwordChanged) {
            room.password = this.password.getValue() || null;
        }

        onUpdate(room);
        onClose();
    }

    render() {
        const {
            open,
            room,
            onClose,
        } = this.props;

        const Actions = [
            <FlatButton primary
                key="update"
                label="Update"
                onTouchTap={() => this.handleUpdate()}
            />,
            <FlatButton secondary
                key="cancel"
                label="Cancel"
                onTouchTap={onClose}
            />,
        ];

        return (
            <Dialog
                actions={Actions}
                open={open}
                title="Chat Room"
                onRequestClose={onClose}
            >
                <form onSubmit={(e) => this.handleUpdate(e)}>
                    <TextField fullWidth
                        defaultValue={room && room.title || ''}
                        floatingLabelText="Title"
                        name="title"
                        ref={(c) => c && (this.title = c)}
                    />
                    <TextField fullWidth
                        defaultValue={
                            (room && room.password) ? '12345678' : ''
                        }
                        floatingLabelText="Password"
                        name="password"
                        ref={(c) => c && (this.password = c)}
                        type="password"
                        onChange={() => this.setState({passwordChanged: true})}
                    />
                </form>
            </Dialog>
        );
    }
}
