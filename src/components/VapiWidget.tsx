import { useEffect } from 'react';

declare global {
  interface Window {
    vapiSDK?: {
      run: (config: {
        apiKey: string;
        assistant: string;
        config?: Record<string, unknown>;
      }) => void;
    };
  }
}

const PUBLIC_KEY = "07e79bcb-2fca-41c0-b8f6-ad0ecc0d4410";
const SQUAD_ID = "74dba3e7-8b4c-4d6b-aa46-9285851a4b72";

const VapiWidget = () => {
  useEffect(() => {

    const initVapi = () => {
      if (window.vapiSDK) {
        console.log('Vapi SDK found, initializing...');
        window.vapiSDK.run({
          apiKey: PUBLIC_KEY,
          assistant: SQUAD_ID,
          config: {
            position: 'bottom-right',
            offset: '24px',
            idle: {
              color: 'rgb(92, 64, 51)',
              type: 'pill',
              title: 'H&K Leather Support',
              subtitle: 'Ask about our craftsmanship',
              icon: 'https://unpkg.com/lucide-static@0.321.0/icons/message-circle.svg',
            },
            active: {
              color: 'rgb(180, 83, 9)',
              type: 'pill', 
              title: 'Speaking with H&K...',
              subtitle: 'Tap to end call',
              icon: 'https://unpkg.com/lucide-static@0.321.0/icons/phone-call.svg',
            },
          },
        });
      } else {
        console.warn('Vapi SDK not found on window');
      }
    };

    // Wait for the script to load
    if (window.vapiSDK) {
      initVapi();
    } else {
      const checkInterval = setInterval(() => {
        if (window.vapiSDK) {
          initVapi();
          clearInterval(checkInterval);
        }
      }, 200);

      // Clean up after 15 seconds if widget never loads
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('Vapi SDK failed to load within 15 seconds');
      }, 15000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, []);

  return null;
};

export default VapiWidget;
