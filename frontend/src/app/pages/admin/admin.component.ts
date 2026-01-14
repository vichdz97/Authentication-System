import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
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
    currentUser?: User;
    allUsers: User[] = [];
    filteredUsers: User[] = [];
    searchText: string = '';

    showUpdateModal: boolean = false;
    showDeleteModal: boolean = false;
    userToUpdate: User = <User>{};
    userToDelete: User = <User>{};

    showUserForm: boolean = false;  
    userForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        role: ['', [Validators.required]],
    });

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private titleService: Title,
        private snackBar: MatSnackBar
    ) { 
        this.titleService.setTitle("Authentication System | Administrator");
    }

    ngOnInit(): void {
        this.currentUser = this.userService.currentUser;
        this.userService.getAllUsers().subscribe({
            next: data => this.allUsers = this.userService.currentUser ? [this.userService.currentUser].concat(data.filter(user => user.id !== this.userService.currentUser?.id)) : data,
            error: () => console.error("ERROR - Could not retrieve users"),
            complete: () => console.log("SUCCESS - Users retrieved")
        });
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
            this.openSnackBar("These credentials already exist!", "circle-alert", "red");
        }
        else {
            let newUser: User = <User>{
                username: uname,
                password: pwd,
                role,
                hiddenPwd: true
            };
    
            this.userService.createUser(newUser).subscribe({
                next: () => {
                    this.displayUserForm();
                    this.openSnackBar("Account successfully created!", "circle-check", "blue");
                },
                error: () => console.error("ERROR - Unable to create user"),
                complete: () => {
                    console.log("SUCCESS - New user created");
                    this.ngOnInit();
                }
            });
        }
    }

    accountExists(uname: string, pwd: string, role: string): boolean {
        return this.allUsers.some(user => user.username.match(uname) && user.password.match(pwd) && user.role.match(role));
    }

    userWordExists(uname: string, pwd: string): boolean {
        return this.allUsers.some(user => user.username.match(uname) && user.password.match(pwd));
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

    toggleUpdateModal(user?: User): void {
        this.showUpdateModal = !this.showUpdateModal;
        if (this.showUpdateModal && user ) this.userToUpdate = user;
        this.ngOnInit();
    }

    toggleDeleteModal(user?: User): void {
        this.showDeleteModal = !this.showDeleteModal;
        if (this.showDeleteModal && user) this.userToDelete = user;
        this.ngOnInit();
    }

    stopPropagation(e: Event): void {
        e.stopPropagation();
    }

    openSnackBar(message: string, icon: string, color: string) {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [color, icon, message],
            duration: 5000,
            panelClass: ['text-slate-100']
        });
    }

}
