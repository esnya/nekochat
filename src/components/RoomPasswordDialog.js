import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
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
                id="button-password-join"
                key="join"
                label="Join"
                onTouchTap={(e) => this.onJoin(e)}
            />,
            <FlatButton
                secondary
                id="button-password-cancel"
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
                        name="password"
                        ref={(c) => (this.password = c)}
                        type="password"
                    />
                </form>
            </Dialog>
        );
    }
}
