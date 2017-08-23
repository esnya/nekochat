import config from 'config';
import { configure, connectLogger, getLogger } from 'log4js';

configure(config.get('log4js'));

export const system = getLogger('system');
export const access = connectLogger(getLogger('access'), { level: 'info' });
