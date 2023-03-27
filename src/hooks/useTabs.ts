import { useCallback, useState } from 'react';

export default function useTabs<T>(
  defaultTab: T
): [T, (event: React.SyntheticEvent, tab: T) => void] {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  const changeTab = useCallback((event: React.SyntheticEvent, tab: T) => {
    setActiveTab(tab);
  }, []);

  return [activeTab, changeTab];
}
