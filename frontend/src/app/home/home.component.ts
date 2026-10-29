import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user: any = null;
  public userRole: string = '';
  public isLoading: boolean = true;
  public isRefreshing: boolean = false;
  public currentDate: Date = new Date();
  public activeTab: 'all' | 'quarters' | 'certificates' | 'maintenance' = 'all';

  // Grouped counters in a single state object
  public counts = {
    dept: 0,
    encroach: 0,
    quarter: 0,
    apply: 0,
    renewal: 0,
    dnoAco: 0,
    repair: 0,
    courtCase: 0
  };

  public permission = {
    quarterApplyPrivilage: false,
    addDepartmentPrivilage: false,
    addQuarterPrivilage: false
  };

  constructor(
    private homeService: HomeService,
    private loginService: LoginService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initDashboard();
  }

  public getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  public setActiveTab(tab: 'all' | 'quarters' | 'certificates' | 'maintenance'): void {
    this.activeTab = tab;
  }

  public refreshData(): void {
    this.isRefreshing = true;
    if (this.userRole === 'admin') {
      this.loadAdminCounters(() => {
        this.isRefreshing = false;
        this.toastr.success('Dashboard metrics refreshed', 'Updated');
      });
    } else {
      this.loadUserCounters(() => {
        this.isRefreshing = false;
        this.toastr.success('Dashboard metrics refreshed', 'Updated');
      });
    }
  }

  private initDashboard(): void {
    try {
      const rawToken = localStorage.getItem('token');
      if (rawToken) {
        let token = JSON.parse(rawToken);
        if (typeof token === 'string') token = JSON.parse(token);

        this.user = token?.usr;
        this.userRole = (this.user?.role || '').toLowerCase();

        // Redirect non-admin users with empty Aadhaar to profile page
        if (this.userRole !== 'admin' && (!this.user?.aadhaar_number || String(this.user.aadhaar_number).trim() === '')) {
          this.toastr.warning('Please insert your Aadhaar number to complete your profile.', 'Aadhaar Required');
          this.router.navigate(['/profile']);
          return;
        }

        if (this.userRole === 'admin') {
          this.loadAdminCounters();
        } else if (this.userRole === 'user') {
          this.loadUserCounters();
        }

        if (this.user?.accessKeyword) {
          this.loadPermissions();
        }
      }
    } catch (err) {
      console.error('Error reading token from localStorage', err);
    } finally {
      this.isLoading = false;
    }
  }

  private loadAdminCounters(callback?: () => void): void {
    this.homeService.adminHomeCounter((res: any) => {
      this.counts = {
        dept: res.departmentCount || 0,
        encroach: res.encroachCount || 0,
        quarter: res.quarterCount || 0,
        apply: res.applicationCount || 0,
        renewal: res.renewalCount || 0,
        dnoAco: res.nonAcooCount || 0,
        repair: res.repairCount || 0,
        courtCase: res.courtCaseCount || 0
      };
      if (callback) callback();
    });
  }

  private loadUserCounters(callback?: () => void): void {
    this.homeService.userHomeCounter(this.user?.id, (res: any) => {
      this.counts.apply = res.applyCount || 0;
      this.counts.renewal = res.renewalCount || 0;
      this.counts.dnoAco = res.nonAcooCount || 0;
      if (callback) callback();
    });
  }

  private loadPermissions(): void {
    this.permission.quarterApplyPrivilage = this.loginService.return_HasApplyQuarterRight();
    this.permission.addDepartmentPrivilage = this.loginService.return_HasAddDepartmentRight();
    this.permission.addQuarterPrivilage = this.loginService.return_HasAddQuarterRight();
  }
}