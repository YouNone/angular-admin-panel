import { User } from 'src/app/share/classes/User';
import { AuthService } from './../../share/services/auth.service';
import { IAuthInfo, ShortHttpResponse } from './../../share/models/type';
import { IFormValues, IUserAuthInfo, compRoutes } from 'src/app/share/models/type';
import { DialogService } from 'src/app/share/services/dialog.service';
import { NotificationsService } from 'angular2-notifications';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { MsgList } from 'src/app/share/services/msg.list';
import { SettingService } from 'src/app/share/services/settings.service';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';
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
    /** Флаг авторизации */
    isAuthenticated: boolean = false;
    // isBasicAuth: boolean = true;

    constructor(
        public $MSG: MsgList,
        public $SETTINGS: SettingService,
        public dataService: UniversalDataService,
        public snackBar: MatSnackBar,
        public router: Router,
        public $NOTE: NotificationsService,
        public dialogService: DialogService,
        public authService: AuthService
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
                // console.log(formValues);

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
                    Validators.minLength(minLength)
                ]),
            password: new FormControl("", [
                Validators.required,
                Validators.minLength(minLength)
            ])
        });
    }

    formSubmit() {
        if (this.componentForm.valid) {
            this.dataService.setServiceUrl(compRoutes.user)
            this.dataService.getItemByLogin(this.componentData)
                .subscribe((res: User) => {
                    if (Object.keys(res).length !== 0) {
                        this.isAuthenticated = true;
                        this.authService.login(res);
                        this.router.navigate(['./', compRoutes.user])
                    } 
                    // else {
                    //     this.$NOTE.warn(
                    //         this.$MSG.getMsg('warning'),
                    //         this.$MSG.getMsg("eReadItemLog"),
                    //         NotifElemetntConfig.timeOption
                    //     );
                    // }
                })
        }
    }

    goAuth() {
        this.router.navigate(['./', compRoutes.login])
    }
}
