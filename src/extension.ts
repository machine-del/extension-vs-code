import * as vscode from "vscode";
// import { modules } from "./middleware/index";
import { modules } from "./middleware/index";

export function activate(context: vscode.ExtensionContext) {
  modules.forEach((module) => {
    const moduleI = module();
    if (moduleI != null) {
      const disposable = vscode.commands.registerCommand(
        moduleI.command,
        moduleI.handler,
      );
      context.subscriptions.push(disposable);
      context.subscriptions.push(moduleI.provider);
    }
  });
}

export function deactivate() {}
