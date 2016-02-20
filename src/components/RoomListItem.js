import AppBar from 'material-ui/lib/app-bar';
import IconButton from 'material-ui/lib/icon-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import isMobile from 'is-mobile';
import { zip } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Timestamp } from './Timestamp';

const IsMobile = isMobile();

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

        return (
            <ListItem
                href={path}
                primaryText={room.title}
                rightIconButton={
                    <div style={{ display: 'flex' }}>
                        <IconButton
                            href={path}
                            iconClassName="material-icons"
                            tooltip="Join"
                            onTouchTap={(e) => setRoute(path, e)}
                        >
                            open_in_browser
                        </IconButton>
                        {
                            IsMobile
                                ? null
                                : <IconButton
                                    iconClassName="material-icons"
                                    tooltip="New window"
                                    onTouchTap={() =>
                                        window.open(
                                            path,
                                            room.id,
                                            DialogFeatureString
                                        )
                                    }
                                  >
                                    open_in_new
                                </IconButton>
                        }
                        <IconButton
                            disabled={room.user_id !== user.id}
                            iconClassName="material-icons"
                            tooltip="Delete"
                            onTouchTap={() => removeRoom(room)}
                        >
                            delete
                        </IconButton>
                    </div>
                }
                secondaryText={
                    <span>
                        @{room.user_id}
                        &nbsp;
                        <Timestamp timestamp={room.modified} />
                    </span>
                }
                onTouchTap={(e) => setRoute(path, e)}
            />
        );
    }
}