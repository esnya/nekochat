import config from 'config';
import { runAll as runCleaner } from './cleaner';

import './io';

runCleaner(config.get('data_cleaner'));
