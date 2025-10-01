import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { SnackbarMessageComponent } from 'src/app/shared/snackbar-message/snackbar-message.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit {

    users!: User[];
    userID: number = 0;
    hidden: boolean = true;

    loginForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]]
    });

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private userService: UserService,
        private titleService: Title,
        private snackBar: MatSnackBar
    ) { 
        this.titleService.setTitle("Authentication System | Login");
    }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.users = data,
            error: err => console.error("ERROR - Could not retrieve users"),
            complete: () => console.log("SUCCESS - Users retrieved")
        });
    }

    get usernameControl(): FormControl {
        return this.loginForm.get('username') as FormControl;
    }

    get passwordControl(): FormControl {
        return this.loginForm.get('password') as FormControl;
    }

    onSubmit() {
        if (this.loginForm.valid) {
            let uname: string = this.usernameControl.value;
            let pwd: string = this.passwordControl.value;
            if (this.accountExists(uname, pwd)) {
                this.redirectUser();
            }
            else {
                this.openSnackBar("Invalid login attempt.", "circle-alert", "red");
                this.loginForm.reset();
            }
        }
        else {
            console.warn("Fill out all missing fields");
            this.loginForm.markAllAsTouched();
        }
    }

    accountExists(uname: string, pwd: string) {
        let exists = false;
        this.users.forEach(user => {
            if (uname === user.username && pwd === user.password) {
                this.userID = user.id;
                exists = true;
            }
        });
        return exists;
    }

    redirectUser() {
        if (this.userID != 0) {
            this.userService.getUser(this.userID).subscribe({
                next: (user: User) => {
                    switch (user.role) {
                        case 'Administrator': this.router.navigateByUrl('/admin'); break;
                        case 'Manager': this.router.navigateByUrl('/manager'); break;
                        case 'User': this.router.navigateByUrl('/user'); break;
                        default: break;
                    }
                },
                error: err => console.error("User does not exist"),
                complete: () => console.log("User loaded")
            });
        }
    }

    hasErrors(control: FormControl) {
        return control.invalid && (control.dirty || control.touched);
    }

    togglePassword() {
        this.hidden = !this.hidden;
    }

    openSnackBar(message: string, icon: string, color: string) {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [icon, message],
            duration: 5000, // clears after 5 secs
            panelClass: [`bg-${color}-600`, 'text-slate-100'] // custom classes
        });
    }

}
