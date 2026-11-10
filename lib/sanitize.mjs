// Page-derived text ends up in DESIGN.md / SKILL.md files that AI agents read.
// These helpers strip characters that could break out of inline Markdown or
// smuggle hidden instructions (backticks, HTML comments, shell-style syntax,
// invisible and bidi characters). Tell the user to still read every generated
// file as plain text before giving it to an AI agent.

export function safeInline(value, maxLen) {
  let text = String(value ?? "")
    .normalize("NFKC")
    .replace(/[\t\n\v\f\r\u{85}\u{2028}\u{2029}]/gu, " ")
    .replace(/[\p{Cc}\p{Cf}\p{Co}\p{Cs}\p{Default_Ignorable_Code_Point}]/gu, "")
    .replace(/<!--|-->/g, "")
    .replace(/[`<>!@${}[\]|\\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (Number.isFinite(maxLen) && maxLen > 3 && text.length > maxLen) {
    text = `${text.slice(0, maxLen - 3).replace(/[\uD800-\uDBFF]$/, "").trimEnd()}...`;
  }
  return text;
}

export function safeUrl(value) {
  let parsed;
  try {
    parsed = new URL(String(value ?? ""));
  } catch (_) {
    return "";
  }
  const origin = parsed.origin && parsed.origin !== "null"
    ? parsed.origin
    : `${parsed.protocol}//${parsed.host}`;
  return safeInline(`${origin}${parsed.pathname}`, 200);
}
