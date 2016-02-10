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
                onMouseEnter={() => this.toggle(true)}
                onMouseLeave={() => this.toggle(false)}
                onTouchTap={() => this.toggle(!full)}
            >
                <Tooltip
                    {...otherProps}
                    label={m.format('llll')}
                    show={full}
                    style={{
                        boxSizing: 'border-box',
                    }} />
                {m.fromNow()}
            </span>
        );
    }
}