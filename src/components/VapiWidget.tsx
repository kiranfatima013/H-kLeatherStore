import { useEffect } from 'react';

declare global {
  interface Window {
    vapiWidget?: {
      run: (config: {
        apiKey: string;
        assistant: string;
        config?: {
          position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
          offset?: string;
          width?: string;
          height?: string;
          idle?: {
            color?: string;
            type?: 'pill' | 'round';
            title?: string;
            subtitle?: string;
            icon?: string;
          };
          active?: {
            color?: string;
            type?: 'pill' | 'round';
            title?: string;
            subtitle?: string;
            icon?: string;
          };
        };
      }) => void;
    };
  }
}

const VapiWidget = () => {
  useEffect(() => {
    const initVapi = () => {
      if (window.vapiWidget) {
        window.vapiWidget.run({
          apiKey: import.meta.env.VITE_VAPI_PUBLIC_KEY || '',
          assistant: import.meta.env.VITE_VAPI_ASSISTANT_ID || '',
          config: {
            position: 'bottom-right',
            offset: '20px',
            width: '60px',
            height: '60px',
            idle: {
              color: 'hsl(25, 77%, 27%)',
              type: 'pill',
              title: 'Chat with us',
              subtitle: 'We are here to help!',
              icon: 'https://unpkg.com/lucide-static@0.321.0/icons/message-circle.svg',
            },
            active: {
              color: 'hsl(25, 77%, 20%)',
              type: 'pill',
              title: 'Call in progress...',
              subtitle: 'Tap to end call',
              icon: 'https://unpkg.com/lucide-static@0.321.0/icons/phone.svg',
            },
          },
        });
      }
    };

    // Wait for the script to load
    if (window.vapiWidget) {
      initVapi();
    } else {
      const checkInterval = setInterval(() => {
        if (window.vapiWidget) {
          initVapi();
          clearInterval(checkInterval);
        }
      }, 100);

      // Clean up after 10 seconds if widget never loads
      setTimeout(() => clearInterval(checkInterval), 10000);
    }
  }, []);

  return null;
};

export default VapiWidget;
