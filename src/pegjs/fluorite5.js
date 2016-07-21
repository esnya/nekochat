// Mock for Jest unittest
// In production, this module is built by PEG.js CLI
import { readFileSync } from 'fs';
import PEG from 'pegjs';
import path from 'path';

const data = readFileSync(path.join(__dirname, '../../pegjs/fluorite5.pegjs'));

export default PEG.buildParser(data.toString(), {
    cache: true,
    allowedStartRules: [
        'Expression',
        'VMFactory',
    ],
});
