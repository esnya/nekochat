import React from 'react';
import { Avatar, RefreshIndicator } from 'material-ui';

export const MessageIcon = (props) => {
    let {
        id,
        type,
        character_url,
        character_data,
        name,
        color,
        noShadow,
        style,
    } = props;

    const Style = {
        width: 60,
        height: 60,
        borderRadius: 8,
        boxSizing: 'border-box',
    };
    const ImageStyle = {
        border: `2px solid ${color}`,
        boxShadow: !noShadow && `0 0 4px ${color}`,
        backgroundSize: 'cover',
    };

    if (type === 'loading') {
        return (
            <div style={{position: 'relative', width: 60}}>
                <RefreshIndicator size={60} loadingColor={color} left={0} top={0} status="loading" />
            </div>
        );
    } else if (id) {
        return <div style={Object.assign({}, Style, ImageStyle, style, {
            backgroundImage: `url(/icon/${id})`,
        })} />;
    } else if (character_url && character_data) {
        let {
            icon,
            portrait,
            image,
            picture,
        } = character_data;
        let url = new URL(icon || portrait || image || picture, character_url);

        return <div style={Object.assign({}, Style, ImageStyle, style, {
            backgroundImage: `url(${url})`,
        })} />;
    } else if (name) {
        let icon = name.match(/^[a-zA-Z0-9][a-zA-Z0-9]/)
            ? name.substr(0, 2)
            : name.substr(0, 1);
 
        return <Avatar size={60} backgroundColor={color} style={style}>{icon}</Avatar>;
    }

    return <div style={Object.assign({}, Style, style)} />;
};