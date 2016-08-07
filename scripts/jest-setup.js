/* eslint-env jasmine */

'use strict';

jest.unmock('immutable');
jest.unmock('jasmine-immutablejs-matchers');
// eslint-disable-next-line import/no-extraneous-dependencies
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
