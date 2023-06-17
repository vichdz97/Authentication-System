import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
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
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      data => this.users = data,
      err => console.error("ERROR - Could not retrieve users"),
      () => console.log("SUCCESS - Users retrieved")
    );
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
    }
    this.signUpForm.reset();
    this.signUpForm.get('password')?.setValue('');
  }

  accountExists(uname: string, pwd: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (uname === this.users[i].username && pwd === this.users[i].password) {
        return true;
      }
    }
    return false;
  }

  createAccount(uname: string, pwd: string) {
    let newUser: User = <User>{
      username: uname,
      password: pwd,
      role: 'User'
    };

    this.userService.createUser(newUser).subscribe(
      res => {
        this.successMessage = "Account successfully created!";
      },
      err => console.error("ERROR - Could not create account"),
      () => console.log("SUCCESS - Account created")
    );
  }
}
