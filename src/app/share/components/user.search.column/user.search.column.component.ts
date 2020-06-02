import { User } from 'src/app/share/classes/User';
import { Component } from '@angular/core';
import { UniversalDataService } from '../../services/universal.data.service';
import { IUserWithPosition } from '../../models/type';
import { SettingService } from '../../services/settings.service';
import { slideFromRight } from '../../animations/animations';
import { ItemsSearchColumnClass } from '../../classes/items.search.column.class';
import { MsgList } from '../../services/msg.list';


/**
 * Компонент-виджет поиска пользователей. Родительский компонент, который вызывает виджет передает в него список своих элементов.
 * Виджет производит поиск данных и выводит результаты поиска собственном списке. Если найденные элементы есть и в родительском 
 * компоненте, то они помечаются как выделенные. Если кликнуть по элементу списка в виджете, то генерируется событие, которое
 * возвращает выбранный элемент списка и состояние выбрано / не выбрано. Родитель может добавить / удалить этот элемент у себя. 
 *
 * @export
 * @class UserSearchColumnComponent
 * @implements {OnInit}
 * @implements {OnChanges}
 */
@Component({
	selector: 'user-search-column',
	templateUrl: './user.search.column.component.html',
	styleUrls: ['./user.search.column.component.scss'],
	animations: [slideFromRight]
})
export class UserSearchColumnComponent extends ItemsSearchColumnClass {
	constructor(
		public $SETTINGS: SettingService,
		public data: UniversalDataService,
		public $MSG: MsgList
	) { 
		super($SETTINGS, data, $MSG);
	}


	/**
	 * Формирует строку информации о записи , на которой стоит указатель мыши для показа тултипа
	 *
	 * @param {User} item Ссылка на объект для которого ренерируется строка
	 * @returns {string} Строка сообщения toolTip
	 * @memberof UserSearchColumnComponent
	 */
	getItemInfo(item: User): string {
		return item.name + '\n' + item.login;
	}

}
