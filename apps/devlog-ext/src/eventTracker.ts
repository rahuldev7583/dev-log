import * as vscode from 'vscode';
import { Database } from './database';
import { simpleGit, SimpleGit } from 'simple-git';
import { getLanguageFromLanguageId } from './utils';

type GitWatcher = {
  git: SimpleGit;
  lastKnownBranch: String;
};

export class EventTracker implements vscode.Disposable {
  private isTracking: boolean = false;
  private startTime: number = 0;
  private currentProject: string = '';
  private currentBranch: string = 'unknown';
  private currentLanguage: string = 'unknown';
  private database: Database;
  private updateInterval: NodeJS.Timeout | null = null;

  private lastCursorActivity: number = Date.now();
  private cursorInactivityTimeout: NodeJS.Timeout | null = null;
  private inactivityTimeoutSeconds: number = 120;
  private focusTimeoutHandle: NodeJS.Timeout | null = null;
  private focusTimeoutSeconds: number = 180;

  private gitWatcher: GitWatcher | null = null;
  private branchCheckInterval: NodeJS.Timeout | null = null;
  private branchCheckPromise: Promise<void> | null = null;

  private lastUpdateTime: number = Date.now();
  private lastFocusTime: number = Date.now();
  private lastSaveTime: number = 0;

