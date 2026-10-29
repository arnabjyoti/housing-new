import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpModule } from '@angular/http';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './auth/auth-gaurd.service';
import { LoadingInterceptor } from './services/loading.interceptor';
import { JwtInterceptor } from './services/jwt.interceptor';
import { LoadingService } from './services/loading.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatePipe } from '@angular/common';
import { ApplyFormComponent } from './apply-form/apply-form.component';
import { TovnavComponent } from './components/tovnav/tovnav.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { RenewalFormComponent } from './renewal-form/renewal-form.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { QuarterRequestComponent } from './admin/quarter-request/quarter-request.component';
import { NocComponent } from './apply-certificate/noc/noc.component';
import { NoDuesComponent } from './apply-certificate/no-dues/no-dues.component';
import { NoAccomodationComponent } from './apply-certificate/no-accomodation/no-accomodation.component';
import { NgxPrintModule } from 'ngx-print';
import { OnlineApplicationComponent } from './admin/quarter-component/online-application/online-application.component';
import { QuarterAllotmentListComponent } from './admin/quarter-component/quarter-allotment-list/quarter-allotment-list.component';
import { QuarterRenewalComponent } from './admin/quarter-component/quarter-renewal/quarter-renewal.component';
import { EncroachDetailsComponent } from './admin/quarter-component/encroach-details/encroach-details.component';
import { CourtCaseComponent } from './admin/quarter-component/court-case/court-case.component';
import { QuarterRenewalRequestComponent } from './admin/quarter-renewal-request/quarter-renewal-request.component';
import { NoDuesRequestComponent } from './admin/certificate/no-dues-request/no-dues-request.component';
import { NocMacpRequestComponent } from './admin/certificate/noc-macp-request/noc-macp-request.component';
import { FooterComponent } from './components/footer/footer.component';
import { QuarterRequestActionComponent } from './admin/quarter-request-action/quarter-request-action.component';
import { RepairMaintenanceComponent } from './repair-maintenance/repair-maintenance.component';
import { RepairMaintenanceRequestComponent } from './admin/repair-maintenance-request/repair-maintenance-request.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    TovnavComponent,
    ApplyFormComponent,
    FooterComponent,
    RepairMaintenanceComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSlideToggleModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxPrintModule
  ],
  providers: [
    AuthService,
    AuthGuardService,
    DatePipe,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
