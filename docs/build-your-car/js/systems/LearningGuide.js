export class LearningGuide {
  constructor(pathways, parts) {
    this.pathways = pathways || [];
    this.parts = parts || [];
    this.partMap = new Map(this.parts.map(part => [part.id, part]));
  }

  normalizeLevel(level) {
    const n = Number(level);
    return Number.isFinite(n) ? n : 1;
  }

  getLevelModel(level) {
    const safeLevel = this.normalizeLevel(level);
    return this.pathways.find(item => Number(item.level) === safeLevel) || this.pathways[0] || null;
  }

  getProgress(level, installedIds) {
    const safeLevel = this.normalizeLevel(level);
    const model = this.getLevelModel(safeLevel);
    const installed = new Set(installedIds || []);
    if (!model) return null;

    if (safeLevel === 1) {
      const steps = (model.steps || []).map(step => {
        const complete = (step.partIds || []).some(id => installed.has(id));
        return { ...step, complete };
      });

      const done = steps.filter(step => step.complete).length;
      const total = steps.length;
      const nextStep = steps.find(step => !step.complete) || null;
      const missingMinimum = this.getMinimumMissing(installedIds);

      return {
        mode: 'minimum',
        level: safeLevel,
        title: model.title,
        intro: model.intro,
        steps,
        checks: model.checks || [],
        done,
        total,
        percent: total ? Math.round((done / total) * 100) : 0,
        nextStep,
        missingMinimum,
        calloutTone: missingMinimum.length ? 'warn' : 'good',
        calloutText: missingMinimum.length
          ? `Missing for a working car: ${missingMinimum.join(', ')}`
          : 'Minimum working car complete. The car now has the basic systems it needs.',
        summary: nextStep
          ? `${nextStep.icon} Next: ${nextStep.title} — ${nextStep.explanation}`
          : '🎉 Great job. Your minimum working car recipe is complete.'
      };
    }

    const groups = (model.featureGroups || []).map(group => {
      const installedCount = (group.partIds || []).filter(id => installed.has(id)).length;
      return {
        ...group,
        installedCount,
        total: (group.partIds || []).length,
        complete: installedCount > 0
      };
    });

    const done = groups.filter(group => group.complete).length;
    const total = groups.length;
    const nextGroup = groups.find(group => !group.complete) || null;
    const missingMinimum = this.getMinimumMissing(installedIds);
    const baseReady = missingMinimum.length === 0;

    const levelMessages = {
      2: baseReady
        ? 'Base car is ready. Now add comfort, safety, and smart features.'
        : 'Build the base working car first, then add comfort and smart features.',
      3: baseReady
        ? 'Base car is ready. Now add grip, adventure gear, and stronger performance parts.'
        : 'Build a strong base car first, then add speed and adventure upgrades.'
    };

    return {
      mode: 'features',
      level: safeLevel,
      title: model.title,
      intro: model.intro,
      groups,
      done,
      total,
      percent: total ? Math.round((done / total) * 100) : 0,
      nextStep: nextGroup,
      missingMinimum,
      baseReady,
      calloutTone: baseReady ? 'good' : 'warn',
      calloutText: levelMessages[safeLevel] || 'Build the base car first, then add upgrades.',
      summary: nextGroup
        ? `${nextGroup.icon} Try adding a ${nextGroup.title.toLowerCase()} part next.`
        : '🎉 Excellent. This level has all major learning groups covered.'
    };
  }

  getMinimumMissing(installedIds) {
    const model = this.getLevelModel(1);
    const installed = new Set(installedIds || []);
    if (!model) return [];

    return (model.minimumParts || [])
      .filter(id => !installed.has(id))
      .map(id => this.partMap.get(id)?.name || id);
  }
}