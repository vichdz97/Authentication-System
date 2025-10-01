import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    standalone: false
})
export class UserComponent implements OnInit {

    allUsers!: User[];
    currentUser?: User;

    searchText: string = '';
    filteredUsers: any;

    constructor(
        private userService: UserService,
        private router: Router,
        private titleService: Title
    ) { 
        this.titleService.setTitle("Authentication System | User");
    }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.allUsers = data,
            error: err => console.error("ERROR - Could not retrieve all users"),
            complete: () => console.log("SUCCESS - All users retrieved")
        });
        this.currentUser = this.userService.currentUser;
    }
  
    deleteUser(id: number) {
        this.userService.deleteUser(id).subscribe({
            next: res => this.router.navigateByUrl('/error'),
            error: err => console.error("ERROR - Could not delete user"),
            complete: () => console.log("SUCCESS - User deleted")
        });
    }

    updateUser(updatedUser: User) {
        this.userService.updateCurrentUser(updatedUser).subscribe({
            next: res => this.ngOnInit(),
            error: err => console.error("ERROR - Could not update user"),
            complete: () => console.log("SUCCESS - User updated")
        });
    }

    searchUsers(): boolean | User[] {
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
