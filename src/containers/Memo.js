import {connect} from 'react-redux';
import Memo from '../components/Memo';

export default connect(
    ({ room }) => ({
        memo: room && room.get('memo'),
    })
)(Memo);
