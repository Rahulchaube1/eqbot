import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Cat не удалось запустить",
  "startup.failedBody":
    "{message}\n\nЛокальные данные не сброшены и не перезаписаны. Шаги восстановления — в руководстве по устранению неполадок.",
  "startup.archiveChangedTitle": "Файлы Cat изменены",
  "startup.archiveChangedBody":
    "Другая программа изменила файл Cat app.asar. Сейчас Cat работает, но после выхода он больше не запустится.\n\nЧтобы исправить это, установите Cat заново. Ваши локальные данные сохранятся.",
  "startup.archiveChangedDownload": "Скачать Cat",
  "startup.filesDamagedBody":
    "Некоторые файлы Cat повреждены или отсутствуют.\n\nЧтобы исправить это, установите Cat заново. Ваши локальные данные сохранятся.",
  "startup.newerDataUpdatingTitle": "Обновление Cat",
  "startup.newerDataUpdatingBody":
    "Более новая версия Cat сохранила ваши данные. Cat устанавливает последнюю версию и затем откроется снова.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataTitle": "Установите последнюю версию Cat",
  "startup.newerDataBody":
    "Более новая версия Cat сохранила ваши данные, и эта версия ({version}) не может их открыть. Установите последнюю версию, чтобы открыть данные.\n\nВаши локальные данные не были сброшены или перезаписаны.",
  "startup.newerDataDownload": "Скачать Cat",
  "startup.newerDataGuide": "Открыть руководство",
  "startup.newerDataQuit": "Выйти",
  "startup.recoveryWindowTitle": "Восстановление Cat",
  "startup.recoveryTitle": "Cat не открылся",
  "startup.recoveryBody": {
    one: "Cat {version} остановился до открытия {count} раз подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    few: "Cat {version} остановился до открытия {count} раза подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    many: "Cat {version} остановился до открытия {count} раз подряд. Ваши локальные данные не сброшены и не перезаписаны.",
    other:
      "Cat {version} остановился до открытия {count} раза подряд. Ваши локальные данные не сброшены и не перезаписаны.",
  },
  "startup.recoveryHint":
    "Попробуйте снова или установите последнюю версию, которая открывалась. Чтобы получить помощь, экспортируйте диагностику и отправьте файл вместе с отчётом.",
  "startup.recoveryRetry": "Повторить",
  "startup.recoveryPreviousVersion": "Скачать прошлую версию",
  "startup.recoveryExportDiagnostics": "Экспорт диагностики",
  "startup.recoveryOpenDataFolder": "Открыть папку данных",
  "startup.recoveryQuit": "Выйти",
  "startup.recoveryDiagnosticsSaved": "Файл диагностики сохранён.",
  "startup.recoveryActionFailed": "Cat не удалось выполнить это действие.",
} as const satisfies PartialTranslation<typeof source>;
