import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-manager',
    templateUrl: './manager.component.html',
    styleUrls: ['./manager.component.css'],
    standalone: false
})
export class ManagerComponent implements OnInit {

    allUsers!: User[];
    currentUser?: User;

    searchText: string = '';
    filteredUsers: any;

    constructor(
        private userService: UserService,
        private router: Router,
        private titleService: Title
    ) { 
        this.titleService.setTitle("Authentication System | Manager");
    }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.allUsers = data,
            error: err => console.error("ERROR - Could not display users"),
            complete:() => console.log("SUCCESS - Users displayed")
        });
        this.currentUser = this.userService.currentUser;
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
        this.userService.updateCurrentUser(updatedUser).subscribe({
            next: res => this.ngOnInit(),
            error: err => console.error("ERROR - Could not update user"),
            complete: () => console.log("SUCCESS - User updated")
        });
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

    clearSearch() {
        this.searchText = '';
    }

    togglePassword(user: User): void {
        user.hiddenPwd = !user.hiddenPwd;
    }

}
