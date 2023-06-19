import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { DeleteComponent } from 'src/app/modals/delete/delete.component';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    btnText: string = "Show User Info";
    showUpdateForm: boolean = false;
    currentUser?: User;

    user?: User;
    updateName?: string;
    updatePwd!: string;

    req1: string = "At least 6 characters"
    req2: string = "At least 1 uppercase letter";
    req3: string = "At least 1 lowercase letter";
    req4: string = "At least 1 number";
    req5: string = "At least 1 special character";

    constructor(
        private userService: UserService,
        private modalService: NgbModal,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.currentUser = this.userService.currentUser;
    }

    openModal(id: number) {
        const modalRef = this.modalService.open(DeleteComponent);
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

    updateUser() {
        let updatedUser: User = <User>{
            ...this.user,
            username: this.updateName != '' ? this.updateName : this.user?.username,
            password: this.updatePwd != '' ? this.updatePwd : this.user?.password
        };

        this.userService.updateCurrentUser(updatedUser).subscribe({
            next: res => {
                this.showUpdateForm = false;
                this.ngOnInit();
            },
            error: err => console.error("ERROR - Could not update user"),
            complete: () => console.log("SUCCESS - User updated")
        });
    }

    displayUpdateForm(user: User) {
        this.showUpdateForm = !this.showUpdateForm;
        this.user = user;
        this.updateName = '';
        this.updatePwd = '';
    }

    displayTable() {
        this.btnText = this.btnText === "Show User Info" ? this.btnText = "Hide User Info" : this.btnText = "Show User Info";
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
