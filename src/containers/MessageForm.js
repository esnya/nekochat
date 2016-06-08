import { open } from '../actions/dialog';
import { create as createMessage, image } from '../actions/message';
import { update } from '../actions/typing';
import { create, remove } from '../actions/name';
import { connect } from 'react-redux';
import MessageForm from '../components/MessageForm';

export default connect(
    ({ characters, room }, { name }) => ({
        characters,
        name,
        state: room.get('state'),
    }),
    (dispatch) => ({
        onCreateName: (e, name) => dispatch(create(name)),
        onEditName: (e, name_id) => dispatch(open('name-edit', { name_id })),
        onRemoveName: (e, id) => dispatch(remove({ id })),
        onSendMessage: (e, message) => dispatch(createMessage(message)),
        onTyping: (e, name, message) => dispatch(update({ name, message })),
        onUploadImage: (e, name, file) => dispatch(image({
            character_url: name.character_url,
            icon_id: name.icon_id,
            name: name.name,
            file: {
                file,
                type: file.type,
                name: file.name,
            },
        })),
    })
)(MessageForm);
