import * as vscode from 'vscode';

export interface VsEvent {
  project: string;
  duration: number;
  branch: string;
  language: string;
  start_time: string;
}

export class Database {
  private context: vscode.ExtensionContext;
  private events: VsEvent[];
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(context: vscode.ExtensionContext) {
    this.context = context;

    if (!context.globalState.get('events')) {
      context.globalState.update('events', []);
    }

    this.events = context.globalState.get('events') || [];
  }

  async addEvent(
    project: string,
    duration: number,
    branch: string,
    language: string,
    start_time: string,
  ) {
    if (duration <= 0) {
      console.warn(
        `Duration ${duration} is not valid for ${project}/${branch}/${branch}`,
      );
      return;
    }

    this.writeQueue = this.writeQueue.then(async () => {
      const events = this.getEVents();

      const existingEvent = events.find((entry) => {
        entry.branch === branch &&
          entry.language === language &&
          entry.project === project &&
          entry.start_time === start_time;
      });

      if (existingEvent) {
        existingEvent.duration += duration;
      } else {
        events.push({ project, duration, branch, language, start_time });
      }

      await this.updateEvent(events);
      console.log(
        `Saved ${duration} duration for project: ${project}, branch:${branch}, language:${language} which started on ${start_time}`,
      );
    });

    await this.writeQueue;
  }

  getEVents(): VsEvent[] {
    if (!this.events) {
      this.context.globalState.get('events', []);
    }
    return this.events;
  }

  async updateEvent(events: VsEvent[]) {
    this.events = events;

    await this.context.globalState.update('events', events);
  }
  async clearAllData() {
    //check sync status is synced and clear data
  }

  async syncWithBackend() {
    //get all pending event call backend fetch post req to store
    //marked as synced to all pending
    //call clearAllData
    //update events
  }
}
