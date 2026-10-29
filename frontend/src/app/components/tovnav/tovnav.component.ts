import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-tovnav',
  templateUrl: './tovnav.component.html',
  styleUrls: ['./tovnav.component.css']
})
export class TovnavComponent implements OnInit {
  public user: any = null;
  public shortName: string = '';
  public isSidebarCollapsed: boolean = false;
  public isMobileOpen: boolean = false;
  public isProfileMenuOpen: boolean = false;

  public activeDropdowns: { [key: string]: boolean } = {
    adminQuarter: false,
    adminAddNew: false,
    adminCertificates: false,
    citizenQuarter: false,
    citizenCertificates: false
  };

  public permission = {
    quarterApplyPrivilage: false,
    addDepartmentPrivilage: false,
    addQuarterPrivilage: false
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private elementRef: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.getAccessRightsList();
    this.syncActiveDropdownWithRoute();
  }

  getUserDetails = () => {
    try {
      const raw = localStorage.getItem('token');
      if (raw) {
        let token = JSON.parse(raw);
        if (typeof token === 'string') token = JSON.parse(token);
        if (token && token['usr']) {
          this.user = token['usr'];
          this.shortName = this.user?.f_name ? this.user.f_name.substring(0, 3) : 'UD';
        }
      }
    } catch (e) {
      console.error('Error parsing user token', e);
    }
  };

  getAccessRightsList = () => {
    this.permission.quarterApplyPrivilage = this.loginService.return_HasApplyQuarterRight();
    this.permission.addDepartmentPrivilage = this.loginService.return_HasAddDepartmentRight();
    this.permission.addQuarterPrivilage = this.loginService.return_HasAddQuarterRight();
  };

  toggleSidebar(): void {
    if (window.innerWidth <= 992) {
      this.isMobileOpen = !this.isMobileOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
      document.body.classList.toggle('sidebar-collapsed', this.isSidebarCollapsed);
    }
  }

  closeMobileSidebar(): void {
    this.isMobileOpen = false;
  }

  toggleDropdown(key: string, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.activeDropdowns[key] = !this.activeDropdowns[key];
  }

  isDropdownOpen(key: string): boolean {
    return !!this.activeDropdowns[key];
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileMenuOpen = false;
      if (this.isMobileOpen) {
        this.isMobileOpen = false;
      }
    }
  }

  signout = () => {
    this.authService.logout();
  };

  private syncActiveDropdownWithRoute(): void {
    const url = this.router.url;
    if (url.includes('/quarter/') || url.includes('/quarter-request')) {
      this.activeDropdowns['adminQuarter'] = true;
    }
    if (url.includes('/location') || url.includes('/sector') || url.includes('/satellite-images')) {
      this.activeDropdowns['adminAddNew'] = true;
    }
    if (url.includes('-request') || url.includes('/non-accomodation-request')) {
      this.activeDropdowns['adminCertificates'] = true;
    }
    if (url.includes('/apply-quarter') || url.includes('/renewal-quarter') || url.includes('/repair_maintenance')) {
      this.activeDropdowns['citizenQuarter'] = true;
    }
    if (url.includes('/no-dues') || url.includes('/noc-')) {
      this.activeDropdowns['citizenCertificates'] = true;
    }
  }
}
