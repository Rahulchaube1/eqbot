import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "EQBots başlatılamadı",
  "startup.failedBody":
    "{message}\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı. Kurtarma adımları için sorun giderme kılavuzuna bakın.",
  "startup.archiveChangedTitle": "EQBots dosyaları değiştirildi",
  "startup.archiveChangedBody":
    "Başka bir program EQBots’un app.asar dosyasını değiştirdi. EQBots şu an çalışıyor, ancak kapattıktan sonra açılmayacak.\n\nOnarmak için EQBots’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.archiveChangedDownload": "EQBots’u indir",
  "startup.filesDamagedBody":
    "Bazı EQBots dosyaları hasarlı veya eksik.\n\nOnarmak için EQBots’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.newerDataUpdatingTitle": "EQBots güncelleniyor",
  "startup.newerDataUpdatingBody":
    "EQBots’un daha yeni bir sürümü verilerinizi kaydetti. EQBots en son sürümü yüklüyor ve ardından yeniden açılacak.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataTitle": "En son EQBots’u yükleyin",
  "startup.newerDataBody":
    "EQBots’un daha yeni bir sürümü verilerinizi kaydetti ve bu sürüm ({version}) onları açamıyor. Verilerinizi açmak için en son sürümü yükleyin.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataDownload": "EQBots’u indir",
  "startup.newerDataGuide": "Kılavuzu aç",
  "startup.newerDataQuit": "Çık",
  "startup.recoveryWindowTitle": "EQBots kurtarma",
  "startup.recoveryTitle": "EQBots açılmadı",
  "startup.recoveryBody": {
    one: "EQBots {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
    other:
      "EQBots {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  },
  "startup.recoveryHint":
    "Yeniden deneyin veya açılan son sürümü yükleyin. Yardım almak için tanılamayı dışa aktarın ve dosyayı raporunuzla gönderin.",
  "startup.recoveryRetry": "Yeniden dene",
  "startup.recoveryPreviousVersion": "Önceki sürümü indir",
  "startup.recoveryExportDiagnostics": "Tanılamayı dışa aktar",
  "startup.recoveryOpenDataFolder": "Veri klasörünü aç",
  "startup.recoveryQuit": "Çık",
  "startup.recoveryDiagnosticsSaved": "Tanılama dosyası kaydedildi.",
  "startup.recoveryActionFailed": "EQBots bu işlemi yapamadı.",
} as const satisfies PartialTranslation<typeof source>;
