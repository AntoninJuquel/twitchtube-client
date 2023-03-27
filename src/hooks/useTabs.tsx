import { useCallback, useState, useMemo } from 'react';
import { Tab, Tabs as MuiTabs } from '@mui/material';

type TabItem<T> = {
  value: T;
  label: string;
  icon?: React.ReactElement;
};

export default function useTabs<T>(defaultTab: T, tabs: TabItem<T>[]) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab);

  const changeTab = useCallback((event: React.SyntheticEvent, tab: T) => {
    setActiveTab(tab);
  }, []);

  const Tabs = useMemo(
    () => (
      <MuiTabs
        onChange={changeTab}
        value={activeTab}
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            value={tab.value}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </MuiTabs>
    ),
    [changeTab, tabs, activeTab]
  );

  return { Tabs, activeTab, changeTab };
}
