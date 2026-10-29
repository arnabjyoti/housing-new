import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepairMaintenanceRequestService {
  public headers: any;

  constructor(
    private appService: AppService,
    private http: HttpClient,
    private toastr: ToastrService) { }

    RepairList(req:any, callback:any) {
      const ENDPOINT = `${environment.BASE_URL}/api/RepairList`;
      const requestOptions = {
        headers: this.headers,
        method: 'post'
      };
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



    getDepartment(req:any, callback:any) {
      const ENDPOINT = `${environment.BASE_URL}/api/department`;
      const requestOptions = {
        headers: this.headers,
        method: 'post'
      };
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


    createUser = (req: any, callback: any) =>{
      const ENDPOINT = `${environment.BASE_URL}/api/createUser`;
      const requestOptions = {
        headers: this.appService.headers,
        requestObject: req
      };
      console.log("ssssssssssss",req);
      
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

    uploadAnx(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadAnx`;
      console.log("mmmmmmmmmmm",formData);
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
            console.log("Observable is now completed.");
          });
    }
  
    uploadPan(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadPan`;
      console.log("mmmmmmmmmmm",formData);
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
  
  
    uploadAdhar(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadAdhar`;
      // const requestOptions = {
      //   headers: this.appService.headers,
      //   method: "post",
      //   requestObject: req
        
        
      // };
      console.log("mmmmmmmmmmm",formData);
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
            console.log("Observable is now completed.");
          });
    }
  
  
    uploadPhoto(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadPhoto`;
      console.log("mmmmmmmmmmm",formData);
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
            console.log("Observable is now completed.");
          });
    }
  
  
    uploadSign(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadSign`;
      console.log("mmmmmmmmmmm",formData);
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
            console.log("Observable is now completed.");
          });
    }
  
  
    uploadIcard(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadIcard`;
      console.log("mmmmmmmmmmm",formData);
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
            console.log("Observable is now completed.");
          });
    }









    // repair maintanace part


    getLocation(req:any, callback:any) {
      const ENDPOINT = `${environment.BASE_URL}/api/getLocation`;
      const requestOptions = {
        headers: this.headers,
        method: 'post'
      };
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
    
  
    getSectorData(req:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/getSectorData/${req}`;
      const requestOptions = {
        headers: this.headers,
        method: 'get'
      };
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
  
  
  
  
    uploadAllotment(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadAllotment`;   
        
      console.log("mmmmmmmmmmm",formData);
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
            console.log("Observable is now completed.");
          });
    }
  
  
  
    uploadDoor(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadDoor`;   
        
      console.log("mmmmmmmmmmm",formData);
      this.http.post(ENDPOINT, formData)
        .subscribe(
          (response) => {
            this.toastr.success("Door image uploaded", "Success!", {
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
  
  
    uploadWindow(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadWindow`;   
        
      console.log("mmmmmmmmmmm",formData);
      this.http.post(ENDPOINT, formData)
        .subscribe(
          (response) => {
            this.toastr.success("Windows image uploaded", "Success!", {
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
  
  
    uploadWall(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadWall`;   
        
      console.log("mmmmmmmmmmm",formData);
      this.http.post(ENDPOINT, formData)
        .subscribe(
          (response) => {
            this.toastr.success("Walls image uploaded", "Success!", {
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
  
  
    uploadCeiling(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadCeiling`;   
        
      console.log("mmmmmmmmmmm",formData);
      this.http.post(ENDPOINT, formData)
        .subscribe(
          (response) => {
            this.toastr.success("Ceiling image  uploaded", "Success!", {
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
  
  
  
    uploadWiring(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadWiring`;   
        
      console.log("mmmmmmmmmmm",formData);
      this.http.post(ENDPOINT, formData)
        .subscribe(
          (response) => {
            this.toastr.success("Electrical Wiring Image uploaded", "Success!", {
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
  
  
    uploadTank(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadTank`;   
        
      console.log("mmmmmmmmmmm",formData);
      this.http.post(ENDPOINT, formData)
        .subscribe(
          (response) => {
            this.toastr.success("Septic Tank Image uploaded", "Success!", {
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
  
  
    uploadRoof(formData:any, dbId:any, fileType:any, callback:any){
      const ENDPOINT = `${environment.BASE_URL}/api/uploadRoof`;   
        
      console.log("mmmmmmmmmmm",formData);
      this.http.post(ENDPOINT, formData)
        .subscribe(
          (response) => {
            this.toastr.success("Roof Image uploaded", "Success!", {
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
