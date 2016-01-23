let initialized = false;

export const notice = () => {
    document.getElementById('notice-sound').play();
};
export const init = () => {
    if (!initialized) {
        initialized = true;
        window.removeEventListener('touchstart', init);

        ['notice-sound', 'dice3d-sound']
            .map((id) => document.getElementById(id))
            .forEach((audio) => {
                const onEnded = () => {
                    audio.removeEventListener('ended', onEnded);
                };

                audio.addEventListener('ended', onEnded);
                audio.play();
            });
    }
};

window.addEventListener('touchstart', init);