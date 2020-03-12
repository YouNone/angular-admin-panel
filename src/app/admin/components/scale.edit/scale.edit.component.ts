import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { EditComponentsClass } from 'src/app/share/classes/EditComponents';
import { MsgList } from 'src/app/share/services/msg.list';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { SettingService } from 'src/app/share/services/settings.service';
import { DialogService } from 'src/app/share/services/dialog.service';
import { MatSnackBar, MatButtonToggleChange } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { compRoutes, EScaleType, IScaleDiapasone, IScaleEnumItem, IScale, IScaleEnum } from 'src/app/share/models/type';
import { NotifElemetntConfig } from 'src/app/share/utilit/simple.notification.config';
import { Scale } from 'src/app/share/classes/Scale';

@Component({
  selector: 'scale.edit',
  templateUrl: './scale.edit.component.html',
  styleUrls: ['./scale.edit.component.scss']
})
export class ScaleEditComponent extends EditComponentsClass<Scale> {
	/** Хранилище изменений в шкале */
	scaleKeeper: FormArray = new FormArray([]);

	constructor(
		public $MSG: MsgList,
		public $SETTINGS: SettingService,
		public dataService: UniversalDataService,
		public snackBar: MatSnackBar,
		public router: Router,
		public route: ActivatedRoute,
		public $NOTE: NotificationsService,
		private formBuilder: FormBuilder,
		public location: Location,
		public dialogService: DialogService
	) {
		super(snackBar, router, route, $MSG, $SETTINGS, dataService, $NOTE, dialogService, location, Scale);
		/** Присвоение  роутов*/
		this.routeList = compRoutes.scale;
	}

	initState() {
		const minLength = +this.$SETTINGS.get("minLengthTextInput");

		this.componentForm = new FormGroup({
			type: new FormControl(EScaleType.diapasone),
			date_create: new FormControl({ value: "", disabled: true }),
			date_modify: new FormControl({ value: "", disabled: true }),
			name: new FormControl(
				"",
				[
					Validators.required,
					// AppValidators.space(minLength),
					Validators.minLength(minLength)
				]
			),
			code: new FormControl(
				"",
				[
					// AppValidators.space(minLength),
					Validators.minLength(minLength)
				]
			),
			scale: this.formBuilder.array(
				[this.addDiapason()]
			)
		});
		this.componentForm.controls['scale'].setValidators([Validators.required]);
	}

	/** Создает шкалу с диапазоном */
	addDiapason(option: IScaleDiapasone = { min: 0, max: 100, step: 1 }): FormGroup {
		let group = this.formBuilder.group({
			min: new FormControl(option.min, [Validators.required]),
			max: new FormControl(option.max, [Validators.required]),
			step: new FormControl(option.step, [Validators.required])
		});
		return group;
	}

	/** Создает шкалу с буллитами */
	addEnum(option: IScaleEnumItem = { value: 0, description: "Имя буллита" }): FormGroup {
		let group = this.formBuilder.group({
			description: new FormControl(option.description, [Validators.required]),
			value: new FormControl(option.value, [Validators.required])
		});
		return group;
	}

	/** Удаляет буллит */
	removeControl(i) {
		(<FormArray>this.componentForm.controls['scale']).removeAt(i);
		this.markFormDirty();
	}

	/** Добавляет буллит в конец массива буллитов */
	pushEnum() {
		let group = this.formBuilder.group({
			description: (new FormControl("Имя буллита", [Validators.required])),
			value: (new FormControl(0, [Validators.required]))
		});
		(<FormArray>this.componentForm.controls['scale']).push(group);
		this.markFormDirty();
	}

	/** Отлавливает событие изменения в input-ах */
	dynamicInputChange(e: KeyboardEvent) {
		this.markFormDirty();
		this.isChanged = true;
	}

	createStateItem(item: IScale) {
		this.savedState = {
			id: item.id,
			name: item.name,
			code: item.code,
			type: item.type,
			date_create: item.date_create,
			date_modify: item.date_modify,
			// scale: item.scale
		}
	}

