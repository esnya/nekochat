import Checkbox from 'material-ui/lib/checkbox';
import IconButton from 'material-ui/lib/icon-button';
import React, { PropTypes} from 'react';
import {MessageIcon} from '../../containers/MessageIconContainer';

export const IconListItem = (props) => {
    const {
        id,
        name,
        selected,
        onRemove,
        onSelect,
    } = props;

    const style = {
        li: {
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            marginBottom: 8,
        },
        checkbox: {
            width: 'auto',
        },
    };

    return (
        <li style={style.li}>
            <Checkbox
                checked={selected}
                style={style.checkbox}
                onCheck={onSelect}
            />
            <MessageIcon id={id} />
            {name}
            <IconButton iconClassName="material-icons" onTouchTap={onRemove}>
                delete
            </IconButton>
        </li>
    );
};
IconListItem.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onRemove: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
};
