import React from 'react';
import Avatar from 'material-ui/lib/avatar';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';

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
        icon_url,
        name,
        color,
        noShadow,
        style,
        getCharacter,
    } = props;

    // ToDo: to debugging
    if (!window.disableCharacterIcon && character_url && !icon_url) {
        setTimeout(() => getCharacter(character_url));
    }

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
    } else if (icon_url) {
        const url = new URL(icon_url, character_url);

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