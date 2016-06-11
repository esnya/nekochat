import localStorage from './localStorage';

const BrowserConfig =
    JSON.parse(document.body.getAttribute('data-config') || '{}');

export const Config = {
    ...BrowserConfig,
    debug: localStorage.getItem('nekochat:debug') || BrowserConfig.debug,
};
export default Config;
