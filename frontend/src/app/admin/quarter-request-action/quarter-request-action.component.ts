import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuarterRequestActionService } from './quarter-request-action.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quarter-request-action',
  templateUrl: './quarter-request-action.component.html',
  styleUrls: ['./quarter-request-action.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, RouterModule, MatInputModule,FormsModule, MatFormFieldModule, CommonModule],
})
export class QuarterRequestActionComponent implements OnInit{

  public endpoint: any;
  public rqstId: any;


  public sectorData: any;
  public quarterData: any;

  departmentName: any;

  public locationData:any = {
    id: "",
    lcn_name: "",
  };

  public data:any = {
    f_name: '',
    l_name: '',
    gender: '',
    email: '',
    phone_no: '',
    designation: '',
    basic_pay: '',
    service_status: '',
    transferable: '',
    doa: '',
    dor: '',
    dojs: '',
    dos: '',
    spouse_f_name: '',
    spouse_l_name: '',
    spouse_name: '',
    spouse_occ: '',
    spouse_acco: '',
    resid_house: '',
    photo: '',
    sign: '',
    adhar: '',
    identity: '',
    sctr_name: '',
    loc_name: '',
    dept_name: '',
    id: '',
    reference_no: '',
    applyDate: '',
    allot_order: '',
    qrtr_type: '',
    qrtr_no: '',
    status: '',
    verify_date: '',
    appointment: ''
    // loc_id: '',
    // sectr_id: '',
  }

  public inputData:any = {
    status: "",
    remark: "",
  }

  public isLodaing = false;
  public isSaving: boolean = false;



  constructor(
    private QuarterRequestActionService: QuarterRequestActionService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
  ){
    this.endpoint = environment.BASE_URL;
    this.route.paramMap.subscribe(params => {
      this.rqstId = params.get("id");
    });
  }

  ngOnInit(): void {
    this.applicationData();
    this.department();
    // this.location();
  }

  isPdf(filename: string): boolean {
    if (!filename) return false;
    return filename.toLowerCase().endsWith('.pdf');
  }

  isImage(filename: string): boolean {
    if (!filename) return false;
    const lower = filename.toLowerCase();
    return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif') || lower.endsWith('.webp');
  }

  getDocUrl(filename: string): string {
    if (!filename || !this.data || !this.data.user_id) return '';
    return `${this.endpoint}/docs/user/${this.data.user_id}_/${filename}`;
  }

  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 9000);
  }


  applicationData(){
    let requestObject = {};
    this.QuarterRequestActionService.freshApplyData(this.rqstId, (callback:any)=>{
      console.log("callback",callback);
      


      
      // 'id', 'f_name', 'l_name', 'email', 'role', 'phone_no', 'designation', 'departmentId', 'basic_pay', 'service_status', 'transferable', 'doa', 'dor', 'dojs', 'dos', 'spouse_f_name', 'spouse_l_name', 'spouse_occ', 'spouse_acco', 'resid_house','photo', 'sign', 'adhar', 'identity', 
      // let temp:any = [];
        
          this.data.user_id = callback.userId;
          this.data.f_name = callback["user.f_name"],
          this.data.l_name = callback["user.l_name"],
          this.data.gender = callback["user.gender"],
          this.data.email = callback["user.email"],
          this.data.phone_no = callback["user.phone_no"],
          this.data.designation = callback["user.designation"],
          this.data.basic_pay = callback["user.basic_pay"],
          this.data.pay_matrix = callback["user.pay_matrix"],
          this.data.service_status = callback["user.service_status"],
          this.data.transferable = callback["user.transferable"],
          this.data.doa = callback["user.doa"],
          this.data.dor = callback["user.dor"],
          this.data.dojs = callback["user.dojs"],
          this.data.dos = callback["user.dos"],
          this.data.spouse_f_name = callback["user.spouse_f_name"],
          this.data.spouse_l_name = callback["user.spouse_l_name"],
          this.data.spouse_name = this.data.spouse_f_name+" "+this.data.spouse_l_name,
          this.data.spouse_occ = callback["user.spouse_occ"],
          this.data.spouse_acco = callback["user.spouse_acco"],
          this.data.resid_house = callback["user.resid_house"],
          this.data.photo = callback["user.photo"],
          this.data.sign = callback["user.sign"],
          this.data.adhar = callback["user.adhar"],
          this.data.identity = callback["user.identity"],
          this.data.appointment = callback["user.appointment"]

          this.data.sctr_name = callback["sector.sctr_name"],

          this.data.loc_name = callback["location.loc_name"],

          this.data.dept_name = callback["user.department.dept_name"],

          this.data.id = callback.id,
          this.data.reference_no = callback.reference_no,
          this.data.apply_date = callback.apply_date,
          this.data.apply_place = callback.apply_place,
          this.data.anx_a = callback.anx_a,
          

          this.data.status = callback.status,
          this.data.startDate = callback.start_date,
          this.data.renewalDate = callback.renewal_date,
          this.data.remark = callback.remark,
          this.data.verify_date = callback.verify_date;
          this.data.allottedDate = callback.allottedDate,

          this.isLodaing = false;

      console.log("new property=======>>>>>",this.data);
        
      
  });
}


department=()=>{
  let requestObject = {};
  this.QuarterRequestActionService.getDepartment(requestObject, (callback:any)=>{
    console.log(callback);
    this.departmentName = callback;
  });  
}



location=()=>{
  let requestObject = {};
  this.QuarterRequestActionService.getLocation(requestObject, (callback:any)=>{
    console.log("bbbbbbbbbb",callback);
    this.locationData = callback;
    console.log("location details",this.locationData);
    
  });  
}

