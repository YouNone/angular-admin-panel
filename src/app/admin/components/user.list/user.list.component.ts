import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SettingService } from 'src/app/share/services/settings.service';
import { MsgList } from 'src/app/share/services/msg.list';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { DialogService } from 'src/app/share/services/dialog.service';
import { compRoutes, IUser } from 'src/app/share/models/type';
import { ListComponentsClass } from 'src/app/share/classes/ListComponents';
import { UserEditComponent } from '../user.edit/user.edit.component';

@Component({
  selector: 'user.list',
  templateUrl: './user.list.component.html',
  styleUrls: ['./user.list.component.css']
})
export class UserListComponent extends ListComponentsClass<IUser> {

  constructor(
    public $SETTINGS: SettingService,
    public router: Router,
    public $MSG: MsgList,
    public listService: UniversalDataService,
    public dialogService: DialogService
  ) {
    super($SETTINGS, router, $MSG, listService, dialogService);
    this.displayedColumns = ['full_name', 'login', 'email', 'action'];
    this.editUrl = compRoutes.userEdit;
    this.dataUrl = compRoutes.user;
    this.listService.setServiceUrl(this.dataUrl);
  }
  
	onChildDeactivate(compRef: UserEditComponent) {
		if (compRef instanceof UserEditComponent) {
			this.getChangedItemToList(compRef);
		}
	}
}
