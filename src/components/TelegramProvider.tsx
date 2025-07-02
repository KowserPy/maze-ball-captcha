
import React, { createContext, useContext, useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_bot?: boolean;
}

interface TelegramContextType {
  user: TelegramUser | null;
  isReady: boolean;
  isMobile: boolean;
  isInTelegram: boolean;
  deviceOrientation: { alpha: number; beta: number; gamma: number } | null;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  isReady: false,
  isMobile: false,
  isInTelegram: false,
  deviceOrientation: null,
});

export const useTelegram = () => useContext(TelegramContext);

const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [deviceOrientation, setDeviceOrientation] = useState<{ alpha: number; beta: number; gamma: number } | null>(null);

  useEffect(() => {
    // Check if we're in Telegram WebApp environment
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      setIsInTelegram(true);
      
      // Initialize Telegram WebApp
      tg.ready();
      tg.expand();
      
      console.log('Telegram WebApp initialized');
      console.log('Platform:', tg.platform);
      console.log('Init data unsafe:', tg.initDataUnsafe);
      
      // Check if it's mobile platform
      const mobilePatterns = ['android', 'ios', 'mobile'];
      const isMobilePlatform = mobilePatterns.some(pattern => 
        tg.platform.toLowerCase().includes(pattern)
      ) || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobile(isMobilePlatform);
      
      // Get user data from Telegram - be more flexible with user validation
      if (tg.initDataUnsafe?.user) {
        const telegramUser = tg.initDataUnsafe.user;
        console.log('Raw Telegram user data:', telegramUser);
        
        // More flexible user validation - just check if we have an ID
        if (telegramUser.id && typeof telegramUser.id === 'number') {
          setUser(telegramUser);
          console.log('Telegram user loaded:', telegramUser);
        } else {
          console.error('Invalid user data:', telegramUser);
          setUser(null);
        }
      } else {
        console.warn('No Telegram user found in initDataUnsafe');
        setUser(null);
      }
      
      // Start device orientation tracking for mobile users
      if (isMobilePlatform) {
        console.log('Attempting to start device orientation tracking');
        
        // Check if DeviceOrientation is available
        if (tg.DeviceOrientation) {
          console.log('DeviceOrientation API available, starting...');
          
          // Start device orientation tracking with correct parameter structure
          tg.DeviceOrientation.start(
            { refresh_rate: 50, need_absolute: false },
            (success) => {
              console.log('Device orientation start result:', success);
              if (success) {
                console.log('Device orientation started successfully');
                
                // Set up a polling mechanism to get orientation data
                const pollOrientation = () => {
                  if (tg.DeviceOrientation.isStarted) {
                    setDeviceOrientation({
                      alpha: tg.DeviceOrientation.alpha,
                      beta: tg.DeviceOrientation.beta,
                      gamma: tg.DeviceOrientation.gamma
                    });
                  }
                };
                
                // Poll orientation data at regular intervals
                const orientationInterval = setInterval(pollOrientation, 50);
                
                // Clean up interval on unmount
                return () => clearInterval(orientationInterval);
              } else {
                console.log('Device orientation failed to start');
              }
            }
          );
        } else {
          console.log('DeviceOrientation API not available');
          // Try to use web API as fallback
          if (window.DeviceOrientationEvent) {
            console.log('Using web DeviceOrientationEvent as fallback');
            window.addEventListener('deviceorientation', (event) => {
              if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
                setDeviceOrientation({
                  alpha: event.alpha,
                  beta: event.beta,
                  gamma: event.gamma
                });
              }
            });
          }
        }
      } else {
        console.log('Not mobile platform, skipping device orientation');
      }
      
      setIsReady(true);
    } else {
      // Not in Telegram environment
      console.warn('Not in Telegram environment');
      setIsInTelegram(false);
      setIsMobile(false);
      setUser(null);
      setIsReady(true);
    }

    return () => {
      // Cleanup device orientation tracking
      if (window.Telegram?.WebApp?.DeviceOrientation) {
        console.log('Stopping device orientation tracking');
        window.Telegram.WebApp.DeviceOrientation.stop();
      }
    };
  }, []);

  return (
    <TelegramContext.Provider value={{ 
      user, 
      isReady, 
      isMobile, 
      isInTelegram,
      deviceOrientation 
    }}>
      {children}
    </TelegramContext.Provider>
  );
};

export default TelegramProvider;
