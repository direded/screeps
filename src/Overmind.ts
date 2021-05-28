import { BuilderRole, HarvesterRole, UpgraderRole } from "roles"

import { CreepTemplate, CreepTemplateBodyPart } from "bodytype"
import { HarvestTask } from "tasks"

const creepMax: { [key: string]: number } = {
	harvester: 2,
	builder: 1,
	upgrader: 3
}

const creepRole: { [key: string]: CreepRole } = {
	harvester: new HarvesterRole(),
	upgrader: new UpgraderRole(),
	builder: new BuilderRole(),
}

const creepRolePriority = ["harvester", "upgrader", "builder"]

const creepRoleBody: { [key: string]: CreepTemplate } = {
	harvester: new CreepTemplate(1, true, [
		new CreepTemplateBodyPart(WORK, 1),
		new CreepTemplateBodyPart(CARRY, 1, true),
	]),
	upgrader: new CreepTemplate(0.5, false, [
		new CreepTemplateBodyPart(WORK, 1),
		new CreepTemplateBodyPart(CARRY, 1, true),
	]),
	builder: new CreepTemplate(0.5, false, [
		new CreepTemplateBodyPart(WORK, 1),
		new CreepTemplateBodyPart(CARRY, 1, true),
	])
}

export class Overmind {

	public static update(room: Room): void {
		this.initMemory()

		const creepCounter: any = {
			harvester: 0 as number,
			upgrader: 0 as number,
			builder: 0 as number
		}

		let hTask = new HarvestTask(null!)
		for (let name in Game.creeps) {
			let creep = Game.creeps[name]
			if (creep.memory.role! == "harvester") {
				hTask.creep = creep
				hTask.update()
			} else {
				creepRole[creep.memory.role!].update(creep)
			}
			creepCounter[creep.memory.role!]++
		}

		let spawn = room.find(FIND_MY_SPAWNS)[0]
		let spawnInfo = this.getSpawnEnergyInfo(spawn)
		if (!spawn.spawning && (spawnInfo.current == spawnInfo.max || creepCounter["harvester"] <= 0)) {
			for (let i = 0; i < creepRolePriority.length; i++) {
				let priority = creepRolePriority[i]
				if (creepCounter[priority] < creepMax[priority]) {
					let body = creepRoleBody[priority].buildCreepBody(spawnInfo.current)
					if (body == null) {
						console.log("Can't spawn " + priority)
						break
					}
					if (spawn.spawnCreep(body, `${priority} #${Game.time}`, { memory: { role: priority } }) == 0)
						break
				}
			}
		}
	}

	private static getSpawnEnergyInfo(spawn: StructureSpawn): { max: number, current: number } {
		let info = { current: spawn.store.getUsedCapacity(RESOURCE_ENERGY), max: spawn.store.getCapacity(RESOURCE_ENERGY) }
		for (let exp of spawn.room.find<StructureExtension>(FIND_MY_STRUCTURES, { filter: s => s.structureType == STRUCTURE_EXTENSION })) {
			info.current += exp.store.getUsedCapacity(RESOURCE_ENERGY)
			info.max += exp.store.getCapacity(RESOURCE_ENERGY)
		}
		return info
	}

	private static initMemory() {
		Memory.tasks = Memory.tasks ?? {}
	}

}

