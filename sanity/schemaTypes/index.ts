import { type SchemaTypeDefinition } from 'sanity';
import { article } from './article';
import { category } from './category';
import { product } from './product';
import { tag } from './tag';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, article, tag],
};
