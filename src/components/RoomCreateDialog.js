import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import React, { Component } from 'react';

const VK_RETURN = 13;

export class RoomCreateDialog extends Component {
    onCreateRoom() {
        const title = this.refs.title.getValue();

        if (title) {
            const {
                create,
                close,
            } = this.props;

            create({title});
            close();
            this.refs.title.clearValue();
        }
    }

    render() {
        const {
            open,
            close,
        } = this.props;

        const Actions = [
            <FlatButton
                primary={true}
                label="Create"
                onTouchTap={() => this.onCreateRoom()} />,
            <FlatButton
                secondary={true}
                label="Cancel"
                onTouchTap={close} />,
        ];

        return (
            <Dialog
                actions={Actions}
                open={open}
                title="Create Room"
                onRequestClose={close}
            >
                    <TextField
                        ref="title"
                        floatingLabelText="Create Chat Room"
                        fullWidth={true}
                        hintText="Input the title of new room"
                        onKeyDown={(e) =>
                            e.keyCode === VK_RETURN &&
                                this.onCreateRoom()
                        }/>
            </Dialog>
        );
    }
}