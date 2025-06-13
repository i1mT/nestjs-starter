import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { IS_PLAIN_TEXT_KEY } from '../decorator/setMetadata';

/**
 * 响应拦截器，用于统一处理响应数据
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {

  constructor(private reflector: Reflector) {}

  private responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const isPlainText = this.reflector.getAllAndOverride<boolean>(IS_PLAIN_TEXT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPlainText || 
      request.url.startsWith("/api/metrics")
    ) {
      return res;
    }

    return {
      statusCode: response.statusCode,
      data: res,
    };
  }

  private errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.error(exception);

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }
}
