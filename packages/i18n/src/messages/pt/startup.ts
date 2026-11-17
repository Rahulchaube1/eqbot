import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "O Cat não conseguiu iniciar",
  "startup.failedBody":
    "{message}\n\nSeus dados locais não foram redefinidos nem sobrescritos. Consulte o guia de solução de problemas para ver os passos de recuperação.",
  "startup.archiveChangedTitle": "Arquivos do Cat foram alterados",
  "startup.archiveChangedBody":
    "Outro programa alterou o arquivo app.asar do Cat. O Cat funciona agora, mas não vai abrir depois que você fechá-lo.\n\nPara reparar, instale o Cat novamente. Seus dados locais são mantidos.",
  "startup.archiveChangedDownload": "Baixar Cat",
  "startup.filesDamagedBody":
    "Alguns arquivos do Cat estão danificados ou faltando.\n\nPara reparar, instale o Cat novamente. Seus dados locais são mantidos.",
  "startup.newerDataUpdatingTitle": "Atualizando o Cat",
  "startup.newerDataUpdatingBody":
    "Uma versão mais recente do Cat salvou seus dados. O Cat instala a versão mais recente e depois abre de novo.\n\nSeus dados locais não foram redefinidos nem substituídos.",
  "startup.newerDataTitle": "Instale o Cat mais recente",
  "startup.newerDataBody":
    "Uma versão mais recente do Cat salvou seus dados, e esta versão ({version}) não consegue abri-los. Instale a versão mais recente para abrir seus dados.\n\nSeus dados locais não foram redefinidos nem substituídos.",
  "startup.newerDataDownload": "Baixar Cat",
  "startup.newerDataGuide": "Abrir guia",
  "startup.newerDataQuit": "Sair",
  "startup.recoveryWindowTitle": "Recuperação do Cat",
  "startup.recoveryTitle": "O Cat não abriu",
  "startup.recoveryBody": {
    one: "O Cat {version} parou antes de abrir, {count} vez seguida. Seus dados locais não foram redefinidos nem substituídos.",
    other:
      "O Cat {version} parou antes de abrir, {count} vezes seguidas. Seus dados locais não foram redefinidos nem substituídos.",
  },
  "startup.recoveryHint":
    "Tente novamente ou instale a última versão que abriu. Para obter ajuda, exporte o diagnóstico e envie o arquivo com seu relato.",
  "startup.recoveryRetry": "Tentar de novo",
  "startup.recoveryPreviousVersion": "Baixar versão anterior",
  "startup.recoveryExportDiagnostics": "Exportar diagnóstico",
  "startup.recoveryOpenDataFolder": "Abrir pasta de dados",
  "startup.recoveryQuit": "Sair",
  "startup.recoveryDiagnosticsSaved": "O arquivo de diagnóstico foi salvo.",
  "startup.recoveryActionFailed": "O Cat não conseguiu fazer esta ação.",
} as const satisfies PartialTranslation<typeof source>;
