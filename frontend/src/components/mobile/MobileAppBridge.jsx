import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';

const MobileAppBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return undefined;

    document.documentElement.classList.add('capacitor-native');

    StatusBar.setStyle({ style: Style.Light }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#050816' }).catch(() => {});
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});

    const subscriptions = [];

    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack || window.history.length > 1) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    }).then((handle) => subscriptions.push(handle));

    CapacitorApp.addListener('appUrlOpen', ({ url }) => {
      try {
        const target = new URL(url);
        if (target.hostname === 'trainermentors.com' || target.hostname === 'www.trainermentors.com') {
          navigate(`${target.pathname}${target.search}${target.hash}`);
        }
      } catch {
        // Ignore malformed external links and leave the app on its current route.
      }
    }).then((handle) => subscriptions.push(handle));

    return () => {
      document.documentElement.classList.remove('capacitor-native');
      subscriptions.forEach((subscription) => subscription.remove());
    };
  }, [navigate]);

  return null;
};

export default MobileAppBridge;
