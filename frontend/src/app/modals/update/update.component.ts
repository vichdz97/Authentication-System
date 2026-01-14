import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';
import { SnackbarMessageComponent } from 'src/app/shared/snackbar-message/snackbar-message.component';

@Component({
    selector: 'app-update',
    templateUrl: './update.component.html',
    styleUrls: ['./update.component.css'],
    standalone: false
})
export class UpdateComponent implements OnInit {
    @Input() currentUser?: User;
    @Input() user: User | null = null;
    @Output() dataEvent = new EventEmitter<any>();
    
    allUsers: User[] = [];

    updateUserForm = this.fb.group({
        updatedName: '',
        updatedPassword: '',
        updatedRole: '',
    });

    pwdReqs: { message: string, check: (str: string) => boolean | RegExpMatchArray }[] = [
        { message: "At least 6 characters", check: (value: string) => value?.length >= 6 },
        { message: "At least 1 uppercase letter", check: this.matchUpper },
        { message: "At least 1 lowercase letter", check: this.matchLower },
        { message: "At least 1 number", check: this.matchNum },
        { message: "At least 1 special character", check: this.matchSpecial },
    ];

    constructor(
        private fb: UntypedFormBuilder,
        private userService: UserService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.allUsers = data,
            error: () => console.error("ERROR - Could not retrieve all users"),
            complete: () => console.log("SUCCESS - All users retrieved")
        });
    }

    get updatedNameControl(): UntypedFormControl {
        return this.updateUserForm.get('updatedName') as UntypedFormControl;
    }
    
    get updatedPasswordControl(): UntypedFormControl {
        return this.updateUserForm.get('updatedPassword') as UntypedFormControl;
    }
    
    get updatedRoleControl(): UntypedFormControl {
        return this.updateUserForm.get('updatedRole') as UntypedFormControl;
    }

    disableUpdateBtn(): boolean {
        if (this.currentUser?.role === 'Administrator') {
            return (!this.updatedNameControl.value && !this.updatedPasswordControl.value && !this.updatedRoleControl.value) ||
            (this.updatedNameControl.value === this.user?.username) ||
            (this.updatedPasswordControl.value === this.user?.password);
        }
        return (!this.updatedNameControl.value && !this.updatedPasswordControl.value) || 
        (this.updatedPasswordControl.value && !this.matchAll(this.updatedPasswordControl.value)) || 
        (this.updatedNameControl.value === this.user?.username) ||
        (this.updatedPasswordControl.value === this.user?.password);
    }

    accountExists(uname?: string, pwd?: string, role?: string): boolean {
        return this.allUsers?.some(user => uname === user.username && pwd === user.password && role === user.role);
    }

    userWordExists(uname?: string, pwd?: string): boolean {
        return this.allUsers?.some(user => uname === user.username && pwd === user.password);
    }

    updateUser(): void {
        let updatedUser: User = <User> {
            ...this.user,
            username: this.updatedNameControl.value ? this.updatedNameControl.value : this.user?.username,
            password: this.updatedPasswordControl.value ? this.updatedPasswordControl.value : this.user?.password,
            role: this.updatedRoleControl.value ? this.updatedRoleControl.value : this.user?.role
        };

        if (this.accountExists(updatedUser.username, updatedUser.password, updatedUser.role) || this.userWordExists(updatedUser.username, updatedUser.password)) {
            this.openSnackBar("These credentials already exist!", "circle-alert", "red");
            this.updateUserForm.reset();
        }
        else {
            this.submitUpdatedUser(updatedUser);
        }
    }

    submitUpdatedUser(updatedUser: User): void {
        if (updatedUser.id === this.currentUser?.id) {
            this.userService.updateCurrentUser(updatedUser).subscribe({
                next: () => {
                    this.openSnackBar("User successfully updated!", "circle-check", "blue");
                    this.closeModal();
                },
                error: () => console.error("ERROR - Could not update user"),
                complete: () => console.log("SUCCESS - User updated")
            });
        }
        else {
            this.userService.updateUser(updatedUser).subscribe({
                next: () => {
                    this.openSnackBar("User successfully updated!", "circle-check", "blue");
                    this.closeModal();
                },
                error: () => console.error("ERROR - Could not update user"),
                complete: () => console.log("SUCCESS - User updated")
            });
        }
    }

    matchUpper(str: string): RegExpMatchArray {
        return str.match(/^.*[A-Z].*$/)!;
    }

    matchLower(str: string): RegExpMatchArray {
        return str.match(/^.*[a-z].*$/)!;
    }
    
    matchNum(str: string): RegExpMatchArray {
        return str.match(/^.*[0-9].*$/)!;
    }

    matchSpecial(str: string): RegExpMatchArray {
        return str.match(/^.*[~`!@#$%^&*(){}[\]+=|\\/?<>,.:;"'_-].*$/)!;
    }

    matchAll(str: string): boolean | RegExpMatchArray {
        return this.updatedPasswordControl.value?.length >= 6 && this.matchUpper(str) && this.matchLower(str) && this.matchNum(str) && this.matchSpecial(str);
    }

    closeModal(): void {
        this.dataEvent.emit();
    }

    openSnackBar(message: string, icon: string, color: string): void {
        this.snackBar.openFromComponent(SnackbarMessageComponent, {
            data: [color, icon, message],
            duration: 5000,
            panelClass: ['text-slate-100']
        });
    }
}
