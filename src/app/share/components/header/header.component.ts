import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	/** Событие нажатия кнопки и изменения состояния navBar */
	@Output() clickChange: EventEmitter<boolean> = new EventEmitter();
	/** Состояние открыто/закрыто меню */
	private clickState: boolean = true;

	constructor() { }

	public headerToggler() {		
		this.clickState = !this.clickState;
		this.clickChange.emit(this.clickState);
	}

	ngOnInit() {
	}

}
