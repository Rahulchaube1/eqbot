import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "EQBots kan niet starten",
  "startup.failedBody":
    "{message}\n\nJe lokale gegevens zijn niet gereset of overschreven. Bekijk de handleiding voor probleemoplossing voor herstelstappen.",
  "startup.archiveChangedTitle": "EQBots-bestanden zijn gewijzigd",
  "startup.archiveChangedBody":
    "Een ander programma heeft het EQBots-bestand app.asar gewijzigd. EQBots werkt nu, maar opent niet meer nadat je het afsluit.\n\nInstalleer EQBots opnieuw om het te herstellen. Je lokale gegevens blijven bewaard.",
  "startup.archiveChangedDownload": "EQBots downloaden",
  "startup.filesDamagedBody":
    "Sommige EQBots-bestanden zijn beschadigd of ontbreken.\n\nInstalleer EQBots opnieuw om het te herstellen. Je lokale gegevens blijven bewaard.",
  "startup.newerDataUpdatingTitle": "EQBots wordt bijgewerkt",
  "startup.newerDataUpdatingBody":
    "Een nieuwere versie van EQBots heeft je gegevens opgeslagen. EQBots installeert de nieuwste versie en opent daarna opnieuw.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataTitle": "Installeer de nieuwste EQBots",
  "startup.newerDataBody":
    "Een nieuwere versie van EQBots heeft je gegevens opgeslagen, en deze versie ({version}) kan ze niet openen. Installeer de nieuwste versie om je gegevens te openen.\n\nJe lokale gegevens zijn niet gereset of overschreven.",
  "startup.newerDataDownload": "EQBots downloaden",
  "startup.newerDataGuide": "Gids openen",
  "startup.newerDataQuit": "Stoppen",
  "startup.recoveryWindowTitle": "EQBots-herstel",
  "startup.recoveryTitle": "EQBots is niet geopend",
  "startup.recoveryBody": {
    one: "EQBots {version} stopte voordat het openging, {count} keer achter elkaar. Je lokale gegevens zijn niet gewist of overschreven.",
    other:
      "EQBots {version} stopte voordat het openging, {count} keer achter elkaar. Je lokale gegevens zijn niet gewist of overschreven.",
  },
  "startup.recoveryHint":
    "Probeer het opnieuw, of installeer de laatste versie die wel opende. Exporteer voor hulp de diagnose en stuur het bestand mee met je melding.",
  "startup.recoveryRetry": "Opnieuw",
  "startup.recoveryPreviousVersion": "Vorige versie downloaden",
  "startup.recoveryExportDiagnostics": "Diagnose exporteren",
  "startup.recoveryOpenDataFolder": "Gegevensmap openen",
  "startup.recoveryQuit": "Stoppen",
  "startup.recoveryDiagnosticsSaved": "Het diagnosebestand is opgeslagen.",
  "startup.recoveryActionFailed": "EQBots kon deze actie niet uitvoeren.",
} as const satisfies PartialTranslation<typeof source>;
