import React, { PropTypes } from 'react';
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

    return (
        <div
            style={{
                ...ImageStyle,
                ...style,
                backgroundImage: `url(${url})`,
            }}
        />
    );
};
ImageIcon.propTypes = {
    color: PropTypes.string.isRequired,
    url: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(URL),
    ]).isRequired,
    noShadow: PropTypes.bool,
    style: PropTypes.object,
};

export const MessageIcon = ({
    id,
    type,
    character_url,
    icon_url,
    name,
    color,
    noShadow,
    style,
    getCharacter,
}) => {
    if (character_url && !icon_url) {
        setTimeout(() => getCharacter(character_url));
    }

    if (type === 'loading') {
        return (
            <div style={{position: 'relative', width: Size, height: Size}}>
                <RefreshIndicator
                    left={0}
                    loadingColor={color}
                    size={Size}
                    status="loading"
                    top={0}
                />
            </div>
        );
    } else if (id) {
        return (
            <ImageIcon
                color={color}
                noShadow={noShadow}
                style={{...Style, ...style}}
                url={`/icon/${id}`}
            />
        );
    } else if (icon_url) {
        const url = new URL(icon_url, character_url);

        return (
            <ImageIcon
                color={color}
                noShadow={noShadow}
                style={{...Style, ...style}}
                url={url}
            />
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
MessageIcon.propTypes = {
    getCharacter: PropTypes.func.isRequired,
    character_url: PropTypes.string,
    color: PropTypes.string,
    icon_url: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    noShadow: PropTypes.bool,
    style: PropTypes.object,
    type: PropTypes.string,
};