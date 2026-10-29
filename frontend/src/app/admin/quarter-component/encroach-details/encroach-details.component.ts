import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxPrintModule } from 'ngx-print';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { environment } from 'src/environments/environment';
import { EncroachDetailsService } from './encroach-details.service';

(pdfMake as any).vfs = (pdfFonts as any).vfs;

export interface ImageSlot {
  file: File | null;
  label: string;
  showBtn: boolean;
  isUploaded: boolean;
}

@Component({
  selector: 'app-encroach-details',
  templateUrl: './encroach-details.component.html',
  styleUrls: ['./encroach-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgxPrintModule,
    NgxSpinnerModule,
    MatTableModule,
    MatGridListModule,
    MatSelectModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ]
})
export class EncroachDetailsComponent implements OnInit {
  public displayedColumns: string[] = [
    'Sl', 'allotee_name', 'allotee_dept_name', 'name_of_encroacher',
    'location', 'sector', 'type', 'qrtr_no', 'encroached_type', 'action'
  ];

  public dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public endpoint: string = environment.BASE_URL;
  public isLoading: boolean = true;
  public isEditing: boolean = false;
  public showSaveBtn: boolean = true;
  public formUpload: boolean = false;
  public dbId: any = null;
  public currentUser: any;

  public locationData: any[] = [];
  public sectorData: any[] = [];
  public filteredSectors: any[] = [];
  public departmentName: any[] = [];
  public apiResponse: any[] = [];

  public quarterTypes: string[] = [
    'BACHELOR BARRACK', 'TYPE I', 'TYPE II', 'TYPE III', 'TYPE IV', 'TYPE V', 'TYPE VI',
    'BUNGALOW', 'TRANSIT CAMP', 'DOUBLE STORY', 'TOWER-1 TYPE-IV', 'TOWER-2 TYPE-IV',
    'TOWER-3 TYPE-V', 'TOWER-4 TYPE-V', 'T-I (DS)', 'T-II (DS)', 'T-III (DS)',
    'T-IV (DS)', 'T-V (DS)', 'QUARTER TYPES NOT IDENTIFY'
  ];

  public encroachedTypeOptions: string[] = ['Encroached', 'Demolished', 'Missing'];

  public filter = { loc_id: '', sec_id: '', type: '', encroached_type: 'ALL' };

  public formData = this.getEmptyFormData();
  public selectedEnc: any = this.getEmptyEncData();

  public imageSlots: ImageSlot[] = Array.from({ length: 5 }, () => ({
    file: null,
    label: 'Choose File',
    showBtn: true,
    isUploaded: false
  }));

  public photoFiles: Record<string, File | null> = { photo1: null, photo2: null, photo3: null, photo4: null };
  public photoLabels: Record<string, string> = { photo1: 'Choose File', photo2: 'Choose File', photo3: 'Choose File', photo4: 'Choose File' };

