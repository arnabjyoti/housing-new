import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { nocData } from '../certificate/noc-promotion/noc-promotion.component';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { RepairMaintenanceRequestService } from './repair-maintenance-request.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-repair-maintenance-request',
  templateUrl: './repair-maintenance-request.component.html',
  styleUrls: ['./repair-maintenance-request.component.css'],
  standalone: true,
  imports: [NgxPrintModule,NgxSpinnerModule,RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,FormsModule, MatFormFieldModule,CommonModule],
})
export class RepairMaintenanceRequestComponent implements OnInit{
  public displayedColumns: string[] = ['Sl','name','location','sector','qrtr_type','qrtr_no','status','action'];
  dataSource !: MatTableDataSource<nocData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;



  public selectedRepair: any = {
    dbId: '',
    quarter_no: '',
    loc_name: '',
    sctr_name: '',
    quarter_type: '',
    allotment_order: '',
    door: '',
    door_status: '',
    window: '',
    window_status: '',
    wall: '',
    wall_status: '',
    ceiling: '',
    ceiling_status: '',
    wiring: '',
    wiring_status: '',
    tank: '',
    tank_status: '',
    roof: '',
    roof_status: '',
  };


  formData = {
    door: false,       // Initially null, can be true (Yes) or false (No)
    windows: false,
    walls: false,
    ceiling: false,
    wiring: false,
    septic: false,
    roof: false
  };


   //repair for part 1

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
    basic_pay: "",
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
    otp: "",
    role: "user"
  }; 

  public OTP = {
    otp1: "",
  }
  mat0: any;

  public firstRegForm: boolean =true;

  public showOTPInput: boolean = false;
  public dbId: any;

  public regUpload: boolean = false;
  public myDate: any = new Date();
  public isRegister: boolean = false;

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
  public showRenewalUpload: boolean = false;

  public showPhoto: boolean = true;
  public showPhotoBtn: boolean = false;
  public showPhotoSc: boolean = true;

  public showSign: boolean = true;
  public showSignBtn: boolean = false;
  public showSignSc: boolean = true;

  public showId: boolean = true;
  public showIdBtn: boolean = false;
  public showIdSc: boolean = true;

  public annexure: string = "Choose File";
  public pan: string = "Choose File";
  public adhar: string = "Choose File";
  public photo: string = "Choose File";
  public sign: string = "Choose File";
  public idCard: string = "Choose File";

  public uploadImageObject:any={
    panImg:'',
    adharImg: ''
  }

  public returnMsg:any;
  public isSaving: boolean = false;
  public acceptfileType: string = "image";

  public showVerify: boolean =false;
  public registrationForm:boolean = false;
  public repairForm: boolean = false;

  public showLogin: boolean = true;

  public departmentName: any;
  public locationData:any;



  //repair for part 2

  formDataAdmin = {
    door: false,       // Initially null, can be true (Yes) or false (No)
    windows: false,
    walls: false,
    ceiling: false,
    wiring: false,
    septic: false,
    roof: false
  };

  public locationInputAdmin: any = {
    loc_id: '',
    sec_id: '',
    type: '',
    qtr_no: ''
  }

  public inputForm: boolean = true;

  public locationList: any;
  public sectorList: any;


  public allotment: string = "Choose File";
  public door: string = "Choose File";
  public windows: string = "Choose File";
  public walls: string = "Choose File";
  public ceiling: string = "Choose File";
  public wiring: string = "Choose File";
  public tank: string = "Choose File";
  public roof: string = "Choose File";

  // for image
  public doorImage: any;
  public door_status: any;
  public door_btn: boolean = true;

  public windowImage: any;
  public window_status: any;
  public window_btn: boolean = true;

  public wallImage: any;
  public wall_status: any;
  public wall_btn: boolean = true;

  public ceilingImage: any;
  public ceiling_status:any;
  public ceiling_btn: boolean = true;

  public wiringImage: any;
  public wiring_status: any;
  public wiring_btn: boolean = true;

  public tankImage: any;
  public tank_status: any;
  public tank_btn: boolean = true;

  public roofImage: any;
  public roof_status: any;
  public roof_btn: boolean = true;


  public repairId: any;



  public endpoint: any;

  public isLodaing = true;

  constructor(
    private RepairMaintenanceRequestService: RepairMaintenanceRequestService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ){
    this.endpoint = environment.BASE_URL;

  }
