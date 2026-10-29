import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuardService as AuthGuard } from "./auth/auth-gaurd.service";
import { ApplyFormComponent } from './apply-form/apply-form.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { RenewalFormComponent } from './renewal-form/renewal-form.component';
import { DepartmentComponent } from './department/department.component';
import { LocationComponent } from './admin/location/location.component';
import { QuarterComponent } from './admin/quarter/quarter.component';
import { SectorComponent } from './admin/sector/sector.component';
import { QuarterRequestComponent } from './admin/quarter-request/quarter-request.component';
import { NocComponent } from './apply-certificate/noc/noc.component';
import { NoAccomodationComponent } from './apply-certificate/no-accomodation/no-accomodation.component';
import { NoDuesComponent } from './apply-certificate/no-dues/no-dues.component';
import { NocPromotionComponent } from './apply-certificate/noc-promotion/noc-promotion.component';
import { NoDuesPensionComponent } from './apply-certificate/no-dues-pension/no-dues-pension.component';
import { NocPromotionComponent as adminNocPromotionComponent} from './admin/certificate/noc-promotion/noc-promotion.component';
import { NoDuesPensionComponent as adminNoDuesPensionComponent} from './admin/certificate/no-dues-pension/no-dues-pension.component';
import { NoDuesRequestComponent as adminNoDuesRequestComponent} from './admin/certificate/no-dues-request/no-dues-request.component';
import { NoAccomodationComponent as adminNoAccomodationComponent } from './admin/certificate/no-accomodation/no-accomodation.component';
import { NocMacpRequestComponent as adminNocMacpRequestComponent } from './admin/certificate/noc-macp-request/noc-macp-request.component';
import { OnlineApplicationComponent } from './admin/quarter-component/online-application/online-application.component';
import { QuarterRenewalComponent } from './admin/quarter-component/quarter-renewal/quarter-renewal.component';
import { EncroachDetailsComponent } from './admin/quarter-component/encroach-details/encroach-details.component';
import { CourtCaseComponent } from './admin/quarter-component/court-case/court-case.component';
import { QuarterAllotmentListComponent } from './admin/quarter-component/quarter-allotment-list/quarter-allotment-list.component';
import { QuarterRenewalRequestComponent } from './admin/quarter-renewal-request/quarter-renewal-request.component';
import { QuarterRequestActionComponent } from './admin/quarter-request-action/quarter-request-action.component';
import { RepairMaintenanceComponent } from './repair-maintenance/repair-maintenance.component';
import { RepairMaintenanceRequestComponent } from './admin/repair-maintenance-request/repair-maintenance-request.component';
import { QuarterDeleteRequestComponent } from './admin/quarter-delete-request/quarter-delete-request.component';
import { EncroachmentDeleteRequestComponent } from './admin/encroachment-delete-request/encroachment-delete-request.component';
import { SatelliteImagesComponent } from './admin/satellite-images/satellite-images.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },

  //  ############### admin routes ###############
  {
    path: "department",
    component: DepartmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter/quarter-details",
    component: QuarterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter/location",
    component: LocationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter/sector",
    component: SectorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter/satellite-images",
    component: SatelliteImagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter-request",
    component: QuarterRequestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter-delete-requests",
    component: QuarterDeleteRequestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "encroachment-delete-requests",
    component: EncroachmentDeleteRequestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "renewal-of-quarter-details/:id",
    component: QuarterRenewalRequestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter-request-action/:id",
    component: QuarterRequestActionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "repair_maintenance_request",
    component: RepairMaintenanceRequestComponent,
    canActivate: [AuthGuard]
  },

  //  ############### admin routes ###############
  //  *************** Application request ***************
  {
    path: "noc-promotion-request",
    component: adminNocPromotionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "no-dues-pension-request",
    component: adminNoDuesPensionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "no-dues-request",
    component: adminNoDuesRequestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "noc-macp-request",
    component: adminNocMacpRequestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "non-accomodation-request",
    component: adminNoAccomodationComponent,
    canActivate: [AuthGuard]
  },

  
  //  ############### admin routes ###############
  //  *************** Quarter routes ***************

  
  // {
  //   path: "quarter/online-applicants",
  //   component: OnlineApplicationComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: "quarter/list-of-quarter-allotted",
    component: QuarterAllotmentListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter/Renewal-of-quarters",
    component: QuarterRenewalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter/Details-of-encroachment",
    component: EncroachDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "quarter/Court-cases",
    component: CourtCaseComponent,
    canActivate: [AuthGuard]
  },


  //user routes  
  {
    path: "register",
    component: RegisterComponent
  },
  {
    path: "apply-quarter",
    component: ApplyFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "renewal-quarter",
    component: RenewalFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "repair_maintenance",
    component: RepairMaintenanceComponent,
    canActivate: [AuthGuard]
  },


  {
    path: "noc-macp",
    component: NocComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path: "noc-promotion",
    component: NocPromotionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "non-accomodation",
    component: NoAccomodationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "no-dues",
    component: NoDuesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "no-dues-pension",
    component: NoDuesPensionComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
