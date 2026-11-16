import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Alle Agenten stoppen",
  "menu.checkForUpdates": "Nach Updates suchen…",
  "menu.preferences": "Einstellungen…",
  "menu.actualSize": "Originalgröße",
  "menu.zoomIn": "Vergrößern",
  "menu.zoomOut": "Verkleinern",
  "menu.copyLink": "Link kopieren",
  "menu.copyImage": "Bild kopieren",
  "menu.quit": "EQBots beenden",
  "menu.quitConfirmTitle": "EQBots beenden?",
  "menu.quitConfirmBody": "Agenten und Routinen stoppen, bis du EQBots wieder öffnest.",
  "menu.quitConfirm": "Beenden",
  "menu.quitHint": "Halte ⌘Q gedrückt oder drücke zweimal, um zu beenden",
  "menu.closeWorkingTitle": { one: "{count} Agent arbeitet noch", other: "{count} Agenten arbeiten noch" },
  "menu.closeWorkingBody":
    "Wenn du EQBots beendest, stoppen die Agenten. Lass EQBots laufen, damit sie fertig werden. Öffne EQBots, um das Fenster wieder zu zeigen.",
  "menu.closeKeepRunning": "Weiterlaufen",
  "menu.trayOpen": "EQBots öffnen",
  "menu.trayQuit": "EQBots beenden",
  "menu.trayTooltip": "EQBots",
  "menu.hideDynamicIsland": "Dynamic Island ausblenden",
  "menu.undo": "Rückgängig",
  "menu.redo": "Wiederholen",
  "menu.cut": "Ausschneiden",
  "menu.copy": "Kopieren",
  "menu.paste": "Einfügen",
  "menu.pasteAndMatchStyle": "Einsetzen und Stil anpassen",
  "menu.delete": "Löschen",
  "menu.selectAll": "Alles auswählen",
} as const satisfies PartialTranslation<typeof source>;
