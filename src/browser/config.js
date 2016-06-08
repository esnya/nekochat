export const Config =
    JSON.parse(document.body.getAttribute('data-config') || '{}') || {};
export default Config;