ngOnInit(): void {
  this.RepairList();
  this.department();
  this.location();
}


spiner() {
  this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
  }, 9000);
}

department=()=>{
  let requestObject = {};
  this.RepairMaintenanceRequestService.getDepartment(requestObject, (callback:any)=>{
    console.log(callback);
    this.departmentName = callback;
  });  
}


RepairList(){
  let requestObject = {};
    this.RepairMaintenanceRequestService.RepairList(requestObject, (callback:any)=>{
      console.log("ccccccccccc",callback);
      this.dataSource = new MatTableDataSource(callback);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("datasource",this.dataSource);
  }
  )
}

FilterChange(data:Event){
  const value=(data.target as HTMLInputElement).value;
  this.dataSource.filter=value;
}



downloadPDF() {
  const tableBody = [
    ['S.No', 'Applicant Name', 'Location Name', 'Sector Name', 'Quarter Type', 'Quarter Number'],
    ...this.dataSource.data.map((item: any, index: number) => [
      index + 1,
      item.f_name + ' ' + item.l_name || '',
      item.loc_name || '',
      item.sctr_name || '',
      item.quarter_type || '',
      item.quarter_no || ''
    ])
  ];
  
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [30, 40, 30, 40],
      content: [
        { text: 'Quarter Repair & Maintenance Report', style: 'header' },
        {
          style: 'tableStyle',
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*', '*'], // 7 columns
            body: tableBody
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#CCCCCC' : null,
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#aaa',
            vLineColor: () => '#aaa',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 4,
            paddingBottom: () => 4
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20]
        },
        tableStyle: {
          margin: [0, 5, 0, 15],
          fontSize: 8
        }
      },
      footer: (currentPage: number, pageCount: number) => ({
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'center',
        margin: [0, 10],
        fontSize: 9
      })
    };
  
    (pdfMake as any).createPdf(docDefinition).download('Quarter-Repair-&-Maintenance-Report.pdf');
  }


showRepairModal(row:any) {
  console.log("Selected Project=", row);
  this.selectedRepair = row;
  console.log("hhhhhhhhhhhh",this.selectedRepair.quarter_no);
  

  if (this.selectedRepair.door == null) {
    this.formData.door = false;
  }else{
    this.formData.door = true;
  }

  if (this.selectedRepair.window == null) {
    this.formData.windows = false;
  }else{
    this.formData.windows = true;
  }

  if (this.selectedRepair.wall == null) {
    this.formData.walls = false;
  }else{
    this.formData.walls = true;
  }

  if (this.selectedRepair.ceiling == null) {
    this.formData.ceiling = false;
  }else{
    this.formData.ceiling = true;
  }

  if (this.selectedRepair.wiring == null) {
    this.formData.wiring = false;
  }else{
    this.formData.wiring = true;
  }

  if (this.selectedRepair.tank == null) {
    this.formData.septic = false;
  }else{
    this.formData.septic = true;
  }

  if (this.selectedRepair.roof == null) {
    this.formData.roof = false;
  }else{
    this.formData.roof = true;
  }
};



validateEmail = ()=> {
  if (this.returnMsg === "exist") {
    this.toastr.error("Email is already registered", "Warning");
    return false;
  }
return true;
}

