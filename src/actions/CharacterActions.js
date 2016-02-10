import * as CHARACTER from '../constants/CharacterActions';

export const get = (url) => ({
    type: CHARACTER.GET,
    url,
});

export const set = (url, data) => ({
    type: CHARACTER.SET,
    url,
    data,
    timestamp: Date.now(),
});

export const remove = (url) => ({
    type: CHARACTER.REMOVE,
    url,
});