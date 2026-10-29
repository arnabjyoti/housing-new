import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { QuarterRenewalService } from './quarter-renewal.service';

import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import * as _ from 'lodash'
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { NgxPrintModule } from 'ngx-print';


import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).vfs;


export interface departmentData {
  id: string,
}

@Component({
  selector: 'app-quarter-renewal',
  templateUrl: './quarter-renewal.component.html',
  styleUrls: ['./quarter-renewal.component.css'],
  standalone: true,
  imports: [NgxPrintModule, NgxSpinnerModule, MatTableModule, MatGridListModule, MatSelectModule, RouterModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule, MatSortModule],
})
export class QuarterRenewalComponent implements OnInit {

  public displayedColumns: string[] = ['Sl', 'applicant_name', 'gender', 'designation', 'location', 'sector', 'qrtr_type', 'qrtr_no', 'apply_date', 'reference_no', 'status', 'action'];

  dataSource !: MatTableDataSource<departmentData>
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  public departmentData = {
    dept_name: ""
  };

  public endpoint: any;
  public data: any;

  public locationData: any;

  public filter: any = {
    loc_id: '',
    sec_id: '',
    type: '',
  }
  public apiResponse: any = [];
  public sectorData: any = [];
  public quarterData: any;



  // or print form

  public selectedQuarter: any = {};


  //renewal for part 1

  public userCredentials: any = {
    f_name: "",
    m_name: "",
    l_name: "",
    gender: "",
    email: "",
    phone_no: "",
    designation: "",
    civic: "",
    civic_charge: "",
    others: "",
    department: "",
    basic_pay: "",
    pay_matrix: "",
    service_status: "",
    transferable: "",
    doa: "",
    dor: "",
    dojs: "",
    dos: "",
    spouse_f_name: "",
    spouse_l_name: "",
    spouse_occ: "",
    spouse_acco: "",
    resid_house: "",
    annexure_a_place: "",
    annexure_a_date: "",
    aadhaar_number: "",
    otp: "",
    role: "user"
  };
  public aadhaarError: string = "";
  public isAadhaarExist: boolean = false;
  public OTP = {
    otp1: "",
  }
  mat0: any;

  public uploadImageObject: any = {
    panImg: '',
    adharImg: ''
  }

  departmentName: any;
  returnMsg: any;
  createMsg: any;
  public isRegister: boolean = false;
  showOTPInput: boolean = false;
  showVerify: boolean = false;

  public firstRegForm: boolean = true;
  public registrationForm: boolean = false;
  public regUpload: boolean = false;
  public renewalForm: boolean = false;

  public isSaving: boolean = false;
  public chooseFile: string = "Choose File";
  public annexure: string = "Choose File";
  public pan: string = "Choose File";
  public adhar: string = "Choose File";
  public photo: string = "Choose File";
  public sign: string = "Choose File";
  public idCard: string = "Choose File";
  public day: any;
  public month: any;
  public acceptfileType: string = "image";

  public dbId: any;

  public showSaveData: boolean = false;

  public showAnx: boolean = true;
  public showAnxBtn: boolean = false;
  public showAnxSc: boolean = true;

  public showPan: boolean = true;
  public showPanBtn: boolean = false;
  public showPanSc: boolean = true;

  public showAdhar: boolean = true;
  public showAdharBtn: boolean = false;
  public showAdharSc: boolean = true;

  public showUpload: boolean = true;
  public showRenewalUpload: boolean = false;

  public showPhoto: boolean = true;
  public showPhotoBtn: boolean = false;
  public showPhotoSc: boolean = true;

  public showSign: boolean = true;
  public showSignBtn: boolean = false;
  public showSignSc: boolean = true;

  public showId: boolean = true;
  public showIdBtn: boolean = false;
  public showIdSc: boolean = true;

  public showLogin: boolean = true;

  public myDate: any = new Date();

  public isLodaing = true;




  //renewal for part 2

  public checkValue: any = {

  }

  public regInput: any = {
    sctr_name: "",
    loc_name: "",
    qrtr_type: "",
    qrtr_no: "",
    type: "",
    loc_id: "",
    sec_id: "",
    qrtr_longitude: "",
    qrtr_letitude: "",
    map_loc: "",
    d_w: "",
    e_w: "",
    r_c: "",
    s_q: "",
    s_t: "",
    qtr_extnd: "",
    type_of_strc: "",
    area_extnd_strc: "",
    extnd_prmsn: "",
    strc_nearby: "",
    strc_by_whm: "",
    strc_distance: "",
    strc_type: "",
    strc_allot: "",
    strc_area: "",
    strc_storeys: "",

    startDate: "",
    renewalDate: "",
    status: "",
    remark: "",
  }

  public uploadImageObjectOrder: any = {
    panImg: '',
    adharImg: ''
  }

  public uploadImageObjectSide1: any = {
    panImg: '',
    adharImg: ''
  }

  public uploadImageObjectSide2: any = {
    panImg: '',
    adharImg: ''
  }

  public uploadImageObjectSide3: any = {
    panImg: '',
    adharImg: ''
  }

  public uploadImageObjectSide4: any = {
    panImg: '',
    adharImg: ''
  }

  public uploadImageObjectExtnd: any = {
    panImg: '',
    adharImg: ''
  }

  public allot_order: string = "Allotment Order";
  public allot_orderBtn: boolean = true;
  public allot_orderMsg: boolean = false;

  public SideOne: string = "Side 1";
  public SideOneBtn: boolean = true;
  public SideOneMsg: boolean = false;

  public SideTwo: string = "Side 2";
  public SideTwoBtn: boolean = true;
  public SideTwoMsg: boolean = false;

  public SideThree: string = "Side 3";
  public SideThreeBtn: boolean = true;
  public SideThreeMsg: boolean = false;

  public SideFour: string = "Side 4";
  public SideFourBtn: boolean = true;
  public SideFourMsg: boolean = false;

  public qtr_extnd_doc: boolean = true;
  public qtr_extnd_doc_label: string = "Upload extension document ";
  public qtr_extnd_docBtn: boolean = true;
  public qtr_extnd_docMsg: boolean = false;
  public qtr_e_pass: boolean = false;

