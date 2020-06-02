import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { IDivision, IPosition, ICheckState, ESort, ISearchOptions, IUserWithPosition } from '../models/type';
import { SettingService } from '../services/settings.service';
import { UniversalDataService } from '../services/universal.data.service';
import { MsgList } from '../services/msg.list';


type AllowedListTypes = IDivision | IPosition | IUserWithPosition;

/**
 * Компонент-виджет поиска пользователей. Родительский компонент, который вызывает виджет передает в него список своих элементов.
 * Виджет производит поиск данных и выводит результаты поиска собственном списке. Если найденные элементы есть и в родительском 
 * компоненте, то они помечаются как выделенные. Если кликнуть по элементу списка в виджете, то генерируется событие, которое
 * возвращает выбранный элемент списка и состояние выбрано / не выбрано. Родитель может добавить / удалить этот элемент у себя. 
 *
 * @export
 * @class ItemsSearchColumnClass
 * @implements {OnInit}
 * @implements {OnChanges}
 */
export class ItemsSearchColumnClass implements OnInit, OnChanges {
	/** Показать / спрятать форму поиска */
	@Input() isSearchShow: boolean = true;
	/** Выполнять или нет стартовую загрузку списка */
	@Input() initLoad: boolean = false;
	/** Имя сервиса, который должен выполнять поиск объектов */
	@Input() serviceRoute: String = undefined;
	/** Поле сортировки по умолчанию */
	@Input() orderField: string = 'name';
	/** Список столбцов в таблице в результатами поиска */
	@Input() displayedColumns: string[] = ['select', 'name'];
	/** Показывать или нет в строке элемента его код */
	@Input() showCode: boolean = false;
	/** Заголовок колонки над строкой поиска */
	@Input() title: String = "Поиск";
	/** Ширина колонки виджета */
	@Input('width') componentWidth = '400';
	/** Индикатор того, что виджет открыт */
	@Input() isOpen: boolean = false;
	/** Входящий список объектов. Если объекты в этом списке совпадают с результатами поиска, то элементы результатов поиска помечаюся как выделенные */
	@Input() incomeList: AllowedListTypes[] = [];
	/** Событие закрытия виджета кнопкой закрытия внутри виджета */
	@Output() changeOpen = new EventEmitter<boolean>();
	/** Событие выбора элемента в списк. Возвращается ссылка на выделенный элемент */
	@Output() itemCheck = new EventEmitter<ICheckState<AllowedListTypes>>();
	/** Список с реузультатами поиска. Т.е. найденные пользователи */
	items: AllowedListTypes[] = [];
	/** Флаг того, что поиск вернул нулевой результат */
	isNotFound = false;
	/** Список выделенных элементов в результате поисков */
	selection = new SelectionModel<AllowedListTypes>(true, []);
	/** Состояние формы поиска виджета */
	state: { orderField: string, order: ESort, f: string, field: string, f2: string, field2: string };
	/** Ссылка на форму поиска */
	searchForm = new FormGroup({ searchInput: new FormControl("") });
	/** Настройки автоскролла. Дистанция срабатывания втоскрола */
	distance = this.$SETTINGS.get('readScrollDistance');
	/** Настройки автоскролла. Количество строк для подчитывания */
	listIncrement = this.$SETTINGS.get('listIncrement');
	/** Настройки автоскролла. Задержка срабатывания втоскрола */
	throttle = this.$SETTINGS.get('readScrollThrottle');
	/** "placeholder" в пустом блоке результатов поиска */
	mEmptyBox = "";
	/** Сообщение "поиск не дал результатов" */
	mNotFound = "";

	constructor(
		public $SETTINGS: SettingService,
		public dataService: UniversalDataService,
		public $MSG: MsgList
	) { }


	/**
	 * Выбираем сервис для чтения данных -- пользователи
	 *
	 * @memberof ItemsSearchColumnClass
	 */
	ngOnInit() {
		this.mEmptyBox = this.$MSG.getMsg('mEmptyBox');
		this.mNotFound = this.$MSG.getMsg('mNotFound');
		this.state = {
			orderField: this.orderField,
			order: ESort.asc,
			f: "",
			field: "",
			f2: "",
			field2: ""
		}
		if(!parseInt(this.componentWidth)){
			this.componentWidth = '400';
		}
		if(this.initLoad === true) {
			this.itemReload();
		}
	}

	/**
	 * При изменении состояния входящих параметров компонента сбрасывает и перерисовывает список выделенных
	 * пользователей. Делается это на случай изменения списка входящих пользователей incomeList или роута виджета.
	 *
	 * @memberof ItemsSearchColumnClass
	 */
	ngOnChanges(changes: SimpleChanges) {
		if(changes && changes.serviceRoute && changes.serviceRoute.previousValue !== changes.serviceRoute.currentValue){
			this.itemReload();
			this.reloadSelectedItems(this.items);
		} else if (
			changes === null ||
			changes && (
				(changes.isOpen && changes.isOpen.previousValue != changes.isOpen.currentValue) ||
				(changes.incomeList && changes.incomeList.previousValue != changes.incomeList.currentValue)
			)
		){
			this.reloadSelectedItems(this.items);
		} 

	}

	/**
	 * Показывает/скрывает виджет, сдвигая его за экран при помощи анимации.
	 *
	 * @memberof ItemsSearchColumnClass
	 */
	toggleVisible() {
		this.isOpen = !this.isOpen;
		this.changeOpen.emit(this.isOpen);
	}


	/**
	 * Потправляет запрос поиска на сервер и перезагружает список найденных пользователей
	 *
	 * @param {(KeyboardEvent | MouseEvent)} e Событие отправки формы. Либо Энтер, либо клик мыши на кнопке отпрвки формы
	 * @memberof ItemsSearchColumnClass
	 */
	filterInput(e: KeyboardEvent | MouseEvent) {
		this.state.f = this.searchForm.controls['searchInput'].value.trim().toLowerCase();
		this.itemReload();
	}


