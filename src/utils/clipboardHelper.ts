import { Platform } from 'react-native';
import { showToast } from '../components/CopyToast';

/**
 * Universal Clipboard helper for React Native Web & Native platforms.
 * Writes text to system clipboard and triggers in-app Toast notification.
 */
export const copyToClipboard = async (text: string, label: string = 'Enlace'): Promise<boolean> => {
  let success = false;

  try {
    if (typeof window !== 'undefined' && navigator && navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      success = true;
    } else if (typeof document !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      success = document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  } catch (err) {
    console.warn('Clipboard write warning:', err);
  }

  // Trigger floating Instagram Toast notification
  showToast(`${label} copiado al portapapeles`);

  return success;
};
