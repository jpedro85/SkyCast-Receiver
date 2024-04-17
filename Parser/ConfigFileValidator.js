const Ajv = require("ajv");
module.exports = class ConfigFileValidator {
    constructor() {
        this.schema = {
            "type": "object",
            "properties": {
                "debuggerConsole": {
                    "type": "boolean"
                },
                "debuggerOverlay": {
                    "type": "boolean"
                },
                "chromecastChannel": {
                    "type": "object",
                    "properties": {
                        "NAMESPACE": {
                            "type": "string"
                        },
                        "communicationConstants": {
                            "type": "object"
                        }
                    },
                    "nullable": true
                },
                "imageInterval": {
                    "type": "number"
                },
                "carouselUrl": {
                    "type": "string"
                },
                "carouselHeaders": {
                    "type": "object"
                }
            },
            "required": ["debuggerConsole", "chromecastChannel", "imageInterval", "carouselUrl", "carouselHeaders"],
            "additionalProperties": false
        };
    }

    validate(config) {
        const ajv = new Ajv();
        const validate = ajv.compile(this.schema);
        const valid = validate(config);
        if (!valid) {
            throw new Error(`Invalid config format: ${ajv.errorsText(validate.errors)}`);
        }
    }
}
