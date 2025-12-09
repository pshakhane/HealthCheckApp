'use client';

import { useNotifications } from '@/firebase/messaging/use-notifications';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bell, BellRing } from 'lucide-react';

export function NotificationPermissionManager() {
  const {
    permission,
    requestPermission,
    isRequesting,
    error,
  } = useNotifications();

  if (permission === 'granted') {
    return (
      <Alert className="border-green-300 bg-green-50 text-green-800">
        <Bell className="h-4 w-4 !text-green-600" />
        <AlertTitle>Notifications Enabled</AlertTitle>
        <AlertDescription>
          You will receive notifications from HealthCheckApp.
        </AlertDescription>
      </Alert>
    );
  }

  if (permission === 'denied') {
    return (
      <Alert variant="destructive">
        <Bell className="h-4 w-4" />
        <AlertTitle>Notifications Disabled</AlertTitle>
        <AlertDescription>
          You have blocked notifications. To enable them, please update your browser settings.
        </AlertDescription>
      </Alert>
    );
  }

  if (permission === 'default') {
    return (
      <Alert className="bg-amber-50 border-amber-300 text-amber-900">
        <BellRing className="h-4 w-4 !text-amber-700" />
        <AlertTitle>Enable Notifications</AlertTitle>
        <AlertDescription>
          Stay up-to-date with reminders and health tips.
          <Button
            onClick={requestPermission}
            disabled={isRequesting}
            className="mt-2 ml-auto block"
            size="sm"
            variant="outline"
          >
            {isRequesting ? 'Requesting...' : 'Enable Notifications'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <Bell className="h-4 w-4" />
        <AlertTitle>Notification Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return null; // or a loading skeleton
}
