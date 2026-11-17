import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Cat başlatılamadı",
  "startup.failedBody":
    "{message}\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı. Kurtarma adımları için sorun giderme kılavuzuna bakın.",
  "startup.archiveChangedTitle": "Cat dosyaları değiştirildi",
  "startup.archiveChangedBody":
    "Başka bir program Cat’un app.asar dosyasını değiştirdi. Cat şu an çalışıyor, ancak kapattıktan sonra açılmayacak.\n\nOnarmak için Cat’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.archiveChangedDownload": "Cat’u indir",
  "startup.filesDamagedBody":
    "Bazı Cat dosyaları hasarlı veya eksik.\n\nOnarmak için Cat’u yeniden yükleyin. Yerel verileriniz korunur.",
  "startup.newerDataUpdatingTitle": "Cat güncelleniyor",
  "startup.newerDataUpdatingBody":
    "Cat’un daha yeni bir sürümü verilerinizi kaydetti. Cat en son sürümü yüklüyor ve ardından yeniden açılacak.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataTitle": "En son Cat’u yükleyin",
  "startup.newerDataBody":
    "Cat’un daha yeni bir sürümü verilerinizi kaydetti ve bu sürüm ({version}) onları açamıyor. Verilerinizi açmak için en son sürümü yükleyin.\n\nYerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  "startup.newerDataDownload": "Cat’u indir",
  "startup.newerDataGuide": "Kılavuzu aç",
  "startup.newerDataQuit": "Çık",
  "startup.recoveryWindowTitle": "Cat kurtarma",
  "startup.recoveryTitle": "Cat açılmadı",
  "startup.recoveryBody": {
    one: "Cat {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
    other:
      "Cat {version}, açılmadan önce art arda {count} kez durdu. Yerel verileriniz sıfırlanmadı veya üzerine yazılmadı.",
  },
  "startup.recoveryHint":
    "Yeniden deneyin veya açılan son sürümü yükleyin. Yardım almak için tanılamayı dışa aktarın ve dosyayı raporunuzla gönderin.",
  "startup.recoveryRetry": "Yeniden dene",
  "startup.recoveryPreviousVersion": "Önceki sürümü indir",
  "startup.recoveryExportDiagnostics": "Tanılamayı dışa aktar",
  "startup.recoveryOpenDataFolder": "Veri klasörünü aç",
  "startup.recoveryQuit": "Çık",
  "startup.recoveryDiagnosticsSaved": "Tanılama dosyası kaydedildi.",
  "startup.recoveryActionFailed": "Cat bu işlemi yapamadı.",
} as const satisfies PartialTranslation<typeof source>;