sendOtp()  {
  let regExp_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!regExp_email.test(this.userCredentials.email)) {
    //alert('Enter valid email adress')
    this.toastr.error("Enter valid email address", "Warning");
  } else {
    this.RepairMaintenanceRequestService.verifyEmail(this.userCredentials.email, (res: any) => {
      this.returnMsg = res.message;
      console.log("lllllllllll",this.returnMsg);
    
    this.validateEmail();
    if (this.validateEmail()) {
      this.mat0 = Math.floor(Math.random()*(999-100+1)+100);
      console.log("ggg",this.mat0);
      this.userCredentials.otp = this.mat0;
      this.RepairMaintenanceRequestService.sendOtp(this.userCredentials, (res: any) => {
        this.returnMsg = res.message;
        console.log("lllllllllll",this.returnMsg);
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

verifyOtpData() {
  let requestObject = {
    otp: this.OTP.otp1,
  };
  if (requestObject.otp === this.mat0) {
    this.toastr.success('OTP verification Successful.','Success!',{
      disableTimeOut:false
    });
    this.showVerify = true;
    this.firstRegForm = false;
    this.registrationForm = true;
    this.department();
  } else {
    this.toastr.error('OTP not matched.','Warning',{
      disableTimeOut:false
    });
  }
}

//date convert for image

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


// registration

register() {
  this.userCredentials.annexure_a_date = this.myDate;
  this.civic();
  let isValidInputs = this.validateInputs();
  if (isValidInputs) {
    this.isLodaing = true;
        this.spiner();
  this.RepairMaintenanceRequestService.createUser(this.userCredentials, (res: any) => {
    this.isLodaing = false;
    this.dbId = res.message
    this.showAdhar = false;
    this.showOTPInput = false;
    this.showUpload = false;
    this.regUpload = true;
  })
}
}

civic(){
  if(this.userCredentials.civic == "Others"){
    this.userCredentials.civic_charge = this.userCredentials.others;
  } else {
    this.userCredentials.civic_charge = this.userCredentials.civic;
  }
}


//for Annexure Card
onFileSelectAnnexure(event:any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 204800 ) {
    this.uploadImageObject.annexure = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name= "ANNEXURE"+this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
    var newFile = new File([blob], name, {type: event.target.files[0].type});
    this.uploadImageObject.image = newFile;
    
    this.annexure = this.uploadImageObject.annexure
      ? this.uploadImageObject.annexure["name"]
      : "Choose File";
  }else {
    this.toastr.error('Image size should be less than 200kb','Error',{
      disableTimeOut:false
    });
  }
  return true;
};

//for PAN Card
onFileSelect(event:any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 204800 ) {
    this.uploadImageObject.pan = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name= "PAN"+this.convertDate()+"."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
    var newFile = new File([blob], name, {type: event.target.files[0].type});
    this.uploadImageObject.image = newFile;    
    
    this.pan = this.uploadImageObject.pan
      ? this.uploadImageObject.pan["name"]
      : "Choose File";
  }else {
    this.toastr.error('Image size should be less than 200kb','Error',{
      disableTimeOut:false
    });
  }
  return true;
};


onFileSelected(event:any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
    this.uploadImageObject.adhar = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name= "ADHAR"+this.convertDate()+"."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
    var newFile = new File([blob], name, {type: event.target.files[0].type});
    this.uploadImageObject.image = newFile;

    this.adhar = this.uploadImageObject.adhar
      ? this.uploadImageObject.adhar["name"]
      : "Choose File";
  }else {
    this.toastr.error('Image size should be less than 200kb','Error',{
      disableTimeOut:false
    });
  }
  return true;
};

onFileSelectedPhoto(event:any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
    this.uploadImageObject.photo = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name= "PHOTO"+this.convertDate()+"."+fileExtension;

    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 

    var newFile = new File([blob], name, {type: event.target.files[0].type});
    this.uploadImageObject.image = newFile;

    this.photo = this.uploadImageObject.photo
      ? this.uploadImageObject.photo["name"]
      : "Choose File";
  }else {
    this.toastr.error('Image size should be less than 200kb','Error',{
      disableTimeOut:false
    });
  }
  return true;
};


onFileSelectedsign(event:any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
    this.uploadImageObject.sign = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name= "SIGN"+this.convertDate()+"."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 

    var newFile = new File([blob], name, {type: event.target.files[0].type});
    this.uploadImageObject.image = newFile;

    this.sign = this.uploadImageObject.sign
      ? this.uploadImageObject.sign["name"]
      : "Choose File";
  }else {
    this.toastr.error('Image size should be less than 200kb','Error',{
      disableTimeOut:false
    });
  }
  return true;
};


onFileSelectedId(event:any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
    this.uploadImageObject.idCard = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name= "ID"+this.convertDate()+"."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 
    var newFile = new File([blob], name, {type: event.target.files[0].type});
    this.uploadImageObject.image = newFile;

    this.idCard = this.uploadImageObject.idCard
      ? this.uploadImageObject.idCard["name"]
      : "Choose File";
  }else {
    this.toastr.error('Image size should be less than 200kb','Error',{
      disableTimeOut:false
    });
  }
  return true;
};


