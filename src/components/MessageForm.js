import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Add from 'material-ui/svg-icons/content/add';
import Remove from 'material-ui/svg-icons/content/remove';
import Send from 'material-ui/svg-icons/content/send';
import React, { Component, PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import MessageIcon from '../containers/MessageIcon';
import { pureRender } from '../utility/enhancer';
import { nameColor } from '../utility/color';
import FileUploadButton from './FileUploadButton';
import MessageFormInput from './MessageFormInput';

const Style = {
    Form: {
        display: 'flex',
        alignItems: 'center',
    },
    Icon: {
        flex: '0 0 auto',
        height: 60,
        width: 60,
        minWidth: 60,
        margin: '0 12px',
    },
};

class MessageForm extends Component {
    static get propTypes() {
        return {
            characters: IPropTypes.map.isRequired,
            name: IPropTypes.contains({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                icon_id: PropTypes.stirng,
                character_url: PropTypes.string,
            }).isRequired,
            onCreateName: PropTypes.func.isRequired,
            onEditName: PropTypes.func.isRequired,
            onRemoveName: PropTypes.func.isRequired,
            onSendMessage: PropTypes.func.isRequired,
            onTyping: PropTypes.func.isRequired,
            onUploadImage: PropTypes.func.isRequired,
            state: PropTypes.string,
        };
    }

    render() {
        const {
            name,
            state,
            onCreateName,
            onEditName,
            onRemoveName,
            onSendMessage,
            onTyping,
            onUploadImage,
        } = this.props;

        const parseMessage = () => {
            const value = this.input.value || null;
            if (!value) return null;

            const match = value.match(/^(@([^ ]+) )?((.|\r|\n)*?)$/);
            if (!match) return null;

            const whisper_to = match[2] || null;
            const message = match[3] || null;

            return { whisper_to, message };
        };

        const onSubmit = (e) => {
            e.preventDefault();

            const { whisper_to, message } = parseMessage();
            if (!message) return;

            onTyping(e, null);
            onSendMessage(e, {
                name: name.get('name'),
                character_url: name.get('character_url'),
                icon_id: name.get('icon_id'),
                message,
                whisper_to,
            });

            this.input.clear();
        };

        const onChange = (e, value) => {
            if (value && value.charAt(0) !== '@') {
                onTyping(e, name.get('name'), value);
            }
        };

        const color = nameColor(name.get('name'));

        return (
            <form
                style={Style.Form}
                onSubmit={(e) => onSubmit(e)}
            >
                <IconButton onTouchTap={(e) => onCreateName(e, name.toJS())}>
                    <Add />
                </IconButton>
                <IconButton
                    onTouchTap={(e) => onRemoveName(e, name.get('id'))}
                >
                    <Remove />
                </IconButton>
                <FlatButton
                    style={Style.Icon}
                    onTouchTap={(e) => onEditName(e, name.get('id'))}
                >
                    <MessageIcon
                        character_url={name.get('character_url')}
                        color={color}
                        id={name.get('icon_id')}
                        name={name.get('name')}
                    />
                </FlatButton>
                <MessageFormInput
                    name={name.get('name')}
                    ref={(c) => (this.input = c)}
                    state={state}
                    onChange={onChange}
                    onSubmit={onSubmit}
                />
                <IconButton type="submit">
                    <Send />
                </IconButton>
                <FileUploadButton
                    accept="image/*"
                    name="image"
                    tooltip="Post Image File"
                    onChange={
                        (e, files) => {
                            if (files[0]) {
                                onUploadImage(e, name.toJS(), files[0]);
                                e.target.value = '';
                            }
                        }
                    }
                />
            </form>
        );
    }
}

export default pureRender(MessageForm);
