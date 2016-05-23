import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import React, { Component, PropTypes } from 'react';

export class RoomPasswordDialog extends Component {
    static get propTypes() {
        return {
            open: PropTypes.bool.isRequired,
            room_id: PropTypes.string,
            onJoin: PropTypes.func.isRequired,
            onLeave: PropTypes.func.isRequired,
        };
    }

    onJoin(e) {
        e.preventDefault();

        const {
            room_id,
            onJoin,
        } = this.props;

        onJoin(room_id, this.password.getValue() || null);
    }

    render() {
        const {
            open,
            onLeave,
        } = this.props;

        const actions = [
            <FlatButton
                primary
                key="join"
                label="Join"
                onTouchTap={(e) => this.onJoin(e)}
            />,
            <FlatButton
                secondary
                key="leave"
                label="Leave"
                onTouchTap={onLeave}
            />,
        ];

        return (
            <Dialog
                autoScrollBodyContent
                actions={actions}
                open={open}
                title="Password"
                onRequestClose={onLeave}
            >
                <form onSubmit={(e) => this.onJoin(e)}>
                    <TextField
                        fullWidth
                        ref={(c) => (this.password = c)}
                        type="password"
                    />
                </form>
            </Dialog>
        );
    }
}
