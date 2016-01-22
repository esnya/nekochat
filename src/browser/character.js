import axios from 'axios';

let cache = {};
export const getCharacter = function(url) {
    return new Promise((resolve, reject) => {
        let cached = cache[url];
        if (cached === undefined) {
            let cached = cache[url] = {
                loaded: false,
                listeners: [],
            };
            axios.get(url)
                .then(data => {
                    cached.data = data.data;
                    cached.listeners.forEach(listener => listener.resolve(data.data));
                    resolve(data.data);
                })
                .catch(error => {
                    cached.listeners.forEach(listener => listener.reject(error));
                    reject(error)
                    delete cache[url];
                });
        } else if (!cached.data) {
            cached.listeners.push({ resolve, reject });
        } else {
            resolve(cached.data);
        }
    });
};