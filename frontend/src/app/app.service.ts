import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public headers: HttpHeaders;

  constructor(
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    // Build Angular HttpHeaders (DOM Headers API had no effect here)
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
      // Note: Access-Control-Allow-Origin is a server response header,
      // setting it on the client has no effect and is removed.
    });
  }

  getData(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/department`;
    this.http.get(ENDPOINT, { headers: this.headers }).subscribe({
      next:  (response) => callback && callback(response),
      error: (error)    => callback && callback(error)
    });
  }

  getProjectById(projectId: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/department`;
    this.http.get(ENDPOINT, { headers: this.headers }).subscribe({
      next:  (response) => callback && callback(response),
      error: (error)    => callback && callback(error)
    });
  }
}

