import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SectorService } from './sector.service';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService, ToastrModule } from 'ngx-toastr';


export interface sectorData {
  id: string,
  sector_name: string,
  
}

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,FormsModule, MatFormFieldModule, CommonModule],
})
export class SectorComponent implements OnInit{

  public loc: any;
  public data: any;

  public displayedColumns: string[] = ['Sl','loc_name','sector_name','action'];
  dataSource !: MatTableDataSource<sectorData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  public endpoint: any;
  sectorName: any;
  returnMsg:any;
  public sectorData = {
    sector_name: "",
    loc_name: ""
  };
  public selectedSector = {
    id: "",
    sctr_name: "",
    locatn: "",
    loc_id: ""
  };
  public locationData:any = {
    id: "",
    lcn_name: "",
  };
  public isSaving: boolean = false;
  public isLodaing: boolean = true;
  @Output() added = new EventEmitter<any>();
  constructor(
    private SectorService: SectorService,
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
    this.sector();
    this.location();
  }


  sector=()=>{
    let requestObject = {};
    
    this.SectorService.getSector(requestObject, (callback:any)=>{
      console.log(callback);
      this.loc = callback;
      console.log("dddd",this.loc);

      let temp:any = [];
      callback.map((item: any) => {
        temp.push({
          locatn: item["location.loc_name"],
          loc_id: item["location.id"],
          id: item.id,
          sctr_name: item.sctr_name,

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

  location=()=>{
    let requestObject = {};
    this.SectorService.getLocation(requestObject, (callback:any)=>{
      console.log(callback);
      this.locationData = Array.isArray(callback)
        ? callback.filter((loc: any) => loc && loc.status !== '0' && loc.status !== 0)
        : [];
      console.log("location details",this.locationData);
    });  
  }
  validateInputs = () =>{
    console.log("Saving data before validate",this.sectorData);
    if(this.sectorData.sector_name==='' || this.sectorData.sector_name===null || this.sectorData.sector_name===undefined){
      this.toastr.warning('Please select sector name.','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.sectorData.loc_name==='' || this.sectorData.loc_name===null || this.sectorData.loc_name===undefined){
      this.toastr.warning('Please select location name.','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }

  save() {
    this.isSaving = true;
    let isValid = this.validateInputs();
    if(isValid){
    this.SectorService.addSector(this.sectorData, (res: any) =>{
      this.returnMsg = res.message;
      console.log("lllllllllll",this.returnMsg);
      this.sector();
      let ele:any = document.getElementById('modalClose');
      ele.click();
      this.isSaving = false;
      this.added.emit({ response: true });
      this.resetForm();
    });
  }else{
    this.isSaving = false;
  }
  }

  showLocUpdateModal(row:any) {
    console.log("Selected Project=", row);
    this.selectedSector = row;
    // console.log("hhhhhhhhhhhh",this.selectedLocation.loc_name);
    
    let deleteModal:any = document.getElementById("sctrUpdate");
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("show");
  }

  update(){}

  resetForm(){
    this.sectorData.sector_name = '';
    this.sectorData.loc_name = '';
  }
}
