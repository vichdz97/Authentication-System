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

    deleteUser(id: number) {
        this.userService.deleteUser(id).subscribe({
            next: res => id === this.currentUser?.id ? this.router.navigateByUrl('/error') : this.ngOnInit(),
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
