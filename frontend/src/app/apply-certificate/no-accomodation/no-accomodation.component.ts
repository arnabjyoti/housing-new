import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NoAccomodationService } from './no-accomodation.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-no-accomodation',
  templateUrl: './no-accomodation.component.html',
  styleUrls: ['./no-accomodation.component.css'],
  standalone: true,
  imports: [NgxPrintModule, NgxSpinnerModule, RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule],
})
export class NoAccomodationComponent implements OnInit{

  public userDetails:any;
  public userID:any; 
  public departmentId:any;
  public endpoint: any;
  public data: any;


  public f_name: any;
  public l_name: any;
  public designation: any;
  public basic_pay: any;
  public phone_no: any;
  public service_status: any;
  public doa: any;
  public transferable: any;
  public dojs: any;
  public dos: any;
  public spouse_f_name: any;
  public spouse_l_name: any;
  public spouse_occ: any;
  public signature: any;


  public inputData:any = {
    spouse_qrtr_avail: "",
    spouse_qrtr_no_type: "",
    spouse_qrtr_sctr_loc: "",
    spouse_qrtr_enc: "",
    spouse_qrtr_enc_name: "",
    spouse_qrtr_enc_nature: "",
    place: "",
  }

  public storeAprvDt: any;
  public storeRnwlDt: any;
  public msg: any;


  public chooseFile: string = "Choose File";

  public day: any;
  public month: any;
  public acceptfileType: string = "image";

  public uploadImageObject: any = {
    panImg: '',
    adharImg: ''
  }
  public pan: string = "Choose File";

  public cDate: any;

  public cardData: any;
  public rfrncNo: any;
  public applyDate: any;
  public place: any;
  public status: any;
  public remark: any;
  public renewalDate: any;
  public approvedDate: any;
  public spouse_qrtr_enc: any;
  public spouse_qrtr_avail: any;
  public spouse_qrtr_enc_name: any;
  public spouse_qrtr_enc_nature: any;
  public spouse_qrtr_no_type: any;
  public spouse_qrtr_sctr_loc: any;
  public userId: any;
  public id: any;

  public reApplyBtn: boolean = true;

  public futureDate: any;


  constructor(
    private spinner: NgxSpinnerService,
    private NoAccomodationService: NoAccomodationService,
    private toastr: ToastrService,
    private datePipe: DatePipe
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
    if(!token.usr.accessKeyword){
      console.log("gggggggggggggggggggggg");
      
      return;
    }
  }



  ngOnInit(): void {
    this.userData();
    this.nocPromotionData();
  }

  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  userData=()=>{
    console.log("userID",this.userID);
    
    this.NoAccomodationService.getUserDetails(this.userID, (callback:any)=>{
      console.log("callback",callback);
      this.data = callback.department_name
      // this.dept_name = callback.department.dept_name;
      console.log("userDetails",this.userDetails);
      console.log("spouse_f_name",this.userDetails.spouse_f_name);


      this.f_name = callback.f_name;
      this.l_name = callback.l_name;
      this.designation = callback.designation;
      this.basic_pay = callback.basic_pay;
      this.phone_no = callback.phone_no;
      this.service_status = callback.service_status;
      this.doa = callback.doa;
      this.transferable = callback.transferable;
      this.dojs = callback.dojs;
      this.dos = callback.dos;
      this.spouse_f_name = callback.spouse_f_name;
      this.spouse_l_name = callback.spouse_l_name;
      this.spouse_occ = callback.spouse_occ;
      this.signature = callback.sign;
      

      
      
    });  
  }


