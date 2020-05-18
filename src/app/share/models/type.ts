import { Observable } from 'rxjs';
import { Component } from '@angular/compiler/src/core';
import { CanDeactivate } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

export enum compRoutes {

	user = 'users',
	userEdit = 'useredit',

	group = 'groups',
	groupEdit = 'groupedit',

	div = 'divisions',
	divEdit = 'divisionedit',

	divgroup = 'divgroup',
	divgroupEdit = 'divgroupedit',

	scale = 'scales',
	scaleEdit = 'scaleedit',

	task = 'tasks',
	taskEdit = 'taskedit',

	businesstype = 'businesstype',
	businesstypeEdit = 'businesstypeedit',

	division = 'divisions',
	divisionEdit = 'divisionedit',
	// divisionTree = 'divisions/tree',

	catalogboss = 'headertype',			// Типы руководства. Справочник

	// Other
	auth = 'auth',
	// login = 'login',
	notFound = 'notfound',

}

export interface CanDeactivateComponent extends CanDeactivate<Component> {
	canDeactivate(): Observable<boolean> | Promise<boolean> | boolean
}

export type StringKeyObject = {
	[key: string]: any;
}

export interface IRoute {
	/** Текстовое описание роута, пункт меню */
	name: string;
	/** Путь роута */
	path: string;
}

export interface IHaveId {
	id?: string;
}

export enum ESex {
	/** Мужской пол */
	Male = 1,
	/** Женский пол */
	Female = 2
}
export interface IUser {
	/** ID пользователя */
	id: string;
	/** Код пользователя */
	code?: string;
	/** ФИО пользователя */
	name: string;
	/** Пароль пользователя */
	password: string;
	login: string;
	email: string;
	/** Пол	*/
	sex: ESex;
	date_birth: string;
	date_hire: string;
	date_fire?: string;
	date_create: string;
	date_modify: string;
	// header_type?: ITypeOfLeader;

}

export class ShortHttpResponse {
	/**
	 * Конструктор ShortHttpResponse.
	 * @param {boolean} result Успешный/неуспешный запрос
	 * @param {*} data Ответ, возвращенный запросом
	 * @param {string} [message=""] Сообщение, ответ
	 * @memberof ShortHttpResponse
	 */
	constructor(
		public result: boolean,
		public data: any,
		public message: string = ""
	) { }
}

export interface IUserAuthInfo {
	/** ID пользователя */
	id: string,
	/** Полное ФИО пользователя */
	name: string,
	/** Логин пользователя */
	login: string,
	/** email пользователя */
	email: string,
	/** Список ролей, к которым принадлежит пользователь. На их основе определяется уровень доступа к разделам */
	/** Токен сессии */
	token?: string,
	/** Крутой админ */
	isRoot?: boolean,
	/** Админ. Т.е. управляет процессом, распространяющемся на все пространство предприятий. В этом случае не производится 
	 *  фильтрация списка доступных сотрудников по предприятиям или другим уровням доступа. */
	isAdmin?: boolean,

}
export interface IAuthInfo {
	login: string;
	password: string;
}

/**
 * Типы шкал буллитов: diapasone -- передают интервал чиел, 
 * enumerable -- передают фиксированный список вариантов ответов
 *
 * @export
 * @enum {number}
 */
export enum EScaleType {
	diapasone = 'diapasone',
	enumerable = 'enumerable'
}

export interface IScaleDiapasone {
	/** Минимальное значание */
	min: number;
	/** Максимальное значание */
	max: number;
	/** Шаг */
	step: number;
}


/**
 * Шкала буллита
 *
 * @export
 * @interface IScaleEnumItem
 */
export interface IScaleEnumItem {
	/** Ценность(оценка) */
	value: number;
	/** Описание */
	description: string;
}

export declare type IScaleEnum = IScaleEnumItem[];

export interface IScale {
	/** ID Шкалы */
	id?: string;
	/** Название шкалы */
	name: string;
	/** Код шкалы */
	code: string;
	/** Тип шкалы */
	type?: EScaleType;
	/** Шкала, диапазон или буллит */
	scale?: IScaleDiapasone | IScaleEnum;
	/** Дата создания */
	date_create?: string;
	/** Дата последнего изменения */
	date_modify?: string;
}

