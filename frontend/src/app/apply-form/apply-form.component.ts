import { Component, OnInit } from '@angular/core';
import { ApplyFormService } from './apply-form.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-apply-form',
  templateUrl: './apply-form.component.html',
  styleUrls: ['./apply-form.component.css']
})
export class ApplyFormComponent implements OnInit{

  public endpoint: any;
  public userID:any;
  public departmentId:any;
  public data: any;
  public returnMsg:any;

  public rspns: any;

  public userDetails:any; 
  public dept_name: any;

  public dbUserDetails: any;

  public uploadImageObject:any={
    panImg:'',
    adharImg: ''
  }
  public apply_place:any;
  public map_loc: any;
  public check:boolean = false;

  public isSaving: boolean = false;
  public chooseFile: string = "Choose File";
  public annexure: string = "Choose File";
  public day:any;
  public month: any;
  public rfrncn_no: any;
  public acceptfileType: string = "image";
  public showAnxBtn: boolean = false;
  public showAnxSc: boolean = true;

  public showBtn: boolean =true;
  public showrfrnc: boolean = false;

  public isLodaing = true;
  
  public myDate:any = new Date();
  public apply_date:any;
  constructor(
    private spinner: NgxSpinnerService,
    private ApplyFormService: ApplyFormService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ){
    this.endpoint = environment.BASE_URL;
    this.init();
    this.myDate = this.datePipe.transform(this.myDate, "YYYY-MM-dd");
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
    this.checkApplication();
  }


  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  userData=()=>{
    console.log("userID",this.userID);
    
    this.ApplyFormService.getUserDetails(this.userID, (callback:any)=>{
      console.log(callback);
      this.dbUserDetails = callback.appointment;
      this.data = callback.department_name
      // this.dept_name = callback.department.dept_name;
      console.log("fffffffffff",this.dbUserDetails);
      
    });  
  }

  checkApplication(){
    this.ApplyFormService.check(this.userID, (callback:any)=>{
      console.log("checkkkkkkkkkkkkkkkkkkkkkk",callback);

      this.rspns = callback;
      if (this.rspns != null) {
        
      this.rfrncn_no = this.rspns.reference_no;
      if (this.rspns.status == "Apply" || this.rspns.status == "Rejected" || this.rspns.status == "Verified" || this.rspns.status == "Approved") {
        this.showBtn = false;
        this.showrfrnc = true;
      }else{
        this.showBtn = true;
        this.showrfrnc = false;
      }
    }
      
    });  
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

   //for Annexure Card
   onFileSelectAnnexure(event:any) {
    console.log(event.target.files[0].size);
    if (event.target.files.length > 0 && event.target.files[0].size < 512000 ) {
      
      this.uploadImageObject.annexure = event.target.files[0];
      
      const file = event.target.files[0];
      const fileName = file.name;
      
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name= "ANNEXURE"+this.convertDate()+ "."+fileExtension;

      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type); 

      var newFile = new File([blob], name, {type: event.target.files[0].type});
      console.log("newfile",newFile);
      this.uploadImageObject.image = newFile;
      
      
      
      
      this.annexure = this.uploadImageObject.annexure
        ? this.uploadImageObject.annexure["name"]
        : "Choose File";
      console.log("Choose", this.chooseFile);
      console.log("imgObject===", this.uploadImageObject);
    }else {
      this.toastr.error('Image size should be less than 500kb','Error',{
        disableTimeOut:false
      });
    }
    return true;
  };


  apply(){
    // this.apply_date = this.myDate.format("YYYY-MM-DD")
    console.log("Uploading Anx", this.uploadImageObject);
    let isValid = this.validatePan();
    if(isValid){
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        console.log("res", res);
        if (res == true) {
          this.isLodaing = true;
          this.spiner();
    console.log("input data",this.uploadImageObject);
    const formData = new FormData();
    formData.append("dbid", this.userID);
    formData.append("file", this.uploadImageObject.image);
    formData.append("departmentId", this.departmentId);
    formData.append("apply_place", this.apply_place);
    formData.append("apply_date", this.myDate);
    formData.append("map_loc", this.map_loc);
    formData.append("reference_no", this.convertDate());
    console.log("FORMDATA===", formData);
    console.log("userID===", this.userID);
    this.ApplyFormService.applyQuarter(
      formData,
      this.userID,
          this.acceptfileType, (response: any) =>{
      this.returnMsg = response.message;
      console.log("lllllllllll",this.returnMsg);
      this.checkApplication();
      this.rfrncn_no = this.returnMsg;
      this.showBtn = false;
      this.showrfrnc = true;
    }
    );
      
      
    }
  })
  }else {
    this.toastr.error('Invalid image file', 'Error', {
      disableTimeOut: false
    });
  }
  }

  isAllowedFile = (file: any, callback: any) => {
    console.log("call type", file.type);
    switch (file.type) {
      case "application/pdf":
        return callback(true);
      default:
        return callback(false);
    }
  };

  validatePan = () =>{
    if(this.uploadImageObject.image==='' || this.uploadImageObject.image===null || this.uploadImageObject.image===undefined){
      this.toastr.warning('Please upload Annexure A','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if(this.apply_place==='' || this.apply_place===null || this.apply_place===undefined){
      this.toastr.warning('Please type your place','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    if (this.check === false) {
      this.toastr.warning('Please check the checkbox','Warning',{
        disableTimeOut:false
      });
      return false;
    }
    return true;
  }
}
