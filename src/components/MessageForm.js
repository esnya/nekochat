import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import TextField from 'material-ui/lib/text-field';
import React, { Component } from 'react';
import { makeColor } from '../utility/color';
import { MessageIcon } from '../containers/MessageIconContainer';

export const FROM_HEIGHT = 72;

export class MessageForm extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUpdate(nextProps) {
        const prev = this.props.whisper_to;
        const next = nextProps.whisper_to;
        if (prev === next) return;

        const messageField = this.refs.message;
        if (!messageField) return;
        if (!messageField.getValue().match(/^(@[^ ]+ ?)?$/)) return;

        this.refs.message.setValue(`@${next} `);
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

        const messageField = this.refs.message;
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

    onUpdateForm(form) {
        this.closeConfigDialog();
        this.props.updateForm(form);
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

        clearTimeout(this.inputWatcher);
        this.inputWatcher = null;
    }

    watchInput() {
        if (this.composition) return;

        const message = this.refs.message.getValue();

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
            character_data,
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
                {is_first ? (
                        <IconButton onTouchTap={() => createForm()}>
                            <FontIcon className="material-icons">
                                add
                            </FontIcon>
                        </IconButton>
                    ) : (
                        <IconButton onTouchTap={() => removeForm(id)}>
                            <FontIcon className="material-icons">
                                remove
                            </FontIcon>
                        </IconButton>
                    )
                }
                <IconButton
                    style={Styles.Icon}
                    onTouchTap={() => openDialog('message-config', id)}>
                    <MessageIcon
                        id={icon_id}
                        character_data={character_data}
                        character_url={character_url}
                        color={makeColor(`${name}${user.id}`)}
                        name={name} />
                </IconButton>
                <TextField
                    ref="message"
                    floatingLabelText={name}
                    fullWidth={true}
                    multiLine={true}
                    rows={1}
                    style={Styles.Message}
                    onKeyDown={(e) => this.onKey(e)}
                    onFocus={() => this.startInputWatcher()}
                    onBlur={() => this.stopInputWatcher()}
                    onCompositionStart={() => this.composition = true}
                    onCompositionUpdate={() => this.composition = true}
                    onCompositionEnd={() => this.composition = false} />
                <IconButton type="submit">
                    <FontIcon className="material-icons">send</FontIcon>
                </IconButton>
            </form>
        );
    }
}