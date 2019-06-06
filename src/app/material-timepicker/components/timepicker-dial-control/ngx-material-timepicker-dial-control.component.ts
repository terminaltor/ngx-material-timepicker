/* tslint:disable:triple-equals */
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ClockFaceTime } from '../../models/clock-face-time.interface';
import { TimeUnit } from '../../models/time-unit.enum';
import { TimeFormatterPipe } from '../../pipes/time-formatter.pipe';
import { NgxMaterialTimepickerService } from '../../services/ngx-material-timepicker.service';
import { Subscription } from 'rxjs';
import { NgxMaterialTimepickerComponent } from '../../ngx-material-timepicker.component';

@Component({
    selector: 'ngx-material-timepicker-dial-control',
    templateUrl: 'ngx-material-timepicker-dial-control.component.html',
    styleUrls: ['ngx-material-timepicker-dial-control.component.scss']
})
export class NgxMaterialTimepickerDialControlComponent implements OnChanges, OnDestroy {

    previousTime: number | string;
    shouldFocus = false;

    @Input() timeList: ClockFaceTime[];
    @Input() timeUnit: TimeUnit;
    @Input() time: string;
    @Input() isActive: boolean;
    @Input() isEditable: boolean;
    @Input() minutesGap: number;

    @Output() timeUnitChanged = new EventEmitter<TimeUnit>();
    @Output() timeChanged = new EventEmitter<ClockFaceTime>();
    @Output() focused = new EventEmitter<null>();
    @Output() unfocused = new EventEmitter<null>();

    @ViewChild('inputElement') inputElement: ElementRef;
    eventListener: Subscription;

    constructor(
        private TimepickerService: NgxMaterialTimepickerService
    ) {
        this.eventListener = this.TimepickerService.keyboardClick.subscribe(e => {
            if (this.isActive && this.isEditable) {
                this.onKeyDown(e);
            }
        });
    }

    blurAll($event) {
        NgxMaterialTimepickerComponent.blurAll();
        $event.preventDefault();
    }

    private get selectedTime(): ClockFaceTime {
        if (!!this.time) {
            return this.timeList.find(t => t.time === +this.time);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['time'] && (changes['time'].currentValue !== undefined)) {
            if (this.isEditable && !changes['time'].firstChange) {
                return;
            }
            this.time = new TimeFormatterPipe().transform(+changes['time'].currentValue, this.timeUnit);
        }
    }

    saveTimeAndChangeTimeUnit(event: FocusEvent, unit: TimeUnit): void {
        event.preventDefault();
        this.previousTime = this.time;
        this.timeUnitChanged.next(unit);
        this.focused.next();
    }

    updateTime(): void {
        this.time = parseInt(this.time, 10).toString().padStart(2, '0');
        const time = this.selectedTime;
        if (time) {
            this.timeChanged.next(time);
            this.previousTime = time.time;
        }
    }

    formatTime(): void {
        if (this.isEditable) {
            const time = this.time || this.previousTime;
            this.time = new TimeFormatterPipe().transform(+time, this.timeUnit);
            this.unfocused.next();
        }
    }

    onKeyDown(e: KeyboardEvent): void {
        let char = e.key || String.fromCharCode(e.which || e.keyCode);

        if (isInputAllowed(e)) {
            if (e.keyCode === 46 || e.keyCode === 8) {
                this.time = (this.time + '').substr(0, this.time.length - 1) || '0';
                char = '';
            }
            if (isTimeDisabledToChange(this.time, char, this.timeList)) {
                if (!isTimeUnavailable(char, this.timeList)) {
                    e.preventDefault();
                    this.time = char;
                    this.updateTime();
                    this.formatTime();
                    this.shouldFocus = true;
                }
            } else {
                e.preventDefault();
                this.time += char;
                this.updateTime();
                this.formatTime();
                const input = <HTMLInputElement>(e.target || this.inputElement.nativeElement);
                if (this.shouldFocus || e.keyCode === 9) {
                    setTimeout(() => {
                        try {
                            const nextInput = <HTMLInputElement>input.parentNode.nextSibling.nextSibling.childNodes.item(0);
                            this.unfocused.emit();
                            nextInput.focus();
                        } catch (e) {
                            try {
                                const prevInput = <HTMLInputElement>input.parentNode.previousSibling.previousSibling.childNodes.item(0);
                                this.unfocused.emit();
                                prevInput.focus();
                            } catch (e) { }
                        }
                        this.formatTime();
                    }, 0);
                }
                this.shouldFocus = false;
            }
        } else {
            this.shouldFocus = false;
            e.preventDefault();
        }
    }

    ngOnDestroy() {
        this.eventListener.unsubscribe();
    }

}

function isInputAllowed(e: KeyboardEvent): boolean {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].some(n => n === e.keyCode) ||
        // Allow: Ctrl/cmd+A
        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: Ctrl/cmd+C
        (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: Ctrl/cmd+X
        (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
        // Allow: home, end, left, right, up, down
        (e.keyCode >= 35 && e.keyCode <= 40)) {

        return true;
    }
    return !((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105));
}

function isTimeDisabledToChange(currentTime: string, nextTime: string, timeList: ClockFaceTime[]): boolean {
    const isNumber = /\d/.test(nextTime);

    if (isNumber) {
        const time = currentTime + nextTime;
        return isTimeUnavailable(time, timeList);
    }
}

function isTimeUnavailable(time: string, timeList: ClockFaceTime[]): boolean {
    const selectedTime = timeList.find(value => value.time === +time);
    return !selectedTime || (selectedTime && selectedTime.disabled);
}
