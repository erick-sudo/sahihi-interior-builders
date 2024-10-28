import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class KnownPrismaClientRequestErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // console.log(`CODE.......................${exception.name}`, exception.code);

    if (exception.code === 'P2025') {
      return response.status(404).json({
        statusCode: 404,
        message: exception.message,
        error: 'Not Found',
      });
    }

    throw exception;
  }
}
