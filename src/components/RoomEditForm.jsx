import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import React, { Component, PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';

const roomToState = (room) => ({
    title: room && room.get('title'),
    dice: room && room.get('dice') || 'fluorite',
    password: room && room.get('password') ? 'password' : null,
    passwordChanged: false,
    state: room && room.get('state') || 'open',
});

const Style = {
    RadioGroup: {
        marginTop: 18,
    },
};

export default class RoomEditForm extends Component {
    static get propTypes() {
        return {
            room: IPropTypes.contains({
                title: PropTypes.string,
                dice: PropTypes.string,
                password: PropTypes.bool,
                state: PropTypes.string,
            }),
            gameTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
            onSubmit: PropTypes.func.isRequired,
        };
    }

    constructor(props) {
        super(props);

        const {
            room,
        } = props;

        this.state = roomToState(room);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.room !== this.props.room) {
            this.setState(roomToState(nextProps.room));
        }
    }

    get data() {
        const {
            title,
            dice,
            password,
            passwordChanged,
            state,
        } = this.state;

        return {
            title,
            dice,
            password: passwordChanged ? password : undefined,
            state,
        };
    }

    render() {
        const {
            gameTypes,
        } = this.props;

        const {
            title,
            dice,
            password,
            state,
            onSubmit,
        } = this.state;

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(e, this.data);
        };

        return (
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    required
                    floatingLabelText="Title"
                    name="title"
                    value={title || ''}
                    onChange={(e, value) => this.setState({ title: value })}
                />
                <SelectField
                    fullWidth
                    required
                    floatingLabelText="GameType"
                    name="dice"
                    value={dice || ''}
                    onChange={(e, key, value) => this.setState({ dice: value })}
                >
                    <MenuItem value="DiceBot" primaryText="DiceBot" />
                    {
                        gameTypes.map(gameType => (
                            <MenuItem key={gameType} value={gameType} primaryText={gameType} />
                        ))
                    }
                    <MenuItem value="fluorite" primaryText="Nekochat (Fluorite5)" />
                </SelectField>
                <TextField
                    fullWidth
                    floatingLabelText="Password"
                    name="password"
                    type="password"
                    value={password || ''}
                    onChange={
                        (e, value) => this.setState({
                            password: value,
                            passwordChanged: true,
                        })
                    }
                />
                <RadioButtonGroup
                    name="state"
                    style={Style.RadioGroup}
                    valueSelected={state}
                    onChange={(e, value) => this.setState({ state: value })}
                >
                    <RadioButton
                        label="Open"
                        value="open"
                    />
                    <RadioButton
                        label="Close"
                        value="close"
                    />
                </RadioButtonGroup>
            </form>
        );
    }
}