export interface ITask {
	/** Id */
	id?: string;
	/** Код задачи */
	code?: string;
	/** Описание задачи */
	name: string;
	/** Дата создания */
	date_create?: string;
	/** Дата редактирования */
	date_modify?: string;
	/** Дата последнего запуска */
	date_execute?: string;
	/** Период выполнения */
	type_start?: ETaskTypeStart;
	/**Количесто выполнений */
	execute_point?: string;
	/** С/До датапикеры */
	date_start?: string;
	date_end?: string;
	/** С/До время */
	time_start?: string;
	time_end?: string;
	/** монако */
	script?: string;
}

export enum ETaskTypeStart {
	never = "never",
	period = "period",
	day = "day",
	week = "week",
	month = "month"
}

export interface IGroup {
	/** ID группы */
	id?: string;
	/** Имя группы */
	name: string;
	/** Код группы */
	code: string;
	/** дата создания группы */
	date_create?: string;
	date_modify?: string;
	/** Количество пользователей группы */
	count?: number;
	/** Члены группы */
	user?: IUserWithPosition[];
	/** Руководители группы */
	boss?: IUserWithPosition[];
}

export interface IUserWithPosition extends IUser {
	/** Должность	пользователя */
	position?: IPosition;
	/** Подразделение, в котором работает сотрудник */
	division?: IDivision;
	/** Тип руководства. Устанавливается в тех структурах, где пользователь выступает в роли руководителя */
	header_type?: ITypeOfLeader;
}

export interface ITypeOfLeader {
	/** Id */
	id?: string;
	/** Код типа руководителя */
	code?: string;
	/** Название должности руководителя */
	name?: string;
	/** Дата создания */
	date_create?: string;
	/** Дата последнего изменения */
	date_modify?: string;

}

export interface IPosition {
	/** ID должности */
	id?: string;
	/** Название должности */
	name: string;
	/** код должности */
	code?: string;
	/** Подразделение к которому привязана должность */
	division?: IDivision;
	/** Данные пользователя-владельца. ФИО и ID минимум */
	user?: IUser;
	/** дерево подразделений-родителей предприятия  */
	division_parent?: IDivision[];
	/** Профиль компетенции должности */
	competence_profile_id?: string;
	/** Уровень должности */
	position_level_id?: string;
	/** Дата создания должности */
	date_start?: string;
	/** Дата завершения должности */
	date_end?: string;
	/** Дата создания */
	date_create?: string;
	/** Дата последней модификации */
	date_modify?: string;

}

export enum EItemListType {
	list = 'list',
	tree = 'tree'
}

export interface IUniversalTreeNode {
	/** ID узла дерева. Только String! При очень больших числах JS теряет младшие разряды */
	id?: string,
	/** Текстовое представление узла дерева */
	name: string;
	/** Наследники текущего узла */
	children?: IUniversalTreeNode[];
	/** ID родителя записи. Если элемент является корнем дерева, это поле равно NULL или не определено */
	parent_id?: number;
	/** Маркер выделенного узла */
	// active?: boolean;
}

export interface ITreeFlatNode {
	expandable: boolean;
	name: string;
	level: number;
	/** ID узла дерева. Только String! При очень больших числах JS теряет младшие разряды */
	id: string;
	/** Маркер выделенного узла. По нему добавляем класс active */
	active?: boolean;
}
export interface IDivisionChanges {
	id?: number
	name: string;
	code: string;
	parent_id: number;
	date_start: string;
	date_end: string;
}

export interface ITreeSelectEvent {
	/** Список нод родителей активированного элемента дерева, включая его самого */
	nodes: IUniversalTreeNode[];
	/** Нода дерева, вызвавшая событие */
	activeNode: IUniversalTreeNode;
	/** Событие вызвавшее обработчик */
	event: Event;
}

