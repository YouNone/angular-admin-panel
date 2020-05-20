import { compRoutes } from 'src/app/share/models/type';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
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

	constructor(
		private router: Router,
		private authService: AuthService
	) { }

	public headerToggler() {		
		this.clickState = !this.clickState;
		this.clickChange.emit(this.clickState);
	}

	ngOnInit() {
	}

	logout() {
		this.authService.logout()
		this.router.navigate([compRoutes.auth]);
	}

}
