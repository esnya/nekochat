import IconButton from 'material-ui/IconButton';
import React, { PropTypes } from 'react';

const Style = {
    Button: {
        margin: '0 4px',
        padding: 0,
        width: 'auto', height: 'auto',
    },
    Icon: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: 18,
    },
};

export const CharacterLinkButton = (props) => {
    const {
        character_url,
        character_link,
    } = props;

    if (!character_url && !character_link) {
        return <span />;
    }

    const href = character_link
        ? new URL(character_link, character_url)
        : character_url;

    return (
        <IconButton
            containerElement="a"
            href={href}
            iconClassName="material-icons"
            iconStyle={Style.Icon}
            style={Style.Button}
            target="_blank"
        >
            open_in_new
        </IconButton>
    );
};
CharacterLinkButton.propTypes = {
    character_link: PropTypes.string,
    character_url: PropTypes.string,
};