  public declaration: boolean = false;
  public inputShow: boolean = false;
  public formSubmit: boolean = true;
  public check: boolean = false;
  public finalBtn: boolean = true;
  public inputFinalShow: boolean = true;
  public renewaFormld: any;
  public rfrncNo: any;

  public finalInput: any = {
    test: '',
  }


  // upload_signed_copy
  public upload_signed_copy: string = "Choose File";



  //count

  public renewTotal: any;
  public renewPending: any;
  public renewRejected: any;
  public renewApproved: any;

  @Output() added = new EventEmitter<any>();
  constructor(
    private spinner: NgxSpinnerService,
    private QuarterRenewalService: QuarterRenewalService,
    private toastr: ToastrService,
  ) {
    this.endpoint = environment.BASE_URL;
    this.init();
  }
  init = () => {
    let token = JSON.parse(JSON.stringify(localStorage.getItem('token')));
    token = JSON.parse(token);
    // console.log("Token=", token);
    if (!token.usr.accessKeyword) {
      // console.log("gggggggggggggggggggggg");

      return;
    }
  }

  ngOnInit(): void {
    this.adminCardCount();
    this.applicationData();
    this.location();
  }


  adminCardCount = () => {
    this.QuarterRenewalService.quarterRenewalCount((res: any) => {
      // console.log("admincount", res);

      this.renewTotal = res.renewTotal;
      this.renewPending = res.renewPending;
      this.renewRejected = res.renewRejected;
      this.renewApproved = res.renewApproved;
    });
  }

  location = () => {
    let requestObject = {};
    this.QuarterRenewalService.getLocation(requestObject, (callback: any) => {
      // console.log("bbbbbbbbbb", callback);
      this.locationData = callback;
      // console.log("location details", this.locationData);
      this.resetForm();
    });
  }

  setLocation() {
    if (!this.filter.loc_id) {
      this.sectorData = [];
      this.filter.sec_id = "";
      this.filter.type = "";
      return;
    }
    this.QuarterRenewalService.getSectorData(this.filter.loc_id, (callback: any) => {
      // console.log("set location", callback);
      this.sectorData = callback || [];
      this.filter.sec_id = "";
      this.filter.type = "";
    });
  }

  setSector() {
    this.QuarterRenewalService.checkQuarter(this.filter.sec_id, (callback: any) => {
      // console.log("set sector", Object.keys(callback).length);
      this.quarterData = callback;
      this.filter.type = "";
      // // console.log("quarterData",this.quarterData.result);

      if (!Object.keys(callback).length) {
        // this.hideForm = false;
        // this.showButton = true;
      } else {
        // this.hideForm = true;
        // this.showButton = false;
      }
    })
  }


