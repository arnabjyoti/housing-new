import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { QuarterService } from './quarter.service';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export interface locationData {
  id: string,
  location_name: string,
}

@Component({
  selector: 'app-quarter',
  templateUrl: './quarter.component.html',
  styleUrls: ['./quarter.component.css'],
  standalone: true,
  imports: [NgxSpinnerModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule, MatSortModule],
})
export class QuarterComponent implements OnInit {

  public displayedColumns: string[] = ['Sl', 'allottee_name', 'dept_name', 'designation', 'location', 'sector', 'type', 'qrtr_no', 'action'];
  dataSource !: MatTableDataSource<locationData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  public endpoint: any;
  public currentUser: any;

  filteredSectors: any[] = [];

  isEditing = false;

  public locationData: any[] = [];

  public tempLoc: any[] = [];

  public selectedQuarter = {
    id: "",
    allottee_name: '',
    designation: '',
    dept_name: '',
    department_id: '',
    gMapLink: '',
    location_name: "",
    loc_id: "",
    sctor_name: "",
    qrtr_no: '',
    qrtr_type: '',
    allotment_order: '',
    sec_id: '',
    type: '',
    table_from: '',
    status_type: '',
    qrtr_longitude: '',
    qrtr_letitude: '',
    photo_1: '',
    photo_2: '',
    photo_3: '',
    photo_4: '',
    userId: '',
  }

  public qtr: any = {
    allottee_name: '',
    designation: '',
    department_id: '',
    gMapLink: '',
    qrtr_no: '',
    type: '',
    loc_id: '',
    sec_id: '',
    qrtr_longitude: '',
    qrtr_letitude: '',
  }
  public data1: any[] = [];

  public data2: any[] = [];

  public data3: any[] = [];

  public mergedData: any[] = [];

  public sectorData: any[] = [];
  public quarterData: any;

  public sectorList: any;

  public hideForm: boolean = false;
  public showButton: boolean = true;

  public isSaving: boolean = false;
  public returnMsg: any;

  public departmentName: any;


  // public uploadImageObject: any = {
  //   panImg: '',
  //   adharImg: ''
  // }
  public acceptfileType: string = "image";
  public allotment: string = "Choose File";

  public isLodaing = true;



  //filter
  public filter: any = {
    loc_id: '',
    sec_id: '',
    type: '',
    dept_id: '',
  }
  public apiResponse: any = [];



  uploadImageObject: any = {
    Allot: null,
    photo1: null,
    photo2: null,
    photo3: null,
    photo4: null,
    imageFiles: {
      Allot: null,
      photo1: null,
      photo2: null,
      photo3: null,
      photo4: null
    }
  };
  
  photoLabels: any = {
    Allot: 'Choose File',
    photo1: 'Choose File',
    photo2: 'Choose File',
    photo3: 'Choose File',
    photo4: 'Choose File'
  };


  originalQuarter: any = null;

  constructor(
    private spinner: NgxSpinnerService,
    private QuarterService: QuarterService,
    private toastr: ToastrService,
  ) {
    this.endpoint = environment.BASE_URL;
    this.init();
  }
  init = () => {
    let token = JSON.parse(JSON.stringify(localStorage.getItem('token')));
    token = JSON.parse(token);
    this.currentUser = token?.usr;
    // // console.log("Token=", token);
    if (!token.usr.accessKeyword) {
      // // console.log("gggggggggggggggggggggg");

      return;
    }
  }


