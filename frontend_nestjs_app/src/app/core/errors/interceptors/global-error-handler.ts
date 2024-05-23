import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LoggingService } from '../../services/logging.service';
import { NotificationService } from '../../services/notification.service';
import { ErrorService } from '../services/error.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private injector: Injector) {}

    handleError(error: Error | HttpErrorResponse) {
        const errorService = this.injector.get(ErrorService);
        const logger = this.injector.get(LoggingService);
        const notifier = this.injector.get(NotificationService);

        let message;
        if (error instanceof HttpErrorResponse) {
            // Server error
            message = errorService.getServerErrorMessage(error);
            notifier.showError(message);
        }else {
            // Client Error
            message = errorService.getClientErrorMessage(error);
            notifier.showError(message);
        }

        //always log errors
        logger.logError(message);
    }
}