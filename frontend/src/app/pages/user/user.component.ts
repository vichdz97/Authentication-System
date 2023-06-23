import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { DeleteComponent } from 'src/app/modals/delete/delete.component';
import { UpdateComponent } from 'src/app/modals/update/update.component';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    allUsers!: User[];
    currentUser?: User;

    searchText: string = '';
    filteredUsers: any;

    constructor(
        private userService: UserService,
        private modalService: NgbModal,
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

    openDeleteModal(id: number) {
        const modalRef = this.modalService.open(DeleteComponent, { centered: true });
        modalRef.componentInstance.userID = id;
        modalRef.closed.subscribe((userDeleted: boolean) => {
            if (userDeleted) {
                this.deleteUser(id);
            }
        });
    }
  
    deleteUser(id: number) {
        this.userService.deleteUser(id).subscribe({
            next: res => this.router.navigateByUrl('/error'),
            error: err => console.error("ERROR - Could not delete user"),
            complete: () => console.log("SUCCESS - User deleted")
        });
    }

    openUpdateModal(id: number) {
        const modalRef = this.modalService.open(UpdateComponent, { centered: true });
        modalRef.componentInstance.userID = id;
        modalRef.closed.subscribe((updatedUser: User) => {
            if (updatedUser.id) {
                this.updateUser(updatedUser);
            }
        });
    }

    updateUser(updatedUser: User) {
        this.userService.updateCurrentUser(updatedUser).subscribe({
            next: res => this.ngOnInit(),
            error: err => console.error("ERROR - Could not update user"),
            complete: () => console.log("SUCCESS - User updated")
        });
    }

    searchUsers() {
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
