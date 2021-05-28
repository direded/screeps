import { BuilderRole, HarvesterRole, UpgraderRole } from "roles"

const creepMax: { [key: string]: number } = {
	harvester: 2,
	builder: 6,
	upgrader: 2
}

const creepRole: { [key: string]: CreepRole } = {
	harvester: new HarvesterRole(),
	upgrader: new UpgraderRole(),
	builder: new BuilderRole(),
}

const creepRolePriority = ["harvester", "upgrader", "builder"]

export class Overmind {

	public static update(room: Room): void {
		room.memory = room.memory || {}
		let memory = room.memory

		memory.energy_sources = memory.energy_sources || {}
		for (let source of room.find(FIND_SOURCES)) {
			memory.energy_sources[source.id as string] = memory.energy_sources[source.id as string] || {}
		}

		const creepCounter: any = {
			harvester: 0 as number,
			upgrader: 0 as number,
			builder: 0 as number
		}

		for (let name in Game.creeps) {
			let creep = Game.creeps[name]
			creepRole[creep.memory.role!].update(creep)
			creepCounter[creep.memory.role!]++
		}
		let spawn = room.find(FIND_MY_SPAWNS)[0]
		if (!spawn.spawning) {
			for (let i = 0; i < creepRolePriority.length; i++) {
				let priority = creepRolePriority[i]
				console.log("A: " + creepCounter[priority] + " " + creepMax[priority])

				if (creepCounter[priority] < creepMax[priority]) {
					console.log("B")
					if (creepRole[priority].create(spawn) == 0)
						break
				}
			}
		}

	}

}
