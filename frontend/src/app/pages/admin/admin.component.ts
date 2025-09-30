import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: false
})
export class AdminComponent implements OnInit {

    allUsers!: User[];
    currentUser?: User;

    showUserForm: boolean = false;  
    errorMessage?: string;
    successMessage?: string;
    userForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        role: ['', [Validators.required]],
    });

    searchText!: string;
    filteredUsers: any;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
        private titleService: Title
    ) { 
        this.titleService.setTitle("Authentication System | Administrator");
    }

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

    displayUserForm(): void {
        this.showUserForm = !this.showUserForm;
        this.errorMessage = '';
        this.successMessage = '';
        this.searchText = '';
        this.userForm.reset();
    }

    addUser(): void {
        let uname: string = this.usernameControl.value;
        let pwd: string = this.passwordControl.value;
        let role: string = this.roleControl.value;

        if (this.accountExists(uname, pwd, role)) {
            this.errorMessage = "This account already exists!";
            this.successMessage = '';
            this.userForm.reset();
        }
        else if (this.userWordExists(uname, pwd)) {
            this.errorMessage = "These credentials already exists!";
            this.successMessage = '';
            this.userForm.reset();
        }
        else {
            let newUser: User = <User> {
                username: uname,
                password: pwd,
                role,
                hiddenPwd: true
            };
    
            this.userService.createUser(newUser).subscribe({
                next: res => {
                    this.displayUserForm();
                    this.ngOnInit();
                    this.successMessage = "User successfully added!";
                },
                error: err => console.error("ERROR - Unable to create user"),
                complete: () => console.log("SUCCESS - New user created")
            });
        }
    }

    accountExists(uname: string, pwd: string, role: string): boolean {
        return this.allUsers.some(user => user.username.match(uname) && user.password.match(pwd) && user.role.match(role));
    }

    userWordExists(uname: string, pwd: string): boolean {
        return this.allUsers.some(user => user.username.match(uname) && user.password.match(pwd));
    }

    deleteUser(id: number): void {
        this.userService.deleteUser(id).subscribe({
            next: res => id === this.currentUser?.id ? this.router.navigateByUrl('/error') : this.ngOnInit(),
            error: err => console.error("ERROR - Could not delete user"),
            complete: () => console.log("SUCCESS - User deleted")
        });
    }

    updateUser(updatedUser: User): void {
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

    searchUser(): boolean | User[] {
        if (this.searchText) {
            this.filteredUsers = this.allUsers.filter(user => {
                const id = user.id.toString();
                const username = user.username.toLowerCase();
                const password = user.password.toLowerCase();
                const role = user.role.toLowerCase();
                const searchText = this.searchText.toLowerCase();
                return id.includes(searchText) || username.includes(searchText) || password.includes(searchText) || role.includes(searchText);
            });
        }
        return this.allUsers;
    }

    clearSearch(): void {
        this.searchText = '';
    }

    togglePassword(user: User): void {
        user.hiddenPwd = !user.hiddenPwd;
    }

}
