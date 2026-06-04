import { CameraView, type CameraType } from 'expo-camera';
import { useFocusEffect, useIsFocused } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandWordmark } from '@/components/playful/brand-wordmark';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { AppFonts } from '@/hooks/use-app-fonts';
import { CaptureColors } from '@/features/capture/design-tokens';
import { useCapturePermissions } from '@/features/capture/hooks/use-capture-permissions';
import { useClipRecorder } from '@/features/capture/hooks/use-clip-recorder';
import {
  formatRecordReadyMs,
  recordReadyMeetsTarget,
  type RecordReadyState,
} from '@/features/capture/record-ready';
import { useClipUploadQueue } from '@/features/clip/hooks/use-clip-upload-queue';
import { useTodayClips } from '@/features/clip/hooks/use-today-clips';

import { DayClipsStrip } from './day-clips-strip';
import { RecordButton } from './record-button';

function CaptureWebFallback() {
  return (
    <SafeAreaView style={[styles.fallback, styles.fallbackLight]}>
      <BrandWordmark />
      <ThemedText type="subtitle" themeColor="textSecondary" style={styles.fallbackBody}>
        Clip recording runs on a development build for iOS or Android. Use{' '}
        <ThemedText type="code">npm run start:dev</ThemedText> after installing a dev client.
      </ThemedText>
    </SafeAreaView>
  );
}

function PermissionGate({ onEnable }: { onEnable: () => void }) {
  return (
    <SafeAreaView style={[styles.fallback, styles.fallbackLight]}>
      <BrandWordmark size="md" />
      <ThemedText type="subtitle" style={styles.fallbackTitle}>
        Capture your day
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.fallbackBody}>
        Dai1yL0g needs camera and microphone access for short clips with sound.
      </ThemedText>
      <Pressable style={styles.primaryButton} onPress={onEnable}>
        <ThemedText type="smallBold" style={styles.primaryButtonLabel}>
          Enable camera
        </ThemedText>
      </Pressable>
    </SafeAreaView>
  );
}

function StatusPill({
  readyState,
  readyMs,
}: {
  readyState: RecordReadyState;
  readyMs: number | null;
}) {
  const timing = recordReadyMeetsTarget(readyMs);
  const label =
    readyState === 'ready'
      ? `Record-ready · ${formatRecordReadyMs(readyMs)}`
      : readyState === 'warming_up'
        ? 'Starting camera…'
        : readyState === 'loading_permissions'
          ? 'Loading…'
          : 'Unavailable';

  const pillStyle =
    timing === 'ok'
      ? styles.statusOk
      : timing === 'warn'
        ? styles.statusWarn
        : timing === 'slow'
          ? styles.statusSlow
          : styles.statusPending;

  return (
    <View style={[styles.statusPill, pillStyle]}>
      <ThemedText type="small" style={styles.statusText}>
        {label}
      </ThemedText>
    </View>
  );
}

export function CaptureScreen() {
  if (Platform.OS === 'web') {
    return <CaptureWebFallback />;
  }

  return <CaptureScreenNative />;
}

