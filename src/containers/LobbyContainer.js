import { connect } from 'react-redux';
import { open } from '../actions/DialogActions';
import { Lobby } from '../components/Lobby';
import { bindState, bindActions } from './utility';

export const LobbyContainer = connect(
    () => ({}),
    bindActions({
        open,
    })
)(Lobby);