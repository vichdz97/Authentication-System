import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-inline-error',
    templateUrl: './inline-error.component.html',
    styleUrls: ['./inline-error.component.css']
})
export class InlineErrorComponent {

  @Input() control!: FormControl;

}