uploadAnx() {
  let isValid = this.validatePan();
  if(isValid){
    this.isLodaing = true;
    this.spiner();
  const formData = new FormData();
  formData.append("dbid", this.dbId);
  formData.append("file", this.uploadImageObject.image);
  formData.append("panImg", this.uploadImageObject.panImg);
  formData.append("adharImg", this.uploadImageObject.adharImg);
  this.RepairMaintenanceRequestService.uploadAnx(
    formData,
    this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
    this.returnMsg = response.message;
    this.showPan = false;
    this.showAnxSc = false;
    this.showAnxBtn = true;
    this.uploadImageObject.image = "";
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
  formData.append("file", this.uploadImageObject.image);
  formData.append("panImg", this.uploadImageObject.panImg);
  formData.append("adharImg", this.uploadImageObject.adharImg);
  this.RepairMaintenanceRequestService.uploadPan(
    formData,
    this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
    this.returnMsg = response.message;
    this.showAdhar = false;
    this.showPanSc = false;
    this.showPanBtn = true;
    this.uploadImageObject.image = "";
    this.isSaving = false;
  }
  );
}else{
  this.isSaving = false;
}
}


uploadAdhar() {
  let isValid = this.validatePan();
  if(isValid){
    this.isLodaing = true;
        this.spiner();
  const formData = new FormData();
  formData.append("dbid", this.dbId);
  formData.append("file", this.uploadImageObject.image);
  formData.append("panImg", this.uploadImageObject.panImg);
  formData.append("adharImg", this.uploadImageObject.adharImg);
  this.RepairMaintenanceRequestService.uploadAdhar(
    formData,
    this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
    this.returnMsg = response.message;
    this.showAdharSc = false;
    this.showAdharBtn = true;
    this.showPhoto = false;
    this.uploadImageObject.image = "";
  });
}else{
  this.isSaving = false;
}
}

uploadPhoto() {
  let isValid = this.validatePan();
  if(isValid){
    this.isLodaing = true;
        this.spiner();
  const formData = new FormData();
  formData.append("dbid", this.dbId);
  formData.append("file", this.uploadImageObject.image);
  formData.append("panImg", this.uploadImageObject.panImg);
  formData.append("adharImg", this.uploadImageObject.adharImg);
  this.RepairMaintenanceRequestService.uploadPhoto(
    formData,
    this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
    this.returnMsg = response.message;
    this.showSign = false;
    this.showPhotoSc = false;
    this.showPhotoBtn = true;
    this.uploadImageObject.image = "";
    this.isSaving = false;
  }
  );
}else{
  this.isSaving = false;
}
}


