export class BuilderRole implements CreepRole {

	public create(spawn: StructureSpawn): number {
		return spawn.spawnCreep([WORK, CARRY, MOVE], "Builder #" + Game.time, { memory: { role: "builder" } })
	}

	public update(creep: Creep): void {
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false
			creep.say('🔄 harvest')
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true
			creep.say('🚧 build')
		}

		if (creep.memory.building) {
			let targets = creep.room.find(FIND_CONSTRUCTION_SITES)
			targets = _.sortBy(targets, (t) => creep.pos.getRangeTo(t))
			if (targets.length) {
				if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } })
				}
			}
		} else {
			let sources = creep.room.find(FIND_SOURCES)
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
			}
		}
	}

}
