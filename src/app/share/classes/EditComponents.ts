import { AbstractControl, FormGroup } from '@angular/forms';
import { OnInit, Component, OnDestroy, Type } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { Location } from '@angular/common';

import { getErrMsg } from 'src/app/share/utilit/utilit';
import { MsgList } from '../services/msg.list';
import { SettingService } from '../services/settings.service';
import { UniversalDataService } from '../services/universal.data.service';
import { DialogService } from '../services/dialog.service';
import { IFormValues, AllowedListType } from '../models/type';
import { DialogButtonConfig } from '../utilit/dialog.button.config';


export abstract class EditComponentsClass<T> implements OnInit, OnDestroy {
	/** Внешняя утилита генерации сообщений об ошибках для полей валидируемой формы */
	errMsg = getErrMsg;
	/** Флаг, оповещающий о прогруженной(готовой) странице */
	isReady: boolean = false;
	/** Флаг, оповещающий о изменении данных в форме, ипользуется как предохранитель для ухода со страницы*/
	isChanged: boolean = false;
	/** Флаг блокирующий кнопку при отправке формы */
	disableButton: boolean = false;
	/** Форма редактирования/создания */
	componentForm: FormGroup;
	/** Сокращение для полей controls в форме */
	ctrl: { [key: string]: AbstractControl };
	/** ID редактируемой записи, если происходит редактирование существующего элемента undefined если создаем новый*/
	currId: string;
	/** Подписка на изменения в форме */
	$formSubscr: Subscription;
	/** Список полей-исключений componentData, имена которых не соответствуют именам полей формы. 
	 * Для обработчика изменения формы. Инициализируем эту переменную в функции OnInit после инициализации переменной
	 * componentData. Например: this.excludeFieldList.push("division_id"); При этом данное поле необходимо обрабатывать
	 * отдельным обработчиком события внутри компонента.
	 * */
	excludeFieldList: string[] = [];

	/** роут блока меню */
	routePrefix: string;
	/** Роут компонента литса */
	routeList: string;
	/** Переменная, хранящая описание созданного/отредактированного в данном компоненте элемента, который мы 
	 * отдадим наружу компоненту списка	 */
	componentData: T;
	/** Переменная которая сохраняет данные о созданном/редактируемом объекте внутри компонента. эти данные
	 *  будут переданы  родительскому списку после закрытия компонента редактирования. */
	savedState: T;

	constructor(
		public snackBar: MatSnackBar,
		public router: Router,
		public route: ActivatedRoute,
		public $MSG: MsgList,
		public $SETTINGS: SettingService,
		public dataService: UniversalDataService,
		public $NOTE: NotificationsService,
		public dialogService: DialogService,
		public location: Location,
		public DataClass: Type<T>
	) {
		this.componentData = new DataClass();
		this.savedState = undefined;
	}

	/**
	 * Стартовая инициализация данных.
	 * Установка контролов формы.
	 * Установка роута по которому будет обращаться сервис.
	 * Проверка на существующее id в объекте, если есть отображает в компоненте.
	 * Выставляет флаг готовой страницы.
	 * Подписка на изменение в форме, если таковые есть, выставляет новые значение.
	 * @abstract
	 * @memberof EditComponentsClass
	 */
	abstract ngOnInit(): void;

	/**
	 * Стартовая инициализация полей пустой Формы, установка валидаторов 
	 *
	 * @abstract
	 * @memberof EditComponentsClass
	 */
	abstract initState(): void;

	/**
	 * Отправка данных на сервер. 
	 * Проверка на валидность формы.
	 * Если ID задан выполняем апдейт записи компонента. 
	 * Если ID не задан создаем запись
	 * выставляет флаг, оповещающий о изменении данных в форме.
	 *
	 * @abstract
	 * @memberof EditComponentsClass
	 */
	abstract formSubmit(): void;

	/**
	 * Создает метрику вновь созданного объекта для передачи его родителю-списку. 
	 * При выходе из режима редактирования, этот объект будет добавлен в список, 
	 * или обновит состояние уже существующего объекта
	 *
	 * @abstract
	 * @param {AllowedListType} componentItem Ссылка на измененный объект, с которого будут делать копию.
	 * @memberof EditComponentsClass
	 */
	abstract createStateItem(componentItem: AllowedListType): void;

	/**
	 * Обработчик изменения состояния формы. В момент возникновения события изменения значения поля проверяет 
	 * наличие одноименных полей в объекте componentData и сохраняет в нем измененное значение поля формы.
	 * При этом имя поля объекта componentData должно совпадать с именем поля формы. Если поле объекта componentData
	 * само  является объектом, то его обрабатываем отдельно. При этом, это поле формы должно быть добавлено в переменную 
	 * excludeFieldList. 
	 * 
	 * @param {IFormValues} formValues
	 * @memberof BusinessTypeEditComponent
	 */
	applyFormValues(formValues: IFormValues) {
		for (const key in formValues) {
			if (formValues[key] === this.componentData[key]) continue;
			if (this.excludeFieldList.includes(key)) break;
			this.componentData[key] = formValues[key];
			break;
		}
	}

	/**
	 * Отписка от потока формы при уходе со страницы.
	 * @memberof BusinessTypeEditComponent
	 */
	ngOnDestroy() {
		if (this.$formSubscr) this.$formSubscr.unsubscribe();
	}

	/**
	 * Оповещает о изменениях перед уходом со страницы
	 * @returns {(boolean | Observable<boolean> | Promise<boolean>)}
	 * @memberof BusinessTypeEditComponent
	 */
	canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
		if (this.isChanged || !this.componentForm.pristine) {
			return this.dialogService.openConfirm(
				this.$MSG.getMsg('wFormWasChanged'),
				"",
				DialogButtonConfig.GoCancel
			);
		} else {
			return true;
		}
	}

	/**
	 * Уход на страницу родителя (листа).
	 * 
	 * @memberof BusinessTypeEditComponent
	 */
	goBack() {
		this.router.navigate([this.routeList]);
	}


	/**
	 * Сбрасывает состояние формы в статус "Не тронуто"
	 *
	 * @memberof EditComponentsClass
	 */
	clearChanges() {
		this.isChanged = false;
		this.componentForm.markAsUntouched();
		this.componentForm.markAsPristine();
	}
}
