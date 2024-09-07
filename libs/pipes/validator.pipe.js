"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidatorPipe = void 0;
const common_1 = require("@nestjs/common");
const http_exception_1 = require("../exceptions/http.exception");
const ValidatorPipe = () => {
    return new common_1.ValidationPipe({
        exceptionFactory(errors) {
            const errorValues = errors.map((err) => {
                if (err.constraints) {
                    const [message] = Object.values(err.constraints);
                    const fieldName = err.property;
                    return { fieldName, message };
                }
                return {
                    fieldName: err.property,
                    message: 'Invalid input',
                };
            });
            throw new http_exception_1.ValidationException(errorValues, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        },
    });
};
exports.ValidatorPipe = ValidatorPipe;
//# sourceMappingURL=validator.pipe.js.map