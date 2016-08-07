/* eslint camelcase: "off" */

import SvgIcon from 'material-ui/SvgIcon';
import React, { PropTypes } from 'react';

export const Dice6_1 = (props) => (
    <SvgIcon {...props}>
        <rect
            x="3" y="3"
            width="18" height="18"
            rx="2" ry="2"
            stroke="none"
        />
        <circle
            cx="12" cy="12"
            r="3"
            fill="#fff"
            stroke="none"
        />
    </SvgIcon>
);

export const Dice6_2 = (props) => (
    <SvgIcon {...props}>
        <rect
            x="3" y="3"
            width="18" height="18"
            rx="2" ry="2"
            stroke="none"
        />
        <circle
            cx="8" cy="8"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="16" cy="16"
            r="2"
            fill="#fff"
            stroke="none"
        />
    </SvgIcon>
);

export const Dice6_3 = (props) => (
    <SvgIcon {...props}>
        <rect
            x="3" y="3"
            width="18" height="18"
            rx="2" ry="2"
            stroke="none"
        />
        <circle
            cx="8" cy="8"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="12" cy="12"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="16" cy="16"
            r="2"
            fill="#fff"
            stroke="none"
        />
    </SvgIcon>
);

export const Dice6_4 = (props) => (
    <SvgIcon {...props}>
        <rect
            x="3" y="3"
            width="18" height="18"
            rx="2" ry="2"
            stroke="none"
        />
        <circle
            cx="8" cy="8"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="8" cy="16"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="16" cy="8"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="16" cy="16"
            r="2"
            fill="#fff"
            stroke="none"
        />
    </SvgIcon>
);

export const Dice6_5 = (props) => (
    <SvgIcon {...props}>
        <rect
            x="3" y="3"
            width="18" height="18"
            rx="2" ry="2"
            stroke="none"
        />
        <circle
            cx="7" cy="7"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="7" cy="17"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="17" cy="7"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="17" cy="17"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="12" cy="12"
            r="2"
            fill="#fff"
            stroke="none"
        />
    </SvgIcon>
);

export const Dice6_6 = (props) => (
    <SvgIcon {...props}>
        <rect
            x="3" y="3"
            width="18" height="18"
            rx="2" ry="2"
            stroke="none"
        />
        <circle
            cx="8" cy="7"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="8" cy="17"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="16" cy="7"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="16" cy="17"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="8" cy="12"
            r="2"
            fill="#fff"
            stroke="none"
        />
        <circle
            cx="16" cy="12"
            r="2"
            fill="#fff"
            stroke="none"
        />
    </SvgIcon>
);

export const Dice6 = (props) => {
    const {
        n,
        ...others,
    } = props;

    const Component = [
        null,
        Dice6_1,
        Dice6_2,
        Dice6_3,
        Dice6_4,
        Dice6_5,
        Dice6_6,
    ][n];

    return <Component {...others} />;
};
Dice6.propTypes = {
    n: PropTypes.number.isRequired,
};
export default Dice6;
