import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-encroachment-delete-request',
  templateUrl: './encroachment-delete-request.component.html',
  styleUrls: ['./encroachment-delete-request.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class EncroachmentDeleteRequestComponent implements OnInit {
  requests: any[] = [];
  currentUser: any;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('token') || 'null')?.usr;
    if (this.currentUser?.role !== 'admin' || this.currentUser?.accessKeyword !== 'SuperAdmin') {
      this.router.navigate(['/home']);
      return;
    }
    this.loadRequests();
  }

  loadRequests(): void {
    this.http.post<any[]>(`${environment.BASE_URL}/api/encroachmentDeleteRequests`, {
      requestObject: { userId: this.currentUser.id }
    }).subscribe({
      next: requests => this.requests = requests,
      error: () => this.toastr.error('Could not load deletion requests.', 'Error')
    });
  }

  review(request: any, decision: 'Approved' | 'Rejected'): void {
    this.http.post<any>(`${environment.BASE_URL}/api/reviewEncroachmentDeleteRequest`, {
      requestObject: { requestId: request.id, decision, userId: this.currentUser.id }
    }).subscribe({
      next: response => { this.toastr.success(response.message, 'Success'); this.loadRequests(); },
      error: error => this.toastr.error(error.error?.message || 'Request could not be reviewed.', 'Error')
    });
  }
}
