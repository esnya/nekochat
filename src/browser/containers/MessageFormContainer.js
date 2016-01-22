import { connect } from 'react-redux';
import { create as createIcon, remove as removeIcon, fetch as fetchIcon } from '../../actions/IconActions';
import { create as createMessage } from '../../actions/MessageActions';
import { create as createForm, update as updateForm, remove as removeForm } from '../../actions/MessageFormActions';
import { MessageForm } from '../components/MessageForm';

export const MessageFormContainer = connect(
    state => ({
        user: state.user,
        iconList: state.iconList,
    }),
    dispatch => ({
        createIcon: icon => dispatch(createIcon(icon)),
        removeIcon: id => dispatch(removeIcon(id)),
        fetchIcon: () => dispatch(fetchIcon()),
        createForm: () => dispatch(createForm()),
        updateForm: form => dispatch(updateForm(form)),
        removeForm: form => dispatch(removeForm(form)),
        createMessage: message => dispatch(createMessage(message)),
    })
)(MessageForm);