import { connect } from 'react-redux';
import IconGrid from '../components/IconGrid';
import { fetch } from '../actions/icon';
import { update } from '../actions/name';

export default connect(
    ({ names, icons }, { name_id }) => {
        const name =
            name_id && names.find((name) => name.get('id') === name_id);

        return {
            name,
            icons,
        };
    },
    (dispatch) => ({
        onFetchIcons: () => dispatch(fetch()),
        onUpdateName: (e, name) => dispatch(update(name)),
    })
)(IconGrid);
