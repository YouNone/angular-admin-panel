import { Component, OnInit } from '@angular/core';


/**
 * Страница 404. Выводит сообщение о ошибке 
 * и предлагает перейти на главную страницу.
 *
 * @export
 * @class NotFoundComponent
 */
@Component({
	selector: 'not.found',
	templateUrl: './not.found.component.html',
	styleUrls: ['./not.found.component.scss']
})
export class NotFoundComponent {

	constructor() { }

}
