import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "EQBots konnte nicht starten",
  "startup.failedBody":
    "{message}\n\nDeine lokalen Daten wurden weder zurückgesetzt noch überschrieben. Schritte zur Wiederherstellung findest du in der Anleitung zur Fehlerbehebung.",
  "startup.archiveChangedTitle": "EQBots-Dateien wurden geändert",
  "startup.archiveChangedBody":
    "Ein anderes Programm hat die EQBots-Datei app.asar geändert. EQBots läuft jetzt, startet aber nicht mehr, wenn du es beendest.\n\nInstalliere EQBots erneut, um es zu reparieren. Deine lokalen Daten bleiben erhalten.",
  "startup.archiveChangedDownload": "EQBots laden",
  "startup.filesDamagedBody":
    "Einige EQBots-Dateien sind beschädigt oder fehlen.\n\nInstalliere EQBots erneut, um es zu reparieren. Deine lokalen Daten bleiben erhalten.",
  "startup.newerDataUpdatingTitle": "EQBots wird aktualisiert",
  "startup.newerDataUpdatingBody":
    "Eine neuere Version von EQBots hat deine Daten gespeichert. EQBots installiert die neueste Version und startet dann neu.\n\nDeine lokalen Daten wurden nicht zurückgesetzt oder überschrieben.",
  "startup.newerDataTitle": "Neueste EQBots-Version installieren",
  "startup.newerDataBody":
    "Eine neuere Version von EQBots hat deine Daten gespeichert, und diese Version ({version}) kann sie nicht öffnen. Installiere die neueste Version, um deine Daten zu öffnen.\n\nDeine lokalen Daten wurden nicht zurückgesetzt oder überschrieben.",
  "startup.newerDataDownload": "EQBots laden",
  "startup.newerDataGuide": "Anleitung öffnen",
  "startup.newerDataQuit": "Beenden",
  "startup.recoveryWindowTitle": "EQBots-Wiederherstellung",
  "startup.recoveryTitle": "EQBots wurde nicht geöffnet",
  "startup.recoveryBody": {
    one: "EQBots {version} wurde {count} Mal in Folge vor dem Öffnen beendet. Deine lokalen Daten wurden nicht zurückgesetzt oder überschrieben.",
    other:
      "EQBots {version} wurde {count} Mal in Folge vor dem Öffnen beendet. Deine lokalen Daten wurden nicht zurückgesetzt oder überschrieben.",
  },
  "startup.recoveryHint":
    "Versuche es erneut oder installiere die letzte Version, die sich geöffnet hat. Für Hilfe exportiere die Diagnosedaten und sende die Datei mit deinem Bericht.",
  "startup.recoveryRetry": "Wiederholen",
  "startup.recoveryPreviousVersion": "Vorherige Version laden",
  "startup.recoveryExportDiagnostics": "Diagnose exportieren",
  "startup.recoveryOpenDataFolder": "Datenordner öffnen",
  "startup.recoveryQuit": "Beenden",
  "startup.recoveryDiagnosticsSaved": "Die Diagnosedatei ist gespeichert.",
  "startup.recoveryActionFailed": "EQBots konnte diese Aktion nicht ausführen.",
} as const satisfies PartialTranslation<typeof source>;
