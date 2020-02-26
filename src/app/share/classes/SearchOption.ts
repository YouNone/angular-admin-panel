import { ISearchOptions, ESort } from '../models/type';
import { SettingService } from '../services/settings.service';


/**
 * Класс преобразования объекта запроса в строку параметров обращения к бэкэнду.
 *
 * @export
 * @class SearchOptions
 * @implements {ISearchOptions}
 */
export class SearchOptions implements ISearchOptions {
	settings: SettingService;
	start: number;
	limit: number;
	sort: string;
	order: ESort;
	f: string;
	field: string;
	f2?: string;
	field2?: string;

	/**
     * Создает объект преобразования объекта запроса в строку запроса.
     * 
     * @param {ISearchOptions} income Объект запроса.
     * @param {SettingService} $SETTINGS Объект настроек приложения
     * @memberof SearchOptions
     */
    constructor(income: ISearchOptions, $SETTINGS: SettingService){
		this.settings = $SETTINGS
		this.start = income.start || 0;
		this.limit = income.limit || 50;
		if(income.sort) this.sort = income.sort;
		if(income.order) this.order = income.order;
		if(income.f) this.f = income.f;
		if(income.field) this.field = income.field;
		if(income.f2) this.f2 = income.f2;
		if(income.field2) this.field2 = income.field2;
	}


	/**
     * Возвращает строку парметров запроса
     *
     * @returns {string}
     * @memberof SearchOptions
     */
    getUrl(): string {
		let addCond: string[] = [];

		addCond.push(`${this.settings.get('urlKeyStart')}=${this.start}`);
		addCond.push(`${this.settings.get('urlKeyLimit')}=${this.limit}`);

		if (this.sort) addCond.push(`${this.settings.get('urlKeySort')}=${this.sort}`);

		if (this.order){
			addCond.push(`${this.settings.get('urlKeyOrder')}=${this.order === ESort.asc ? ESort.asc : ESort.desc}`);	
		}

		if (this.f) {
			this.f = encodeURI(this.f);
			addCond.push(`${this.settings.get('urlKeyfilter')}=${this.f}`);
			if (this.field) addCond.push(`${this.settings.get('urlKeyField')}=${this.field}`);
		}
		
		if (this.f2) {
			this.f2 = encodeURI(this.f2);
			addCond.push(`${this.settings.get('urlKeyfilter2')}=${this.f2}`);
			if (this.field2) addCond.push(`${this.settings.get('urlKeyField2')}=${this.field2}`);
		}

		let paramStr = addCond.join('&');
		return paramStr;
	}
}