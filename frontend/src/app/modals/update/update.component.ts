import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
    allUsers?: User[];
    user?: User;
    errorMessage: string = '';
    updateUserForm = this.fb.group({
        updatedName: '',
        updatedPassword: '',
        updatedRole: '',
    });

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

    updateUser() {
        let updatedUser: User = <User> {
            ...this.user,
            username: this.updatedNameControl.value ? this.updatedNameControl.value : this.user?.username,
            password: this.updatedPasswordControl.value ? this.updatedPasswordControl.value : this.user?.password,
            role: this.updatedRoleControl.value ? this.updatedRoleControl.value : this.user?.role
        };

        if (this.accountExists(updatedUser.username, updatedUser.password)) {
            this.errorMessage = "This username and password already exists!";
            this.updateUserForm.reset();
        }
        else {
            this.activeModal.close(updatedUser);
        }
    }

    accountExists(uname?: string, pwd?: string) {
        let exists = false;
        this.allUsers?.forEach(user => {
            if (uname === user.username && pwd === user.password) {
                exists = true;
            }
        });
        return exists;
    }
}
