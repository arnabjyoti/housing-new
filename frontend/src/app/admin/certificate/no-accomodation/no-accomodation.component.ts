import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NoAccomodationService } from './no-accomodation.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
export interface nocData {
  id: string,
  f_name: string,
  l_name: string,
  reference_no: string,
}
@Component({
  selector: 'app-no-accomodation',
  templateUrl: './no-accomodation.component.html',
  styleUrls: ['./no-accomodation.component.css'],
  standalone: true,
  imports: [NgxPrintModule,NgxSpinnerModule,RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,FormsModule, MatFormFieldModule,CommonModule],
})
export class NoAccomodationComponent implements OnInit{
  public displayedColumns: string[] = ['Sl','name','referenceNo','apply_date', 'spouse_acco','status','action'];
  dataSource !: MatTableDataSource<nocData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  public data: any= {
    f_name: '',
    l_name: '',
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
    referenceNo: '',
    applyDate: '',
    status: '',
    remark: '',
    spouse_qrtr_enc: '',
    spouse_qrtr_avail: '',
    spouse_qrtr_enc_name: '',
    spouse_qrtr_enc_nature: '',
    spouse_qrtr_no_type: '',
    spouse_qrtr_sctr_loc: '',
    place: '',
    userId: '',
    annexure_b: '',
  }

  public selectedApplication:any = {
    id: "",
    loc_name: ""
  };

  public response: any = {
    status: '',
    remark: '',
  }

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

  public cardData: any;
  public referenceNo: any;
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

  public endpoint: any;
  public isSaving: boolean = false;
  public isLodaing = true;

public noAccomodationTotal: any = 0;
public noAccomodationApproved: any = 0;
public noAccomodationPending: any = 0;
public noAccomodationRejected: any = 0;

  constructor(
    private NoAccomodationService: NoAccomodationService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
  ){
    this.endpoint = environment.BASE_URL;
    this.init();
  }
  init = () =>{
    let token = JSON.parse(JSON.stringify(localStorage.getItem('token')));
    token = JSON.parse(token);
    console.log("Token=", token);
    if(!token.usr.accessKeyword){
      console.log("gggggggggggggggggggggg");
      
      return;
    }
  }

  ngOnInit(): void {
    this.nonAccomodationRequestData();
    this.noAccomodationCount();
  }

  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 9000);
  }


  noAccomodationCount(){
    this.NoAccomodationService.noAccomodationCount((res:any) => {
      console.log("admincount",res);
  
      this.noAccomodationTotal = res.noAccomodationTotal;
      this.noAccomodationApproved = res.noAccomodationApproved;
      this.noAccomodationPending =  res.noAccomodationPending;
      this.noAccomodationRejected = res.noAccomodationRejected;
    });
  }


  nonAccomodationRequestData(){
    let requestObject = {};
    this.NoAccomodationService.getnonAccomodationRequestData(requestObject, (callback:any)=>{
      console.log("ccccccc",callback);
          
      // this.data = callback.department_name
      let temp:any = [];
      callback.map((item: any) => {
        temp.push({

        f_name: item["user.f_name"],
        l_name: item["user.l_name"],
        designation: item["user.designation"],
        basic_pay: item["user.basic_pay"],
        service_status: item["user.service_status"],
        transferable: item["user.transferable"],
        doa: item["user.doa"],
        phone_no: item["user.phone_no"],
        dojs: item["user.dojs"],
        dos: item["user.dos"],
        spouse_f_name: item["user.spouse_f_name"],
        spouse_l_name: item["user.spouse_l_name"],
        spouse_occ: item["user.spouse_occ"],
        spouse_acco: item["user.spouse_acco"],

        spouse_qrtr_enc: item.spouse_qrtr_enc,
        spouse_qrtr_avail: item.spouse_qrtr_avail,
        spouse_qrtr_enc_name: item.spouse_qrtr_enc_name,
        spouse_qrtr_enc_nature: item.spouse_qrtr_enc_nature,
        spouse_qrtr_no_type: item.spouse_qrtr_no_type,
        spouse_qrtr_sctr_loc: item.spouse_qrtr_sctr_loc,
        place: item.place,
        userId: item.userId,
        annexure_b: item.annexure_b,


        id: item.id,
        referenceNo: item.referenceNo,
        applyDate: item.applyDate,
        status: item.status,
        approvedDate: item.approvedDate,
        renewalDate: item.renewalDate,

        dept: item["user.department.dept_name"],


        })
        this.data = temp;
      });

      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("bbbbbbbbbb",this.dataSource);
    });
  }

  FilterChange(data:Event){
    const value=(data.target as HTMLInputElement).value;
    this.dataSource.filter=value;
  }



  showLocUpdateModal(row:any) {
    console.log("Selected Project=", row);
    this.selectedApplication = row;
    // console.log("hhhhhhhhhhhh",this.selectedLocation.loc_name);
    
    let deleteModal:any = document.getElementById("certificateUpdate");
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("show");
  };





  accept(){
    this.response.rqstId = this.selectedApplication.id;
    console.log("input data",this.response);
    let isValid = this.validateInputs();
    if(isValid){
      this.isLodaing = true;
        this.spiner();
        this.NoAccomodationService.acceptNoAcco(this.response, (res:any)=>{
          this.isLodaing = false;
          this.nonAccomodationRequestData();
          this.resetForm();
          let ele:any = document.getElementById('modalClose');
          ele.click();
        })
    }else{
      this.isSaving = false;
    }
  }
  
  reject(){
    this.response.rqstId = this.selectedApplication.id;
    console.log("input data",this.response);
    let isValid = this.validateInputs();
    if(isValid){
      this.isLodaing = true;
        this.spiner();
        this.NoAccomodationService.rejectNoAcco(this.response, (res:any)=>{
          this.isLodaing = false;
          this.nonAccomodationRequestData();
          this.resetForm();
          let ele:any = document.getElementById('modalClose');
          ele.click();
        })
    }else{
      this.isSaving = false;
    }
  }
  
  validateInputs(){
    console.log("Saving before validate",this.response);
      if(this.response.remark==='' || this.response.remark===null || this.response.remark===undefined){
        this.toastr.warning('Please type remark','Warning',{
          disableTimeOut:false
        });
        return false;
      }
      return true;
  }

  resetForm(){
    this.response.status = '';
    this.response.remark = '';
  }
}
