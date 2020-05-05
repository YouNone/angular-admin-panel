import { IFormValues } from 'src/app/share/models/type';
import { DialogService } from 'src/app/share/services/dialog.service';
import { NotificationsService } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { MsgList } from 'src/app/share/services/msg.list';
import { SettingService } from 'src/app/share/services/settings.service';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';
import { IAuthInfo } from './../../share/models/type';
import { getErrMsg } from 'src/app/share/utilit/utilit';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
    /** Форма логина */
    componentForm: FormGroup;
    /** Подписка на изменения в форме */
    $formSubscr: Subscription;
    /** Данные введенные пользователем */
    componentData: IAuthInfo;
    /** Активатор кнопки отправки формы */
    disableButton: boolean = true;
    /** Внешняя утилита генерации сообщений об ошибках для полей валидируемой формы */
    errMsg = getErrMsg;
    /** Флаг бейсик авторизации */

    /** Тип авторизации приложения */
    // loginType: EAuthType = EAuthType.basic;
    isBasicAuth: boolean = true;
    constructor(
        public $MSG: MsgList,
        public $SETTINGS: SettingService,
        public dataService: UniversalDataService,
        public snackBar: MatSnackBar,
        public router: Router,
        public route: ActivatedRoute,
        public $NOTE: NotificationsService,
        public dialogService: DialogService,
    ) {
        this.componentData = {
            login: '',
            password: ''
        };
    }

    ngOnInit() {
        this.initState();

        this.$formSubscr = this.componentForm.valueChanges
            .subscribe(formValues => {
                this.applyFormValues(formValues);
            });
    }

    applyFormValues(formValues: IFormValues) {
        for (const key in formValues) {
            if (formValues[key] !== this.componentData[key]) {
                this.componentData[key] = formValues[key];
                break;
            }
        }
        this.disableButton = !this.componentForm.valid;
    }

    initState() {
        const minLength = +this.$SETTINGS.get("minLengthTextInput");
        this.componentForm = new FormGroup({
            login: new FormControl("",
                [
                    Validators.required,
                    // AppValidators.space(minLength), 
                    Validators.minLength(minLength)
                ]),
            password: new FormControl("", [
                Validators.required,
                // AppValidators.space(minLength), 
                Validators.minLength(minLength)
            ])
        });
    }

    formSubmit() {
        console.log(this.componentForm);

    }

    clearInput(fieldName: string): void {
        this.componentForm.get(fieldName).setValue('');
    }
}
