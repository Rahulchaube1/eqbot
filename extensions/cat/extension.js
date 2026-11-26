const vscode = require("vscode");
const path = require("node:path");
const { registerAccountCommands } = require("./auth");

async function openPage(route) {
  const opened = await vscode.env.openExternal(vscode.Uri.parse("https://eqbot.everestqai.com" + route));
  if (!opened) throw new Error("Your browser could not open Cat. Check your default browser and try again.");
}

async function copySelection() {
  const editor = vscode.window.activeTextEditor;
  const selections = editor?.selections.filter((selection) => !selection.isEmpty);
  if (!selections?.length) {
    void vscode.window.showInformationMessage("Select code in an editor first.");
    return;
  }
  const document = editor.document;
  const file = vscode.workspace.getWorkspaceFolder(document.uri)
    ? vscode.workspace.asRelativePath(document.uri, true)
    : path.basename(document.fileName);
  const excerpts = selections.map((selection) => {
    const code = document.getText(selection);
    const lastLine = selection.end.line + (selection.end.character === 0 ? 0 : 1);
    let fenceLength = 3;
    for (const match of code.matchAll(/`+/g)) fenceLength = Math.max(fenceLength, match[0].length + 1);
    const fence = "`".repeat(fenceLength);
    return `${file} (lines ${selection.start.line + 1}–${lastLine})\n${fence}${document.languageId}\n${code}\n${fence}`;
  });
  await vscode.env.clipboard.writeText(excerpts.join("\n\n"));
  void vscode.window
    .showInformationMessage("Selection copied. Paste it into your Cat conversation.", "Open Workspace")
    .then((choice) => {
      if (choice) return vscode.commands.executeCommand("cat.openWorkspace");
    });
}

function activate(context) {
  const commands = {
    openWorkspace: () => openPage("/app"),
    openShip: () => openPage("/cat-ship"),
    openComputer: () => openPage("/cat-computer"),
    copySelection,
  };
  for (const [name, action] of Object.entries(commands)) {
    context.subscriptions.push(vscode.commands.registerCommand("cat." + name, action));
  }
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider("cat.workspace", {
      getTreeItem: (item) => item,
      getChildren: () => [],
    }),
  );
  return registerAccountCommands(context);
}

module.exports = { activate };
