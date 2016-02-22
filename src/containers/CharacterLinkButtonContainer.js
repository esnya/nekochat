import { connect } from 'react-redux';
import { get as getCharacter } from '../actions/CharacterActions';
import {
    CharacterLinkButton as Component,
} from '../components/CharacterLinkButton';
import { bindActions } from './utility';

export const CharacterLinkButton = connect(
    ({ characters }, { character_url }) => {
        const character_data = character_url && characters[character_url];
        if (character_data) return {};

        const data = character_data.data;
        if (!data) return {};

        return {
            character_link: data.url || character_url,
        };
    },
    bindActions({
        getCharacter,
    })
)(Component);