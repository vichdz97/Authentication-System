import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

    @Input() userID!: number;
    name?: string;
    role?: string;

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userService.getUserToModify(this.userID).subscribe({
            next: user => {
                this.name = user.username;
                this.role = user.role;
            },
            error: err => console.error("ERROR - Could not retrieve user"),
            complete: () => console.log("SUCCESS - User retrieved")
        });
    }

    deleteUser() {
        this.activeModal.close(true);
    }

}