function CaptureScreenNative() {
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);
  const { status, requestPermissions } = useCapturePermissions();
  const { clips, loading, dayKey, refresh } = useTodayClips();
  const onClipUpdated = useCallback(() => {
    void refresh();
  }, [refresh]);
  const { enqueueUpload, retryClip } = useClipUploadQueue({
    onClipUpdated,
    active: isFocused,
  });
  const [facing, setFacing] = useState<CameraType>('back');
  const [micEnabled, setMicEnabled] = useState(true);
  const [readyMs, setReadyMs] = useState<number | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const mountAtRef = useRef(0);

  const beginWarmup = useCallback(() => {
    mountAtRef.current = performance.now();
    setReadyMs(null);
    setCameraReady(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      beginWarmup();
      void refresh();
      enqueueUpload();
    }, [beginWarmup, enqueueUpload, refresh]),
  );

  const { phase, errorMessage, startRecording, stopRecording, clearError } = useClipRecorder({
    cameraRef,
    micEnabled,
    cameraReady,
    onClipSaved: () => {
      onClipUpdated();
      enqueueUpload();
    },
  });

  const readyState: RecordReadyState = useMemo(() => {
    if (status === 'loading') {
      return 'loading_permissions';
    }
    if (status === 'denied') {
      return 'awaiting_permissions';
    }
    if (cameraReady) {
      return 'ready';
    }
    return 'warming_up';
  }, [status, cameraReady]);

  const handleCameraReady = useCallback(() => {
    const elapsed = Math.round(performance.now() - mountAtRef.current);
    setReadyMs(elapsed);
    setCameraReady(true);
  }, []);

  const toggleFacing = useCallback(() => {
    if (phase === 'recording') {
      return;
    }
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
    beginWarmup();
  }, [beginWarmup, phase]);

  if (status === 'loading') {
    return (
      <SafeAreaView style={styles.fallback}>
        <ThemedText type="subtitle">Loading permissions…</ThemedText>
      </SafeAreaView>
    );
  }

  if (status === 'denied') {
    return (
      <PermissionGate
        onEnable={() => {
          beginWarmup();
          void requestPermissions();
        }}
      />
    );
  }

  const recordDisabled = !cameraReady || phase === 'saving';

  return (
    <View style={styles.container}>
      <CameraView
        key={facing}
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode="video"
        mute={!micEnabled}
        active={isFocused}
        onCameraReady={handleCameraReady}
      />
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={styles.header}>
          <BrandWordmark size="sm" onDark />
          <ThemedText type="small" style={styles.rotateHint}>
            rotate to capture
          </ThemedText>
          <StatusPill readyState={readyState} readyMs={readyMs} />
        </View>

        <View style={styles.centerControls} pointerEvents="box-none">
          {errorMessage ? (
            <Pressable style={styles.errorBanner} onPress={clearError}>
              <ThemedText type="small" style={styles.errorText}>
                {errorMessage}
              </ThemedText>
            </Pressable>
          ) : null}
          <View style={styles.controlsRow}>
            <Pressable
              style={[styles.sideButton, micEnabled && styles.sideButtonActive]}
              onPress={() => setMicEnabled((v) => !v)}
              disabled={phase === 'recording'}>
              <ThemedText type="smallBold" style={styles.sideButtonLabel}>
                {micEnabled ? 'Mic on' : 'Muted'}
              </ThemedText>
            </Pressable>
            <RecordButton
              phase={phase}
              disabled={recordDisabled}
              onPressIn={() => void startRecording()}
              onPressOut={() => void stopRecording()}
            />
            <Pressable style={styles.sideButton} onPress={toggleFacing} disabled={phase === 'recording'}>
              <ThemedText type="smallBold" style={styles.sideButtonLabel}>
                Flip
              </ThemedText>
            </Pressable>
          </View>
          <ThemedText type="small" style={styles.hint}>
            {phase === 'recording' ? 'Release to save' : phase === 'saving' ? 'Saving…' : 'Hold to capture (max 10s)'}
          </ThemedText>
        </View>

        <DayClipsStrip dayKey={dayKey} clips={clips} loading={loading} onRetryUpload={retryClip} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  rotateHint: {
    color: CaptureColors.primaryMuted,
    fontFamily: AppFonts.body,
    textTransform: 'lowercase',
  },
  fallbackLight: {
    backgroundColor: '#FFF8FA',
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
  },
  statusPending: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statusOk: {
    backgroundColor: 'rgba(34,197,94,0.85)',
  },
  statusWarn: {
    backgroundColor: 'rgba(234,179,8,0.9)',
  },
  statusSlow: {
    backgroundColor: 'rgba(239,68,68,0.9)',
  },
  statusText: {
    color: CaptureColors.onCameraText,
  },
  centerControls: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  sideButton: {
    backgroundColor: CaptureColors.overlay,
    borderRadius: 20,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    minWidth: 72,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sideButtonActive: {
    borderColor: CaptureColors.primaryMuted,
  },
  sideButtonLabel: {
    color: CaptureColors.onCameraText,
  },
  hint: {
    color: 'rgba(255,255,255,0.75)',
  },
  errorBanner: {
    backgroundColor: 'rgba(239,68,68,0.9)',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    maxWidth: 320,
  },
  errorText: {
    color: CaptureColors.onCameraText,
    textAlign: 'center',
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  fallbackTitle: {
    textAlign: 'center',
    color: CaptureColors.primary,
    fontFamily: AppFonts.displaySemi,
  },
  fallbackBody: {
    textAlign: 'center',
    lineHeight: 22,
  },
  primaryButton: {
    alignSelf: 'center',
    backgroundColor: CaptureColors.primary,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  primaryButtonLabel: {
    color: CaptureColors.onCameraText,
  },
});
