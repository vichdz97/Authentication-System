import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { UserComponent } from './pages/user/user.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ErrorComponent } from './pages/error/error.component';
import { InlineErrorComponent } from './shared/inline-error/inline-error.component';
import { LogoutComponent } from './modals/logout/logout.component';
import { DeleteComponent } from './modals/delete/delete.component';
import { LoadingComponent } from './modals/loading/loading.component';
import { UpdateComponent } from './modals/update/update.component';
import { SnackbarMessageComponent } from './shared/snackbar-message/snackbar-message.component';

import { 
    LucideAngularModule, 
    Eye, 
    EyeClosed, 
    Check, 
    X, 
    CircleAlert, 
    Search, 
    SquarePen, 
    Trash2, 
    Plus, 
    CircleCheck, 
    ShieldUser,
    ShieldAlert
} from 'lucide-angular';

@NgModule({ 
    declarations: [
        AppComponent,
        LoginComponent,
        AdminComponent,
        NavbarComponent,
        ManagerComponent,
        UserComponent,
        SignupComponent,
        ErrorComponent,
        InlineErrorComponent,
        LogoutComponent,
        DeleteComponent,
        LoadingComponent,
        UpdateComponent,
        SnackbarMessageComponent
    ],
    bootstrap: [AppComponent], 
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        LucideAngularModule.pick({
            Eye, 
            EyeClosed, 
            Check, 
            X, 
            CircleAlert, 
            Search, 
            SquarePen, 
            Trash2, 
            Plus,
            CircleCheck, 
            ShieldUser,
            ShieldAlert
        })
    ], 
    providers: [
        UserService, 
        AuthGuard,
        { provide: LocationStrategy, useClass: HashLocationStrategy }, 
        provideHttpClient(withInterceptorsFromDi())
    ] 
})
export class AppModule { }
