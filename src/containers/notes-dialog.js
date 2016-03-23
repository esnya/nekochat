import {connect} from 'react-redux';
import {getDialog, close} from '../actions/DialogActions';
import {notesUpdate} from '../actions/RoomActions';
import {NotesDialog as Component} from '../components/notes-dialog';

export const NotesDialog = connect(
    (state) => {
        const {
            room,
        } = state;

        const dialog = getDialog(state, 'notes');

        return {
            notes: room && room.notes,
            open: Boolean(dialog),
        };
    },
    (dispatch) => ({
        onUpdate: (notes) => dispatch(notesUpdate(notes)),
        onClose: () => dispatch(close('notes')),
    })
)(Component);
