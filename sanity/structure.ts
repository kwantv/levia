import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Levia')
    .items([
      S.documentTypeListItem('product').title('Sản phẩm'),
      S.documentTypeListItem('article').title('Bài viết'),
      S.documentTypeListItem('recipe').title('Công thức'),
      S.documentTypeListItem('agency').title('Đại lý'),
      S.divider(),
      S.documentTypeListItem('category').title('Danh mục'),
      S.documentTypeListItem('tag').title('Thẻ (Tag)'),
    ]);
