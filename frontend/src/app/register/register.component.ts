import { Component, OnInit } from '@angular/core';
import { RegisterService } from "./register.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute, Params, RouterModule } from "@angular/router";
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [NgxSpinnerModule, RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule],
})
export class RegisterComponent implements OnInit{
  departmentName: any;
  returnMsg:any;
  createMsg:any;
  public isRegister: boolean = false;
  showEmailOTPInput: boolean = false;
  showEmailVerify: boolean =false;


  hideMobileInput: boolean = true;
  showMobileVerify: boolean = false;
  showMobileOTPInput: boolean = false;

  public userCredentials:any = {
    f_name: "",
    m_name: "",
    l_name: "",
    gender: "",
    email:"",
    phone_no:"",
    designation: "",
    civic: "",
    civic_charge: "",
    others: "",
    department: "",
    others_dept: "",
    basic_pay: "",
    pay_matrix: "",
    service_status: "",
    transferable: "",
    doa: "",
    dor: "",
    dojs: "",
    dos: "",
    spouse_f_name: "",
    spouse_l_name: "",
    spouse_occ: "",
    spouse_acco: "",
    resid_house: "",
    annexure_a_place: "",
    annexure_a_date: "",
    aadhaar_number: "",
    Emailotp: "",
    Mobileotp: "",
    role: "user"
  }; 
  public aadhaarError: string = "";
  public isAadhaarExist: boolean = false;
  public OTP = {
    otp1: "",
    otp2: "",
  }
  mat0: any;
  mat1: any;

  public uploadImageObject:any={
    panImg:'',
    adharImg: '',
    annexure: null,
    pan: null,
    adhar: null,
    photo: null,
    sign: null,
    idCard: null,
    image: null
  }

  public isSaving: boolean = false;
  public chooseFile: string = "Choose File";
  public annexure: string = "Choose File";
  public pan: string = "Choose File";
  public adhar: string = "Choose File";
  public photo: string = "Choose File";
  public sign: string = "Choose File";
  public idCard: string = "Choose File";
  public day:any;
  public month: any;
  public acceptfileType: string = "image";

  public dbId: any;

  public showSaveData: boolean = false;

  public showAnx: boolean = true;
  public showAnxBtn: boolean = false;
  public showAnxSc: boolean = true;

  public showPan: boolean = true;
  public showPanBtn: boolean = false;
  public showPanSc: boolean = true;

  public showAdhar: boolean = true;
  public showAdharBtn: boolean = false;
  public showAdharSc: boolean = true;

  public showUpload: boolean = true;

  public showPhoto: boolean = true;
  public showPhotoBtn: boolean = false;
  public showPhotoSc: boolean = true;

  public showSign: boolean = true;
  public showSignBtn: boolean = false;
  public showSignSc: boolean = true;

  public showId: boolean = true;
  public showIdBtn: boolean = false;
  public showIdSc: boolean = true;

  public showLogin: boolean = true;

  public myDate: any = new Date();

  public isLodaing = true;

  constructor(
    private RegisterService: RegisterService,
    private toastr: ToastrService,
    private router: Router,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
  ) {
    this.myDate = this.datePipe.transform(this.myDate, "dd-MM-yyyy");
  }

