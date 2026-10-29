import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as _ from 'underscore';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public userObject: any;
  
  constructor(
    private appService: AppService,
    private http: HttpClient,
  ) { }

  verifyEmail(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/verifyEmail`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
      
      
    };// console.log("mmmmmmmmmmm",requestOptions);
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          return callback && callback(response);
        },
        error => {
          return callback && callback(error);
        },
        () => {
          // console.log("Observable is now completed.");
        });
  }

  verifyPhone(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/verifyPhone`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
      
      
    };// console.log("mmmmmmmmmmm",requestOptions);
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          return callback && callback(response);
        },
        error => {
          return callback && callback(error);
        },
        () => {
          // console.log("Observable is now completed.");
        });
  }

  sendOtp(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/sendOtp`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
      
      
    };// console.log("mmmmmmmmmmm",requestOptions);
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          return callback && callback(response);
        },
        error => {
          return callback && callback(error);
        },
        () => {
          // console.log("Observable is now completed.");
        });
  }


  sendMobileOtp(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/sendMobileOtp`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
      
      
    };console.log("mmmmmmmmmmm",requestOptions);
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          return callback && callback(response);
        },
        error => {
          return callback && callback(error);
        },
        () => {
          console.log("Observable is now completed.");
        });
  }

  loginVerify(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/authenticate`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
    // console.log("+++++++++++", req);
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          return callback && callback(response);
        },
        error => {

          return callback && callback(error);

        },
        () => {
        });
  }

  checkAccessRight(accessRight:any) {
    let userData = JSON.parse(JSON.stringify(localStorage.getItem('token')));

    let found = null;
    if (!_.isEmpty(userData)) {
      const privilegs = JSON.parse(userData).privileges || [];
      found = _.find(privilegs, (p) => {
        return p['privilege.slug'] == accessRight;
      });
      // console.log("hhhhhhhhhhhhhhhh",privilegs);
      
      if (found) {
        return true;
      }
      return false;
    }
    return false;
  }

  return_HasApplyQuarterRight() {
    return this.checkAccessRight('apply_quarter');
  }

  return_HasAddDepartmentRight(){
    return this.checkAccessRight('add_department');
  }

  return_HasAddQuarterRight(){
    return this.checkAccessRight('add_quarter');
  }

  return_UserObject() {
    return this.userObject;
  }
}
