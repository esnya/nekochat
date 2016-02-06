import React from 'react';
import { Avatar, RefreshIndicator } from 'material-ui';

const Size = 60;
const Style = {
    width: Size,
    height: Size,
    borderRadius: 8,
    boxSizing: 'border-box',
};

const ImageIcon = (props) => {
    const {
        color,
        noShadow,
        style,
        url,
    } = props;
    const ImageStyle = {
        border: `2px solid ${color}`,
        boxShadow: !noShadow && `0 0 4px ${color}`,
        backgroundSize: 'cover',
    };

    return <div style={Object.assign({}, style, ImageStyle, {
        backgroundImage: `url(${url})`,
    })} />;
};

export const MessageIcon = (props) => {
    const {
        id,
        type,
        character_url,
        character_data,
        name,
        color,
        noShadow,
        style,
    } = props;

    if (type === 'loading') {
        return (
            <div style={{position: 'relative', width: Size, height: Size}}>
                <RefreshIndicator
                    left={0} top={0}
                    loadingColor={color}
                    size={Size}
                    status="loading" />
            </div>
        );
    } else if (id) {
        return (
            <ImageIcon
                color={color}
                style={{...Style, ...style}}
                noShadow={noShadow}
                url={`/icon/${id}`} />
        );
    } else if (character_url &&
        character_data && (
        character_data.icon ||
        character_data.portrait ||
        character_data.image ||
        character_data.picture)
    ) {
        const {
            icon,
            portrait,
            image,
            picture,
        } = character_data;
        const url = new URL(
            icon || portrait || image || picture,
            character_url
        );

        return (
            <ImageIcon
                color={color}
                style={{...Style, ...style}}
                noShadow={noShadow}
                url={url} />
        );
    } else if (name) {
        const icon = name.match(/^[a-zA-Z0-9][a-zA-Z0-9]/)
            ? name.substr(0, 2)
            : name.substr(0, 1);

        return (
            <Avatar backgroundColor={color} size={Size} style={style}>
                {icon}
            </Avatar>
        );
    }

    return <div style={{...Style, ...style}} />;
};