uploadSign() {
  let isValid = this.validatePan();
  if(isValid){
    this.isLodaing = true;
        this.spiner();
  const formData = new FormData();
  formData.append("dbid", this.dbId);
  formData.append("file", this.uploadImageObject.image);
  formData.append("panImg", this.uploadImageObject.panImg);
  formData.append("adharImg", this.uploadImageObject.adharImg);
  this.RepairMaintenanceRequestService.uploadSign(
    formData,
    this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
    this.returnMsg = response.message;
    this.showId = false;
    this.showSignSc = false;
    this.showSignBtn = true;
    this.uploadImageObject.image = "";
    this.isSaving = false;
  }
  );
}else{
  this.isSaving = false;
}
}


uploadId() {
  let isValid = this.validatePan();
  if(isValid){
    this.isLodaing = true;
        this.spiner();
  const formData = new FormData();
  formData.append("dbid", this.dbId);
  formData.append("file", this.uploadImageObject.image);
  formData.append("panImg", this.uploadImageObject.panImg);
  formData.append("adharImg", this.uploadImageObject.adharImg);
  this.RepairMaintenanceRequestService.uploadIcard(
    formData,
    this.dbId,
        this.acceptfileType, (response: any) =>{
          this.isLodaing = false;
    this.returnMsg = response.message;
    // this.showSign = false;
    this.showIdSc = false;
    this.showIdBtn = true;
    this.isSaving = false;
    this.showLogin = false;
    this.showUpload = true;
    this.showVerify = false;
    this.regUpload = false;
    this.repairForm = true;
    this.registrationForm = false;
    // console.log("regInput",this.regInput);
    
    // this.resetDoc();
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

validateInputs = () => {
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
if(this.userCredentials.phone_no < 1000000000 || this.userCredentials.phone_no > 9999999999){
  this.toastr.warning('Please type phone number & must be 10 digits','Warning',{
    disableTimeOut:false
  });
  return false;
}
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
  if(this.userCredentials.basic_pay==='' || this.userCredentials.basic_pay===null || this.userCredentials.basic_pay===undefined){
    this.toastr.warning('Please type basic pay','Warning',{
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
  if(this.userCredentials.resid_house==='' || this.userCredentials.resid_house===null || this.userCredentials.resid_house===undefined){
    this.toastr.warning('Please select Do you own residential house in Capital Complex?','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  return true;
}












// repair form

location=()=>{
  let requestObject = {};
  this.RepairMaintenanceRequestService.getLocation(requestObject, (callback:any)=>{
    console.log("bbbbbbbbbb",callback);
    this.locationList = callback;
    console.log("location details",this.locationList);
    // this.resetForm();
  });  
}

setLocation(){
  this.RepairMaintenanceRequestService.getSectorData(this.locationInputAdmin.loc_id, (callback:any)=>{
    console.log("set location",callback);
    this.sectorList = callback;
  })
}



// Allotment order image select

onFileSelectedAllotment(event: any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
    this.uploadImageObject.allotment = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name = "AO_" + this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
    var newFile = new File([blob], name, { type: event.target.files[0].type });
    this.uploadImageObject.image = newFile;
    this.allotment = this.uploadImageObject.allotment
      ? this.uploadImageObject.allotment["name"]
      : "Choose File";
  } else {
    this.toastr.error('Image size should be less than 2 MB', 'Error', {
      disableTimeOut: false
    });
  }
  return true;
};



uploadAllotment() {
  console.log("locationInputAdmin", this.locationInputAdmin);
  console.log("Uploading photo", this.uploadImageObject);
  let isValid = this.validateAllotmentData();
  if (isValid) {
    this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
      if (res == true) {
    this.isLodaing = true;
    this.spiner();
    console.log("input data", this.uploadImageObject);
    const formData = new FormData();
    formData.append("qtr_no", this.locationInputAdmin.qtr_no);
    formData.append("loc_id", this.locationInputAdmin.loc_id);
    formData.append("sec_id", this.locationInputAdmin.sec_id);
    formData.append("type", this.locationInputAdmin.type);
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    this.RepairMaintenanceRequestService.uploadAllotment(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) => {
        this.isLodaing = false;
        console.log("response",response);        
        this.returnMsg = response.message;
        if(this.returnMsg == null){
          this.inputForm = true;
        }else{
          this.repairId = this.returnMsg;
          this.inputForm = false;
        }
        this.uploadImageObject.image = "";
        this.isSaving = false;
        // this.getuserDataById();
         this.RepairList();
      }
    );
  } else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
}
);
  } else {
    this.isSaving = false;
  }

}


validateAllotmentData = () => {
  if (this.locationInputAdmin.qtr_no === '' || this.locationInputAdmin.qtr_no === null || this.locationInputAdmin.qtr_no === undefined) {
    this.toastr.warning('Please select quarter number', 'Warning', {
      disableTimeOut: false
    });
    return false;
  }
  if (this.locationInputAdmin.loc_id === '' || this.locationInputAdmin.loc_id === null || this.locationInputAdmin.loc_id === undefined) {
    this.toastr.warning('Please select location', 'Warning', {
      disableTimeOut: false
    });
    return false;
  }
  if (this.locationInputAdmin.sec_id === '' || this.locationInputAdmin.sec_id === null || this.locationInputAdmin.sec_id === undefined) {
    this.toastr.warning('Please select sector', 'Warning', {
      disableTimeOut: false
    });
    return false;
  }
  if (this.locationInputAdmin.type === '' || this.locationInputAdmin.type === null || this.locationInputAdmin.type === undefined) {
    this.toastr.warning('Please select type', 'Warning', {
      disableTimeOut: false
    });
    return false;
  }
  if (this.uploadImageObject.image === '' || this.uploadImageObject.image === null || this.uploadImageObject.image === undefined) {
    this.toastr.warning('Please select photo', 'Warning', {
      disableTimeOut: false
    });
    return false;
  }
  return true;
}

validateAllotment = () => {
  if (this.uploadImageObject.image === '' || this.uploadImageObject.image === null || this.uploadImageObject.image === undefined) {
    this.toastr.warning('Please select photo', 'Warning', {
      disableTimeOut: false
    });
    return false;
  }
  return true;
}

// Door order image select

onFileSelectedDoor(event: any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
    this.uploadImageObject.door = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name = "door_" + this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
    var newFile = new File([blob], name, { type: event.target.files[0].type });
    this.uploadImageObject.image = newFile;
    this.door = this.uploadImageObject.door
      ? this.uploadImageObject.door["name"]
      : "Choose File";
  } else {
    this.toastr.error('Image size should be less than 2 MB', 'Error', {
      disableTimeOut: false
    });
  }
  return true;
};


uploadDoor() {
  console.log("locationInputAdmin", this.locationInputAdmin);
  console.log("Uploading photo", this.uploadImageObject);
  let isValid = this.validateAllotment();
  if (isValid) {
    this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
      if (res == true) {
    this.isLodaing = true;
    this.spiner();
    console.log("input data", this.uploadImageObject);
    const formData = new FormData();
    formData.append("repairId", this.repairId);
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    this.RepairMaintenanceRequestService.uploadDoor(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) => {
        this.isLodaing = false;
        this.returnMsg = response.message;
        this.uploadImageObject.image = "";
        this.isSaving = false;
        this.door_btn = false;
        // this.getuserDataById();
         this.RepairList();
      }
    );
  } else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
}
);
  } else {
    this.isSaving = false;
  }

}

// Windows order image select

onFileSelectedWindows (event: any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
    this.uploadImageObject.windows = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name = "windows _" + this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
    var newFile = new File([blob], name, { type: event.target.files[0].type });
    this.uploadImageObject.image = newFile;
    this.windows = this.uploadImageObject.windows
      ? this.uploadImageObject.windows["name"]
      : "Choose File";
  } else {
    this.toastr.error('Image size should be less than 2 MB', 'Error', {
      disableTimeOut: false
    });
  }
  return true;
};



