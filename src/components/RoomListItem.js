import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import ListItem from 'material-ui/lib/lists/list-item';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { findDOMNode } from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { Timestamp } from './Timestamp';

const DialogFeatures = {
    width: 360,
    height: 640,
    resizabe: true,
    scrollbars: true,
};
const DialogFeatureString = Object.keys(DialogFeatures)
    .map((key) => ({key, value: DialogFeatures[key]}))
    .map((a) => `${a.key}=${a.value === true ? 'yes' : a.value}`);

export class RoomListItem extends Component {
    static get propTypes() {
        return {
            room: PropTypes.shape({
                id: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                user_id: PropTypes.string.isRequired,
                modified: PropTypes.string.isRequired,
            }).isRequired,
            user: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
            }).isRequired,
            setRoute: PropTypes.func.isRequired,
            removeRoom: PropTypes.func.isRequired,
        };
    }

    shouldComponentUpdate(nextProps) {
        const {
            room,
        } = this.props;

        return room.modified !== nextProps.room.modified;
    }

    render() {
        const {
            room,
            user,
            setRoute,
            removeRoom,
        } = this.props;

        const path = `/${room.id}`;

        const MenuItemStyle = {
            display: 'flex',
            alignItems: 'center',
        };
        const CloseItemStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
        };

        const rightIconMenu = (
            <IconMenu
                iconButtonElement={
                    <IconButton iconClassName="material-icons">
                        more_vert
                    </IconButton>
                }
                ref={(c) => c && (this.menu = c)}
            >
                <MenuItem
                    href={path}
                    onTouchTap={(e) => setRoute(path, e)}
                >
                    <div style={MenuItemStyle}>
                        <FontIcon className="material-icons">
                            open_in_browser
                        </FontIcon>
                        Join
                    </div>
                </MenuItem>
                <MenuItem
                    style={MenuItemStyle}
                    onTouchTap={() => window.open(
                        path,
                        room.id,
                        DialogFeatureString
                    )}
                >
                    <div style={MenuItemStyle}>
                        <FontIcon className="material-icons">
                            open_in_new
                        </FontIcon>
                        Popup
                    </div>
                </MenuItem>
                <MenuItem
                    disabled={room.user_id !== user.id}
                    style={MenuItemStyle}
                    onTouchTap={() => removeRoom(room)}
                >
                    <div style={MenuItemStyle}>
                        <FontIcon className="material-icons">
                            delete
                        </FontIcon>
                        Delete
                    </div>
                </MenuItem>
                <MenuItem>
                    <div style={CloseItemStyle}>
                        <FontIcon className="material-icons">
                            keyboard_arrow_up
                        </FontIcon>
                    </div>
                </MenuItem>
            </IconMenu>
        );

        return (
            <ListItem
                href={path}
                primaryText={room.title}
                rightIconButton={rightIconMenu}
                secondaryText={
                    <span>
                        @{room.user_id}
                        &nbsp;
                        <Timestamp timestamp={room.modified} />
                    </span>
                }
                onClick={(e) => {
                    const menuButton = findDOMNode(this.menu).children[0];
                    if (e.target === menuButton) {
                        e.preventDefault();
                    }
                }}
                onTouchTap={(e) => setRoute(path, e)}
            />
        );
    }
}