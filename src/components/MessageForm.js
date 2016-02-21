import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import TextField from 'material-ui/lib/text-field';
import React, { Component, PropTypes } from 'react';
import { makeColor } from '../utility/color';
import { MessageIcon } from '../containers/MessageIconContainer';

export const FROM_HEIGHT = 72;

export class MessageForm extends Component {
    static get propTypes() {
        return {
            character_url: PropTypes.string,
            icon_id: PropTypes.string,
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]).isRequired,
            is_first: PropTypes.bool,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired,
            name: PropTypes.string,
            whisper_to: PropTypes.string,
            createMessage: PropTypes.func.isRequired,
            beginInput: PropTypes.func.isRequired,
            endInput: PropTypes.func.isRequired,
            createForm: PropTypes.func.isRequired,
            removeForm: PropTypes.func.isRequired,
            openDialog: PropTypes.func.isRequired,
        };
    }

    componentWillUpdate(nextProps) {
        const prev = this.props.whisper_to;
        const next = nextProps.whisper_to;
        if (!next || prev === next) return;

        const messageField = this.message;
        if (!messageField) return;
        if (!messageField.getValue().match(/^(@[^ ]+ ?)?$/)) return;

        this.message.setValue(`@${next} `);
    }

    parseMessage(message) {
        const whisper = message.match(/^@([^ ]+) /);
        const whisper_to = whisper && whisper[1] || null;

        if (whisper && whisper_to.length + 2 === message.length) return null;

        return {
            whisper_to,
            message,
        };
    }

    onSubmit(e) {
        e.preventDefault();

        const messageField = this.message;
        const message = this.parseMessage(messageField.getValue());

        if (message) {
            const {
                name,
                character_url,
                icon_id,
            } = this.props;

            this.props.createMessage({
                name,
                character_url,
                icon_id,
                ...message,
            });

            messageField.setValue(
                message.whisper_to
                    ? `@${message.whisper_to} `
                    : ''
            );

            this.props.endInput();
        }
    }

    onKey(e) {
        const VK_RETURN = 13;

        if (e.keyCode === VK_RETURN && !e.shiftKey) {
            this.onSubmit(e);
        }
    }

    startInputWatcher() {
        if (this.inputWatcher) return;

        this.composition = false;
        this.prevMessage = '';
        this.inputWatcher = setInterval(() => this.watchInput(), 1000);
        this.watchInput();
    }

    stopInputWatcher() {
        if (!this.inputWatcher) return;

        clearInterval(this.inputWatcher);
        this.inputWatcher = null;
    }

    watchInput() {
        if (this.composition || !this.message) return;

        const message = this.message.getValue();

        if (message !== this.prevMessage) {
            const {
                beginInput,
                endInput,
            } = this.props;

            if (message && message.charAt(0) !== '@') {
                beginInput({
                    name: this.props.name,
                    message,
                });
            } else {
                endInput();
            }
        }

        this.prevMessage = message;
    }

    render() {
        const {
            id,
            is_first,
            name,
            character_url,
            icon_id,
            user,
            createForm,
            removeForm,
            openDialog,
        } = this.props;

        const Styles = {
            Form: {
                flex: '0 0 72px',
                display: 'flex',
                alignItems: 'center',
            },
            Icon: {
                flex: '0 0 60px',
                height: 60,
                margin: '0 8px',
                padding: 0,
            },
            Message: {
                flex: '1 1 auto',
            },
        };

        return (
            <form style={Styles.Form} onSubmit={(e) => this.onSubmit(e)}>
                {is_first
                    ? <IconButton onTouchTap={() => createForm()}>
                        <FontIcon className="material-icons">
                            add
                        </FontIcon>
                    </IconButton>
                    : <IconButton onTouchTap={() => removeForm(id)}>
                        <FontIcon className="material-icons">
                            remove
                        </FontIcon>
                    </IconButton>
                }
                <IconButton
                    style={Styles.Icon}
                    onTouchTap={() => openDialog('message-config', id)}
                >
                    <MessageIcon
                        character_url={character_url}
                        color={makeColor(`${name}${user.id}`)}
                        id={icon_id}
                        name={name}
                    />
                </IconButton>
                <TextField fullWidth multiLine
                    floatingLabelText={name}
                    ref={(c) => c && (this.message = c)}
                    rows={1}
                    style={Styles.Message}
                    onBlur={() => this.stopInputWatcher()}
                    onCompositionEnd={() => (this.composition = false)}
                    onCompositionStart={() => (this.composition = true)}
                    onCompositionUpdate={() => (this.composition = true)}
                    onFocus={() => this.startInputWatcher()}
                    onKeyDown={(e) => this.onKey(e)}
                />
                <IconButton type="submit">
                    <FontIcon className="material-icons">send</FontIcon>
                </IconButton>
            </form>
        );
    }
}