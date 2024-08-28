/*global define, describe, before, after, beforeEach, afterEach, it, expect */
define([
    'sap-decision-rules/SapDecisionRules'
], function (SapDecisionRules) {
    'use strict';

    describe('SapDecisionRules', function () {

        it('Sample BIT test', function () {
            expect(SapDecisionRules).not.to.be.undefined;
        });

    });

});
