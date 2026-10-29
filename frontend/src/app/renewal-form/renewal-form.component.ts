import { Component, OnInit } from '@angular/core';
import { RenewalFormService } from './renewal-form.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-renewal-form',
  templateUrl: './renewal-form.component.html',
  styleUrls: ['./renewal-form.component.css'],
  standalone: true,
  imports: [NgxSpinnerModule, RouterModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatInputModule, FormsModule, MatFormFieldModule, CommonModule],
})
export class RenewalFormComponent implements OnInit{

  public endpoint: any;
  public userID:any;
  public myDate:any = new Date();
  public userDetails:any; 
  public departmentId:any;
  public data: any;
  public isLodaing = true;


  public locationData:any = {
    id: "",
    lcn_name: "",
  };

  public selectedQuarter = {
    id: "",
    location_name: "",
    sctor_name: "",
    qrtr_no: '',
    qrtr_type: '',
  }

  public regInput: any = {
    sctr_name: '',
    loc_name: '',
    qrtr_type: '',
    qrtr_no: '',
    type: '',
    loc_id: '',
    sec_id: '',
    qrtr_longitude: '',
    qrtr_letitude: '',
    map_loc: '',
    d_w: '',
    e_w: '',
    r_c: '',
    s_q: '',
    s_t: '',
    qtr_extnd: '',
    type_of_strc: '',
    area_extnd_strc: '',
    extnd_prmsn: '',
    strc_nearby: '',
    strc_by_whm: '',
    strc_distance: '',
    strc_type: '',
    strc_allot: '',
    strc_area: '',
    strc_storeys: '',

    startDate: '',
    renewalDate: '',
    status: '',
    remark: '',
  }

  public finalInput: any = {
    test: '',
  }

  public dbid: any;

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

  public acceptfileType: string = "image";
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

  public sectorData: any;
  public quarterData: any;
  
  public returnMsg: any;
  public rfrncNo: any;

  public day: any;
  public month: any;

  public compondShow: boolean = true;
  public inputShow: boolean = false;
  public formSubmit: boolean = true;
  public showUpload: boolean = false;
  public inputFinalShow: boolean = true;

  public check:boolean = false;
  public finalBtn: boolean= true;

  public isSaving: boolean = false;

  public apply_date: any;

  constructor(
    private RenewalFormService: RenewalFormService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
  ){
    this.endpoint = environment.BASE_URL;
    this.init();
    this.myDate = this.datePipe.transform(this.myDate, "YYYY-MM-dd");
    console.log("myDate",this.myDate);
    
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
    this.location();
    this.appliedQuarterDetails()
  }

  convertDate() {
    var date = new Date();
    // this.day = date.getDate();
    // this.month = date.getFullYear() + "" + date.getMonth()+1 + "" + this.datePipe.transform(date,'dd') + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds()+1;
    // console.log("time",this.month);


    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1); // Month starts from 0
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
    
