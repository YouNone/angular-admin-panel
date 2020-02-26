import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ButtonsSet } from '../models/type';
import { SettingService } from './settings.service';
import { DialogConfirmComponent } from '../components/dialog.confirm/dialog.confirm.component';
import { DialogButtonConfig } from '../utilit/dialog.button.config';

@Injectable({
	providedIn: 'root'
})

export class DialogService {
	constructor(
		public dialog: MatDialog,
		public $SETTINGS: SettingService,
	) { }

	openConfirm(msg: string, title: string = "", btn: ButtonsSet = DialogButtonConfig.YesNo): Observable<boolean> {
		const dialogRef = this.dialog.open(DialogConfirmComponent, {
			maxWidth: this.$SETTINGS.get("dlgConfirmMaxWidth"),
			minWidth: this.$SETTINGS.get("dlgConfirmMinWidth"),
			disableClose: true,
			data: {
				msg: msg,
				btn: btn,
				title: title,
			}
		});
		return dialogRef.afterClosed()
			.pipe(
				map((res: any): boolean => res === true ? true : false)
			);
	}
}