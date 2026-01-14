import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { SnackbarMessageComponent } from 'src/app/shared/snackbar-message/snackbar-message.component';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css'],
    standalone: false
})
export class LoadingComponent implements OnInit {
    @Input() users: User[] = [];

    constructor(
        private userService: UserService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        setTimeout(() => { 
            const allAccounts: User[] = this.users;
            const newAccount: User = allAccounts.pop() ?? <User>{};
            this.userService.getUser(newAccount.id).subscribe({
                next: (user: User) => {
                    switch (user.role) {
                        case 'Administrator': this.router.navigate(['/admin']); break;
                        case 'Manager': this.router.navigate(['/manager']); break;
                        case 'User': this.router.navigate(['/user']); break;
                        default: this.router.navigate(['/login']);
                    }
                },
                error: () => console.error("User does not exist"),
                complete: () => {
                    this.openSnackBar("Account successfully created!", "circle-check", "blue");
                    console.log("User loaded");
                }
            });
        }, 1500);
    }

    openSnackBar(message: string, icon: string, color: string): void {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [color, icon, message],
            duration: 5000,
            panelClass: ['text-slate-100']
        });
    }
}
