import { connect } from 'react-redux';
import MessageFormList from '../components/MessageFormList';

export default connect(
    ({ names }) => ({
        names,
    })
)(MessageFormList);
