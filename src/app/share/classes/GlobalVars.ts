import { environment } from '../../../environments/environment';
import { StringKeyObject } from '../models/type';

/**
 * Класс, предназначенный для хранения глобальных переменных приложения.
 * Изначально хранит в себе предустановленные константы, которые сервис SettingsService загружает в себя, 
 * а затем после запуска приложения подчитывает данные из таблицы settings.
 * 
 * @author Сергей Веленгура
 * @export
 * @class GlobalVars
 */
export class GlobalVars {
	/** Массив предустановленных констант приложения */
	private data: StringKeyObject = {
		siteName: 'Alex site',						// Титул в названиии сайта

		'urlKeyStart': environment.url.start,		// URL ключ начала диапазона, выдаваемого запросом
		'urlKeyLimit': environment.url.limit,		// URL ключ длинны диапазона, выдаваемого запросом
		'urlKeySort': environment.url.sort,			// URL ключ по какому полю сортируется выборка
		'urlKeyOrder': environment.url.order,		// URL ключ направления сортировки. ASC/DESC. ASC по умолчанию
		'urlKeyField': 'field',						// URL ключ по какому полю производится поиск
		'urlKeyfilter': 'f',						// URL ключ строки поиска
		'urlKeyField2': 'field2',					// URL дополнительный ключ по какому полю производится поиск
		'urlKeyfilter2': 'f2',						// URL дополнительный ключ строки поиска


		showBreadcrumbs: true,						// Показать/спрятать хлебные крошки
		startListLen: 20,							// + Количество начально запрашиваемых элементов в больших списках
		autocompleteListLen: 20,					// + Количество начально запрашиваемых элементов в списках автокомплит поиска
		listIncrement: 20,							// + Количество элементов в подчитываемом списке
		readScrollDistance: 1,						// + *10% от размера контейнера, когда начинается подчитывание данных
		readScrollThrottle: 300,					// + Пауза перед началом подчитывания данных
		liveSearchDelay: 1000,						// + Задержка в Мс. при живом поиске
		rtfWidgetCount: 3,							// + Количество элементов, в виджетах входящих сообщений: запросы на оценку, меня оценили, входящие сообщения и т.п.
		refreshTaskInterval: 60000,					// + Интервал перечитывания списка задач. MS
		snackBarDuration: 3000,						// + Задержка закрытия снекбаров, выводящих сообщения

		minLengthPassword: 6,						// + Минимальная длинна пароля
		minLengthTextInput: 3,						// + Минимальная длинна текстового ввода. Для валидаторов

		// Диалоги ----------------------------------------------------------
		// Confirm
		dlgConfirmMaxWidth: 300,							// + Максимальная ширина confirm диалога
		dlgConfirmMinWidth: 150,

		// Cropper
		// dlgCropperMaxWidth: 600,							// + Максимальная ширина диалога кроппера фото
		// dlgCropperMaxHeight: 800,						// + Максимальная высота диалога кроппера фото

		// Division Select
		dlgDivisSelectWidth: '600px',						// + Ширина диалога выбора предприятия (В стандартах CSS. px по умолчанию)
		dlgDivisSelectHeight: '90vh',						// + Высота диалога выбора предприятия (В стандартах CSS. px по умолчанию)
		dlgDivisSelectTitle: 'Выбор подразделения',

		rightWidgetWidth: 400								// Ширина правого виджета поиска и добавления элементов в группы
	};

	/**
	 * Возвращает значение константы приложения. 
	 *
	 * @param {string} key Ключ переменной приложения
	 * @returns {*} Значение константы приложения
	 * @memberof GlobalVars
	 */
	get(key: string): any {
		if (this.data[key] === undefined) {
			throw new Error("Settings key not found!");
		} else {
			return this.data[key];
		}
	}


	/**
	 * Клонирует содержимое настроек
	 *
	 * @returns
	 * @memberof GlobalVars
	 */
	cloneData() {
		return Object.assign({}, this.data);
	}
}
