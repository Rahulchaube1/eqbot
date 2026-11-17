import type { PartialTranslation } from "../../message";
import type { messages as source } from "../en/startup";

export const messages = {
  "startup.failedTitle": "Cat לא הצליח להיפתח",
  "startup.failedBody":
    "{message}\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו. בצעדי השחזור שבמדריך לפתרון בעיות אפשר לקרוא איך להמשיך.",
  "startup.archiveChangedTitle": "קובצי Cat שונו",
  "startup.archiveChangedBody":
    "תוכנה אחרת שינתה את קובץ Cat app.asar. Cat פועל כעת, אך לא ייפתח לאחר היציאה ממנו.\n\nכדי לתקן את Cat, יש להתקין אותו מחדש. הנתונים המקומיים נשמרים.",
  "startup.archiveChangedDownload": "הורדת Cat",
  "startup.filesDamagedBody":
    "חלק מקובצי Cat פגומים או חסרים.\n\nכדי לתקן את Cat, יש להתקין אותו מחדש. הנתונים המקומיים נשמרים.",
  "startup.newerDataUpdatingTitle": "Cat מתעדכן",
  "startup.newerDataUpdatingBody":
    "גרסה חדשה יותר של Cat שמרה את הנתונים שלך. Cat מתקין את הגרסה האחרונה ואז נפתח מחדש.\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  "startup.newerDataTitle": "התקנת Cat העדכני ביותר",
  "startup.newerDataBody":
    "גרסה חדשה יותר של Cat שמרה את הנתונים שלך, והגרסה הזו ({version}) אינה יכולה לפתוח אותם. יש להתקין את הגרסה האחרונה כדי לפתוח את הנתונים.\n\nהנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  "startup.newerDataDownload": "הורדת Cat",
  "startup.newerDataGuide": "פתיחת המדריך",
  "startup.newerDataQuit": "יציאה",
  "startup.recoveryWindowTitle": "שחזור Cat",
  "startup.recoveryTitle": "Cat לא נפתח",
  "startup.recoveryBody": {
    one: "Cat {version} נעצר לפני שנפתח, פעם אחת ({count}). הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
    two: "Cat {version} נעצר לפני שנפתח, פעמיים ברצף ({count}). הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
    other: "Cat {version} נעצר לפני שנפתח, {count} פעמים ברצף. הנתונים המקומיים שלך לא אופסו ולא נדרסו.",
  },
  "startup.recoveryHint":
    "נסה שוב, או התקן את הגרסה האחרונה שנפתחה. לקבלת עזרה, ייצא את נתוני האבחון ושלח את הקובץ עם הדיווח שלך.",
  "startup.recoveryRetry": "נסה שוב",
  "startup.recoveryPreviousVersion": "הורדת הגרסה הקודמת",
  "startup.recoveryExportDiagnostics": "ייצוא אבחון",
  "startup.recoveryOpenDataFolder": "פתיחת תיקיית הנתונים",
  "startup.recoveryQuit": "יציאה",
  "startup.recoveryDiagnosticsSaved": "קובץ האבחון נשמר.",
  "startup.recoveryActionFailed": "Cat לא הצליח לבצע את הפעולה הזו.",
} as const satisfies PartialTranslation<typeof source>;
