import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NocPromotionService {

  public headers: any;
  constructor(
    private appService: AppService,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getUserDetails(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/userDetails`;
    const requestOptions = {
      headers: this.headers,
      method: 'post',
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
      (response) => {
        console.log('Success');
        return callback && callback(response);
      },
      (error) => {
        return callback && callback(error);
      },
      () => {
        console.log('Observable is now completed.');
      }
    );
  }

  nocPromotionData(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/nocPromotionData`;
    const requestOptions = {
      headers: this.headers,
      method: 'post',
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions).subscribe(
      (response) => {
        console.log('Success');
        return callback && callback(response);
      },
      (error) => {
        return callback && callback(error);
      },
      () => {
        console.log('Observable is now completed.');
      }
    );
  }

  addNocPermission(formData: any, dbId: any, fileType: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/addNocPermission`;

    console.log("mmmmmmmmmmm", formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("PAN Card uploaded", "Success!", {
            disableTimeOut: false
          });
          return callback && callback(response);
        },
        error => {
          this.toastr.error("Something went wrong", "warning!", {
            disableTimeOut: false
          });
          return callback && callback(error);
        },
        () => {
          console.log("Observable is now completed.");
        });
  }
}
