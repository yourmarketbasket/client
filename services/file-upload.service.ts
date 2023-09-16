import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  // the upload api
  baseurl = 'http://localhost:3000/upload';

  // upload a file
  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', this.baseurl, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
  constructor(private http: HttpClient) { }
}