  constructor(database: Database) {
    this.database = database;

    this.updateConfiguration();

    vscode.window.onDidChangeTextEditorSelection(() => {
      this.updateCursorActivity();
    });

    vscode.workspace.onDidChangeTextDocument(() => {
      this.updateCursorActivity();
    });

    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        this.currentProject = this.getCurrentProject();
      }
      this.updateCursorActivity();
    });

    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      this.updateCurrentBranch();
    });

    vscode.window.onDidChangeWindowState(async (e) => {
      const now = Date.now();

      if (e.focused) {
        if (this.focusTimeoutHandle) {
          clearTimeout(this.focusTimeoutHandle);
          this.focusTimeoutHandle = null;

          if (this.isTracking) {
            await this.saveCurrentSession('window focus gained');
          }
          await this.startTracking('Focus regained');
        }

        this.lastFocusTime = now;
      } else {
        if (this.isTracking) {
          await this.saveCurrentSession('Focus lost');
        }
        if (this.focusTimeoutHandle) {
          clearTimeout(this.focusTimeoutHandle);
        }

        this.focusTimeoutHandle = setTimeout(async () => {
          if (this.isTracking) {
            await this.stopTracking('focus Timeout');
          }
        }, this.focusTimeoutSeconds * 1000);
      }
    });
  }

  public updateConfiguration() {
    const config = vscode.workspace.getConfiguration('devlogTracker');

    this.inactivityTimeoutSeconds = config.get('inactivityTimeout', 2.5) * 60;
    this.focusTimeoutSeconds = config.get('focusTimeout', 3) * 60;
  }

  private updateCurrentBranch() {
    try {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      console.log({ workspaceFolder });

      if (!workspaceFolder) {
        this.currentBranch = 'unknown';
      }

      const git = simpleGit(workspaceFolder?.uri.fsPath);
      console.log({ git });

      if (!git) {
        this.currentBranch = 'unknown';
      }

      const branchInfo = git.branch();
      console.log({ branchInfo });

      if (!branchInfo) {
        this.currentBranch = 'unknown';
      }
      branchInfo.then((info) => {
        this.currentBranch = info.current;
      });
    } catch (error) {
      console.log('Branch error');

      this.currentBranch = 'unknown';
    }
  }

  private updateCurrentLanguage() {
    const editor = vscode.window.activeTextEditor;
    if (editor?.document.languageId) {
      const language = getLanguageFromLanguageId(editor.document.languageId);
      this.currentLanguage = language;
    }
  }

  private setupCursorTracking() {
    if (this.cursorInactivityTimeout) {
      clearTimeout(this.cursorInactivityTimeout);
    }

    const currentTime = Date.now();

    const timer = setTimeout(() => {
      const now = Date.now();
      const inactivityDuration = now - this.lastCursorActivity;

      if (
        this.isTracking &&
        inactivityDuration >= this.inactivityTimeoutSeconds * 1000
      ) {
        vscode.window.showInformationMessage('Stop tracking due to inactivity');

        this.stopTracking('inactivity');
      }
    }, this.inactivityTimeoutSeconds * 1000);

    this.cursorInactivityTimeout = timer;

    this.lastCursorActivity = currentTime;
  }

  public async updateCursorActivity() {
    if (!this.isTracking) {
      vscode.window.showInformationMessage('Start tracking by cursor activity');
      await this.startTracking('cursor activity');

      return;
    }

    const current_project = this.getCurrentProject();

    if (current_project !== this.currentProject) {
      this.currentProject = current_project;
      this.startTime = Date.now();
    }

    this.lastCursorActivity = Date.now();
    this.setupCursorTracking();
  }

  async startTracking(reason: string) {
    vscode.window.showInformationMessage(`Tracking Started reason: ${reason}`);

    const now = Date.now();
    this.isTracking = true;
    this.startTime = now;
    this.lastUpdateTime = now;
    this.lastFocusTime = now;

    this.updateCurrentBranch();
    this.updateCurrentLanguage();

    this.currentProject = this.getCurrentProject();

    if (this.updateInterval) {
      clearTimeout(this.updateInterval);
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.setupCursorTracking();
    vscode.window.showInformationMessage(
      'cursor tracking and about to setupGitwatcher',
    );
    await this.setupGitwatcher();

    vscode.window.showInformationMessage('setupGitwatcher completed');
  }

  async stopTracking(reason?: string) {
    if (this.isTracking) {
      this.isTracking = false;

      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }

      if (this.cursorInactivityTimeout) {
        clearTimeout(this.cursorInactivityTimeout);
        this.cursorInactivityTimeout = null;
      }

      this.saveCurrentSession();

      this.lastSaveTime = 0;

      await this.stopGitWatcher();

      vscode.window.showInformationMessage('Tracking Stopped');
    }
  }

  async saveCurrentSession(reason?: string) {
    const now = Date.now();
    let duration =
      Math.round(((now - this.startTime) / (1000 * 60)) * 10000) / 10000;

    console.log({
      duration: duration,
      branch: this.currentBranch,
    });
    vscode.window.showInformationMessage(
      `saving current session reason: ${reason}`,
    );

    if (reason === 'inactivity') {
      duration = Math.max(0, duration - this.inactivityTimeoutSeconds * 60);
    } else if (reason === 'focus timeout') {
      duration = Math.max(duration - this.focusTimeoutSeconds * 60);
    }

    if (duration > 0) {
      await this.database.addEvent(
        this.currentProject,
        Number(duration.toFixed(4)),
        this.currentBranch || 'unknown',
        this.currentLanguage,
        new Date(),
      );

      vscode.window.showInformationMessage('Event saved to local DB');
    }
    this.startTime = now;
    this.lastSaveTime = now;
  }

  dispose() {
    this.stopTracking();
    this.stopGitWatcher();
  }

  isActive() {
    return this.isTracking;
  }

  async setupGitwatcher() {
    this.stopGitWatcher();

    const workspace = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0]
      : undefined;

    if (!workspace) {
      vscode.window.showInformationMessage('Not a valid workspace');
      return;
    }

    const git = simpleGit(workspace?.uri.path);

    if (!git) {
      vscode.window.showInformationMessage('Not a valid git ');
      return;
    }

    const isValidRepo = await git.checkIsRepo();

    if (!isValidRepo) {
      vscode.window.showInformationMessage('Not a valid git repo ');
      return;
    }

    const branch = await git.branch();

    this.gitWatcher = {
      git: git,
      lastKnownBranch: branch.current || 'unknown',
    };

    const branchInterval = setInterval(() => {
      this.checkBranchChanges();
    }, 5000);

    this.branchCheckInterval = branchInterval;

    vscode.window.showInformationMessage('setup git watcher');
  }

  async checkBranchChanges() {
    if (this.branchCheckPromise || !this.gitWatcher || !this.isTracking) {
      return;
    }

    const branchChangeTask = async () => {
      try {
        const branch = await this.gitWatcher?.git.branch();

        const current_branch = branch?.current || 'unknown';

        console.log({
          current_branch,
          branch: this.gitWatcher?.lastKnownBranch,
        });

        if (current_branch !== this.gitWatcher?.lastKnownBranch) {
          await this.saveCurrentSession('Branch Changes');

          vscode.window.showInformationMessage(
            'Branch Changes after saveCurrentSession called',
          );

          this.gitWatcher
            ? (this.gitWatcher.lastKnownBranch = current_branch)
            : null;

          this.currentBranch = current_branch;

          this.startTime = Date.now();
        }
      } catch (error) {
        console.error('Error checking branch changes:', error);
      } finally {
        this.branchCheckPromise = null;
      }
    };

    this.branchCheckPromise = branchChangeTask();

    await this.branchCheckPromise;

    vscode.window.showInformationMessage('Branch changes Task running');
  }

  stopGitWatcher() {
    if (this.branchCheckInterval) {
      clearInterval(this.branchCheckInterval);
      this.branchCheckInterval = null;
    }
    this.gitWatcher = null;
  }

  getCurrentBranch() {
    return this.currentBranch;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getCurrentProject() {
    if (this.currentProject) {
      return this.currentProject;
    }

    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (!workspaceFolders) {
      return 'Unknown Project';
    }

    if (workspaceFolders.length === 1) {
      return workspaceFolders[0].name;
    }

    const workspaceName = vscode.workspace.name;

    const activeEditor = vscode.window.activeTextEditor;

    if (activeEditor) {
      const workspaceFolder = vscode.workspace.getWorkspaceFolder(
        activeEditor.document.uri,
      );
      if (workspaceFolder) {
        return `${workspaceName}/${workspaceFolder}`;
      }
    }

    return workspaceFolders[0].name;
  }
}
