import { Builder, Harvester, Upgrader } from "."

const config = {
	harvesters: 2,
	builders: 2,
	upgraders: 2
}

const creepUpdater: { [key: string]: (creep: Creep) => void } = {
	harvester: Harvester.update,
	upgrader: Upgrader.update,
	builder: Builder.update,
}

export class Overmind {

	public static update(room: Room): void {
		room.memory = room.memory || {}
		let memory = room.memory

		memory.energy_sources = memory.energy_sources || {}
		for (let source of room.find(FIND_SOURCES)) {
			memory.energy_sources[source.id as string] = memory.energy_sources[source.id as string] || {}
		}

		for (let name in Game.creeps) {
			let creep = Game.creeps[name]
			let role = creep.memory.role || ""
			creepUpdater[role](creep)
		}

	}

}