  ngOnInit(): void {
    
    // this.getAllProjects();
    this.department();
    
  }

  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 9000);
  }

  department=()=>{
    let requestObject = {};
    this.RegisterService.getDepartment(requestObject, (callback:any)=>{
      console.log(callback);
      this.departmentName = callback;
    });  
  }
  
  validateEmail = ()=> {
      if (this.returnMsg === "exist") {
        this.toastr.error("Email is already registered", "Warning");
        return false;
      }
    return true;
}

  sendEmailOtp()  {
    let regExp_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regExp_email.test(this.userCredentials.email)) {
      //alert('Enter valid email adress')
      this.toastr.error("Enter valid email address", "Warning");
    } else {
      this.RegisterService.verifyEmail(this.userCredentials.email, (res: any) => {
        this.returnMsg = res.message;
        console.log("lllllllllll",this.returnMsg);
      
      this.validateEmail();
      if (this.validateEmail()) {
        this.mat0 = Math.floor(100000 + Math.random() * 900000);
        console.log("ggg",this.mat0);
        this.userCredentials.Emailotp = this.mat0;
        this.RegisterService.sendEmailOtp(this.userCredentials, (res: any) => {
          this.returnMsg = res.message;
          console.log("lllllllllll",this.returnMsg);
        });
          if (this.mat0 !== "") {
            this.showEmailOTPInput = true;
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

  verifyEmailOtpData() {
    let requestObject = {
      otp: this.OTP.otp1,
    };
    if (requestObject.otp === this.mat0) {
      this.toastr.success('OTP verification Successful.','Success!',{
        disableTimeOut:false
      });
      this.showEmailVerify = true;
      this.hideMobileInput = false;
      this.department();
    } else {
      this.toastr.error('OTP not matched.','Warning',{
        disableTimeOut:false
      });
    }
    console.log("jjjj",requestObject.otp);
    console.log("kkkkkkkk",this.mat0);
    
  }


  sendMobileOtp()  {
    let regExp_phone = /^(\+91[\s-]?)?[6-9]\d{9}$/;
    if (!regExp_phone.test(this.userCredentials.phone_no)) {
      //alert('Enter valid email adress')
      this.toastr.error("Enter valid phone number", "Warning");
    } else {
      this.RegisterService.verifyPhone(this.userCredentials.phone_no, (res: any) => {
        this.returnMsg = res.message;
        console.log("lllllllllll",this.returnMsg);
      
      this.validatePhone();
      if (this.validatePhone()) {
        this.mat1 = Math.floor(100000 + Math.random() * 900000);
        console.log("ggg",this.mat1);
        this.userCredentials.Mobileotp = this.mat1;
        this.RegisterService.sendMobileOtp(this.userCredentials, (res: any) => {
          this.returnMsg = res.message;
          console.log("lllllllllll",this.returnMsg);
        });
          if (this.mat1 !== "") {
            this.showMobileOTPInput = true;
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

  validatePhone = ()=> {
      if (this.returnMsg === "exist") {
        this.toastr.error("Phone number is already registered", "Warning");
        return false;
      }
    return true;
}

verifyMobileOtpData() {
    let requestObject = {
      mobileotp: this.OTP.otp2,
    };
    if (requestObject.mobileotp === this.mat1) {
      this.toastr.success('OTP verification Successful.','Success!',{
        disableTimeOut:false
      });
      this.showMobileVerify = true;
      this.department();
    } else {
      this.toastr.error('OTP not matched.','Warning',{
        disableTimeOut:false
      });
    }
    console.log("jjjj",requestObject.mobileotp);
    console.log("kkkkkkkk",this.mat1);
    
  }

  convertDate() {
    var date = new Date();
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1); // Month starts from 0
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  

  register() {
    this.userCredentials.annexure_a_date = this.myDate;
    this.civic();
    let isValidInputs = this.validateInputs();
    if (isValidInputs) {
      this.isLodaing = true;
          this.spiner();
    this.RegisterService.createUser(this.userCredentials, (res: any) => {
      this.isLodaing = false;
      this.dbId = res.message
      this.showAdhar = false;
      this.showEmailOTPInput = false;
      this.showMobileOTPInput = false;
      this.hideMobileInput
      this.showUpload = false;
    })
  }
  }

  //for Annexure Card
  onFileSelectAnnexure(event:any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800 ) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "ANNEXURE" + this.convertDate() + "." + fileExtension;
      var blob = file.slice(0, file.size, file.type);
      var newFile = new File([blob], name, {type: file.type});
      this.uploadImageObject.annexure = newFile;
      this.uploadImageObject.image = newFile;
      this.annexure = file.name;
    } else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };

  //for PAN Card
  onFileSelect(event:any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800 ) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "PAN" + this.convertDate() + "." + fileExtension;
      var blob = file.slice(0, file.size, file.type);
      var newFile = new File([blob], name, {type: file.type});
      this.uploadImageObject.pan = newFile;
      this.uploadImageObject.image = newFile;
      this.pan = file.name;
    } else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };

  //for Adhar Card
  onFileSelected(event:any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "ADHAR" + this.convertDate() + "." + fileExtension;
      var blob = file.slice(0, file.size, file.type);
      var newFile = new File([blob], name, {type: file.type});
      this.uploadImageObject.adhar = newFile;
      this.uploadImageObject.image = newFile;
      this.adhar = file.name;
    } else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };

  //for Photo
  onFileSelectedPhoto(event:any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "PHOTO" + this.convertDate() + "." + fileExtension;
      var blob = file.slice(0, file.size, file.type);
      var newFile = new File([blob], name, {type: file.type});
      this.uploadImageObject.photo = newFile;
      this.uploadImageObject.image = newFile;
      this.photo = file.name;
    } else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };

  //for Sign
  onFileSelectedsign(event:any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "SIGN" + this.convertDate() + "." + fileExtension;
      var blob = file.slice(0, file.size, file.type);
      var newFile = new File([blob], name, {type: file.type});
      this.uploadImageObject.sign = newFile;
      this.uploadImageObject.image = newFile;
      this.sign = file.name;
    } else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };

  //for ID Card
  onFileSelectedId(event:any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "ID" + this.convertDate() + "." + fileExtension;
      var blob = file.slice(0, file.size, file.type);
      var newFile = new File([blob], name, {type: file.type});
      this.uploadImageObject.idCard = newFile;
      this.uploadImageObject.image = newFile;
      this.idCard = file.name;
    } else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };


  uploadAnx() {
    console.log("Uploading Anx", this.uploadImageObject);
    let isValid = this.validatePan();
    if(isValid){
      this.isLodaing = true;
      this.spiner();
    console.log("input data",this.uploadImageObject);
    const formData = new FormData();
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    formData.append("panImg", this.uploadImageObject.panImg);
    formData.append("adharImg", this.uploadImageObject.adharImg);
    console.log("FORMDATA===", formData);
    console.log("dbid===", this.dbId);
    this.RegisterService.uploadAnx(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) =>{
        this.isLodaing = false;
        this.returnMsg = response.message;
        this.showPan = false;
        this.showAnxSc = false;
        this.showAnxBtn = true;
        this.isSaving = false;
      }
    );
  }else{
    this.isSaving = false;
  }
  }


  uploadPan() {
    let isValid = this.validatePan();
    if(isValid){
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.pan || this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.RegisterService.uploadPan(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showAdhar = false;
          this.showPanSc = false;
          this.showPanBtn = true;
          this.isSaving = false;
        }
      );
    }else{
      this.isSaving = false;
    }
  }


  uploadAdhar() {
    let isValid = this.validateAdhar();
    if(isValid){
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.adhar || this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.RegisterService.uploadAdhar(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showAdharSc = false;
          this.showAdharBtn = true;
          this.showPhoto = false;
          this.isSaving = false;
        }
      );
    }else{
      this.isSaving = false;
    }
  }

  uploadPhoto() {
    let isValid = this.validatePhoto();
    if(isValid){
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.photo || this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.RegisterService.uploadPhoto(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showSign = false;
          this.showPhotoSc = false;
          this.showPhotoBtn = true;
          this.isSaving = false;
        }
      );
    }else{
      this.isSaving = false;
    }
  }


  uploadSign() {
    let isValid = this.validateSign();
    if(isValid){
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.sign || this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.RegisterService.uploadSign(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showId = false;
          this.showSignSc = false;
          this.showSignBtn = true;
          this.isSaving = false;
        }
      );
    }else{
      this.isSaving = false;
    }
  }


  uploadId() {
    let isValid = this.validateId();
    if(isValid){
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.idCard || this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.RegisterService.uploadIcard(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showIdSc = false;
          this.showIdBtn = true;
          this.isSaving = false;
          this.showLogin = false;
        }
      );
    }else{
      this.isSaving = false;
    }
  }


  validateAnx = () => {
    if(!this.uploadImageObject.annexure && !this.uploadImageObject.image){
      this.toastr.warning('Please select Annexure file','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }

  validatePan = () => {
    if(!this.uploadImageObject.pan && !this.uploadImageObject.image){
      this.toastr.warning('Please select PAN Card file','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }

  validateAdhar = () => {
    if(!this.uploadImageObject.adhar && !this.uploadImageObject.image){
      this.toastr.warning('Please select Aadhaar Card file','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }

  validatePhoto = () => {
    if(!this.uploadImageObject.photo && !this.uploadImageObject.image){
      this.toastr.warning('Please select Applicant Photo file','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }

  validateSign = () => {
    if(!this.uploadImageObject.sign && !this.uploadImageObject.image){
      this.toastr.warning('Please select Signature file','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }

  validateId = () => {
    if(!this.uploadImageObject.idCard && !this.uploadImageObject.image){
      this.toastr.warning('Please select Identity Card file','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }

  checkAadhaarUnique() {
    this.aadhaarError = '';
    this.isAadhaarExist = false;
    const aadhaar = this.userCredentials.aadhaar_number ? String(this.userCredentials.aadhaar_number).trim() : '';

    if (!aadhaar) {
      this.aadhaarError = 'Aadhaar number is required.';
      return;
    }

    if (!/^\d{12}$/.test(aadhaar)) {
      this.aadhaarError = 'Aadhaar number must be exactly 12 digits.';
      this.toastr.warning('Aadhaar number must be exactly 12 digits.', 'Warning');
      return;
    }

    this.RegisterService.verifyAadhaar(aadhaar, (res: any) => {
      if (res && (res.message === 'exist' || res.status === false)) {
        this.isAadhaarExist = true;
        this.aadhaarError = 'This Aadhaar number is already registered.';
        this.toastr.error('This Aadhaar number is already registered.', 'Already Registered');
      } else {
        this.isAadhaarExist = false;
        this.aadhaarError = '';
      }
    });
  }

  onAadhaarInput(event: any) {
    const raw = event.target.value || '';
    const clean = raw.replace(/\D/g, '').slice(0, 12);
    this.userCredentials.aadhaar_number = clean;
    event.target.value = clean;
    if (clean.length === 12) {
      this.checkAadhaarUnique();
    } else if (this.isAadhaarExist) {
      this.isAadhaarExist = false;
      this.aadhaarError = '';
    }
  }

  validateInputs = () => {
    console.log("Saving project before validate",this.userCredentials);
    if(this.userCredentials.f_name==='' || this.userCredentials.f_name===null || this.userCredentials.f_name===undefined){
      this.toastr.warning('Please type first name.','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.l_name==='' || this.userCredentials.l_name===null || this.userCredentials.l_name===undefined){
      this.toastr.warning('Please type last name','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.gender==='' || this.userCredentials.gender===null || this.userCredentials.gender===undefined){
      this.toastr.warning('Please select gender','Warning',{
        disableTimeOut:false
      });
      return false;
    }

    const aadhaar = this.userCredentials.aadhaar_number ? String(this.userCredentials.aadhaar_number).trim() : '';
    if (!aadhaar) {
      this.toastr.warning('Please enter 12-digit Aadhaar number.', 'Warning');
      this.aadhaarError = 'Aadhaar number is required.';
      return false;
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      this.toastr.warning('Aadhaar number must be exactly 12 digits.', 'Warning');
      this.aadhaarError = 'Aadhaar number must be exactly 12 digits.';
      return false;
    }
    if (this.isAadhaarExist) {
      this.toastr.error('This Aadhaar number is already registered.', 'Already Registered');
      return false;
    }
  // if(this.userCredentials.phone_no < 1000000000 || this.userCredentials.phone_no > 9999999999){
  //   this.toastr.warning('Please type phone number & must be 10 digits','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
    if(this.userCredentials.designation==='' || this.userCredentials.designation===null || this.userCredentials.designation===undefined){
      this.toastr.warning('Please type designation','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.civic==='' || this.userCredentials.civic===null || this.userCredentials.civic===undefined){
      this.toastr.warning('Please select Civic Charge','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.civic == "Others"){
      if(this.userCredentials.others==='' || this.userCredentials.others===null || this.userCredentials.others===undefined){
        this.toastr.warning('Please type others','Warning',{
          disableTimeOut:false
        });
        return false;
      }
    }
    if(this.userCredentials.department==='' || this.userCredentials.department===null || this.userCredentials.department===undefined){
      this.toastr.warning('Please select department','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.department == "Others"){
      this.userCredentials.department = null;
      if(this.userCredentials.others_dept==='' || this.userCredentials.others_dept===null || this.userCredentials.others_dept===undefined){
        this.toastr.warning('Please specify department name','Warning',{
          disableTimeOut:false
        });
        return false;
      }
    }
    if(this.userCredentials.basic_pay==='' || this.userCredentials.basic_pay===null || this.userCredentials.basic_pay===undefined){
      this.toastr.warning('Please type basic pay','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.pay_matrix==='' || this.userCredentials.pay_matrix===null || this.userCredentials.pay_matrix===undefined){
      this.toastr.warning('Please select Pay Level','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.service_status==='' || this.userCredentials.service_status===null || this.userCredentials.service_status===undefined){
      this.toastr.warning('Please select service status','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.transferable==='' || this.userCredentials.transferable===null || this.userCredentials.transferable===undefined){
      this.toastr.warning('Please select service Transferable / Non-Transferable','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.doa==='' || this.userCredentials.doa===null || this.userCredentials.doa===undefined){
      this.toastr.warning('Please type date of appointment','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.dor==='' || this.userCredentials.dor===null || this.userCredentials.dor===undefined){
      this.toastr.warning('Please type date of retirement','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userCredentials.dojs==='' || this.userCredentials.dojs===null || this.userCredentials.dojs===undefined){
      this.toastr.warning('Please type date of joining service','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    // if(this.userCredentials.dos==='' || this.userCredentials.dos===null || this.userCredentials.dos===undefined){
    //   this.toastr.warning('Please type Date of superannuation','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }

    // if(this.userCredentials.spouse_f_name==='' || this.userCredentials.spouse_f_name===null || this.userCredentials.spouse_f_name===undefined){
    //   this.toastr.warning('Please type spouse first name','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    // if(this.userCredentials.spouse_l_name==='' || this.userCredentials.spouse_l_name===null || this.userCredentials.spouse_l_name===undefined){
    //   this.toastr.warning('Please type spouse last name','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    // if(this.userCredentials.spouse_occ==='' || this.userCredentials.spouse_occ===null || this.userCredentials.spouse_occ===undefined){
    //   this.toastr.warning('Please type spouse occupation','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    // if(this.userCredentials.spouse_acco==='' || this.userCredentials.spouse_acco===null || this.userCredentials.spouse_acco===undefined){
    //   this.toastr.warning('Please select If Spouse is Govt. Employee, whether accommodation is allotted?','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    if(this.userCredentials.resid_house==='' || this.userCredentials.resid_house===null || this.userCredentials.resid_house===undefined){
      this.toastr.warning('Please select Do you own residential house in Capital Complex?','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }


  cancelRegistration = () => {
    this.router.navigate([""]);
  };
  

  civic(){
    if(this.userCredentials.civic == "Others"){
      this.userCredentials.civic_charge = this.userCredentials.others;
    } else {
      this.userCredentials.civic_charge = this.userCredentials.civic;
    }
  }
}
