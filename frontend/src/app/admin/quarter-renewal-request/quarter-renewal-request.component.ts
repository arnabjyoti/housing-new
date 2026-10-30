import { Component, OnInit, ViewChild } from '@angular/core';
import { QuarterRenewalRequestService } from './quarter-renewal-request.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

export interface requestData {
  id: string,
  user_name: string,
  dept_name: string,
  apply_date: string,
  reference_no: string
}

@Component({
  selector: 'app-quarter-renewal-request',
  templateUrl: './quarter-renewal-request.component.html',
  styleUrls: ['./quarter-renewal-request.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule, RouterModule],
})
export class QuarterRenewalRequestComponent implements OnInit{
  public displayedColumns: string[] = ['Sl','user_name','dept_name','apply_date','reference_no','action'];
  // public dataSource = [];
  dataSource !: MatTableDataSource<requestData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  public endpoint: any;

  public rqstId: any;


  public locationData: any[] = [];
  public sectorData: any[] = [];

  public data:any = {
    f_name: '',
    l_name: '',
    gender: '',
    email: '',
    phone_no: '',
    designation: '',
    basic_pay: '',
    pay_matrix: '',
    service_status: '',
    transferable: '',
    doa: '',
    dor: '',
    dojs: '',
    dos: '',
    spouse_f_name: '',
    spouse_l_name: '',
    spouse_occ: '',
    spouse_acco: '',
    resid_house: '',
    photo: '',
    sign: '',
    adhar: '',
    identity: '',
    sctr_name: '',
    sctr_id: '',
    loc_name: '',
    loc_id: '',
    dept_name: '',
    id: '',
    reference_no: '',
    applyDate: '',
    allot_order: '',
    qrtr_type: '',
    qrtr_no: '',
    qrtr_letitude: '',
    qrtr_longitude: '',
    photo_1: '',
    photo_2: '',
    photo_3: '',
    photo_4: '',
    d_w: '',
    e_w: '',
    r_c: '',
    s_q: '',
    s_t: '',
    qtr_extnd: '',
    type_of_strc: '',
    area_extnd_strc: '',
    extnd_prmsn: '',
    extnd_doc: '',
    strc_nearby: '',
    strc_by_whm: '',
    strc_distance: '',
    strc_type: '',
    strc_allot: '',
    strc_area: '',
    strc_storeys: '',
    strc_photo: '',

    status: '',
    
  }

  public inputData:any = {
    status: "",
    remark: "",
  }

  public map_loc: any;

  public isLodaing: boolean = false;
  public isSaving: boolean = false;

  constructor(
    private QuarterRenewalRequestService: QuarterRenewalRequestService,
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
    this.location();
    this.applicationData();
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

  location = () => {
    let requestObject = {};
    this.QuarterRenewalRequestService.getLocation(requestObject, (callback: any) => {
      console.log("location callback", callback);
      this.locationData = Array.isArray(callback)
        ? callback.filter((loc: any) => loc && loc.status !== '0' && loc.status !== 0)
        : [];
    });  
  }

  onLocationChange() {
    this.data.sctr_id = '';
    this.data.sctr_name = '';
    this.sectorData = [];
    if (this.data.loc_id) {
      this.setLocation();
    }
  }
  
  setLocation(){
    if (!this.data.loc_id) {
      this.sectorData = [];
      return;
    }
    this.QuarterRenewalRequestService.getSectorData(this.data.loc_id, (callback: any) => {
      console.log("set location", callback);
      this.sectorData = Array.isArray(callback) ? callback : [];
    });
  }

  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 9000);
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

  applicationData(){
    let requestObject = {};
    this.QuarterRenewalRequestService.applyData(this.rqstId, (callback:any)=>{
      console.log("callback",callback);
      if (!callback) {
        this.isLodaing = false;
        return;
      }
      this.data.user_id = callback.userId;
      this.data.f_name = callback["user.f_name"];
      this.data.l_name = callback["user.l_name"];
      this.data.gender = callback["user.gender"];
      this.data.email = callback["user.email"];
      this.data.phone_no = callback["user.phone_no"];
      this.data.designation = callback["user.designation"];
      this.data.basic_pay = callback["user.basic_pay"];
      this.data.pay_matrix = callback["user.pay_matrix"];
      this.data.service_status = callback["user.service_status"];
      this.data.transferable = callback["user.transferable"];
      this.data.doa = callback["user.doa"];
      this.data.dor = callback["user.dor"];
      this.data.dojs = callback["user.dojs"];
      this.data.dos = callback["user.dos"];
      this.data.spouse_f_name = callback["user.spouse_f_name"];
      this.data.spouse_l_name = callback["user.spouse_l_name"];
      this.data.spouse_occ = callback["user.spouse_occ"];
      this.data.spouse_acco = callback["user.spouse_acco"];
      this.data.resid_house = callback["user.resid_house"];
      this.data.photo = callback["user.photo"];
      this.data.sign = callback["user.sign"];
      this.data.adhar = callback["user.adhar"];
      this.data.identity = callback["user.identity"];

      this.data.sctr_name = callback["sector.sctr_name"];
      this.data.sctr_id = callback["sector.id"] || callback.sctr_id;

      this.data.loc_name = callback["location.loc_name"];
      this.data.loc_id = callback["location.id"] || callback.loc_id;

      this.data.dept_name = callback["user.department.dept_name"];

      this.data.id = callback.id;
      this.data.reference_no = callback.reference_no;
      this.data.apply_date = callback.apply_date;
      this.data.allot_order = callback.allot_order;

      this.data.qrtr_type = callback.qrtr_type;
      this.data.qrtr_no = callback.qrtr_no;
      this.data.qrtr_letitude = callback.qrtr_letitude;
      this.data.qrtr_longitude = callback.qrtr_longitude;
      this.data.photo_1 = callback.photo_1;
      this.data.photo_2 = callback.photo_2;
      this.data.photo_3 = callback.photo_3;
      this.data.photo_4 = callback.photo_4;
      this.data.d_w = callback.d_w;
      this.data.e_w = callback.e_w;
      this.data.r_c = callback.r_c;
      this.data.s_q = callback.s_q;
      this.data.s_t = callback.s_t;
      this.data.qtr_extnd = callback.qtr_extnd;
      this.data.type_of_strc = callback.type_of_strc;
      this.data.area_extnd_strc = callback.area_extnd_strc;
      this.data.extnd_prmsn = callback.extnd_prmsn;
      this.data.extnd_doc = callback.extnd_doc;
      this.data.strc_nearby = callback.strc_nearby;
      this.data.strc_by_whm = callback.strc_by_whm;
      this.data.strc_distance = callback.strc_distance;
      this.data.strc_type = callback.strc_type;
      this.data.strc_allot = callback.strc_allot;
      this.data.strc_area = callback.strc_area;
      this.data.strc_storeys = callback.strc_storeys;
      this.data.strc_photo = callback.strc_photo;
      this.data.applyDate = callback.applyDate;

      this.data.status = callback.status;
      this.data.startDate = callback.startDate;
      this.data.renewalDate = callback.renewalDate;
      this.data.remark = callback.remark;

      this.map_loc = callback.map_loc;

      if (this.data.loc_id) {
        this.setLocation();
      }

      this.isLodaing = false;
      console.log("new property=======>>>>>",this.data);
  });
}

FilterChange(data:Event){
  const value=(data.target as HTMLInputElement).value;
  this.dataSource.filter=value;
}


accept(){
  this.inputData.status = 'Approved';
  this.inputData.rqstId = this.rqstId;
  this.inputData.map_loc = this.map_loc;
  this.inputData.startDate = this.convertDate();
  this.inputData.renewalDate = this.addOneYear();
  console.log("input data",this.inputData);
  let isValid = this.validateInputs();
  if(isValid){
    this.isLodaing = true;
      this.spiner();
      this.QuarterRenewalRequestService.acceptQuarterRenewal(this.inputData, (res:any)=>{
        this.isLodaing = false;
        this.applicationData();
      })
  }else{
    this.isSaving = false;
  }
}

reject(){
  this.inputData.status = 'Rejected';
  this.inputData.rqstId = this.rqstId;
  console.log("input data",this.inputData);
  let isValid = this.validateInputs();
  if(isValid){
    this.isLodaing = true;
      this.spiner();
      this.QuarterRenewalRequestService.rejectQuarterRenewal(this.inputData, (res:any)=>{
        this.isLodaing = false;
        this.applicationData();
      })
  }else{
    this.isSaving = false;
  }
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

updateQuarterUserData(){
  this.data.user_id = this.data.user_id;
  // this.civic();
  let isValidInputs = this.validateUpdateInputs();
  if (isValidInputs) {
    this.isLodaing = true;
        this.spiner();
        console.log("update dataaaaaaaaaaa",this.data);
        
  this.QuarterRenewalRequestService.updateQuarterRequest(this.data, (res: any) => {
    this.isLodaing = false;
  })
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
  // if(this.data.civic==='' || this.data.civic===null || this.data.civic===undefined){
  //   this.toastr.warning('Please select Civic Charge','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if(this.data.civic == "Others"){
  //   if(this.data.others==='' || this.data.others===null || this.data.others===undefined){
  //     this.toastr.warning('Please type others','Warning',{
  //       disableTimeOut:false
  //     });
  //     return false;
  //   }
  // }
  // if(this.data.department==='' || this.data.department===null || this.data.department===undefined){
  //   this.toastr.warning('Please select department','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  if(this.data.basic_pay==='' || this.data.basic_pay===null || this.data.basic_pay===undefined){
    this.toastr.warning('Please type basic pay','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  // if(this.data.pay_matrix==='' || this.data.pay_matrix===null || this.data.pay_matrix===undefined){
  //   this.toastr.warning('Please type Pay Level','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
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
  // if(this.data.dos==='' || this.data.dos===null || this.data.dos===undefined){
  //   this.toastr.warning('Please type Date of superannuation','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  if(this.data.resid_house==='' || this.data.resid_house===null || this.data.resid_house===undefined){
    this.toastr.warning('Please select Do you own residential house in Capital Complex?','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.phone_no < 1000000000 || this.data.phone_no > 9999999999){
    this.toastr.warning('Please type phone number & must be 10 digits','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  return true;
}




updateForm(){
  // this.data.userID = this.userID;
  console.log("input data",this.data);
  let isValid = this.validateQuarterInputs();
  if(isValid){
    this.isLodaing = true;
    this.spiner(); 
    this.QuarterRenewalRequestService.updateQuarterForm(this.data, (res:any)=>{
      this.isLodaing = false;
    });
  }else{
    this.isSaving = false;
  }
}

clearField(){
  console.log("checkkkkkkkkkkkk",this.data.strc_nearby);
  if (this.data.strc_nearby == "No") {
    this.data.strc_by_whm= "";
    this.data.strc_distance= "";
    this.data.strc_type= "";
    this.data.strc_allot= "";
    this.data.strc_area= "";
    this.data.strc_storeys= "";
  }
  
}

clearFieldExtnd(){
  console.log("checkkkkkkkkkkkk",this.data.qtr_extnd);
  if (this.data.qtr_extnd == "No") {
    this.data.type_of_strc= "";
    this.data.area_extnd_strc= "";
    this.data.extnd_prmsn= "";
  }
}

validateQuarterInputs = () =>{
  console.log("Saving project before validate",this.data);
  // if(this.data.loc_id==='' || this.data.loc_id===null || this.data.loc_id===undefined){
  //   this.toastr.warning('Please select Location','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  // if(this.data.sec_id==='' || this.data.sec_id===null || this.data.sec_id===undefined){
  //   this.toastr.warning('Please select Sector','Warning',{
  //     disableTimeOut:false
  //   });
  //   return false;
  // }
  if(this.data.qrtr_type==='' || this.data.qrtr_type===null || this.data.qrtr_type===undefined){
    this.toastr.warning('Please select quarter type','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.qrtr_no==='' || this.data.qrtr_no===null || this.data.qrtr_no===undefined){
    this.toastr.warning('Please type quarter number','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.qrtr_letitude==='' || this.data.qrtr_letitude===null || this.data.qrtr_letitude===undefined){
    this.toastr.warning('Please type quarter latitude','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.qrtr_longitude==='' || this.data.qrtr_longitude===null || this.data.qrtr_longitude===undefined){
    this.toastr.warning('Please type quarter longitude','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.d_w==='' || this.data.d_w===null || this.data.d_w===undefined){
    this.toastr.warning('Please select Door & Window condition','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.e_w==='' || this.data.e_w===null || this.data.e_w===undefined){
    this.toastr.warning('Please sselect Electrical Wiring condition','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.r_c==='' || this.data.r_c===null || this.data.r_c===undefined){
    this.toastr.warning('Please select Roof & Ceiling condition','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.s_q==='' || this.data.s_q===null || this.data.s_q===undefined){
    this.toastr.warning('Please select structure of quarter condition','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.s_t==='' || this.data.s_t===null || this.data.s_t===undefined){
    this.toastr.warning('Please select Septic tank functioning condition','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.qtr_extnd==='' || this.data.qtr_extnd===null || this.data.qtr_extnd===undefined){
    this.toastr.warning('Please select have you extended the quarter','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if (this.data.qtr_extnd == "Yes") {
  if(this.data.type_of_strc==='' || this.data.type_of_strc===null || this.data.type_of_strc===undefined){
    this.toastr.warning('Please select Type of structure','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.area_extnd_strc==='' || this.data.area_extnd_strc===null || this.data.area_extnd_strc===undefined){
    this.toastr.warning('Please type area of extended structure','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.extnd_prmsn==='' || this.data.extnd_prmsn===null || this.data.extnd_prmsn===undefined){
    this.toastr.warning('Please select extension permission','Warning',{
      disableTimeOut:false
    });
    return false;
  }
}
  if(this.data.strc_nearby==='' || this.data.strc_nearby===null || this.data.strc_nearby===undefined){
    this.toastr.warning('Please select constructed nearby the quarter','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if (this.data.strc_nearby == "Yes") {
  if(this.data.strc_by_whm==='' || this.data.strc_by_whm===null || this.data.strc_by_whm===undefined){
    this.toastr.warning('Please select by whom','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.strc_distance==='' || this.data.strc_distance===null || this.data.strc_distance===undefined){
    this.toastr.warning('Please type distance of structure from Govt. quarter','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.strc_type==='' || this.data.strc_type===null || this.data.strc_type===undefined){
    this.toastr.warning('Please select type of structure','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.strc_allot==='' || this.data.strc_allot===null || this.data.strc_allot===undefined){
    this.toastr.warning('Please select land allotment obtained for the structure constructed','Warning',{
      disableTimeOut:false
    });
    return false;
  }
  if(this.data.strc_storeys==='' || this.data.strc_storeys===null || this.data.strc_storeys===undefined){
    this.toastr.warning('Please type number of storeys of structure','Warning',{
      disableTimeOut:false
    });
    return false;
  }
}
  return true;
}

}
