export const notify = (notification) =>
    new Promise((resolve, reject) => {
        if (!('Notification' in window)) {
            return reject(new Error(
                'Borwser does support system notification'
            ));
        } else if (Notification.permission === 'granted') {
            return resolve();
        } else if (Notification.permission !== 'denied') {
            return Notification.requestPermission((permission) => {
                if (permission === 'granted') {
                    return resolve();
                }
                return reject(new Error('Premission denied'));
            });
        }
        return reject(new Error('Premission denied'));
    })
    .then(() => {
        const {
            title,
            ...options,
        } = notification;

        return new Notification(title, options);
    });