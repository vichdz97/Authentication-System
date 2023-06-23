import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { DeleteComponent } from 'src/app/modals/delete/delete.component';
import { UpdateComponent } from 'src/app/modals/update/update.component';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    allUsers!: User[];
    currentUser?: User;

    showUserForm: boolean = false;  
    errorMessage: string = '';
    successMessage: string = '';
    userForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        role: ['', [Validators.required]],
    });

    showSearch: boolean = false;
    searchText!: string;
    filteredUsers: any;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private modalService: NgbModal
    ) { }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.allUsers = data,
            error: err => console.error("ERROR - Could not retrieve users"),
            complete: () => console.log("SUCCESS - Users retrieved")
        });
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

    displayUserForm() {
        this.showUserForm = !this.showUserForm;
        this.errorMessage = '';
        this.searchText = '';
        this.userForm.reset();
        this.showSearch = false;
    }

    displaySearch() {
        this.showSearch = !this.showSearch;
        this.searchText = '';
        this.errorMessage = '';
        this.successMessage = '';
        this.showUserForm = false;
    }

    addUser() {
        let uname: string = this.usernameControl.value;
        let pwd: string = this.passwordControl.value;
        let _role: string = this.roleControl.value;

        if (this.accountExists(uname, pwd, _role)) {
            this.errorMessage = "This account already exists!";
            this.successMessage = '';
            this.userForm.reset();
        }
        else if (this.userWordExists(uname, pwd)) {
            this.errorMessage = "This username and password already exists!";
            this.successMessage = '';
            this.userForm.reset();
        }
        else {
            let newUser: User = <User> {
                username: uname,
                password: pwd,
                role: _role
            };
    
            this.userService.createUser(newUser).subscribe({
                next: res => {
                    this.successMessage = "User successfully added!";
                    this.displayUserForm();
                    this.ngOnInit();
                },
                error: err => console.error("ERROR - Unable to create user"),
                complete: () => console.log("SUCCESS - New user created")
            });
        }
    }

    accountExists(uname: string, pwd: string, role: string): boolean {
        let exists = false;
        this.allUsers.forEach(user => {
            if (uname === user.username && pwd === user.password && role === user.role) {
                exists = true;
            }
        });
        return exists;
    }

    userWordExists(uname: string, pwd: string): boolean {
        let exists = false;
        this.allUsers.forEach(user => {
            if (uname === user.username && pwd === user.password) {
                exists = true;
            }
        });
        return exists;
    }

    openDeleteModal(id: number) {
        const modalRef = this.modalService.open(DeleteComponent, { centered: true });
        modalRef.componentInstance.userID = id;
        modalRef.closed.subscribe((canDelete: boolean) => {
            if (canDelete)
                this.deleteUser(id);
        });
    }

    deleteUser(id: number) {
        this.userService.deleteUser(id).subscribe({
            next: res => id === this.currentUser?.id ? this.router.navigateByUrl('/error') : this.ngOnInit(),
            error: err => console.error("ERROR - Could not delete user"),
            complete: () => console.log("SUCCESS - User deleted")
        });
    }

    openUpdateModal(id: number) {
        const modalRef = this.modalService.open(UpdateComponent, { centered: true });
        modalRef.componentInstance.userID = id;
        modalRef.componentInstance.currentUser = this.currentUser;
        modalRef.closed.subscribe((updatedUser: User) => { 
            if (updatedUser.id)
                this.updateUser(updatedUser);
        });
    }

    updateUser(updatedUser: User) {
        if (updatedUser.id === this.currentUser?.id) {
            this.userService.updateCurrentUser(updatedUser).subscribe({
                next: res => this.ngOnInit(),
                error: err => console.error("ERROR - Could not update user"),
                complete: () => console.log("SUCCESS - User updated")
            });
        }
        else {
            this.userService.updateUser(updatedUser).subscribe({
                next: res => this.ngOnInit(),
                error: err => console.error("ERROR - Could not update user"),
                complete: () => console.log("SUCCESS - User updated")
            });
        }
    }

    searchUser() {
        this.filteredUsers = this.allUsers.map(user => {
            let id = user.id.toString();
            let username = user.username.toLowerCase();
            let password = user.password.toLowerCase();
            let role = user.role.toLowerCase();
            let searchText = this.searchText.toLowerCase();
            if (id.includes(searchText) ||
                username.includes(searchText) || 
                password.includes(searchText) || 
                role.includes(searchText)) {
                return user;
            }
            return null; 
        }).filter(user => user);
    }

    clearSearch() {
        this.searchText = '';
    }

}
