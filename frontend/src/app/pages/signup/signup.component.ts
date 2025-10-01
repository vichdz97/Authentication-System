import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { SnackbarMessageComponent } from 'src/app/shared/snackbar-message/snackbar-message.component';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    standalone: false
})
export class SignupComponent implements OnInit {

    users!: User[];
    newUser: User = <User> { role: 'User' };

    signUpForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirm: ['', [Validators.required]]
    });

    req1: string = "At least 6 characters"
    req2: string = "At least 1 uppercase letter";
    req3: string = "At least 1 lowercase letter";
    req4: string = "At least 1 number";
    req5: string = "At least 1 special character";

    hidden: boolean = true;
    hidden2: boolean = true;
  
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private titleService: Title,
        private snackBar: MatSnackBar
    ) { 
        this.titleService.setTitle("Authentication System | Sign Up");
    }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.users = data,
            error: err => console.error("ERROR - Could not retrieve users"),
            complete: () => console.log("SUCCESS - Users retrieved")
        });
    }

    get usernameControl(): FormControl {
        return this.signUpForm.get('username') as FormControl;
    }

    get passwordControl(): FormControl {
        return this.signUpForm.get('password') as FormControl;
    }

    get confirmControl(): FormControl {
        return this.signUpForm.get('confirm') as FormControl;
    }

    onSubmit() {
        let uname: string = this.usernameControl.value;
        let pwd: string = this.passwordControl.value;
        if (this.accountExists(uname, pwd)) {
            this.openSnackBar("This account already exists!", "circle-alert", "red");
        }
        else {
            this.createAccount(uname, pwd);
        }
        this.signUpForm.reset();
        this.signUpForm.get('password')?.setValue('');
    }

    accountExists(uname: string, pwd: string) {
        return this.users.some(user => user.username.match(uname) && user.password.match(pwd));
    }

    createAccount(uname: string, pwd: string) {
        this.newUser = {
            ...this.newUser,
            username: uname,
            password: pwd,
            hiddenPwd: true
        };

        this.userService.createUser(this.newUser).subscribe({
            next: res => {
                this.openSnackBar("Account successfully created!", "circle-check", "green");
                this.ngOnInit();
            },
            error: err => console.error("ERROR - Could not create account"),
            complete: () => console.log("SUCCESS - Account created")
        });
    }

    togglePassword() {
        this.hidden = !this.hidden;
    }

    togglePassword2() {
        this.hidden2 = !this.hidden2;
    }

    hasErrors(control: FormControl) {
        return control.invalid && (control.dirty || control.touched);
    }

    passwordsMatch() {
        return this.passwordControl.value !== '' && this.passwordControl.value === this.confirmControl.value;
    }

    matchUpper(str: string) {
        return str.match(/^.*[A-Z].*$/);
    }

    matchLower(str: string) {
        return str.match(/^.*[a-z].*$/);
    }
    
    matchNum(str: string) {
        return str.match(/^.*[0-9].*$/);
    }

    matchSpecial(str: string) {
        return str.match(/^.*[~`!@#$%^&*(){}[\]+=|\\/?<>,.:;"'_-].*$/);
    }

    matchAll(str: string) {
        return this.matchUpper(str) && this.matchLower(str) && this.matchNum(str) && this.matchSpecial(str);
    }

    openSnackBar(message: string, icon: string, color: string) {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [icon, message],
            duration: 5000, // clears after 5 secs
            panelClass: [`bg-${color}-600`, 'text-slate-100'] // custom classes
        });
    }
    
}
