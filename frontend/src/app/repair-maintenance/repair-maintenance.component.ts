import { Component, OnInit } from '@angular/core';
import { RepairMaintenanceService } from './repair-maintenance.service';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-repair-maintenance',
  templateUrl: './repair-maintenance.component.html',
  styleUrls: ['./repair-maintenance.component.css']
})
export class RepairMaintenanceComponent implements OnInit{

public locationList: any;

public locationInput: any = {
  loc_id: '',
  sec_id: '',
  type: '',
  qtr_no: ''
}
// public locationId: any;

public sectorList: any;
// public sectorId: any;

public inputForm: boolean = true;

public quarterType: any;
public locationName: any;
public sectorName: any;
public quarterNo: any;

public allotment_order: any;

  formData = {
    door: false,       // Initially null, can be true (Yes) or false (No)
    windows: false,
    walls: false,
    ceiling: false,
    wiring: false,
    septic: false,
    roof: false
  };

  // for image
  public doorImage: any;
  public door_status: any;
  public door_btn: boolean = true;

  public windowImage: any;
  public window_status: any;
  public window_btn: boolean = true;

  public wallImage: any;
  public wall_status: any;
  public wall_btn: boolean = true;

  public ceilingImage: any;
  public ceiling_status:any;
  public ceiling_btn: boolean = true;

  public wiringImage: any;
  public wiring_status: any;
  public wiring_btn: boolean = true;

  public tankImage: any;
  public tank_status: any;
  public tank_btn: boolean = true;

  public roofImage: any;
  public roof_status: any;
  public roof_btn: boolean = true;

  public uploadImageObject: any = {
    panImg: '',
    adharImg: ''
  }

  public allotment: string = "Choose File";
  public door: string = "Choose File";
  public windows: string = "Choose File";
  public walls: string = "Choose File";
  public ceiling: string = "Choose File";
  public wiring: string = "Choose File";
  public tank: string = "Choose File";
  public roof: string = "Choose File";


  public acceptfileType: string = "image";


  public isLodaing = true;
  public returnMsg: any;
  public isSaving: boolean = false;

  public endpoint: any;


  public userID:any;
  public userDetails:any; 
  public departmentId:any;
  public data: any;


  public repairId: any;


  constructor(
    private RepairMaintenanceService: RepairMaintenanceService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
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
    this.location();
    this.userData();
  }



