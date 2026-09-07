import type { PortableTextBlock } from 'sanity';

type HeadingBlock = {
  _key: string;
  _type: 'block';
  style: 'h2' | 'h3' | 'h4';
  children: { text?: string }[];
};

export type ContentHeading = {
  id: string;
  key: string;
  level: 2 | 3 | 4;
  text: string;
};

function asHeadingBlock(block: unknown): HeadingBlock | null {
  const value = block as Partial<HeadingBlock>;

  if (
    value._type !== 'block' ||
    typeof value._key !== 'string' ||
    (value.style !== 'h2' && value.style !== 'h3' && value.style !== 'h4') ||
    !Array.isArray(value.children)
  ) {
    return null;
  }

  return value as HeadingBlock;
}

function getHeadingText(block: HeadingBlock) {
  return block.children
    .map((child) => child.text ?? '')
    .join('')
    .trim();
}

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getContentHeadingId(block: unknown) {
  const heading = asHeadingBlock(block);
  if (!heading) return undefined;

  const textSlug = slugify(getHeadingText(heading)) || 'section';
  const salt = heading._key.replace(/[^a-zA-Z0-9]/g, '').slice(-6);

  return `${textSlug}-${salt}`;
}

export function getContentHeadings(
  content: PortableTextBlock[] | null,
): ContentHeading[] {
  if (!content) return [];

  return content.flatMap((block) => {
    const heading = asHeadingBlock(block);
    if (!heading) return [];

    const text = getHeadingText(heading);
    const id = getContentHeadingId(heading);
    if (!text || !id) return [];

    return [
      {
        id,
        key: heading._key,
        level: Number(heading.style.slice(1)) as 2 | 3 | 4,
        text,
      },
    ];
  });
}
