import { ErrorMapper } from "utils/ErrorMapper"

import { Overmind } from "roles"

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
	Overmind.update(Game.spawns["Spawn1"].room)

	// Automatically delete memory of missing creeps
	for (const name in Memory.creeps) {
		if (!(name in Game.creeps)) {
			delete Memory.creeps[name]
		}
	}
})
