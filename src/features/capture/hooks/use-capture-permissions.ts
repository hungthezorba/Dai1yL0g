import {
  PermissionResponse,
  useCameraPermissions,
  useMicrophonePermissions,
} from 'expo-camera';
import { useCallback, useMemo } from 'react';

export type CapturePermissionStatus = 'loading' | 'denied' | 'granted';

export function useCapturePermissions() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();

  const status: CapturePermissionStatus = useMemo(() => {
    if (!cameraPermission || !microphonePermission) {
      return 'loading';
    }
    if (cameraPermission.granted && microphonePermission.granted) {
      return 'granted';
    }
    return 'denied';
  }, [cameraPermission, microphonePermission]);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const cameraResult: PermissionResponse | null = await requestCameraPermission();
    const micResult: PermissionResponse | null = await requestMicrophonePermission();
    return Boolean(cameraResult?.granted && micResult?.granted);
  }, [requestCameraPermission, requestMicrophonePermission]);

  return {
    status,
    cameraPermission,
    microphonePermission,
    requestPermissions,
  };
}
