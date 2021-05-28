export abstract class Task<MemoryType> {
	public abstract get type(): string
	public abstract update(): void
	public get memory(): MemoryType {
		return <MemoryType><unknown>Memory.tasks[this.type]
	}
}
