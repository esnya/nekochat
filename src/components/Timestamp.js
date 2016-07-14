import React, { PropTypes } from 'react';
import moment from '../browser/moment';
import { pureRender } from '../utility/enhancer';

const Timestamp = (props) => {
    const m = moment(props.timestamp);

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
};
Timestamp.propTypes = {
    timestamp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
    ]).isRequired,
};
export default pureRender(Timestamp);
