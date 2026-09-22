import Image from 'next/image';
import {
  PortableText,
  PortableTextBlock,
  PortableTextComponents,
} from 'next-sanity';
import { getContentHeadingId } from './content-headings';
import { getImageUrl } from './image';

type RichTableCell = { _key: string; content: PortableTextBlock[] };
type RichTableRow = { _key: string; cells: RichTableCell[] };
type RichTableColumnHeader = { _key: string; cellIndex: number; title: string };
type RichTableBlockValue = {
  columnHeaders?: RichTableColumnHeader[];
  hasColumnTitles?: boolean;
  hasRowTitles?: boolean;
  rows: RichTableRow[];
};

export const components = {
  block: {
    h2: ({ children, value }) => (
      <h2 id={getContentHeadingId(value)} className="scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3 id={getContentHeadingId(value)} className="scroll-mt-24">
        {children}
      </h3>
    ),
    h4: ({ children, value }) => (
      <h4 id={getContentHeadingId(value)} className="scroll-mt-24">
        {children}
      </h4>
    ),
  },
  types: {
    image: ({ value }: { value: any }) => {
      if (!value.asset?._ref) return null;
      const src = getImageUrl(value, 800);
      return (
        <figure className="my-8">
          <Image
            src={src!}
            alt={value.alt || ''}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ aspectRatio: '16/9' }}
          />
          {value.caption && (
            <figcaption className="mt-2 text-muted-foreground text-sm text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    richTableBlock: ({ value }) => {
      const table = value as RichTableBlockValue;
      const sortedHeaders = table.hasColumnTitles
        ? [...(table.columnHeaders ?? [])].sort(
            (a, b) => a.cellIndex - b.cellIndex,
          )
        : [];

      return (
        <div className="overflow-x-auto">
          <table>
            {sortedHeaders.length > 0 && (
              <thead>
                <tr>
                  {sortedHeaders.map((header) => (
                    <th key={header._key} className="text-left">
                      {header.title}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {table.rows?.map((row) => (
                <tr key={row._key}>
                  {row.cells?.map((cell, cellIdx) => {
                    const isRowHeader = table.hasRowTitles && cellIdx === 0;
                    return isRowHeader ? (
                      <th key={cell._key} scope="row" className="text-left">
                        <PortableText value={cell.content} />
                      </th>
                    ) : (
                      <td key={cell._key}>
                        <PortableText value={cell.content} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
} satisfies PortableTextComponents;
