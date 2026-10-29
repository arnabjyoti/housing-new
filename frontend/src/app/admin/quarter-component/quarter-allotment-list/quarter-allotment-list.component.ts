import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { QuarterAllotmentListService } from './quarter-allotment-list.service';

@Component({
  selector: 'app-quarter-allotment-list',
  templateUrl: './quarter-allotment-list.component.html',
  styleUrls: ['./quarter-allotment-list.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,FormsModule, MatFormFieldModule, CommonModule],
})
export class QuarterAllotmentListComponent implements OnInit{

  public displayedColumns: string[] = ['Sl','location','sector','type','qrtr_no','action'];

  public locationData:any = {
    id: "",
    lcn_name: "",
  };

  public filter: any = {
    loc_id: '',
    sec_id: '',
    type: '',
  }

  public endpoint: any;
  public sectorData: any;
  public quarterData: any;

  constructor(
    private QuarterAllotmentListService: QuarterAllotmentListService,
    private toastr:ToastrService,
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
    this.location();
  }

  location=()=>{
    let requestObject = {};
    this.QuarterAllotmentListService.getLocation(requestObject, (callback:any)=>{
      console.log("bbbbbbbbbb",callback);
      this.locationData = callback;
      console.log("location details",this.locationData);
      
    });  
  }

  setLocation(){
    if (!this.filter.loc_id) {
      this.sectorData = [];
      this.filter.sec_id = "";
      return;
    }
    this.QuarterAllotmentListService.getSectorData(this.filter.loc_id, (callback:any)=>{
      console.log("set location",callback);
      this.sectorData = callback || [];
    })
  }

  setSector(){
    this.QuarterAllotmentListService.checkQuarter(this.filter.sec_id, (callback:any)=>{
      console.log("set sector",Object.keys(callback).length);
      this.quarterData = callback;
      // console.log("quarterData",this.quarterData.result);
      
      if (!Object.keys(callback).length) {
        // this.hideForm = false;
        // this.showButton = true;
      }else{
        // this.hideForm = true;
        // this.showButton = false;
      }
    })
  }
}