    // return this.month;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 9000);
  }

  appliedQuarterDetails=()=>{
    console.log("userID",this.userID);
    
    this.RenewalFormService.quarterApplyDetails(this.userID, (callback:any)=>{
      console.log("aaaaaaaaaaa",callback);
      if(callback != null){
      this.dbid = callback.id;
      this.regInput = callback
      this.formSubmit = false;
      this.showUpload = true;

      this.checkUpload();
      // this.dept_name = callback.department.dept_name;
      console.log("ooooooooooooo",this.regInput);
      }else {
        this.inputShow = true;
        console.log("call else");
        
      }
      
    });  
  }

  
  checkUpload(){
    if (this.regInput.allot_order != null) {
      this.allot_orderBtn = false
      this.allot_orderMsg = true
    }else{
      this.allot_orderBtn = true
      this.allot_orderMsg = false
    }

    if (this.regInput.photo_1 != null) {
      this.SideOneBtn = false
      this.SideOneMsg = true
    }else{
      this.SideOneBtn = true
      this.SideOneMsg = false
    }

    if (this.regInput.photo_2 != null) {
      this.SideTwoBtn = false
      this.SideTwoMsg = true
    }else{
      this.SideTwoBtn = true
      this.SideTwoMsg = false
    }

    if (this.regInput.photo_3 != null) {
      this.SideThreeBtn = false
      this.SideThreeMsg = true
    }else{
      this.SideThreeBtn = true
      this.SideThreeMsg = false
    }

    if (this.regInput.photo_4 != null) {
      this.SideFourBtn = false
      this.SideFourMsg = true
      console.log("call 1",this.regInput.photo_4);
    }else{
      this.SideFourBtn = true
      this.SideFourMsg = false
      console.log("call 2",this.regInput.photo_4);
    }

    if (this.regInput.extnd_prmsn == "Yes") {
      this.qtr_extnd_doc = true;
      console.log("calllllllllllllllllllllllllllllllllll");
      
        if (this.regInput.extnd_doc != null) {
          this.qtr_extnd_docBtn = false
          this.qtr_extnd_docMsg = true
          this.qtr_e_pass = true;
        }else{
          this.qtr_extnd_docBtn = true
          this.qtr_extnd_docMsg = false
          this.qtr_e_pass = false;
        }
    }else{
      this.qtr_extnd_doc = false;
      this.qtr_e_pass = true;
    }

    if (this.regInput.allot_order != null && this.regInput.photo_1 != null && this.regInput.photo_2 != null && this.regInput.photo_3 != null && this.regInput.photo_4 != null && this.qtr_e_pass == true) {
      this.declaration = true;
    }else{
      this.declaration = false;
    }


    if (this.regInput.allot_order != null && this.regInput.photo_1 != null && this.regInput.photo_2 != null && this.regInput.photo_3 != null && this.regInput.photo_4 != null && this.qtr_e_pass == true && this.regInput.reference_no != null) {
      this.inputFinalShow = false
      this.finalBtn = false
    }else{
      this.inputFinalShow = true
      this.finalBtn = true
    }
  }


  clearField(){
    console.log("checkkkkkkkkkkkk",this.regInput.strc_nearby);
    if (this.regInput.strc_nearby == "No") {
      this.regInput.strc_by_whm= "";
      this.regInput.strc_distance= "";
      this.regInput.strc_type= "";
      this.regInput.strc_allot= "";
      this.regInput.strc_area= "";
      this.regInput.strc_storeys= "";
    }
    
  }


  clearFieldExtnd(){
    console.log("checkkkkkkkkkkkk",this.regInput.qtr_extnd);
    if (this.regInput.qtr_extnd == "No") {
      this.regInput.type_of_strc= "";
      this.regInput.area_extnd_strc= "";
      this.regInput.extnd_prmsn= "";
    }
  }

  userData=()=>{
    console.log("userID",this.userID);
    
    this.RenewalFormService.getUserDetails(this.userID, (callback:any)=>{
      console.log(callback);
      this.data = callback.department_name
      // this.dept_name = callback.department.dept_name;
      console.log("fffffffffff",this.userDetails);
      
    });  
  }


  location=()=>{
    let requestObject = {};
    this.RenewalFormService.getLocation(requestObject, (callback:any)=>{
      console.log("bbbbbbbbbb",callback);
      this.locationData = callback;
      console.log("location details",this.locationData);
      
    });  
  }
  
  setLocation(){
    this.RenewalFormService.getSectorData(this.regInput.loc_id, (callback:any)=>{
      console.log("set location",callback);
      this.sectorData = callback;
    })
  }

  saveForm(){
    this.regInput.userID = this.userID;
    console.log("input data",this.regInput);
    let isValid = this.validateInputs();
    if(isValid){
      this.isLodaing = true;
      this.spiner(); 
    this.RenewalFormService.saveQuarterForm(this.regInput, (res:any)=>{
      this.isLodaing = false;
      this.dbid = res.message;
      console.log("msg", res.message);
      
      this.rfrncNo = this.regInput.reference_no;
      console.log("lllllllllll", this.dbid);
      this.formSubmit = false;
      this.showUpload = true;
    });
  }else{
    this.isSaving = false;
  }
  }

  finalSave(){
    this.finalInput.userID = this.userID;
    this.finalInput.apply_date = this.myDate;
    this.finalInput.reference_no = this.convertDate();
    console.log("input data",this.finalInput);
    let isValidFinal = this.validateFinalInputs();
    if(isValidFinal){
      this.isLodaing = true;
      this.spiner();
    this.RenewalFormService.saveFinalForm(this.finalInput, (res:any)=>{
      this.isLodaing = false;
      this.dbid = res.message;
      console.log("msg", res.message);
      this.appliedQuarterDetails()
      this.rfrncNo = this.finalInput.reference_no;
      console.log("lllllllllll", this.dbid);
      
    });
  }else{
    this.isSaving = false;
  }
  }


  //for allotment order
  onFileSelectOrder(event: any) {
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 300000) {
      this.uploadImageObjectOrder.allot_order = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      var name = "A_ORDER" + this.convertDate()+ "."+fileExtension;

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
    console.log("Uploading allotment order", this.uploadImageObjectOrder);
    let isValid = this.validateOrder();
    if (isValid) {
      this.isAllowedFilePdf(this.uploadImageObjectOrder.image, (res: any) => {
        console.log("res", res);
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          console.log("input data", this.uploadImageObjectOrder);
          // if (this.selectedMember.id != '') {
            // console.log("update", this.selectedMember.id);

            const formData = new FormData();



            formData.append("dbid", this.userID);
            formData.append("file", this.uploadImageObjectOrder.image);
            formData.append("panImg", this.uploadImageObjectOrder.panImg);
            formData.append("adharImg", this.uploadImageObjectOrder.adharImg);
            console.log("FORMDATA===", formData);
            console.log("dbid===", this.userID);
            this.RenewalFormService.uploadOrderFile(
              formData,
              this.dbid,
              this.acceptfileType, (response: any) => {
                this.isLodaing = false;
                this.returnMsg = response.message;
                console.log("lllllllllll", this.returnMsg);
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
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 200000) {
      this.uploadImageObjectSide1.SideOne = event.target.files[0];

      var fff = this.convertDate();
      console.log("convert date",fff);
      
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      var name = "SIDE_1_" + this.convertDate()+ "."+fileExtension;
      console.log("name",name);

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      console.log("blob",blob);

      var newFile = new File([blob], name, { type: event.target.files[0].type });
      console.log("newfile",newFile);

      this.uploadImageObjectSide1.image = newFile;

      this.SideOne = this.uploadImageObjectSide1.SideOne
        ? this.uploadImageObjectSide1.SideOne["name"]
        : "Choose File";
        console.log("Choose", this.SideOne);
      console.log("imgObject===", this.uploadImageObjectSide1);
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadSideOne() {
    console.log("Uploading allotment order", this.uploadImageObjectSide1);
    let isValid = this.validateSide1();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObjectSide1.image, (res: any) => {
        console.log("res", res);
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          console.log("input data", this.uploadImageObjectSide1);
          // if (this.selectedMember.id != '') {
            // console.log("update", this.selectedMember.id);

            const formData = new FormData();



            formData.append("dbid", this.userID);
            formData.append("file", this.uploadImageObjectSide1.image);
            formData.append("panImg", this.uploadImageObjectSide1.panImg);
            formData.append("adharImg", this.uploadImageObjectSide1.adharImg);
            console.log("FORMDATA===", formData);
            console.log("dbid===", this.userID);
            this.RenewalFormService.uploadSideOneImage(
              formData,
              this.dbid,
              this.acceptfileType, (response: any) => {
                this.isLodaing = false;
                this.returnMsg = response.message;
                console.log("lllllllllll", this.returnMsg);
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
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 200000) {
      this.uploadImageObjectSide2.SideTwo = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      var name = "SIDE_2_" + this.convertDate()+ "."+fileExtension;

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
    console.log("Uploading allotment order", this.uploadImageObjectSide2);
    let isValid = this.validateSide2();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObjectSide2.image, (res: any) => {
        console.log("res", res);
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          console.log("input data", this.uploadImageObjectSide2);
          // if (this.selectedMember.id != '') {
            // console.log("update", this.selectedMember.id);

            const formData = new FormData();



            formData.append("dbid", this.userID);
            formData.append("file", this.uploadImageObjectSide2.image);
            formData.append("panImg", this.uploadImageObjectSide2.panImg);
            formData.append("adharImg", this.uploadImageObjectSide2.adharImg);
            console.log("FORMDATA===", formData);
            console.log("dbid===", this.userID);
            this.RenewalFormService.uploadSideTwoImage(
              formData,
              this.dbid,
              this.acceptfileType, (response: any) => {
                this.isLodaing = false;
                this.returnMsg = response.message;
                console.log("lllllllllll", this.returnMsg);
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
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 200000) {
      this.  uploadImageObjectSide3.SideThree = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      var name = "SIDE_3_" + this.convertDate()+ "."+fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);

      var newFile = new File([blob], name, { type: event.target.files[0].type });

      this.  uploadImageObjectSide3.image = newFile;

      this.SideThree = this.  uploadImageObjectSide3.SideThree
        ? this.  uploadImageObjectSide3.SideThree["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 200kb', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadSideThree() {
    console.log("Uploading allotment order", this.  uploadImageObjectSide3);
    let isValid = this.validateSide3();
    if (isValid) {
      this.isAllowedFile(this.  uploadImageObjectSide3.image, (res: any) => {
        console.log("res", res);
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          console.log("input data", this.  uploadImageObjectSide3);
          // if (this.selectedMember.id != '') {
            // console.log("update", this.selectedMember.id);

            const formData = new FormData();



            formData.append("dbid", this.userID);
            formData.append("file", this.  uploadImageObjectSide3.image);
            formData.append("panImg", this.  uploadImageObjectSide3.panImg);
            formData.append("adharImg", this.  uploadImageObjectSide3.adharImg);
            console.log("FORMDATA===", formData);
            console.log("dbid===", this.userID);
            this.RenewalFormService.uploadSideThreeImage(
              formData,
              this.dbid,
              this.acceptfileType, (response: any) => {
                this.isLodaing = false;
                this.returnMsg = response.message;
                console.log("lllllllllll", this.returnMsg);
                this.appliedQuarterDetails();
                this.  uploadImageObjectSide3.image = "";
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
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 300000) {
      this.uploadImageObjectSide4.SideFour = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      var name = "SIDE_4_" + this.convertDate()+ "."+fileExtension;

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
    console.log("Uploading allotment order", this.uploadImageObjectSide4);
    let isValid = this.validateSide4();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObjectSide4.image, (res: any) => {
        console.log("res", res);
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          console.log("input data", this.uploadImageObjectSide4);
          // if (this.selectedMember.id != '') {
            // console.log("update", this.selectedMember.id);

            const formData = new FormData();



            formData.append("dbid", this.userID);
            formData.append("file", this.uploadImageObjectSide4.image);
            formData.append("panImg", this.uploadImageObjectSide4.panImg);
            formData.append("adharImg", this.uploadImageObjectSide4.adharImg);
            console.log("FORMDATA===", formData);
            console.log("dbid===", this.userID);
            this.RenewalFormService.uploadSideFourImage(
              formData,
              this.dbid,
              this.acceptfileType, (response: any) => {
                this.isLodaing = false;
                this.returnMsg = response.message;
                console.log("lllllllllll", this.returnMsg);
                this.appliedQuarterDetails();
                this.uploadImageObjectSide4.image = "";
              }
            );
        }
          } )
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
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 300000) {
      this.uploadImageObjectExtnd.qtr_extnd_doc_label = event.target.files[0];

      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      var name = "QTR_EXTND_" + this.convertDate()+ "."+fileExtension;

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
    console.log("Uploading allotment order", this.uploadImageObjectExtnd);
    let isValid = this.validateExtnd();
    if (isValid) {
      this.isAllowedFilePdf(this.uploadImageObjectExtnd.image, (res: any) => {
        console.log("res", res);
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
          console.log("input data", this.uploadImageObjectExtnd);
          // if (this.selectedMember.id != '') {
            // console.log("update", this.selectedMember.id);

            const formData = new FormData();



            formData.append("dbid", this.userID);
            formData.append("file", this.uploadImageObjectExtnd.image);
            formData.append("panImg", this.uploadImageObjectExtnd.panImg);
            formData.append("adharImg", this.uploadImageObjectExtnd.adharImg);
            console.log("FORMDATA===", formData);
            console.log("dbid===", this.userID);
            this.RenewalFormService.uploadQtrExtndImage(
              formData,
              this.dbid,
              this.acceptfileType, (response: any) => {
                this.isLodaing = false;
                this.returnMsg = response.message;
                console.log("lllllllllll", this.returnMsg);
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



  validateInputs = () =>{
    console.log("Saving project before validate",this.regInput);
    if(this.regInput.loc_id==='' || this.regInput.loc_id===null || this.regInput.loc_id===undefined){
      this.toastr.warning('Please select Location','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.sec_id==='' || this.regInput.sec_id===null || this.regInput.sec_id===undefined){
      this.toastr.warning('Please select Sector','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.type==='' || this.regInput.type===null || this.regInput.type===undefined){
      this.toastr.warning('Please select quarter type','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.qrtr_no==='' || this.regInput.qrtr_no===null || this.regInput.qrtr_no===undefined){
      this.toastr.warning('Please type quarter number','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.qrtr_letitude==='' || this.regInput.qrtr_letitude===null || this.regInput.qrtr_letitude===undefined){
      this.toastr.warning('Please type quarter latitude','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.qrtr_longitude==='' || this.regInput.qrtr_longitude===null || this.regInput.qrtr_longitude===undefined){
      this.toastr.warning('Please type quarter longitude','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.d_w==='' || this.regInput.d_w===null || this.regInput.d_w===undefined){
      this.toastr.warning('Please select Door & Window condition','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.e_w==='' || this.regInput.e_w===null || this.regInput.e_w===undefined){
      this.toastr.warning('Please sselect Electrical Wiring condition','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.r_c==='' || this.regInput.r_c===null || this.regInput.r_c===undefined){
      this.toastr.warning('Please select Roof & Ceiling condition','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.s_q==='' || this.regInput.s_q===null || this.regInput.s_q===undefined){
      this.toastr.warning('Please select structure of quarter condition','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.s_t==='' || this.regInput.s_t===null || this.regInput.s_t===undefined){
      this.toastr.warning('Please select Septic tank functioning condition','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.qtr_extnd==='' || this.regInput.qtr_extnd===null || this.regInput.qtr_extnd===undefined){
      this.toastr.warning('Please select have you extended the quarter','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if (this.regInput.qtr_extnd == "Yes") {
    if(this.regInput.type_of_strc==='' || this.regInput.type_of_strc===null || this.regInput.type_of_strc===undefined){
      this.toastr.warning('Please select Type of structure','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.area_extnd_strc==='' || this.regInput.area_extnd_strc===null || this.regInput.area_extnd_strc===undefined){
      this.toastr.warning('Please type area of extended structure','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.extnd_prmsn==='' || this.regInput.extnd_prmsn===null || this.regInput.extnd_prmsn===undefined){
      this.toastr.warning('Please select extension permission','Warning',{
        disableTimeOut:false
      });
      return false;
    }
  }
    if(this.regInput.strc_nearby==='' || this.regInput.strc_nearby===null || this.regInput.strc_nearby===undefined){
      this.toastr.warning('Please select constructed nearby the quarter','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if (this.regInput.strc_nearby == "Yes") {
    if(this.regInput.strc_by_whm==='' || this.regInput.strc_by_whm===null || this.regInput.strc_by_whm===undefined){
      this.toastr.warning('Please select by whom','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.strc_distance==='' || this.regInput.strc_distance===null || this.regInput.strc_distance===undefined){
      this.toastr.warning('Please type distance of structure from Govt. quarter','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.strc_type==='' || this.regInput.strc_type===null || this.regInput.strc_type===undefined){
      this.toastr.warning('Please select type of structure','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.strc_allot==='' || this.regInput.strc_allot===null || this.regInput.strc_allot===undefined){
      this.toastr.warning('Please select land allotment obtained for the structure constructed','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.regInput.strc_storeys==='' || this.regInput.strc_storeys===null || this.regInput.strc_storeys===undefined){
      this.toastr.warning('Please type number of storeys of structure','Warning',{
        disableTimeOut:false
      });
      return false;
    }
  }
    return true;
  }

  validateFinalInputs= () =>{
    console.log("Saving project before validate",this.finalInput);
    if (this.check === false) {
      this.toastr.warning('Please check the checkbox','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }




  validateOrder = () => {
    console.log("vvvvvvvv",this.uploadImageObjectOrder.image);
    
    if (this.uploadImageObjectOrder.image === '' || this.uploadImageObjectOrder.image === null || this.uploadImageObjectOrder.image === undefined) {
      this.toastr.warning('Please select PDF file', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateSide1 = () => {
    console.log("vvvvvvvv",this.uploadImageObjectSide1.image);
    
    if (this.uploadImageObjectSide1.image === '' || this.uploadImageObjectSide1.image === null || this.uploadImageObjectSide1.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateSide2 = () => {
    console.log("vvvvvvvv",this.uploadImageObjectSide2.image);
    
    if (this.uploadImageObjectSide2.image === '' || this.uploadImageObjectSide2.image === null || this.uploadImageObjectSide2.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateSide3 = () => {
    console.log("vvvvvvvv",this.uploadImageObjectSide3.image);
    
    if (this.uploadImageObjectSide3.image === '' || this.uploadImageObjectSide3.image === null || this.uploadImageObjectSide3.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateSide4 = () => {
    console.log("vvvvvvvv",this.uploadImageObjectSide4.image);
    
    if (this.uploadImageObjectSide4.image === '' || this.uploadImageObjectSide4.image === null || this.uploadImageObjectSide4.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateExtnd = () => {
    console.log("vvvvvvvv",this.uploadImageObjectExtnd.image);
    
    if (this.uploadImageObjectExtnd.image === '' || this.uploadImageObjectExtnd.image === null || this.uploadImageObjectExtnd.image === undefined) {
      this.toastr.warning('Please select PDF file', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  isAllowedFile = (file: any, callback: any) => {
    console.log("call", file.type);
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
    console.log("call", file.type);
    switch (file.type) {
      case "application/pdf":
        return callback(true);
      default:
        return callback(false);
    }
  };
}
