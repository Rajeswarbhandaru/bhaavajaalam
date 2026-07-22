export class Store {
  constructor(initialState) { this.state = structuredClone(initialState); }
  getState() { return this.state; }
  patch(partial) { this.state = { ...this.state, ...partial }; return this.state; }
}