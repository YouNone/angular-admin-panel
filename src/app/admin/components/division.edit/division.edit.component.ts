import { map } from 'rxjs/operators';
import { DialogButtonConfig } from 'src/app/share/utilit/dialog.button.config';
import { DivisionSelectDialogComponent } from './../../../share/components/division.select.dialog/division.select.dialog.component';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';
import { DivisionChanges } from 'src/app/share/classes/DivisionChanges';
import { Division } from 'src/app/share/classes/Division';
import { SelectItemMenuComponent } from 'src/app/share/components/select.item.menu.component/select.item.menu.component';
import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';

import { MsgList } from 'src/app/share/services/msg.list';
import { SettingService } from 'src/app/share/services/settings.service';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { IDivision, ITabState, compRoutes, IDivisionChanges, ISearchOptions } from 'src/app/share/models/type';
import { DialogService } from 'src/app/share/services/dialog.service';
import { EditComponentsClass } from 'src/app/share/classes/EditComponents';

@Component({
	selector: 'division.edit',
	templateUrl: './division.edit.component.html',
	styleUrls: ['./division.edit.component.scss']
})
export class DivisionEditComponent extends EditComponentsClass<Division>  {
	@ViewChild(SelectItemMenuComponent, { static: true }) SelectItemMenuComponent: SelectItemMenuComponent;
	/** Ссылка на состояние данных, хранящихся в данной закладке */
	currState: ITabState;
	/** Объект хранящий форму, состояние строк фильтров, полей сортировки в таблицах */
	state: ITabState[];
	/** Объект, хранящий только изменения, внесенные в документ */
	divisionChanges = new DivisionChanges();
	divisionList: Division[];
	$subscriptionDivisionDialog: Subscription;

	constructor(
		public snackBar: MatSnackBar,
		public router: Router,
		public route: ActivatedRoute,
		public $MSG: MsgList,
		public $SETTINGS: SettingService,
		public dataService: UniversalDataService,
		public $NOTE: NotificationsService,
		public location: Location,
		public dialogService: DialogService,
		public dialog: MatDialog
	) {
		super(snackBar, router, route, $MSG, $SETTINGS, dataService, $NOTE, dialogService, location, Division);
		/** Присвоение  роутов*/
		this.routeList = compRoutes.div;
	}