  spiner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 9000);
  }

  userData=()=>{
    console.log("userID",this.userID);
    
    this.RepairMaintenanceService.checkRepairData(this.userID, (callback:any)=>{
      console.log("checkRepairData",callback);
      if (callback != null) {
        this.inputForm = false;
        this.repairId = callback.id;
        this.locationName = callback.loc_name;
        this.sectorName = callback.sctr_name;
        this.quarterType = callback.quarter_type;
        this.quarterNo = callback.quarter_no;
        this.allotment_order = callback.allotment_order;
        this.doorImage = callback.door;
        this.door_status = callback.door_status;

        this.windowImage = callback.window;
        this.window_status = callback.window_status;

        this.wallImage = callback.wall;
        this.wall_status = callback.wall_status;

        this.ceilingImage = callback.ceiling;
        this.ceiling_status = callback.ceiling_status;

        this.wiringImage = callback.wiring;
        this.wiring_status = callback.wiring_status;

        this.tankImage = callback.tank;
        this.tank_status = callback.tank_status;

        this.roofImage = callback.roof;
        this.roof_status = callback.roof_status;


        if (callback.door == null) {
          this.formData.door = false;
          this.door_btn = true;
        }else{
          this.formData.door = true;
          this.door_btn = false;
        }

        if (callback.window == null) {
          this.formData.windows = false;
          this.window_btn = true;
        }else{
          this.formData.windows = true;
          this.window_btn = false;
        }

        if (callback.wall == null) {
          this.formData.walls = false;
          this.wall_btn = true;
        }else{
          this.formData.walls = true;
          this.wall_btn = false;
        }

        if (callback.ceiling == null) {
          this.formData.ceiling = false;
          this.ceiling_btn = true;
        }else{
          this.formData.ceiling = true;
          this.ceiling_btn = false;
        }

        if (callback.wiring == null) {
          this.formData.wiring = false;
          this.wiring_btn = true;
        }else{
          this.formData.wiring = true;
          this.wiring_btn = false;
        }

        if (callback.tank == null) {
          this.formData.septic = false;
          this.tank_btn = true;
        }else{
          this.formData.septic = true;
          this.tank_btn = false;
        }

        if (callback.roof == null) {
          this.formData.roof = false;
          this.roof_btn = true;
        }else{
          this.formData.roof = true;
          this.roof_btn = false;
        }
      }
      
      
    });  
  }



  location=()=>{
    let requestObject = {};
    this.RepairMaintenanceService.getLocation(requestObject, (callback:any)=>{
      console.log("bbbbbbbbbb",callback);
      this.locationList = Array.isArray(callback)
        ? callback.filter((loc: any) => loc && loc.status !== '0' && loc.status !== 0)
        : [];
      console.log("location details",this.locationList);
    });  
  }
  
  setLocation(){
    this.RepairMaintenanceService.getSectorData(this.locationInput.loc_id, (callback:any)=>{
      console.log("set location",callback);
      this.sectorList = callback;
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
      var name = "AO_" + this.convertDate()+ "."+fileExtension;
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



  uploadAllotment() {
    console.log("locationInput", this.locationInput);
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validateAllotmentData();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        if (res == true) {
      this.isLodaing = true;
      this.spiner();
      console.log("input data", this.uploadImageObject);
      const formData = new FormData();
      formData.append("qtr_no", this.locationInput.qtr_no);
      formData.append("loc_id", this.locationInput.loc_id);
      formData.append("sec_id", this.locationInput.sec_id);
      formData.append("type", this.locationInput.type);
      formData.append("dbid", this.userID);
      formData.append("file", this.uploadImageObject.image);
      this.RepairMaintenanceService.uploadAllotment(
        formData,
        this.userID,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          // this.getuserDataById();
          this.userData();
        }
      );
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  );
    } else {
      this.isSaving = false;
    }

  }


  validateAllotmentData = () => {
    if (this.locationInput.qtr_no === '' || this.locationInput.qtr_no === null || this.locationInput.qtr_no === undefined) {
      this.toastr.warning('Please select quarter number', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.locationInput.loc_id === '' || this.locationInput.loc_id === null || this.locationInput.loc_id === undefined) {
      this.toastr.warning('Please select location', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.locationInput.sec_id === '' || this.locationInput.sec_id === null || this.locationInput.sec_id === undefined) {
      this.toastr.warning('Please select sector', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.locationInput.type === '' || this.locationInput.type === null || this.locationInput.type === undefined) {
      this.toastr.warning('Please select type', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    if (this.uploadImageObject.image === '' || this.uploadImageObject.image === null || this.uploadImageObject.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  validateAllotment = () => {
    if (this.uploadImageObject.image === '' || this.uploadImageObject.image === null || this.uploadImageObject.image === undefined) {
      this.toastr.warning('Please select photo', 'Warning', {
        disableTimeOut: false
      });
      return false;
    }
    return true;
  }

  // Door order image select

  onFileSelectedDoor(event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
      this.uploadImageObject.door = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "door_" + this.convertDate()+ "."+fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;
      this.door = this.uploadImageObject.door
        ? this.uploadImageObject.door["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 2 MB', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };


  uploadDoor() {
    console.log("locationInput", this.locationInput);
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validateAllotment();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        if (res == true) {
      this.isLodaing = true;
      this.spiner();
      console.log("input data", this.uploadImageObject);
      const formData = new FormData();
      formData.append("repairId", this.repairId);
      formData.append("dbid", this.userID);
      formData.append("file", this.uploadImageObject.image);
      this.RepairMaintenanceService.uploadDoor(
        formData,
        this.userID,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          // this.getuserDataById();
          this.userData();
        }
      );
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  );
    } else {
      this.isSaving = false;
    }

  }

  // Windows order image select

  onFileSelectedWindows (event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
      this.uploadImageObject.windows = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "windows _" + this.convertDate()+ "."+fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;
      this.windows = this.uploadImageObject.windows
        ? this.uploadImageObject.windows["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 2 MB', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };



  uploadWindow() {
    console.log("locationInput", this.locationInput);
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validateAllotment();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        if (res == true) {
      this.isLodaing = true;
      this.spiner();
      console.log("input data", this.uploadImageObject);
      const formData = new FormData();
      formData.append("repairId", this.repairId);
      formData.append("dbid", this.userID);
      formData.append("file", this.uploadImageObject.image);
      this.RepairMaintenanceService.uploadWindow(
        formData,
        this.userID,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          // this.getuserDataById();
          this.userData();
        }
      );
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  );
    } else {
      this.isSaving = false;
    }

  }


  // Walls  order image select

  onFileSelectedWalls (event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
      this.uploadImageObject.walls = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "walls_" + this.convertDate()+ "."+fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;
      this.walls = this.uploadImageObject.walls
        ? this.uploadImageObject.walls["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 2 MB', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };



  uploadWall() {
    console.log("locationInput", this.locationInput);
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validateAllotment();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        if (res == true) {
      this.isLodaing = true;
      this.spiner();
      console.log("input data", this.uploadImageObject);
      const formData = new FormData();
      formData.append("repairId", this.repairId);
      formData.append("dbid", this.userID);
      formData.append("file", this.uploadImageObject.image);
      this.RepairMaintenanceService.uploadWall(
        formData,
        this.userID,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          // this.getuserDataById();
          this.userData();
        }
      );
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  );
    } else {
      this.isSaving = false;
    }

  }



  // Ceiling   order image select

  onFileSelectedCeiling (event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
      this.uploadImageObject.ceiling = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "ceiling_" + this.convertDate()+ "."+fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;
      this.ceiling = this.uploadImageObject.ceiling
        ? this.uploadImageObject.ceiling["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 2 MB', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };




  uploadCeiling() {
    console.log("locationInput", this.locationInput);
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validateAllotment();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        if (res == true) {
      this.isLodaing = true;
      this.spiner();
      console.log("input data", this.uploadImageObject);
      const formData = new FormData();
      formData.append("repairId", this.repairId);
      formData.append("dbid", this.userID);
      formData.append("file", this.uploadImageObject.image);
      this.RepairMaintenanceService.uploadCeiling(
        formData,
        this.userID,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          // this.getuserDataById();
          this.userData();
        }
      );
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  );
    } else {
      this.isSaving = false;
    }

  }


  // Wiring order image select

  onFileSelectedWiring (event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
      this.uploadImageObject.wiring = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "wiring_" + this.convertDate()+ "."+fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;
      this.wiring = this.uploadImageObject.wiring
        ? this.uploadImageObject.wiring["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 2 MB', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };



  uploadWiring() {
    console.log("locationInput", this.locationInput);
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validateAllotment();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        if (res == true) {
      this.isLodaing = true;
      this.spiner();
      console.log("input data", this.uploadImageObject);
      const formData = new FormData();
      formData.append("repairId", this.repairId);
      formData.append("dbid", this.userID);
      formData.append("file", this.uploadImageObject.image);
      this.RepairMaintenanceService.uploadWiring(
        formData,
        this.userID,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          // this.getuserDataById();
          this.userData();
        }
      );
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  );
    } else {
      this.isSaving = false;
    }

  }


  // Tank order image select

  onFileSelectedTank (event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
      this.uploadImageObject.tank = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "tank_" + this.convertDate()+ "."+fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;
      this.tank = this.uploadImageObject.tank
        ? this.uploadImageObject.tank["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 2 MB', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };



  uploadTank() {
    console.log("locationInput", this.locationInput);
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validateAllotment();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        if (res == true) {
      this.isLodaing = true;
      this.spiner();
      console.log("input data", this.uploadImageObject);
      const formData = new FormData();
      formData.append("repairId", this.repairId);
      formData.append("dbid", this.userID);
      formData.append("file", this.uploadImageObject.image);
      this.RepairMaintenanceService.uploadTank(
        formData,
        this.userID,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          // this.getuserDataById();
          this.userData();
        }
      );
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  );
    } else {
      this.isSaving = false;
    }

  }



  // roof order image select

  onFileSelectedRoof (event: any) {
    if (event.target.files.length > 0 && event.target.files[0].size < 2000000) {
      this.uploadImageObject.roof = event.target.files[0];
      const file = event.target.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      var name = "roof_" + this.convertDate()+ "."+fileExtension;
      var blob = event.target.files[0].slice(0, event.target.files[0].size, event.target.files[0].type);
      var newFile = new File([blob], name, { type: event.target.files[0].type });
      this.uploadImageObject.image = newFile;
      this.roof = this.uploadImageObject.roof
        ? this.uploadImageObject.roof["name"]
        : "Choose File";
    } else {
      this.toastr.error('Image size should be less than 2 MB', 'Error', {
        disableTimeOut: false
      });
    }
    return true;
  };



  uploadRoof() {
    console.log("locationInput", this.locationInput);
    console.log("Uploading photo", this.uploadImageObject);
    let isValid = this.validateAllotment();
    if (isValid) {
      this.isAllowedFile(this.uploadImageObject.image, (res: any) => {
        if (res == true) {
      this.isLodaing = true;
      this.spiner();
      console.log("input data", this.uploadImageObject);
      const formData = new FormData();
      formData.append("repairId", this.repairId);
      formData.append("dbid", this.userID);
      formData.append("file", this.uploadImageObject.image);
      this.RepairMaintenanceService.uploadRoof(
        formData,
        this.userID,
        this.acceptfileType, (response: any) => {
          this.isLodaing = false;
          this.returnMsg = response.message;
          this.uploadImageObject.image = "";
          this.isSaving = false;
          // this.getuserDataById();
          this.userData();
        }
      );
    } else {
      this.toastr.error('Invalid image file', 'Error', {
        disableTimeOut: false
      });
    }
  }
  );
    } else {
      this.isSaving = false;
    }

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
}
