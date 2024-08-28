/**
 * *******************************************************************************
 * COPYRIGHT Ericsson 2017
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 * User: eeicmsy
 * Date: 24/11/17
 */
define({

    /**
     * Status codes in Error response supported by UI.
     *
     * NOTE other supported codes may be defined in dictionary
     * under serverExceptionDescriptionKeys section  where a
     * localised message can be added for a given status
     * (and also allows for "internalErrorCode" in the JSON response to
     * be used for localised messages to user - outside of generic messages UX would want)
     */
    codes: {
        OK: 200,
        /**
         * Shows dialog message - forbidden action (RBAC)
         */
        UNAUTHORIZED: 401,
        /**
         * Shows full screen no licence message
         */
        NO_BASIC_LICENCE: 403,
        /**
         * The request could not be completed due to a conflict with the
         * current state of the target resource.
         */
        ALREADY_EXISTS: 409,

    },

    methods: {
        GET: "GET",
        POST: "POST",
        PATCH: "PATCH",
        PUT: "PUT",
        DELETE: "DELETE"
    },
    mediaTypes: {
        JSON: "json",
        CONTENT_TYPE_APPLICATION_JSON: "application/json",   // for post contentType
        FORM_DATA: "multipart/form-data"   // posting a file
    }

});
