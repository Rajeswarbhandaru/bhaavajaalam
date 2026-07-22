export class MentorSystem {
  getPrompt(failures, failureCatalog) {
    if (!failures.length) return 'Your design passed the test. Which system gave the biggest performance advantage?';
    const first = failureCatalog.find(item => item.id === failures[0].id);
    return first?.mentor || 'What system changed the vehicle behavior most strongly?';
  }
}