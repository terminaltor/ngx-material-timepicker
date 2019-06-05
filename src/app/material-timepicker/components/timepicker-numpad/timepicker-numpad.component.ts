import { AfterViewInit, Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import Keyboard from 'simple-keyboard';

@Component({
  selector: 'timepicker-numpad',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './timepicker-numpad.component.html',
  styleUrls: ['./timepicker-numpad.component.scss']
})
export class TimepickerNumpadComponent implements AfterViewInit {

    keyboard: Keyboard;
    @Output() keyPressed = new EventEmitter();

    constructor() { }

    ngAfterViewInit() {
        this.keyboard = new Keyboard({
            onKeyPress: button => this.onKeyPress(button),
            layout: {
                default: ['1 2 3', '4 5 6', '7 8 9', '. 0 delete'],
            },
            theme: 'hg-theme-default hg-layout-numeric numeric-theme',
            display: {
                'delete': 'מחק',
            }
        });
    }

    onKeyPress = (button: string) => {
        // console.log(button);
        this.keyPressed.emit(button);
    }

}
