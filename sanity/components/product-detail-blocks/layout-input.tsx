import { Stack } from '@sanity/ui';
import type { StringInputProps } from 'sanity';

import { ProductDetailBlockType } from './detail-block-registry';
import { LayoutPreview } from './layout-preview';

export function createProductLayoutInput(blockType: ProductDetailBlockType) {
  return function ProductLayoutInput(props: StringInputProps) {
    return (
      <Stack gap={3}>
        <LayoutPreview blockType={blockType} layout={props.value} />
        {props.renderDefault(props)}
      </Stack>
    );
  };
}
