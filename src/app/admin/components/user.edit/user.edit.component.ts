import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatRadioChange } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { Location } from '@angular/common';


import { EditComponentsClass } from 'src/app/share/classes/EditComponents';
import { IUser, ESex, compRoutes } from 'src/app/share/models/type';
import { MsgList } from 'src/app/share/services/msg.list';
import { SettingService } from 'src/app/share/services/settings.service';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { DialogService } from 'src/app/share/services/dialog.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { User } from 'src/app/share/classes/User';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';

@Component({
  selector: 'user.edit',
  templateUrl: './user.edit.component.html',
  styleUrls: ['./user.edit.component.css']
})
export class UserEditComponent extends EditComponentsClass<IUser>{
  sexStr = {
    male: ESex.Male.toString(),
    female: ESex.Female.toString()
  }
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
    this.routeList = compRoutes.user;
  }

  initState() {
		const minLength = +this.$SETTINGS.get("minLengthTextInput");
		this.componentForm = new FormGroup({
			name: new FormControl("", [Validators.required, Validators.minLength(minLength)]),
			sex: new FormControl(""),
			login: new FormControl("", [Validators.required, Validators.minLength(minLength)]),
			password: new FormControl(""),
			code: new FormControl(""),
			address: new FormControl(""),
			phone: new FormControl(""),
			email: new FormControl("", Validators.email),
			date_birth: new FormControl(null),
			date_hire: new FormControl(null),
			date_fire: new FormControl(null),
			date_create: new FormControl({ value: "", disabled: true }),
			date_modify: new FormControl({ value: "", disabled: true })
		});
	}

	createStateItem(item: IUser) {
		this.savedState = {
			id: item.id,
			name: item.name,
			login: item.login,
			email: item.email,
			sex: item.sex,
			date_birth: item.date_birth,
			date_create: item.date_create,
			date_modify: item.date_modify,
			date_hire: item.date_hire,
			date_fire: item.date_fire
		};
	}

	ngOnInit() {
		this.dataService.setServiceUrl(compRoutes.user);
		this.initState();
		// this.ctrl = this.componentForm.controls;

		if (this.route.snapshot.params["id"] !== undefined) {
			this.currId = this.route.snapshot.params["id"];

			this.dataService.getItem<User>(this.currId)
				.subscribe((data: User) => {
					// console.log(data);
					this.componentData = new User(data);
					this.componentForm.patchValue({
						code: this.componentData.code,
						name: this.componentData.name,
						login: this.componentData.login,
						sex: this.componentData.sex,
						email: this.componentData.email,
						date_create: this.componentData.date_create,
						date_modify: this.componentData.date_modify,
						date_birth: this.componentData.date_birth,
						date_hire: this.componentData.date_hire,
						date_fire: this.componentData.date_fire,
						header_type: this.componentData.header_type
					});
					this.isReady = true;
				});
		} else {
			this.isReady = true;
		}
		this.$formSubscr = this.componentForm.valueChanges
			.subscribe(formValues => {
				this.applyFormValues(formValues);
			});
	}

	ngOnDestroy(): void {
		if (this.$formSubscr) this.$formSubscr.unsubscribe();
	}

	formSubmit() {
		// Если форма кривая -- ругаемся и выходим
		if (!this.componentForm.valid) {
			this.$NOTE.warn(
				this.$MSG.getMsg('warning'),
				this.$MSG.getMsg("eEmptyField"),
				NotifElemetntConfig.timeOption
			);
			return false;
		}

		if (this.componentData.id) {
			if (!this.componentForm.pristine) {
				this.disableButton = true;
				this.dataService.updateItem(this.componentData)
					.subscribe((user: User) => {
						if (user.id) {
							// console.log("update", user);
							this.createStateItem(user);
							this.snackBar.open(
								this.$MSG.getMsg("mRecordSuccessEdit"),
								this.$MSG.getMsg("btnOk"),
								NotifElemetntConfig.snackInfoConfig
							);
							this.disableButton = false;
						}
					});
			} else {
				this.$NOTE.warn(
					this.$MSG.getMsg('warning'),
					this.$MSG.getMsg("eFieldNotChanged"),
					NotifElemetntConfig.timeOption
				);
				return false;
			}
		} else {
			this.disableButton = true;
			this.dataService.createItem(this.componentData)
				.subscribe((user: User) => {
					this.componentData = user;
					// console.log("create", user);
					this.createStateItem(user);
					this.snackBar.open(
						this.$MSG.getMsg("mRecordSuccessAdd"),
						this.$MSG.getMsg("btnOk"),
						NotifElemetntConfig.snackInfoConfig
					);
					this.disableButton = false;
				});
		}
		// console.log("successuly", this.componentData);
		this.isChanged = false;
		this.componentForm.markAsPristine();
		// console.log(this.componentForm);
  }
  
  /** Перехватывает событие изменения radio-button и сохраняет его в форме */
	radioChange(e: MatRadioChange) {
		this.componentData["sex"] = 1;
		this.ctrl["sex"].setValue(e.value);
		this.componentData["sex"] = e.value;
	}
  
}
