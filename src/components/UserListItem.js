import MenuItem from 'material-ui/MenuItem';
import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';
import LoginIcon from './LoginIcon';

const UserListItem = (props) => {
    const {
        user,
    } = props;

    return (
        <MenuItem>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <LoginIcon user={user} />
                <span>{user.get('name')}@{user.get('id')}</span>
            </div>
        </MenuItem>
    );
};
UserListItem.propTypes = {
    user: IPropTypes.contains({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
};
export default pureRender(UserListItem);
