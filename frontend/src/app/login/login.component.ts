import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  returnMsg: any;
  createMsg: any;
  showVerify: boolean = false;
  public isLogin: boolean = false;
  public isRegister: boolean = false;
  showOTPInput: boolean = false;

  public inputData = {
    f_name: "",
    m_name: "",
    l_name: "",
    email: "",
    phone_no: "",
    password: "",
    otp: "",
    Mobileotp: ""
  }
  public OTP = {
    otp1: "",
  }
  mat0: any;

  mat1: any;

  selectedValue: 'mobile' | 'email' = 'email';

  constructor(
    private LoginService: LoginService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) { }
  ngOnInit(): void {

    this.checkToken();

  }

  checkToken() {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getUser();
      const userRole = (user?.role || '').toLowerCase();
      const aadhaarNumber = user?.aadhaar_number;

      if (userRole !== 'admin' && (!aadhaarNumber || String(aadhaarNumber).trim() === '')) {
        this.toastr.info('Please insert your Aadhaar number in your profile.', 'Aadhaar Required');
        this.router.navigate(['/profile']);
      } else {
        console.log("Valid 15-day session found, navigating to home");
        this.router.navigate(['/home']);
      }
    }
    else {
      console.log("No active or unexpired token");
    }
  }

  validateEmail = () => {
    if (this.returnMsg === "notExist") {
      this.toastr.error("Email is not registered", "Warning");
      return false;
    }
    return true;
  }

  checkButton() {
    console.log("selectedValue", this.selectedValue);

    if (this.selectedValue === 'email') {
      this.sendEmailOtp();
    }
    else if (this.selectedValue === 'mobile') {
      this.sendMobileOtp();
    }
  }

  sendEmailOtp() {
    let regExp_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regExp_email.test(this.inputData.email)) {
      //alert('Enter valid email adress')
      this.toastr.error("Enter valid email address", "Warning");
    } else {
      this.LoginService.verifyEmail(this.inputData.email, (res: any) => {
        this.returnMsg = res.message;
        console.log("lllllllllll", res);

        this.validateEmail();
        if (this.validateEmail()) {
          this.mat0 = Math.floor(100000 + Math.random() * 900000);
          console.log("ggg", this.mat0);
          this.inputData.otp = this.mat0;
          this.inputData.phone_no = res.data.phone_no;
          console.log("oooooooooooooooo", this.inputData);
          this.LoginService.sendOtp(this.inputData, (res: any) => {
            this.returnMsg = res.message;
            if (this.returnMsg == "success") {
              this.toastr.success("OTP has been send");
            } else {
              this.toastr.error("OTP not send");
            }
            console.log("pppppppppppp", res);
          });
          if (this.mat0 !== "") {
            this.showOTPInput = true;
          } else {
            this.toastr.error(
              "Oops! Something went wrong. Please try again",
              "Warning"
            );
          }
        }
      });
    }
  }


  sendMobileOtp() {
    console.log("check");

    let regExp_phone = /^\d{10}$/;
    this.inputData.phone_no = this.inputData.email;
    const phone = String(this.inputData.phone_no).trim();

    if (!regExp_phone.test(phone)) {
      this.toastr.error("Enter valid phone number", "Warning");
    } else {
      this.LoginService.verifyPhone(this.inputData.phone_no, (res: any) => {
        this.returnMsg = res.message;
        console.log("lllllllllll", this.returnMsg);

        this.validatePhone();
        if (this.validatePhone()) {
          this.mat0 = Math.floor(100000 + Math.random() * 900000);
          console.log("ggg", this.mat0);
          this.inputData.Mobileotp = this.mat0;
          this.inputData.phone_no = res.data.phone_no;
          console.log("oooooooooooooooo", this.inputData);
          this.LoginService.sendMobileOtp(this.inputData, (res: any) => {
            this.returnMsg = res.message;
            if (this.returnMsg == "success") {
              this.toastr.success("OTP has been send");
            } else {
              this.toastr.error("OTP not send");
            }
            console.log("pppppppppppp", res);
          });
          if (this.mat0 !== "") {
            this.showOTPInput = true;
          } else {
            this.toastr.error(
              "Oops! Something went wrong. Please try again",
              "Warning"
            );
          }
        }
      });
    }
  }

  validatePhone = () => {
    if (this.returnMsg === "notExist") {
      this.toastr.error("Mobile number is not registered", "Warning");
      return false;
    }
    return true;
  }

  verifyOtpData() {
    let requestObject = {
      otp: this.OTP.otp1,
    };
    if (requestObject.otp === this.mat0) {
      this.toastr.success('OTP verification Successful.', 'Success!', {
        disableTimeOut: false
      });
      this.showVerify = true;
      this.LoginService.loginVerify(this.inputData, (res: any) => {
        this.isLogin = false;
        if (res.status == true) {
          let data = res.message;
          console.log("Login verified successfully:", res);

          // Save session with 15-day JWT token and auto-logout timer
          this.authService.saveSession(data, res.token || res.jwt_token);

          const userObj = data?.usr || {};
          const userRole = (userObj?.role || '').toLowerCase();
          const aadhaarNumber = userObj?.aadhaar_number;

          if (userRole !== 'admin' && (!aadhaarNumber || String(aadhaarNumber).trim() === '')) {
            this.toastr.warning('Please insert your Aadhaar number to complete your profile.', 'Aadhaar Required', {
              timeOut: 6000
            });
            console.log("Aadhaar empty for non-admin, navigating to profile");
            window.location.href = "/profile";
          } else {
            console.log("Navigating to home");
            window.location.href = "/home";
          }
        }
      });
    } else {
      this.toastr.error('OTP not matched.', 'Warning', {
        disableTimeOut: false
      });
    }
    console.log("jjjj", requestObject.otp);
    console.log("kkkkkkkk", this.mat0);

  }


  setCache = async () => {
    const newCache = await caches.open("new-cache");
    let obj = {
      id: 1,
      name: "ADRP"
    };
    newCache.add("yes");
  };

}
