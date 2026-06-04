import { Image } from 'expo-image';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { CaptureColors, CaptureLayout } from '@/features/capture/design-tokens';
import type { LocalClip } from '@/features/clip/types';
import { formatDayLabel } from '@/features/day/local-day';

function formatClipTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(ms: number): string {
  const sec = Math.max(1, Math.round(ms / 1000));
  return `${sec}s`;
}

type DayClipsStripProps = {
  dayKey: string;
  clips: LocalClip[];
  loading: boolean;
};

export function DayClipsStrip({ dayKey, clips, loading }: DayClipsStripProps) {
  if (loading && clips.length === 0) {
    return (
      <View style={styles.container}>
        <ThemedText type="small" style={styles.label}>
          Loading today…
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="smallBold" style={styles.label}>
          {formatDayLabel(dayKey)}
        </ThemedText>
        <ThemedText type="small" style={styles.count}>
          {clips.length} {clips.length === 1 ? 'clip' : 'clips'}
        </ThemedText>
      </View>
      {clips.length === 0 ? (
        <ThemedText type="small" style={styles.empty}>
          Hold the button to capture your first moment
        </ThemedText>
      ) : (
        <FlatList
          horizontal
          data={clips}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Clip at ${formatClipTime(item.capturedAt)}, ${formatDuration(item.durationMs)}`}
              style={styles.thumbCard}>
              {item.thumbnailPath ? (
                <Image
                  source={{ uri: item.thumbnailPath }}
                  style={styles.thumbImage}
                  contentFit="cover"
                />
              ) : (
                <View style={[styles.thumbImage, styles.thumbPlaceholder]}>
                  <ThemedText type="smallBold" style={styles.thumbPlaceholderIcon}>
                    {formatDuration(item.durationMs)}
                  </ThemedText>
                </View>
              )}
              <View style={styles.thumbMeta}>
                <ThemedText type="small" style={styles.thumbTime}>
                  {formatClipTime(item.capturedAt)}
                </ThemedText>
                <ThemedText type="small" style={styles.thumbDuration}>
                  {formatDuration(item.durationMs)}
                  {!item.hasAudio ? ' · muted' : ''}
                </ThemedText>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const thumb = CaptureLayout.clipThumbSize;

const styles = StyleSheet.create({
  container: {
    backgroundColor: CaptureColors.timelineBg,
    borderTopLeftRadius: Spacing.three,
    borderTopRightRadius: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
  },
  label: {
    color: CaptureColors.onCameraText,
  },
  count: {
    color: 'rgba(255,255,255,0.75)',
  },
  empty: {
    color: 'rgba(255,255,255,0.7)',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.one,
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  thumbCard: {
    width: thumb,
    borderRadius: Spacing.two,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  thumbImage: {
    width: thumb,
    height: thumb,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  thumbPlaceholderIcon: {
    color: CaptureColors.onCameraText,
    fontSize: 22,
  },
  thumbMeta: {
    paddingHorizontal: Spacing.one,
    paddingVertical: Spacing.one,
    gap: 2,
  },
  thumbTime: {
    color: CaptureColors.onCameraText,
    fontSize: 11,
  },
  thumbDuration: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
});
