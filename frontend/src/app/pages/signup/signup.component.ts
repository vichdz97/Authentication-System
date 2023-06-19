import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { LoadingComponent } from 'src/app/modals/loading/loading.component';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

    users!: User[];
    alertMessage: string = '';
    successMessage: string = '';

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
        private modalService: NgbModal
    ) { }

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

    passwordsMatch() {
        return this.passwordControl.value !== '' && this.passwordControl.value === this.confirmControl.value;
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

    onSubmit() {
        let uname: string = this.usernameControl.value;
        let pwd: string = this.passwordControl.value;
        if (this.accountExists(uname, pwd)) {
            this.successMessage = "";
            this.alertMessage = "Sorry! This account already exists."
        }
        else {
            this.alertMessage = "";
            this.createAccount(uname, pwd);
            this.modalService.open(LoadingComponent, { centered: true });
        }
        this.signUpForm.reset();
        this.signUpForm.get('password')?.setValue('');
    }

    accountExists(uname: string, pwd: string) {
        let exists = false;
        this.users.forEach(user => {
            if (uname === user.username && pwd === user.password) {
                exists = true;
            }
        });
        return exists;
    }

    createAccount(uname: string, pwd: string) {
        let newUser: User = <User> {
            username: uname,
            password: pwd,
            role: 'User'
        };

        this.userService.createUser(newUser).subscribe({
            next: res => {
                this.successMessage = "Account successfully created!";
                this.ngOnInit();
            },
            error: err => console.error("ERROR - Could not create account"),
            complete: () => console.log("SUCCESS - Account created")
        });
    }
    
}
