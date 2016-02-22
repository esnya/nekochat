import { connect } from 'react-redux';
import { get as getCharacter } from '../actions/CharacterActions';
import { MessageIcon as Component } from '../components/MessageIcon';
import { bindActions } from './utility';

export const MessageIcon = connect(
    ({ characters }, { character_url }) => {
        const character_data = character_url && characters[character_url];
        if (!character_data) return {};

        const data = character_data.data;
        if (!data) return {};

        return {
            icon_url: data.icon || data.image || data.portrait || null,
        };
    },
    bindActions({
        getCharacter,
    })
)(Component);
