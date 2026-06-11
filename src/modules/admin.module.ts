import data from "../data/admin/index.json";
import * as vscode from "vscode";

export function AdminModule() {
  const commands = [];
  const providers = [];

  // Проходим по всем шаблонам в templates
  for (const [templateName, templateData] of Object.entries(data.templates)) {
    const command = templateData.command;
    const prefix = templateData.prefix;
    const template = templateData.template;

    const handler = () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor || !Array.isArray(template)) {
        return;
      }

      editor.insertSnippet(new vscode.SnippetString(template.join("\n")));
    };

    const provider = vscode.languages.registerCompletionItemProvider(
      "php",
      {
        provideCompletionItems(document, position) {
          if (!Array.isArray(template)) {
            return;
          }

          const range = document.getWordRangeAtPosition(position);
          const word = range ? document.getText(range) : "";

          if (word && !prefix.startsWith(word)) {
            return;
          }

          const snippet = template.join("\n").replace(/\$/g, "\\$");

          const item = new vscode.CompletionItem(
            prefix,
            vscode.CompletionItemKind.Snippet,
          );

          item.insertText = new vscode.SnippetString(snippet);
          item.sortText = "0000";
          item.preselect = true;

          if (range) {
            item.range = range;
          }

          return [item];
        },
      },
      prefix.charAt(0),
    );

    commands.push({ command, handler });
    providers.push(provider);
  }

  return {
    commands,
    providers,
  };
}
