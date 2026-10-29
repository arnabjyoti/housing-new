import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ProfileService } from './profile.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule],
})
export class ProfileComponent implements OnInit{

  public endpoint: any;
  public userID:any;
  public userDetails:any; 
  public departmentId:any;
  public data: any;
  public departmentName: any;
  public isLodaing = true;

  public userData:any = {
    id: '',
    f_name: "",
    l_name: "",
    departmentId: "",
    department_name: "",
    phone_no:"",
    designation: "",
    department: "",
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
    photo: "",
  }; 
  public aadhaarError: string = "";
  public isAadhaarExist: boolean = false; 


  public day:any;
  public month: any;

  public sign: string = "Choose File";
  public adhar: string = "Choose File";
  public photo: string = "Choose File";
  public idCard: string = "Choose File";
  public appointment: string = "Choose File";

  public uploadImageObject:any={
    panImg:'',
    adharImg: ''
  }
  public acceptfileType: string = "image";
  public isSaving: boolean = false;
  returnMsg:any;

  constructor(
    private route: ActivatedRoute,
    private ProfileService: ProfileService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ){
    this.endpoint = environment.BASE_URL;
    this.init();
  }
  init = () =>{
    let token = JSON.parse(JSON.stringify(localStorage.getItem('token')));
    token = JSON.parse(token);
    this.userDetails = token['usr'];
    this.userID = this.userDetails.id;
    this.departmentId = this.userDetails.departmentId;
    console.log("Token=", token);
    // if(!token.usr.accessKeyword){
    //   console.log("gggggggggggggggggggggg");
      
    //   return;
    // }
  }

  ngOnInit(): void {
    this.UserDetails();
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
    this.ProfileService.getDepartment(requestObject, (callback:any)=>{
      console.log("department",callback);
      this.departmentName = callback;
    });  
  }

  UserDetails=()=>{
    console.log("userID",this.userID);
    
    this.ProfileService.getUserDetails(this.userID, (callback:any)=>{
      console.log("callback",callback);
      this.userData = callback;
      // this.dept_name = callback.department.dept_name;
      console.log("fffffffffff",this.userData);
      
      const role = (this.userDetails?.role || '').toLowerCase();
      if (role !== 'admin' && (!this.userData?.aadhaar_number || String(this.userData.aadhaar_number).trim() === '')) {
        this.toastr.warning('Please insert your 12-digit Aadhaar number to complete your profile.', 'Aadhaar Required', {
          timeOut: 8000
        });
        setTimeout(() => {
          const editBtn = document.querySelector('[data-target="#editProfile"]') as HTMLElement;
          if (editBtn) editBtn.click();
        }, 500);
      }
    });  
  }

