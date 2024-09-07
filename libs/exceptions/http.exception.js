"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptions = exports.ValidationException = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
class ValidationException extends common_1.HttpException {
    constructor() {
        super(...arguments);
        this.name = 'ValidationException';
    }
}
exports.ValidationException = ValidationException;
let HttpExceptions = class HttpExceptions {
    constructor(httpAdapterHost) {
        this.httpAdapterHost = httpAdapterHost;
    }
    catch(exception, host) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const httpStatus = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof ValidationException) {
            const exceptionResponse = exception.getResponse();
            const responseBody = {
                success: false,
                message: 'Validation failed',
                errors: exceptionResponse,
            };
            httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
        }
        else {
            const responseBody = {
                success: false,
                message: exception.message || 'Internal server error',
            };
            httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
        }
    }
};
exports.HttpExceptions = HttpExceptions;
exports.HttpExceptions = HttpExceptions = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], HttpExceptions);
//# sourceMappingURL=http.exception.js.map