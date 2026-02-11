// utils/stripEmojis.js
export function stripEmojis(text) {
  return text.replace(/([\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200D])/gu, "");
}
