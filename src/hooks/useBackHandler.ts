import { useEffect } from 'react';
import { App } from '@capacitor/app';

const useBackHandler = (onBack?: () => boolean) => {
  useEffect(() => {
    const handler = App.addListener('backButton', ({ canGoBack }) => {
      if (onBack) {
        const handled = onBack();
        if (handled) return;
      }
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
    return () => {
      handler.then(h => h.remove());
    };
  }, [onBack]);
};

export default useBackHandler;