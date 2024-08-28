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
 *
 * Date: 08/12/17
 */
define([
    'jscore/core',
    'i18n!eso-commonlib/dictionary.json',
    'layouts/Form',
    'formvalidator/Validator',
    'eso-commonlib/FieldValidator'

], function (core, Dictionary, Form, FormValidator, FieldValidator) {
    'use strict';

    /**
     * Widget used for "dynamic" form loading,
     *
     *
     */

    return core.Widget.extend({

        MIN_CHARS_IN_NAME: 2,

        MAX_TEXT_CHARS_IN_TEXT_AREA: 1000,


        onViewReady: function () {
            this.formValidator = new FormValidator();
            this.fieldValidator = new FieldValidator();
            this.createForm(this.options.parameters);
        },

        createForm: function (parameters) {
            var xmlDoc = this.json2xml(parameters);
            this.form = this.constructForm(xmlDoc);

            this.setupFields();
            this.form.attachTo(this.getElement());

        },

        /* junit can not create when not running in browser */
        constructForm: function (xmlDoc) {
            return new Form({
                content: xmlDoc
            });
        },

        setupFields: function () {

            var formFields = this.form.getFields();
            var style;

            for (var f in formFields) {
                if (formFields.hasOwnProperty(f)){
                    var field = formFields[f];
                    if (field.name === Dictionary.createSlice.NAME) {
                        this.formValidator.addField(field.iid, {
                            element: field.input,
                            rows: 1,
                            validation: {
                                validate: this.alphaNumericValidation.bind(this)
                            }
                        });
                    } else if (field.name === Dictionary.createSlice.SLICE_DESCRIPTION) {    //same reason as above
                        // slight hack : make text areas resizable
                        style = field.input.getAttribute("style");
                        field.input.setAttribute("style", style + "resize:both;");

                        this.formValidator.addField(field.iid, {
                            rows: getTextAreaRows(field),
                            element: field.input,
                            validation: {
                                validate: this.textAreaTextValidation.bind(this)
                            }
                        });
                    } else if (isFieldJSONTextArea(field)) {
                        // slight hack : make text areas resizable
                        style = field.input.getAttribute("style");
                        field.input.setAttribute("style", style + "resize:both;");

                        this.formValidator.addField(field.iid, {
                            rows: getTextAreaRows(field),
                            element: field.input,
                            validation: {
                                validate: this.objectValidation.bind(this)
                            }
                        });
                    } else {
                        if (field.name === Dictionary.serverConstants.PASSWORD) {
                            field.input.setAttribute("type", "password");
                        }
                        this.formValidator.addField(field.iid, {
                            element: field.input,
                            validation: {
                                validate: this.valueValidation.bind(this)
                            }
                        });
                    }
                    if (this.fieldHasEventHandler(field)) {
                        this.addEventHandlerForField(field);
                    }
                }
            }
        },

        alphaNumericValidation: function (field, callbacks) {

            if (field.getValue().length < this.MIN_CHARS_IN_NAME) {
                callbacks.error(Dictionary.validation.VALUE_REQUIRED_MESSAGE);
            } else if (!/^[a-zA-Z0-9_-][a-zA-Z0-9_-]+$/.test(field.getValue())) {
                callbacks.error(Dictionary.validation.VALIDATION_INVALID_CHARACTERS);
            } else {
                callbacks.success();
            }

        },

        valueValidation: function (field, callbacks) {
            var v = field.getValue();
            if ((typeof v !== "boolean") && (v === '' || Object.keys(v).length === 0 || v.title === Dictionary.createSlice.WORK_FLOW_OPTION_NONE)) {
                callbacks.error(Dictionary.validation.VALUE_REQUIRED_MESSAGE);
            } else {
                /* would not want any bad characters in either */
                this.fieldValidator.callbackValidateInput(this.fieldValidator.validateSupportedByForm.bind(this.fieldValidator), field, callbacks);
            }
        },

        objectValidation: function (field, callbacks) {
            if (!tryParseJSON(field.getValue())) {
                callbacks.error(Dictionary.validation.VALID_JSON_REQUIRED_MESSAGE);
            } else {
                /* would not want any bad characters (even javascript) in JSON text either */
                this.fieldValidator.callbackValidateInput(this.fieldValidator.validateSupportedByForm.bind(this.fieldValidator), field, callbacks);
            }
        },

        textAreaTextValidation: function (field, callbacks) {
            if (field.getValue().length > this.MAX_TEXT_CHARS_IN_TEXT_AREA) {

                var message = Dictionary.validation.TEXT_LENGTH_EXCEEDS_LIMIT;
                message = message.replace("{0}", this.MAX_TEXT_CHARS_IN_TEXT_AREA);

                callbacks.error(message);
            } else {
                callbacks.success();
            }
        },


        fieldHasEventHandler: function (element) {
            return (this.options.parameters[element.name] && this.options.parameters[element.name].callback);
        },
        addEventHandlerForField: function (element) {
            element.input.addEventHandler("change", function () {
                this.options.parameters[element.name].callback(element.input.getValue().value, element.input.getValue().name); // passing both id and Name
            }.bind(this));
        },

        json2xml: function (parameters) {
            var xmlString = '<form >\n';
            for (var p in parameters) {
                if (parameters.hasOwnProperty(p)){
                    var xml = createFormXmlForParameter(p, parameters[p]);
                    xmlString += xml;
                }
            }
            xmlString += '</form>';
            return xmlString;
        },


        isValid: function (successFunction) {
            var isValidResult;
            if (this.mandatoryFieldsExist()) {

                this.formValidator.checkValidity({
                    success: function () {
                        successFunction();
                        isValidResult = true;
                    },
                    error: function () {
                        isValidResult = false;
                    }
                });
            } else {
                successFunction();
                isValidResult = true;
            }
            return isValidResult;
        },

        mandatoryFieldsExist: function () {
            return (this.form.options.content.indexOf("required=") >= 0);
        },

        getData: function () {
            var data = this.form.getData();
            return this.changeTextAreaStringsToObjects(data);
        },

        /**
         * Used to keep static data when replacing form
         * @param data   JSON with key value pairs
         */
        setData: function (data) {
            this.form.setData(data);
        },

        changeTextAreaStringsToObjects: function (data) {
            var keys = Object.keys(data);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (this.isTextAreaJSON(key)) {

                    var json = tryParseJSON(data[key]);
                    if (json) {
                        data[key] = json;
                    }
                }
            }
            return data;
        },

        isTextAreaJSON: function (name) {
            var fields = this.form.getFields();
            for (var i = 0; i < fields.length; ++i) {
                var field = fields[i];
                if (field.name === name) {
                    return isFieldJSONTextArea(field);
                }
            }
        }

    });


    function createFormXmlForParameter(name, attributes) {
        var typeElements = '';
        if (isBoolean(attributes)) {
            typeElements = getSwitcherElement(attributes);
        } else if (attributes.type === 'select') {
            typeElements = getSelectElement(attributes);
        } else if (isJSONObject(attributes) || isTextAreaText(attributes)) {
            typeElements = getTextAreaElement(attributes);
        }
        else {
            typeElements = getTextElement(attributes);
        }
        var fieldAttrs = createFieldAttributes(name, attributes);
        var xml = '<field ' + fieldAttrs + '>\n' + typeElements + '</field>';
        return xml;
    }

    function isBoolean(attributes) {
        return (attributes.type === 'boolean' || typeof(attributes.default) === 'boolean');
    }

    function isTextAreaText(attributes) {
        return (attributes.type === 'textarea');
    }

    function isJSONObject(attributes) {
        return (typeof(attributes.default) === 'object' && Object.keys(attributes.default).length > 0);
    }

    //  Can't add type attribute to this method as Form class does not supports 'type' in field tag to generate the xml.
    function createFieldAttributes(name, attributes) {
        var fieldAttrs = 'label="' + name + '" name="' + name + '" ';
        fieldAttrs += (attributes.description) ? createFieldInfoAttribute(attributes.description) : '';
        fieldAttrs += attributes.mandatory ? ' required="required" ' : '';
        return fieldAttrs;
    }

    function createFieldInfoAttribute(description) {
        return (' info="' + description.replace(/(\r\n|\n|\r)/gm, "").replace(/</g, '').replace(/>/g, '') + '"');
    }

    function getSelectElement(attributes) {
        var optionsElements = '';
        var selected = '';
        var placeholder = '';
        if (noWorkflowAvailable(attributes)) {
            placeholder = (!selected && attributes.placeholder) ? ' placeholder="' + attributes.placeholder + '"' : '';
            return "<select" + placeholder + ">\n" + optionsElements + "</select>\n";
        }
        for (var i in attributes.items) {
            if (attributes.items.hasOwnProperty(i)){
                var item = attributes.items[i];
                selected = (item.value === attributes.default) ? ' selected="selected"' : '';
                var option = '<option value="' + item.value + '"' + selected + '>' + item.name + '</option>\n';
                optionsElements += option;
            }
        }
        placeholder = (!selected && attributes.placeholder) ? ' placeholder="' + attributes.placeholder + '"' : '';
        return "<select" + placeholder + ">\n" + optionsElements + "</select>\n";

    }

    function noWorkflowAvailable(attributes) {
        for (var i in attributes.items) {
            if (attributes.items.hasOwnProperty(i)){
                var item = attributes.items[i];
                if (attributes.id === Dictionary.createSlice.WORK_FLOW_NAME_LABEL_AND_ID && attributes.items.length === 1 && item.value === Dictionary.createSlice.WORK_FLOW_OPTION_NONE) {
                    return true;
                }
            }
        }
    }

    function getSwitcherElement(attributes) {
        var enabled = Dictionary.createSlice.ENABLED;
        var disabled = Dictionary.createSlice.DISABLED;
        var selected = (attributes.default === true) ? ' selected="selected"' : "";
        return '<switcher on-label="' + enabled + '" off-label="' + disabled + '" ' + selected + '/>';
    }

    function getTextAreaElement(attributes) {
        var HTML_CARRIAGE_RETURN = "&#13;";
        var placeholder = (attributes.placeholder) ? ' placeholder="' + attributes.placeholder + '"' : '';
        var str = JSON.stringify(attributes.default, undefined, HTML_CARRIAGE_RETURN);
        if (str.indexOf('&#13;&#13;') > 0) {
            var re = new RegExp('&#13;&#13;', 'g');
            str = str.replace(re, HTML_CARRIAGE_RETURN);
        }
        var width = (str.length > 50) ? ' width="300" ' : '';
        var textValue = (!empty(attributes.default)) ? " value='" + str + "'" : "";
        return '<textarea ' + width + textValue + placeholder + '/>';
    }

    function getTextElement(attributes) {
        var placeholder = (attributes.placeholder) ? ' placeholder="' + attributes.placeholder + '"' : '';
        var textValue = (!empty(attributes.default)) ? ' value="' + attributes.default + '"' : '';
        return '<text ' + textValue + placeholder + '/>';
    }

    function empty(data) {
        if (typeof(data) === 'number' || typeof(data) === 'boolean') {
            return false;
        } else if (typeof(data) === 'undefined' || data === null) {
            return true;
        } else if (typeof(data.length) !== 'undefined') {
            return data.length === 0;
        }
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }

    function getTextAreaRows(field) {
        var matches = field.input.getValue().match(new RegExp("\n", "g"));
        if (matches === null || typeof matches === 'undefined') {
            return 2;
        }
        var lines = matches.length + 1;
        if (lines > 20) {
            return 20;
        } else if (lines < 2) {
            return 2;
        } else {
            return lines;
        }
    }

    function isFieldJSONTextArea(field) {
        return field.input.getNative && field.input.getNative().type === "textarea";
    }

    function tryParseJSON(jsonString) {
        try {
            var o = JSON.parse(jsonString);
            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object",
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === "object") {
                return o;
            }
        } catch (e) {
        }
        return false;
    }

});

