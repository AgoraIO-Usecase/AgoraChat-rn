import format from 'date-fns/format';

type TruncateMode = 'head' | 'mid' | 'tail';
type TruncateParams = {
  content: string;
  mode?: TruncateMode | undefined;
  maxLen?: number | undefined;
  separator?: string | undefined;
};

/**
 * String content truncate util.
 *
 * @param param0 truncate params
 * @returns string
 */
export function truncateContent({
  content,
  mode = 'tail',
  maxLen = 40,
  separator = '...',
}: TruncateParams): string {
  if (content.length <= maxLen) return content;

  if (mode === 'head') {
    return separator + content.slice(-maxLen);
  }

  if (mode === 'mid') {
    const lead = Math.ceil(maxLen / 2);
    const trail = Math.floor(maxLen / 2);
    return content.slice(0, lead) + separator + content.slice(-trail);
  }

  if (mode === 'tail') {
    return content.slice(0, maxLen) + separator;
  }

  throw new Error('Invalid truncate mode: ' + mode);
}

/**
 * Badge count truncate util
 * If count exceed the limit, it comes in the form of "MAX+"
 *
 * @param {number} count
 *
 * @param {number} MAX default 99
 * @returns {string}
 */
export function truncatedBadgeCount(count: number, MAX: number = 99): string {
  if (count >= MAX) return `${MAX}+`;
  return `${count}`;
}

export function messageTimestamp(date: Date | number, locale?: Locale): string {
  return format(date, 'p', { locale });
}
