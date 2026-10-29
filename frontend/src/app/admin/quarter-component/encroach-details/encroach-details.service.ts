import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncroachDetailsService {
  public headers: any;
  constructor(
    private appService: AppService,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  getDepartment(req: any, callback: any) {
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

  getLocation(req: any, callback: any) {
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

  getSectorData(req: any, callback: any) {
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

  checkQuarter(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/checkQuarter/${req}`;
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

  encroachData(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/encroachData`;
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


  saveEncroachData(req: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/addEncroachment`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req


      // };
    }; console.log("mmmmmmmmmmm", requestOptions);
    this.http.post(ENDPOINT, requestOptions)
      .subscribe(
        (response) => {
          this.toastr.success("Encroachment applied", "Success!", {
            disableTimeOut: false
          });
          return callback && callback(response);
        },
        error => {
          this.toastr.error("Encroachment not applied", "warning!", {
            disableTimeOut: false
          });
          return callback && callback(error);
        },
        () => {
          console.log("Observable is now completed.");
        });
  }


  uploadImgOne(formData: any, dbId: any, fileType: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadEncImgOne`;
    console.log("mmmmmmmmmmm", formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("image 1 uploaded", "Success!", {
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

  uploadImgTwo(formData: any, dbId: any, fileType: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadEncImgTwo`;
    console.log("mmmmmmmmmmm", formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("image 2 uploaded", "Success!", {
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
  uploadImgThree(formData: any, dbId: any, fileType: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadEncImgThree`;
    console.log("mmmmmmmmmmm", formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("image 3 uploaded", "Success!", {
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
  uploadImgFour(formData: any, dbId: any, fileType: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadEncImgFour`;
    console.log("mmmmmmmmmmm", formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("image 4 uploaded", "Success!", {
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



  uploadImgFive(formData: any, dbId: any, fileType: any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/uploadEncImgFive`;
    console.log("mmmmmmmmmmm", formData);
    this.http.post(ENDPOINT, formData)
      .subscribe(
        (response) => {
          this.toastr.success("image 5 uploaded", "Success!", {
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


  updateEncroach(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/updateEncroach`;
    const requestOptions = {
      headers: this.appService.headers,
      method: "post",
      requestObject: req
    };
    this.http.post(ENDPOINT, requestOptions)
    .subscribe(
      (response) => {
        this.toastr.success("Encroach data updated", "Success!", {
          disableTimeOut: false
        });
        return callback && callback(response);
      },
      error => {
        this.toastr.error("Encroach data not updated", "warning!", {
          disableTimeOut: false
        });
        return callback && callback(error);
      },
      () => {
        // console.log("Observable is now completed.");
      });
  }


  updateEncroachWithPhotos(formData: any, fileType:any, callback: any) {
    const ENDPOINT = `${environment.BASE_URL}/api/updateEncroachWithPhotos`;
  
    // console.log("FormData being sent:", formData);
    
    this.http.post(ENDPOINT, formData).subscribe(
      (response) => {
        // console.log("Update response", response);
        this.toastr.success("Encroachment updated with photos", "Success!", {
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


  deleteEncroach(req:any, callback:any){
    const ENDPOINT = `${environment.BASE_URL}/api/deleteEncroach`;
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
}
