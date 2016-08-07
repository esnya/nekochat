import React, { PropTypes } from 'react';
import IPropTypes from 'react-immutable-proptypes';
import { pureRender } from '../utility/enhancer';
import UserListItem from './UserListItem';

const UserList = (props) => {
    const {
        users,
    } = props;

    return (
        <div>
            {
                users.map(
                    (user) => <UserListItem key={user.get('id')} user={user} />
                )
            }
        </div>
    );
};
UserList.propTypes = {
    users: IPropTypes.listOf(IPropTypes.contains({
        id: PropTypes.string.isRequired,
    })).isRequired,
    onFetchUsers: PropTypes.func.isRequired,
};
export default pureRender(UserList);
