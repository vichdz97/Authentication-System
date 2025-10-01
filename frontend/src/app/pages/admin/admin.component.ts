import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { SnackbarMessageComponent } from 'src/app/shared/snackbar-message/snackbar-message.component';

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
        private titleService: Title,
        private snackBar: MatSnackBar
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
        this.userForm.reset();
    }

    addUser(): void {
        let uname: string = this.usernameControl.value;
        let pwd: string = this.passwordControl.value;
        let role: string = this.roleControl.value;

        if (this.accountExists(uname, pwd, role) || this.userWordExists(uname, pwd)) {
            this.openSnackBar("These credentials already exists!", "circle-alert", "red");
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
                    this.openSnackBar("Account successfully created!", "circle-check", "green");
                    this.displayUserForm();
                    this.ngOnInit();
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
            next: res => {
                if (id === this.currentUser?.id) {
                    this.router.navigateByUrl('error');
                }
                else {
                    this.ngOnInit();
                    this.allUsers = this.allUsers.filter(user => user.id !== id);
                    this.searchUser();
                }
            },
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

    openSnackBar(message: string, icon: string, color: string) {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [icon, message],
            duration: 5000, // clears after 5 secs
            panelClass: [`bg-${color}-600`, 'text-slate-100'] // custom classes
        });
    }

}
