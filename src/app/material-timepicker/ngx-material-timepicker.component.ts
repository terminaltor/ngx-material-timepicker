import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ClockFaceTime } from './models/clock-face-time.interface';
import { TimePeriod } from './models/time-period.enum';
import { merge, Subscription } from 'rxjs';
import { NgxMaterialTimepickerService } from './services/ngx-material-timepicker.service';
import { TimeUnit } from './models/time-unit.enum';
import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import { NgxMaterialTimepickerEventService } from './services/ngx-material-timepicker-event.service';
import { filter } from 'rxjs/operators';
import { TimepickerDirective } from './directives/ngx-timepicker.directive';
import { DateTime } from 'luxon';

export enum AnimationState {
    ENTER = 'enter',
    LEAVE = 'leave'
}
export enum KeyboardTypes {
    'NUMPAD',
    'CLOCK'
}

const ESCAPE = 27;

@Component({
    selector: 'ngx-material-timepicker',
    templateUrl: './ngx-material-timepicker.component.html',
    styleUrls: ['./ngx-material-timepicker.component.scss'],
    animations: [
        trigger('timepicker', [
            transition(`* => ${AnimationState.ENTER}`, [
                style({transform: 'translateY(-30%)'}),
                animate('0.2s ease-out', style({transform: 'translateY(0)'}))
            ]),
            transition(`${AnimationState.ENTER} => ${AnimationState.LEAVE}`, [
                style({transform: 'translateY(0)', opacity: 1}),
                animate('0.2s ease-out', style({transform: 'translateY(-30%)', opacity: 0}))
            ])
        ])
    ],
    providers: [NgxMaterialTimepickerService]
})
export class NgxMaterialTimepickerComponent implements OnInit, OnDestroy {

    selectedHour: ClockFaceTime;
    selectedMinute: ClockFaceTime;
    selectedPeriod: TimePeriod;

    timeUnit = TimeUnit;
    activeTimeUnit = TimeUnit.HOUR;

    isOpened = false;
    animationState: AnimationState;

    keyboardTypes = KeyboardTypes;

    @Input() cancelBtnTmpl: TemplateRef<Node>;
    @Input() editableHintTmpl: TemplateRef<Node>;
    @Input() confirmBtnTmpl: TemplateRef<Node>;
    @Input('ESC') isEsc = true;
    @Input() enableKeyboardInput: boolean;
    @Input() preventOverlayClick: boolean;
    @Input() disableAnimation: boolean;
    @Input() keyboardType: KeyboardTypes = KeyboardTypes.NUMPAD;
    @Output() keyboardTypeChanged: EventEmitter<KeyboardTypes> = new EventEmitter();

    @Input()
    set minutesGap(gap: number) {
        if (gap == null) {
            return;
        }
        gap = Math.floor(gap);
        this._minutesGap = gap <= 59 ? gap : 1;
    }

    get minutesGap(): number {
        return this._minutesGap;
    }

    @Input()
    set defaultTime(time: string) {
        this.setDefaultTime(time);
    }

    @Output() timeSet = new EventEmitter<string>();
    @Output() opened = new EventEmitter<null>();
    @Output() closed = new EventEmitter<null>();
    @Output() hourSelected = new EventEmitter<number>();

    @ViewChild('timepickerww') timepickerComponent: ElementRef;

    private _minutesGap: number;
    private timepickerInput: TimepickerDirective;
    private subscriptions: Subscription[] = [];

    constructor(private timepickerService: NgxMaterialTimepickerService,
                private eventService: NgxMaterialTimepickerEventService) {

        this.subscriptions.push(merge(this.eventService.backdropClick,
            this.eventService.keydownEvent.pipe(filter(e => e.keyCode === ESCAPE && this.isEsc)))
            .subscribe(() => this.close()));

    }

    public static blurAll() {
        // const tmp = document.createElement('input');
        // document.body.appendChild(tmp);
        // tmp.focus();
        // document.body.removeChild(tmp);
        const btn: HTMLButtonElement = document.querySelector('.hidden-button');
        if (btn) {
            btn.focus();
        }
    }

    get minTime(): string | DateTime {
        return this.timepickerInput && this.timepickerInput.min;
    }

    get maxTime(): string | DateTime {
        return this.timepickerInput && this.timepickerInput.max;
    }

    get disabled(): boolean {
        return this.timepickerInput && this.timepickerInput.disabled;
    }

    get format(): number {
        return this.timepickerInput && this.timepickerInput.format;
    }

    ngOnInit() {
        this.subscriptions.push(this.timepickerService.selectedHour
            .subscribe(hour => this.selectedHour = hour));

        this.subscriptions.push(this.timepickerService.selectedMinute
            .subscribe(minute => this.selectedMinute = minute));

        this.subscriptions.push(this.timepickerService.selectedPeriod
            .subscribe(period => this.selectedPeriod = period));
    }

    changeKeyboardType(type: KeyboardTypes) {
        this.keyboardType = type;
        this.keyboardTypeChanged.emit(type);
    }

    /***
     * Register an input with this timepicker.
     * input - The timepicker input to register with this timepicker
     */
    registerInput(input: TimepickerDirective): void {
        if (this.timepickerInput) {
            throw Error('A Timepicker can only be associated with a single input.');
        }
        this.timepickerInput = input;
    }

    onHourChange(hour: ClockFaceTime): void {
        this.timepickerService.hour = hour;
    }

    onHourSelected(hour: number): void {
        this.changeTimeUnit(TimeUnit.MINUTE);
        this.hourSelected.next(hour);
    }

    onMinuteChange(minute: ClockFaceTime): void {
        this.timepickerService.minute = minute;
    }

    changePeriod(period: TimePeriod): void {
        this.timepickerService.period = period;
    }

    changeTimeUnit(unit: TimeUnit): void {
        this.activeTimeUnit = unit;
    }

    setTime(): void {
        this.timeSet.next(this.timepickerService.getFullTime(this.format));
        this.close();
    }

    setDefaultTime(time: string): void {
        this.timepickerService.setDefaultTimeIfAvailable(
            time, this.minTime as DateTime, this.maxTime as DateTime, this.format, this.minutesGap);
    }

    open(): void {
        this.isOpened = true;
        if (!this.disableAnimation) {
            this.animationState = AnimationState.ENTER;
        }
        this.opened.next();
    }

    close(): void {
        if (this.disableAnimation) {
            this.closeTimepicker();
            return;
        }
        this.animationState = AnimationState.LEAVE;
    }

    animationDone(event: AnimationEvent): void {
        if (event.phaseName === 'done' && event.toState === AnimationState.LEAVE) {
            this.closeTimepicker();
        }
    }

    @HostListener('keydown', ['$event'])
    onKeydown(e: KeyboardEvent) {
        this.eventService.dispatchEvent(e);
        e.stopPropagation();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    private closeTimepicker(): void {
        this.isOpened = false;
        this.activeTimeUnit = TimeUnit.HOUR;
        this.closed.next();
    }

    numPadPressed(k: string) {
        NgxMaterialTimepickerComponent.blurAll();
        this.timepickerService.keyboardClick.emit(new KeyboardEvent('keypress', <any>{
            ctrlKey: true,
            key: k,
            charCode: k === 'Backspace' ? 46 : k.charCodeAt(0),
            keyCode: k === 'Backspace' ? 46 : k.charCodeAt(0)
        }));
    }
}
