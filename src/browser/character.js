let cache = {};
export const getCharacter = function(url) {
    return new Promise((resolve, reject) => {
        let cached = cache[url];
        if (cached === undefined) {
            let cached = cache[url] = {
                loaded: false,
                listeners: [],
            };
            try {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            let data = JSON.parse(xhr.responseText);
                            cache.data = data;
                            cached.listeners.forEach(listener => listener.resolve(data));
                            resolve(data);
                        } else {
                            let error = xhr.responseText;
                            cached.listeners.forEach(listener => listener.reject(error));
                            reject(error)
                            delete cache[url];
                        }
                    }
                };
                xhr.send(null);
            } catch(error) {
                cached.listeners.forEach(listener => listener.reject(error));
                reject(error);
                delete cache[url];
            }
        } else if (!cached.data) {
            cached.listeners.push({ resolve, reject });
        } else {
            resolve(cached.data);
        }
    });
};