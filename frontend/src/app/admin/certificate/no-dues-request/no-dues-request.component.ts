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
import { NgxSpinnerModule } from 'ngx-spinner';
export interface nocData {
  id: string,
  f_name: string,
  l_name: string,
  reference_no: string,
}
@Component({
  selector: 'app-no-dues-request',
  templateUrl: './no-dues-request.component.html',
  styleUrls: ['./no-dues-request.component.css'],
  standalone: true,
  imports: [NgxPrintModule,NgxSpinnerModule,RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule,FormsModule, MatFormFieldModule,CommonModule],
})
export class NoDuesRequestComponent implements OnInit{
  public displayedColumns: string[] = ['Sl','name','referenceNo','apply_date','status','action'];
  dataSource !: MatTableDataSource<nocData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;


  public noDueTotal:any = 0;
  public noDueApproved:any = 0;
  public noDuePending:any = 0;
  public noDueRejected:any = 0;
  ngOnInit(): void {
  }

  FilterChange(data:Event){
    const value=(data.target as HTMLInputElement).value;
    this.dataSource.filter=value;
  }
}