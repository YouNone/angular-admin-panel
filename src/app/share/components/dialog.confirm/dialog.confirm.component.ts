import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogButtonConfig } from '../../utilit/dialog.button.config';


@Component({
	selector: 'dialog-confirm',
	templateUrl: './dialog.confirm.component.html',
	styleUrls: ['./dialog.confirm.component.scss']
})
export class DialogConfirmComponent {
	constructor(
		public dialogRef: MatDialogRef<DialogConfirmComponent>,
		@Inject(MAT_DIALOG_DATA) public data: DialogButtonConfig
	) {
	 }
}
