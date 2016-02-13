import Tooltip from 'material-ui/lib/tooltip';
import React, { Component } from 'react';
import moment from '../browser/moment';

export class Timestamp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            full: false,
        };
    }

    toggle(full) {
        this.setState({ full });
    }

    render() {
        const {
            timestamp,
            ...otherProps,
        } = this.props;
        const {
            full,
        } = this.state;
        const m = moment(timestamp);

        return (
            <span
                style={{
                    cursor: 'pointer',
                    position: 'relative',
                }}
            >
                {m.fromNow()}
            </span>
        );
    }
}