  ngOnInit(): void {
    this.spiner();
    this.department();
    this.location();

    this.loadData();

    
    // this.ApprovedApplyData();
    // this.mergeTables();
    // this.quarter();
  }

// Function to filter sectors based on selected location
filterSectors() {
  const locId = this.selectedQuarter?.loc_id;
  this.QuarterService.getSectorData(locId, (callback: any) => {
    this.sectorList = callback || [];

    if (!locId) {
      this.filteredSectors = [];
      return;
    }

    // Filter and normalize IDs to numbers
    this.filteredSectors = this.sectorList
      .filter((sector: any) => Number(sector.locationId) === Number(locId))
      .map((s: any) => ({ ...s, id: Number(s.id), locationId: Number(s.locationId) }));

    // Normalize selectedQuarter.sec_id to number if present
if (!this.selectedQuarter?.sec_id) {
  this.selectedQuarter.sec_id = this.filteredSectors[0]?.id ?? ''; // keep as string
}
    // Only set default when sec_id is actually null/undefined (don't overwrite existing)
    if (this.selectedQuarter?.sec_id == null) {
      this.selectedQuarter.sec_id = this.filteredSectors[0]?.id ?? null;
    }

    // debug logs (remove later if OK)
    console.log('filteredSectors sample id/type:', this.filteredSectors[0]?.id, typeof this.filteredSectors[0]?.id);
    console.log('selectedQuarter.sec_id / type:', this.selectedQuarter?.sec_id, typeof this.selectedQuarter?.sec_id);
  });
}




closeUpdateModal(){
  this.isEditing = false;
  this.originalQuarter = null; // clear backup
  // this.loadData();
}


spiner() {
  this.spinner.show();
  setTimeout(() => {
    this.spinner.hide();
  }, 15000);
}

  toggleEdit() {
  if (!this.isEditing) {
    // entering edit mode: deep copy current state
    this.originalQuarter = JSON.parse(JSON.stringify(this.selectedQuarter || {}));
  } else {
    // cancelling edit: restore values WITHOUT replacing the object reference
    const restored = JSON.parse(JSON.stringify(this.originalQuarter || {}));
    // Clear current keys then assign restored keys (preserve object reference)
    Object.keys(this.selectedQuarter || {}).forEach(k => {
  delete (this.selectedQuarter as any)[k];
  this.originalQuarter = null; // clear backup
});
    Object.assign(this.selectedQuarter, restored);
  }

  this.isEditing = !this.isEditing;

  // Refresh the sectors list (we need the options to show)
  this.filterSectors();
}




