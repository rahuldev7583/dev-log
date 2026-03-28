import * as vscode from 'vscode';
import { Database } from './database';
import { EventTracker } from './eventTracker';

export function activate(context: vscode.ExtensionContext) {
  const database = new Database(context);
  const eventTracker = new EventTracker(database);

  console.log('Congratulations, your extension "Devlog" is now active!');

  const disposable = vscode.commands.registerCommand(
    'devlog-ext.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from devlog-ext!');
    },
  );

  const loginDisposable = vscode.commands.registerCommand(
    'devlog-ext.login',
    async () => {
      try {
        vscode.window.showInformationMessage('Login to Devlog!');

        const loginUrl = vscode.Uri.parse(
          'http://localhost:3000/auth/external',
        );

        await vscode.env.openExternal(loginUrl);
      } catch (error) {
        console.log('login failed');

        console.log({ error });
      }
    },
  );

  //  for callback
  //  vscode.window.registerUriHandler
  //then push to subscription
  //  const token = new URLSearchParams(uri.query).get('token');
  //   await context.secrets.store('authToken', token);

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
}

export function deactivate() {}
