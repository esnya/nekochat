import Colors from 'material-ui/lib/styles/colors';
import React, { PropTypes } from 'react';

const Style = {
    color: Colors.grey600,
    textDecoration: 'none',
    cursor: 'pointer',
};

export const UserId = ({style, user_id, whisperTo}) => (
    <span
        style={{
            ...Style,
            ...style,
        }}
        onTouchTap={(e) => {
            e.preventDefault();
            whisperTo(user_id);
        }}
    >
        <span>@</span>
        <span>{user_id}</span>
    </span>
);
UserId.propTypes = {
    user_id: PropTypes.string.isRequired,
    whisperTo: PropTypes.func.isRequired,
    style: PropTypes.object,
};
