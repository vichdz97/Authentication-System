import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
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
    @Input() currentUser?: User;
    allUsers?: User[];
    user?: User;
    errorMessage: string = '';
    updateUserForm = this.fb.group({
        updatedName: '',
        updatedPassword: '',
        updatedRole: '',
    });

    req1: string = "At least 6 characters"
    req2: string = "At least 1 uppercase letter";
    req3: string = "At least 1 lowercase letter";
    req4: string = "At least 1 number";
    req5: string = "At least 1 special character";

    constructor(
        private fb: FormBuilder,
        public activeModal: NgbActiveModal,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.allUsers = data,
            error: err => console.error("ERROR - Could not retrieve all users"),
            complete: () => console.log("SUCCESS - All users retrieved")
        });

        this.userService.getUserToModify(this.userID).subscribe({
            next: user => this.user = user,
            error: err => console.error("ERROR - Could not retrieve user"),
            complete: () => console.log("SUCCESS - User retrieved")
        });
    }

    get updatedNameControl(): FormControl {
        return this.updateUserForm.get('updatedName') as FormControl;
    }
    
    get updatedPasswordControl(): FormControl {
        return this.updateUserForm.get('updatedPassword') as FormControl;
    }
    
    get updatedRoleControl(): FormControl {
        return this.updateUserForm.get('updatedRole') as FormControl;
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

    updateUser() {
        let updatedUser: User = <User> {
            ...this.user,
            username: this.updatedNameControl.value ? this.updatedNameControl.value : this.user?.username,
            password: this.updatedPasswordControl.value ? this.updatedPasswordControl.value : this.user?.password,
            role: this.updatedRoleControl.value ? this.updatedRoleControl.value : this.user?.role
        };

        if (this.userWordExists(updatedUser.username, updatedUser.password)) {
            this.errorMessage = "This username and password already exists!";
            if (this.accountExists(updatedUser.username, updatedUser.password, updatedUser.role)) {
                this.errorMessage = "This account already exists!";
            }
            this.updateUserForm.reset();
        }
        else {
            this.activeModal.close(updatedUser);
        }
    }

    accountExists(uname?: string, pwd?: string, role?: string): boolean {
        let exists = false;
        this.allUsers?.forEach(user => {
            if (uname === user.username && pwd === user.password && role === user.role) {
                exists = true;
            }
        });
        return exists;
    }

    userWordExists(uname?: string, pwd?: string): boolean {
        let exists = false;
        this.allUsers?.forEach(user => {
            if (uname === user.username && pwd === user.password) {
                exists = true;
            }
        });
        return exists;
    }

    matchUpper(str: string) {
        return RegExp(/^.*[A-Z].*$/).exec(str);
    }

    matchLower(str: string) {
        return RegExp(/^.*[a-z].*$/).exec(str);
    }
    
    matchNum(str: string) {
        return RegExp(/^.*[0-9].*$/).exec(str);
    }

    matchSpecial(str: string) {
        return RegExp(/^.*[~`!@#$%^&*(){}[\]+=|\\/?<>,.:;"'_-].*$/).exec(str);
    }

    matchAll(str: string) {
        return this.updatedPasswordControl.value?.length >= 6 && this.matchUpper(str) && this.matchLower(str) && this.matchNum(str) && this.matchSpecial(str);
    }
}