setLocation(){
  this.QuarterRequestActionService.getSectorData(this.data.loc_id, (callback:any)=>{
    console.log("set location",callback);
    this.sectorData = callback;
  })
}


convertDate() {
  var date = new Date();
  const year = date.getFullYear();
  const month = this.padZero(date.getMonth() + 1); // Month starts from 0
  const day = this.padZero(date.getDate());

  return `${year}-${month}-${day}`
 
}

addOneYear(){
  var date = new Date();
  const year = date.getFullYear() + 3;
  const month = this.padZero(date.getMonth() + 1); // Month starts from 0
  const day = this.padZero(date.getDate());

  return `${year}-${month}-${day}`
}

padZero(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}


accept(){
  this.inputData.rqstId = this.rqstId;
  this.inputData.startDate = this.convertDate();
  this.inputData.renewalDate = this.addOneYear();
  console.log("input data",this.inputData);
  let isValid = this.validateInputs();
  if(isValid){
    this.isLodaing = true;
      this.spiner();
      this.QuarterRequestActionService.acceptFreshQuarter(this.inputData, (res:any)=>{
        this.isLodaing = false;
        this.applicationData();
      })
  }else{
    this.isSaving = false;
  }
}

reject(){
  this.inputData.rqstId = this.rqstId;
  console.log("input data",this.inputData);
  let isValid = this.validateInputs();
  if(isValid){
    this.isLodaing = true;
      this.spiner();
      this.QuarterRequestActionService.rejectFreshQuarter(this.inputData, (res:any)=>{
        this.isLodaing = false;
        this.applicationData();
      })
  }else{
    this.isSaving = false;
  }
}

Verified(){
  this.inputData.rqstId = this.rqstId;
  this.inputData.startDate = this.convertDate();
  console.log("input data",this.inputData);
    this.isLodaing = true;
      this.spiner();
      this.QuarterRequestActionService.verifiedFreshQuarter(this.inputData, (res:any)=>{
        this.isLodaing = false;
        this.applicationData();
      })
}


validateInputs(){
  console.log("Saving before validate",this.inputData);
    if(this.inputData.remark==='' || this.inputData.remark===null || this.inputData.remark===undefined){
      this.toastr.warning('Please type remark','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
}



updateQuarterRequest() {
  if (this.data.spouse_name) {
    const parts = this.data.spouse_name.trim().split(' ');
    this.data.spouse_f_name = parts[0] || '';
    this.data.spouse_l_name = parts.slice(1).join(' ') || '';
  }
  let isValidInputs = this.validateUpdateInputs();
  if (isValidInputs) {
    this.isLodaing = true;
    this.spiner();
    console.log("update data", this.data);
    this.QuarterRequestActionService.updateQuarterRequest(this.data, (res: any) => {
      this.isLodaing = false;
      this.applicationData();
    });
  }
}

civic(){
  if(this.data.civic == "Others"){
    this.data.civic_charge = this.data.others;
  } else {
    this.data.civic_charge = this.data.civic;
  }
}

validateUpdateInputs = () => {
  console.log("Saving project before validate",this.data);
  if(this.data.f_name==='' || this.data.f_name===null || this.data.f_name===undefined){
    this.toastr.warning('Please type first name.','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.l_name==='' || this.data.l_name===null || this.data.l_name===undefined){
    this.toastr.warning('Please type last name','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.gender==='' || this.data.gender===null || this.data.gender===undefined){
    this.toastr.warning('Please select gender','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.designation==='' || this.data.designation===null || this.data.designation===undefined){
    this.toastr.warning('Please type designation','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.basic_pay==='' || this.data.basic_pay===null || this.data.basic_pay===undefined){
    this.toastr.warning('Please type basic pay','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.service_status==='' || this.data.service_status===null || this.data.service_status===undefined){
    this.toastr.warning('Please select service status','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.transferable==='' || this.data.transferable===null || this.data.transferable===undefined){
    this.toastr.warning('Please select service Transferable / Non-Transferable','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.doa==='' || this.data.doa===null || this.data.doa===undefined){
    this.toastr.warning('Please type date of appointment','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.dor==='' || this.data.dor===null || this.data.dor===undefined){
    this.toastr.warning('Please type date of retirement','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.dojs==='' || this.data.dojs===null || this.data.dojs===undefined){
    this.toastr.warning('Please type date of joining service','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.resid_house==='' || this.data.resid_house===null || this.data.resid_house===undefined){
    this.toastr.warning('Please specify residential house / spouse accommodation','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(!this.data.phone_no || this.data.phone_no.toString().length < 10){
    this.toastr.warning('Please type valid phone number (at least 10 digits)','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  return true;
}



confirmAllotment() {
  const confirmed = window.confirm('Are you sure you want to proceed with the allotment?');
  if (confirmed) {
    this.submitAllotment(); // Call your actual function here
  }
}

submitAllotment() {
  // Put your form submission or processing logic here
  console.log('Allotment process submitted');
  // Example:
  // this.apiService.submitAllotment(this.inputData).subscribe(...)

  this.inputData.rqstId = this.rqstId;
  this.inputData.allottedDate = this.convertDate();
  console.log("input data",this.inputData);
    this.isLodaing = true;
      this.spiner();
      this.QuarterRequestActionService.allotedFreshQuarter(this.inputData, (res:any)=>{
        this.isLodaing = false;
        this.applicationData();
      })
}


}
