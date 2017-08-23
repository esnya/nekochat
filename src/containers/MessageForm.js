/* eslint camelcase: "off" */

import { pick } from 'lodash';
import { connect } from 'react-redux';
import { open } from '../actions/dialog';
import * as Message from '../actions/message';
import { update } from '../actions/typing';
import { create, remove } from '../actions/name';
import MessageForm from '../components/MessageForm';

export default connect(
    ({ characters, room }, { name }) => ({
        characters,
        name,
        state: room.get('state'),
    }),
    dispatch => ({
        onCreateName: (e, name) => dispatch(create(name)),
        onEditName: (e, name_id) => dispatch(open('name-edit', { name_id })),
        onRemoveName: (e, id) => dispatch(remove({ id })),
        onSendMessage: (e, message) => dispatch(Message.create(message)),
        onTyping: (e, name, message) => dispatch(update({ name, message })),
        onUploadFile: (e, name, file) => dispatch(Message.create({
            ...pick(name, [
                'name',
                'character_url',
            ]),
            message: null,
            file,
        })),
    }),
)(MessageForm);
