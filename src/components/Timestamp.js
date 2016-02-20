import Tooltip from 'material-ui/lib/tooltip';
import React, { Component, PropTypes } from 'react';
import moment from '../browser/moment';

export class Timestamp extends Component {
    static get propTypes() {
        return {
            timestamp: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.instanceOf(Date),
            ]).isRequired,
        };
    }

    render() {
        const m = moment(this.props.timestamp);

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