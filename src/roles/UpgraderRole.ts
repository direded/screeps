export class UpgraderRole implements CreepRole {

	public create(spawn: StructureSpawn): number {
		return spawn.spawnCreep([WORK, CARRY, MOVE], "Upgrader #" + Game.time, { memory: { role: "upgrader" } })
	}

	public update(creep: Creep): void {
		if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.upgrading = false
			creep.say('🔄 harvest')
		}
		if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
			creep.memory.upgrading = true
			creep.say('⚡ upgrade')
		}

		if (creep.memory.upgrading) {
			if (creep.upgradeController(creep.room.controller!) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller!, { visualizePathStyle: { stroke: '#ffffff' } })
			}
		} else {
			let sources = creep.room.find(FIND_SOURCES)
			if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } })
			}
		}
	}

}
