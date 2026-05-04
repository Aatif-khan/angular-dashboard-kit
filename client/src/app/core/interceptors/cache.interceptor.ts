import { HttpInterceptorFn } from '@angular/common/http';
export const cacheInterceptor: HttpInterceptorFn = (req, next) => next(req);
