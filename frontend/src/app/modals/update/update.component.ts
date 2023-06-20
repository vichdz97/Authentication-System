import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

    @Input() userID!: number;
    user?: User;
    updatedName?: string;
    updatedPassword?: string;
    updatedRole?: string;

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userService.getUserToModify(this.userID).subscribe({
            next: user => this.user = user,
            error: err => console.error("ERROR - Could not retrieve user"),
            complete: () => console.log("SUCCESS - User retrieved")
        });
    }

    updateUser() {
        let updatedUser: User = <User> {
            ...this.user,
            username: this.updatedName ? this.updatedName : this.user?.username,
            password: this.updatedPassword ? this.updatedPassword : this.user?.password,
            role: this.updatedRole ? this.updatedRole : this.user?.role
        };
        this.activeModal.close(updatedUser);
    }
}
