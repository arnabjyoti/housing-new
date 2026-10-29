import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoadingService } from './services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})
export class AppComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public isLoading$: Observable<boolean>;
  title = 'Housing';

  constructor(
    private router: Router,
    private appService: AppService,
    private authService: AuthService,
    public loadingService: LoadingService
  ) {
    this.isLoading$ = this.loadingService.isLoading$;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.authService.initAutoLogoutTimer();

    // Listen to router events for both global page loader and auth state
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
        this.isLoggedIn = this.authService.isAuthenticated();
      }
    });
  }
}
