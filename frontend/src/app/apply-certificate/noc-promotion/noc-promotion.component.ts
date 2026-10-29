import { Component, OnInit } from '@angular/core';
import { NocPromotionService } from './noc-promotion.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { any } from 'underscore';

@Component({
  selector: 'app-noc-promotion',
  templateUrl: './noc-promotion.component.html',
  styleUrls: ['./noc-promotion.component.css'],
  standalone: true,
  imports: [NgxPrintModule, NgxSpinnerModule, RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule],
})

export class NocPromotionComponent implements OnInit{
  public userDetails:any;
  public inputData:any = {
    spouse_qrtr_avail: "",
    spouse_qrtr_no_type: "",
    spouse_qrtr_sctr_loc: "",
    spouse_qrtr_enc: "",
    spouse_qrtr_enc_name: "",
    spouse_qrtr_enc_nature: "",
  }
  public userID:any; 
  public departmentId:any;
  public endpoint: any;
  public data: any;

  public chooseFile: string = "Choose File";
  public pan: string = "Choose File";

  public day: any;
  public month: any;
  public acceptfileType: string = "image";

  public cardData: any;
  public rfrncNo: any;
  public applyDate: any;
  public status: any;
  public remark: any;
  public spouse_qrtr_enc: any;
  public spouse_qrtr_avail: any;
  public spouse_qrtr_enc_name: any;
  public spouse_qrtr_enc_nature: any;
  public spouse_qrtr_no_type: any;
  public spouse_qrtr_sctr_loc: any;
  public userId: any;
  public id: any;

  public cDate: any;


  public uploadImageObject: any = {
    panImg: '',
    adharImg: ''
  }

  constructor(
    private spinner: NgxSpinnerService,
    private NocPromotionService: NocPromotionService,
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
    
    this.NocPromotionService.getUserDetails(this.userID, (callback:any)=>{
      console.log(callback);
      this.data = callback.department_name
      // this.dept_name = callback.department.dept_name;
      console.log("fffffffffff",this.userDetails);
      
    });  
  }

  nocPromotionData(){
    this.NocPromotionService.nocPromotionData(this.userID, (callback:any)=>{
      console.log(callback);
      console.log("fffffffffff",callback);

      if (callback == null) {
        console.log("callback no data");
        
      } else {
        this.cardData = callback;
        this.rfrncNo = callback.referenceNo;
        this.applyDate = callback.applyDate;
        this.status = callback.status;
        this.remark = callback.remark;
        this.spouse_qrtr_enc = callback.spouse_qrtr_enc;
        this.spouse_qrtr_avail = callback.spouse_qrtr_avail;
        this.spouse_qrtr_enc_name = callback.spouse_qrtr_enc_name;
        this.spouse_qrtr_enc_nature = callback.spouse_qrtr_enc_nature;
        this.spouse_qrtr_no_type = callback.spouse_qrtr_no_type;
        this.spouse_qrtr_sctr_loc = callback.spouse_qrtr_sctr_loc;
        this.userId = callback.userId;
        this.id = callback.id;
      }
    });  
  }

  currentDate() {
    var date = new Date();
    this.cDate =this.datePipe.transform(date, 'yyyy-MM-dd');

    return this.cDate;
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
  


  onFileSelect(event: any) {
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 500000) {
      this.uploadImageObject.pan = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      var name = "ANX" + this.convertDate()+"."+fileExtension;

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
    formData.append("applyDate", this.currentDate());
    formData.append("referenceNo",this.convertDate());
    formData.append("userId", this.userID);
    formData.append("file", this.uploadImageObject.image);
    console.log("FORMDATA===", formData);
    this.NocPromotionService.addNocPermission(
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
    if (this.inputData.spouse_qrtr_avail === '' || this.inputData.spouse_qrtr_avail === null || this.inputData.spouse_qrtr_avail === undefined) {
      this.toastr.warning('Please select any one option.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.inputData.spouse_qrtr_avail == "Yes") {
        if(this.inputData.spouse_qrtr_no_type==='' || this.inputData.spouse_qrtr_no_type===null || this.inputData.spouse_qrtr_no_type===undefined){
          this.toastr.warning('Please type quarter type & number.','Warning',{
            disableTimeOut:false
          });
          return false;
        }
        if(this.inputData.spouse_qrtr_sctr_loc==='' || this.inputData.spouse_qrtr_sctr_loc===null || this.inputData.spouse_qrtr_sctr_loc===undefined){
            this.toastr.warning('Please type sector location.','Warning',{
              disableTimeOut:false
            });
            return false;
          }
          if(this.inputData.spouse_qrtr_enc==='' || this.inputData.spouse_qrtr_enc===null || this.inputData.spouse_qrtr_enc===undefined){
            this.toastr.warning('Please select quarter encroached status.','Warning',{
              disableTimeOut:false
            });
            return false;
          }
          if (this.inputData.spouse_qrtr_enc == "Yes") {
            if(this.inputData.spouse_qrtr_enc_name==='' || this.inputData.spouse_qrtr_enc_name===null || this.inputData.spouse_qrtr_enc_name===undefined){
              this.toastr.warning('Please type by whom.','Warning',{
                disableTimeOut:false
              });
              return false;
            }
            if(this.inputData.spouse_qrtr_enc_nature==='' || this.inputData.spouse_qrtr_enc_nature===null || this.inputData.spouse_qrtr_enc_nature===undefined){
              this.toastr.warning('Please type Nature of Encroachment.','Warning',{
                disableTimeOut:false
              });
              return false;
            }
          }
    }
    if (this.uploadImageObject.image === '' || this.uploadImageObject.image === null || this.uploadImageObject.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
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

resetForm() {
    this.inputData.spouse_qrtr_avail == "";
    this.inputData.spouse_qrtr_no_type = "";
    this.inputData.spouse_qrtr_sctr_loc = "";
    this.inputData.spouse_qrtr_enc = "";
    this.inputData.spouse_qrtr_enc_name = "";
    this.inputData.spouse_qrtr_enc_nature = "";
}
}
