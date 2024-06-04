import { ArgumentsHost, Catch, HttpException, HttpStatus,  } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        if (exception instanceof HttpException) {
            response.status(exception.getStatus()).json({
                statusCode:  exception.getStatus(),
                message: exception.message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode:  HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error',
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}