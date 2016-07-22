import TextField from 'material-ui/TextField';
import React, { Component } from 'react';

export default class LiteTextField extends Component {
    static get propTypes() {
        return TextField.propTypes;
    }

    constructor(props) {
        super(props);

        this.state = {
            value: props.value,
        };
    }

    componentWillReceiveProps(nextProps) {
        const value = nextProps.value;
        if (value !== this.state.value) {
            this.value = value;
        }
    }

    set value(value) {
        this.setState({ value });
    }

    get value() {
        return this.state.value;
    }

    startWatcher() {
        this.timestamp = null;
        this.interval = setInterval(() => this.watcher(), 250);
    }

    stopWatcher() {
        if (this.interval) {
            clearImmediate(this.interval);
            this.interval = null;
        }
    }

    watcher() {
        if (!this.timestamp) return;

        if (Date.now() - this.timestamp >= 250) {
            this.triggerChange();
        }
    }

    triggerChange() {
        const {
            onChange,
        } = this.props;

        this.timestamp = null;

        if (onChange) {
            onChange(this.event, this.value);
        }
    }

    handleChange(e, value) {
        this.event = e;
        this.timestamp = Date.now();
        this.value = value;
    }

    handleFocus() {
        this.startWatcher();
    }

    handleBlur(event) {
        this.stopWatcher();

        if (this.timestamp) {
            this.event = event;
            this.triggerChange();
        }
    }

    render() {
        return (
            <TextField
                {...this.props}
                value={this.value}
                onBlur={(...args) => this.handleBlur(...args)}
                onChange={(...args) => this.handleChange(...args)}
                onFocus={(...args) => this.handleFocus(...args)}
            />
        );
    }
}
