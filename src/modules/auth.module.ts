import data from "../data/auth/login/index.json";
import * as vscode from "vscode";

export function AuthModule() {
  const command = data.command;

  const handler = () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor || !Array.isArray(data.template)) {
      return;
    }

    editor.insertSnippet(new vscode.SnippetString(data.template.join("\n")));
  };

  const provider = vscode.languages.registerCompletionItemProvider(
    "php",
    {
      provideCompletionItems(document, position) {
        if (!Array.isArray(data.template)) {
          return;
        }

        const range = document.getWordRangeAtPosition(position);

        const word = range ? document.getText(range) : "";

        if (word && !data.prefix.startsWith(word)) {
          return;
        }

        const snippet = data.template.join("\n").replace(/\$/g, "\\$");

        const item = new vscode.CompletionItem(
          data.prefix,
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
    data.prefix.charAt(0),
  );

  return {
    command,
    handler,
    provider,
  };
}
