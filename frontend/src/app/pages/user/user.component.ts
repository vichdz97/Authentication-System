import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css'],
    standalone: false
})
export class UserComponent implements OnInit {
    currentUser?: User;
    allUsers: User[] = [];
    filteredUsers: User[] = [];
    searchText: string = '';

    showUpdateModal: boolean = false;
    showDeleteModal: boolean = false;
    userToUpdate: User = <User>{};
    userToDelete: User = <User>{};

    constructor(
        private userService: UserService,
        private titleService: Title
    ) { 
        this.titleService.setTitle("Authentication System | User");
    }

    ngOnInit(): void {
        this.currentUser = this.userService.currentUser;
        this.userService.getAllUsers().subscribe({
            next: data => this.allUsers = this.userService.currentUser ? [this.userService.currentUser].concat(data.filter(user => user.id !== this.userService.currentUser?.id)) : data,
            error: () => console.error("ERROR - Could not retrieve all users"),
            complete: () => console.log("SUCCESS - All users retrieved")
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

}
