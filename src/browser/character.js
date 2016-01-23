const cache = {};

const READY_DONE = 4;
const HTTP_OK = 200;

export const getCharacter = function(url) {
    return new Promise((resolve, reject) => {
        let cached = cache[url];

        if (cached === undefined) {
            cached = cache[url] = {
                loaded: false,
                listeners: [],
            };
            
            const onError = (error) => {
                cached.listeners
                    .forEach((listener) => listener.reject(error));
                reject(error);
                Reflect.deleteProperty(cache, url);
            };

            try {
                const xhr = new XMLHttpRequest();

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === READY_DONE) {
                        if (xhr.status === HTTP_OK) {
                            try {
                                cached.data = JSON.parse(xhr.responseText);
                            } catch(error) {
                                onError(error);
                            }

                            cached.listeners.forEach(
                                (listener) => listener.resolve(cached.data)
                            );
                            resolve(cached.data);
                            Reflect.deleteProperty(cached, 'listeners');
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
        } else if (!cached.data) {
            cached.listeners.push({ resolve, reject });
        } else {
            resolve(cached.data);
        }
    });
};