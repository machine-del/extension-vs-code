import * as vscode from "vscode";
import { modules } from "./middleware/index";

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension activated");

  modules.forEach((moduleFactory) => {
    const module = moduleFactory();

    console.log("Loading:", module?.command);

    if (!module) {
      console.log("Module is null");
      return;
    }

    const disposable = vscode.commands.registerCommand(
      module.command,
      module.handler,
    );

    context.subscriptions.push(disposable);

    if (module.provider) {
      context.subscriptions.push(module.provider);
    }
  });
}

export function deactivate() {}
