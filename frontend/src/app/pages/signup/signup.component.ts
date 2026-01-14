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
    users: User[] = [];
    showLoadingModal: boolean = false;

    signUpForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirm: ['', [Validators.required]]
    });

    pwdReqs: { message: string, check: (str: string) => boolean | RegExpMatchArray }[] = [
        { message: "At least 6 characters", check: (value: string) => value?.length >= 6 },
        { message: "At least 1 uppercase letter", check: this.matchUpper },
        { message: "At least 1 lowercase letter", check: this.matchLower },
        { message: "At least 1 number", check: this.matchNum },
        { message: "At least 1 special character", check: this.matchSpecial },
    ];

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
            error: () => console.error("ERROR - Could not retrieve users"),
            complete: () => {
                this.userService.currentUser = undefined;
                console.log("SUCCESS - Users retrieved");
            }
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

    onSubmit(): void {
        const account = <User>{
            username: this.usernameControl.value,
            password: this.passwordControl.value
        };
        if (this.accountExists(account)) {
            this.openSnackBar("This account already exists!", "circle-alert", "red");
        }
        else {
            this.createAccount(account);
        }
        this.signUpForm.reset();
        this.signUpForm.get('password')?.setValue('');
    }

    accountExists(account: User): boolean {
        return this.users.some(user => user.username.match(account.username) && user.password.match(account.password));
    }

    createAccount(account: User): void {
        const newUser: User = {
            ...account,
            role: "User",
            hiddenPwd: true
        };

        this.userService.createUser(newUser).subscribe({
            next: () => {
                this.ngOnInit();
                this.showLoadingModal = true;
            },
            error: () => console.error("ERROR - Could not create account"),
            complete: () => console.log("SUCCESS - Account created")
        });
    }

    togglePassword(): void {
        this.hidden = !this.hidden;
    }

    togglePassword2(): void {
        this.hidden2 = !this.hidden2;
    }

    hasErrors(control: FormControl): boolean {
        return control.invalid && (control.dirty || control.touched);
    }

    passwordsMatch(): boolean {
        return this.passwordControl.value !== '' && this.passwordControl.value === this.confirmControl.value;
    }

    matchUpper(str: string): RegExpMatchArray {
        return str.match(/^.*[A-Z].*$/)!;
    }

    matchLower(str: string): RegExpMatchArray {
        return str.match(/^.*[a-z].*$/)!;
    }
    
    matchNum(str: string): RegExpMatchArray {
        return str.match(/^.*[0-9].*$/)!;
    }

    matchSpecial(str: string): RegExpMatchArray {
        return str.match(/^.*[~`!@#$%^&*(){}[\]+=|\\/?<>,.:;"'_-].*$/)!;
    }

    matchAll(str: string): RegExpMatchArray {
        return this.matchUpper(str) && this.matchLower(str) && this.matchNum(str) && this.matchSpecial(str);
    }

    openSnackBar(message: string, icon: string, color: string): void {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [color, icon, message],
            duration: 5000,
            panelClass: ['text-slate-100']
        });
    }
    
}
