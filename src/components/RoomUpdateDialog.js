import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import TextField from 'material-ui/lib/text-field';
import React, { Component, PropTypes } from 'react';

export class RoomUpdateDialog extends Component {
    static get propTypes() {
        return {
            open: PropTypes.bool.isRequired,
            room: PropTypes.shape({
                title: PropTypes.string.isRequired,
                state: PropTypes.oneOf(['open', 'close']).isRequired,
                password: PropTypes.bool,
            }),
            onUpdate: PropTypes.func.isRequired,
            onClose: PropTypes.func.isRequired,
        };
    }

    constructor(props) {
        super(props);

        const {room} = props;

        this.state = {
            state: room && room.state,
            passwordChanged: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        const {room} = nextProps;
        const {state} = this.state;

        if (room && room.state !== state) {
            this.setState({
                state: room.state,
            });
        }
    }

    handleUpdate(e) {
        if (e) e.preventDefault();

        const {
            onClose,
            onUpdate,
        } = this.props;
        const {
            state,
            passwordChanged,
        } = this.state;

        const room = {
            title: this.title.getValue() || null,
            state,
        };
        if (passwordChanged) {
            room.password = this.password.getValue() || null;
        }

        onUpdate(room);
        onClose();
    }

    render() {
        const {
            open,
            room,
            onClose,
        } = this.props;
        const {
            state,
        } = this.state;

        const Actions = [
            <FlatButton primary
                key="update"
                label="Update"
                onTouchTap={() => this.handleUpdate()}
            />,
            <FlatButton secondary
                key="cancel"
                label="Cancel"
                onTouchTap={onClose}
            />,
        ];

        const Style = {
            Label: {
                marginTop: 12,
                display: 'block',
            },
            RadioGroup: {
            },
            Radio: {
            },
        };

        return (
            <Dialog
                autoScrollBodyContent
                actions={Actions}
                open={open}
                title="Chat Room"
                onRequestClose={onClose}
            >
                <form onSubmit={(e) => this.handleUpdate(e)}>
                    <TextField fullWidth
                        defaultValue={room && room.title || ''}
                        floatingLabelText="Title"
                        name="title"
                        ref={(c) => c && (this.title = c)}
                    />
                    <TextField fullWidth
                        defaultValue={
                            (room && room.password) ? '12345678' : ''
                        }
                        floatingLabelText="Password"
                        name="password"
                        ref={(c) => c && (this.password = c)}
                        type="password"
                        onChange={() => this.setState({passwordChanged: true})}
                    />
                    <label htmlFor="room-update-state" style={Style.Label}>
                        State
                    </label>
                    <RadioButtonGroup
                        id="room-update-state"
                        name="state"
                        style={Style.RadioGroup}
                        valueSelected={state}
                        onChange={(e, value) => this.setState({state: value})}
                    >
                        <RadioButton
                            label="Open"
                            style={Style.Radio}
                            value="open"
                        />
                        <RadioButton
                            label="Close"
                            style={Style.Radio}
                            value="close"
                        />
                    </RadioButtonGroup>
                </form>
            </Dialog>
        );
    }
}
