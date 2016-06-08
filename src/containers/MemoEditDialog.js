import {connect} from 'react-redux';
import { update } from '../actions/memo';
import MemoEditDialog from '../components/MemoEditDialog';

export default connect(
    ({ room }) => ({
        memo: room && room.get('memo'),
    }),
    (dispatch) => ({
        onUpdateMemo: (e, memo) => dispatch(update(memo)),
    })
)(MemoEditDialog);