  loadData() {
  this.isLodaing = true;
  this.spiner();

  // Step 1: Fetch Quarter data
  this.QuarterService.getQuarter({}, (quarterData: any) => {
    const data1 = quarterData.map((item: any) => ({
      location_name: item["location.loc_name"],
      loc_id: item["location.id"],
      sctor_name: item["sector.sctr_name"],
      sec_id: item["sector.id"],
      id: item.id,
      qrtr_type: item.qrtr_type,
      qrtr_no: item.qrtr_no,
      allottee_name: item.allottee_name,
      designation: item.designation,
      dept_name: item["department.dept_name"],
      department_id: item["department.id"],
      gMapLink: item.gMapLink,
      allotment_order: item.allotment_order,
      table_from: "Quarter",
      qrtr_longitude: item.qrtr_longitude,
      qrtr_letitude: item.qrtr_letitude,
      photo_1: item.photo_1,
      photo_2: item.photo_2,
      photo_3: item.photo_3,
      photo_4: item.photo_4,
      userId: null,
    }));
    console.log("count data1",data1);
    
    this.data1 = data1;

    // Step 2: Fetch ApprovedApplyData
    this.QuarterService.getApprovedApplyData({}, (approvedData: any) => {
      const data2 = approvedData.map((item: any) => ({
        location_name: item.loc_name,
        loc_id: item["location.id"],
        sctor_name: item.sctr_name,
        sec_id: item["sector.id"],
        id: item.id,
        qrtr_type: item.qrtr_type,
        qrtr_no: item.qrtr_no,
        allottee_name: item["user.f_name"] + " " + item["user.l_name"],
        designation: item["user.designation"],
        dept_name: item["user.department.dept_name"],
        department_id: item["user.department.id"],
        gMapLink: item.map_loc,
        allotment_order: item.photo_1,
        table_from: "Approved_table"
      }));
      console.log("count data2",data2);
      this.data2 = data2;

      // Step 3: Fetch new backend data (example: PendingApplyData)
      this.QuarterService.getApproveFreshData({}, (pendingData: any) => {
        const data3 = pendingData.map((item: any) => ({
          location_name: item.loc_name,
          loc_id: item["location.id"],
          sctor_name: item.sctr_name,
          sec_id: item["sector.id"],
          id: item.id,
          qrtr_type: item.qrtr_type,
          qrtr_no: item.qrtr_no,
          allottee_name: item["user.f_name"] + " " + item["user.l_name"],
          designation: item["user.designation"],
          dept_name: item["user.department.dept_name"],
          department_id: item["user.department.id"],
          gMapLink: item.map_loc,
          allotment_order: item.allot_order,
          photo_1: item.photo_1,
          photo_2: item.photo_2,
          photo_3: item.photo_3,
          photo_4: item.photo_4,
          table_from: "Alloted_table",
          status_type: item.status_type,
          userId: item.userId,
        }));
        console.log("count data3",data3);
        this.data3 = data3;

        // Step 4: Merge all tables
        this.mergeTables(); // Make sure mergeTables uses data1 + data2 + data3
        this.isLodaing = false;
      });
    });
  });
  this.isLodaing = false;
}

mergeTables() {
  if (this.data1.length > 0 || this.data2.length > 0 || this.data3?.length > 0) {
    // Step 1: Add table_from field to each dataset
    const taggedData1 = this.data1.map(item => ({ ...item, table_from: 'data1' }));
    const taggedData2 = this.data2.map(item => ({ ...item, table_from: 'data2' }));
    const taggedData3 = this.data3?.map(item => ({ ...item, table_from: 'data3' })) ?? [];

    // Step 2: Merge all datasets
    this.mergedData = [...taggedData1, ...taggedData2, ...taggedData3];

    // Step 3: Assign to datasource
    this.apiResponse = this.mergedData;
    this.dataSource = new MatTableDataSource(this.mergedData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}


  department = () => {
    let requestObject = {};
    this.QuarterService.getDepartment(requestObject, (callback: any) => {
      // console.log(callback);
      this.departmentName = callback;
    });
  }




  location = () => {
    let requestObject = {};
    this.QuarterService.getLocation(requestObject, (callback: any) => {
      this.locationData = callback;

      console.log("hhhhhhhh",callback);
      
      // this.tempLoc = callback

    });
  }

  // for quarter apply

  setQuarterLocation() {
    this.QuarterService.getSectorData(this.qtr.loc_id, (callback: any) => {
      console.log("jjjjjjjjjjjj",callback);
      
      this.sectorData = callback;
      this.qtr.sec_id = "";
      this.qtr.type = "";
    })
  }

  // for update 
  setQuarterLocationUpdate(){
    this.QuarterService.getSectorData(this.selectedQuarter.loc_id, (callback: any) => {
      this.filteredSectors = callback;
      
      this.selectedQuarter.sec_id = "";
    })
  }



  // for filter


  setLocation() {
    if (!this.filter.loc_id) {
      this.sectorData = [];
      this.filter.sec_id = "";
      this.filter.type = "";
      return;
    }
    this.QuarterService.getSectorData(this.filter.loc_id, (callback: any) => {
      this.sectorData = callback || [];
      this.filter.sec_id = "";
      this.filter.type = "";
    });
  }

  setSector() {
    this.QuarterService.checkQuarter(this.filter.sec_id, (callback: any) => {
      this.quarterData = callback;
      this.filter.type = "";

      if (!Object.keys(callback).length) {
      } else {
      }
    })
  }



  



  //date convert for image

  convertDate() {
    var date = new Date();
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1); // Month starts from 0
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }



  // Allotment order image select

  onFileSelectedAllotment(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
      this.uploadImageObject.allotment = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "AO_" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;
      this.allotment = this.uploadImageObject.allotment
        ? this.uploadImageObject.allotment["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 2 MB', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };



  save() {
    let isValid = this.validateInputs();
    if (isValid) {
          this.isLodaing = true;
          this.spiner();
          const formData = new FormData();
          formData.append("allottee_name", this.qtr.allottee_name);
          formData.append("designation", this.qtr.designation);
          formData.append("department_id", this.qtr.department_id);
          formData.append("gMapLink", this.qtr.gMapLink);
          formData.append("qrtr_no", this.qtr.qrtr_no);
          formData.append("type", this.qtr.type);
          formData.append("loc_id", this.qtr.loc_id);
          formData.append("sec_id", this.qtr.sec_id);
          formData.append("qrtr_longitude", this.qtr.qrtr_longitude);
          formData.append("qrtr_letitude", this.qtr.qrtr_letitude);
          formData.append("file", this.uploadImageObject.image);
          this.QuarterService.uploadAllotment(
            formData,
            this.acceptfileType, (response: any) => {
              this.isLodaing = false;
              this.returnMsg = response.message;
              this.uploadImageObject.image = "";
              this.isSaving = false;
              if(response.status == true){
                this.showButton = false;
                this.selectedQuarter.id = response.quarterId;
              }
              
              // this.getuserDataById();
              this.loadData();
            }
          );
    } else {
      this.isSaving = false;
    }

  }



  isAllowedFile = (file: any, callback: any) => {
    // // console.log("call", file.type);
    switch (file.type) {
      case "image/jpg":
      case "image/png":
      case "image/jpeg":
        return callback(true);
      default:
        return callback(false);
    }
  };


  validateInputs = () => {
    // // console.log("Saving project before validate", this.qtr);
    if (this.qtr.allottee_name === '' || this.qtr.allottee_name === null || this.qtr.allottee_name === undefined) {
      this.toastr.warning('Please type allottee name.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.qtr.designation === '' || this.qtr.designation === null || this.qtr.designation === undefined) {
      this.toastr.warning('Please type designation.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.qtr.department_id === '' || this.qtr.department_id === null || this.qtr.department_id === undefined) {
      this.toastr.warning('Please select department.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.qtr.loc_id === '' || this.qtr.loc_id === null || this.qtr.loc_id === undefined) {
      this.toastr.warning('Please select location.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.qtr.sec_id === '' || this.qtr.sec_id === null || this.qtr.sec_id === undefined) {
      this.toastr.warning('Please select sector', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.qtr.type === '' || this.qtr.type === null || this.qtr.type === undefined) {
      this.toastr.warning('Please select type', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.qtr.qrtr_no === '' || this.qtr.qrtr_no === null || this.qtr.qrtr_no === undefined) {
      this.toastr.warning('Please type Quarter number', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    // if (this.uploadImageObject.image === '' || this.uploadImageObject.image === null || this.uploadImageObject.image === undefined) {
    //   this.toastr.warning('Please select photo', 'Warning', {
    //     disableTimeOut: false
    //   });
    //   return false;
    // }
    return true;
  }


  resetFreshForm(){
    this.qtr.allottee_name = "";
    this.qtr.designation = "";
    this.qtr.department_id = "";
    this.qtr.gMapLink = "";
    this.qtr.qrtr_no = "";
    this.qtr.type = "";
    this.qtr.loc_id = "";
    this.qtr.sec_id = "";
    this.qtr.qrtr_longitude = "";
    this.qtr.qrtr_letitude = "";
    this.allotment = "Choose File";
    this.photoLabels.photo1 = 'Choose File',
    this.photoLabels.photo2 = 'Choose File',
    this.photoLabels.photo3 = 'Choose File',
    this.photoLabels.photo4 = 'Choose File'
    this.uploadImageObject.allotment = "";
    this.uploadImageObject.photo1 = null;
    this.uploadImageObject.photo2 = null;
    this.uploadImageObject.photo3 = null;
    this.uploadImageObject.photo4 = null;

    this.showButton = true;
  }



  FilterChange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }


  FilterChangeLocation($event: any) {
    this.setLocation();
    if (!this.filter.loc_id) {
      this.dataSource = new MatTableDataSource(this.apiResponse);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      return;
    }
    let filteredData = _.filter(this.apiResponse, (item) => {
      return item.loc_id == this.filter.loc_id;
    });
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  FilterChangeSector($event: any) {
    let filteredData = _.filter(this.apiResponse, (item) => {
      return item.sec_id == this.filter.sec_id;
    })
    // // console.log("hhhh", filteredData);
    this.filter.type = "";
    this.dataSource = new MatTableDataSource(filteredData);
  }
  FilterChangeQrtrType($event: any) {
    let filteredData = _.filter(this.apiResponse, (item) => {
      return item.qrtr_type == this.filter.type && item.sec_id == this.filter.sec_id && item.loc_id == this.filter.loc_id;
    })
    // // console.log("hhhh", filteredData);
    this.dataSource = new MatTableDataSource(filteredData);
  }

  FilterChangeDepartment($event: any) {
    let filteredData = _.filter(this.apiResponse, (item) => {
      console.log("jjjjjjjjjjj",item.department_id);
      console.log("kkkkkkkkkkkkkk",this.filter.loc_id);

      if(this.filter.loc_id == '' && this.filter.sec_id == '' && this.filter.type == ''){
         console.log("callll");
        return item.department_id == this.filter.dept_id;
      }
      
      if(this.filter.sec_id == '' && this.filter.type == ''){
         console.log("callll");
        return item.department_id == this.filter.dept_id &&  item.loc_id == this.filter.loc_id;
      }

      if(this.filter.type == ''){
         console.log("callll");
        return item.department_id == this.filter.dept_id && item.sec_id == this.filter.sec_id && item.loc_id == this.filter.loc_id;
      }

      // return false;

      return item.department_id == this.filter.dept_id &&  item.qrtr_type == this.filter.type && item.sec_id == this.filter.sec_id && item.loc_id == this.filter.loc_id;
    })
    // // console.log("hhhh", filteredData);
    this.dataSource = new MatTableDataSource(filteredData);
  }

  resetFilter() {
    this.filter.sec_id = '';
    this.filter.type = '';
    this.filter.loc_id = '';
    this.filter.dept_id = '';
    this.sectorData = [];

    this.loadData();
  }


  downloadPDF() {
    const tableBody = [
      ['S.No', 'Allottee Name', 'Department Name', 'Designation', 'Location Name', 'Sector Number', 'Quarter Type', 'Quarter Number'],
      ...this.dataSource.data.map((item: any, index: number) => [
        index + 1,
        item.allottee_name || '',       // Assuming these fields exist
        item.dept_name || '',
        item.designation || '',
        item.location_name || '',
        item.sctor_name || '',
        item.qrtr_type || '',
        item.qrtr_no || ''
      ])
    ];
  
    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [30, 40, 30, 40],
      content: [
        { text: 'Quarter Report', style: 'header' },
        {
          style: 'tableStyle',
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*', '*', '*', '*'], // 7 columns
            body: tableBody
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#CCCCCC' : null,
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#aaa',
            vLineColor: () => '#aaa',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 4,
            paddingBottom: () => 4
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20]
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
  
    (pdfMake as any).createPdf(docDefinition).download('Quarter-Report.pdf');
  }

  resetForm() {
    this.qtr.qrtr_no = '';
    this.qtr.sec_id = '';
    this.qtr.loc_id = '';
    this.qtr.qrtr_letitude = '';
    this.qtr.qrtr_longitude = '';
    this.qtr.type = '';
  }



  showRequestUpdateModal(row: any) {
    console.log("Selected Quarter=", row);
    this.selectedQuarter = row;
  }

  deleteQuarter() {
    const requestObject = {
      qId: this.selectedQuarter.id,
      status: 0,
      table_from: this.selectedQuarter.table_from,
      userId: this.currentUser?.id
    };
    // // console.log("requestObject", requestObject);

    // this.toastr.error('Delete option is currently unavailable', 'Error', {
    //   disableTimeOut: false
    // });
    this.QuarterService.deleteQuarter(requestObject, (res: any) => {

      let ele: any = document.getElementById('updateModalClose');
      ele.click();

      this.loadData();
    });
  }




  updateQuarter(){
    let isValid = this.validateUpdateInputs();
    if(isValid){
        this.QuarterService.updateQuarter(this.selectedQuarter, (res: any) =>{
          this.returnMsg = res.message;
          // // console.log("lllllllllll",this.returnMsg);
          this.location();
          this.isEditing = false;
          this.originalQuarter = null;
          let ele:any = document.getElementById('updateModalClose');
          ele.click();
          this.isSaving = false;
          this.loadData();
        });
      }else{
        this.isSaving = false;
      }
      // this.closeUpdateModal();
      // this.loadData();
  }
  


  validateUpdateInputs = () => {
    // // console.log("Saving project before validate", this.selectedQuarter);
    if (this.selectedQuarter.allottee_name === '' || this.selectedQuarter.allottee_name === null || this.selectedQuarter.allottee_name === undefined) {
      this.toastr.warning('Please type allottee name.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedQuarter.designation === '' || this.selectedQuarter.designation === null || this.selectedQuarter.designation === undefined) {
      this.toastr.warning('Please type designation.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedQuarter.department_id === '' || this.selectedQuarter.department_id === null || this.selectedQuarter.department_id === undefined) {
      this.toastr.warning('Please select department.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedQuarter.loc_id === '' || this.selectedQuarter.loc_id === null || this.selectedQuarter.loc_id === undefined) {
      this.toastr.warning('Please select location.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedQuarter.sec_id === '' || this.selectedQuarter.sec_id === null || this.selectedQuarter.sec_id === undefined) {
      this.toastr.warning('Please select sector', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedQuarter.qrtr_type === '' || this.selectedQuarter.qrtr_type === null || this.selectedQuarter.qrtr_type === undefined) {
      this.toastr.warning('Please select type', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedQuarter.qrtr_no === '' || this.selectedQuarter.qrtr_no === null || this.selectedQuarter.qrtr_no === undefined) {
      this.toastr.warning('Please type Quarter number', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }



  onPhotoSelected(event: any, field: string) {
    const allowedTypes = ['pdf', 'jpeg', 'jpg', 'png'];
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileSizeLimit = 2 * 1024 * 1024; // 2 MB
  
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
  
      if (!allowedTypes.includes(fileExtension)) {
        this.toastr.error('Only PDF, JPG, JPEG, or PNG files are allowed', 'Invalid File Type', {
          disableTimeOut: false
        });
        return;
      }
  
      if (file.size > fileSizeLimit) {
        this.toastr.error('File size should be less than 2 MB', 'Error', {
          disableTimeOut: false
        });
        return;
      }
  
      const newName = `${field.toUpperCase()}_${this.convertDate()}.${fileExtension}`;
      const blob = file.slice(0, file.size, file.type);
      const renamedFile = new File([blob], newName, { type: file.type });
  
      this.uploadImageObject[field] = file;
      this.uploadImageObject.imageFiles[field] = renamedFile;
      this.photoLabels[field] = file.name;
    }
  }
  


  
// will delete if everything is ok

// photo4(){
//   if(this.uploadImageObject.imageFiles.photo4 != null){
//   this.isLodaing = true;
//   this.spiner();
//   const formData = new FormData();
//   formData.append("dbid", this.selectedQuarter.id);
//   formData.append("table_from", this.selectedQuarter.table_from);
//   formData.append("photo_number", "photo4");
//   formData.append("file", this.uploadImageObject.imageFiles.photo4);
//   this.QuarterService.updateQuarterWithPhotos(
//     formData,
//     this.acceptfileType, (response: any) => {
//       this.isLodaing = false;
//       this.returnMsg = response.message;
//       this.uploadImageObject.image = "";
//       this.isSaving = false;
      
//     }
//   );
// }else{
//   this.toastr.warning('Please select image', 'Warning', {
//     disableTimeOut: false
//   });
// }
// }

// allotmentOrder(){
//   this.isLodaing = true;
//   this.spiner();
//   const formData = new FormData();
//   formData.append("dbid", this.selectedQuarter.id);
//   formData.append("table_from", this.selectedQuarter.table_from);
//   formData.append("photo_number", "AO");
//   formData.append("file", this.uploadImageObject.imageFiles.Allot);
//   this.QuarterService.updateQuarterWithPhotos(
//     formData,
//     this.acceptfileType, (response: any) => {
//       this.isLodaing = false;
//       this.returnMsg = response.message;
//       this.uploadImageObject.image = "";
//       this.isSaving = false;
      
//     }
//   );
// }

allotmentOrder() {
  this.uploadPhoto("Allot");
}

photo1() {
  this.uploadPhoto("photo1");
}

photo2() {
  this.uploadPhoto("photo2");
}

photo3() {
  this.uploadPhoto("photo3");
}

photo4() {
  this.uploadPhoto("photo4");
}

private uploadPhoto(photoKey: string) {
  const file = this.uploadImageObject.imageFiles[photoKey];

  if (file != null) {
    this.isLodaing = true;
    this.spiner();

    const formData = new FormData();
    formData.append("dbid", this.selectedQuarter.id);
    formData.append("userId", this.selectedQuarter.userId);
    formData.append("photo_number", photoKey);
    formData.append("file", file);

    // Decide API
    let apiCall;
    if (this.selectedQuarter.table_from === 'data1') {
      apiCall = this.QuarterService.updateQuarterWithPhotos;
    } else if (this.selectedQuarter.table_from === 'data3') {
      apiCall = this.QuarterService.updateQuarterAllotedPhoto;
    } else {
      this.isLodaing = false;
      this.toastr.error('Invalid table source', 'Error');
      return;
    }

    apiCall.call(this.QuarterService, formData, this.acceptfileType, (response: any) => {
      this.isLodaing = false;
      this.returnMsg = response.message;
      this.uploadImageObject.image = "";
      this.isSaving = false;
      this.loadData();
    });

  } else {
    this.toastr.warning('Please select image', 'Warning', { disableTimeOut: false });
  }
}




updateFreshQuarter(){
    let isValid = this.validateUpdateInputs();
    console.log("dataaaaaaaaaaaaaa",this.selectedQuarter);
    
    if(isValid){
        this.QuarterService.updateFreshQuarter(this.selectedQuarter, (res: any) =>{
          this.returnMsg = res.message;
          // // console.log("lllllllllll",this.returnMsg);
          this.location();
          // let ele:any = document.getElementById('updateModalClose');
          // ele.click();
          this.isSaving = false;
          // this.loadData();
          this.isEditing = !this.isEditing;
        });
      }else{
        this.isSaving = false;
      }
      // this.closeUpdateModal();
      // this.loadData();
  }



  // this is not in use
  
  updateQuarterAllotment(){
    let isValid = this.validateUpdateInputs();
    console.log("dataaaaaaaaaaaaaa",this.selectedQuarter);
    
    if(isValid){
        this.QuarterService.updateQuarterAllotment(this.selectedQuarter, (res: any) =>{
          this.returnMsg = res.message;
          // // console.log("lllllllllll",this.returnMsg);
          this.location();
          // let ele:any = document.getElementById('updateModalClose');
          // ele.click();
          this.isEditing = false;
          this.originalQuarter = null;
          this.isSaving = false;
          this.loadData();
        });
      }else{
        this.isSaving = false;
      }
      // this.closeUpdateModal();
      // this.loadData();
  }
}
