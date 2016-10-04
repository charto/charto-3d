import {Thing} from './Thing';

export class Scene {
	constructor() {}

	addThing(thing: Thing) { this.thingList.push(thing); }

	thingList: Thing[] = [];
}
