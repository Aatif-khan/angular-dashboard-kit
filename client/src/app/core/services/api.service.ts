import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private unwrapResponse<T>(res: any): T {
    if (res && res.success === true && 'data' in res) {
      return res.data;
    }
    return res;
  }

  get<T>(path: string, params: any = {}): Observable<T> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
    return this.http.get<any>(`${this.baseUrl}/${path}`, { params: httpParams }).pipe(
      map(res => this.unwrapResponse<T>(res))
    );
  }

  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<any>(`${this.baseUrl}/${path}`, body).pipe(
      map(res => this.unwrapResponse<T>(res))
    );
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<any>(`${this.baseUrl}/${path}`, body).pipe(
      map(res => this.unwrapResponse<T>(res))
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<any>(`${this.baseUrl}/${path}`).pipe(
      map(res => this.unwrapResponse<T>(res))
    );
  }

  patch<T>(path: string, body: any = {}): Observable<T> {
    return this.http.patch<any>(`${this.baseUrl}/${path}`, body).pipe(
      map(res => this.unwrapResponse<T>(res))
    );
  }
}
