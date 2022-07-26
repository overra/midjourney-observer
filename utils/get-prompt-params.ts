export function getPromptParams(command: string) {
  return Array.from(
    command.matchAll(
      /\-\-s\s(?<s>\d+)|\-\-seed\s(?<seed>\d+)|\-\-q\s(?<q>[\d\.]+)|\-\-quality\s(?<quality>[\d\.]+)|\-\-stylize\s(?<stylize>\d+)/g
    )
  ).reduce<Record<string, string>>((groups, group) => {
    if (!group.groups) {
      return groups;
    }
    for (const [key, value] of Object.entries(group.groups)) {
      if (value !== undefined) {
        groups[key] = value;
      }
    }
    return groups;
  }, {});
}
