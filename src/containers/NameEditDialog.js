import { connect } from 'react-redux';
import { upload } from '../actions/icon';
import { update } from '../actions/name';
import NameEditDialog from '../components/NameEditDialog';

export default connect(
    ({ names, characters }, { dialog, ...others }) => {
        const id = dialog && dialog.get('name_id');
        const name = dialog && names.find((name) => name.get('id') === id);
        const character_url = name && name.get('character_url');
        const character = character_url && characters.get(character_url);

        return {
            ...others,
            name,
            character,
        };
    },
    (dispatch) => ({
        onUpdateName: (e, name) => dispatch(update(name.toJS())),
        onUploadIcons: (e, files) => dispatch(upload(files)),
    })
)(NameEditDialog);
