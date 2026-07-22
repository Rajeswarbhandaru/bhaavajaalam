// missions.js — mission tracking, driven by /data/missions.json
export class MissionManager {
  constructor(missionsData, state) {
    this.customers = missionsData.customers || [];
    this.daily = missionsData.daily || [];
    this.state = state;
  }

  getCustomerMission(id) {
    return this.customers.find(c => c.id === id) || null;
  }

  getTodaysDaily() {
    const today = new Date().toISOString().slice(0, 10);
    const doneToday = this.state.dailyMissionsDone.filter(d => d.date === today);
    return this.daily.filter(d => !doneToday.some(x => x.id === d.id));
  }

  completeDaily(id) {
    const today = new Date().toISOString().slice(0, 10);
    const mission = this.daily.find(d => d.id === id);
    if (!mission) return null;
    this.state.dailyMissionsDone.push({ id, date: today });
    this.state.xp += mission.xp;
    return mission;
  }

  evaluateAgainstCustomer(customerId, build) {
    const customer = this.getCustomerMission(customerId);
    if (!customer) return null;
    const withinBudget = build.totalCost <= customer.budget;
    const matchedNeeds = customer.needs.filter(n => build.tags?.includes(n));
    const satisfaction = Math.round((matchedNeeds.length / customer.needs.length) * 100);
    return { customer, withinBudget, matchedNeeds, satisfaction };
  }
}