uploadWindow() {
  console.log("locationInputAdmin", this.locationInputAdmin);
  console.log("Uploading photo", this.uploadImageObject);
  let isValid = this.validateAllotment();
  if (isValid) {
    this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
      if (res == true) {
    this.isLodaing = true;
    this.spiner();
    console.log("input data", this.uploadImageObject);
    const formData = new FormData();
    formData.append("repairId", this.repairId);
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    this.RepairMaintenanceRequestService.uploadWindow(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) => {
        this.isLodaing = false;
        this.returnMsg = response.message;
        this.uploadImageObject.image = "";
        this.isSaving = false;
        this.window_btn = false;
        
        // this.getuserDataById();
         this.RepairList();
      }
    );
  } else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
}
);
  } else {
    this.isSaving = false;
  }

}


// Walls  order image select

onFileSelectedWalls (event: any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
    this.uploadImageObject.walls = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name = "walls_" + this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
    var newFile = new File([blob], name, { type: event.target.files[0].type });
    this.uploadImageObject.image = newFile;
    this.walls = this.uploadImageObject.walls
      ? this.uploadImageObject.walls["name"]
      : "Choose File";
  } else {
    this.toastr.error('Image size should be less than 2 MB', 'Error', {
      disableTimeOut: false
    });
  }
  return true;
};



