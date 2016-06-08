import { connect } from 'react-redux';
import { get as getCharacter } from '../actions/character';
import MessageIcon from '../components/MessageIcon';
import { bindActions } from './utility';

export default connect(
    ({ characters }, { character_url, typing }) => {
        const character_data = character_url && characters[character_url];
        if (!character_data) return {};

        const data = character_data.data;
        if (!data) return {};

        return {
            character_url,
            icon_url: data.icon || data.image || data.portrait || null,
            typing,
        };
    },
    bindActions({
        getCharacter,
    })
)(MessageIcon);