	/**
	 * Добавляет вновь найденных пользователей в общий список пользователей виджета и проверяет нет ли таких элементов в 
	 * компоненте, который вызвал виджет. Если совпадения есть, они помечаются как выделенные.
	 *
	 * @param {AllowedListTypes[]} items Новые объекты спика, пришедшие как результат запроса
	 * @memberof ItemsSearchColumnClass
	 */
	addSelectedItems(items: AllowedListTypes[]) {
		
		let presentItems: AllowedListTypes[] = [];
		if (this.incomeList.length > 0) {
			items.forEach((item: AllowedListTypes) => {
				if (this.incomeList.find((incomItem) => incomItem.id === item.id)) presentItems.push(item);
			});
			this.selection.select(...presentItems);
		}
	}


	/**
	 * Перезагрузка списка с результатами поиска. Происходит после отправки запроса на сервер с новой строкой поиска.
	 * Также очищает список раннее выделенных пользователей и выделяет новых.
	 *
	 * @param {AllowedListTypes[]} items Новый список элементов виджета
	 * @memberof ItemsSearchColumnClass
	 */
	reloadSelectedItems(items: AllowedListTypes[]) {
		this.selection.clear();
		this.addSelectedItems(items);
	}



	/**
	 * Чекает / снимает чек на объекте после клика в списке выделенных элементов и генерирует исходящее событие о том, 
	 * что объект поменял статус выделения для того, чтобы при необходимости родительский объект мог скорректировать свое состояние.
	 *
	 * @param {MatCheckboxChange} e Событие мыши. Клик по чекбоксу
	 * @param {AllowedListTypes} item Выбранный элемент списка
	 * @memberof ItemsSearchColumnClass
	 */
	toggleItem(e: MatCheckboxChange, item: AllowedListTypes) {
		this.selection.toggle(item);
		this.itemCheck.emit({
			state: e.checked,
			item: item
		});
	}


	/**
	 * Формирует полную строку запроса к сервису поиска
	 *
	 * @param {ISearchOptions} options Параметры поиска
	 * @memberof ItemsSearchColumnClass
	 */
	addExtraFilterOption(options: ISearchOptions) {
		options.sort = this.state.orderField;
		options.order = this.state.order;
		if (this.state.f.trim().length > 0) {
			options.f = this.state.f;
			if(this.state.field) options.field = this.state.field;
		}
		if(this.state.f2){
			options.f2 = this.state.f2;
			if(this.state.field2) options.field2 = this.state.field2;
		}
	}


	/**
	 * Дочитывает результаты поиска с сервера, дополняя список найденных объектов результатми запроса. 
	 * После добавления данных корректирует список выделенных объектов.
	 *
	 * @param {number} startNum С какого номера подчитать данные START_ITEM_NUM
	 * @param {number} itemAmount Длинна выборки подчитываемых данных LIMIT
	 * @memberof ItemsSearchColumnClass
	 */
	itemLoad(
		startNum: number,
		itemAmount: number
	) {
		if(!this.serviceRoute || !this.state) return;
		const option: ISearchOptions = {
			start: startNum,
			limit: itemAmount,
		};
		this.dataService.setServiceUrl(this.serviceRoute);
		this.addExtraFilterOption(option);
		this.dataService.getList<AllowedListTypes>(option)
			.subscribe((newItems: AllowedListTypes[]) => {
				this.items = this.items.concat(newItems);
				this.addSelectedItems(newItems)
			});
	}


	/**
	 * Посылает запрос на сервер и результаты поиска помещает в переменную this.items. 
	 * После этого выставляет выделения в тех объекта, которые имеются в родительском компоненте.
	 *
	 * @memberof ItemsSearchColumnClass
	 */
	itemReload() {
		if(!this.serviceRoute || !this.state) return;
		const option: ISearchOptions = {
			start: 0,
			limit: this.$SETTINGS.get("startListLen")
		};
		this.addExtraFilterOption(option);
		this.dataService.setServiceUrl(this.serviceRoute);
		this.dataService.getList<AllowedListTypes>(option)
			.subscribe((newItems: AllowedListTypes[]) => {
				if (!newItems) newItems = [];
				this.items = newItems;
				this.isNotFound = !this.items.length;
				this.reloadSelectedItems(this.items);
			});
	}


	/**
	 * Событие подчитывания данных. Наступает когда список домотан до конца
	 *
	 * @param {*} e
	 * @memberof ItemsSearchColumnClass
	 */
	onScroll(e) {
		this.itemLoad(this.items.length, this.listIncrement);
	}


	/**
	 * Изменяет направление сортировки списка
	 *
	 * @param {*} e
	 * @memberof ItemsSearchColumnClass
	 */
	sortChange(e) {
		this.state.order = e.direction;
		this.state.orderField = e.active;
		this.itemReload();
	}

	/**
	 * Хрен пойми нафига оно нужно.
	 *
	 * @param {AllowedListTypes} [row]
	 * @returns {string}
	 * @memberof ItemsSearchColumnClass
	 */
	checkboxLabel(row?: AllowedListTypes): string {
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
	}


	/**
	 * Формирует строку информации о записи , на которой стоит указатель мыши для показа тултипа
	 *
	 * @param {AllowedListTypes} item Ссылка на объект для которого ренерируется строка
	 * @returns {string} Строка сообщения toolTip
	 * @memberof ItemsSearchColumnClass
	 */
	getItemInfo(item: AllowedListTypes): string {
		return item[this.orderField];
	}

}
