import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

import { RequestsService } from './requests.service';
import { SettingService } from './settings.service';
import { MsgList } from './msg.list';
import { ISearchOptions, ESort } from '../models/type';
import { SearchOptions } from '../classes/SearchOption';



/**
 * Универсальный класс обращения с запросами к бэкэнду. После создания объекта класса необходимо произвести инициализацию
 * роута обращения к API, задав ее методом setServiceUrl.
 *
 * @export
 * @class UniversalDataService
 */
@Injectable()
export class UniversalDataService {
	constructor(
		private request: RequestsService,
		private $SETTINGS: SettingService,
		private $MSG: MsgList,
		public $NOTE: NotificationsService
	) { }


	/** Роут, по которому происходит обращение к бэкэнду */
	private serviceUrl: string = "";


	/**
	 * Устанавливает роут по которому будет обращаться сервис
	 *
	 * @param {*} url URL роута бэкэнда
	 * @memberof UniversalDataService
	 */
	setServiceUrl(url) {
		this.serviceUrl = url;
	}


	/**
	 * Перехватчик ошибки HTTP. Выводит диалог ошибок.
	 *
	 * @param {string} myMessage Текст сообщения о ошибке
	 * @param {HttpErrorResponse} [err] Сообщение о ошибке, пришедшее с сервера.
	 * @memberof UniversalDataService
	 */
	showError(myMessage: string, err?: HttpErrorResponse) {
		this.$NOTE.error(
			this.$MSG.getMsg('error'),
			myMessage + (err ? `<br>${err.message}` : '')
		);
	}

	
	/**
	 * Считывает массив объектов.
	 * Адрес API содержится в переменной serviceUrl класса.
	 * В случае, если запрос завершился ошибкой, выводит диалог ошибки.
	 * 
	 * @template T
	 * @param {ISearchOptions} options Список параметров запроса:
	 * @param {number} start Стартовый индекс возвращаемого результата выборки. Отсчет ведется с 0
	 * @param {number} limit Количество элементов в выборке
	 * @param {string} sort Имя поля сортировки. По умолчанию будет установлен в 'full_name'
	 * @param {string} order Направление сортировки asc/desc. По умолчанию asc
	 * @param {string} f Строка фильтра (искомый текст), если производится поиск
	 * @param {string} field Имя поля, по которому производится фильтрация. Если указана строка поиска и не указано поле, то оно устанавливается в 'full_name'.
	 * @returns {Observable<T[]>} Поток на массив объектов
	 * @memberof UniversalDataService
	 */
	getList<T>(options: ISearchOptions = {start: 0, limit: 0}): Observable<T[]> {
		let url = this.serviceUrl;
		// Ограничение limit = 0 говорит о том, что никаких дополнительных параметров не нужно. Только роут
		if(options.limit !== 0){
			let optionUrl = new SearchOptions(options, this.$SETTINGS);
			url += '?' + optionUrl.getUrl();
		}
		return this.request
			.get<T[]>(url).pipe(
				map((data: T[]) => data),
				catchError((err: HttpErrorResponse) => {
					this.showError(this.$MSG.getMsg('eReadItemsList'), err);
					return of([]);
				})
			);
	}

	
	/**
	 * Удаляет объект с указанным ID. 
	 * Адрес API содержится в переменной serviceUrl класса.
	 * Возвращает удаленный объект указанного типа. 
	 * В случае, если запрос завершился ошибкой, выводит диалог ошибки.
	 * 
	 * TODO: Сделать проверку на корректность ID
	 * 
	 * @template T
	 * @param {string} id ID удаляемого объекта
	 * @returns {Observable<T>} Поток на удаленный объект
	 * @memberof UniversalDataService
	 */
	deleteItem<T>(id: string): Observable<T> {
		return this.request
			.delete<T>(this.serviceUrl, id).pipe(
				map((data: T) => data),
				catchError((err: HttpErrorResponse) => {
					this.showError(this.$MSG.getMsg('eDeleteItem') + id, err);
					return of(<T>{});
				})
			);
	}


	/**
	 * Считать объект с указанным ID. 
	 * Адрес API содержится в переменной serviceUrl класса.
	 * Возвращает считанный объект указанного типа. 
	 * В случае, если запрос завершился ошибкой, выводит диалог ошибки.
	 * 
	 * TODO: Сделать проверку на корректность ID
	 *
	 * @template T
	 * @param {string} id ID считываемого объекта
	 * @returns {Observable<T>} Поток на считанный объект
	 * @memberof UniversalDataService
	 */
	getItem<T>(id: string): Observable<T> {
		let url = `${this.serviceUrl}/${id}`;
		return this.request
			.get<T>(url).pipe(
				map((data: T) => data),
				catchError((err: HttpErrorResponse) => {
					this.showError(this.$MSG.getMsg('eReadItem'), err);
					return of(<T>{});
				})
			);
	}


	/**
	 * Создает объект из данных, получаемых на вход. Возвращает созданный объект, полученный от бэкэнда.
	 * Адрес API содержится в переменной serviceUrl класса.
	 * В случае, если запрос завершился ошибкой, выводит диалог ошибки.
	 *
	 * @template T
	 * @param {T} item Данные для создания нового объекта.
	 * @returns {Observable<T>} Поток на созданный объект
	 * @memberof UniversalDataService
	 */
	createItem<T>(item: T): Observable<T> {
		return this.request
			.post<T>(this.serviceUrl, item).pipe(
				map((data: T) => data),
				catchError((err: HttpErrorResponse) => {
					this.showError(this.$MSG.getMsg('eCreateItem'), err);
					return of(<T>{});
				})
			);
	}


	/**
	 * Обновить существующий элемент. Возвращает обновленный объект, полученый со стороны бэкэнда.
	 * Адрес API содержится в переменной serviceUrl класса.
	 * В случае, если запрос завершился ошибкой, выводит диалог ошибки.
	 * 
	 * TODO: поставить проверку на существование item и item.id
	 * 
	 * @template T
	 * @param {*} item Объект обновляемого элемента. Обязательно должен содержать поле ID.
	 * @returns {Observable<T>} Поток на обновленный объект
	 * @memberof UniversalDataService
	 */
	updateItem<T>(item): Observable<T> {
		let url = `${this.serviceUrl}/${item.id}`;
		return this.request
			.put<T>(url, item).pipe(
				map((data) => data),
				catchError((err: HttpErrorResponse) => {
					this.showError(this.$MSG.getMsg('eUpdateItem') + item.id, err);
					return of(<T>{});
				})
			);
	}


	/**
	 * Апдейт списка записей. На входе получает массив объектов, каждый из елементов которого надо обновить.
	 * Адрес API содержится в переменной serviceUrl класса.
	 * При этом предполагается, что URL API на ожидает ID обновлемых записей. Они находятся в каждой записи.
	 * В случае, если запрос завершился ошибкой, выводит диалог ошибки.
	 *
	 * @template T
	 * @param {T} itemList Массив записей для обновления: [{id, param1, param2, ....}]
	 * @returns {Observable<T>} Список обновленных елементов
	 * @memberof UniversalDataService
	 */
	updateList<T>(itemList: T): Observable<T> {
		return this.request
			.put<T>(this.serviceUrl, itemList).pipe(
				map((data) => data),
				catchError((err: HttpErrorResponse) => {
					this.showError(this.$MSG.getMsg('eUpdateItemList') + JSON.stringify(itemList), err);
					return of(<T>{});
				})
			);
	}
}
