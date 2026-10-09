import { randomKey } from '@sanity/util/content';
import { Badge, Box, Card, Flex, Grid, Stack, Text } from '@sanity/ui';
import { ArrayOfObjectsInputProps, insert, setIfMissing } from 'sanity';

import {
  PRODUCT_DETAIL_BLOCKS,
  PRODUCT_DETAIL_BLOCK_TYPES,
  ProductDetailBlockType,
} from './detail-block-registry';
import { LayoutPreview } from './layout-preview';

export function ProductDetailBlocksInput(props: ArrayOfObjectsInputProps) {
  const count = props.value?.length ?? 0;

  function addBlock(type: ProductDetailBlockType) {
    const definition = PRODUCT_DETAIL_BLOCKS[type];

    const block = {
      _key: randomKey(12),
      _type: type,
      layout: definition.defaultLayout,
    };

    props.onChange([setIfMissing([]), insert([block], 'after', [-1])]);
  }

  return (
    <Stack gap={4}>
      {/*
        Preserve Sanity's native vertical object-array UI.

        Native drag/drop, duplicate, delete, validation,
        focus and collaborative editing remain intact.
      */}
      {props.renderDefault({
        ...props,
        arrayFunctions: () => null,
      })}

      {/* ADD BLOCK PALETTE */}
      <Card padding={4} border radius={2}>
        <Stack gap={3}>
          <Text size={1} weight="semibold">
            Chọn thêm khối nội dung
          </Text>

          <Grid gridTemplateColumns={[1, 2, 3]} gap={3}>
            {PRODUCT_DETAIL_BLOCK_TYPES.map((type) => (
              <BlockButton
                key={type}
                type={type}
                onClick={() => addBlock(type)}
              />
            ))}
          </Grid>
        </Stack>
      </Card>
    </Stack>
  );
}

function BlockButton({
  type,
  onClick,
}: {
  type: ProductDetailBlockType;
  onClick: () => void;
}) {
  const definition = PRODUCT_DETAIL_BLOCKS[type];

  return (
    <Card
      as="button"
      type="button"
      border
      radius={2}
      padding={3}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <Stack gap={3}>
        <LayoutPreview
          blockType={type}
          layout={definition.defaultLayout}
          compact
        />

        <Stack gap={2}>
          <Text size={1} weight="semibold">
            {definition.title}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}
