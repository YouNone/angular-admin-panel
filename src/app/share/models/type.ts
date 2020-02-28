import { Observable } from 'rxjs';
import { Component } from '@angular/compiler/src/core';
import { CanDeactivate } from '@angular/router';

export enum compRoutes {

	user = 'user',
	userEdit = 'useredit',

	group = 'group',
	groupEdit = 'groupedit',

	div = 'division',
	divEdit = 'divisionedit',

	divgroup = 'divgroup',
    divgroupEdit = 'divgroupedit',
    
    scale = 'scale',
	scaleEdit = 'scaleedit',

	// Other
	auth = 'auth',
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
	id?: string;
	/** Код пользователя */
	code?: string;
	/** ФИО пользователя */
	full_name: string;
	/** Пароль пользователя */
	password?: string;
	login: string;
	email: string;
	/** Пол	*/
	sex?: ESex;
	date_birth: string;
	date_hire: string;
	date_fire?: string;
	date_create: string;
	date_modify: string;
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
	 IScale | IUser;