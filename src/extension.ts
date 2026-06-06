import * as vscode from "vscode";
// import { modules } from "./middleware/index";
import { DbModule } from "./modules/db.module";

export function activate(context: vscode.ExtensionContext) {
  const module = DbModule();

  // modules.forEach((module) => {
  //   const disposable = vscode.commands.registerCommand(
  //     module.command,
  //     module.handler,
  //   );
  //   context.subscriptions.push(disposable);
  // });

  const disposable = vscode.commands.registerCommand(
    module.command,
    module.handler,
  );
  context.subscriptions.push(disposable);
  context.subscriptions.push(module.provider);
}

export function deactivate() {}