uploadWall() {
  console.log("locationInputAdmin", this.locationInputAdmin);
  console.log("Uploading photo", this.uploadImageObject);
  let isValid = this.validateAllotment();
  if (isValid) {
    this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
      if (res == true) {
    this.isLodaing = true;
    this.spiner();
    console.log("input data", this.uploadImageObject);
    const formData = new FormData();
    formData.append("repairId", this.repairId);
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    this.RepairMaintenanceRequestService.uploadWall(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) => {
        this.isLodaing = false;
        this.returnMsg = response.message;
        this.uploadImageObject.image = "";
        this.isSaving = false;
        this.wall_btn = false;
        // this.getuserDataById();
         this.RepairList();
      }
    );
  } else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
}
);
  } else {
    this.isSaving = false;
  }

}



// Ceiling   order image select

onFileSelectedCeiling (event: any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
    this.uploadImageObject.ceiling = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name = "ceiling_" + this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
    var newFile = new File([blob], name, { type: event.target.files[0].type });
    this.uploadImageObject.image = newFile;
    this.ceiling = this.uploadImageObject.ceiling
      ? this.uploadImageObject.ceiling["name"]
      : "Choose File";
  } else {
    this.toastr.error('Image size should be less than 2 MB', 'Error', {
      disableTimeOut: false
    });
  }
  return true;
};




uploadCeiling() {
  console.log("locationInputAdmin", this.locationInputAdmin);
  console.log("Uploading photo", this.uploadImageObject);
  let isValid = this.validateAllotment();
  if (isValid) {
    this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
      if (res == true) {
    this.isLodaing = true;
    this.spiner();
    console.log("input data", this.uploadImageObject);
    const formData = new FormData();
    formData.append("repairId", this.repairId);
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    this.RepairMaintenanceRequestService.uploadCeiling(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) => {
        this.isLodaing = false;
        this.returnMsg = response.message;
        this.uploadImageObject.image = "";
        this.isSaving = false;
        this.ceiling_btn = false;
        // this.getuserDataById();
         this.RepairList();
      }
    );
  } else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
}
);
  } else {
    this.isSaving = false;
  }

}


// Wiring order image select

onFileSelectedWiring (event: any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
    this.uploadImageObject.wiring = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name = "wiring_" + this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
    var newFile = new File([blob], name, { type: event.target.files[0].type });
    this.uploadImageObject.image = newFile;
    this.wiring = this.uploadImageObject.wiring
      ? this.uploadImageObject.wiring["name"]
      : "Choose File";
  } else {
    this.toastr.error('Image size should be less than 2 MB', 'Error', {
      disableTimeOut: false
    });
  }
  return true;
};



