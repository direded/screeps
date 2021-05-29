import { Task } from "./Task";

type Target = Source | StructureExtension | StructureSpawn | StructureTower | undefined

export class HarvestTask extends Task<HarvestTaskMemory> {
	public static type: string = "harvest"

	public get type(): string {
		return HarvestTask.type
	}

	public get target(): HarvestTask.Target | null {
		return Game.getObjectById(this.memory.target!)
	}

	public set target(value: HarvestTask.Target | null) {
		this.memory.target = value!.id
	}

	public creep: Creep

	constructor(creep: Creep) {
		super()
		this.creep = creep
	}

	public update(): void {
		if (this.creep.store.getFreeCapacity() > 0) {
			let source = this.creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
			if (source == null) {
				this.creep.say("😒 no active sources")
				this.creep.moveTo(Game.flags["AFK"])
				return
			}
			this.creep.say("⛏ harvesting")
			if (this.creep.harvest(source as Source) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } })
			}
		} else {
			let target
			let targets = this.creep.room.find<HarvestTask.TargetStorage>(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION ||
						structure.structureType == STRUCTURE_SPAWN ||
						structure.structureType == STRUCTURE_TOWER) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
				}
			})
			if (targets.length > 0) {
				this.creep.say("storage found")
				target = targets[0]
			} else {
				this.creep.moveTo(Game.flags["AFK"])
				return
			}
			this.creep.say("📦 moving to storage")
			if (this.creep.transfer(target as HarvestTask.TargetStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } })
			}
		}
	}


}
