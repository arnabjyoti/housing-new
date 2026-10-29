import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuarterService {
  public headers: any;
  constructor(
    private appService: AppService,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }


  getDepartment(req:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/department`;
    const requestOptions = {
      headers: this.headers,
      method: 'post'
    };
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
  
  getQuarter(req:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getQuarter`;
    const requestOptions = {
      headers: this.headers,
      method: 'post'
    };
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


  updateQuarter(formData:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updateQuarterData`;   
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          // console.log("response",response);
          
          this.toastr.success("Quarter data updated", "Success!", {
            disableTimeOut: false
          });
          return callback && callback(response);
        },
        error => {
          // console.log("response",error);
          this.toastr.error(error.error.message, "warning!", {
            disableTimeOut: false
          });
          return callback && callback(error);
        },
        () => {
          // console.log("Observable is now completed.");
        });
  }

  updateFreshQuarter(formData:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updateFreshQuarter`;   
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          // console.log("response",response);
          
          this.toastr.success("Quarter data updated", "Success!", {
            disableTimeOut: false
          });
          return callback && callback(response);
        },
        error => {
          // console.log("response",error);
          this.toastr.error(error.error.message, "warning!", {
            disableTimeOut: false
          });
          return callback && callback(error);
        },
        () => {
          // console.log("Observable is now completed.");
        });
  }


  updateQuarterAllotment(formData:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updateQuarterAllotment`;   
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          // console.log("response",response);
          
          this.toastr.success("Quarter data updated", "Success!", {
            disableTimeOut: false
          });
          return callback && callback(response);
        },
        error => {
          // console.log("response",error);
          this.toastr.error(error.error.message, "warning!", {
            disableTimeOut: false
          });
          return callback && callback(error);
        },
        () => {
          // console.log("Observable is now completed.");
        });
  }

  getApprovedApplyData(req:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/renewalApprovedList`;
    const requestOptions = {
      headers: this.headers,
      method: 'post'
    };
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

  getApproveFreshData(req:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getApproveFreshData`;
    const requestOptions = {
      headers: this.headers,
      method: 'post'
    };
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

  getLocation(req:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getLocation`;
    const requestOptions = {
      headers: this.headers,
      method: 'post'
    };
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

  getSectorData(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/getSectorData/${req}`;
    const requestOptions = {
      headers: this.headers,
      method: 'get'
    };
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

  checkQuarter(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/checkQuarter/${req}`;
    const requestOptions = {
      headers: this.headers,
      method: 'get'
    };
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


  // addQuarter(req:any, callback:any){
  //   const ENDPOINT = `${environment.BASE_URL}/api/addQuarter`;
  //   const requestOptions = {
  //     headers: this.appService.headers,
  //     method: "post",
  //     requestObject: req
      
  // };// console.log("mmmmmmmmmmm",requestOptions);
  // this.http.post(ENDPOINT, requestOptions)
  //   .subscribe(
  //     (response) => {
  //       this.toastr.success("Quarter added", "Success!", {
  //         disableTimeOut: false
  //       });
  //       return callback && callback(response);
  //     },
  //     error => {
  //       this.toastr.error("Quarter not added", "warning!", {
  //         disableTimeOut: false
  //       });
  //       return callback && callback(error);
  //     },
  //     () => {
  //       // console.log("Observable is now completed.");
  //     });
  // }



  uploadAllotment(formData:any, fileType:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/addQuarter`;   
      
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          // console.log("response",response);
          
          this.toastr.success("Image uploaded", "Success!", {
            disableTimeOut: false
          });
          return callback && callback(response);
        },
        error => {
          // console.log("response",error);
          this.toastr.error(error.error.message, "warning!", {
            disableTimeOut: false
          });
          return callback && callback(error);
        },
        () => {
          // console.log("Observable is now completed.");
        });
  }

  deleteQuarter(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/deleteQuarter`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
    .subscribe(
      (response) => {
        this.toastr.success((response as any).message || "Deletion request submitted", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response);
      },
      error => {
        this.toastr.error(error.error?.message || "Deletion request was not submitted", "warning!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        // console.log("Observable is now completed.");
      });
  }



  updateQuarterWithPhotos(formData: any, fileType:any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updatePhoto2`;
  
    // console.log("FormData being sent:", formData);
    
    this.http.post(ENDPOINT, formData).subscribe(
      (response) => {
        // console.log("Update response", response);
        this.toastr.success("Quarter updated with photos", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response);
      },
      (error) => {
        // console.log("Update error", error);
        this.toastr.error(error.error.message || "Something went wrong", "Error!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        // console.log("Observable is now completed.");
      }
    );
  }



  updateQuarterAllotedPhoto(formData: any, fileType:any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updateQuarterAllotedPhoto`;
  
    // console.log("FormData being sent:", formData);
    
    this.http.post(ENDPOINT, formData).subscribe(
      (response) => {
        // console.log("Update response", response);
        this.toastr.success("Quarter updated with photos", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response);
      },
      (error) => {
        // console.log("Update error", error);
        this.toastr.error(error.error.message || "Something went wrong", "Error!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        // console.log("Observable is now completed.");
      }
    );
  }
  

}
