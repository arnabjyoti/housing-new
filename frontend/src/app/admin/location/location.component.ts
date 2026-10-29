import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocationService } from './location.service';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';


export interface locationData {
  id: string,
  location_name: string,
}
@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,FormsModule, MatFormFieldModule,],
})
export class LocationComponent implements OnInit{
  public displayedColumns: string[] = ['Sl','location_name','action'];
  dataSource !: MatTableDataSource<locationData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  public endpoint: any;
  locationName: any;
  returnMsg:any;
  public locationData = {
    location_name: ""
  };
  public selectedLocation = {
    id: "",
    loc_name: ""
  };
  public isSaving: boolean = false;
  public isLodaing: boolean = true;
  @Output() added = new EventEmitter<any>();
  constructor(
    private LocationService: LocationService,
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
    this.LocationService.getLocation(requestObject, (callback:any)=>{
      console.log("ccccccc",callback);
      // this.departmentName = new MatTableDataSource(callback);
      this.dataSource = new MatTableDataSource(callback);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log("bbbbbbbbbb",this.dataSource);
      
    });  
  }

  FilterChange(data:Event){
    const value=(data.target as HTMLInputElement).value;
    this.dataSource.filter=value;
  }

  save() {
    this.isSaving = true;
    this.LocationService.addLocation(this.locationData.location_name, (res: any) =>{
      this.returnMsg = res.message;
      console.log("lllllllllll",this.returnMsg);
      this.location();
      let ele:any = document.getElementById('modalClose');
      ele.click();
      this.isSaving = false;
      this.added.emit({ response: true });
      this.resetForm();
    });
  }

  showLocUpdateModal(row:any) {
    console.log("Selected Project=", row);
    this.selectedLocation = row;
    // console.log("hhhhhhhhhhhh",this.selectedLocation.loc_name);
    
    let deleteModal:any = document.getElementById("LocUpdate");
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("show");
  };

  update(){
    const requestObject = {
      ID: this.selectedLocation.id,
      location_name: this.selectedLocation.loc_name,
    }
    console.log("dddddddddd", requestObject);
    this.LocationService.updateLocation(requestObject, (res: any) => {
      this.returnMsg = res.message;
      console.log("lllllllllll",this.returnMsg);
      this.location();
      let cls:any = document.getElementById('modalClosed');
      console.log("cccccccccc",cls);
      
      cls.click();
      this.isSaving = false;
      this.added.emit({ response: true });
    });
  }


  resetForm(){
    this.locationData.location_name = '';
  }
}