	ngOnInit() {
		this.dataService.setServiceUrl(compRoutes.div);
		this.initState();
		this.ctrl = (<FormGroup>this.componentForm).controls;

		if (this.route.snapshot.params["id"] !== undefined) {
			this.currId = this.route.snapshot.params["id"];
			this.getDivision().subscribe((res) => {
				this.componentData = new Division(res);
				console.log("subscribe", this.componentData);		
	
				this.componentForm.patchValue({
					code: res.code,
					name: res.name,
					date_create: res.date_create,
					date_modify: res.date_modify,
					date_start: res.date_start,
					date_end: res.date_end,
				});
				if (res.parent !== undefined ) {
					this.componentForm.patchValue({
						parent_name: res.parent.name
					})
				} else {
					this.componentForm.patchValue({
						parent_name: ""
					})
				}
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

	initState() {
		const minLength = +this.$SETTINGS.get("minLengthTextInput");
		this.componentForm = new FormGroup({
			name: new FormControl("", [
				Validators.required,
				Validators.minLength(minLength),
			]),
			code: new FormControl(""),
			parent_name: new FormControl(""),
			date_start: new FormControl(null),
			date_end: new FormControl(null),
			date_create: new FormControl({ value: "", disabled: true }),
			date_modify: new FormControl({ value: "", disabled: true }),
		})
		this.state = [
			{
				form: this.componentForm
			}, {
				orderField: "name",
				searchString: "",
				order: "asc",
				form: new FormControl(""),
			}
		];
	}

	getDivision(): Observable<Division> {
		this.dataService.setServiceUrl(compRoutes.div);
		return this.dataService.getItem<Division>(this.currId);
	}

	createStateItem(item: IDivision) {
		this.savedState = {
			id: item.id,
			name: item.name,
			code: item.code,
			parent: item.parent,
			date_create: item.date_create,
			date_modify: item.date_modify,
			date_start: item.date_start,
			date_end: item.date_end
		};
		console.log("createStateItem", item);
		
	}

	formSubmit() {
		this.dataService.setServiceUrl(compRoutes.div);
		if (this.componentForm.valid) {
			if (this.componentData.id) {
				if (this.isChanged || !this.componentForm.pristine) {
					this.disableButton = true;
					const sendData = this.prepareSendData();
					this.dataService.updateItem(sendData)
						.subscribe((newDivision: IDivision) => {
							console.log( "updateItem", newDivision);
							if (newDivision.id) {
								this.createStateItem(newDivision);
								this.snackBar.open(
									this.$MSG.getMsg("mRecordSuccessEdit"),
									this.$MSG.getMsg("btnOk"),
									NotifElemetntConfig.snackInfoConfig
								);
								this.clearChanges();
							}
							this.disableButton = false;
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
				const sendData = this.prepareSendData();
				this.dataService.createItem<Division>(<any>sendData)
					.subscribe((newDivision: Division) => {
						console.log("createItem", newDivision);
						if (newDivision.id) {
							this.componentData = newDivision;
							this.createStateItem(newDivision);
							this.snackBar.open(
								this.$MSG.getMsg("mRecordSuccessAdd"),
								this.$MSG.getMsg("btnOk"),
								NotifElemetntConfig.snackInfoConfig
							);
							this.clearChanges();
						}
						this.disableButton = false;
					});
			}
		} else {
			this.$NOTE.warn(
				this.$MSG.getMsg('warning'),
				this.$MSG.getMsg("eFieldRequired"),
				NotifElemetntConfig.timeOption
			);
			return false;
		}
	}

	prepareSendData(): IDivisionChanges {
		let sendData = JSON.parse(JSON.stringify(this.divisionChanges));
		sendData.name = this.componentData.name;
		sendData.code = this.componentData.code;
		sendData.parent = this.componentData.parent;
		sendData.date_create = this.componentData.date_create;
		sendData.date_modify = this.componentData.date_modify;
		sendData.date_start = this.componentData.date_start;
		sendData.date_end = this.componentData.date_end;
		if (this.componentData.id) {
			sendData.id = this.componentData.id;
		}
		console.log("senddata", sendData);
		return sendData;
	}

	openDivisionDialog() {
		this.$subscriptionDivisionDialog =
			this.openDivisionSelectDialog()
				.subscribe((res) => { });
	}

	openDivisionSelectDialog() {
		const dialogRef = this.dialog.open(DivisionSelectDialogComponent, {
			width: this.$SETTINGS.get("dlgDivisSelectWidth"),
			height: this.$SETTINGS.get("dlgDivisSelectHeight"),
			/**Снимае фокус с кнопок внутри диалогового окна */
			autoFocus: false,
			data: {
				btn: DialogButtonConfig.SaveCancel,
				item: this.componentData.parent,
				title: this.$SETTINGS.get("dlgDivisSelectTitle")
			}
		});
		return dialogRef.afterClosed()
			.pipe(
				map((res: any) => {
					/** Если нажата кнопка Сохранить и выбран элемент списка и вставляет в инпут */
					if (res && dialogRef.componentInstance.isSelected) {
						this.componentData.parent = dialogRef.componentInstance.data.item;
						this.ctrl.parent_name.patchValue(this.componentData.parent.name);
						this.isChanged = true;
						console.log("afterClosed", this.componentData);
						
					} else {
						return;
					}
				})
			);
	}

	// itemDelete(e: MouseEvent, id: string) {
	// 	if (!id) {
	// 		e.stopPropagation();
	// 		this.dialogService.openConfirm(
	// 			this.$MSG.getMsg('eDeleteNoIdItem'),
	// 			this.$MSG.getMsg('warning'),
	// 			DialogButtonConfig.OK
	// 		)
	// 		return;
	// 	} else {
	// 		e.stopPropagation();
	// 		this.dialogService.openConfirm(
	// 			this.$MSG.getMsg('mConfirmRecordDelete'),
	// 			this.$MSG.getMsg('warning'),
	// 			DialogButtonConfig.YesNo
	// 		).subscribe(res => {
	// 			if (res) {
	// 				this.listService.setServiceUrl(this.dataUrl);
	// 				this.listService.deleteItem<>(id).subscribe((deletedItem: T) => {
	// 					this.componentData = this.componentData.filter((item: T) => item.id !== id);
	// 				});
	// 			}
	// 		});
	// 	}
	// }
}
