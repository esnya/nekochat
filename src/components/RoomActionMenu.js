import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import OpenInBrowser from 'material-ui/svg-icons/action/open-in-browser';
import OpenInNew from 'material-ui/svg-icons/action/open-in-new';
import ViewHeadline from 'material-ui/svg-icons/action/view-headline';
import KeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';

const DialogFeatures = {
    width: 360,
    height: 640,
    resizabe: true,
    scrollbars: true,
};
const DialogFeatureString = Object.keys(DialogFeatures)
    .map((key) => ({key, value: DialogFeatures[key]}))
    .map((a) => `${a.key}=${a.value === true ? 'yes' : a.value}`);

const Style = {
    MenuItem: {
        display: 'flex',
        alignItems: 'center',
    },
    CloseItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
};

const RoomActionMenu = (props) => {
    const {
        room,
        user,
        onRemoveRoom,
        onRoute,
    } = props;

    const id = room.get('id');
    const path = `/${id}`;

    return (
        <IconMenu
            iconButtonElement={<IconButton><MoreVert /></IconButton>}
        >
            <MenuItem
                href={path}
                onTouchTap={(e) => onRoute(e, path)}
            >
                <div style={Style.MenuItem}>
                    <OpenInBrowser />
                    &nbsp;
                    Join
                </div>
            </MenuItem>
            <MenuItem
                style={Style.MenuItem}
                onTouchTap={() => window.open(
                    path,
                    id,
                    DialogFeatureString
                )}
            >
                <div style={Style.MenuItem}>
                    <OpenInNew />
                    &nbsp;
                    Popup
                </div>
            </MenuItem>
            <MenuItem
                href={`/view/${id}`}
                target="_blank"
            >
                <div style={Style.MenuItem}>
                    <ViewHeadline />
                    &nbsp;
                    Text View
                </div>
            </MenuItem>
            <MenuItem
                disabled={room.get('user_id') !== user.get('id')}
                onTouchTap={(e) => onRemoveRoom(e, room)}
            >
                <div style={Style.MenuItem}>
                    <Delete />
                    &nbsp;
                    Delete
                </div>
            </MenuItem>
            <MenuItem>
                <div style={Style.CloseItem}>
                    <KeyboardArrowUp />
                </div>
            </MenuItem>
        </IconMenu>
    );
};
RoomActionMenu.propTypes = {
    room: IPropTypes.contains({
       id: PropTypes.string.isRrequired,
    }).isRrequired,
    user: IPropTypes.contains({
       id: PropTypes.string.isRrequired,
       name: PropTypes.string.isRrequired,
    }).isRrequired,
    onRemoveRoom: PropTypes.func.isRrequired,
    onRoute: PropTypes.func.isRrequired,
};
export default pureRender(RoomActionMenu);
