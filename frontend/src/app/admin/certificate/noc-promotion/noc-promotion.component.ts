import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NocPromotionService } from './noc-promotion.service';
import { MatSort } from '@angular/material/sort';

export interface nocData {
  id: string,
  f_name: string,
  l_name: string,
  reference_no: string,
  applyDate: string,  
    email:"",
    phone_no:"",
    designation: "",
    department: "",
    basic_pay: "",
    service_status: "",
    transferable: "",
    doa: "",
    dojs: "",
    dos: "",
    spouse_f_name: "",
    spouse_l_name: "",
    spouse_occ: "",
    spouse_acco: "",
    resid_house: "",
}

@Component({
  selector: 'app-noc-promotion',
  templateUrl: './noc-promotion.component.html',
  styleUrls: ['./noc-promotion.component.css'],
  standalone: true,
  imports: [NgxPrintModule,NgxSpinnerModule,RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,FormsModule, MatFormFieldModule,CommonModule],
})
export class NocPromotionComponent implements OnInit{
  public displayedColumns: string[] = ['Sl','name','referenceNo','apply_date','status','action'];
  dataSource !: MatTableDataSource<nocData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  public endpoint: any;
  public isLodaing: boolean = true;
  public data:any;
  public userDetails:any = {
    id: "",
    f_name: "",
    m_name: "",
    l_name: "",
    email:"",
    phone_no:"",
    designation: "",
    department: "",
    basic_pay: "",
    service_status: "",
    transferable: "",
    doa: "",
    dojs: "",
    dos: "",
    spouse_f_name: "",
    spouse_l_name: "",
    spouse_occ: "",
    spouse_acco: "",
    resid_house: "",
    }


  public nocPromotionTotal:any = 0;
  public nocPromotionApproved:any = 0;
  public nocPromotionPending:any = 0;
  public nocPromotionRejected:any = 0;

  constructor(
    private NocPromotionService: NocPromotionService,
    private toastr:ToastrService,
    private spinner: NgxSpinnerService
  ){
    this.endpoint = environment.BASE_URL;
  }


  ngOnInit(): void {
    // this.getNocPromotionList();
    this.adminCardCount();
  }

  adminCardCount(){
    this.NocPromotionService.nocPromotionCount((res:any) => {
      console.log("admincount",res);
  
      this.nocPromotionTotal = res.nocPromotionTotal;
      this.nocPromotionApproved = res.nocPromotionApproved;
      this.nocPromotionPending =  res.nocPromotionPending;
      this.nocPromotionRejected = res.nocPromotionRejected;
    });
  }

  getNocPromotionList(){
    let requestObject = {};
    this.NocPromotionService.getNocPromotionData(requestObject, (callback:any)=>{
      this.isLodaing = false;
      console.log(callback);

      let temp:any = [];
      callback.map((item: any) => {
        temp.push({
          f_name: item["user.f_name"],
          l_name: item["user.l_name"],
          id: item.id,
          referenceNo: item.referenceNo,
          applyDate: item.applyDate,
          status: item.status,
          email:item["user.email"],
          phone_no:item["user.phone_no"],
          designation: item["user.designation"],
          department: item["user.department"],
          basic_pay: item["user.basic_pay"],
          service_status: item["user.service_status"],
          transferable: item["user.transferable"],
          doa: item["user.doa"],
          dojs: item["user.dojs"],
          dos: item["user.dos"],
          spouse_f_name: item["user.spouse_f_name"],
          spouse_l_name: item["user.spouse_l_name"],
          spouse_occ: item["user.spouse_occ"],
          spouse_acco: item["user.spouse_acco"],
          resid_house: item["user.resid_house"],

        })
        this.data = temp;
      });
      console.log("new property=======>>>>>",this.data);
      // this.departmentName = new MatTableDataSource(callback);
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

  showRequestUpdateModal(row:any){
    console.log("Selected Project=", row);
    this.userDetails = row;
  }

}
