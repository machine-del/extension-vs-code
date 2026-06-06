import data from "../data/db/index.json";
import * as vscode from "vscode";

export function DbModule() {
  const command = data.command;

  const handler = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      editor.insertSnippet(new vscode.SnippetString(data.template.join("\n")));
    }
  };

  const provider = vscode.languages.registerCompletionItemProvider(["php"], {
    provideCompletionItems(document, position) {
      // eslint-disable-next-line curly
      if (!Array.isArray(data.template)) return undefined;

      const range = document.getWordRangeAtPosition(position, /[^\s]+/);
      const word = range ? document.getText(range) : "";

      if (word !== data.prefix && !data.prefix.startsWith(word)) {
        return undefined;
      }

      const item = new vscode.CompletionItem(
        data.prefix,
        vscode.CompletionItemKind.Snippet,
      );
      item.sortText = "000";
      item.preselect = true;
      item.insertText = new vscode.SnippetString(data.template.join("\n"));
      item.detail = "Database connection snippet";
      item.documentation = new vscode.MarkdownString(
        "Insert MySQLi connection code",
      );

      return [item];
    },
  });

  return {
    command,
    handler,
    provider,
  };
}
