import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DepartmentService } from './department.service';
import {MatTableModule, MatTableDataSource} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';




export interface departmentData {
  id: string,
  dept_name: string,
}
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,FormsModule, MatFormFieldModule, MatSortModule],
})
export class DepartmentComponent implements OnInit{
  public displayedColumns: string[] = ['Sl','dept_name','action'];
  // public dataSource = [];
  dataSource !: MatTableDataSource<departmentData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  public endpoint: any;
  departmentName: any;
  returnMsg:any;
  public departmentData = {
    dept_name: ""
  };
  public selectedDept = {
    id: "",
    dept_name: ""
  };
  public isSaving: boolean = false;
  public isLodaing: boolean = true;
  @Output() added = new EventEmitter<any>();
  constructor(
    private DepartmentService: DepartmentService,
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
    this.department();
  }
  department=()=>{
    let requestObject = {};
    this.DepartmentService.getDepartment(requestObject, (callback:any)=>{
      console.log(callback);
      // this.departmentName = new MatTableDataSource(callback);
      this.dataSource = new MatTableDataSource(callback);
      this.dataSource.paginator = this.paginator;
      console.log("paginator",this.paginator);
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
    this.DepartmentService.addDepartment(this.departmentData.dept_name, (res: any) =>{
      this.returnMsg = res.message;
      console.log("lllllllllll",this.returnMsg);
      this.department();
      let ele:any = document.getElementById('modalClose');
      ele.click();
      this.isSaving = false;
      this.added.emit({ response: true });
    });
  }

  showDeptUpdateModal(row:any) {
    console.log("Selected Project=", row);
    this.selectedDept = row;
    let deleteModal:any = document.getElementById("DeptUpdate");
    deleteModal.classList.remove("hidden");
    deleteModal.classList.add("show");
  };

  update(){
    const requestObject = {
      ID: this.selectedDept.id,
      dept_name: this.selectedDept.dept_name,
    }
    console.log("dddddddddd", requestObject);
    this.DepartmentService.updateDept(requestObject, (res: any) => {
      this.returnMsg = res.message;
      console.log("lllllllllll",this.returnMsg);
      this.department();
      let cls:any = document.getElementById('modalClosed');
      console.log("cccccccccc",cls);
      
      cls.click();
      this.isSaving = false;
      this.added.emit({ response: true });
    });
  }
}
