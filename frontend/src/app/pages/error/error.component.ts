import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent {

    constructor(private titleService: Title) {
        this.titleService.setTitle("Authentication System | 404 Page Not Found");
    }
    
}
