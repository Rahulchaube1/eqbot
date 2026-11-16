import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/menu";

export const messages = {
  "menu.stopAllAgents": "Остановить всех агентов",
  "menu.checkForUpdates": "Проверить обновления…",
  "menu.preferences": "Настройки…",
  "menu.actualSize": "Фактический размер",
  "menu.zoomIn": "Увеличить",
  "menu.zoomOut": "Уменьшить",
  "menu.copyLink": "Скопировать ссылку",
  "menu.copyImage": "Скопировать изображение",
  "menu.quit": "Выйти из EQBots",
  "menu.quitConfirmTitle": "Выйти из EQBots?",
  "menu.quitConfirmBody": "Агенты и автозадачи остановятся, пока вы снова не откроете EQBots.",
  "menu.quitConfirm": "Выйти",
  "menu.quitHint": "Удерживайте ⌘Q или нажмите дважды, чтобы выйти",
  "menu.closeWorkingTitle": {
    one: "{count} агент ещё работает",
    few: "{count} агента ещё работают",
    many: "{count} агентов ещё работают",
    other: "{count} агента ещё работают",
  },
  "menu.closeWorkingBody":
    "Если выйти из EQBots, агенты остановятся. Оставьте EQBots работать, чтобы они закончили. Чтобы снова показать окно, откройте EQBots.",
  "menu.closeKeepRunning": "Не выходить",
  "menu.trayOpen": "Открыть EQBots",
  "menu.trayQuit": "Выйти из EQBots",
  "menu.trayTooltip": "EQBots",
  "menu.hideDynamicIsland": "Скрыть Dynamic Island",
  "menu.undo": "Отменить",
  "menu.redo": "Повторить",
  "menu.cut": "Вырезать",
  "menu.copy": "Копировать",
  "menu.paste": "Вставить",
  "menu.pasteAndMatchStyle": "Вставить в том же стиле",
  "menu.delete": "Удалить",
  "menu.selectAll": "Выделить все",
} as const satisfies PartialTranslation<typeof source>;
