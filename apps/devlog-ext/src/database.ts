import axios from 'axios';
import { UUID } from 'crypto';

import * as vscode from 'vscode';

export interface VsEvent {
  session_id: UUID;
  project: string;
  duration: number;
  branch: string;
  language: string;
  start_time: Date;
  sync_status: 'synced' | 'pending' | 'failed';
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

    //context.globalState.update("events", []);

    //this.events = [];
  }

  async addEvent(
    session_id: UUID,
    project: string,
    duration: number,
    branch: string,
    language: string,
    start_time: Date,
  ) {
    if (duration <= 0) {
      vscode.window.showInformationMessage(
        `Devlog: Duration ${duration} is not valid for ${project}/${branch}/${branch}`,
      );

      return;
    }

    this.writeQueue = this.writeQueue.then(async () => {
      const events = this.getEVents();

      const existingEvent = events.find((entry) => {
        return entry.session_id === session_id;
      });

      if (existingEvent) {
        //vscode.window.showInformationMessage('add to existingEvent');
        existingEvent.duration += duration;
        existingEvent.sync_status = 'pending';
      } else {
        events.push({
          session_id: session_id,
          project,
          duration,
          branch,
          language,
          start_time,
          sync_status: 'pending',
        });

        //vscode.window.showInformationMessage('new event created');
      }

      await this.updateEvent(events);

      //  vscode.window.showInformationMessage(
      //    `Saved ${duration} duration for project: ${project}, branch:${branch}, language:${language} which started on ${start_time}`,
      //  );
    });

    await this.writeQueue;
  }

  getEVents(): VsEvent[] {
    if (!this.events) {
      this.events = this.context.globalState.get('events', []) || [];
    }
    return this.events;
  }

  async updateEvent(events: VsEvent[]) {
    this.events = events;

    await this.context.globalState.update('events', events);

    //vscode.window.showInformationMessage('Update Event');
  }

  clearAllData() {
    const remaining = this.events.filter((e) => e.sync_status !== 'synced');

    this.events = remaining;
    vscode.window.showInformationMessage('Devlog: clear all synced Data');
  }

  async syncWithBackend() {
    const config = vscode.workspace.getConfiguration('devlogTracker');
    const API_URL = config.get<string>('apiUrl');

    try {
      const extToken = await this.context.secrets
        .get('extToken')
        .then((value) => value);

      if (!extToken) {
        vscode.window.showInformationMessage('Devlog: Token not Provided');

        vscode.window.showWarningMessage(
          'Devlog! Please login again to save your coding session.',
        );

        return;
      }
      console.log(`Syncing URL: ${API_URL}`);

      const events = this.events;
      console.log({ events });

      if (events.length > 0) {
        const isISOFormat = (dateString: any) => {
          const isoRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
          return isoRegExp.test(dateString);
        };

        const filteredEvent: any = events.map((e) => {
          return {
            project_name: e.project,
            branch: e.branch,
            language: e.language,
            session_start: isISOFormat(e.start_time)
              ? e.start_time
              : e.start_time.toISOString(),
            session_id: e.session_id,
            time: e.duration,
          };
        });

        const res = await axios.post(
          `${API_URL}/api/vscode-event/add`,
          filteredEvent,
          {
            headers: {
              Authorization: `Bearer ${extToken}`,
            },
          },
        );

        if (res.status === 200) {
          this.events = events.map((e) => {
            let index = res.data.syncedEvent.findIndex(
              (ev: any) => ev.session_id === e.session_id,
            );

            if (index >= 0) {
              e.sync_status = 'synced';
              return e;
            }
            return e;
          });

          vscode.window.showInformationMessage(
            'Devlog: Event synced to Backend Successfully',
          );
        } else {
          console.log({ res });

          vscode.window.showErrorMessage(
            res.data?.message || 'Devlog:  Event Sync failed',
          );

          return;
        }
      }
    } catch (error: any) {
      console.log({ error });

      vscode.window.showErrorMessage(
        error?.response?.data?.message || 'Devlog:  Event Sync failed',
      );

      return;
    }
  }
}
