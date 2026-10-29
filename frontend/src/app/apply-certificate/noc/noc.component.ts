import { Component, OnInit } from '@angular/core';
import { NocService } from './noc.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-noc',
  templateUrl: './noc.component.html',
  styleUrls: ['./noc.component.css'],
  standalone: true,
  imports: [NgxPrintModule, NgxSpinnerModule, RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule],
})
export class NocComponent implements OnInit{

  public userDetails:any;
  public userID:any; 
  public departmentId:any;
  public endpoint: any;
  public data: any;

  constructor(
    private NocService: NocService,
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
  }

  userData=()=>{
    console.log("userID",this.userID);
    
    this.NocService.getUserDetails(this.userID, (callback:any)=>{
      console.log(callback);
      this.data = callback.department_name
      // this.dept_name = callback.department.dept_name;
      console.log("fffffffffff",this.userDetails);
      
    });  
  }
}
