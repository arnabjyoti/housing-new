import { Component, OnInit, ViewChild } from '@angular/core';
import { CourtCaseService } from './court-case.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { locationData } from '../../location/location.component';
import * as _ from 'lodash';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export interface caseData {
  id: string,
  location_name: string,
}

@Component({
  selector: 'app-court-case',
  templateUrl: './court-case.component.html',
  styleUrls: ['./court-case.component.css'],
  standalone: true,
  imports: [NgxSpinnerModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule],
})
export class CourtCaseComponent implements OnInit {

  public displayedColumns: string[] = ['Sl', 'case_no', 'case_nature', 'case_details', 'case_start', 'location', 'sector', 'qtr_no', 'case_status', 'action'];
  dataSource !: MatTableDataSource<caseData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  public locationData: any = {
    id: "",
    lcn_name: "",
  };

  public filter: any = {
    loc_id: '',
    sec_id: '',
    type: '',
  }

  public add: any = {
    case_name: "",
    qtr_no: "",
    case_no: "",
    case_nature: "",
    case_details: "",
    case_start: "",
    case_status: "",
    courtCaseId: ""
  }

  public dbId: any;
  public isLodaing = true;

  public myDate: any = new Date();
  public day: any;
  public month: any;

  public endpoint: any;
  public sectorData: any;
  public quarterData: any;

  public sectorDataUpdate: any;
  public quarterDataUpdate: any;

  public uploadImageObject: any = {
    panImg: '',
    adharImg: ''
  }

  public court_case_doc: string = "Attachment Upload";
  public showUploadBtn: boolean = false;

  public acceptfileType: string = "image";
  public isSaving: boolean = false;

  public caseListData: any;

  public sectorUpdateData: any;

  public apiResponse: any = [];

  public selectedCase: any = {
    courtCaseId: '',
    courtCaseImagesId: '',
    image_desc: '',
    image_name: '',
    locationId: '',
    loc_name: '',
    sectorId: '',
    sctr_name: '',
    id: '',
    case_details: '',
    case_nature: '',
    case_no: '',
    case_status: '',
    end_date: '',
    qrtr_no: '',
    start_date: '',
    status: ''
  }

  public deleteData: any;

  public locUpdate: boolean = false;


  constructor(
    private CourtCaseService: CourtCaseService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
  ) {
    this.endpoint = environment.BASE_URL;
    this.init();
    this.myDate = this.datePipe.transform(this.myDate, "YYYY-MM-dd");
  }
  init = () => {
    let token = JSON.parse(JSON.stringify(localStorage.getItem('token')));
    token = JSON.parse(token);
    console.log("Token=", token);
    if (!token.usr.accessKeyword) {
      console.log("gggggggggggggggggggggg");

      return;
    }
  }