  applicationData() {
    let requestObject = {};
    this.QuarterRenewalService.applyData(requestObject, (callback: any) => {
      // console.log("callback", callback);
      // 'id', 'f_name', 'l_name', 'email', 'role', 'phone_no', 'designation', 'departmentId', 'basic_pay', 'service_status', 'transferable', 'doa', 'dor', 'dojs', 'dos', 'spouse_f_name', 'spouse_l_name', 'spouse_occ', 'spouse_acco', 'resid_house','photo', 'sign', 'adhar', 'identity', 
      let temp: any = [];
      callback.map((item: any) => {
        temp.push({
          userId: item["user.id"],
          applicant_name: item["user.f_name"] + " " + item["user.l_name"],
          f_name: item["user.f_name"],
          l_name: item["user.l_name"],
          gender: item["user.gender"],
          email: item["user.email"],
          phone_no: item["user.phone_no"],
          designation: item["user.designation"],
          civic_charge: item["user.civic_charge"],
          basic_pay: item["user.basic_pay"],
          pay_matrix: item["user.pay_matrix"],
          service_status: item["user.service_status"],
          transferable: item["user.transferable"],
          doa: item["user.doa"],
          dor: item["user.dor"],
          dojs: item["user.dojs"],
          dos: item["user.dos"],
          spouse_f_name: item["user.spouse_f_name"],
          spouse_l_name: item["user.spouse_l_name"],
          spouse_occ: item["user.spouse_occ"],
          spouse_acco: item["user.spouse_acco"],
          resid_house: item["user.resid_house"],
          photo: item["user.photo"],
          sign: item["user.sign"],
          adhar: item["user.adhar"],
          identity: item["user.identity"],

          sctr_name: item["sector.sctr_name"],
          sctr_id: item["sector.id"],

          loc_name: item["location.loc_name"],
          loc_id: item["location.id"],

          dept_name: item["user.department.dept_name"],

          id: item.id,
          reference_no: item.reference_no,
          apply_date: item.apply_date,
          startDate: item.startDate,
          allot_order: item.allot_order,

          qrtr_type: item.qrtr_type,
          qrtr_no: item.qrtr_no,
          qrtr_letitude: item.qrtr_letitude,
          qrtr_longitude: item.qrtr_longitude,
          photo_1: item.photo_1,
          photo_2: item.photo_2,
          photo_3: item.photo_3,
          photo_4: item.photo_4,
          d_w: item.d_w,
          e_w: item.e_w,
          r_c: item.r_c,
          s_q: item.s_q,
          qtr_extnd: item.qtr_extnd,
          type_of_strc: item.type_of_strc,
          area_extnd_strc: item.area_extnd_strc,
          extnd_prmsn: item.extnd_prmsn,
          extnd_doc: item.extnd_doc,
          strc_nearby: item.strc_nearby,
          strc_by_whm: item.strc_by_whm,
          strc_distance: item.strc_distance,
          strc_type: item.strc_type,
          strc_allot: item.strc_allot,
          strc_area: item.strc_area,
          strc_storeys: item.strc_storeys,
          strc_photo: item.strc_photo,
          applyDate: item.applyDate,
          status: item.status,
          upload_signed_copy: item.upload_signed_copy,
        })
        this.data = temp;
      });

      // console.log("new property=======>>>>>", this.data);

      // this.departmentName = new MatTableDataSource(callback);
      this.apiResponse = this.data;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      // console.log("paginator", this.paginator);

      this.dataSource.sort = this.sort;
      // console.log("bbbbbbbbbb", this.regInput);

    });
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
      return item.sctr_id == this.filter.sec_id;
    })
    // console.log("hhhh", filteredData);
    this.filter.type = "";
    this.dataSource = new MatTableDataSource(filteredData);
  }
  FilterChangeQrtrType($event: any) {
    let filteredData = _.filter(this.apiResponse, (item) => {
      return item.qrtr_type == this.filter.type && item.sctr_id == this.filter.sec_id && item.loc_id == this.filter.loc_id
    })
    // console.log("hhhh", filteredData);
    this.dataSource = new MatTableDataSource(filteredData);
  }


  downloadPDF() {
    const tableBody = [
      [
        'S.No',
        'Applicant Name',
        'Department Name',
        'Gender',
        'Designation',
        'Location Name',
        'Sector Number',
        'Quarter Type',
        'Quarter Number',
        'Apply Date',
        'Status'
      ],
      ...this.dataSource.data.map((item: any, index: number) => [
        index + 1,
        item.applicant_name || '',
        item.dept_name || '',  // Added department_name
        item.gender || '',
        item.designation || '',
        item.loc_name || '',
        item.sctr_name || '',
        item.qrtr_type || '',
        item.qrtr_no || '',
        item.applyDate || '',
        item.status || ''
      ])
    ];
  
    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [10, 20, 20, 20],
      content: [
        { text: 'Quarter Renewal Report', style: 'header' },
        {
          style: 'tableStyle',
          table: {
            headerRows: 1,
            widths: [
              'auto', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'
            ], // 10 columns
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
          fontSize: 6 // ✅ Updated font size
        }
      },
      footer: (currentPage: number, pageCount: number) => ({
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'center',
        margin: [0, 10],
        fontSize: 9
      })
    };
  
    (pdfMake as any).createPdf(docDefinition).download('Quarter-Renewal-Report.pdf');
  }
  
  


  resetFilter() {
    this.filter.sec_id = '';
    this.filter.type = '';
    this.filter.loc_id = '';
    this.sectorData = [];

    this.applicationData();
  }







  //for form submit temp part 1

  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 9000);
  }

  department = () => {
    let requestObject = {};
    this.QuarterRenewalService.getDepartment(requestObject, (callback: any) => {
      // console.log(callback);
      this.departmentName = callback;
    });
  }

  validateEmail = () => {
    if (this.returnMsg === "exist") {
      this.toastr.error("Email is already registered", "Warning");
      return false;
    }
    return true;
  }

  sendOtp() {
    let regExp_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regExp_email.test(this.userCredentials.email)) {
      //alert('Enter valid email adress')
      this.toastr.error("Enter valid email address", "Warning");
    } else {
      this.QuarterRenewalService.verifyEmail(this.userCredentials.email, (res: any) => {
        this.returnMsg = res.message;
        // console.log("lllllllllll", this.returnMsg);

        this.validateEmail();
        if (this.validateEmail()) {
          this.mat0 = Math.floor(Math.random() * (999 - 100 + 1) + 100);
          // console.log("ggg", this.mat0);
          this.userCredentials.otp = this.mat0;
          this.QuarterRenewalService.sendOtp(this.userCredentials, (res: any) => {
            this.returnMsg = res.message;
            // console.log("lllllllllll", this.returnMsg);
          });
          if (this.mat0 !== "") {
            this.showOTPInput = true;
          } else {
            this.toastr.error(
              "Oops! Something went wrong. Please try again",
              "Warning"
            );
          }
        }
      });
    }


  }

  verifyOtpData() {
    let requestObject = {
      otp: this.OTP.otp1,
    };
    if (requestObject.otp === this.mat0) {
      this.toastr.success('OTP verification Successful.', 'Success!', {
        disableTimeOut: false
      });
      this.showVerify = true;
      this.firstRegForm = false;
      this.registrationForm = true;
      this.department();
    } else {
      this.toastr.error('OTP not matched.', 'Warning', {
        disableTimeOut: false
      });
    }
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

  register() {
    this.userCredentials.annexure_a_date = this.myDate;
    this.civic();
    let isValidInputs = this.validateInputs();
    if (isValidInputs) {
      this.isLodaing = true;
      this.spiner();
      this.QuarterRenewalService.createUser(this.userCredentials, (res: any) => {
        this.isLodaing = false;
        this.dbId = res.message
        this.showAdhar = false;
        this.showOTPInput = false;
        this.showUpload = false;
        this.regUpload = true;
      })
    }
  }

  //for Annexure Card
  onFileSelectAnnexure(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.annexure = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "ANNEXURE" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.annexure = this.uploadImageObject.annexure
        ? this.uploadImageObject.annexure["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };

  //for PAN Card
  onFileSelect(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.pan = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "PAN" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.pan = this.uploadImageObject.pan
        ? this.uploadImageObject.pan["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  onFileSelected(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.adhar = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "ADHAR" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.adhar = this.uploadImageObject.adhar
        ? this.uploadImageObject.adhar["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };

  onFileSelectedPhoto(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.photo = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "PHOTO" + this.convertDate() + "." + fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.photo = this.uploadImageObject.photo
        ? this.uploadImageObject.photo["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  onFileSelectedsign(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.sign = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "SIGN" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.sign = this.uploadImageObject.sign
        ? this.uploadImageObject.sign["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  onFileSelectedId(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.idCard = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "ID" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.idCard = this.uploadImageObject.idCard
        ? this.uploadImageObject.idCard["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadAnx() {
    let isValid = this.validatePan();
    if (isValid) {
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.QuarterRenewalService.uploadAnx(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showPan = false;
          this.showAnxSc = false;
          this.showAnxBtn = true;
          this.uploadImageObject.image = "";
          this.isSaving = false;
        }
      );
    } else {
      this.isSaving = false;
    }
  }


  uploadPan() {
    let isValid = this.validatePan();
    if (isValid) {
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.QuarterRenewalService.uploadPan(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showAdhar = false;
          this.showPanSc = false;
          this.showPanBtn = true;
          this.uploadImageObject.image = "";
          this.isSaving = false;
        }
      );
    } else {
      this.isSaving = false;
    }
  }


  uploadAdhar() {
    let isValid = this.validatePan();
    if (isValid) {
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.QuarterRenewalService.uploadAdhar(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showAdharSc = false;
          this.showAdharBtn = true;
          this.showPhoto = false;
          this.uploadImageObject.image = "";
        });
    } else {
      this.isSaving = false;
    }
  }

  uploadPhoto() {
    let isValid = this.validatePan();
    if (isValid) {
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.QuarterRenewalService.uploadPhoto(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showSign = false;
          this.showPhotoSc = false;
          this.showPhotoBtn = true;
          this.uploadImageObject.image = "";
          this.isSaving = false;
        }
      );
    } else {
      this.isSaving = false;
    }
  }


  uploadSign() {
    let isValid = this.validatePan();
    if (isValid) {
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.QuarterRenewalService.uploadSign(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.showId = false;
          this.showSignSc = false;
          this.showSignBtn = true;
          this.uploadImageObject.image = "";
          this.isSaving = false;
        }
      );
    } else {
      this.isSaving = false;
    }
  }


  uploadId() {
    let isValid = this.validatePan();
    if (isValid) {
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.dbId);
      formData.append("file", this.uploadImageObject.image);
      formData.append("panImg", this.uploadImageObject.panImg);
      formData.append("adharImg", this.uploadImageObject.adharImg);
      this.QuarterRenewalService.uploadIcard(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          // this.showSign = false;
          this.showIdSc = false;
          this.showIdBtn = true;
          this.isSaving = false;
          this.showLogin = false;
          this.showUpload = true;
          this.showVerify = false;
          this.regUpload = false;
          this.renewalForm = true;
          this.registrationForm = false;
          // console.log("regInput", this.regInput);

          this.resetDoc();
        }
      );
    } else {
      this.isSaving = false;
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

  checkAadhaarUnique() {
    this.aadhaarError = '';
    this.isAadhaarExist = false;
    const aadhaar = this.userCredentials.aadhaar_number ? String(this.userCredentials.aadhaar_number).trim() : '';

    if (!aadhaar) {
      this.aadhaarError = 'Aadhaar number is required.';
      return;
    }

    if (!/^\d{12}$/.test(aadhaar)) {
      this.aadhaarError = 'Aadhaar number must be exactly 12 digits.';
      this.toastr.warning('Aadhaar number must be exactly 12 digits.', 'Warning');
      return;
    }

    this.QuarterRenewalService.verifyAadhaar(aadhaar, (res: any) => {
      if (res && (res.message === 'exist' || res.status === false)) {
        this.isAadhaarExist = true;
        this.aadhaarError = 'This Aadhaar number is already registered.';
        this.toastr.error('This Aadhaar number is already registered.', 'Already Registered');
      } else {
        this.isAadhaarExist = false;
        this.aadhaarError = '';
      }
    });
  }

  onAadhaarInput(event: any) {
    const raw = event.target.value || '';
    const clean = raw.replace(/\D/g, '').slice(0, 12);
    this.userCredentials.aadhaar_number = clean;
    event.target.value = clean;
    if (clean.length === 12) {
      this.checkAadhaarUnique();
    } else if (this.isAadhaarExist) {
      this.isAadhaarExist = false;
      this.aadhaarError = '';
    }
  }

  validateInputs = () => {
    if (this.userCredentials.f_name === '' || this.userCredentials.f_name === null || this.userCredentials.f_name === undefined) {
      this.toastr.warning('Please type first name.', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.l_name === '' || this.userCredentials.l_name === null || this.userCredentials.l_name === undefined) {
      this.toastr.warning('Please type last name', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.gender === '' || this.userCredentials.gender === null || this.userCredentials.gender === undefined) {
      this.toastr.warning('Please select gender', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }

    const aadhaar = this.userCredentials.aadhaar_number ? String(this.userCredentials.aadhaar_number).trim() : '';
    if (!aadhaar) {
      this.toastr.warning('Please enter 12-digit Aadhaar number.', 'Warning');
      this.aadhaarError = 'Aadhaar number is required.';
      return false;
    }
    if (!/^\d{12}$/.test(aadhaar)) {
      this.toastr.warning('Aadhaar number must be exactly 12 digits.', 'Warning');
      this.aadhaarError = 'Aadhaar number must be exactly 12 digits.';
      return false;
    }
    if (this.isAadhaarExist) {
      this.toastr.error('This Aadhaar number is already registered.', 'Already Registered');
      return false;
    }
    if (this.userCredentials.phone_no < 1000000000 || this.userCredentials.phone_no > 9999999999) {
      this.toastr.warning('Please type phone number & must be 10 digits', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.designation === '' || this.userCredentials.designation === null || this.userCredentials.designation === undefined) {
      this.toastr.warning('Please type designation', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.civic === '' || this.userCredentials.civic === null || this.userCredentials.civic === undefined) {
      this.toastr.warning('Please select Civic Charge', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.civic == "Others") {
      if (this.userCredentials.others === '' || this.userCredentials.others === null || this.userCredentials.others === undefined) {
        this.toastr.warning('Please type others', 'Warning', {
          disableTimeOut: false
        });
        return false;
      }
    }
    if (this.userCredentials.department === '' || this.userCredentials.department === null || this.userCredentials.department === undefined) {
      this.toastr.warning('Please select department', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if(this.userCredentials.department == "Others"){
      this.userCredentials.department = null;
      if(this.userCredentials.others_dept==='' || this.userCredentials.others_dept===null || this.userCredentials.others_dept===undefined){
        this.toastr.warning('Please specify department name','Warning',{
          disableTimeOut:false
        });
        return false;
      }
    }
    if (this.userCredentials.basic_pay === '' || this.userCredentials.basic_pay === null || this.userCredentials.basic_pay === undefined) {
      this.toastr.warning('Please type basic pay', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if(this.userCredentials.pay_matrix==='' || this.userCredentials.pay_matrix===null || this.userCredentials.pay_matrix===undefined){
      this.toastr.warning('Please type Pay Level','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if (this.userCredentials.service_status === '' || this.userCredentials.service_status === null || this.userCredentials.service_status === undefined) {
      this.toastr.warning('Please select service status', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.transferable === '' || this.userCredentials.transferable === null || this.userCredentials.transferable === undefined) {
      this.toastr.warning('Please select service Transferable / Non-Transferable', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.doa === '' || this.userCredentials.doa === null || this.userCredentials.doa === undefined) {
      this.toastr.warning('Please type date of appointment', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.dor === '' || this.userCredentials.dor === null || this.userCredentials.dor === undefined) {
      this.toastr.warning('Please type date of retirement', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.userCredentials.dojs === '' || this.userCredentials.dojs === null || this.userCredentials.dojs === undefined) {
      this.toastr.warning('Please type date of joining service', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    // if (this.userCredentials.dos === '' || this.userCredentials.dos === null || this.userCredentials.dos === undefined) {
    //   this.toastr.warning('Please type Date of superannuation', 'Warning', {
    //     disableTimeOut: false
    //   });
    //   return false;
    // }
    if (this.userCredentials.resid_house === '' || this.userCredentials.resid_house === null || this.userCredentials.resid_house === undefined) {
      this.toastr.warning('Please select Do you own residential house in Capital Complex?', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }





  //for form submit temp part 2

  setRenewalLocation() {
    this.QuarterRenewalService.getSectorData(this.regInput.loc_id, (callback: any) => {
      this.sectorData = callback;
      this.regInput.sec_id = "";
      this.regInput.type = "";
    })
  }

  appliedQuarterDetails() {
    // console.log("userID", this.dbId);

    this.QuarterRenewalService.quarterApplyDetails(this.dbId, (callback: any) => {
      // console.log("aaaaaaaaaaa", callback);
      // console.log("appliedQuarterDetails", this.regInput);

      if (callback != null) {
        this.renewaFormld = callback.id;
        this.checkValue = callback;
        // this.formSubmit = false;

        this.checkUpload();
        // this.dept_name = callback.department.dept_name;
        // console.log("ooooooooooooo", this.checkValue);
      } else {
        this.inputShow = true;
        // console.log("call else");

      }

    });
  }


  checkUpload() {
    if (this.checkValue.allot_order != null) {
      this.allot_orderBtn = false
      this.allot_orderMsg = true
    } else {
      this.allot_orderBtn = true
      this.allot_orderMsg = false
    }

    if (this.checkValue.photo_1 != null) {
      this.SideOneBtn = false
      this.SideOneMsg = true
    } else {
      this.SideOneBtn = true
      this.SideOneMsg = false
    }

    if (this.checkValue.photo_2 != null) {
      this.SideTwoBtn = false
      this.SideTwoMsg = true
    } else {
      this.SideTwoBtn = true
      this.SideTwoMsg = false
    }

    if (this.checkValue.photo_3 != null) {
      this.SideThreeBtn = false
      this.SideThreeMsg = true
    } else {
      this.SideThreeBtn = true
      this.SideThreeMsg = false
    }

    if (this.checkValue.photo_4 != null) {
      this.SideFourBtn = false
      this.SideFourMsg = true
    } else {
      this.SideFourBtn = true
      this.SideFourMsg = false
    }

    if (this.checkValue.extnd_prmsn == "Yes") {
      this.qtr_extnd_doc = true;

      if (this.checkValue.extnd_doc != null) {
        this.qtr_extnd_docBtn = false
        this.qtr_extnd_docMsg = true
        this.qtr_e_pass = true;
      } else {
        this.qtr_extnd_docBtn = true
        this.qtr_extnd_docMsg = false
        this.qtr_e_pass = false;
      }
    } else {
      this.qtr_extnd_doc = false;
      this.qtr_e_pass = true;
    }

    if (this.checkValue.allot_order != null && this.checkValue.photo_1 != null && this.checkValue.photo_2 != null && this.checkValue.photo_3 != null && this.checkValue.photo_4 != null && this.qtr_e_pass == true) {
      this.declaration = true;
    } else {
      this.declaration = false;
    }


    if (this.checkValue.allot_order != null && this.checkValue.photo_1 != null && this.checkValue.photo_2 != null && this.checkValue.photo_3 != null && this.checkValue.photo_4 != null && this.qtr_e_pass == true && this.checkValue.reference_no != null) {
      this.inputFinalShow = false
      this.finalBtn = false
    } else {
      this.inputFinalShow = true
      this.finalBtn = true
    }
  }

  clearField() {
    if (this.regInput.strc_nearby == "No") {
      this.regInput.strc_by_whm = "";
      this.regInput.strc_distance = "";
      this.regInput.strc_type = "";
      this.regInput.strc_allot = "";
      this.regInput.strc_area = "";
      this.regInput.strc_storeys = "";
    }

  }


  saveForm() {
    this.regInput.userID = this.dbId;
    let isValid = this.validateRenewalInputs();
    if (isValid) {
      this.isLodaing = true;
      this.spiner();
      this.QuarterRenewalService.saveQuarterForm(this.regInput, (res: any) => {
        this.isLodaing = false;
        this.renewaFormld = res.message;
        this.rfrncNo = this.regInput.reference_no;
        this.formSubmit = false;
        this.showRenewalUpload = true;

      });
    } else {
      this.isSaving = false;
    }
  }

  finalSave() {
    this.finalInput.userID = this.dbId;
    this.finalInput.apply_date = this.myDate;
    this.finalInput.reference_no = this.convertDate();
    let isValidFinal = this.validateFinalInputs();
    if (isValidFinal) {
      this.isLodaing = true;
      this.spiner();
      this.QuarterRenewalService.saveFinalForm(this.finalInput, (res: any) => {
        this.isLodaing = false;
        this.renewaFormld = res.message;
        this.appliedQuarterDetails()
        this.rfrncNo = this.finalInput.reference_no;
        let ele: any = document.getElementById('modalClose');
        ele.click();
        this.applicationData();
        this.resetForm();
      });
    } else {
      this.isSaving = false;
    }
  }


  //for allotment order
  onFileSelectOrder(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 300000) {
      this.uploadImageObjectOrder.allot_order = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "A_ORDER" + this.convertDate() + "." + fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });

      this.uploadImageObjectOrder.image = newFile;

      this.allot_order = this.uploadImageObjectOrder.allot_order
        ? this.uploadImageObjectOrder.allot_order["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 300kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };

  uploadOrder() {
    let isValid = this.validateOrder();
    if (isValid) {
      this.isAllowedFilePdf(this.uploadImageObjectOrder.image, (res: any) => {
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          const formData = new FormData();
          formData.append("dbid", this.dbId);
          formData.append("file", this.uploadImageObjectOrder.image);
          formData.append("panImg", this.uploadImageObjectOrder.panImg);
          formData.append("adharImg", this.uploadImageObjectOrder.adharImg);
          this.QuarterRenewalService.uploadOrderFile(
            formData,
            this.renewaFormld,
            this.acceptfileType, (response: any) => {
              this.isLodaing = false;
              this.returnMsg = response.message;
              this.appliedQuarterDetails();
              this.uploadImageObjectOrder.image = "";
            }
          );

        }
      })
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  //   );

  // } else {
  //   this.isSaving = false;
  // }
  // }


  //for side 1
  onFileSideOne(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 200000) {
      this.uploadImageObjectSide1.SideOne = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "SIDE_1_" + this.convertDate() + "." + fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });

      this.uploadImageObjectSide1.image = newFile;

      this.SideOne = this.uploadImageObjectSide1.SideOne
        ? this.uploadImageObjectSide1.SideOne["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadSideOne() {
    let isValid = this.validateSide1();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObjectSide1.image, (res: any) => {
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          const formData = new FormData();
          formData.append("dbid", this.dbId);
          formData.append("file", this.uploadImageObjectSide1.image);
          formData.append("panImg", this.uploadImageObjectSide1.panImg);
          formData.append("adharImg", this.uploadImageObjectSide1.adharImg);
          this.QuarterRenewalService.uploadSideOneImage(
            formData,
            this.renewaFormld,
            this.acceptfileType, (response: any) => {
              this.isLodaing = false;
              this.returnMsg = response.message;
              this.appliedQuarterDetails();
              this.uploadImageObjectSide1.image = "";
            }
          );

        }
      })
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  //   );

  // } else {
  //   this.isSaving = false;
  // }
  // }


  //for side 2
  onFileSideTwo(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 200000) {
      this.uploadImageObjectSide2.SideTwo = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "SIDE_2_" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });

      this.uploadImageObjectSide2.image = newFile;

      this.SideTwo = this.uploadImageObjectSide2.SideTwo
        ? this.uploadImageObjectSide2.SideTwo["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadSideTwo() {
    let isValid = this.validateSide2();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObjectSide2.image, (res: any) => {
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          const formData = new FormData();

          formData.append("dbid", this.dbId);
          formData.append("file", this.uploadImageObjectSide2.image);
          formData.append("panImg", this.uploadImageObjectSide2.panImg);
          formData.append("adharImg", this.uploadImageObjectSide2.adharImg);
          this.QuarterRenewalService.uploadSideTwoImage(
            formData,
            this.renewaFormld,
            this.acceptfileType, (response: any) => {
              this.isLodaing = false;
              this.returnMsg = response.message;
              this.appliedQuarterDetails();
              this.uploadImageObjectSide2.image = "";
            }
          );

        }
      })
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  //   );

  // } else {
  //   this.isSaving = false;
  // }
  // }


  //for side 3
  onFileSideThree(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 200000) {
      this.uploadImageObjectSide3.SideThree = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "SIDE_3_" + this.convertDate() + "." + fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });

      this.uploadImageObjectSide3.image = newFile;

      this.SideThree = this.uploadImageObjectSide3.SideThree
        ? this.uploadImageObjectSide3.SideThree["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadSideThree() {
    let isValid = this.validateSide3();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObjectSide3.image, (res: any) => {
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          const formData = new FormData();
          formData.append("dbid", this.dbId);
          formData.append("file", this.uploadImageObjectSide3.image);
          formData.append("panImg", this.uploadImageObjectSide3.panImg);
          formData.append("adharImg", this.uploadImageObjectSide3.adharImg);
          this.QuarterRenewalService.uploadSideThreeImage(
            formData,
            this.renewaFormld,
            this.acceptfileType, (response: any) => {
              this.isLodaing = false;
              this.returnMsg = response.message;
              this.appliedQuarterDetails();
              this.uploadImageObjectSide3.image = "";
            }
          );

        }
      })
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  //   );

  // } else {
  //   this.isSaving = false;
  // }
  // }


  //for side 4
  onFileSideFour(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 300000) {
      this.uploadImageObjectSide4.SideFour = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "SIDE_4_" + this.convertDate() + "." + fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });

      this.uploadImageObjectSide4.image = newFile;

      this.SideFour = this.uploadImageObjectSide4.SideFour
        ? this.uploadImageObjectSide4.SideFour["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 300kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadSideFour() {
    let isValid = this.validateSide4();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObjectSide4.image, (res: any) => {
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          const formData = new FormData();

          formData.append("dbid", this.dbId);
          formData.append("file", this.uploadImageObjectSide4.image);
          formData.append("panImg", this.uploadImageObjectSide4.panImg);
          formData.append("adharImg", this.uploadImageObjectSide4.adharImg);
          this.QuarterRenewalService.uploadSideFourImage(
            formData,
            this.renewaFormld,
            this.acceptfileType, (response: any) => {
              this.isLodaing = false;
              this.returnMsg = response.message;
              this.appliedQuarterDetails();
              this.uploadImageObjectSide4.image = "";
            }
          );
        }
      })
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  //   );

  // } else {
  //   this.isSaving = false;
  // }
  // }



  //for side 4
  onFileSelectQtrExtnd(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 300000) {
      this.uploadImageObjectExtnd.qtr_extnd_doc_label = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "QTR_EXTND_" + this.convertDate() + "." + fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });

      this.uploadImageObjectExtnd.image = newFile;

      this.qtr_extnd_doc_label = this.uploadImageObjectExtnd.qtr_extnd_doc_label
        ? this.uploadImageObjectExtnd.qtr_extnd_doc_label["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 300kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadQtrExtnd() {
    let isValid = this.validateExtnd();
    if (isValid) {
      this.isAllowedFilePdf(this.uploadImageObjectExtnd.image, (res: any) => {
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          const formData = new FormData();
          formData.append("dbid", this.dbId);
          formData.append("file", this.uploadImageObjectExtnd.image);
          formData.append("panImg", this.uploadImageObjectExtnd.panImg);
          formData.append("adharImg", this.uploadImageObjectExtnd.adharImg);
          this.QuarterRenewalService.uploadQtrExtndImage(
            formData,
            this.renewaFormld,
            this.acceptfileType, (response: any) => {
              this.isLodaing = false;
              this.returnMsg = response.message;
              this.appliedQuarterDetails();
              this.uploadImageObjectExtnd.image = "";
            }
          );

        }
      })
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  //   );

  // } else {
  //   this.isSaving = false;
  // }
  // }



  validateRenewalInputs = () => {
    if (this.regInput.loc_id === '' || this.regInput.loc_id === null || this.regInput.loc_id === undefined) {
      this.toastr.warning('Please select Location', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.sec_id === '' || this.regInput.sec_id === null || this.regInput.sec_id === undefined) {
      this.toastr.warning('Please select Sector', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.type === '' || this.regInput.type === null || this.regInput.type === undefined) {
      this.toastr.warning('Please select quarter type', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.qrtr_no === '' || this.regInput.qrtr_no === null || this.regInput.qrtr_no === undefined) {
      this.toastr.warning('Please type quarter number', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.qrtr_letitude === '' || this.regInput.qrtr_letitude === null || this.regInput.qrtr_letitude === undefined) {
      this.toastr.warning('Please type quarter latitude', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.qrtr_longitude === '' || this.regInput.qrtr_longitude === null || this.regInput.qrtr_longitude === undefined) {
      this.toastr.warning('Please type quarter longitude', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.d_w === '' || this.regInput.d_w === null || this.regInput.d_w === undefined) {
      this.toastr.warning('Please select Door & Window condition', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.e_w === '' || this.regInput.e_w === null || this.regInput.e_w === undefined) {
      this.toastr.warning('Please sselect Electrical Wiring condition', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.r_c === '' || this.regInput.r_c === null || this.regInput.r_c === undefined) {
      this.toastr.warning('Please select Roof & Ceiling condition', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.s_q === '' || this.regInput.s_q === null || this.regInput.s_q === undefined) {
      this.toastr.warning('Please select structure of quarter condition', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.s_t === '' || this.regInput.s_t === null || this.regInput.s_t === undefined) {
      this.toastr.warning('Please select Septic tank functioning condition', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.qtr_extnd === '' || this.regInput.qtr_extnd === null || this.regInput.qtr_extnd === undefined) {
      this.toastr.warning('Please select have you extended the quarter', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.type_of_strc === '' || this.regInput.type_of_strc === null || this.regInput.type_of_strc === undefined) {
      this.toastr.warning('Please select Type of structure', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.area_extnd_strc === '' || this.regInput.area_extnd_strc === null || this.regInput.area_extnd_strc === undefined) {
      this.toastr.warning('Please type area of extended structure', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.extnd_prmsn === '' || this.regInput.extnd_prmsn === null || this.regInput.extnd_prmsn === undefined) {
      this.toastr.warning('Please select extension permission', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.strc_nearby === '' || this.regInput.strc_nearby === null || this.regInput.strc_nearby === undefined) {
      this.toastr.warning('Please select constructed nearby the quarter', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.regInput.strc_nearby == "Yes") {
      if (this.regInput.strc_by_whm === '' || this.regInput.strc_by_whm === null || this.regInput.strc_by_whm === undefined) {
        this.toastr.warning('Please select by whom', 'Warning', {
          disableTimeOut: false
        });
        return false;
      }
      if (this.regInput.strc_distance === '' || this.regInput.strc_distance === null || this.regInput.strc_distance === undefined) {
        this.toastr.warning('Please type distance of structure from Govt. quarter', 'Warning', {
          disableTimeOut: false
        });
        return false;
      }
      if (this.regInput.strc_type === '' || this.regInput.strc_type === null || this.regInput.strc_type === undefined) {
        this.toastr.warning('Please select type of structure', 'Warning', {
          disableTimeOut: false
        });
        return false;
      }
      if (this.regInput.strc_allot === '' || this.regInput.strc_allot === null || this.regInput.strc_allot === undefined) {
        this.toastr.warning('Please select land allotment obtained for the structure constructed', 'Warning', {
          disableTimeOut: false
        });
        return false;
      }
      if (this.regInput.strc_storeys === '' || this.regInput.strc_storeys === null || this.regInput.strc_storeys === undefined) {
        this.toastr.warning('Please type number of storeys of structure', 'Warning', {
          disableTimeOut: false
        });
        return false;
      }
    }
    return true;
  }

  validateFinalInputs = () => {
    if (this.check === false) {
      this.toastr.warning('Please check the checkbox', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }




  validateOrder = () => {
    if (this.uploadImageObjectOrder.image === '' || this.uploadImageObjectOrder.image === null || this.uploadImageObjectOrder.image === undefined) {
      this.toastr.warning('Please select PDF file', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateSide1 = () => {
    if (this.uploadImageObjectSide1.image === '' || this.uploadImageObjectSide1.image === null || this.uploadImageObjectSide1.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateSide2 = () => {
    if (this.uploadImageObjectSide2.image === '' || this.uploadImageObjectSide2.image === null || this.uploadImageObjectSide2.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateSide3 = () => {
    if (this.uploadImageObjectSide3.image === '' || this.uploadImageObjectSide3.image === null || this.uploadImageObjectSide3.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateSide4 = () => {
    if (this.uploadImageObjectSide4.image === '' || this.uploadImageObjectSide4.image === null || this.uploadImageObjectSide4.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateExtnd = () => {
    if (this.uploadImageObjectExtnd.image === '' || this.uploadImageObjectExtnd.image === null || this.uploadImageObjectExtnd.image === undefined) {
      this.toastr.warning('Please select PDF file', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  isAllowedFile = (file: any, callback: any) => {
    switch (file.type) {
      case "image/jpg":
      case "image/png":
      case "image/jpeg":
        return callback(true);
      default:
        return callback(false);
    }
  };

  isAllowedFilePdf = (file: any, callback: any) => {
    switch (file.type) {
      case "application/pdf":
        return callback(true);
      default:
        return callback(false);
    }
  };




  resetForm() {
    // console.log("allot_orderMsg", this.allot_orderMsg);

    this.OTP.otp1 = '';
    this.userCredentials.f_name = '';
    this.userCredentials.m_name = '';
    this.userCredentials.l_name = '';
    this.userCredentials.email = '';
    this.userCredentials.phone_no = '';
    this.userCredentials.designation = '';
    this.userCredentials.department = '';
    this.userCredentials.basic_pay = '';
    this.userCredentials.pay_matrix = '';
    this.userCredentials.service_status = '';
    this.userCredentials.transferable = '';
    this.userCredentials.doa = '';
    this.userCredentials.dor = '';
    this.userCredentials.dojs = '';
    this.userCredentials.dos = '';
    this.userCredentials.spouse_f_name = '';
    this.userCredentials.spouse_l_name = '';
    this.userCredentials.spouse_occ = '';
    this.userCredentials.spouse_acco = '';
    this.userCredentials.resid_house = '';
    this.userCredentials.annexure_a_place = '';
    this.userCredentials.annexure_a_date = '';
    this.userCredentials.aadhaar_number = '';
    this.userCredentials.otp = '';
    this.aadhaarError = '';
    this.isAadhaarExist = false;

    this.regInput.sctr_name = '';
    this.regInput.loc_name = '';
    this.regInput.qrtr_type = '';
    this.regInput.qrtr_no = '';
    this.regInput.type = '';
    this.regInput.loc_id = '';
    this.regInput.sec_id = '';
    this.regInput.qrtr_longitude = '';
    this.regInput.qrtr_letitude = '';
    this.regInput.d_w = '';
    this.regInput.e_w = '';
    this.regInput.r_c = '';
    this.regInput.s_q = '';
    this.regInput.s_t = '';
    this.regInput.qtr_extnd = '';
    this.regInput.type_of_strc = '';
    this.regInput.area_extnd_strc = '';
    this.regInput.extnd_prmsn = '';
    this.regInput.strc_nearby = '';
    this.regInput.strc_by_whm = '';
    this.regInput.strc_distance = '';
    this.regInput.strc_type = '';
    this.regInput.strc_allot = '';
    this.regInput.strc_area = '';
    this.regInput.strc_storeys = '';
    this.regInput.startDate = '';
    this.regInput.renewalDate = '';
    this.regInput.status = '';
    this.regInput.remark = '';

    this.dbId = '';

    this.showVerify = false;
    this.showUpload = true;
    this.showLogin = true;
    this.showRenewalUpload = false;
    this.declaration = false;
    this.finalBtn = true;
    this.showOTPInput = false;


    this.pan = "Choose File";
    this.adhar = "Choose File";
    this.photo = "Choose File";
    this.sign = "Choose File";
    this.idCard = "Choose File";

    this.allot_order = "Allotment Order";
    this.SideOne = "Side 1";
    this.SideTwo = "Side 2";
    this.SideThree = "Side 3";
    this.SideFour = "Side 4";
    this.qtr_extnd_doc_label = "Upload extension document ";

    this.showAnx = true;
    this.showAnxBtn = false;
    this.showAnxSc = true;

    this.showPan = true;
    this.showPanBtn = false;
    this.showPanSc = true;

    this.showAdhar = true;
    this.showAdharBtn = false;
    this.showAdharSc = true;

    this.showPhoto = true;
    this.showPhotoBtn = false;
    this.showPhotoSc = true;

    this.showSign = true;
    this.showSignBtn = false;
    this.showSignSc = true;

    this.showId = true;
    this.showIdBtn = false;
    this.showIdSc = true;






    this.firstRegForm = true;
    this.registrationForm = false;
    this.regUpload = false;
    this.renewalForm = false;

    this.formSubmit = true;
  }

  resetDoc() {
    this.allot_order = "Allotment Order";
    this.allot_orderBtn = true;
    this.allot_orderMsg = false;

    this.SideOne = "Side 1";
    this.SideOneBtn = true;
    this.SideOneMsg = false;

    this.SideTwo = "Side 2";
    this.SideTwoBtn = true;
    this.SideTwoMsg = false;

    this.SideThree = "Side 3";
    this.SideThreeBtn = true;
    this.SideThreeMsg = false;

    this.SideFour = "Side 4";
    this.SideFourBtn = true;
    this.SideFourMsg = false;

    this.qtr_extnd_doc = true;
    this.qtr_extnd_doc_label = "Upload extension document ";
    this.qtr_extnd_docBtn = true;
    this.qtr_extnd_docMsg = false;
    this.qtr_e_pass = false;
    this.check = false;
  }




  showLocUpdateModal(row: any) {
    // console.log("Selected Project=", row);
    this.selectedQuarter = row;
    // // console.log("hhhhhhhhhhhh",this.selectedLocation.loc_name);

    let deleteModal: any = document.getElementById("LocUpdate");
    // deleteModal.classList.remove("hidden");
    // deleteModal.classList.add("show");
  };



  civic() {
    if (this.userCredentials.civic == "Others") {
      this.userCredentials.civic_charge = this.userCredentials.others;
    } else {
      this.userCredentials.civic_charge = this.userCredentials.civic;
    }
  }






  //

  //for upload_signed_copy
  onFileSelectSignedCopy(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 204800) {
      this.uploadImageObject.upload_signed_copy = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "SIGNED_COPY_" + this.convertDate() + "." + fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;

      this.upload_signed_copy = this.uploadImageObject.upload_signed_copy
        ? this.uploadImageObject.upload_signed_copy["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadSignedCopy() {
    let isValid = this.validatePan();
    if (isValid) {
      this.isLodaing = true;
      this.spiner();
      const formData = new FormData();
      formData.append("dbid", this.selectedQuarter.userId);
      formData.append("allotmentId", this.selectedQuarter.id);
      formData.append("file", this.uploadImageObject.image);
      this.QuarterRenewalService.uploadSignedCopy(
        formData,
        this.dbId,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          this.applicationData();
          let ele: any = document.getElementById('printModalclose');
          ele.click();
        }
      );
    } else {
      this.isSaving = false;
    }
  }



}

