/**
 * KeyValueListInput
 * ------------------
 * A custom Sanity Studio (v3) input component for an array of
 * `{ label, value }` objects — e.g. FAQ entries, spec sheets, key facts, etc.
 *
 * Usage in a schema:
 *
 *   import {defineType, defineArrayMember, defineField} from 'sanity'
 *   import {KeyValueListInput} from './KeyValueListInput'
 *
 *   defineField({
 *     name: 'specs',
 *     title: 'Thông số kỹ thuật',
 *     type: 'array',
 *     components: {input: KeyValueListInput},
 *     options: {
 *       addItemLabel: 'Thêm FAQ',   // optional, overrides default "Add item"
 *       collapsible: true,         // optional, default true — show expand/collapse toggle
 *       collapsed: true,           // optional, default false — start collapsed
 *     },
 *     of: [
 *       defineArrayMember({
 *         type: 'object',
 *         fields: [
 *           defineField({
 *             name: 'label',
 *             title: 'Tên thông số',
 *             type: 'string',
 *             placeholder: 'Ví dụ: Kích thước', // optional, read dynamically
 *           }),
 *           defineField({
 *             name: 'value',
 *             title: 'Giá trị',
 *             type: 'text',
 *             placeholder: 'Ví dụ: 30 x 40 cm',
 *           }),
 *         ],
 *       }),
 *     ],
 *   })
 *
 * The component reads field titles/placeholders straight off the schema
 * (via `schemaType.of[0].fields`), so it is not hard-coded to any single
 * schema — drop it onto any two-field `{label, value}` object array and
 * the labels/placeholders will follow whatever you defined there.
 */

import React, { useCallback, useState } from 'react';
import {
  Stack,
  Flex,
  Box,
  Card,
  Text,
  Button,
  TextInput,
  TextArea,
} from '@sanity/ui';
import { AddIcon } from '@sanity/icons/Add';
import { TrashIcon } from '@sanity/icons/Trash';
import { ChevronDownIcon } from '@sanity/icons/ChevronDown';
import { ChevronRightIcon } from '@sanity/icons/ChevronRight';
import { insert, set, unset } from 'sanity';
import type {
  ArrayOfObjectsInputProps,
  ObjectItem,
  ObjectSchemaType,
} from 'sanity';
import { randomKey } from '@sanity/util/content';

/** Shape of each row. Extend if your object has more than label/value. */
export interface KeyValueItem extends ObjectItem {
  label?: string;
  value?: string;
}

export type LabelValueListInputProps = ArrayOfObjectsInputProps<KeyValueItem>;

/** Pulls a human title/placeholder off a field def, with sensible fallbacks. */
function getFieldMeta(
  schemaType: ObjectSchemaType,
  fieldName: 'label' | 'value',
) {
  const field = schemaType.fields?.find((f) => f.name === fieldName);
  const fieldType = field?.type as
    | ((typeof field extends undefined
        ? never
        : NonNullable<typeof field>['type']) & {
        placeholder?: string;
        options?: { placeholder?: string };
      })
    | undefined;

  const title =
    field?.type?.title ?? (fieldName === 'label' ? 'Label' : 'Value');
  const placeholder =
    fieldType?.placeholder ?? fieldType?.options?.placeholder ?? title;

  return { title, placeholder };
}

interface LabelValueListOptions {
  addItemLabel?: string;
  /** Show the expand/collapse toggle for the whole list. Defaults to true. */
  collapsible?: boolean;
  /** Start the list collapsed. Defaults to false. */
  collapsed?: boolean;
}

export function LabelValueListInput(props: LabelValueListInputProps) {
  const { value = [], onChange, schemaType } = props;

  const options =
    (schemaType.options as LabelValueListOptions | undefined) ?? {};
  const isCollapsible = options.collapsible ?? true;
  const [collapsed, setCollapsed] = useState<boolean>(
    isCollapsible ? Boolean(options.collapsed) : false,
  );

  const objectMember = schemaType.of[0] as ObjectSchemaType;
  const labelMeta = getFieldMeta(objectMember, 'label');
  const valueMeta = getFieldMeta(objectMember, 'value');
  const addItemLabel = options.addItemLabel ?? 'Thêm';

  const handleAdd = useCallback(() => {
    const newItem: KeyValueItem = {
      _key: randomKey(12),
      _type: objectMember.name,
      label: '',
      value: '',
    };
    onChange(insert([newItem], 'after', [-1]));
  }, [onChange, objectMember.name]);

  const handleRemove = useCallback(
    (key: string) => {
      onChange(unset([{ _key: key }]));
    },
    [onChange],
  );

  const handleFieldChange = useCallback(
    (key: string, field: 'label' | 'value', fieldValue: string) => {
      onChange(
        set(fieldValue === '' ? undefined : fieldValue, [{ _key: key }, field]),
      );
    },
    [onChange],
  );

  return (
    <Stack gap={3}>
      {value.length > 2 && isCollapsible && (
        <Card
          as="button"
          type="button"
          radius={2}
          padding={2}
          tone="transparent"
          style={{ cursor: 'pointer', textAlign: 'left', border: 'none' }}
          onClick={() => setCollapsed((prev) => !prev)}
          aria-expanded={!collapsed}
        >
          <Flex align="center" gap={2}>
            <Box>{collapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}</Box>
            <Box flex={1}>
              <Text size={1} weight="medium">
                {collapsed ? 'Hiện danh sách' : 'Ẩn danh sách'}
              </Text>
            </Box>
            <Text size={1} muted>
              {value.length}
            </Text>
          </Flex>
        </Card>
      )}

      {!collapsed && (
        <Stack gap={4}>
          {value.map((item) => (
            <Stack gap={2} key={item._key}>
              <Flex align="center" gap={2}>
                <Box flex={1}>
                  <TextInput
                    value={item.label ?? ''}
                    placeholder={labelMeta.placeholder}
                    onChange={(event) =>
                      handleFieldChange(
                        item._key,
                        'label',
                        event.currentTarget.value,
                      )
                    }
                  />
                </Box>
                <Box>
                  <Button
                    icon={TrashIcon}
                    mode="ghost"
                    tone="critical"
                    padding={3}
                    aria-label={`Remove ${labelMeta.title.toLowerCase()}`}
                    onClick={() => handleRemove(item._key)}
                  />
                </Box>
              </Flex>
              <Box>
                <TextArea
                  value={item.value ?? ''}
                  placeholder={valueMeta.placeholder}
                  rows={3}
                  onChange={(event) =>
                    handleFieldChange(
                      item._key,
                      'value',
                      event.currentTarget.value,
                    )
                  }
                />
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
      <Button
        icon={AddIcon}
        mode="ghost"
        text={addItemLabel}
        onClick={handleAdd}
      />
    </Stack>
  );
}

export default LabelValueListInput;
