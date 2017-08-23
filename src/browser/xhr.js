const READY_DONE = 4;
const HTTP_OK = 200;

export const get = url =>
    new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === READY_DONE) {
                if (xhr.status === HTTP_OK) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(xhr.statusText));
                }
            }
        };
        xhr.onerror = reject;
        xhr.withCredentials = true;

        xhr.open('GET', url, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.send(null);
    });
