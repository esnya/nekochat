import axios from 'axios';

const cache = {
};

/**
 * Get character
 * @param{string} url - URL
 * @returns{Promise} Resolve by character
 */
export function get(url) {
    if (url in cache) {
        const data = cache[url];

        return Array.isArray(data)
            ? new Promise((resolve, reject) => {
                    data.push({ resolve, reject });
            }) :  Promise.resolve(cache[url]);
    }

    cache[url] = [];

    return axios({
            url,
            widthCredentials: true,
            headers: {
                Accept: 'application/json',
            },
        })
        .then(
            ({ data }) =>
                typeof(data) === 'object' ? data : Promise.reject(data)
        )
        .then((data) => {
            const link = data.url ? new URL(data.url, url) : url;
            const name = data.name || null;
            const icon = data.icon || data.image || data.portrait;

            return {
                icon,
                link,
                name,
                url,
            };
        })
        .then((character) => {
            cache[url].forEach(({ resolve }) => resolve(character));

            return (cache[url] = character);
        })
        .catch((e) => {
            cache[url].forEach(({ reject }) => reject(e));
            cache[url] = null;

            return Promise.reject(e);
        });
}
