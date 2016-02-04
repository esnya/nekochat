import * as Video from '../actions/VideoActions';
import * as ROOM from '../constants/RoomActions';
import * as VIDEO from '../constants/VideoActions';
import Peer from 'peerjs_fork_firefox40';

navigator.getUserMedia = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia;
const getVideoStream = (p) => new Promise((resolve, reject) => {
    if (p.mystream) return resolve(p.mystream);
    navigator.getUserMedia(
        {
            audio: true,
            video: true,
        },
        (stream) => {
            p.mystream = stream;
            resolve(stream);
        },
        (error) => reject(error)
    );
});

let peer = null;

const getPeer = (dispatch) => new Promise((resolve) => {
    const key = document.body.getAttribute('data-peer-key');

    if (peer) return resolve(peer);

    peer = new Peer({key});

    peer.on('open', (id) => {
        resolve(peer, id);
    });
    peer.on('call', (call) => {
        call.answer();
        call.on('stream', (stream) => {
            stream.addEventListener('ended', () => {
                dispatch(Video.removed(call.id));
            });
            dispatch({
                type: VIDEO.PUSH,
                id: call.id,
                stream,
            });
        });
    });
});

let mediaConnections = [];

const endStream = () => {
    mediaConnections.forEach((conn) => conn.close());
    mediaConnections = [];
    peer.mystream = null;
};

export const videoMiddleware = ({dispatch}) => (next) => (action) => {
    if (action.type === ROOM.JOINED) {
        getPeer(dispatch)
            .then((p) =>
                dispatch(Video.request(null, p.id))
            );
    } else if (action.type === VIDEO.CREATE && !action.id) {
        return getPeer(dispatch)
            .then((p) => getVideoStream(p)
                .then((stream) => {
                    p.mystream = stream;
                    dispatch({
                        type: VIDEO.CREATE,
                        server: true,
                        id: p.id,
                        stream,
                    });
                })
            );
    } else if (action.type === VIDEO.PUSH && action.id && !action.stream) {
        return getPeer(dispatch)
            .then((p) => {
                dispatch(
                    Video.request(action.id, p.id)
                );
            });
    } else if (action.type === VIDEO.REQUESTED) {
        return getPeer(dispatch)
            .then((p) => {
                if (p.id === action.to || !action.to && p.mystream) {
                    getVideoStream(p)
                        .then((stream) => {
                            mediaConnections.push(
                                p.call(action.callme, stream)
                            );
                        });
                }
            });
    } else if (action.type === ROOM.LEAVE) {
        dispatch(Video.end());
    } else if (action.type === VIDEO.END) {
        getPeer()
            .then((p) => {
                dispatch(Video.remove(p.id));
            });
        endStream();
    }

    return next(action);
};