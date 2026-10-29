import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QuarterRequestService } from './quarter-request.service';
import { environment } from 'src/environments/environment';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as _ from 'lodash';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export interface RequestData {
  id: string;
  user_name: string;
  dept_name: string;
  apply_date: string;
  reference_no: string;
}

@Component({
  selector: 'app-quarter-request',
  templateUrl: './quarter-request.component.html',
  styleUrls: ['./quarter-request.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    CommonModule,
    MatSortModule
  ]
})
export class QuarterRequestComponent implements OnInit {
  public displayedColumns: string[] = [
    'Sl',
    'user_name',
    'gender',
    'dept_name',
    'designation',
    'apply_date',
    'basic_pay',
    'station_seniority',
    'status',
    'action'
  ];
  
  dataSource!: MatTableDataSource<RequestData>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  public endpoint: string = environment.BASE_URL;
  public data: any[] = [];
  public apiResponse: any[] = [];

  public allocationTotal: number = 0;
  public allocationPending: number = 0;
  public allocationRejected: number = 0;
  public allocationApproved: number = 0;

  showAllotted: boolean = false;
  toggleButtonText: string = 'Show Allotted';

  // Filter fields
  public locationData: any;
  public sectorData: any;
  public quarterData: any;
  public filter: any = { loc_id: '', sec_id: '', type: '', basic_pay: '' };

  constructor(private quarterRequestService: QuarterRequestService) {}

  ngOnInit(): void {
    this.adminCardCount();
    this.applicationData();
    this.location();
  }

  /** Load application data */
  applicationData(): void {
    const requestObject = {};
    this.quarterRequestService.applyData(requestObject, (callback: any) => {
      const temp: any[] = [];
      const allowedStatuses = ['Apply', 'Approved', 'Rejected', 'Verified'];

      callback.forEach((item: any) => {
        const isAllotted = item.status === 'Allotted';
        if ((this.showAllotted && isAllotted) || (!this.showAllotted && allowedStatuses.includes(item.status))) {
          temp.push({
            user_name: `${item['user.f_name']} ${item['user.l_name']}`,
            gender: item['user.gender'],
            dept_name: item['department.dept_name'],
            designation: item['user.designation'],
            station_seniority: item['user.dojs'],
            basic_pay: item['user.basic_pay'],
            id: item.id,
            reference_no: item.reference_no,
            apply_date: item.apply_date,
            status: item.status
          });
        }
      });

      this.data = temp;
      this.apiResponse = temp;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  /** Toggle allotted view */
  toggleAllottedView(): void {
    this.showAllotted = !this.showAllotted;
    this.toggleButtonText = this.showAllotted ? 'Show Applications' : 'Show Allotted';
    this.applicationData();
  }

  /** Text filter */
  FilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = value;
  }

  /** Filter by location */
  FilterChangeLocation(event: any): void {
  const filteredData = _.filter(this.apiResponse, item => item.loc_id == this.filter.loc_id);
  if (this.dataSource) {
    this.dataSource.data = filteredData;    // <-- preserve paginator & sort
    if (this.paginator) this.paginator.firstPage(); // optional: go to page 1
  } else {
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

  /** Load locations */
  location(): void {
    const requestObject = {};
    this.quarterRequestService.getLocation(requestObject, (callback: any) => {
      this.locationData = callback;
    });
  }

  /** Set sectors based on location */
  setLocation(): void {
    this.quarterRequestService.getSectorData(this.filter.loc_id, (callback: any) => {
      this.sectorData = callback;
      this.filter.sec_id = '';
      this.filter.type = '';
    });
  }

  /** Filter by sector */
  FilterChangeSector(event: any): void {
  const filteredData = _.filter(this.apiResponse, item => item.sctr_id == this.filter.sec_id);
  this.filter.type = '';
  if (this.dataSource) {
    this.dataSource.data = filteredData;
    if (this.paginator) this.paginator.firstPage();
  } else {
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

  /** Filter by quarter type */
  FilterChangeQrtrType(event: any): void {
  const filteredData = _.filter(this.apiResponse, item => item.basic_pay == this.filter.type);
  if (this.dataSource) {
    this.dataSource.data = filteredData;
    if (this.paginator) this.paginator.firstPage();
  } else {
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

  /** Reset filters */
  resetFilter(): void {
    this.filter = { loc_id: '', sec_id: '', type: '', basic_pay: '' };
    this.applicationData();
  }

  /** Get quarter eligibility label */
  getQuarterEligibility(basicPay: string): string {
    switch (basicPay) {
      case '18000-19900': return 'BB / T-I';
      case '21700-29200': return 'T-II';
      case '35400-47600': return 'T-III';
      case '53100-67700': return 'T-IV';
      case '78800-144200': return 'T-V';
      case '182200-250000 & above': return 'T-VI / BUNG';
      default: return basicPay || '';
    }
  }

  /** Download PDF report */
  downloadPDF(): void {
  const tableBody = [
    [
      'S.No',
      'Applicant Name',
      'Gender',
      'Department Name',
      'Designation',
      'Apply Date',
      'Quarter Eligibility',
      'Station Seniority'
    ],
    ...this.dataSource.data.map((item: any, index: number) => [
      index + 1,
      item.user_name || '',
      item.gender || '',
      item.dept_name || '',
      item.designation || '',
      item.apply_date
        ? new Date(item.apply_date).toLocaleDateString('en-GB')
        : '',
      this.getQuarterEligibility(item.basic_pay),
      item.station_seniority
        ? new Date(item.station_seniority).toLocaleDateString('en-GB')
        : ''
    ])
  ];

  const docDefinition: any = {
    pageSize: 'A4',
    pageOrientation: 'landscape',
    pageMargins: [30, 40, 30, 40],
    content: [
      { text: 'Seniority List of Applicants', style: 'header' },
      {
        style: 'tableStyle',
        table: {
          headerRows: 1,
          // 👇 Responsive widths
          widths: [30, '*', 40, '*', '*', 60, '*', '*'],
          body: tableBody
        },
        layout: {
          fillColor: (rowIndex: number) =>
            rowIndex === 0 ? '#CCCCCC' : null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#aaa',
          vLineColor: () => '#aaa',
          paddingLeft: () => 3,
          paddingRight: () => 3,
          paddingTop: () => 2,
          paddingBottom: () => 2
        }
      }
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 15]
      },
      tableStyle: {
        margin: [0, 5, 0, 15],
        fontSize: 8
      }
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `Page ${currentPage} of ${pageCount}`,
      alignment: 'center',
      margin: [0, 10],
      fontSize: 9
    })
  };

  (pdfMake as any)
    .createPdf(docDefinition)
    .download('Quarter-Allocation-Report.pdf');
}


  /** Admin card counts */
  adminCardCount(): void {
    this.quarterRequestService.quarterAllocationCount((res: any) => {
      this.allocationTotal = res.allocationTotal;
      this.allocationPending = res.allocationPending;
      this.allocationRejected = res.allocationRejected;
      this.allocationApproved = res.allocationApproved;
    });
  }
}
