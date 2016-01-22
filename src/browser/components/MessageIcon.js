import React from 'react';
import { Avatar } from 'material-ui';

export const MessageIcon = (props) => {
    let {
        id,
        name,
        color,
        style,
    } = props;

    const Style = {
        width: 60,
        height: 60,
        borderRadius: 8,
        boxSizing: 'border-box',
    };

    if (id) {
        return <div style={Object.assign({}, Style, style, {
            border: `2px solid ${color}`,
            boxShadow: `0 0 4px ${color}`,
            backgroundSize: 'cover',
            backgroundImage: `url(/icon/${props.id})`,
        })} />;
    } else if (name) {
        let icon = name.match(/^[a-zA-Z0-9][a-zA-Z0-9]/)
            ? name.substr(0, 2)
            : name.substr(0, 1);
        return <Avatar size={60} backgroundColor={color} style={style}>{icon}</Avatar>;
    } else {
        return <div style={Object.assign({}, Style, style)} />;
    }
};
