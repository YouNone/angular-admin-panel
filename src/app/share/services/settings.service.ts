import { HttpClient } from '@angular/common/http';
import { StringKeyObject } from './../models/type';
import { Injectable } from '@angular/core';

import { GlobalVars } from '../classes/GlobalVars';
import { MsgList } from './msg.list';



interface ISettingsArrayItem {
	code: string;
	value: string;
}

/**
 * Сервис, предназначенный для хранения глобальных переменных приложения.
 * Изначально хранит в себе предустановленные константы, которые, после загрузки приложения подчитывает из
 * таблицы settings.
 * 
 */
export class SettingService {
	/** Массив констант приложения */
	private data: StringKeyObject = {};

	constructor(
	) {
		const globalVars = new GlobalVars();
		this.data = globalVars.cloneData();
	}

	/**
	 * Возвращает значение константы приложения. 
	 *
	 * @param {string} key Ключ переменной приложения
	 * @returns {*} Значение константы приложения
	 * @memberof SettingService
	 */
	get(key: string): any {
		if (this.data[key] === undefined) throw new Error("Settings key not found!");
		return this.data[key];
	}

	/**
	 * Устанавливает значение константы приложения. 
	 *
	 * @param {string} key Ключ константы в массиве
	 * @param {string} val Значение переменной приложения
	 * @memberof SettingService
	 */
	set(key: string, val: string) {
		this.data[key] = val;
	}

	/**
	 * Производит апдейт списка переменных класса входящим списком.
	 *
	 * @param {StringKeyObject} income Объект с новыми данными. {keyName: kayValue, ....}
	 * @memberof SettingService
	 */
	update(income: StringKeyObject) {
		this.data = Object.assign(this.data, income);
	}

}
