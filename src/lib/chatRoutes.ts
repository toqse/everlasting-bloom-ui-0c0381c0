/** Static-export-safe chat URL (one HTML page, any conversation id via query). */
export function chatUrl(conversationId: number | string): string {
  return `/chat/?id=${encodeURIComponent(String(conversationId))}`;
}
