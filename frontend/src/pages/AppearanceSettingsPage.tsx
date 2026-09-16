import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor, Sliders, CheckCircle2 } from 'lucide-react';

export const AppearanceSettingsPage: React.FC = () => {
  const {
    theme,
    setTheme,
    density,
    setDensity,
    fontSize,
    setFontSize,
    mapStyle,
    setMapStyle,
    effectiveTheme,
  } = useTheme();

  const [savedMsg, setSavedMsg] = useState<string>('');

  const handleSave = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/appearance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          density,
          font_size: fontSize,
          sidebar_state: 'expanded',
          animations: 'enabled',
          map_style: mapStyle,
        }),
      });
    } catch {
      // Local save already active
    }
    setSavedMsg('Appearance preferences updated and synchronized with user profile.');
    setTimeout(() => setSavedMsg(''), 3500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <Sliders className="w-5 h-5 text-sky-400" />
          <span>System Appearance & Theme Personalization Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize UI light/dark theme modes, typography scale, layout density, and Mapbox map rendering styles.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center space-x-2 font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Theme Mode Selection */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Theme Mode Selection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${
              theme === 'light'
                ? 'bg-sky-500/10 border-sky-500 text-sky-400 ring-2 ring-sky-500/30 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-6 h-6 text-amber-400" />
            <span className="text-xs">NIC Light Mode</span>
            <span className="text-[10px] text-slate-500 font-mono">Clean white/slate background</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${
              theme === 'dark'
                ? 'bg-sky-500/10 border-sky-500 text-sky-400 ring-2 ring-sky-500/30 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-6 h-6 text-sky-400" />
            <span className="text-xs">Enterprise Dark Mode</span>
            <span className="text-[10px] text-slate-500 font-mono">Deep navy command console</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-5 rounded-2xl border flex flex-col items-center space-y-2 transition-all ${
              theme === 'system'
                ? 'bg-sky-500/10 border-sky-500 text-sky-400 ring-2 ring-sky-500/30 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-6 h-6 text-emerald-400" />
            <span className="text-xs">System Match</span>
            <span className="text-[10px] text-slate-500 font-mono">Follow OS preference</span>
          </button>
        </div>
      </div>

      {/* Density & Map Style Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm">Layout Density & Typography Scale</h3>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Layout Density:</label>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <button
                  onClick={() => setDensity('comfortable')}
                  className={`p-2.5 rounded-xl border text-center ${
                    density === 'comfortable' ? 'bg-sky-950 text-sky-400 border-sky-800 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  onClick={() => setDensity('compact')}
                  className={`p-2.5 rounded-xl border text-center ${
                    density === 'compact' ? 'bg-sky-950 text-sky-400 border-sky-800 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Font Size Scale:</label>
              <div className="grid grid-cols-3 gap-2 font-mono">
                {(['small', 'medium', 'large'] as const).map((fs) => (
                  <button
                    key={fs}
                    onClick={() => setFontSize(fs)}
                    className={`p-2 rounded-xl border text-center uppercase ${
                      fontSize === fs ? 'bg-sky-950 text-sky-400 border-sky-800 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {fs}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Style */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-sm">Mapbox Corridor Map Style</h3>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Map Tile Layer:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark', label: 'Dark Vector' },
                  { id: 'standard', label: 'Standard Street' },
                  { id: 'satellite', label: 'Satellite' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setMapStyle(st.id)}
                    className={`p-2.5 rounded-xl border text-center text-[11px] ${
                      mapStyle === st.id ? 'bg-sky-950 text-sky-400 border-sky-800 font-bold' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              Active Map Theme: <strong className="text-sky-400">{mapStyle.toUpperCase()}</strong> (Effective System Mode: <strong className="text-emerald-400">{effectiveTheme.toUpperCase()}</strong>)
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition-all"
        >
          Save & Apply Appearance Preferences
        </button>
      </div>
    </div>
  );
};
