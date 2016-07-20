import AppBar from 'material-ui/AppBar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Close from 'material-ui/svg-icons/navigation/close';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import UserList from '../containers/UserList';
import connect from '../connectors/chatDrawer';
import { pureRender } from '../utility/enhancer';

const ChatDrawer = (props) => {
    const {
        room,
        open,
        onRequestChange,
    } = props;

    return (
        <Drawer
            docked={false}
            open={open}
            onRequestChange={onRequestChange}
        >
            <AppBar
                iconElementLeft={
                    <IconButton
                        onTouchTap={() => onRequestChange(!open, 'clickaway')}
                    >
                        <Close color="white" />
                    </IconButton>
                }
                title="Nekochat"
            />
            <Link style={{ textDecoration: 'none' }} to="/">
                <MenuItem>
                    Leave
                </MenuItem>
            </Link>
            <MenuItem
                href={`/view/${room.get('id')}`}
                target="_blank"
            >
                Text View
            </MenuItem>
            <Divider />
            <UserList />
        </Drawer>
    );
};
ChatDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    room: IPropTypes.contains({
        id: PropTypes.string,
    }).isRequired,
    onRequestChange: PropTypes.func.isRequired,
};
export default connect(pureRender(ChatDrawer));
