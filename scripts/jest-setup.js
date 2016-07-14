/* eslint-env jasmine */

'use strict';

jest.unmock('immutable');
jest.unmock('jasmine-immutablejs-matchers');
require('jasmine-immutablejs-matchers');

beforeEach(() => {
    jasmine.addMatchers({
        isEmpty: () => ({
            compare: (actual) => ({
                pass: actual.isEmpty(),
            }),
        }),
    });
});
