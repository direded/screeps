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

	buildCreepBody(energy: number): BodyPartConstant[] | null {
		let partsCount: { [key in BodyPartConstant]?: number } = {}
		let fixedCost = 0, fixedCount = 0
		let ratioSum = 0, ratioCostSum = 0
		let dynamicParts: CreepTemplateBodyPart[] = []
		let mainPart = null
		for (const el of this.parts) {
			if (el.fixed) {
				fixedCost += el.value * BODYPART_COST[el.name]
				fixedCount += el.value
				partsCount[el.name] = el.value
			} else {
				if (mainPart == null)
					mainPart = el
				let ratio = el.value / mainPart.value
				dynamicParts.push(el)
				ratioSum += ratio
				ratioCostSum += ratio * BODYPART_COST[el.name]
			}
		}
		let m = 0
		if (this.moveFixed) {
			m = this.moveValue
		} else {
			m = Math.ceil((energy - fixedCost + fixedCount * ratioCostSum) / (ratioCostSum / (this.moveValue * ratioSum) + BODYPART_COST[MOVE]))
		}
		// let main = Math.ceil((m / this.moveValue - fixedCount) / ratioSum)
		let total = energy - fixedCost - m * BODYPART_COST[MOVE]
		// now total excludes cost of fixed bodyparts
		let dynamicCost = m * BODYPART_COST[MOVE]
		for (const part of dynamicParts) {
			partsCount[part.name] = Math.floor(part.value * total / BODYPART_COST[part.name])
			if (partsCount[part.name] == 0) {
				return null
			}
			dynamicCost += partsCount[part.name]! * BODYPART_COST[part.name]
		}
		let body: BodyPartConstant[] = []
		for (const part of this.parts) {
			for (let i = 0; i < partsCount[part.name]!; i++) {
				body.push(part.name)
			}
		}
		for (let i = 0; i < m; i++) {
			body.push(MOVE)
		}
		console.log(`Body calculated. Energy: ${energy}, body cost: ${dynamicCost + fixedCost}, body: ${body}`)
		return body
	}
}
