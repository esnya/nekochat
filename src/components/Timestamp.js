import IconButton from 'material-ui/IconButton';
import Clock from 'material-ui/svg-icons/device/access-time';
import React, { PropTypes } from 'react';
import moment from '../browser/moment';
import { pureRender } from '../utility/enhancer';

const Style = {
    Outer: {
        cursor: 'pointer',
        display: 'inline-block',
    },
    Inner: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    IconButton: {
        width: 18,
        height: 18,
        padding: 0,
    },
    Icon: {
        width: 18,
        height: 18,
    },
};

const Timestamp = (props) => {
    const {
        timestamp,
        tooltip,
        tooltipPosition,
    } = props;

    const m = moment(timestamp);

    const tooltipButtonElement = tooltip === false
        ? null
        : (
        <IconButton
            iconStyle={Style.Icon}
            style={Style.IconButton}
            tooltip={m.toString()}
            tooltipPosition={tooltipPosition}
        >
            <Clock />
        </IconButton>
        );

    return (
        <div style={Style.Outer}>
            <div style={Style.Inner}>
                {m.fromNow()}
                {tooltipButtonElement}
            </div>
        </div>
    );
};
Timestamp.propTypes = {
    timestamp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
    ]).isRequired,
    tooltip: PropTypes.bool,
    tooltipPosition: PropTypes.string,
};
export default pureRender(Timestamp);
