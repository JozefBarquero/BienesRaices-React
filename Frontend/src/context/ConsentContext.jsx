import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ConsentContext = createContext(null);

const STORAGE_KEY = 'user-consent-preferences';

const defaultConsent = {
  necessary: true,
  analytics: false,
  preferences: false,
  thirdParty: false,
};

export function ConsentProvider({ children }) {
  const [consent, setConsent] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
      } catch {
        setShowBanner(true);
      }
    } else {
      setShowBanner(true);
    }
  }, []);

  const saveConsent = useCallback((newConsent) => {
    const finalConsent = { ...defaultConsent, ...newConsent, necessary: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalConsent));
    setConsent(finalConsent);
    setShowBanner(false);
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: finalConsent }));
  }, []);

  const acceptAll = useCallback(() => {
    saveConsent({ necessary: true, analytics: true, preferences: true, thirdParty: true });
  }, [saveConsent]);

  const rejectNonEssential = useCallback(() => {
    saveConsent({ necessary: true, analytics: false, preferences: false, thirdParty: false });
  }, [saveConsent]);

  const openBanner = useCallback(() => {
    setShowBanner(true);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        showBanner,
        acceptAll,
        rejectNonEssential,
        saveConsent,
        openBanner,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent debe usarse dentro de ConsentProvider');
  }
  return context;
}