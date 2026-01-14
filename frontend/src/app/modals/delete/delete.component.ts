import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { SnackbarMessageComponent } from 'src/app/shared/snackbar-message/snackbar-message.component';

@Component({
    selector: 'app-delete',
    templateUrl: './delete.component.html',
    styleUrls: ['./delete.component.css'],
    standalone: false
})
export class DeleteComponent implements OnInit {
    @Input() currentUser?: User;
    @Input() user: User = <User>{};
    @Output() dataEvent = new EventEmitter<any>();

    allUsers: User[] = [];
    name: string = '';
    role: string = '';

    constructor(
        private userService: UserService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.allUsers = data,
            error: () => console.error("ERROR - Could not retrieve users"),
            complete: () => console.log("SUCCESS - Users retrieved")
        });

        this.user && this.userService.getUserToModify(this.user.id).subscribe({
            next: user => {
                this.name = user.username;
                this.role = user.role;
            },
            error: () => console.error("ERROR - Could not retrieve user"),
            complete: () => console.log("SUCCESS - User retrieved")
        });
    }

    deleteUser(id: number): void {
        this.userService.deleteUser(id).subscribe({
            next: () => {
                if (id === this.currentUser?.id) {
                    this.router.navigateByUrl('/error');
                }
                else {
                    this.allUsers = this.allUsers.filter(user => user.id !== id);
                    this.closeModal();
                }
                this.openSnackBar("Account successfully deleted!", "circle-check", "blue");
            },
            error: () => console.error("ERROR - Could not delete user"),
            complete: () => console.log("SUCCESS - User deleted")
        });
    }

    closeModal(): void {
        this.dataEvent.emit();
    }

    openSnackBar(message: string, icon: string, color: string) {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [color, icon, message],
            duration: 5000,
            panelClass: ['text-slate-100']
        });
    }
}
