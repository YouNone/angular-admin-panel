import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError, map, retry } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { compRoutes } from '../models/type';


/**
 * Компонент прослойка доступа по HTTP для морды портала. В мемент создания расчитывает базовый URL 
 * для доступа к API сайта и получает из компонента авторизации токен сессии, который помещает в заголовки
 * запросов. Токен служит идентификатором сессии. Все методы класса отлавливают ошибку 401 Unauthorized.
 * В этом случае перебрасывает посетителя на страницу логина.
 *
 * @export
 * @class RequestsService
 */
@Injectable()
export class RequestsService {
	/**
	 * Конструктор of	RequestsService.
	 * @param {HttpClient} http Сервис HTTP 
	 * @param {Router} router Роутер приложения
	 * @memberof RequestsService
	 */
	constructor(
		private router: Router,
		private http: HttpClient
	) {
	}

	/**
	 * Перехватывает ошибку, приходящую с сервера, если таковая случилась. Если это ошибка авторихзации,
	 * перебрасывает пользователя на страницу авторизации. В противном случае генерирует исключение
	 * с ошибкой, которая пришла с сервера.
	 *
	 * @private
	 * @param {HttpErrorResponse} err Объект ошибки, пришедшей с сервера
	 * @returns {Observable<any>} Возвращаемый объект для помещения в поток обработки HTTP
	 * @memberof RequestsService
	 */
	private checkError(err: HttpErrorResponse) {
		if(err.status === 401){
			this.router.navigate([ './', compRoutes.auth ], {queryParams: {accessDenide: true} });
			return of(undefined); 
		}
		return throwError(err);
	}

	/**
	 * Выполняет запрос GET. В случае ошибки 401 Unauthorized перебрасывает на страницу логина
	 *
	 * @template T
	 * @param {string} [subUrl=''] Подстрока запроса. Считается, что URL обращается в URL API морды сайта
	 * @returns {Observable<T>} Результат запроса
	 * @memberof RequestsService
	 */	
	public get<T>(subUrl: string = ''): Observable<T> {
		return this.http.get<T>(subUrl)
			.pipe(
				map( (data: T) => data ),
				retry(3),
				catchError(this.checkError)
			);
	}

	/**
	 * Выполняет запрос POST. В случае ошибки 401 Unauthorized перебрасывает на страницу логина
	 *
	 * @template T
	 * @param {string} [subUrl=''] Подстрока запроса. Считается, что URL обращается в URL API морды сайта
	 * @param {*} [data={}] Данные запроса
	 * @returns {Observable<T>} Результат запроса
	 * @memberof RequestsService
	 */	
	public post<T>(subUrl: string = '', data: any = {}): Observable<T> {
		return this.http.post<T>(subUrl, data)
			.pipe(
				map( (data: T) => data ),
				retry(3),
				catchError(this.checkError)
			);
	}

	/**
	 * Выполняет запрос PUT. В случае ошибки 401 Unauthorized перебрасывает на страницу логина
	 *
	 * @template T
	 * @param {string} [subUrl=''] Подстрока запроса. Считается, что URL обращается в URL API морды сайта
	 * @param {*} [data={}] Данные запроса
	 * @returns {Observable<T>} Результат запроса
	 * @memberof RequestsService
	 */	
	public put<T>(subUrl: string = '', data: any = {}): Observable<T> {
		return this.http.put<T>(subUrl, data)
			.pipe(
				map( (data: T) => data ),
				retry(3),
				catchError(this.checkError)
			);
	}


	/**
	 * Выполняет запрос DELETE. В случае ошибки 401 Unauthorized перебрасывает на страницу логина
	 *
	 * @template T
	 * @param {string} [subUrl=''] Подстрока запроса = <ссылка сервиса>/id. URL обращается в URL API морды сайта
	 * @param {string} id ID удаляемого элемента. Переводим в string, т.к. очень большие значения индексов округляются JS-ом
	 * @returns {Observable<T>} Результат запроса -- удаленный элемент
	 * @memberof RequestsService
	 */
	public delete<T>(subUrl: string = '', id: string): Observable<T> {
		return this.http.delete<T>(`${subUrl}/${id}`)
			.pipe(
				map( (data: T) => data ),
				retry(3),
				catchError(this.checkError)
			);
	}
}