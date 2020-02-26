import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material';

import { MsgList } from '../services/msg.list';
import { SettingService } from '../services/settings.service';
import { UniversalDataService } from '../services/universal.data.service';
import { ESort, ISearchOptions, compRoutes, ChildDeactivatable, IHaveId } from '../models/type';
import { DialogButtonConfig } from '../utilit/dialog.button.config';
import { DialogService } from '../services/dialog.service';


export class ListComponentsClass<T extends IHaveId> implements OnInit {
	/** Директива для сортировки таблицы */
	@ViewChild(MatSort, { static: false }) sortInfo: MatSort;

	/** Допустимый тип входящего списка */
	componentData: T[] = [];
	/** Отображаемые столбцы таблицы*/
	displayedColumns: string[] = [];
	/** Роут компонента для перехода на страницу редактирования */
	editUrl: compRoutes;
	/** Путь к роуту бэкэнда */
	dataUrl: string;
	/** Дистанция с которой начинается подчитывание данных */
	distance = this.$SETTINGS.get('readScrollDistance');
	/** Пауза перед началом подчитывания данных */
	throttle = this.$SETTINGS.get('readScrollThrottle');
	/** Переменная хранит имя поля, по которому будет производиться фильтрация выборки */
	filterField: string = '';
	/** Объект для хранения состояния сортировки таблицы */
	state = {
		orderField: "name",
		f: "",
		order: ESort.asc,
		f2: "",
		field2: ""
	}
	/** Флаг откритого слайдера */
	sideNavIsOpen = false;

	constructor(
		public $SETTINGS: SettingService,
		public router: Router,
		public $MSG: MsgList,
		public listService: UniversalDataService,
		public dialogService: DialogService
		// public DataClass: Type<T>
	) { }

	/**
	 * Директива для поиска в таблице
	 *
	 * @param {*} index
	 * @param {*} item
	 * @returns
	 * @memberof ListComponentsClass
	 */
	tableTrackById(index, item) {
		return item.id;
	}

	/**
	 * Изменяет состояния фильтра таблицы
	 *
	 * @param {boolean} stat флаг, открыт/закрыт
	 * @memberof ListComponentsClass
	 */
	changeFilterState(stat: boolean) {
		this.sideNavIsOpen = stat;
	}

	/**
	 * Поиск по строке в таблице
	 *
	 * @param {string} str Строка поиска таблицы
	 * @memberof ListComponentsClass
	 */
	changeSearchString(str: string) {
		// console.log(str);
		if (str !== this.state.f) {
			this.state.f = str;
			this.itemReload();
		}
	}

	/**
	 * Стартовая инициализация данных
	 * 
	 * @memberof ListComponentsClass
	 */
	ngOnInit() {
		this.itemsLoad(this.componentData.length, this.$SETTINGS.get("startListLen"));
	}


	/**
	 * Дополнительный фильтр дополнительных опций
	 *
	 * @param {ISearchOptions} options
	 * @memberof ListComponentsClass
	 */
	addExtraFilterOption(options: ISearchOptions, fieldName: string = '') {
		options.sort = this.state.orderField;
		options.order = this.state.order;
		if (this.state.f.trim().length > 0) options.f = this.state.f;
		if (this.state.f2.trim().length > 0) {
			options.f2 = this.state.f2;
			options.field2 = fieldName;
		}
	}


	/**
	 * Загрузка данных в таблицу
	 *
	 * @param {number} startNum
	 * @param {number} divAmout 
	 * @memberof ListComponentsClass
	 */
	itemsLoad(startNum: number, divAmout: number) {
		const option: ISearchOptions = {
			start: startNum,
			limit: divAmout,
		};
		this.addExtraFilterOption(option, this.filterField);
		this.listService.setServiceUrl(this.dataUrl);
		this.listService.getList<T>(option)
			.subscribe((newItem: T[]) => {
				if (newItem) {
					this.componentData = this.componentData.concat(newItem);
				} else return;
			});
	}

	/**
	 * Подгрузка данных в таблицу
	 *
	 * @memberof ListComponentsClass
	 */
	itemReload() {
		const option: ISearchOptions = {
			start: 0,
			limit: this.$SETTINGS.get("startListLen"),
		};
		this.addExtraFilterOption(option, this.filterField);
		this.listService.setServiceUrl(this.dataUrl);
		this.listService.getList<T>(option)
			.subscribe((newItem: T[]) => {
				this.componentData = newItem;
			});
	}


	/**
	 *	Отлов события скролла и подгрузка новых элементов таблицы
	 *
	 * @param {*} e event
	 * @memberof ListComponentsClass
	 */
	onScroll(e) {
		this.itemsLoad(this.componentData.length, this.$SETTINGS.get("startListLen"));
	}

	/**
	 * Сортировка полей таблицы
	 * перезагрузка данных
	 * @param {*} e
	 * @memberof ListComponentsClass
	 */
	sortChange(e) {
		this.state.order = e.direction;
		this.state.orderField = e.active;
		// console.log(this.state.order, this.state.orderField);
		this.itemReload();
	}

	/**
	 * Удаление элемента в таблице 
	 *
	 * @param {MouseEvent} e
	 * @param {string} id
	 * @memberof ListComponentsClass
	 */
	itemDelete(e: MouseEvent, id: string) {
		if (!id) {
			e.stopPropagation();
			this.dialogService.openConfirm(
				this.$MSG.getMsg('eDeleteNoIdItem'),
				this.$MSG.getMsg('warning'),
				DialogButtonConfig.OK
			)
			return;
		} else {
			e.stopPropagation();
			this.dialogService.openConfirm(
				this.$MSG.getMsg('mConfirmRecordDelete'),
				this.$MSG.getMsg('warning'),
				DialogButtonConfig.YesNo
			).subscribe(res => {
				if (res) {
					this.listService.setServiceUrl(this.dataUrl);
					this.listService.deleteItem<T>(id).subscribe((deletedItem: T) => {
						this.componentData = this.componentData.filter((item: T) => item.id !== id);
					});
				}
			});
		}
	}


	/**
	 * Переход на страницу редактирования элемента таблицы
	 *
	 * @param {T} item
	 * @memberof ListComponentsClass
	 */
	editItem(item: T) {
		this.router.navigate([this.router.url, this.editUrl, item.id]);
	}

	/**
	 * Переход на страницу создания элемента таблицы
	 *
	 * @memberof ListComponentsClass
	 */
	addItem() {
		this.router.navigate([this.router.url, this.editUrl]);
	}


	/**
	 * Добавляет измененный элемент таблицы в её начало 
	 *
	 * @param {ChildDeactivatable} editorComponent
	 * @memberof ListComponentsClass
	 */
	getChangedItemToList(editorComponent: ChildDeactivatable<T>) {
		if (editorComponent.savedState) {
			const index = this.componentData.findIndex((elem) => elem.id == editorComponent.savedState.id);
			if (index != -1) {
				this.componentData[index] = editorComponent.savedState;
				this.componentData = [...this.componentData];
			} else {
				this.componentData = [editorComponent.savedState, ...this.componentData];
			}
		}
	}

}
