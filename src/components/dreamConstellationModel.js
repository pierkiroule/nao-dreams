const requiredLevels = ["theme", "landscape", "presence", "object"];

export const FINAL_SYMBOL_COUNT = 3;

export function isTerminalLevel(level) {
  return level === "atmosphere";
}

export function isFinalPathComplete(path) {
  return requiredLevels.every((level) => path.some((item) => item.level === level)) &&
    path.filter((item) => item.level === "atmosphere").length === FINAL_SYMBOL_COUNT;
}

export function canContinue(path) {
  return isFinalPathComplete(path) && path.some((item) => item.level === "sensation");
}

export function parentPath(path) {
  if (path.length === 0) return path;
  const terminalEntries = path.filter((item) => item.level === "atmosphere");
  if (terminalEntries.length > 0) return path.filter((item) => item.level !== "atmosphere" && item.level !== "sensation");
  return path.slice(0, -1);
}
