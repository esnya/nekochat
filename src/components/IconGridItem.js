import FlatButton from 'material-ui/FlatButton';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import MessageIcon from '../containers/MessageIcon';
import { pureRender } from '../utility/enhancer';

const Style = {
    Button: {
        lineHeight: 'auto',
        minWidth: 'auto',
        textAlign: 'center',
        width: 92,
        height: 92,
        padding: 8,
    },
    Icon: {
        margin: 'auto',
    },
    Label: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

const IconGridItem = (props) => {
    const {
        color,
        icon,
        name,
        selected,
        onSelect,
    } = props;

    return (
        <FlatButton
            primary={selected}
            style={Style.Button}
            tooltip={icon && icon.get('name')}
            onTouchTap={(e) => onSelect(e, icon && icon.get('id'))}
        >
            <MessageIcon
                character_url={name && name.get('character_url')}
                color={color}
                id={icon && icon.get('id')}
                name={name && name.get('name')}
                style={Style.Icon}
            />
            <div style={Style.Label}>
                {icon ? icon.get('name') : 'Default'}
            </div>
        </FlatButton>
    );
};
IconGridItem.propTypes = {
    color: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    icon: IPropTypes.contains({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
    name: IPropTypes.contains({
        name: PropTypes.string,
        character_url: PropTypes.string,
    }),
    selected: PropTypes.bool,
};
export default pureRender(IconGridItem);