  ngOnInit(): void {
    this.caseList();
    this.location();
  }

  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 9000);
  }

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


  caseList = () => {
    let requestObject = {};
    this.CourtCaseService.getCaseData(requestObject, (callback: any) => {
      console.log("Raw API Response:", callback);

      let formattedCases = callback.map((item: any) => {
        return {
          id: item.id,
          case_nature: item.case_nature,
          case_no: item.case_no,
          case_details: item.case_details,
          start_date: item.start_date,
          end_date: item.end_date,
          case_status: item.case_status,
          qrtr_no: item.qrtr_no,
          status: item.status,
          locationId: item.locationId,
          loc_name: item.location?.loc_name || "N/A",
          sectorId: item.sectorId,
          sctr_name: item.sector?.sctr_name || "N/A",
          courtCaseImages: item.courtCaseImages.map((img: any) => ({
            courtCaseImagesId: img.id,
            courtCaseId: img.courtCaseId,
            image_desc: img.image_desc || "No description",
            image_name: img.image_name,
          })),
        };
      });

      this.caseListData = formattedCases;

      this.apiResponse = this.caseListData;

      this.dataSource = new MatTableDataSource(this.caseListData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      console.log("Processed Case Data:", this.dataSource);
    });
  };

  FilterChange(data:Event){
    const value=(data.target as HTMLInputElement).value;
    this.dataSource.filter=value;
  }

  FilterChangeLocation($event:any){
    let filteredData = _.filter(this.apiResponse,(item)=>{
      return item.locationId == this.filter.loc_id;
    })
    console.log("ssssss",filteredData);
    this.dataSource = new MatTableDataSource(filteredData);
  }
  
  FilterChangeSector($event:any){
    let filteredData = _.filter(this.apiResponse,(item)=>{
      return item.sectorId == this.filter.sec_id;
    })
    console.log("hhhh",filteredData);
    this.filter.type = "";
    this.dataSource = new MatTableDataSource(filteredData);
  }
  FilterChangeQrtrType($event:any){
    let filteredData = _.filter(this.apiResponse,(item)=>{
      return item.qrtr_type == this.filter.type;
    })
    console.log("hhhh",filteredData);
    this.dataSource = new MatTableDataSource(filteredData);
  }
  
  setLocationforFilter(){
    this.CourtCaseService.getSectorData(this.filter.loc_id, (callback:any)=>{
      console.log("set location",callback);
      this.sectorData = callback;
      this.filter.sec_id = "";
      this.filter.type = "";
    })
  }
  
  resetFilter(){
    this.filter.sec_id = '';
    this.filter.type = '';
    this.filter.loc_id = '';
    
    this.caseList();
  }

  location = () => {
    let requestObject = {};
    this.CourtCaseService.getLocation(requestObject, (callback: any) => {
      console.log("bbbbbbbbbb", callback);
      this.locationData = Array.isArray(callback)
        ? callback.filter((loc: any) => loc && loc.status !== '0' && loc.status !== 0)
        : [];
      console.log("location details", this.locationData);
    });
  }


  // for filter
  setLocation() {
    this.CourtCaseService.getSectorData(this.filter.loc_id, (callback: any) => {
      console.log("set location", callback);
      this.sectorData = callback;
    })
  }

  setSector() {
    this.CourtCaseService.checkQuarter(this.filter.sec_id, (callback: any) => {
      console.log("set sector", Object.keys(callback).length);
      this.quarterData = callback;
      // console.log("quarterData",this.quarterData.result);

      if (!Object.keys(callback).length) {
        // this.hideForm = false;
        // this.showButton = true;
      } else {
        // this.hideForm = true;
        // this.showButton = false;
      }
    })
  }



  downloadPDF() {
      const tableBody = [
        ['S.No', 'Case Number', 'Nature', 'Details', 'Start Date', 'Location Name', 'Sector Name', 'Quarter Number'],
        ...this.dataSource.data.map((item: any, index: number) => [
          index + 1,
          item.case_no || '',       // Assuming these fields exist
          item.case_nature || '',
          item.case_details || '',
          item.start_date  ? new Date(item.start_date).toLocaleDateString('en-GB') : '', // dd/mm/yyyy
          item.loc_name || '',
          item.sctr_name || '',
          item.qrtr_no || ''
        ])
      ];
    
      const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [30, 40, 30, 40],
        content: [
          { text: 'Court Cases Report', style: 'header' },
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
    
      (pdfMake as any).createPdf(docDefinition).download('Court-Cases-Report.pdf');
    }


  // for update
  setLocationUpdate() {
    this.CourtCaseService.getSectorData(this.selectedCase.locationId, (callback: any) => {
      console.log("set location", callback);
      this.sectorDataUpdate = callback;
    })
  }

  setSectorUpdate() {
    this.CourtCaseService.checkQuarter(this.selectedCase.sectorId, (callback: any) => {
      console.log("set sector", Object.keys(callback).length);
      this.quarterDataUpdate = callback;
      // console.log("quarterData",this.quarterData.result);

      if (!Object.keys(callback).length) {
        // this.hideForm = false;
        // this.showButton = true;
      } else {
        // this.hideForm = true;
        // this.showButton = false;
      }
    })
  }



  setUpdateLocation() {
    this.CourtCaseService.getSectorData(this.selectedCase.locationId, (callback: any) => {
      console.log("set location", callback);
      this.sectorUpdateData = callback;
    })
  }



  saveform() {
    console.log("data", this.add);

    const formData = new FormData();
    formData.append("quarterData", this.filter);
    formData.append("caseData", this.add);
    console.log("xxxxxxxxxxxxxxxxxxx", formData);


    let isValidInputs = this.validateInputs();
    if (isValidInputs) {
      this.isLodaing = true;
      this.spiner();
      this.CourtCaseService.createCourtCase(this.add, this.filter, (res: any) => {
        this.isLodaing = false;
        this.dbId = res.message;
        this.caseList();
        this.showUploadBtn = true;
      })
    }

  }

  validateInputs = () => {
    console.log("Saving form before validate", this.add);
    if (this.filter.loc_id === '' || this.filter.loc_id === null || this.filter.loc_id === undefined) {
      this.toastr.warning('Please select Location.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.filter.sec_id === '' || this.filter.sec_id === null || this.filter.sec_id === undefined) {
      this.toastr.warning('Please select Sector', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.add.qtr_no === '' || this.add.qtr_no === null || this.add.qtr_no === undefined) {
      this.toastr.warning('Please type Quarter number', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.add.case_no === '' || this.add.case_no === null || this.add.case_no === undefined) {
      this.toastr.warning('Please type case number', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.add.case_nature === '' || this.add.case_nature === null || this.add.case_nature === undefined) {
      this.toastr.warning('Please type nature of the case', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    // if (this.add.case_details === '' || this.add.case_details === null || this.add.case_details === undefined) {
    //   this.toastr.warning('Please type case details', 'Warning', {
    //     disableTimeOut: false
    //   });
    //   return false;
    // }
    if (this.add.case_start === '' || this.add.case_start === null || this.add.case_start === undefined) {
      this.toastr.warning('Please select case start date', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.add.case_status === '' || this.add.case_status === null || this.add.case_status === undefined) {
      this.toastr.warning('Please select case status', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  resetForm() {
    this.filter.loc_id = '';
    this.filter.sec_id = '';
    this.filter.type = '';

    this.add.qtr_no = '';
    this.add.case_no = '';
    this.add.case_nature = '';
    this.add.case_details = '';
    this.add.case_start = '';
    this.add.case_status = '';
    this.court_case_doc = "Attachment Upload";
  }


  onFileSelected(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.court_case_doc = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "CC_" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.court_case_doc = this.uploadImageObject.court_case_doc
        ? this.uploadImageObject.court_case_doc["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };

  uploadAttach() {
    {
      let isValid = this.validatePan();
      if (isValid) {
        this.isLodaing = true;
        this.spiner();
        const formData = new FormData();
        formData.append("dbid", this.dbId);
        formData.append("file", this.uploadImageObject.image);
        this.CourtCaseService.uploadCourtCase(
          formData,
          this.dbId,
          this.acceptfileType, (response: any) => {
            this.isLodaing = false;
            this.uploadImageObject.image = "";
            this.isSaving = false;
            this.resetForm();
            this.caseList();
            this.showUploadBtn = false;
            let ele: any = document.getElementById('modalClose');
            ele.click();
          }
        );
      } else {
        this.isSaving = false;
      }
    }
  }

  validatePan = () => {
    if (this.uploadImageObject.image === '' || this.uploadImageObject.image === null || this.uploadImageObject.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }


  showCaseUpdateModal(row: any) {
    console.log("Selected Project=", row);
    this.selectedCase = row;

    // this.selectedCase.case_name = row.case_name;
    // this.selectedCase.qtr_no = row.qtr_no;
    // this.selectedCase.case_no = row.case_no;
    // this.selectedCase.case_nature = row.case_nature;
    // this.selectedCase.case_details = row.case_details;
    // this.selectedCase.case_start = row.case_start;
    // this.selectedCase.case_status = row.case_status;
    // this.selectedCase.courtCaseId = row.courtCaseImages.courtCaseId;

    console.log("hhhhhhhhhhhh", this.selectedCase);

    let deleteModal: any = document.getElementById("LocUpdate");
    // deleteModal.classList.remove("hidden");
    // deleteModal.classList.add("show");
  };


  updateform() {
    console.log("data", this.selectedCase);

    const formData = new FormData();
    formData.append("quarterData", this.filter);
    formData.append("caseData", this.add);
    console.log("xxxxxxxxxxxxxxxxxxx", formData);


    let isValidInputs = this.validateUpdateInputs();
    if (isValidInputs) {
      this.isLodaing = true;
      this.spiner();
      this.CourtCaseService.updateCourtCase(this.selectedCase, (res: any) => {
        this.isLodaing = false;
        this.caseList();
      })
      let ele: any = document.getElementById('updateModalclose');
      ele.click();
    }

  }

  validateUpdateInputs = () => {
    console.log("Saving form before validate", this.selectedCase);
    if (this.locUpdate == true) {
      if (this.selectedCase.locationId === '' || this.selectedCase.locationId === null || this.selectedCase.locationId === undefined) {
        this.toastr.warning('Please select loation', 'Warning', {
          disableTimeOut: false
        });
        return false;
      }
      if (this.selectedCase.sectorId === '' || this.selectedCase.sectorId === null || this.selectedCase.sectorId === undefined) {
        this.toastr.warning('Please select sector', 'Warning', {
          disableTimeOut: false
        });
        return false;
      }
    }
    if (this.selectedCase.qrtr_no === '' || this.selectedCase.qrtr_no === null || this.selectedCase.qrtr_no === undefined) {
      this.toastr.warning('Please type quarter number', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedCase.case_no === '' || this.selectedCase.case_no === null || this.selectedCase.case_no === undefined) {
      this.toastr.warning('Please type case number', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedCase.case_nature === '' || this.selectedCase.case_nature === null || this.selectedCase.case_nature === undefined) {
      this.toastr.warning('Please type nature of the case', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    // if (this.selectedCase.case_details === '' || this.selectedCase.case_details === null || this.selectedCase.case_details === undefined) {
    //   this.toastr.warning('Please type case details', 'Warning', {
    //     disableTimeOut: false
    //   });
    //   return false;
    // }
    if (this.selectedCase.start_date === '' || this.selectedCase.start_date === null || this.selectedCase.start_date === undefined) {
      this.toastr.warning('Please select case start date', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.selectedCase.case_status === '' || this.selectedCase.case_status === null || this.selectedCase.case_status === undefined) {
      this.toastr.warning('Please select case status', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }




  updateBtnOff() {
    this.locUpdate = true;
    this.selectedCase.sectorId = '';
  }

  updateBtnOn() {
    this.locUpdate = false;
  }


  uploadUpdatedAttach() {
    {
      let isValid = this.validatePan();
      if (isValid) {
        this.isLodaing = true;
        this.spiner();
        const formData = new FormData();
        formData.append("dbid", this.selectedCase.id);
        formData.append("file", this.uploadImageObject.image);
        this.CourtCaseService.uploadCourtCase(
          formData,
          this.dbId,
          this.acceptfileType, (response: any) => {
            this.isLodaing = false;
            this.uploadImageObject.image = "";
            this.isSaving = false;
            this.resetForm();
            this.caseList();
            this.showUploadBtn = false;
            let ele: any = document.getElementById('modalClose');
            ele.click();
          }
        );
      } else {
        this.isSaving = false;
      }
    }
  }


  deleteform(){
    console.log("data", this.selectedCase.id);

    
      this.isLodaing = true;
      this.spiner();
      this.CourtCaseService.deleteCourtCase(this.selectedCase.id, (res: any) => {
        this.isLodaing = false;
        this.caseList();
      })
      let ele: any = document.getElementById('updateModalclose');
      ele.click();
 

  }
}
