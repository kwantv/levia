import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Levia')
    .items([
      S.documentTypeListItem('product').title('Sản phẩm'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['product'].includes(item.getId()!),
      ),
    ])