  nocPromotionData(){
    this.NoAccomodationService.noAccomodationData(this.userID, (callback:any)=>{
      console.log(callback);
      console.log("fffffffffff",callback);
      if (callback == null) {
        console.log("callllllll");
        
      }else{
        console.log("vvvvvvv");
        
        this.cardData = callback;
        this.rfrncNo = callback.referenceNo;
        this.applyDate = callback.applyDate;
        this.place = callback.place;
        this.status = callback.status;
        this.remark = callback.remark;
        this.approvedDate = callback.approvedDate;
        this.renewalDate = callback.renewalDate;
        this.spouse_qrtr_enc = callback.spouse_qrtr_enc;
        this.spouse_qrtr_avail = callback.spouse_qrtr_avail;
        this.spouse_qrtr_enc_name = callback.spouse_qrtr_enc_name;
        this.spouse_qrtr_enc_nature = callback.spouse_qrtr_enc_nature;
        this.spouse_qrtr_no_type = callback.spouse_qrtr_no_type;
        this.spouse_qrtr_sctr_loc = callback.spouse_qrtr_sctr_loc;
        this.userId = callback.userId;
        this.id = callback.id;

        if (this.status == "Approved") {
          this.renewalDate = new Date(this.renewalDate).toISOString().slice(0, 10);
          const currentDate= new Date().toISOString().slice(0, 10);

          if (this.renewalDate >= currentDate) {
            console.log('no');
            this.reApplyBtn = false;
            this.msg = "You can submit new request after "+this.renewalDate;
          } else if(this.renewalDate < currentDate) {
            this.reApplyBtn = true;
            console.log('yes');
          }
        }


        if (this.status == "Applied") {
          this.reApplyBtn = false;
        }

        




        // const futureDate = this.addMonths(this.storeAprvDt, 6);
        // console.log("futureDate",futureDate);

       
        
      }
    });  
  }

  // addMonths(storeAprvDt:any, months:any) {
  //   const newDate = new Date(this.storeAprvDt);
  //   newDate.setMonth(newDate.getMonth() + months);
  //   return newDate.toISOString().split('T')[0];
  // }

  currentDate() {
    var date = new Date();
    this.cDate =this.datePipe.transform(date, 'yyyy-MM-dd');

    return this.cDate;
  }

  onSelectQtrAvail(event: any){
    if(this.inputData.spouse_qrtr_avail == "No"){
      this.inputData.spouse_qrtr_no_type = "";
      this.inputData.spouse_qrtr_sctr_loc = "";
      this.inputData.spouse_qrtr_enc = "";
    }
  }

  onSelectQtrenc(event: any){
    if(this.inputData.spouse_qrtr_enc == "No"){
      this.inputData.spouse_qrtr_enc_name = "";
      this.inputData.spouse_qrtr_enc_nature = "";
    }
  }

  saveData() {
    console.log("input data", this.inputData);
    this.spiner();
    let isValid = this.validateInput();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        console.log("res", res);
        if (res == true) {
    const formData = new FormData();

    formData.append("spouse_qrtr_avail", this.inputData.spouse_qrtr_avail);
    formData.append("spouse_qrtr_no_type", this.inputData.spouse_qrtr_no_type);
    formData.append("spouse_qrtr_sctr_loc", this.inputData.spouse_qrtr_sctr_loc);
    formData.append("spouse_qrtr_enc", this.inputData.spouse_qrtr_enc);
    formData.append("spouse_qrtr_enc_name", this.inputData.spouse_qrtr_enc_name);
    formData.append("spouse_qrtr_enc_nature", this.inputData.spouse_qrtr_enc_nature);
    formData.append("place", this.inputData.place);
    formData.append("applyDate", this.currentDate());
    formData.append("referenceNo",this.convertDate());
    formData.append("userId", this.userID);
    formData.append("file", this.uploadImageObject.image);
    console.log("FORMDATA===", formData);
    this.NoAccomodationService.addNoAccomodation(
      formData,
      this.userID,
      this.acceptfileType, (response: any) => {
        console.log("lllllllllll", response.message);
        this.nocPromotionData();
        this.resetForm()
        let ele: any = document.getElementById('modalClose');
              ele.click();
      })
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  });
  }
}

validateInput = () =>{
  console.log("Saving before validate", this.inputData);
    if (this.uploadImageObject.image === '' || this.uploadImageObject.image === null || this.uploadImageObject.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if(this.inputData.place==='' || this.inputData.place===null || this.inputData.place===undefined){
      this.toastr.warning('Please enter your place','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
}

isAllowedFile = (file: any, callback: any) => {
  console.log("call", file.type);
  switch (file.type) {
    case "application/pdf":
      return callback(true);
    default:
      return callback(false);
  }
};

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



  onFileSelect(event: any) {
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 500000) {
      this.uploadImageObject.pan = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
  

      var name = "Non_acco_" + this.convertDate()+"."+fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.pan = this.uploadImageObject.pan
        ? this.uploadImageObject.pan["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 500kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };

  resetForm() {
    this.inputData.spouse_qrtr_avail == "";
    this.inputData.spouse_qrtr_no_type = "";
    this.inputData.spouse_qrtr_sctr_loc = "";
    this.inputData.spouse_qrtr_enc = "";
    this.inputData.spouse_qrtr_enc_name = "";
    this.inputData.spouse_qrtr_enc_nature = "";
}
}
