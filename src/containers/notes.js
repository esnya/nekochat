import {connect} from 'react-redux';
import {open} from '../actions/DialogActions';
import {Notes as Component} from '../components/notes';

export const Notes = connect(
    (state) => ({notes: state.room && state.room.notes}),
    (dispatch) => ({onEdit: () => dispatch(open('notes'))})
)(Component);
