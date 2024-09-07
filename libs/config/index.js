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
exports.Config = void 0;
const class_validator_1 = require("class-validator");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
class Configuration {
    constructor() {
        this.IS_PRODUCTION = process.env.NODE_ENV === "production" ? true : false;
        this.DB_URL_USER = process.env.DB_URL_USER;
        this.DB_HOST = process.env.DB_HOST;
        this.DB_DATABASE_USER = process.env.DB_DATABASE_USER;
        this.DB_DATABASE = process.env.DB_DATABASE;
        this.DB_PORT = Number(process.env.DB_PORT);
        this.DB_USERNAME = process.env.DB_USERNAME;
        this.DB_PASSWORD = process.env.DB_PASSWORD;
        this.GATEWAY_PORT = Number(process.env.GATEWAY_PORT);
        this.USER_PORT = Number(process.env.USER_PORT);
        this.GATEWAY_HOST = process.env.GATEWAY_HOST;
        this.USER_HOST = process.env.USER_HOST;
        this.REDIS_HOST = process.env.REDIS_HOST;
        this.REDIS_PORT = Number(process.env.REDIS_PORT);
        this.REDIS_URL = process.env.REDIS_URL;
        this.CREATE_USER_QUEUE = "create-user";
        this.IMAGE_UPLOAD_QUEUE = "image-upload";
        this.TRACK_PLAY_QUEUE = "track-play";
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
        this.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
        this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
        this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
        this.USER_SERVICE = "USER_SERVICE";
    }
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Object)
], Configuration.prototype, "IS_PRODUCTION", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DB_URL_USER", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DB_HOST", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DB_DATABASE_USER", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DB_DATABASE", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DB_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DB_USERNAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "DB_PASSWORD", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "GATEWAY_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "USER_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "GATEWAY_HOST", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "USER_HOST", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "REDIS_HOST", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Object)
], Configuration.prototype, "REDIS_PORT", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "REDIS_URL", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "CREATE_USER_QUEUE", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "IMAGE_UPLOAD_QUEUE", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "TRACK_PLAY_QUEUE", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "JWT_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "JWT_EXPIRES_IN", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "CLOUDINARY_CLOUD_NAME", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "CLOUDINARY_API_KEY", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "CLOUDINARY_API_SECRET", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], Configuration.prototype, "USER_SERVICE", void 0);
exports.Config = new Configuration();
//# sourceMappingURL=index.js.map