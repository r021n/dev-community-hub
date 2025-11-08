export default function parseTags(tagString = "") {
  return tagString
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
