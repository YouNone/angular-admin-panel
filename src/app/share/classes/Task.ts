import { ITask, ETaskTypeStart } from '../models/type';

export class Task implements ITask {
	/** id */
	id: string;
	/** Код */
	code?: string;
	/** Название */
	name: string;
	/** дата создания */
	date_create?: string;
	/** дата редактирования */
	date_modify?: string;
	/** дата выполнения */
	date_execute?: string;
	/** Период выполнения */
	type_start?: ETaskTypeStart;
	/** Дата начала запуска */
	date_start?: string;
	/** Дата окончания запуска */
	date_end?: string;
	/** Запускать с / Время запуска */
	time_start?: string;
	/** Запускать по */
	time_end?: string;
	/** Периодичность запуска (мин) / В день: */
	execute_point?: string;
	/** Код монако */
	script?: string;
	constructor(
		data: ITask = <ITask>{}
	) {
		this.id = data.id || undefined;
		this.name = data.name || '';
		this.code = data.code || '';
		this.date_execute = data.date_execute || '';
		this.type_start = data.type_start || undefined;
		this.script = data.script || '';
		this.execute_point = data.execute_point || '';

		this.date_create = data.date_create || undefined;
		this.date_modify = data.date_modify || undefined;
		this.date_start = data.date_start || undefined;
		this.date_end = data.date_end || undefined;
		this.time_start = data.time_start || undefined;
		this.time_end = data.time_end || undefined;
	}
}
