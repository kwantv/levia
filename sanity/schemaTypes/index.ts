import { type SchemaTypeDefinition } from 'sanity';
import { agency } from './agency';
import { article } from './article';
import { category } from './category';
import { product } from './product';
import { recipe } from './recipe';
import { tag } from './tag';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, article, recipe, agency, tag],
};
