// This file is part of charto-3d, copyright (C) 2016 BusFaster Ltd.
// Released under the MIT license, see LICENSE.

import {Thing} from './Thing';

export class Scene {
	constructor() {}

	addThing(thing: Thing) { this.thingList.push(thing); }

	thingList: Thing[] = [];
}
