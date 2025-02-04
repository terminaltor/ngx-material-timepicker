import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaterialTimepickerComponent } from './ngx-material-timepicker.component';
import { FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerToggleComponent } from './components/timepicker-toggle-button/ngx-material-timepicker-toggle.component';
import { TimepickerDirective } from './directives/ngx-timepicker.directive';
import { NgxMaterialTimepickerToggleIconDirective } from './directives/ngx-material-timepicker-toggle-icon.directive';
import { NgxMaterialTimepickerThemeDirective } from './directives/ngx-material-timepicker-theme.directive';
import {
    NgxMaterialTimepicker24HoursFaceComponent
} from './components/timepicker-24-hours-face/ngx-material-timepicker-24-hours-face.component';
import {
    NgxMaterialTimepicker12HoursFaceComponent
} from './components/timepicker-12-hours-face/ngx-material-timepicker-12-hours-face.component';
import {
    NgxMaterialTimepickerMinutesFaceComponent
} from './components/timepicker-minutes-face/ngx-material-timepicker-minutes-face.component';
import { NgxMaterialTimepickerFaceComponent } from './components/timepicker-face/ngx-material-timepicker-face.component';
import { NgxMaterialTimepickerButtonComponent } from './components/timepicker-button/ngx-material-timepicker-button.component';
import { NgxMaterialTimepickerDialComponent } from './components/timepicker-dial/ngx-material-timepicker-dial.component';
import {
    NgxMaterialTimepickerDialControlComponent
} from './components/timepicker-dial-control/ngx-material-timepicker-dial-control.component';
import { NgxMaterialTimepickerPeriodComponent } from './components/timepicker-period/ngx-material-timepicker-period.component';
import { StyleSanitizerPipe } from './pipes/style-sanitizer.pipe';
import { TimeFormatterPipe } from './pipes/time-formatter.pipe';
import { OverlayDirective } from './directives/overlay.directive';
import { MinutesFormatterPipe } from './pipes/minutes-formatter.pipe';
import { AutofocusDirective } from './directives/autofocus.directive';
import { TimepickerNumpadComponent } from './components/timepicker-numpad/timepicker-numpad.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        NgxMaterialTimepickerComponent,
        NgxMaterialTimepickerToggleComponent,
        TimepickerDirective,
        NgxMaterialTimepickerToggleIconDirective,
        NgxMaterialTimepickerThemeDirective
    ],
    declarations: [
        NgxMaterialTimepickerComponent,
        NgxMaterialTimepicker24HoursFaceComponent,
        NgxMaterialTimepicker12HoursFaceComponent,
        NgxMaterialTimepickerMinutesFaceComponent,
        NgxMaterialTimepickerFaceComponent,
        NgxMaterialTimepickerToggleComponent,
        NgxMaterialTimepickerButtonComponent,
        NgxMaterialTimepickerDialComponent,
        NgxMaterialTimepickerDialControlComponent,
        NgxMaterialTimepickerPeriodComponent,
        TimepickerNumpadComponent,
        StyleSanitizerPipe,
        TimeFormatterPipe,
        TimepickerDirective,
        OverlayDirective,
        NgxMaterialTimepickerToggleIconDirective,
        AutofocusDirective,
        MinutesFormatterPipe,
        NgxMaterialTimepickerThemeDirective
    ]
})
export class NgxMaterialTimepickerModule {
}
