import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import React, { Component, PropTypes } from 'react';

const VK_RETURN = 13;

export class RoomCreateDialog extends Component {
    static get propTypes() {
        return {
            create: PropTypes.func.isRequired,
            close: PropTypes.func.isRequired,
            open: PropTypes.bool.isRequired,
        };
    }

    onCreateRoom() {
        const title = this.title.getValue();

        if (title) {
            const {
                create,
                close,
            } = this.props;

            create({title});
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
                title="Create Room"
                onRequestClose={close}
            >
                <TextField fullWidth
                    floatingLabelText="Create Chat Room"
                    hintText="Input the title of new room"
                    ref={(c) => c && (this.title = c)}
                    onKeyDown={(e) =>
                        e.keyCode === VK_RETURN && this.onCreateRoom()
                    }
                />
            </Dialog>
        );
    }
}