import { connect } from 'react-redux';
import { open } from '../actions/dialog';
import MemoEditButton from '../components/MemoEditButton';

export default connect(
    () => ({}),
    (dispatch) => ({
        onEditMemo: () => dispatch(open('memo-edit')),
    })
)(MemoEditButton);
