/*global define, describe, before, after, beforeEach, afterEach, it, expect */
define([
    'sap-execution-log/SapExecutionLog'
], function (SapExecutionLog) {
    'use strict';

    describe('SapExecutionLog', function () {

        it('Sample BIT test', function () {
            expect(SapExecutionLog).not.to.be.undefined;
        });

    });

});
