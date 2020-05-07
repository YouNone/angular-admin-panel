import { MatSnackBar, MatSelectChange } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Location } from '@angular/common';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EditComponentsClass } from 'src/app/share/classes/EditComponents';
import { DialogService } from 'src/app/share/services/dialog.service';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { compRoutes, ETaskTypeStart, IFormValues } from 'src/app/share/models/type';
import { SettingService } from 'src/app/share/services/settings.service';
import { Task } from 'src/app/share/classes/Task';
import { MsgList } from 'src/app/share/services/msg.list';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';

@Component({
  selector: 'app-task.edit',
  templateUrl: './task.edit.component.html',
  styleUrls: ['./task.edit.component.css']
})
export class TaskEditComponent extends EditComponentsClass<Task> {

  /** Выбранный период */
  showedShedule: string;
  /** Периодичность */
  taskShedule = Object.keys(ETaskTypeStart);
  /**Выбранный день недели */
  selectedWeek: string;
  /** Монако */
  monacoContent: string = "";

  editorOptions = {
    automaticLayout: true,
    // theme: 'vs-light',
    theme: 'vs-dark',
    language: 'javascript',
    minimap: {
      enabled: false
    }
  };
  weekday = this.$MSG.getMsg("weekday").split(" ");
  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    public route: ActivatedRoute,
    public $MSG: MsgList,
    public $SETTINGS: SettingService,
    public dataService: UniversalDataService,
    public $NOTE: NotificationsService,
    public location: Location,
    public dialogService: DialogService
  ) { 
    super(snackBar, router, route, $MSG, $SETTINGS, dataService, $NOTE, dialogService, location, Task);
		/** Присвоение  роутов*/
		this.routePrefix = compRoutes.taskEdit;
		this.routeList = compRoutes.task;
  }

  ngOnInit() {
		this.initState();
		this.ctrl = this.componentForm.controls;
		this.dataService.setServiceUrl(compRoutes.task);
		if (this.route.snapshot.params["id"] !== undefined) {
			this.currId = this.route.snapshot.params["id"];
			this.dataService.getItem<Task>(this.currId)
				.subscribe((data: Task) => {
					this.componentData = new Task(data);
					this.componentForm.patchValue(this.componentData);
					this.selectChange({ source: null, value: this.componentData.type_start });
					this.monacoContent = data.script;
					this.showedShedule = data.type_start;
					this.isReady = true;
				});
		} else {
			this.isReady = true;
		}

		this.$formSubscr = this.componentForm.valueChanges
			.subscribe(formValues => {
				this.applyFormValues(formValues);
			});
		this.componentForm.markAsPristine();
	}

	initState() {
		const minLength = +this.$SETTINGS.get("minLengthTextInput");
		this.componentForm = new FormGroup({
			name: new FormControl("", [Validators.required, Validators.minLength(minLength)]),
			code: new FormControl("", [Validators.minLength(minLength)]),
			date_create: new FormControl({ value: undefined, disabled: true }),
			date_modify: new FormControl({ value: undefined, disabled: true }),
			date_execute: new FormControl({ value: undefined, disabled: true }),
			type_start: new FormControl("", [Validators.required]),
			execute_point: new FormControl("", [Validators.required]),
			date_start: new FormControl(new Date()),
			date_end: new FormControl(undefined),
			time_start: new FormControl(undefined, [Validators.required]),
			time_end: new FormControl(undefined),
			script: new FormControl(undefined)
		});
		this.ctrl = this.componentForm.controls;
	}

	createStateItem(item: Task) {
		this.savedState = {
			id: item.id,
			name: item.name,
			code: item.code,
			date_execute: item.date_execute,
			type_start: item.type_start
		}
	}

	selectChange(event: MatSelectChange) {		
		this.showedShedule = event.value;

		switch (this.showedShedule) {
			case ETaskTypeStart.never:
				this.ctrl['time_start'].clearValidators();
				this.ctrl['execute_point'].clearValidators();
				break;
			case ETaskTypeStart.period:
				this.ctrl['time_start'].clearValidators();
				this.ctrl['execute_point'].clearValidators();
				this.ctrl['time_end'].clearValidators();
				this.ctrl['execute_point'].setValidators([Validators.required]);
				break;
			case ETaskTypeStart.day:
				this.ctrl['time_start'].clearValidators();
				this.ctrl['execute_point'].clearValidators();
				this.ctrl['time_start'].setValidators([Validators.required]);
				break;
			case ETaskTypeStart.week:
				this.ctrl['time_start'].clearValidators();
				this.ctrl['execute_point'].clearValidators();
				this.ctrl['execute_point'].setValidators([Validators.required]);
				this.ctrl['time_start'].setValidators([Validators.required]);
				break;
			case ETaskTypeStart.month:
				this.ctrl['time_start'].clearValidators();
				this.ctrl['execute_point'].clearValidators();
				this.ctrl['time_start'].setValidators([Validators.required]);
				this.ctrl['execute_point'].setValidators([Validators.required]);
				break;
		}
		this.ctrl['execute_point'].updateValueAndValidity();
		this.ctrl['time_start'].updateValueAndValidity();
		this.ctrl['time_end'].updateValueAndValidity();
	}

	weekChange(event) {
		this.selectedWeek = event.value;
	}

	formSubmit() {
		if (this.componentForm.valid) {
			if (this.componentData.id) {
				if (this.isChanged || !this.componentForm.pristine) {
					this.disableButton = true;
					this.dataService.updateItem(this.componentData)
						.subscribe((newTask: Task) => {	
							if (newTask.id) {
								this.createStateItem(newTask);
								this.componentData = new Task(newTask);
								this.monacoContent = this.componentData.script;
								this.componentForm.patchValue(this.componentData);
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
				console.log(this.componentData);
				
				this.dataService.createItem(this.componentData)
					.subscribe((newTask: Task) => {						
						this.componentData = new Task(newTask);
						this.monacoContent = this.componentData.script;
						this.createStateItem(newTask);
						this.componentForm.patchValue(this.componentData);
						this.snackBar.open(
							this.$MSG.getMsg("mRecordSuccessAdd"),
							this.$MSG.getMsg("btnOk"),
							NotifElemetntConfig.snackInfoConfig
						);
						this.disableButton = false;
					});
			}
			this.componentForm.markAsUntouched();
			this.isChanged = false;
		} else {
			this.$NOTE.warn(
				this.$MSG.getMsg('warning'),
				this.$MSG.getMsg("eFieldRequired"),
				NotifElemetntConfig.timeOption
			);
			return false;
		}
		this.componentForm.markAsPristine();
	}

	applyFormValues(formValues: IFormValues) {
		for (const key in formValues) {
			if (key == 'script' && !this.ctrl['script'].pristine && this.ctrl['script'].value == this.monacoContent) {
				this.ctrl['script'].markAsPristine();
			}
			if(formValues[key] === this.componentData[key]) continue;
			// if(this.excludeFieldList.includes(key)) break;
			this.componentData[key] = formValues[key];
			break;
		}		
	}

}
