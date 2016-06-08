import { connect } from 'react-redux';
import { fetch } from '../actions/user';
import UserList from '../components/UserList';

export default connect(
    ({ users }) => ({ users }),
    (dispatch) => ({
        onFetchUsers: () => dispatch(fetch()),
    })
)(UserList);
