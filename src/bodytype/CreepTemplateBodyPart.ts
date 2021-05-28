export class CreepTemplateBodyPart {

    public name: BodyPartConstant
    public value: number
    public fixed: boolean

    constructor(name: BodyPartConstant, value: number, fixed = false) {
        this.name = name
        this.value = value
        this.fixed = fixed
    }
}
