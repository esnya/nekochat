/* eslint camelcase: "off" */

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get as getCharacter } from '../actions/character';
import MessageIcon from '../components/MessageIcon';

export default connect(
    ({ characters }, { character_url, typing }) => {
        const characterData = character_url && characters[character_url];
        if (!characterData) return {};

        const data = characterData.data;
        if (!data) return {};

        return {
            character_url,
            icon_url: data.icon || data.image || data.portrait || null,
            typing,
        };
    },
    dispatch => bindActionCreators({
        getCharacter,
    }, dispatch),
)(MessageIcon);
