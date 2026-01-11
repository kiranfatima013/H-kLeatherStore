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

const VapiWidget = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

    if (!apiKey || !assistantId) {
      console.warn('Vapi: Missing API key or Assistant ID');
      return;
    }

    const initVapi = () => {
      if (window.vapiSDK) {
        console.log('Vapi SDK found, initializing...');
        window.vapiSDK.run({
          apiKey: apiKey,
          assistant: assistantId,
          config: {
            position: 'bottom-right',
            offset: '20px',
            idle: {
              color: 'rgb(139, 69, 19)',
              type: 'pill',
              title: 'Talk to us',
              subtitle: 'We are here to help!',
              icon: 'https://unpkg.com/lucide-static@0.321.0/icons/headphones.svg',
            },
            active: {
              color: 'rgb(101, 50, 13)',
              type: 'pill', 
              title: 'Call in progress...',
              subtitle: 'Tap to end call',
              icon: 'https://unpkg.com/lucide-static@0.321.0/icons/phone.svg',
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
