import TextField from 'material-ui/TextField';
import React, { Component, PropTypes } from 'react';

export default class MessageFormInput extends Component {
    static get propTypes() {
        return {
            name: PropTypes.string.isRequired,
            onChange: PropTypes.func.isRequired,
            onSubmit: PropTypes.func.isRequired,
            state: PropTypes.string,
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            value: '',
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.value !== this.state.value ||
            nextProps.name !== this.props.name ||
            nextProps.state !== this.props.state;
    }

    set value(value) {
        this.setState({ value });
    }
    get value() {
        return this.state.value || null;
    }

    clear() {
        const value = this.value;

        if (value && value.charAt(0) === '@') {
            const index = value.indexOf(' ');
            this.value = index > 0 ? value.substr(0, index + 1) : value;
        } else {
            this.value = '';
        }
    }

    render() {
        const {
            name,
            state,
            onChange,
            onSubmit,
        } = this.props;
        const { value } = this.state;

        const handleKeyDown = (e) => {
            if (e.key !== 'Enter' || e.shiftKey) return;
            e.preventDefault();
            onSubmit(e, value || null);
        };

        const handleChange = (e, value) => {
            this.value = value;
            if (!this.composition) onChange(e, value || null);
        };

        return (
            <TextField
                fullWidth
                multiLine
                disabled={state !== 'open'}
                floatingLabelText={name}
                name="message"
                rows={1}
                value={value}
                onChange={handleChange}
                onCompositionEnd={() => (this.composition = false)}
                onCompositionStart={() => (this.composition = true)}
                onCompositionUpdate={() => (this.composition = true)}
                onKeyDown={handleKeyDown}
            />
        );
    }
}
