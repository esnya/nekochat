import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { nameColor } from '../utility/color';
import { pureRender } from '../utility/enhancer';
import IconGridItem from './IconGridItem';

const Style = {
    Container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};

const IconGrid = (props) => {
    const {
        name,
        icons,
        onUpdateName,
    } = props;

    const handleSelect =
        (e, id) => onUpdateName(e, name.set('icon_id', id).toJS());

    const color = name && nameColor(name.get('name'));
    const selected = name && name.get('icon_id');
    const filter = name && name.get('icon_filter');

    return (
        <div style={Style.Container}>
            <IconGridItem
                color={color}
                icon={null}
                name={name}
                selected={name && !name.get('icon_id')}
                onSelect={handleSelect}
            />
            {
                icons
                    .filter(
                        (icon) => !filter || icon.get('name').match(filter)
                    )
                    .map((icon) => (
                        <IconGridItem
                            color={color}
                            icon={icon}
                            key={icon.get('id')}
                            selected={icon.get('id') === selected}
                            onSelect={handleSelect}
                        />
                    ))
            }
        </div>
    );
};
IconGrid.propTypes = {
    onUpdateName: PropTypes.func.isRequired,
    icons: IPropTypes.listOf(IPropTypes.contains({
        id: PropTypes.string.isRequired,
    })),
    name: IPropTypes.contains({
        name: PropTypes.string,
        character_url: PropTypes.string,
    }),
};
export default pureRender(IconGrid);
