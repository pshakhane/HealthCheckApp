'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function useNotifications() {
  const { firebaseApp, firestore, user } = useFirebase();
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      setError('This browser does not support desktop notification');
      return;
    }

    if (!VAPID_KEY) {
        setError('VAPID key is not configured. Cannot request permission.');
        console.error("Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY environment variable.");
        return;
    }


    setIsRequesting(true);
    setError(null);

    try {
      const status = await Notification.requestPermission();
      setPermission(status);

      if (status === 'granted') {
        const messaging = getMessaging(firebaseApp);
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        
        if (currentToken && user && firestore) {
          const tokensRef = collection(firestore, 'users', user.uid, 'cloudMessagingTokens');
          await addDoc(tokensRef, {
            token: currentToken,
            userId: user.uid,
            deviceInfo: navigator.userAgent,
            lastRefreshed: serverTimestamp(),
          });
        } else if (!currentToken) {
           setError('No registration token available. Request permission to generate one.');
        }
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
      setError('An error occurred while requesting permission.');
    } finally {
      setIsRequesting(false);
    }
  }, [firebaseApp, firestore, user]);

  useEffect(() => {
    if (permission === 'granted') {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        // You can handle foreground messages here, e.g., show a custom toast.
        // For this example, we'll just log it.
      });

      return () => unsubscribe();
    }
  }, [permission, firebaseApp]);
  
  return { permission, requestPermission, isRequesting, error };
}
