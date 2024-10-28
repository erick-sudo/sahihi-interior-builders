import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class KnownPrismaClientRequestErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // console.log(`CODE.......................${exception.name}`, exception.code);

    // Resource not found handler
    if (exception.code === 'P2025') {
      const model = exception.meta?.modelName;
      return response.status(404).json({
        statusCode: 404,
        message: `${model} not found.`,
        error: 'Not Found',
      });
    }

    // Conflict handler
    if (exception.code === 'P2002') {
      const target = exception.meta?.target;
      const conflictMessage = `A record with this ${target} already exists.`;

      return response.status(409).json({
        statusCode: 409,
        message: conflictMessage,
        error: 'Conflict',
      });
    }

    throw exception;
  }
}
