import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import React, { PropTypes} from 'react';
import MessageIcon from '../../containers/MessageIcon';

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
