import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import React, { Component, PropTypes } from 'react';

export class RoomCreateDialog extends Component {
    static get propTypes() {
        return {
            create: PropTypes.func.isRequired,
            close: PropTypes.func.isRequired,
            open: PropTypes.bool.isRequired,
        };
    }

    onCreateRoom(e) {
        if (e) e.preventDefault();

        const title = this.title.getValue();
        const password = this.password.getValue() || null;

        if (title) {
            const {
                create,
                close,
            } = this.props;

            create({
                title,
                password,
            });
            close();
            this.title.clearValue();
        }
    }

    render() {
        const {
            open,
            close,
        } = this.props;

        const Actions = [
            <FlatButton primary
                key="create"
                label="Create"
                onTouchTap={() => this.onCreateRoom()}
            />,
            <FlatButton secondary
                key="cancel"
                label="Cancel"
                onTouchTap={close}
            />,
        ];

        return (
            <Dialog
                actions={Actions}
                open={open}
                title="Create Chat Room"
                onRequestClose={close}
            >
                <form onSubmit={(e) => this.onCreateRoom(e)}>
                    <TextField fullWidth
                        floatingLabelText="Title"
                        name="title"
                        ref={(c) => c && (this.title = c)}
                    />
                    <TextField fullWidth
                        floatingLabelText="Password"
                        name="password"
                        ref={(c) => c && (this.password = c)}
                        type="password"
                    />
                </form>
            </Dialog>
        );
    }
}
