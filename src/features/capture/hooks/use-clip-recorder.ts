import { CameraView } from 'expo-camera';
import { useCallback, useRef, useState, type RefObject } from 'react';

import { MIN_CLIP_DURATION_MS, MAX_CLIP_DURATION_SEC } from '@/features/capture/constants';
import { discardTempRecording, saveClipFromRecording } from '@/features/clip/clip-repository';

export type RecorderPhase = 'idle' | 'recording' | 'saving';

async function hapticImpact(): Promise<void> {
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Dev build may predate expo-haptics native module
  }
}

async function hapticSuccess(): Promise<void> {
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // noop
  }
}

type UseClipRecorderOptions = {
  cameraRef: RefObject<CameraView | null>;
  micEnabled: boolean;
  cameraReady: boolean;
  onClipSaved: () => void;
};

export function useClipRecorder({
  cameraRef,
  micEnabled,
  cameraReady,
  onClipSaved,
}: UseClipRecorderOptions) {
  const [phase, setPhase] = useState<RecorderPhase>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const recordPromiseRef = useRef<Promise<{ uri: string } | undefined> | null>(null);

  const startRecording = useCallback(async () => {
    if (!cameraReady || phase !== 'idle' || !cameraRef.current) {
      return;
    }
    setErrorMessage(null);
    recordingStartedAtRef.current = Date.now();
    setPhase('recording');
    void hapticImpact();

    recordPromiseRef.current = cameraRef.current.recordAsync({
      maxDuration: MAX_CLIP_DURATION_SEC,
    });
  }, [cameraReady, cameraRef, phase]);

  const stopRecording = useCallback(async () => {
    if (phase !== 'recording' || !cameraRef.current) {
      return;
    }

    cameraRef.current.stopRecording();
    setPhase('saving');

    const startedAt = recordingStartedAtRef.current ?? Date.now();
    const durationMs = Date.now() - startedAt;
    let tempUri: string | undefined;

    try {
      const result = await recordPromiseRef.current;
      tempUri = result?.uri;

      if (!tempUri) {
        setErrorMessage('Recording did not finish. Try again.');
        return;
      }

      if (durationMs < MIN_CLIP_DURATION_MS) {
        await discardTempRecording(tempUri);
        setErrorMessage('Hold a little longer (at least 1 second).');
        return;
      }

      await saveClipFromRecording({
        tempUri,
        durationMs,
        hasAudio: micEnabled,
      });
      void hapticSuccess();
      onClipSaved();
    } catch {
      await discardTempRecording(tempUri);
      setErrorMessage('Could not save clip. Try again.');
    } finally {
      recordPromiseRef.current = null;
      recordingStartedAtRef.current = null;
      setPhase('idle');
    }
  }, [cameraRef, micEnabled, onClipSaved, phase]);

  const cancelRecording = useCallback(async () => {
    if (phase !== 'recording' || !cameraRef.current) {
      return;
    }
    cameraRef.current.stopRecording();
    setPhase('saving');
    try {
      const result = await recordPromiseRef.current;
      await discardTempRecording(result?.uri);
    } catch {
      // ignore
    } finally {
      recordPromiseRef.current = null;
      recordingStartedAtRef.current = null;
      setPhase('idle');
    }
  }, [cameraRef, phase]);

  return {
    phase,
    errorMessage,
    startRecording,
    stopRecording,
    cancelRecording,
    clearError: () => setErrorMessage(null),
  };
}