	ngOnInit() {
		this.initState();
		this.ctrl = this.componentForm.controls;

		this.dataService.setServiceUrl(compRoutes.scale);
		if (this.route.snapshot.params["id"] !== undefined) {
			this.currId = this.route.snapshot.params["id"];

			this.dataService.getItem(this.currId)
				.subscribe((data: IScale) => {
					this.componentData = new Scale(data);
					this.componentForm.patchValue({
						name: this.componentData.name,
						code: this.componentData.code
					});
					(<FormArray>this.ctrl['scale']) = new FormArray([]);
					if (data.type == EScaleType.diapasone) {
						this.componentData.type = EScaleType.diapasone;
						(<FormArray>this.ctrl['scale']).push(this.addDiapason(<IScaleDiapasone>data.scale));
						this.scaleKeeper.removeAt(0);
						this.scaleKeeper.push(this.addEnum());
					} else if (data.type == EScaleType.enumerable) {
						this.componentData.type = EScaleType.enumerable;
						(<IScaleEnum>data.scale).forEach((arItem: IScaleEnumItem) => {
							(<FormArray>this.ctrl['scale']).push(this.addEnum(<IScaleEnumItem>arItem));
							this.scaleKeeper.removeAt(0);
							this.scaleKeeper.push(this.addDiapason());
						});
					}
					(<FormControl>this.ctrl['type']).setValue(this.componentData.type);
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

	/** Переключает тип шкалы */
	typeScaleChange(e: MatButtonToggleChange) {
		this.componentData.type = e.value === EScaleType.diapasone ? EScaleType.diapasone : EScaleType.enumerable;
		this.switchControl();
		this.isChanged = true;
	}

	/** Сохраняет в хранилище измененные данные */
	switchControl() {
		const tmp = (<FormArray>this.ctrl['scale']);
		(<FormArray>this.ctrl['scale']) = this.scaleKeeper;
		this.scaleKeeper = tmp;
		this.markFormDirty();
		this.isChanged = true;
	}

	formSubmit() {
		if (this.componentForm.valid && (<FormArray>this.ctrl['scale']).valid) {
			if (!this.componentForm.pristine || !(<FormArray>this.ctrl['scale']).pristine) {
				// готовим данные для отправки
				if (this.componentData.type == EScaleType.enumerable) {
					const eControl = (<FormArray>this.ctrl['scale']).controls;
					(<IScaleEnum>this.componentData.scale) = [];
					eControl.forEach((arItem: FormGroup) => {
						(<IScaleEnum>this.componentData.scale).push({
							value: arItem.controls["value"].value,
							description: arItem.controls["description"].value
						});
					});
				} else if (this.componentData.type == EScaleType.diapasone) {
					const dControl = (<FormGroup>(<FormArray>this.ctrl['scale']).controls[0]).controls;
					(<IScaleDiapasone>this.componentData.scale) = {
						min: dControl["min"].value,
						max: dControl["max"].value,
						step: dControl["step"].value
					}
				}
				// отправляем данные
				if (this.componentData.id) {
					this.disableButton = true;
					// console.log(this.componentData);

					this.dataService.updateItem(this.componentData)
						.subscribe((updScale: IScale) => {
							if (updScale.id) {
								this.createStateItem(updScale);
								// console.log("update", updScale);
								this.snackBar.open(
									this.$MSG.getMsg("mRecordSuccessEdit"),
									this.$MSG.getMsg("btnOk"),
									NotifElemetntConfig.snackInfoConfig
								);
								this.disableButton = false;
								this.componentForm.markAsUntouched();
								this.componentForm.markAsPristine();
								(<FormArray>this.ctrl['scale']).markAsUntouched();
								(<FormArray>this.ctrl['scale']).markAsPristine();
							}
						});
				} else {
					// console.log("create");
					this.dataService.createItem(this.componentData)
						.subscribe((newScale: IScale) => {
							this.componentData = newScale;
							this.createStateItem(newScale);
							this.snackBar.open(
								this.$MSG.getMsg("mRecordSuccessAdd"),
								this.$MSG.getMsg("btnOk"),
								NotifElemetntConfig.snackInfoConfig
							);
							this.disableButton = false;
							this.componentForm.markAsUntouched();
							this.componentForm.markAsPristine();
							(<FormArray>this.ctrl['scale']).markAsUntouched();
							(<FormArray>this.ctrl['scale']).markAsPristine();
						});
				}
			} else {
				// форма без изменений
				this.$NOTE.warn(
					this.$MSG.getMsg('warning'),
					this.$MSG.getMsg("eFieldNotChanged"),
					NotifElemetntConfig.timeOption
				);
				return false;
			}
		} else {
			// невалидная форма
			this.$NOTE.warn(
				this.$MSG.getMsg('warning'),
				this.$MSG.getMsg("eFieldRequired"),
				NotifElemetntConfig.timeOption
			);
			return false;
		}
		this.isChanged = false;
		this.componentForm.markAsPristine();

	}

	/** Устанавливает флаг измененной формы */
	markFormDirty() {
		this.componentForm.markAsTouched();
		this.componentForm.markAsDirty();
		(<FormArray>this.ctrl['scale']).markAsTouched();
		(<FormArray>this.ctrl['scale']).markAsDirty();
		this.isChanged = true;
	}

}
