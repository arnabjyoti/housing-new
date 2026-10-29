import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  public accessKeyword:any=null;

  constructor(
    private toastr: ToastrService,
    private appService: AppService,
    private http: HttpClient,
  ) { 
    let token = JSON.parse(JSON.stringify(localStorage.getItem('token')));
    token = JSON.parse(token);
    this.accessKeyword = token.usr.accessKeyword;
  }

  adminHomeCounter(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/adminHomeCounter`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "get",
    };// console.log("mmmmmmmmmmm",requestOptions);
    this.http.get(ENDPOINT, requestOptions).subscribe(
      (response) => {
        // console.log('Success');
        return callback && callback(response);
      },
      (error) => {
        return callback && callback(error);
      },
      () => {
        // console.log('Observable is now completed.');
      }
    );
  }

  userHomeCounter(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/userHomeCounter`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };// console.log("mmmmmmmmmmm",requestOptions);
    this.http.post(ENDPOINT, requestOptions).subscribe(
      (response) => {
        // console.log('Success');
        return callback && callback(response);
      },
      (error) => {
        return callback && callback(error);
      },
      () => {
        // console.log('Observable is now completed.');
      }
    );
  }
  // End
}
