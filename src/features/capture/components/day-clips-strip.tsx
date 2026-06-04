import { Image } from 'expo-image';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { CaptureColors, CaptureLayout } from '@/features/capture/design-tokens';
import type { ClipUploadState, LocalClip } from '@/features/clip/types';
import { formatDayLabel } from '@/features/day/local-day';
import { PlayfulColors } from '@/design/tokens';

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

function uploadBadgeLabel(state: ClipUploadState): string | null {
  switch (state) {
    case 'uploading':
      return 'Posting…';
    case 'failed':
      return 'Retry';
    case 'posted':
      return null;
    default:
      return 'Queued';
  }
}

type DayClipsStripProps = {
  dayKey: string;
  clips: LocalClip[];
  loading: boolean;
  onRetryUpload?: (clipId: string) => void;
};

export function DayClipsStrip({ dayKey, clips, loading, onRetryUpload }: DayClipsStripProps) {
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
          renderItem={({ item }) => {
            const badge = uploadBadgeLabel(item.uploadState);
            const isRetryable = item.uploadState === 'failed' || item.uploadState === 'local_only';

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Clip at ${formatClipTime(item.capturedAt)}, ${formatDuration(item.durationMs)}${badge ? `, ${badge}` : ''}`}
                style={styles.thumbCard}
                onPress={isRetryable && onRetryUpload ? () => onRetryUpload(item.id) : undefined}
                disabled={item.uploadState === 'uploading'}>
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
                {badge ? (
                  <View
                    style={[
                      styles.badge,
                      item.uploadState === 'failed' && styles.badgeFailed,
                      item.uploadState === 'posted' && styles.badgePosted,
                    ]}>
                    {item.uploadState === 'uploading' ? (
                      <ActivityIndicator size="small" color={CaptureColors.onCameraText} />
                    ) : (
                      <ThemedText type="small" style={styles.badgeText}>
                        {badge}
                      </ThemedText>
                    )}
                  </View>
                ) : null}
                {item.uploadState === 'posted' ? (
                  <View style={[styles.badge, styles.badgePosted]}>
                    <ThemedText type="small" style={styles.badgeText}>
                      Live
                    </ThemedText>
                  </View>
                ) : null}
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
            );
          }}
        />
      )}
    </View>
  );
}

const thumb = CaptureLayout.clipThumbSize;

const styles = StyleSheet.create({
  container: {
    backgroundColor: CaptureColors.timelineBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 3,
    borderColor: CaptureColors.frame,
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
  badge: {
    position: 'absolute',
    top: Spacing.one,
    right: Spacing.one,
    backgroundColor: 'rgba(17,17,17,0.75)',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.one,
    paddingVertical: 2,
    minWidth: 44,
    alignItems: 'center',
  },
  badgeFailed: {
    backgroundColor: PlayfulColors.primary,
  },
  badgePosted: {
    backgroundColor: CaptureColors.success,
  },
  badgeText: {
    color: CaptureColors.onCameraText,
    fontSize: 10,
    fontWeight: '700',
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
