import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { UserService } from './services/user.service';
import { AdminComponent } from './pages/admin/admin.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { UserComponent } from './pages/user/user.component';
import { GuestComponent } from './pages/guest/guest.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ErrorComponent } from './pages/error/error.component';
import { InlineErrorComponent } from './shared/inline-error/inline-error.component';
import { HelpComponent } from './modals/help/help.component';
import { LogoutComponent } from './modals/logout/logout.component';
import { DeleteComponent } from './modals/delete/delete.component';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminComponent,
    NavbarComponent,
    ManagerComponent,
    UserComponent,
    GuestComponent,
    SignupComponent,
    ErrorComponent,
    InlineErrorComponent,
    HelpComponent,
    LogoutComponent,
    DeleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  providers: [UserService, AuthGuard,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
