import * as vscode from "vscode";
import { modules } from "./middleware/index";

export function activate(context: vscode.ExtensionContext) {
  console.log("Extension activated");

  modules.forEach((moduleFactory) => {
    const module = moduleFactory();

    if (!module) {
      console.log("Module is null");
      return;
    }
    console.log(`Registering ${module.commands.length} commands`);
    module.commands.forEach(({ command, handler }) => {
      console.log(`  - ${command}`);
      const disposable = vscode.commands.registerCommand(command, handler);
      context.subscriptions.push(disposable);
    });

    if (module.providers && Array.isArray(module.providers)) {
      console.log(`Registering ${module.providers.length} providers`);
      module.providers.forEach((provider) => {
        if (provider) {
          context.subscriptions.push(provider);
        }
      });
    }
  });
}

export function deactivate() {}
