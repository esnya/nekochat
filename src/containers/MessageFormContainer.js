import { connect } from 'react-redux';
import {
    create as createIcon,
    remove as removeIcon,
    fetch as fetchIcon,
} from '../actions/IconActions';
import {
    begin as beginInput,
    end as endInput,
} from '../actions/InputActions';
import { create as createMessage } from '../actions/MessageActions';
import {
    create as createForm,
    update as updateForm,
    remove as removeForm,
} from '../actions/MessageFormActions';
import { create as createSnack } from '../actions/SnackActions';
import { MessageForm } from '../components/MessageForm';
import { bindActions } from './utility';

export const MessageFormContainer = connect(
    (state) => ({
        user: state.user,
        iconList: state.iconList,
    }),
    bindActions({
        createIcon,
        removeIcon,
        fetchIcon,
        createForm,
        updateForm,
        removeForm,
        createMessage,
        beginInput,
        endInput,
        createSnack,
    })
)(MessageForm);