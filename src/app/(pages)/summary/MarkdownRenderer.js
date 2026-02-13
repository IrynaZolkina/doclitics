// components/MarkdownRenderer.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Smile,
  Star,
  Fire,
  Paper,
  StarPlus,
  PaperBg,
  CycleDoubleBg,
  BookBg,
  LampBg,
} from "./icons";

// ✅ Normalize function — removes invisible Unicode variation selectors (U+FE0F)
function normalizeEmoji(emoji) {
  return emoji.replace(/\uFE0F/g, "");
}

// Map your emojis to React components or colored spans
const emojiMap = {
  "🎯": <PaperBg />,
  "📘": <StarPlus />,
  "🔹": <StarPlus />,
  "🧾": <StarPlus />,
  "📌": <StarPlus />,
  "🧪": <StarPlus />,
  "📊": <StarPlus />,
  "📈": <CycleDoubleBg />,
  "⚠️": <BookBg />,
  "✅": <LampBg />,
};

// Function to replace emojis inside children
function replaceEmojis(children) {
  const splitAndReplace = (text, prefix = "") =>
    text
      .split(/([\p{Emoji_Presentation}\p{Emoji}\u{1F300}-\u{1FAFF}])/gu)
      .map((part, i) => {
        const normalized = normalizeEmoji(part);
        const match = emojiMap[normalized];
        return match ? (
          <span key={`${prefix}-${i}`}>{match}</span>
        ) : (
          <span key={`${prefix}-${i}`}>{part}</span>
        );
      });

  if (typeof children === "string") return splitAndReplace(children);
  if (Array.isArray(children))
    return children.map((child, i) =>
      typeof child === "string" ? splitAndReplace(child, i) : child
    );

  return children;
  //   if (typeof children === "string") {
  //     return children
  //       .split(/([\u{1F300}-\u{1FAFF}])/u)
  //       .map((part, i) =>
  //         emojiMap[part] ? (
  //           <span key={i}>{emojiMap[part]}</span>
  //         ) : (
  //           <span key={i}>{part}</span>
  //         )
  //       );
  //   }

  //   if (Array.isArray(children)) {
  //     return children.map((child, i) => {
  //       if (typeof child === "string") {
  //         return child
  //           .split(/([\u{1F300}-\u{1FAFF}])/u)
  //           .map((part, j) =>
  //             emojiMap[part] ? (
  //               <span key={`${i}-${j}`}>{emojiMap[part]}</span>
  //             ) : (
  //               <span key={`${i}-${j}`}>{part}</span>
  //             )
  //           );
  //       }
  //       return child;
  //     });
  //   }

  //   // If it's a single React element
  //   return children;
}

// Main component
export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p>{replaceEmojis(children)}</p>,
        li: ({ children }) => <li>{replaceEmojis(children)}</li>,
        h1: ({ children }) => <h1>{replaceEmojis(children)}</h1>,
        h2: ({ children }) => <h2>{replaceEmojis(children)}</h2>,
        strong: ({ children }) => <strong>{replaceEmojis(children)}</strong>,
        hr: () => null,
        // Add more elements if needed
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