  checkAadhaarUnique() {
    this.aadhaarError = '';
    this.isAadhaarExist = false;
    const aadhaar = this.userData.aadhaar_number ? String(this.userData.aadhaar_number).trim() : '';

    if (!aadhaar) {
      this.aadhaarError = 'Aadhaar number is required.';
      return;
    }

    if (!/^\d{12}$/.test(aadhaar)) {
      this.aadhaarError = 'Aadhaar number must be exactly 12 digits.';
      this.toastr.warning('Aadhaar number must be exactly 12 digits.', 'Warning');
      return;
    }

    this.ProfileService.verifyAadhaar(aadhaar, this.userID, (res: any) => {
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
    this.userData.aadhaar_number = clean;
    event.target.value = clean;
    if (clean.length === 12) {
      this.checkAadhaarUnique();
    } else if (this.isAadhaarExist) {
      this.isAadhaarExist = false;
      this.aadhaarError = '';
    }
  }

  updateUser() {
    this.userData.department = this.departmentName.id;
    console.log("vvvvvvvvvvvvvv",this.userData);
    
    let isValidInputs = this.validateInputs();
    if (isValidInputs) {
      this.isLodaing = true;
      this.spiner();
      this.ProfileService.updateUserData(this.userData, (res: any) => {
        this.isLodaing = false;
        if (res && res.status === false) {
          this.toastr.error(res.message || 'Failed to update profile', 'Error');
          return;
        }
        this.authService.updateUserSession({ aadhaar_number: this.userData.aadhaar_number });
        this.toastr.success('Profile and Aadhaar number updated successfully!', 'Success');
        this.UserDetails();
        let ele: any = document.getElementById('userModalClose');
        if (ele) ele.click();
      });
    }
  }

  validateInputs = () => {
    console.log("Saving project before validate",this.userData);
    if(this.userData.f_name==='' || this.userData.f_name===null || this.userData.f_name===undefined){
      this.toastr.warning('Please type first name.','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.l_name==='' || this.userData.l_name===null || this.userData.l_name===undefined){
      this.toastr.warning('Please type last name','Warning',{
        disableTimeOut:false
      });
      return false;
    }

    const aadhaar = this.userData.aadhaar_number ? String(this.userData.aadhaar_number).trim() : '';
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
  if(this.userData.phone_no < 1000000000 || this.userData.phone_no > 9999999999){
    this.toastr.warning('Please type phone number & must be 10 digits','Warning',{
      disableTimeOut:false
    });
    return false;
  }
    if(this.userData.designation==='' || this.userData.designation===null || this.userData.designation===undefined){
      this.toastr.warning('Please type designation','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.departmentId==='' || this.userData.departmentId===null || this.userData.departmentId===undefined){
      this.toastr.warning('Please select department','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.basic_pay==='' || this.userData.basic_pay===null || this.userData.basic_pay===undefined){
      this.toastr.warning('Please type basic pay','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.pay_matrix==='' || this.userData.pay_matrix===null || this.userData.pay_matrix===undefined){
      this.toastr.warning('Please select Pay Level','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.service_status==='' || this.userData.service_status===null || this.userData.service_status===undefined){
      this.toastr.warning('Please select service status','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.transferable==='' || this.userData.transferable===null || this.userData.transferable===undefined){
      this.toastr.warning('Please select service Transferable / Non-Transferable','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.doa==='' || this.userData.doa===null || this.userData.doa===undefined){
      this.toastr.warning('Please type date of appointment','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.dor==='' || this.userData.dor===null || this.userData.dor===undefined){
      this.toastr.warning('Please type date of retirement','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.userData.dojs==='' || this.userData.dojs===null || this.userData.dojs===undefined){
      this.toastr.warning('Please type date of joining service','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    // if(this.userData.dos==='' || this.userData.dos===null || this.userData.dos===undefined){
    //   this.toastr.warning('Please type Date of superannuation','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    
    // if(this.userData.spouse_f_name==='' || this.userData.spouse_f_name===null || this.userData.spouse_f_name===undefined){
    //   this.toastr.warning('Please type spouse first name','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    // if(this.userData.spouse_l_name==='' || this.userData.spouse_l_name===null || this.userData.spouse_l_name===undefined){
    //   this.toastr.warning('Please type spouse last name','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    // if(this.userData.spouse_occ==='' || this.userData.spouse_occ===null || this.userData.spouse_occ===undefined){
    //   this.toastr.warning('Please type spouse occupation','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    // if(this.userData.spouse_acco==='' || this.userData.spouse_acco===null || this.userData.spouse_acco===undefined){
    //   this.toastr.warning('Please select If Spouse is Govt. Employee, whether accommodation is allotted?','Warning',{
    //     disableTimeOut:false
    //   });
    //   return false;
    // }
    if(this.userData.resid_house==='' || this.userData.resid_house===null || this.userData.resid_house===undefined){
      this.toastr.warning('Please select Do you own residential house in Capital Complex?','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
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
  


  onFileSelectedsign(event:any) {
    console.log("onFileSelected",event.target.files);
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.sign = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();


      var name= "SIGN"+this.convertDate()+ "."+fileExtension;
      console.log("name",name);

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
      console.log("blob",blob);

      var newFile = new File([blob], name, {type: event.target.files[0].type});
      console.log("newfile",newFile);
      this.uploadImageObject.image = newFile;

      this.sign = this.uploadImageObject.sign
        ? this.uploadImageObject.sign["name"]
        : "Choose File";
      console.log("Choose", this.sign);
      console.log("imgObject===", this.uploadImageObject);
    }else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };



  uploadSign() {
    console.log("Uploading Sign", this.uploadImageObject);
    let isValid = this.validatePan();
    if(isValid){
      this.isLodaing = true;
          this.spiner();
    console.log("input data",this.uploadImageObject);
    const formData = new FormData();
    formData.append("dbid", this.userID);
    formData.append("file", this.uploadImageObject.image);
    formData.append("panImg", this.uploadImageObject.panImg);
    formData.append("adharImg", this.uploadImageObject.adharImg);
    console.log("FORMDATA===", formData);
    console.log("dbid===", this.userID);
    this.ProfileService.uploadSign(
      formData,
      this.userID,
          this.acceptfileType, (response: any) =>{
            this.isLodaing = false;
      this.returnMsg = response.message;
      console.log("lllllllllll",this.userID);
      
      this.uploadImageObject.image = "";
      this.isSaving = false;
      this.UserDetails();
      let ele: any = document.getElementById('signModalClose');
        ele.click();
    }
    );
  }else{
    this.isSaving = false;
  }
  }


  onFileSelectedPhoto(event:any) {
    console.log("onFileSelected",event.target.files);
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.photo = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();


      var name= "PHOTO"+this.convertDate()+ "."+fileExtension;
      console.log("name",name);

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
      console.log("blob",blob);

      var newFile = new File([blob], name, {type: event.target.files[0].type});
      console.log("newfile",newFile);
      this.uploadImageObject.image = newFile;

      this.photo = this.uploadImageObject.photo
        ? this.uploadImageObject.photo["name"]
        : "Choose File";
      console.log("Choose", this.photo);
      console.log("imgObject===", this.uploadImageObject);
    }else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };


  onFileSelected(event:any) {
    console.log("onFileSelected",event.target.files);
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.adhar = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();


      var name= "ADHAR"+this.convertDate()+ "."+fileExtension;
      console.log("name",name);

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
      console.log("blob",blob);

      var newFile = new File([blob], name, {type: event.target.files[0].type});
      console.log("newfile",newFile);
      this.uploadImageObject.image = newFile;

      this.adhar = this.uploadImageObject.adhar
        ? this.uploadImageObject.adhar["name"]
        : "Choose File";
      console.log("Choose", this.adhar);
      console.log("imgObject===", this.uploadImageObject);
    }else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };


  onFileSelectedId(event:any) {
    console.log("onFileSelectedId",event.target.files);
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.idCard = event.target.files[0];

      const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();


      var name= "ID"+this.convertDate()+ "."+fileExtension;
      console.log("name",name);

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
      console.log("blob",blob);

      var newFile = new File([blob], name, {type: event.target.files[0].type});
      console.log("newfile",newFile);
      this.uploadImageObject.image = newFile;

      this.idCard = this.uploadImageObject.idCard
        ? this.uploadImageObject.idCard["name"]
        : "Choose File";
      console.log("Choose", this.idCard);
      console.log("imgObject===", this.uploadImageObject);
    }else {
      this.toastr.error('Image size should be less than 200kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };


  onFileSelectedAppointment(event:any) {
    console.log("onFileSelectedAppointment",event.target.files);
    if (event.target.files.length > 0 && event.target.files[0].size < 2195800) {
      this.uploadImageObject.appointment = event.target.files[0];

      const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();


      var name= "APPOINT_ORDER"+this.convertDate()+ "."+fileExtension;
      console.log("name",name);

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
      console.log("blob",blob);

      var newFile = new File([blob], name, {type: event.target.files[0].type});
      console.log("newfile",newFile);
      this.uploadImageObject.image = newFile;

      this.appointment = this.uploadImageObject.appointment
        ? this.uploadImageObject.appointment["name"]
        : "Choose File";
      console.log("Choose", this.appointment);
      console.log("imgObject===", this.uploadImageObject);
    }else {
      this.toastr.error('Image size should be less than 2MB','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };




  uploadAdhar() {
    console.log("Uploading Adhar", this.uploadImageObject);
    let isValid = this.validatePan();
    if(isValid){
      this.isLodaing = true;
          this.spiner();
    console.log("input data",this.uploadImageObject);
    const formData = new FormData();
    formData.append("dbid", this.userID);
    formData.append("file", this.uploadImageObject.image);
    formData.append("panImg", this.uploadImageObject.panImg);
    formData.append("adharImg", this.uploadImageObject.adharImg);
    console.log("FORMDATA===", formData);
    console.log("dbid===", this.userID);
    this.ProfileService.uploadAdhar(
      formData,
      this.userID,
          this.acceptfileType, (response: any) =>{
            this.isLodaing = false;
      this.returnMsg = response.message;
      console.log("lllllllllll",this.userID);
      this.uploadImageObject.image = "";
      this.UserDetails();
      let ele: any = document.getElementById('adharModalClose');
        ele.click();
    });
  }else{
    this.isSaving = false;
  }
  }


  uploadId() {
    console.log("Uploading id", this.uploadImageObject);
    let isValid = this.validatePan();
    if(isValid){
      this.isLodaing = true;
          this.spiner();
    console.log("input data",this.uploadImageObject);
    const formData = new FormData();
    formData.append("dbid", this.userID);
    formData.append("file", this.uploadImageObject.image);
    formData.append("panImg", this.uploadImageObject.panImg);
    formData.append("adharImg", this.uploadImageObject.adharImg);
    console.log("FORMDATA===", formData);
    console.log("dbid===", this.userID);
    this.ProfileService.uploadIcard(
      formData,
      this.userID,
          this.acceptfileType, (response: any) =>{
            this.isLodaing = false;
      this.returnMsg = response.message;
      console.log("lllllllllll",this.userID);
      this.uploadImageObject.image = "";
      this.UserDetails();
      let ele: any = document.getElementById('idModalClose');
        ele.click();
    }
    );
  }else{
    this.isSaving = false;
  }
  }



  uploadPhoto() {
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validatePan();
    if(isValid){
      this.isLodaing = true;
          this.spiner();
    console.log("input data",this.uploadImageObject);
    const formData = new FormData();
    formData.append("dbid", this.userID);
    formData.append("file", this.uploadImageObject.image);
    formData.append("panImg", this.uploadImageObject.panImg);
    formData.append("adharImg", this.uploadImageObject.adharImg);
    console.log("FORMDATA===", formData);
    console.log("dbid===", this.userID);
    this.ProfileService.uploadPhoto(
      formData,
      this.userID,
          this.acceptfileType, (response: any) =>{
            this.isLodaing = false;
      this.returnMsg = response.message;
      console.log("lllllllllll",this.userID);
      this.uploadImageObject.image = "";
      this.isSaving = false;
      this.UserDetails();
      let ele: any = document.getElementById('photoModalClose');
        ele.click();
    }
    );
  }else{
    this.isSaving = false;
  }
  }


  uploadAppointment() {
    console.log("Uploading appointment", this.uploadImageObject);
    let isValid = this.validatePan();
    if(isValid){
      this.isLodaing = true;
          this.spiner();
    console.log("input data",this.uploadImageObject);
    const formData = new FormData();
    formData.append("dbid", this.userID);
    formData.append("file", this.uploadImageObject.image);
    formData.append("panImg", this.uploadImageObject.panImg);
    formData.append("adharImg", this.uploadImageObject.adharImg);
    console.log("FORMDATA===", formData);
    console.log("dbid===", this.userID);
    this.ProfileService.uploadAppointment(
      formData,
      this.userID,
          this.acceptfileType, (response: any) =>{
            this.isLodaing = false;
      this.returnMsg = response.message;
      console.log("lllllllllll",this.userID);
      this.uploadImageObject.image = "";
      this.UserDetails();
      let ele: any = document.getElementById('idModalClose');
        ele.click();
    }
    );
  }else{
    this.isSaving = false;
  }
  }


  validatePan = () =>{
    if(this.uploadImageObject.image==='' || this.uploadImageObject.image===null || this.uploadImageObject.image===undefined){
      this.toastr.warning('Please select photo','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }
}
