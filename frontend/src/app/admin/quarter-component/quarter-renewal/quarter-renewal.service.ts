import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuarterRenewalService {
  public headers: any;
  constructor(
    private appService: AppService,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }



  quarterRenewalCount(callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/quarterRenewalCount`;
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

  applyData(req:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/renewalApplyList`;
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











  //new form temp
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

  getOTP(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/getOTP`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
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
  // End 

  verifyOtp = (req: any, callback: any) =>{
    const ENDPOINT = `${environment.BASE_URL}/api/verifyOTP`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
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

  createUser = (req: any, callback: any) =>{
    const ENDPOINT = `${environment.BASE_URL}/api/createUser`;
    const requestOptions = {
      headers: this.appService.headers,
      requestObject: req
    };
    // console.log("ssssssssssss",req);
    
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

  verifyAadhaar(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/verifyAadhaar`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
      .subscribe({
        next: (response) => callback && callback(response),
        error: (error) => callback && callback(error?.error || error)
      });
  }

  uploadAnx(formData:any, dbId:any, fileType:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/uploadAnx`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Annexure-A uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }

  uploadPan(formData:any, dbId:any, fileType:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/uploadPan`;
    // console.log("mmmmmmmmmmm",formData);
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
          // console.log("Observable is now completed.");
        });
  }


  uploadAdhar(formData:any, dbId:any, fileType:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/uploadAdhar`;
    // const requestOptions = {
    //   headers: this.appService.headers,
    //   method: "post",
    //   requestObject: req
      
      
    // };
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("ADHAR Card uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }


  uploadPhoto(formData:any, dbId:any, fileType:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/uploadPhoto`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Applicant photo uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }


  uploadSign(formData:any, dbId:any, fileType:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/uploadSign`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Applicant signature uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }


  uploadIcard(formData:any, dbId:any, fileType:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/uploadIcard`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Applicant Identity card uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }



  // form 2

  saveQuarterForm(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/quarterRenewalApply`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
      
      
    // };
  };// console.log("mmmmmmmmmmm",requestOptions);
  this.http.post(ENDPOINT, requestOptions)
    .subscribe(
      (response) => {
        this.toastr.success("Form data saved", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response);
      },
      error => {
        this.toastr.error("Form data not saved", "warning!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        // console.log("Observable is now completed.");
      });
  }






  quarterApplyDetails(req:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/quarterApplyDetails`;
    const requestOptions = {
      headers: this.headers,
      method: 'post',
      requestObject: req
    };
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

  uploadOrderFile(formData:any, dbId:any, fileType:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadOrderFile`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Allotment Order uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }

  uploadSideOneImage(formData:any, dbId:any, fileType:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadSideOneImage`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Side 1 Image uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }


  uploadSideTwoImage(formData:any, dbId:any, fileType:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadSideTwoImage`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Side 2 Image uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }

  uploadSideThreeImage(formData:any, dbId:any, fileType:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadSideThreeImage`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Side 3 Image uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }

  uploadSideFourImage(formData:any, dbId:any, fileType:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadSideFourImage`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Side 4 Image uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }


  uploadQtrExtndImage(formData:any, dbId:any, fileType:any, callback:any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadQtrExtndImage`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Allotment Order Image uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }


  saveFinalForm(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/saveFinalForm`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
      
      
    // };
  };// console.log("mmmmmmmmmmm",requestOptions);
  this.http.post(ENDPOINT, requestOptions)
    .subscribe(
      (response) => {
        this.toastr.success("Form submitted succefully", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response);
      },
      error => {
        this.toastr.error("Form not submited", "warning!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        // console.log("Observable is now completed.");
      });
  }




  // upload_signed_copy

  uploadSignedCopy(formData:any, dbId:any, fileType:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/uploadSignedCopy`;
    // console.log("mmmmmmmmmmm",formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("Signed approved copy uploaded", "Success!", {
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
          // console.log("Observable is now completed.");
        });
  }
}
