import { useCallback, useState, useMemo } from 'react';
import { Tab, Tabs as MuiTabs, Icon } from '@mui/material';

type TabItem<T> = {
  value: T;
  label: string;
  icon?: string;
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
            label={tab.icon ? '' : tab.label}
            icon={tab.icon && <Icon>{tab.icon}</Icon>}
          />
        ))}
      </MuiTabs>
    ),
    [changeTab, tabs, activeTab]
  );

  return { Tabs, activeTab, changeTab };
}
