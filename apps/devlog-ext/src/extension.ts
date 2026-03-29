import * as vscode from 'vscode';
import { Database } from './database';
import { EventTracker } from './eventTracker';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
  const database = new Database(context);
  const eventTracker = new EventTracker(database);

  const tokenStatus = context.globalState.get('tokenVerification', false);
  let isAuthChecking = false;

  const authCheck = async () => {
    if (isAuthChecking) {
      return;
    }
    isAuthChecking = true;

    const config = vscode.workspace.getConfiguration('devlogTracker');
    const API_URL = config.get<string>('apiUrl');

    const extToken = await context.secrets
      .get('extToken')
      .then((value) => value);

    if (!extToken) {
      vscode.window
        .showWarningMessage(
          'Devlog: Please login to Devlog to get started!',
          'Login',
        )
        .then((selection) => {
          if (selection === 'Login') {
            vscode.commands.executeCommand('devlog-ext.login');
          }
        });
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/extension/verify`, {
        extToken: extToken,
      });

      if (res.status === 200) {
        context.globalState.update('tokenVerification', true);
        vscode.window.showInformationMessage(
          'Devlog: Congratulations, you Successfully LoggedIn!',
        );
        isAuthChecking = false;
        return;
      } else {
        vscode.window.showErrorMessage('Devlog: Invalid Token');

        vscode.window.showWarningMessage('Devlog: Invalid token');
        isAuthChecking = false;
        return;
      }
    } catch (error: any) {
      vscode.window.showErrorMessage(
        error?.response?.data?.message || 'Devlog:  Auth failed',
      );

      isAuthChecking = false;
      return;
    }
  };

  if (!tokenStatus) {
    authCheck();
  }

  const disposable = vscode.commands.registerCommand(
    'devlog-ext.helloWorld',
    () => {
      vscode.window.showInformationMessage(
        'Devlog:  Hello World from devlog-ext!',
      );
    },
  );

  const loginDisposable = vscode.commands.registerCommand(
    'devlog-ext.login',
    async () => {
      const config = vscode.workspace.getConfiguration('devlogTracker');
      const APP_URL = config.get<string>('appUrl');
      try {
        //vscode.window.showInformationMessage('Login to Devlog!');

        const loginUrl = vscode.Uri.parse(`${APP_URL}/auth/external`);

        await vscode.env.openExternal(loginUrl);
      } catch (error: any) {
        vscode.window.showErrorMessage(
          error?.response?.data?.message || 'Devlog: Login failed',
        );
      }
    },
  );

  vscode.window.registerUriHandler({
    async handleUri(uri: vscode.Uri) {
      const token = new URLSearchParams(uri.query).get('extToken');
      if (!token) {
        vscode.window.showErrorMessage('Devlog: Token not received');
        return;
      }
      await context.secrets.store('extToken', token);

      await authCheck();
    },
  });

  context.subscriptions.push(disposable);
  context.subscriptions.push(loginDisposable);

  context.subscriptions.push(
    vscode.window.onDidChangeTextEditorSelection(() => {
      eventTracker.updateCursorActivity();
    }),
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(() => {
      const config = vscode.workspace.getConfiguration('devlogTracker');
      if (config) {
        eventTracker.updateConfiguration();
      }
    }),
  );

  context.subscriptions.push(eventTracker);

  if (vscode.window.state.focused) {
    eventTracker.startTracking('initial startup');
  }

  vscode.window.onDidChangeWindowState((e: vscode.WindowState) => {
    if (e.focused && !eventTracker.isActive()) {
      eventTracker.startTracking('window focused');
    }
  });

  vscode.workspace.onDidOpenTextDocument(() => {
    if (vscode.window.state.focused) {
      eventTracker.startTracking('document open');
    }
  });

  const syncInterval = setInterval(
    async () => {
      await database.syncWithBackend();
    },
    1000 * 60 * 5,
  );

  context.subscriptions.push({
    dispose: () => clearInterval(syncInterval),
  });
}

export function deactivate() {}
