import { Component, OnInit } from '@angular/core';
import { ListComponentsClass } from 'src/app/share/classes/ListComponents';
import { ITask, compRoutes } from 'src/app/share/models/type';
import { TaskEditComponent } from '../task.edit/task.edit.component';
import { DialogService } from 'src/app/share/services/dialog.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { UniversalDataService } from 'src/app/share/services/universal.data.service';
import { SettingService } from 'src/app/share/services/settings.service';
import { MsgList } from 'src/app/share/services/msg.list';

@Component({
  selector: 'task.list',
  templateUrl: './task.list.component.html',
  styleUrls: ['./task.list.component.css']
})
export class TaskListComponent extends ListComponentsClass<ITask> {

  constructor(
    public $MSG: MsgList,
		public $SETTINGS: SettingService,
		public listService: UniversalDataService,
		public $NOTE: NotificationsService,
		public router: Router,
		public dialogService: DialogService
  ) {
    super($SETTINGS, router, $MSG, listService, dialogService);
		this.displayedColumns = ['code', 'name', 'date_execute', 'type_start', 'action'];
		this.editUrl = compRoutes.taskEdit;
		this.dataUrl = compRoutes.task;
		this.listService.setServiceUrl(this.dataUrl);		
   }

   onChildDeactivate(compRef: TaskEditComponent) {
		if (compRef instanceof TaskEditComponent) {
			this.getChangedItemToList(compRef);
		}
	}

}
