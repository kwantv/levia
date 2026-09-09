import React, { useCallback, useEffect, useState } from 'react';
import { ArrayOfObjectsInputProps, set, unset, useClient } from 'sanity';
import {
  Card,
  Inline,
  Button,
  Spinner,
  Text,
  TextInput,
  Flex,
  Stack,
  Box,
} from '@sanity/ui';
import { AddIcon } from '@sanity/icons/Add';

type Tag = { _id: string; title: string };

// Helper function to generate a basic slug from the title
const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

export function TagChipsInput(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange } = props;
  const client = useClient({ apiVersion: '2023-05-03' });

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // New state for tag creation
  const [newTagTitle, setNewTagTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    client
      .fetch(`*[_type == "tag"]{ _id, title } | order(title asc)`)
      .then((res) => {
        setTags(res);
        setLoading(false);
      })
      .catch(console.error);
  }, [client]);

  const handleToggle = useCallback(
    (tagId: string) => {
      const isSelected = value.some((v: any) => v._ref === tagId);

      if (isSelected) {
        const newValue = value.filter((v: any) => v._ref !== tagId);
        onChange(newValue.length > 0 ? set(newValue) : unset());
      } else {
        const newRef = {
          _type: 'reference',
          _ref: tagId,
          _key: Math.random().toString(36).substring(2, 9),
        };
        onChange(set([...value, newRef]));
      }
    },
    [value, onChange],
  );

  // New function to handle tag creation
  const handleCreateTag = useCallback(async () => {
    const title = newTagTitle.trim();
    if (!title) return;

    setIsCreating(true);

    try {
      // 1. Create the new document in your dataset
      const newDoc = await client.create({
        _type: 'tag',
        title: title,
        slug: {
          _type: 'slug',
          current: generateSlug(title),
        },
      });

      // 2. Add it to our local list of tags so it renders immediately
      setTags((prev) =>
        [...prev, { _id: newDoc._id, title: newDoc.title }].sort((a, b) =>
          a.title.localeCompare(b.title),
        ),
      );

      // 3. Automatically select it for this post
      const newRef = {
        _type: 'reference',
        _ref: newDoc._id,
        _key: Math.random().toString(36).substring(2, 9),
      };
      onChange(set([...value, newRef]));

      // 4. Clear the input
      setNewTagTitle('');
    } catch (err) {
      console.error('Failed to create tag', err);
      alert('Failed to create tag. Check console for details.');
    } finally {
      setIsCreating(false);
    }
  }, [newTagTitle, client, value, onChange]);

  if (loading) {
    return <Spinner muted />;
  }

  return (
    <Stack gap={3}>
      {/* Creation Input Area */}
      <Flex gap={2}>
        <Box flex={1}>
          <TextInput
            placeholder="Nhập tên thẻ mới..."
            value={newTagTitle}
            onChange={(event) => setNewTagTitle(event.currentTarget.value)}
            onKeyDown={(event) => {
              // Allow pressing Enter to submit
              if (event.key === 'Enter') {
                event.preventDefault();
                handleCreateTag();
              }
            }}
            disabled={isCreating}
          />
        </Box>
        <Button
          icon={AddIcon}
          text="Tạo thẻ"
          mode="ghost"
          onClick={handleCreateTag}
          disabled={!newTagTitle.trim() || isCreating}
          loading={isCreating}
        />
      </Flex>

      {/* Existing Tags Chips */}
      {tags.length === 0 ? (
        <Text muted size={1}>
          Chưa có thẻ nào. Hãy tạo một thẻ mới!
        </Text>
      ) : (
        <Inline gap={2}>
          {tags.map((tag) => {
            const isSelected = value.some((v: any) => v._ref === tag._id);

            return (
              <Button
                key={tag._id}
                mode={isSelected ? 'default' : 'ghost'}
                tone={isSelected ? 'primary' : 'default'}
                text={tag.title}
                onClick={() => handleToggle(tag._id)}
                style={{ marginBottom: '4px' }}
              />
            );
          })}
        </Inline>
      )}
    </Stack>
  );
}
