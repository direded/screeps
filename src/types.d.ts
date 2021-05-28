// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
	role?: string
	room?: string
	working?: boolean
	// [key: string]: any

	upgrading?: boolean
	building?: boolean
}

interface RoomMemory {
	energy_sources?: { [key: string]: EnergySourceMemory }
	// [key: string]: any
}

interface Memory {
	tasks: { [key: string]: [TaskMemory] }
}

interface EnergySourceMemory {

}

// `global` extension samples
declare namespace NodeJS {
	interface Global {
		log: any
	}
}

// Other

interface CreepRole {
	update(creep: Creep): void
	create(spawn: StructureSpawn): number
}

interface TaskMemory {

}

interface HarvestTaskMemory extends TaskMemory {
	target?: Id<HarvestTask.Target>
}

declare namespace HarvestTask {
	type TargetStorage = StructureExtension | StructureSpawn | StructureTower
	type Target = Source | TargetStorage
}
