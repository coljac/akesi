import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { X } from 'lucide-react';
import { fontOptions, defaultAsciiFont, defaultUcsurFont } from '../config/fontConfig';
// Update the import to match the actual export
import { EnhancedText } from '../components/EnhancedText';
import { useEffect } from 'react';

// Change the component props to accept an onClose function
interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();

  // Add this useEffect for debugging
  const availableFonts = fontOptions.filter(font => 
    (settings.useUCSUR && font.ucsurCompatible) ||
    (!settings.useUCSUR && font.asciiCompatible)
  );

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = e.target.value as FontType;
    updateSettings({ sitelenPonaFont: newFont });
  };

  const handleRenderChange = () => {
    const newRender = settings.render === 'latin' ? 'sitelen_pona' : 'latin';
    if (newRender === 'sitelen_pona') {
      const newFont = settings.useUCSUR ? defaultUcsurFont : defaultAsciiFont;
      updateSettings({ render: newRender, sitelenPonaFont: newFont });
    } else {
      updateSettings({ render: newRender });
    }
  };

  const handleUCSURChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUseUCSUR = e.target.checked;
    const newFont = newUseUCSUR ? defaultUcsurFont : defaultAsciiFont;
    updateSettings({ useUCSUR: newUseUCSUR, sitelenPonaFont: newFont });
  };

  // Add this new function
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Add onClick handler to the overlay div
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close settings"
          >
            <X size={24} />
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-lg font-medium">Latin</span>
              <button
                onClick={handleRenderChange}
                className="relative inline-flex items-center h-10 rounded-full w-20 bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className={`${settings.render === 'latin' ? 'translate-x-1' : 'translate-x-11'} inline-block w-8 h-8 transform bg-white rounded-full transition-transform`} />
              </button>
              <span className="text-lg font-medium">sitelen pona</span>
            </div>
            
            {settings.render === 'sitelen_pona' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useUCSUR"
                  checked={settings.useUCSUR}
                  onChange={handleUCSURChange}
                  className="mr-2"
                />
                <label htmlFor="useUCSUR">Use UCSUR</label>
              </div>
            )}
          </div>

          {settings.render === 'sitelen_pona' && (
            <div>
              <h2 className="text-xl font-semibold mb-2">sitelen pona Font</h2>
              <select
                value={settings.sitelenPonaFont}
                onChange={handleFontChange}
                className="w-full p-2 border rounded"
              >
                {availableFonts.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="showHints"
              checked={settings.showHints}
              onChange={(e) => updateSettings({ showHints: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="showHints">Show hints</label>
          </div>

          {/* Add preview box */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="p-4 border rounded-lg flex justify-center items-center" style={{ minHeight: '100px', fontSize: '1.875rem' }}>
              <EnhancedText
                text="toki pona li pona"
                isEnglish={false}
                key={`${settings.render}-${settings.useUCSUR}-${settings.latinFont}-${settings.sitelenPonaFont}`} // Add this key prop
              />
            </div>
          </div>

          {/* Add keyboard shortcuts description */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
            <ul className="list-disc list-inside">
              <li><strong>\</strong> - Toggle between Latin and sitelen pona</li>
              <li><strong>u</strong> - Toggle UCSUR</li>
              <li><strong>[</strong> and <strong>]</strong> - Cycle through fonts</li>
              <li><strong>?</strong> - Toggle hints</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
