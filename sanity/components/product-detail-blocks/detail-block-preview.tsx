import { Badge, Box, Flex, Grid, Stack, Text } from '@sanity/ui';
import type { PreviewProps } from 'sanity';

import {
  getProductDetailBlockDefinition,
  getProductDetailLayoutDefinition,
  ProductDetailBlockType,
} from './detail-block-registry';
import { LayoutPreview } from './layout-preview';

type PreparePreviewProps = {
  label?: string;
  title?: string;
  subtitle?: string;
};

export function ProductDetailBlockPreview(props: PreviewProps) {
  const blockType = props.schemaType?.name as ProductDetailBlockType;

  const { label, title, subtitle } = props as PreparePreviewProps;

  const definition = getProductDetailBlockDefinition(blockType);

  if (!definition) {
    return props.renderDefault(props);
  }

  const layoutValue =
    typeof subtitle === 'string' ? subtitle : definition.defaultLayout;

  const layout =
    getProductDetailLayoutDefinition(blockType, layoutValue) ??
    getProductDetailLayoutDefinition(blockType, definition.defaultLayout);

  return (
    <Grid
      gridTemplateColumns={[1, 2]}
      gap={3}
      padding={2}
      style={{
        minHeight: 120,
        alignItems: 'center',
      }}
    >
      {/* VISUAL LAYOUT */}
      <LayoutPreview blockType={blockType} layout={layoutValue} compact />

      {/* CONTENT */}
      <Box>
        <Stack gap={3}>
          <Stack gap={2}>
            <Text size={0} muted style={{ textTransform: 'uppercase' }}>
              {label ?? 'Nhãn'}
            </Text>

            <Text size={2} weight="semibold" textOverflow="ellipsis">
              {title ?? 'Tiêu đề'}
            </Text>
          </Stack>

          <Flex align="center" wrap="wrap">
            <Badge tone="primary" padding={1} radius={0}>
              {definition.title}
            </Badge>

            {layout && (
              <Badge padding={1} radius={0}>
                {layout.title}
              </Badge>
            )}
          </Flex>
        </Stack>
      </Box>
    </Grid>
  );
}

export const productDetailBlockPreview = {
  select: {
    label: 'label',
    title: 'title',
    layout: 'layout',
  },

  prepare({
    label,
    title,
    layout,
  }: {
    label?: string;
    title?: string;
    layout?: string;
  }): PreparePreviewProps {
    return {
      label,
      title,
      subtitle: layout,
    };
  },
};
