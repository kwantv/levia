import { Card } from '@sanity/ui';

import {
  getProductDetailBlockDefinition,
  ProductDetailBlockType,
} from './detail-block-registry';

type Props = {
  blockType: ProductDetailBlockType;
  layout?: string;
  compact?: boolean;
};

const ACCENT = '#cdb784';

const contentStyle: React.CSSProperties = {
  border: '1px solid rgba(127,127,127,.28)',
  borderRadius: 3,
  padding: 8,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 5,
};

const mediaStyle: React.CSSProperties = {
  border: `1px solid ${ACCENT}80`,
  background: `${ACCENT}22`,
  borderRadius: 3,
};

function Lines() {
  return (
    <>
      <div
        style={{
          height: 4,
          width: '75%',
          borderRadius: 999,
          background: 'currentColor',
          opacity: 0.32,
        }}
      />

      <div
        style={{
          height: 4,
          width: '100%',
          borderRadius: 999,
          background: 'currentColor',
          opacity: 0.16,
        }}
      />

      <div
        style={{
          height: 4,
          width: '58%',
          borderRadius: 999,
          background: 'currentColor',
          opacity: 0.16,
        }}
      />
    </>
  );
}

function ContentPane() {
  return (
    <div style={contentStyle}>
      <Lines />
    </div>
  );
}

function MediaPane() {
  return <div style={mediaStyle} />;
}

export function LayoutPreview({ blockType, layout, compact = false }: Props) {
  const definition = getProductDetailBlockDefinition(blockType);

  const currentLayout = layout || definition?.defaultLayout;

  return (
    <Card
      border
      radius={2}
      padding={2}
      style={{
        width: '100%',
        height: compact ? 92 : 132,
      }}
    >
      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
        <Diagram blockType={blockType} layout={currentLayout} />
      </div>
    </Card>
  );
}

function Diagram({
  blockType,
  layout,
}: {
  blockType: ProductDetailBlockType;
  layout?: string;
}) {
  if (blockType === 'productMetrics') {
    if (layout === 'rows') {
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 5,
            height: '100%',
          }}
        >
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              style={{
                ...contentStyle,
                padding: 6,
                display: 'grid',
                gridTemplateColumns: '24px 1fr',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 5,
                  background: ACCENT,
                  opacity: 0.75,
                }}
              />

              <div
                style={{
                  height: 4,
                  background: 'currentColor',
                  opacity: 0.18,
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    if (layout === 'featured') {
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 5,
            height: '100%',
          }}
        >
          <div
            style={{
              ...contentStyle,
              borderColor: `${ACCENT}88`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 18,
                background: ACCENT,
                opacity: 0.7,
              }}
            />

            <Lines />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: 5,
            }}
          >
            <ContentPane />
            <ContentPane />
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 5,
          height: '100%',
        }}
      >
        <ContentPane />
        <ContentPane />
        <ContentPane />
        <ContentPane />
      </div>
    );
  }

  if (blockType === 'productFullMedia') {
    const position =
      layout === 'center'
        ? {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }
        : layout === 'bottomCenter'
          ? {
              bottom: 9,
              left: '50%',
              transform: 'translateX(-50%)',
            }
          : {
              bottom: 9,
              left: 9,
            };

    return (
      <div
        style={{
          ...mediaStyle,
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '42%',
            minWidth: 58,
            padding: 7,
            borderRadius: 3,
            background: 'rgba(20,20,20,.82)',
            color: '#fff',
            ...position,
          }}
        >
          <Lines />
        </div>
      </div>
    );
  }

  if (blockType === 'productFeatureRail') {
    const mediaRight = layout === 'mediaRight';

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 5,
          height: '100%',
        }}
      >
        <div
          style={{
            order: mediaRight ? 2 : 1,
            ...mediaStyle,
          }}
        />

        <div
          style={{
            order: mediaRight ? 1 : 2,
            display: 'grid',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: 5,
          }}
        >
          <ContentPane />
          <ContentPane />
          <ContentPane />
        </div>
      </div>
    );
  }

  // splitMedia + statement
  if (layout === 'mediaBottom') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateRows: '0.75fr 1fr',
          gap: 5,
          height: '100%',
        }}
      >
        <ContentPane />
        <MediaPane />
      </div>
    );
  }

  const mediaLeft = layout === 'mediaLeft';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr',
        gap: 5,
        height: '100%',
      }}
    >
      <div style={{ order: mediaLeft ? 2 : 1 }}>
        <ContentPane />
      </div>

      <div
        style={{
          order: mediaLeft ? 1 : 2,
          ...mediaStyle,
        }}
      />
    </div>
  );
}
