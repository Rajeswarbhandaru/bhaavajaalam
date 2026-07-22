export class PartFactory {
  create(definition) {
    return { ...definition, installed: false };
  }
}