  constructor(
    private spinner: NgxSpinnerService,
    private encroachService: EncroachDetailsService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('token') || 'null')?.usr;
    this.showSpinner();
    this.fetchApplicationData();
    this.fetchLocations();
    this.fetchDepartments();
  }

  // --- Initial Data Fetching ---

  public fetchLocations(): void {
    this.encroachService.getLocation({}, (res: any) => {
      this.locationData = res || [];
    });
  }

  public fetchDepartments(): void {
    this.encroachService.getDepartment({}, (res: any) => {
      this.departmentName = res || [];
    });
  }

  public fetchApplicationData(): void {
    this.isLoading = true;
    this.encroachService.encroachData({}, (res: any[]) => {
      this.apiResponse = (res || []).map((item: any) => ({
        id: item.id,
        sctr_name: item['sector.sctr_name'],
        sctr_id: item['sector.id'],
        sec_id: item['sector.id'],
        loc_name: item['location.loc_name'],
        loc_id: item['location.id'],
        qrtr_no: item.qrtr_no,
        allotee_dept_name: item['allotee_departmentID.dept_name'],
        allotee_dept_id: item['allotee_departmentID.id'],
        allotee_name: item.allotee_name,
        allotee_designation: item.allotee_designation,
        encroachment_details: item.encroachment_details,
        name_of_encroacher: item.name_of_encroacher,
        qrtr_type: item.qrtr_type,
        encroached_type: item.encroached_type || '',
        designation_of_encroacher: item.designation_of_encroacher,
        department_of_encroacher: item['department_of_encroacherID.dept_name'],
        department_id_of_encroacher: item['department_of_encroacherID.id'],
        encroacher_designation: item.encroacher_designation,
        status_of_case: item.status_of_case,
        photo_1: item.photo_1,
        photo_2: item.photo_2,
        photo_3: item.photo_3,
        photo_4: item.photo_4,
        photo_5: item.photo_5
      }));

      this.dataSource = new MatTableDataSource(this.apiResponse);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  // --- Search & Filter Logic ---

  public FilterChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  public applyFilters(): void {
    const filtered = this.apiResponse.filter(item => {
      const matchLoc = !this.filter.loc_id || item.loc_id == this.filter.loc_id;
      const matchSec = !this.filter.sec_id || item.sctr_id == this.filter.sec_id;
      const matchType = !this.filter.type || item.qrtr_type === this.filter.type;

      let matchEncType = true;
      if (this.filter.encroached_type === 'EMPTY') {
        matchEncType = !item.encroached_type || item.encroached_type.trim() === '';
      } else if (this.filter.encroached_type !== 'ALL' && this.filter.encroached_type !== '') {
        matchEncType = item.encroached_type === this.filter.encroached_type;
      }

      return matchLoc && matchSec && matchType && matchEncType;
    });
    this.dataSource.data = filtered;
  }

  public onLocationFilterChange(event: any): void {
    this.applyFilters();
    if (this.filter.loc_id) {
      this.encroachService.getSectorData(this.filter.loc_id, (res: any) => {
        this.sectorData = res || [];
        this.filter.sec_id = '';
        this.filter.type = '';
      });
    }
  }

  public FilterChangeSector(event: any): void {
    this.filter.type = '';
    this.applyFilters();
  }

  public FilterChangeQrtrType(event: any): void {
    this.applyFilters();
  }

  public FilterChangeEncType(event: any): void {
    this.applyFilters();
  }

  public resetFilter(): void {
    this.filter = { loc_id: '', sec_id: '', type: '', encroached_type: 'ALL' };
    this.dataSource.data = this.apiResponse;
  }

  // --- Dependent Dropdown Cascades ---

  public setLocation(): void {
    if (!this.formData.loc_id) return;
    this.encroachService.getSectorData(this.formData.loc_id, (res: any) => {
      this.sectorData = res || [];
      this.formData.sec_id = '';
      this.formData.type = '';
    });
  }

  public setQuarterLocationUpdate(): void {
    if (!this.selectedEnc.loc_id) return;
    this.encroachService.getSectorData(this.selectedEnc.loc_id, (res: any) => {
      this.filteredSectors = res || [];
      this.selectedEnc.sec_id = '';
    });
  }

  public filterSectors(): void {
    if (!this.selectedEnc.loc_id) {
      this.filteredSectors = [];
      return;
    }
    this.encroachService.getSectorData(this.selectedEnc.loc_id, (res: any) => {
      this.filteredSectors = res || [];
      const match = this.filteredSectors.find(s => Number(s.id) === Number(this.selectedEnc.sec_id));
      if (!match) {
        this.selectedEnc.sec_id = this.filteredSectors[0]?.id || '';
      }
    });
  }

  // --- CRUD Operations ---

  public save(): void {
    if (!this.validateInputs()) return;

    this.encroachService.saveEncroachData(this.formData, (res: any) => {
      this.dbId = res.message;
      this.showSaveBtn = false;
      this.formUpload = true;
      this.toastr.success('Data saved successfully', 'Success');
      this.fetchApplicationData();
    });
  }

  public updateEnch(): void {
    if (!this.validateUpdateInputs()) return;

    this.encroachService.updateEncroach(this.selectedEnc, (res: any) => {
      this.toastr.success(res.message || 'Updated successfully', 'Success');
      this.fetchApplicationData();
    });
  }

  public deleteEncroach(): void {
    const req = { qId: this.selectedEnc.id, status: 0, userId: this.currentUser?.id };
    this.encroachService.deleteEncroach(req, () => {
      this.closeModal();
      this.fetchApplicationData();
    });
  }

  // --- Upload Handlers ---

  public onFileSelect(slotIndex: number, event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    const renamed = new File([file], `img_${slotIndex + 1}_${this.convertDate()}.${ext}`, { type: file.type });

    this.imageSlots[slotIndex].file = renamed;
    this.imageSlots[slotIndex].label = file.name;
  }

  public uploadImageSlot(slotIndex: number): void {
    const slot = this.imageSlots[slotIndex];
    if (!slot.file) {
      this.toastr.warning('Please select an image first', 'Warning');
      return;
    }

    const payload = new FormData();
    payload.append('dbid', this.dbId);
    payload.append('file', slot.file);

    const uploadMethods = [
      this.encroachService.uploadImgOne,
      this.encroachService.uploadImgTwo,
      this.encroachService.uploadImgThree,
      this.encroachService.uploadImgFour,
      this.encroachService.uploadImgFive
    ];

    const targetUpload = uploadMethods[slotIndex]?.bind(this.encroachService);
    if (!targetUpload) return;

    this.isLoading = true;
    targetUpload(payload, this.dbId, 'image', () => {
      slot.showBtn = false;
      slot.isUploaded = true;
      this.isLoading = false;
      this.toastr.success(`Image ${slotIndex + 1} uploaded successfully`, 'Success');
      this.fetchApplicationData();
    });
  }

  public onPhotoSelected(event: any, field: string): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.toastr.error('File size must be less than 2 MB', 'Error');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    const renamed = new File([file], `${field.toUpperCase()}_${this.convertDate()}.${ext}`, { type: file.type });

    this.photoFiles[field] = renamed;
    this.photoLabels[field] = file.name;
  }

  public uploadPhotoSlot(slotNum: number): void {
    const fieldKey = `photo${slotNum}`;
    const file = this.photoFiles[fieldKey];

    if (!file) {
      this.toastr.warning('Please select an image file', 'Warning');
      return;
    }

    const payload = new FormData();
    payload.append('dbid', this.selectedEnc.id);
    payload.append('photo_number', fieldKey);
    payload.append('file', file);

    this.isLoading = true;
    this.encroachService.updateEncroachWithPhotos(payload, 'image', () => {
      this.isLoading = false;
      this.toastr.success(`Photo ${slotNum} uploaded successfully`, 'Success');
      this.fetchApplicationData();
    });
  }

  // --- Modal Helpers ---

  public toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.filterSectors();
    }
  }

  public showEncModal(row: any): void {
    this.selectedEnc = { ...row };
  }

  public closeModal(): void {
    this.isEditing = false;
    this.fetchApplicationData();
  }

  public resetForm(): void {
    this.formData = this.getEmptyFormData();
    this.showSaveBtn = true;
    this.formUpload = false;
    this.imageSlots.forEach(slot => {
      slot.file = null;
      slot.label = 'Choose File';
      slot.showBtn = true;
      slot.isUploaded = false;
    });
  }

  public saveAndClose(): void {
    this.resetForm();
    this.fetchApplicationData();
  }

  // --- PDF Export with Dynamic Title for Empty Encroached Type ---

  public downloadPDF(): void {
    const tableBody = [
      [
        'S.No',
        'Allottee Details (Name, Dept, Designation)',
        'Encroacher Details (Name, Dept, Designation)',
        'Location',
        'Sector',
        'Quarter Type',
        'Quarter No.',
        'Encroached Type'
      ],
      ...this.dataSource.data.map((item: any, idx: number) => {
        const allotteeDetails = [
          item.allotee_name,
          item.allotee_dept_name,
          item.allotee_designation
        ].filter(Boolean).join(', ');

        const encroacherDetails = [
          item.name_of_encroacher,
          item.department_of_encroacher,
          item.encroacher_designation
        ].filter(Boolean).join(', ');

        return [
          idx + 1,
          allotteeDetails || '-',
          encroacherDetails || '-',
          item.loc_name || '-',
          item.sctr_name || '-',
          item.qrtr_type || '-',
          item.qrtr_no || '-',
          item.encroached_type || '-'
        ];
      })
    ];

    let reportTitle = 'Encroachment Report';
    let fileSuffix = '';

    if (this.filter.encroached_type === 'EMPTY') {
      reportTitle = 'Encroachment Report - Not Specified';
      fileSuffix = '-Not-Specified';
    } else if (this.filter.encroached_type && this.filter.encroached_type !== 'ALL') {
      reportTitle = `Encroachment Report - ${this.filter.encroached_type}`;
      fileSuffix = `-${this.filter.encroached_type}`;
    }

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [20, 25, 20, 25],
      content: [
        { text: reportTitle, style: 'header' },
        {
          style: 'tableStyle',
          table: {
            headerRows: 1,
            widths: [25, '*', '*', 65, 55, 75, 55, 65],
            body: tableBody
          },
          layout: {
            fillColor: (rowIndex: number) => rowIndex === 0 ? '#EEEEEE' : null,
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#CCCCCC',
            vLineColor: () => '#CCCCCC',
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 4,
            paddingBottom: () => 4
          }
        }
      ],
      styles: {
        header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 10] },
        tableStyle: { margin: [0, 5, 0, 10], fontSize: 8 }
      },
      footer: (currentPage: number, pageCount: number) => ({
        text: `Page ${currentPage} of ${pageCount}`,
        alignment: 'center',
        margin: [0, 5],
        fontSize: 8
      })
    };

    (pdfMake as any).createPdf(docDefinition).download(`Encroachment-Report${fileSuffix}.pdf`);
  }

  // --- Helper Methods ---

  private validateInputs(): boolean {
    if (!this.formData.loc_id) { this.toastr.warning('Please select location.', 'Warning'); return false; }
    if (!this.formData.sec_id) { this.toastr.warning('Please select sector.', 'Warning'); return false; }
    if (!this.formData.type) { this.toastr.warning('Please select quarter type.', 'Warning'); return false; }
    if (!this.formData.encroached_type) { this.toastr.warning('Please select encroached type.', 'Warning'); return false; }
    if (!this.formData.allotee_name) { this.toastr.warning('Please type allottee name.', 'Warning'); return false; }
    if (!this.formData.department) { this.toastr.warning('Please select department.', 'Warning'); return false; }
    if (!this.formData.name_of_encroacher) { this.toastr.warning('Please type encroacher name.', 'Warning'); return false; }
    return true;
  }

  private validateUpdateInputs(): boolean {
    if (!this.selectedEnc.loc_id) { this.toastr.warning('Please select location.', 'Warning'); return false; }
    if (!this.selectedEnc.sec_id) { this.toastr.warning('Please select sector.', 'Warning'); return false; }
    if (!this.selectedEnc.qrtr_type) { this.toastr.warning('Please select quarter type.', 'Warning'); return false; }
    if (!this.selectedEnc.encroached_type) { this.toastr.warning('Please select encroached type.', 'Warning'); return false; }
    if (!this.selectedEnc.allotee_name) { this.toastr.warning('Please type allottee name.', 'Warning'); return false; }
    if (!this.selectedEnc.name_of_encroacher) { this.toastr.warning('Please type encroacher name.', 'Warning'); return false; }
    return true;
  }

  private showSpinner(): void {
    this.isLoading = true;
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.isLoading = false;
    }, 1000);
  }

  private convertDate(): string {
    const d = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  private getEmptyFormData() {
    return {
      loc_id: '', sec_id: '', qrtr_no: '', department: '', type: '',
      encroached_type: '', allotee_name: '', allotee_designation: '',
      encroachment_details: '', name_of_encroacher: '', designation_of_encroacher: '',
      department_of_encroacher: '', encroacher_designation: '', status_of_case: ''
    };
  }

  private getEmptyEncData() {
    return {
      id: '', loc_name: '', allotee_name: '', allotee_dept_name: '',
      allotee_dept_id: '', designation: '', loc_id: '', sec_id: '',
      sctr_name: '', qrtr_no: '', qrtr_type: '', encroached_type: '',
      name_of_encroacher: '', designation_of_encroacher: '',
      department_of_encroacher: '', encroachment_details: '',
      photo_1: '', photo_2: '', photo_3: '', photo_4: ''
    };
  }
}
