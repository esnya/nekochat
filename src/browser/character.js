import { EventEmitter } from 'fbemitter';

const READY_DONE = 4;
const HTTP_OK = 200;
const EVENT_ERROR = 'ERROR';
const EVENT_DATA = 'DATA';
const cache = {};

const wait = (url) => new Promise((resolve, reject) => {
    const emitter = cache[url].emitter;

    emitter.once(EVENT_DATA, resolve);
    emitter.once(EVENT_ERROR, reject);
});

const req = (url) => {
    const emitter = cache[url].emitter;
    const onError = (error) => {
        cache.url = null;
        emitter.emit(EVENT_ERROR, error);
    };

    try {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === READY_DONE) {
                if (xhr.status === HTTP_OK) {
                    try {
                        cache[url].emitter = null;
                        emitter.emit(
                            EVENT_DATA,
                            (cache[url].data = JSON.parse(xhr.responseText))
                        );
                    } catch(error) {
                        onError(error);
                    }
                } else {
                    onError(new Error(xhr.statusText));
                }
            }
        };
        xhr.onerror = onError;
        xhr.withCredentials = true;

        xhr.open('GET', url, true);
        xhr.send(null);
    } catch(error) {
        onError(error);
    }
};

const get = (url) => {
    cache[url] = {
        emitter: new EventEmitter(),
    };

    const promise = wait(url);

    req(url);
    return promise;
};

export const getCharacter = (url) => {
    const cached = cache[url];

    if (!cached) return get(url);
    else if (!cached.data) return wait(url);

    return Promise.resolve(cached.data);
};