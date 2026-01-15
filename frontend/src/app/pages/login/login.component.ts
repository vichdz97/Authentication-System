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
    users: User[] = [];
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
            error: () => console.error("ERROR - Could not retrieve users"),
            complete: () => {
                this.userService.currentUser = undefined;
                console.log("SUCCESS - Users retrieved");
            }
        });
    }

    get usernameControl(): FormControl {
        return this.loginForm.get('username') as FormControl;
    }

    get passwordControl(): FormControl {
        return this.loginForm.get('password') as FormControl;
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            const account = <User>{
                username: this.usernameControl.value,
                password: this.passwordControl.value
            }
            if (this.accountExists(account)) {
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

    accountExists(account: User): boolean {
        const foundAccount = this.users.find(user => user.username === account.username && user.password === account.password);
        if (foundAccount) {
            this.userID = foundAccount.id;
            return true;
        }
        return false;
    }

    redirectUser(): void {
        this.userService.getUser(this.userID).subscribe({
            next: (user: User) => {
                switch (user.role) {
                    case 'Administrator': this.router.navigate(['/admin']); break;
                    case 'Manager': this.router.navigate(['/manager']); break;
                    case 'User': this.router.navigate(['/user']); break;
                    default: this.router.navigate(['/login']);
                }
            },
            error: () => console.error("User does not exist"),
            complete: () => console.log("User loaded")
        });
    }

    hasErrors(control: FormControl): boolean {
        return control.invalid && (control.dirty || control.touched);
    }

    togglePassword(): void {
        this.hidden = !this.hidden;
    }

    openSnackBar(message: string, icon: string, color: string): void {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [color, icon, message],
            duration: 5000,
            panelClass: ['text-slate-100']
        });
    }

}
