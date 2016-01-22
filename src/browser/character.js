let cache = {};

export const getCharacter = function(url) {
    return new Promise((resolve, reject) => {
        let cached = cache[url];

        if (cached === undefined) {
            cached = cache[url] = {
                loaded: false,
                listeners: [],
            };
            try {
                let xhr = new XMLHttpRequest();

                let onError = () => {
                    let error = xhr.statusText;

                    console.error(xhr.status, error);
                    cached.listeners.forEach((listener) => listener.reject(error));
                    reject(error);
                    Reflect.deleteProperty(cache, url);
                };

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            let data = JSON.parse(xhr.responseText);

                            cached.data = data;
                            cached.listeners.forEach((listener) => listener.resolve(data));
                            resolve(data);
                            Reflect.deleteProperty(cached, 'listeners');
                        } else {
                            onError();
                        }
                    }
                };
                xhr.onerror = onError;
                xhr.withCredentials = true;

                xhr.open('GET', url, true);
                xhr.send(null);
            } catch(error) {
                console.error(error);
                cached.listeners.forEach((listener) => listener.reject(error));
                reject(error);
                Reflect.deleteProperty(cache, url);
            }
        } else if (!cached.data) {
            cached.listeners.push({ resolve, reject });
        } else {
            resolve(cached.data);
        }
    });
};