import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeSensitiveDataInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Handle arrays and single objects
        if (Array.isArray(data)) {
          return data.map((item) => this.excludePasswordDigest(item));
        }
        return this.excludePasswordDigest(data);
      }),
    );
  }

  private excludePasswordDigest(data: any) {
    // Check if the object has the passwordDigest property
    if (data && data.passwordDigest) {
      const { passwordDigest, ...safeData } = data;
      return safeData;
    }
    return data;
  }
}
