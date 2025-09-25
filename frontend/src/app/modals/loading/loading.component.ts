import { Component, Input, OnInit } from '@angular/core';
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

    @Input() newUser!: User;
    users!: User[];

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
                console.log("SUCCESS - Users retrieved");
                this.redirect();
            }
        });
    }

    redirect() {
        setTimeout(() => { 
            this.users.forEach(user => {
                if (user.username === this.newUser.username && user.password === this.newUser.password) {
                    this.userService.getUser(user.id).subscribe({
                        next: res =>  {
                            this.activeModal.close();
                            this.router.navigateByUrl('/user');
                        },
                        error: err => console.error("ERROR - User does not exist"),
                        complete: () => console.log(`SUCCESS - User #${user.id} retrieved`)
                    })
                }
            });  
        }, 1500);
    }

}
