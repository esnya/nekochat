import FlatButton from 'material-ui/FlatButton';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import RoomActionMenu from './RoomActionMenu';
import RoomStatusIcons from './RoomStatusIcons';
import { Timestamp } from './Timestamp';
import { pureRender } from '../utility/enhancer';

const Style = {
    Container: {
        display: 'block',
    },
    Button: {
        height: 'auto',
        textAlign: 'left',
        padding: 16,
        paddingRight: 0,
        width: '100%',
    },
    Flex: {
        alignItems: 'center',
        display: 'flex',
    },
    Spacer: {
        flex: '1 1 0',
    },
    Title: {
        alignItems: 'center',
        display: 'flex',
        lineHeight: '24px',
        flex: '1 1 0',
    },
    Tagline: {
        fontSize: '12px',
        lineHeight: '16px',
    },
};

const RoomListItem = (props) => {
    const {
        room,
        onRoute,
    } = props;

    const path = `/${room.get('id')}`;

    return (
        <li style={Style.Container}>
            <div style={Style.Flex}>
                <FlatButton
                    href={path}
                    style={Style.Button}
                    onTouchTap={(e) => {
                        e.preventDefault();
                        onRoute(e, path);
                    }}
                >
                    <div style={Style.Flex}>
                        <div>
                            <div>{room.get('title')}</div>
                            <div style={Style.Tagline}>
                                @{room.get('user_id')}
                                &nbsp;
                                <Timestamp timestamp={room.modified} />
                            </div>
                        </div>
                        <div style={Style.Spacer} />
                        <RoomStatusIcons room={room} />
                    </div>
                </FlatButton>
                <RoomActionMenu {...props} />
            </div>
        </li>
    );
};
RoomListItem.propTypes = {
    room: IPropTypes.contains({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        user_id: PropTypes.string.isRequired,
        modified: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]).isRequired,
    }).isRequired,
    user: IPropTypes.contains({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    onRemoveRoom: PropTypes.func.isRequired,
    onRoute: PropTypes.func.isRequired,
};
export default pureRender(RoomListItem);
