import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Cat を起動できませんでした",
  "startup.failedBody":
    "{message}\n\nお使いのデータは初期化も上書きもされていません。復旧の手順はトラブルシューティングガイドをご覧ください。",
  "startup.archiveChangedTitle": "Cat のファイルが変更されました",
  "startup.archiveChangedBody":
    "別のプログラムが Cat のファイル app.asar を変更しました。Cat は今は動作していますが、終了すると次は起動しません。\n\n修復するには、Cat をもう一度インストールしてください。ローカルのデータはそのまま残ります。",
  "startup.archiveChangedDownload": "Cat をダウンロード",
  "startup.filesDamagedBody":
    "Cat の一部のファイルが破損しているか、見つかりません。\n\n修復するには、Cat をもう一度インストールしてください。ローカルのデータはそのまま残ります。",
  "startup.newerDataUpdatingTitle": "Cat を更新しています",
  "startup.newerDataUpdatingBody":
    "新しいバージョンの Cat がデータを保存しました。Cat は最新バージョンをインストールしてから、もう一度開きます。\n\nローカルデータはリセットも上書きもされていません。",
  "startup.newerDataTitle": "最新の Cat をインストールしてください",
  "startup.newerDataBody":
    "新しいバージョンの Cat がデータを保存したため、このバージョン ({version}) では開けません。データを開くには最新バージョンをインストールしてください。\n\nローカルデータはリセットも上書きもされていません。",
  "startup.newerDataDownload": "Cat をダウンロード",
  "startup.newerDataGuide": "ガイドを開く",
  "startup.newerDataQuit": "終了",
  "startup.recoveryWindowTitle": "Cat の復旧",
  "startup.recoveryTitle": "Cat を開けませんでした",
  "startup.recoveryBody": {
    other:
      "Cat {version} は開く前に {count} 回続けて停止しました。ローカルデータはリセットも上書きもされていません。",
  },
  "startup.recoveryHint":
    "もう一度試すか、最後に開けたバージョンをインストールしてください。サポートが必要な場合は、診断情報を書き出し、そのファイルをレポートと一緒に送ってください。",
  "startup.recoveryRetry": "再試行",
  "startup.recoveryPreviousVersion": "前のバージョンをダウンロード",
  "startup.recoveryExportDiagnostics": "診断情報を書き出す",
  "startup.recoveryOpenDataFolder": "データフォルダを開く",
  "startup.recoveryQuit": "終了",
  "startup.recoveryDiagnosticsSaved": "診断ファイルを保存しました。",
  "startup.recoveryActionFailed": "Cat はこの操作を実行できませんでした。",
} as const satisfies PartialTranslation<typeof source>;
