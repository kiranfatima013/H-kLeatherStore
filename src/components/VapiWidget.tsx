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
    // Add custom CSS to ensure fixed positioning
    const style = document.createElement('style');
    style.textContent = `
      #vapi-widget-container,
      [data-vapi-widget],
      .vapi-btn,
      div[style*="position: fixed"][style*="bottom"] {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);

    const initVapi = () => {
      if (window.vapiSDK) {
        console.log('Vapi SDK found, initializing...');
        window.vapiSDK.run({
          apiKey: PUBLIC_KEY,
          assistant: SQUAD_ID,
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
            loading: {
              color: 'rgb(120, 60, 15)',
              type: 'pill',
              title: 'Connecting...',
              subtitle: 'Please wait',
              icon: 'https://unpkg.com/lucide-static@0.321.0/icons/loader.svg',
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
        style.remove();
      };
    }

    return () => {
      style.remove();
    };
  }, []);

  return null;
};

export default VapiWidget;
