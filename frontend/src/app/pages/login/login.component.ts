import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  users!: User[];
  userID: number = 0;
  invalidMsg: string = '';

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
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
        this.invalidMsg = 'Invalid login attempt.';
        this.loginForm.reset();
      }
    }
    else {
      console.warn("Fill out all missing fields");
      this.loginForm.markAllAsTouched();
    }
  }

  accountExists(uname: string, pwd: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (uname === this.users[i].username && pwd === this.users[i].password) {
        this.userID = this.users[i].id;
        return true;
      }
    }
    return false;
  }

  redirectUser() {
    if (this.userID != 0) {
      this.userService.getUser(this.userID).subscribe(
        (user: User) => {
          switch (user.role) {
            case 'Administrator': this.router.navigateByUrl('/admin'); break;
            case 'Manager': this.router.navigateByUrl('/manager'); break;
            case 'User': this.router.navigateByUrl('/user'); break;
            default: break;
          }
        },
        err => console.error("User does not exist"),
        () => console.log("User loaded")
      );
    }
  }

}
