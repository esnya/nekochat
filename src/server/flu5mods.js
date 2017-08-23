import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import parser from '../pegjs/fluorite5';

const MODS_PATH = '../../fluorite-mods';

const src = readdirSync(path.join(__dirname, MODS_PATH))
    .map(file =>
        readFileSync(path.join(__dirname, MODS_PATH, file)).toString(),
    )
    .join(';');

let cache = null;
export const parseMods = () => {
    if (cache) return cache;

    cache = parser.parse(`\\${src}\\`)[0][0];

    return cache;
};
