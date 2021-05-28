import { CreepTemplateBodyPart } from "./CreepTemplateBodyPart"

export class CreepTemplate {

	private moveValue: number
	private moveFixed: boolean
	private parts: CreepTemplateBodyPart[]

	constructor(moveValue: number, moveFixed: boolean, parts: CreepTemplateBodyPart[]) {
		this.moveValue = moveValue
		this.moveFixed = moveFixed
		this.parts = parts
	}

	buildCreepBody(energy: number) {
		var partsCount: { [key in BodyPartConstant]?: number } = {}
		var fixedCost = 0, fixedCount = 0
		var ratioSum = 0, ratioCostSum = 0
		var dynamicParts: CreepTemplateBodyPart[] = []
		var mainPart = null
		for (let i = 0; i < this.parts.length; i++) {
			const el = this.parts[i]
			if (el.fixed) {
				fixedCost += BODYPART_COST[el.name]
				fixedCount++
				partsCount[el.name] = el.value
			}
			else {
				if (mainPart == null)
					mainPart = el
				var ratio = el.value / mainPart.value
				dynamicParts.push(el)
				ratioSum += ratio
				ratioCostSum += ratio * BODYPART_COST[el.name]
			}
		}
		let m = 0
		if (this.moveFixed) {
			m = this.moveValue
		}
		else {
			m = Math.ceil((energy - fixedCost + fixedCount * ratioCostSum) / (ratioCostSum / (this.moveValue * ratioSum) + BODYPART_COST[MOVE]))
		}
		// var main = Math.ceil((m / this.moveValue - fixedCount) / ratioSum)
		var total = energy - fixedCost - m * BODYPART_COST[MOVE]
		// now total excludes cost of fixed bodyparts
		var dynamicCost = 0
		for (const part of dynamicParts) {
			partsCount[part.name] = Math.floor(part.value * total / BODYPART_COST[part.name])
			dynamicCost += partsCount[part.name]! * BODYPART_COST[part.name]
		}
		var body = []
		for (const part of this.parts) {
			for (let i = 0; i < partsCount[part.name]!; i++) {
				body.push(part.name)
			}
		}
		for (let i = 0; i < m; i++) {
			body.push(MOVE)
		}
		if (dynamicCost != total)
			console.log(`Extra energy: ${dynamicCost}`, body)
		return body
	}
}
