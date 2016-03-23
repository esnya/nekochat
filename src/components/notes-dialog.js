import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import React, {Component, PropTypes} from 'react';

export class NotesDialog extends Component {
    static get propTypes() {
        return {
            open: PropTypes.bool.isRequired,
            onClose: PropTypes.func.isRequired,
            onUpdate: PropTypes.func.isRequired,
            notes: PropTypes.string,
        };
    }

    handleUpdate() {
        const {
            onClose,
            onUpdate,
        } = this.props;

        onUpdate(this.notes.getValue() || null);
        onClose();
    }

    render() {
        const {
            notes,
            open,
            onClose,
        } = this.props;

        const actions = [
            <FlatButton
                primary
                key="update"
                label="Update"
                onTouchTap={() => this.handleUpdate()}
            />,
            <FlatButton
                secondary
                key="cancel"
                label="cancel"
                onTouchTap={onClose}
            />,
        ];

        return (
            <Dialog
                actions={actions}
                open={open}
                title="Notes"
                onRequestClose={onClose}
            >
                <TextField
                    fullWidth
                    multiLine
                    defaultValue={notes || ''}
                    name="notes"
                    ref={(c) => (this.notes = c)}
                />
            </Dialog>
        );
    }
}
