import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { SatelliteImagesService } from './satellite-images.service';

@Component({ selector: 'app-satellite-images', standalone: true, imports: [CommonModule, FormsModule, RouterModule], templateUrl: './satellite-images.component.html', styleUrls: ['./satellite-images.component.css'] })
export class SatelliteImagesComponent implements OnInit {
  readonly maxSize = 5 * 1024 * 1024;
  readonly baseUrl = environment.BASE_URL;
  user: any; locations: any[] = []; sectors: any[] = []; records: any[] = [];
  // Retained for the hidden legacy form in this template; the modal uses selectedFiles.
  files: File[] = [];
  selectedFiles: Array<File | null> = [null, null, null, null, null];
  locationId = ''; sectorId = ''; editId: number | null = null; saving = false; editing = false;

  constructor(private service: SatelliteImagesService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('token') || 'null')?.usr;
    if (this.user?.role !== 'admin') { this.router.navigate(['/home']); return; }
    this.service.locations().subscribe(data => {
      this.locations = (data || []).filter((loc: any) => loc && loc.status !== '0' && loc.status !== 0);
    });
    this.loadRecords();
  }

  openAdd(): void { this.resetForm(); this.editing = false; }
  onLocationChange(): void {
    this.sectorId = ''; this.sectors = [];
    if (this.locationId) this.service.sectors(this.locationId).subscribe(data => this.sectors = data || []);
  }
  onFileSelected(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0] || null;
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) return this.error('Only JPG, JPEG, and PNG images are allowed.');
    if (file.size > this.maxSize) return this.error(`${file.name} is larger than 5 MB.`);
    this.selectedFiles[index] = file;
  }
  onFilesSelected(event: Event): void {
    this.files = Array.from((event.target as HTMLInputElement).files || []);
  }
  save(): void {
    if (!this.locationId || !this.sectorId) return this.error('Select a location and then a sector.');
    if (!this.editId && !this.selectedFiles.some(Boolean)) return this.error('Select at least one image.');
    const form = new FormData();
    form.append('userId', String(this.user.id)); form.append('locationId', this.locationId); form.append('sectorId', this.sectorId);
    if (this.editId) form.append('recordId', String(this.editId));
    this.selectedFiles.forEach((file, index) => { if (file) form.append(`image${index + 1}`, file); });
    this.saving = true;
    this.service.save(form).subscribe({ next: result => { this.toastr.success(result.message); this.closeModal(); this.loadRecords(); }, error: error => this.error(error.error?.message || 'Unable to save satellite images.'), complete: () => this.saving = false });
  }
  edit(record: any): void {
    this.editing = true; this.editId = record.id; this.locationId = String(record.locationId); this.sectorId = String(record.sectorId); this.selectedFiles = [null, null, null, null, null];
    this.service.sectors(this.locationId).subscribe(data => this.sectors = data || []);
  }
  remove(): void {
    if (!this.editId || !confirm('Delete all satellite images for this Location and Sector?')) return;
    this.service.remove(this.editId, this.user.id).subscribe({ next: result => { this.toastr.success(result.message); this.closeModal(); this.loadRecords(); }, error: error => this.error(error.error?.message || 'Unable to delete satellite images.') });
  }
  imageUrls(record: any): string[] { return [record.photo_1, record.photo_2, record.photo_3, record.photo_4, record.photo_5].filter(Boolean).map(name => `${this.baseUrl}/api/satellite-images/${record.id}/${name}?userId=${this.user.id}`); }
  imageCount(record: any): number { return this.imageUrls(record).length; }
  currentImageUrl(index: number): string | null {
    const record = this.records.find(item => item.id === this.editId);
    const filename = record && record[`photo_${index + 1}`];
    return filename ? `${this.baseUrl}/api/satellite-images/${record.id}/${filename}?userId=${this.user.id}` : null;
  }
  closeModal(): void { this.resetForm(); const close = document.getElementById('closeSatelliteModal'); close?.click(); }
  resetForm(): void { this.locationId = ''; this.sectorId = ''; this.sectors = []; this.selectedFiles = [null, null, null, null, null]; this.files = []; this.editId = null; }
  private loadRecords(): void { this.service.list(this.user.id).subscribe({ next: data => this.records = data || [], error: error => this.error(error.error?.message || 'Unable to load satellite images.') }); }
  private error(message: string): void { this.toastr.error(message, 'Error'); }
}
