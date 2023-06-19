import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

    users!: User[];
    usersLoaded: boolean = false;

    constructor(
        private userService: UserService,
        private router: Router,
        private activeModal: NgbActiveModal
    ) { }

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe({
            next: data => this.users = data,
            error: err => console.error("ERROR - Could not retrieve users"),
            complete: () => {
                this.usersLoaded = true;
                console.log("SUCCESS - Users retrieved");
            }
        });
    }

    redirect() {
        setTimeout(() => { 
            let userID = this.users[this.users.length - 1].id;
            this.userService.getUser(userID).subscribe({
                next: res =>  {
                    this.activeModal.close();
                    this.router.navigateByUrl('/user');
                },
                error: err => console.error("ERROR - User does not exist"),
                complete: () => console.log(`SUCCESS - User #${userID} retrieved`)
            })  
        }, 1500);
    }

}
