import { defineMessages } from "../../message";

export const messages = defineMessages("startup", {
  // The one native error box: the app could not start, so no renderer exists to show it.
  "startup.failedTitle": "Cat couldn’t start",
  "startup.failedBody":
    "{message}\n\nYour local data was not reset or overwritten. See the troubleshooting guide for recovery steps.",
  // Shown while OpenBot runs, when another program changed `app.asar`: the next start would fail with no message.
  "startup.archiveChangedTitle": "Cat files were changed",
  "startup.archiveChangedBody":
    "Another program changed the Cat file app.asar. Cat runs now, but it will not open after you quit it.\n\nTo repair Cat, install it again. Your local data stays.",
  "startup.archiveChangedDownload": "Download Cat",
  // The entry of the main process shows this when a program file cannot load, so no OpenBot code can run.
  "startup.filesDamagedBody":
    "Some Cat files are damaged or missing.\n\nTo repair Cat, install it again. Your local data stays.",
  // An older OpenBot started over data that a newer one migrated: it installs the latest release.
  "startup.newerDataUpdatingTitle": "Updating Cat",
  "startup.newerDataUpdatingBody":
    "A newer version of Cat saved your data. Cat installs the latest version and then opens again.\n\nYour local data was not reset or overwritten.",
  "startup.newerDataTitle": "Install the latest Cat",
  "startup.newerDataBody":
    "A newer version of Cat saved your data, and this version ({version}) cannot open it. Install the latest version to open your data.\n\nYour local data was not reset or overwritten.",
  "startup.newerDataDownload": "Download Cat",
  "startup.newerDataGuide": "Open guide",
  "startup.newerDataQuit": "Quit",
  // The recovery window: one version did not finish its start several times in a row. It shows before
  // the next start, from the main process, with no renderer.
  "startup.recoveryWindowTitle": "Cat recovery",
  "startup.recoveryTitle": "Cat did not open",
  "startup.recoveryBody": {
    one: "Cat {version} stopped before it opened, {count} time in a row. Your local data was not reset or overwritten.",
    other:
      "Cat {version} stopped before it opened, {count} times in a row. Your local data was not reset or overwritten.",
  },
  "startup.recoveryHint":
    "Try again, or install the last version that opened. To get help, export the diagnostics and send the file with your report.",
  "startup.recoveryRetry": "Try again",
  "startup.recoveryPreviousVersion": "Download previous version",
  "startup.recoveryExportDiagnostics": "Export diagnostics",
  "startup.recoveryOpenDataFolder": "Open data folder",
  "startup.recoveryQuit": "Quit",
  "startup.recoveryDiagnosticsSaved": "The diagnostics file is saved.",
  "startup.recoveryActionFailed": "Cat could not do this action.",
});
