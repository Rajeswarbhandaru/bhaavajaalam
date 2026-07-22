export class MissionFactory {
  create(definition) {
    return { ...definition, status: 'planning' };
  }
}
