import { DialogService } from './../../share/services/dialog.service';
import { NotificationsService } from 'angular2-notifications';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatRadioChange } from '@angular/material';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { SettingService } from 'src/app/share/services/settings.service';
import { MsgList } from 'src/app/share/services/msg.list';
import { User } from 'src/app/share/classes/User';
import { IUser, compRoutes, ESex } from 'src/app/share/models/type';
import { EditComponentsClass } from 'src/app/share/classes/EditComponents';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends EditComponentsClass<IUser> {

	sexStr = {
		male: ESex.Male.toString(),
		female: ESex.Female.toString()
	}
	isAuthenticated: boolean = false;

	constructor(
		public $MSG: MsgList,
		public $SETTINGS: SettingService,
		public dataService: UniversalDataService,
		public snackBar: MatSnackBar,
		public router: Router,
		public route: ActivatedRoute,
		public $NOTE: NotificationsService,
		public dialogService: DialogService,
		public location: Location,
	) {
		super(snackBar, router, route, $MSG, $SETTINGS, dataService, $NOTE, dialogService, location, User);
		this.routeList = compRoutes.login;
	}

	ngOnInit() {
		this.dataService.setServiceUrl(compRoutes.user);
		this.initState();
		this.$formSubscr = this.componentForm.valueChanges
			.subscribe(formValues => {
				this.applyFormValues(formValues);
			});
	}

	initState() {
		const minLength = +this.$SETTINGS.get("minLengthTextInput");
		this.componentForm = new FormGroup({
			name: new FormControl("", [Validators.required, Validators.minLength(minLength)]),
			sex: new FormControl(""),
			login: new FormControl("", [Validators.required, Validators.minLength(minLength)]),
			password: new FormControl(""),
			code: new FormControl(""),
			email: new FormControl("", Validators.email),
			date_birth: new FormControl(null),
			date_hire: new FormControl(null),
			date_fire: new FormControl(null),
		});
	}


	formSubmit() {
		if (this.componentForm.valid) {
			this.dataService.setServiceUrl(compRoutes.user)
			this.dataService.createItem(this.componentData)
				.subscribe((user: User) => {
					this.componentData = user;
					// console.log("create", user);
					this.createStateItem(user);
					console.log(this.componentData);
					this.router.navigate(['./', compRoutes.auth]);
					this.snackBar.open(
						this.$MSG.getMsg("mRecordSuccessAdd"),
						this.$MSG.getMsg("btnOk"),
						NotifElemetntConfig.snackInfoConfig
					);
					this.disableButton = false;
				});
		}
	}

	createStateItem(item: IUser) {
		this.savedState = {
			id: item.id,
			name: item.name,
			password: item.password,
			login: item.login,
			email: item.email,
			sex: item.sex,
			date_birth: item.date_birth,
			date_create: item.date_create,
			date_modify: item.date_modify,
			date_hire: item.date_hire,
		};
	}

	goLog() {
        this.router.navigate(['./', compRoutes.login])
    }
}
