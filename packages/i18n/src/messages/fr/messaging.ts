import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/messaging";

export const messages = {
  "messaging.help.invalid_token":
    "Slack n’accepte plus EQBots dans cet espace de travail. Il a peut-être été désinstallé. Connectez à nouveau l’espace de travail.",
  "messaging.help.secret_storage_unavailable":
    "EQBots ne peut pas lire les jetons enregistrés sur cet ordinateur. Déconnectez l’espace de travail, puis connectez-le à nouveau.",
  "messaging.help.relay_unavailable":
    "EQBots ne peut pas recevoir les événements Slack sur cet ordinateur. Connectez-vous, donnez un nom à cet ordinateur dans les réglages du serveur et gardez EQBots ouvert.",
  "messaging.help.not_linked":
    "Cet espace de travail n’est pas lié à ce serveur. Sélectionnez Reconnecter pour le lier.",
  "messaging.discordHelp.invalid_token":
    "Discord n’accepte plus EQBots sur ce serveur Discord. Il a peut-être été retiré. Connectez à nouveau le serveur Discord.",
  "messaging.discordHelp.secret_storage_unavailable":
    "EQBots ne peut pas lire les jetons enregistrés sur cet ordinateur. Déconnectez le serveur Discord, puis connectez-le à nouveau.",
  "messaging.discordHelp.relay_unavailable":
    "EQBots ne peut pas recevoir les événements Discord sur cet ordinateur. Connectez-vous, donnez un nom à cet ordinateur dans les réglages du serveur et gardez EQBots ouvert.",
} as const satisfies PartialTranslation<typeof source>;