uploadWiring() {
  console.log("locationInputAdmin", this.locationInputAdmin);
  console.log("Uploading photo", this.uploadImageObject);
  let isValid = this.validateAllotment();
  if (isValid) {
    this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
      if (res == true) {
    this.isLodaing = true;
    this.spiner();
    console.log("input data", this.uploadImageObject);
    const formData = new FormData();
    formData.append("repairId", this.repairId);
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    this.RepairMaintenanceRequestService.uploadWiring(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) => {
        this.isLodaing = false;
        this.returnMsg = response.message;
        this.uploadImageObject.image = "";
        this.isSaving = false;
        this.wiring_btn = false;
        // this.getuserDataById();
         this.RepairList();
      }
    );
  } else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
}
);
  } else {
    this.isSaving = false;
  }

}


// Tank order image select

onFileSelectedTank (event: any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
    this.uploadImageObject.tank = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name = "tank_" + this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
    var newFile = new File([blob], name, { type: event.target.files[0].type });
    this.uploadImageObject.image = newFile;
    this.tank = this.uploadImageObject.tank
      ? this.uploadImageObject.tank["name"]
      : "Choose File";
  } else {
    this.toastr.error('Image size should be less than 2 MB', 'Error', {
      disableTimeOut: false
    });
  }
  return true;
};



uploadTank() {
  console.log("locationInputAdmin", this.locationInputAdmin);
  console.log("Uploading photo", this.uploadImageObject);
  let isValid = this.validateAllotment();
  if (isValid) {
    this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
      if (res == true) {
    this.isLodaing = true;
    this.spiner();
    console.log("input data", this.uploadImageObject);
    const formData = new FormData();
    formData.append("repairId", this.repairId);
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    this.RepairMaintenanceRequestService.uploadTank(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) => {
        this.isLodaing = false;
        this.returnMsg = response.message;
        this.uploadImageObject.image = "";
        this.isSaving = false;
        this.tank_btn = false;
        // this.getuserDataById();
         this.RepairList();
      }
    );
  } else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
}
);
  } else {
    this.isSaving = false;
  }

}



// roof order image select

onFileSelectedRoof (event: any) {
  if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
    this.uploadImageObject.roof = event.target.files[0];
    const file = event.target.files[0];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    var name = "roof_" + this.convertDate()+ "."+fileExtension;
    var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
    var newFile = new File([blob], name, { type: event.target.files[0].type });
    this.uploadImageObject.image = newFile;
    this.roof = this.uploadImageObject.roof
      ? this.uploadImageObject.roof["name"]
      : "Choose File";
  } else {
    this.toastr.error('Image size should be less than 2 MB', 'Error', {
      disableTimeOut: false
    });
  }
  return true;
};



uploadRoof() {
  console.log("locationInputAdmin", this.locationInputAdmin);
  console.log("Uploading photo", this.uploadImageObject);
  let isValid = this.validateAllotment();
  if (isValid) {
    this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
      if (res == true) {
    this.isLodaing = true;
    this.spiner();
    console.log("input data", this.uploadImageObject);
    const formData = new FormData();
    formData.append("repairId", this.repairId);
    formData.append("dbid", this.dbId);
    formData.append("file", this.uploadImageObject.image);
    this.RepairMaintenanceRequestService.uploadRoof(
      formData,
      this.dbId,
      this.acceptfileType, (response: any) => {
        this.isLodaing = false;
        this.returnMsg = response.message;
        this.uploadImageObject.image = "";
        this.isSaving = false;
        this.roof_btn = false;
        // this.getuserDataById();
         this.RepairList();
      }
    );
  } else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
}
);
  } else {
    this.isSaving = false;
  }

}




isAllowedFile = (file: any, callback: any) => {
  console.log("call", file.type);
  switch (file.type) {
    case "image/jpg":
    case "image/png":
    case "image/jpeg":
      return callback(true);
    default:
      return callback(false);
  }
};
}
