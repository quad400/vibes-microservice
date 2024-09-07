import { IsBoolean, IsNumber, IsString } from "class-validator";
import { config } from "dotenv";

config();

class Configuration {

    @IsBoolean()
    readonly IS_PRODUCTION = process.env.NODE_ENV === "production"? true: false

    @IsString()
    readonly DB_URL_USER = process.env.DB_URL_USER
    
    @IsString()
    readonly DB_HOST = process.env.DB_HOST
    
    @IsString()
    readonly DB_DATABASE_USER = process.env.DB_DATABASE_USER
    
    @IsString()
    readonly DB_DATABASE = process.env.DB_DATABASE
    
    @IsNumber()
    readonly DB_PORT = Number(process.env.DB_PORT)
    
    @IsString()
    readonly DB_USERNAME = process.env.DB_USERNAME
    
    @IsString()
    readonly DB_PASSWORD = process.env.DB_PASSWORD
 
    @IsString()
    readonly GATEWAY_PORT = Number(process.env.GATEWAY_PORT)
    
    @IsString()
    readonly USER_PORT = Number(process.env.USER_PORT)

    @IsString()
    readonly GATEWAY_HOST = process.env.GATEWAY_HOST
    
    @IsString()
    readonly USER_HOST = process.env.USER_HOST

    @IsString()
    readonly REDIS_HOST = process.env.REDIS_HOST
    
    @IsNumber()
    readonly REDIS_PORT = Number(process.env.REDIS_PORT)
    
    @IsString()
    readonly REDIS_URL = process.env.REDIS_URL
    
    @IsString()
    readonly CREATE_USER_QUEUE = "create-user"

    @IsString()
    readonly IMAGE_UPLOAD_QUEUE = "image-upload"

    @IsString()
    readonly TRACK_PLAY_QUEUE = "track-play"

    @IsString()
    readonly JWT_SECRET = process.env.JWT_SECRET
    
    @IsString()
    readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
    
    @IsString()
    readonly CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
    
    @IsString()
    readonly CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
    
    @IsString()
    readonly CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

    @IsString()
    readonly USER_SERVICE = "USER_SERVICE"
}

export const Config = new Configuration()