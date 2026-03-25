import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "devlog-ext" is now active!');

  const disposable = vscode.commands.registerCommand(
    'devlog-ext.helloWorld',
    () => {
      vscode.window.showInformationMessage('Hello World from devlog-ext!');
    },
  );

  context.subscriptions.push(disposable);

  const loginDisposable = vscode.commands.registerCommand(
    'devlog-ext.login',
    () => {
      vscode.window.showInformationMessage('Login to Devlog!');
    },
  );

  context.subscriptions.push(loginDisposable);
}

export function deactivate() {}
