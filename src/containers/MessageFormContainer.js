import { connect } from 'react-redux';
import {
    open as openDialog,
} from '../actions/DialogActions';
import {
    begin as beginInput,
    end as endInput,
} from '../actions/InputActions';
import {create as createMessage} from '../actions/MessageActions';
import {
    create as createForm,
    remove as removeForm,
    appendFile,
} from '../actions/MessageFormActions';
import {MessageForm} from '../components/MessageForm';
import {bindActions} from './utility';
import {readAsBlob} from '../browser/file';

export const MessageFormContainer = connect(
    (state) => ({
        user: state.user,
        iconList: state.iconList,
        hideConfig: state.confirmList && state.confirmList.length > 0,
    }),
    (dispatch) => ({
        ...bindActions({
            createForm,
            removeForm,
            createMessage,
            beginInput,
            endInput,
            openDialog,
        })(dispatch),
        onAppendFile: (id, file) => readAsBlob(file)
            .then((blob) => dispatch(appendFile(id, file.name, blob))),
    })
)(MessageForm);
