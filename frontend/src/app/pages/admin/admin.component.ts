import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { DeleteComponent } from 'src/app/modals/delete/delete.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  btnText: string = "Show Users";
  showUserForm: boolean = false;
  showUpdateForm: boolean = false;
  allUsers?: User[];
  currentUser?: User;
  
  userForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    role: ['', [Validators.required]],
  });
  
  user?: User;
  updateName?: string;
  updatePwd!: string;
  updateRole?: string;

  req1: string = "At least 6 characters in length"
  req2: string = "At least 1 uppercase letter (A-Z)";
  req3: string = "At least 1 lowercase letter (a-z)";
  req4: string = "At least 1 number (0-9)";
  req5: string = "At least 1 valid special character (@$!%*#?&)";

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private modalService: NgbModal
    ) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(
      data => this.allUsers = data,
      err => console.error("ERROR - Could not retrieve users"),
      () => console.log("SUCCESS - Users retrieved")
    );
    this.currentUser = this.userService.currentUser;
  }

  get usernameControl(): FormControl {
    return this.userForm.get('username') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.userForm.get('password') as FormControl;
  }

  get roleControl(): FormControl {
    return this.userForm.get('role') as FormControl;
  }

  openModal(id: number) {
    const modalRef = this.modalService.open(DeleteComponent);
    modalRef.componentInstance.userID = id;
    modalRef.closed.subscribe((canDelete: boolean) => {
      if (canDelete) {
        this.deleteUser(id);
      }
    });
  }

  addUser() {
    if (this.userForm.valid) {
      let uname: string = this.usernameControl.value;
      let pwd: string = this.passwordControl.value;
      let userRole: string = this.roleControl.value;

      let newUser: User = <User> {
        username: uname,
        password: pwd,
        role: userRole
      };

      this.userService.createUser(newUser).subscribe(
        res => {
          this.displayUserForm();
          this.ngOnInit();
        },
        err => console.error("ERROR - Unable to create user"),
        () => console.log("SUCCESS - New user created")
      );
    }
    else {
      console.warn("Fill out all missing fields");
      this.userForm.markAllAsTouched();
    }
  }

  deleteUser(id: number) {
    if (id === this.currentUser?.id) {
      this.userService.deleteUser(id).subscribe(
        res => this.router.navigateByUrl('/home'),
        err => console.error("ERROR - Could not delete user"),
        () => console.log("SUCCESS - User deleted")
      );
    }
    else {
      this.userService.deleteUser(id).subscribe(
        res => this.ngOnInit(),
        err => console.error("ERROR - Could not delete user"),
        () => console.log("SUCCESS - User deleted")
      );
    }
  }

  updateUser() {
    let updatedUser: User = <User>{
      ...this.user,
      username: this.updateName != '' ? this.updateName : this.user?.username,
      password: this.updatePwd != '' ? this.updatePwd : this.user?.password,
      role: this.updateRole != '' ? this.updateRole : this.user?.role
    };

    if (updatedUser.id === this.currentUser?.id) {
      this.userService.updateCurrentUser(updatedUser).subscribe(
        res => {
          this.showUpdateForm = false;
          this.ngOnInit();
        },
        err => console.error("ERROR - Could not update user"),
        () => console.log("SUCCESS - User updated")
      );
    }
    else {
      this.userService.updateUser(updatedUser).subscribe(
        res => {
          this.showUpdateForm = false;
          this.ngOnInit();
        },
        err => console.error("ERROR - Could not update user"),
        () => console.log("SUCCESS - User updated")
      );
    }
  }

  displayUserForm() {
    this.showUserForm = !this.showUserForm;
    this.userForm.reset();
  }

  displayUpdateForm(user: User) {
    this.showUpdateForm = !this.showUpdateForm;
    this.user = user;
    this.updateName = '';
    this.updatePwd = '';
    this.updateRole = '';
  }

  displayTable() {
    this.btnText = this.btnText === "Show Users" ? this.btnText = "Hide Users" : this.btnText = "Show Users";
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
    return str.match(/^.*[@$!%*#?&].*$/);
  }

  matchAll(str: string) {
    return str.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{6,}$/);
  }

}