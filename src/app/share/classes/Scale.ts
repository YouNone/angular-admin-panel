import { IScale, EScaleType, IScaleDiapasone, IScaleEnumItem } from '../models/type';

export class Scale implements IScale {
	id?: string;	
	name: string;
	code: string;
	/** тип шкалы */
	type?: EScaleType;
	scale?: IScaleDiapasone | IScaleEnumItem[];
	/** Дата создания */
	date_create?: string;
	/** Дата последнего изменения */
	date_modify?: string;


	constructor(
		data: Scale = <Scale>{}
	) {
		this.id = data.id || undefined;
		this.name = data.name || '';
		this.code = data.code || '';
		this.type = data.type || EScaleType.diapasone;
		this.scale = data.scale || {min: 0, max: 100, step: 1};
		this.date_create = data.date_create || undefined;
		this.date_modify = data.date_modify || undefined;
	}
 }