export interface IRouteTreeNode {
	/** Текстовое описание роута, которое выводтся как пункт меню или текст в крошках */
	name: string;
	/** Путь роута */
	path: string;
	/** Уровенб вложенности элемента. Корневой уровень = 0 */
	level?: number;
	/** Стиль иконки	*/
	icon: string;
	/** Вложеное подчиненное дерево */
	children?: IRouteTreeNode[];
}
export interface IDivision {
	/** ID подразделения */
	id?: string;
	/** Название подразделения */
	name: string;
	/** Код подразделения */
	code?: string;
	/** ссылка на объект родителя */
	parent?: IDivision;
	/** Дата начала */
	date_start?: string;
	/** Конечная дата */
	date_end?: string;
	/** Дата создания */
	date_create?: string;
	/** Дата последнего изменения */
	date_modify?: string;
	children?: IDivision[];
}

export interface ICheckState<T> {
	state: boolean;
	item: T;
}
export interface IGroupChanges extends ICommonGroupChanges {
	/** Список ID добавленных/удаленных пользователей. Дельта состояния пользователей группы */
	items: {
		/** ID добавленных */
		added: string[],
		/** ID удаленных */
		deleted: string[]
	};
}
export interface ICommonGroupChanges {
	/** ID документа */
	id?: string;
	/** Имя документа */
	name: string;
	/** Код документа */
	code?: string;
	/** Список ID добавленных/удаленных руководителей. Дельта состояния пользователей группы */
	boss?: {
		/** ID добавленных руководителей */
		added: string[],
		/** ID удаленных руководителей */
		deleted: string[],
		/** Объект, в котором ключи = ID руководителей, у которых изменился тип руководства, 
		 * каждая запись хранит старое и новое значение типа руководства 
		 * */
		changed_header_type: {
			/** ID пользователя-руководителя, которому изменяли тип руководства. Сравнивая val и oldVal 
			 *  принимаем решение о необходимости внесения изменений  */
			[boss_id: string]: {
				/** ID начального типа руководства  */
				old?: string;
				/** ID нового типа руководства  */
				new?: string;
			}
		}
	};

}

export interface ITabState<T = any> {
	/** Состав группы, если это группа */
	group?: MatTableDataSource<IGroup>;
	/** Список входящих пользователей/начальства */
	users?: MatTableDataSource<IUserWithPosition>;
	/** Универсальное поле чего-нибудь. То, что сортируется */
	item?: MatTableDataSource<T>
	/** Список предприятий, если это группа предприятий */
	division?: MatTableDataSource<IDivision>;
	/** Поле по кторому сортируется таблица*/
	orderField?: string;
	/** Строка по кторой фильтруется таблица*/
	searchString?: string;
	/**Направление сортировки */
	order?: string;
	/**Форма */
	form: FormGroup | FormControl;
}

export enum ESort {
	asc = "asc",
	desc = "desc"
}

export interface ButtonDiscription {
	/** надпись кнопки */
	title: string;
	/** bolean значение для директивы mat-dialog-close */
	value: string | boolean;
	/** Цвет кнопки */
	color: string;
	/** Класс кнопки */
	class?: string;
	/** Флаг активности */
	active?: boolean;
	/** Картинка */
	img?: string;
}

export interface ISearchOptions {
	/** Индекс первой строки в результатах выборки */
	start: number;
	/** Количество элементов в результате запроса */
	limit: number;
	/** Имя поля, по которому производится сортировка выборки */
	sort?: string;
	/** Порядок сортировки ASC/DESC */
	order?: ESort;
	/** Строка по которой производится поиск по полю field */
	f?: string;
	/** Поле в таблице данных, по которому производится поиск */
	field?: string;
	/** Вторая строка поиска по которой производится фильтрация данных */
	f2?: string;
	/** Второе поле по которому производтся фильтрация данных */
	field2?: string;
}

export enum EAuthType {
	/** Базовая, силами приложения */
	basic = "basic",
	/** NTML -- доменная аутентификация */
	domain = "domain"
}


export enum EStorageType {
	local = "localStorage",
	session = "sessionStorage"
}

export declare type ButtonsSet = ButtonDiscription[];
export interface ChildDeactivatable<T> extends Component {
	savedState: T;
}
/**
 * Интерфейс передачи данных содержимого полей ввода формы при обработке события изменения состояния формы.
 * Передает объект типа {fieldName1: value1, fieldName2: value2}
 *
 * @export
 * @interface IFormValues
 */
export interface IFormValues {
	[key: string]: string | number;
}

export type AllowedListType =
	IScale | IUser | IGroup | ITask;