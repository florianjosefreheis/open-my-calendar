// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
var validUrl = require('valid-url');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "open-my-calendar" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(vscode.commands.registerCommand('extension.addCalendar', addCalendar));
  context.subscriptions.push(vscode.commands.registerCommand('extension.showAllCalendars', showAllCalendars));
  context.subscriptions.push(vscode.commands.registerCommand('extension.openCalendar', openCalendar));

  async function addCalendar() {
    const calendarName = await vscode.window.showInputBox({ placeHolder: "Add calendar name." });
    const calendarUrl = await vscode.window.showInputBox({ placeHolder: "Add calendar URL." });
    if (calendarName && calendarUrl) {
      if (validUrl.isUri(calendarUrl)) {
        context.globalState.update(calendarName, calendarUrl);
        vscode.window.showInformationMessage("Calendar \"" + calendarName + "\" added.");
      }
      else {
        vscode.window.showErrorMessage("Entered URL not valid.");
      }
    }
  }

  async function showAllCalendars() {
    //@ts-ignore
    if (!Object.keys(context.globalState._value)) { return vscode.window.showInformationMessage("No calendars added."); }

    //@ts-ignore
    for (let key in context.globalState._value) {
      let value = context.globalState.get(key);
      //@ts-ignore
      vscode.window.showInformationMessage("Calender: " + key, value)
        .then((calendarUrl: string) => {
          if (calendarUrl === value) {
            vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(calendarUrl));
          }
          return;
        });
    }
  }

  async function openCalendar() {
    vscode.window.showInputBox({
      placeHolder:
        "Enter calendar name."
    }).then(async function (userInput) {
      if (userInput) {
        let calendarUrl = await findCalendar(context, userInput);
        if (calendarUrl !== undefined) {
          vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(calendarUrl));
          vscode.window.showInformationMessage('Open Calendar ' + calendarUrl);
        }
        else {
          vscode.window.showErrorMessage("Calendar \"" + userInput + "\" could not be found.");
        }
      }
    });
  }
}

async function findCalendar(context: vscode.ExtensionContext, userInput: any) {
  let calendarUrl = context.globalState.get(userInput);
  if (calendarUrl) { return calendarUrl; }
}

// this method is called when your extension is deactivated
export function deactivate() { }
