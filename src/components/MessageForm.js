import { FontIcon, IconButton, TextField } from 'material-ui';
import React, { Component } from 'react';
import { makeColor } from '../utility/color';
import { MessageIcon } from './MessageIcon';

export const FROM_HEIGHT = 72;

export class MessageForm extends Component {
    constructor(props) {
        super(props);
    }

    onSubmit(e) {
        e.preventDefault();

        const messageField = this.refs.message;
        const message = messageField.getValue();

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
                message,
            });
            messageField.clearValue();
            this.endInput();
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

    onInput() {
        if (this.composition) return;

        const {
            name,
            beginInput,
        } = this.props;

        const message = this.refs.message.getValue();

        if (message) {
            beginInput({
                name,
                message: this.refs.message.getValue(),
            });
        } else this.endInput();
    }
    endInput() {
        this.composition = false;
        this.props.endInput({
            name: this.props.name,
        });
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
                    onChange={() => this.onInput()}
                    onFocus={() => this.onInput()}
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