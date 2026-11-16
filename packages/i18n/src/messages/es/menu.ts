import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Detener todos los agentes",
  "menu.checkForUpdates": "Buscar actualizaciones…",
  "menu.preferences": "Ajustes…",
  "menu.actualSize": "Tamaño real",
  "menu.zoomIn": "Ampliar",
  "menu.zoomOut": "Reducir",
  "menu.copyLink": "Copiar enlace",
  "menu.copyImage": "Copiar imagen",
  "menu.quit": "Salir de EQBots",
  "menu.quitConfirmTitle": "¿Salir de EQBots?",
  "menu.quitConfirmBody": "Los agentes y las rutinas se detienen hasta que vuelvas a abrir EQBots.",
  "menu.quitConfirm": "Salir",
  "menu.quitHint": "Mantén pulsado ⌘Q o púlsalo dos veces para salir",
  "menu.closeWorkingTitle": { one: "{count} agente sigue trabajando", other: "{count} agentes siguen trabajando" },
  "menu.closeWorkingBody":
    "Si sales de EQBots, los agentes se detienen. Déjalo abierto para que terminen. Para ver la ventana de nuevo, abre EQBots.",
  "menu.closeKeepRunning": "Seguir",
  "menu.trayOpen": "Abrir EQBots",
  "menu.trayQuit": "Salir de EQBots",
  "menu.trayTooltip": "EQBots",
  "menu.hideDynamicIsland": "Ocultar Dynamic Island",
  "menu.undo": "Deshacer",
  "menu.redo": "Rehacer",
  "menu.cut": "Cortar",
  "menu.copy": "Copiar",
  "menu.paste": "Pegar",
  "menu.pasteAndMatchStyle": "Pegar y adaptar estilo",
  "menu.delete": "Eliminar",
  "menu.selectAll": "Seleccionar todo",
} as const satisfies PartialTranslation<typeof source>;
