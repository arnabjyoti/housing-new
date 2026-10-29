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
getNocPromotionData(req:any, callback:any) {
  const ENDPOINT = `${environment.BASE_URL}/api/getNocPromotionData`;
  const requestOptions = {
    headers: this.headers,
    method: 'post'
  };console.log("mmmmmmmmmmm",requestOptions);
  this.http.get(ENDPOINT, requestOptions).subscribe(
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




nocPromotionCount(callback: any) {
  const ENDPOINT = `${environment.BASE_URL}/api/nocPromotionCount`;
  const requestOptions = {
    headers: this.appService.headers,
    method: "get",
  };console.log("mmmmmmmmmmm",requestOptions);
  this.http.get(ENDPOINT, requestOptions).subscribe(
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
}
