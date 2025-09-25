import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.css'],
    standalone: false
})
export class DeleteComponent implements OnInit {

    @Input() userID!: number;
    name?: string;
    role?: string;

    constructor(
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
}
