export class HarvesterRole implements CreepRole {

	public create(spawn: StructureSpawn): number {
		return spawn.spawnCreep([WORK, CARRY, MOVE], "Harvester #" + Game.time, { memory: { role: "harvester" } })
	}

	public update(creep: Creep): void {
		if (creep.store.getFreeCapacity() > 0) {
			let source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
			if (source == null)
				return
			if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
				creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
			}
		} else {
			let targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN ||
						structure.structureType == STRUCTURE_TOWER) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
				}
			})
			if (targets.length > 0) {
				if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } })
				}
			}
		}
	}

}
