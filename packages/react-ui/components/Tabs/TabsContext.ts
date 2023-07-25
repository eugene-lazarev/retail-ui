import React from 'react';

import { emptyHandler } from '../../lib/utils';

import { Tab, TabSize } from './Tab';

export interface TabsContextType<T extends string = any> {
  vertical: boolean;
  activeTab: T;
  size: TabSize;
  getTab: (id: T) => Tab<T> | null | void;
  addTab: (id: T, getNode: () => Tab<T>) => void;
  notifyUpdate: () => void;
  removeTab: (id: T) => void;
  shiftFocus: (fromTab: T, delta: number) => void;
  switchTab: (id: T) => void;
}

export const TabsContextDefaultValue: TabsContextType = {
  vertical: false,
  activeTab: '',
  size: 'large',
  getTab: emptyHandler,
  addTab: emptyHandler,
  notifyUpdate: emptyHandler,
  removeTab: emptyHandler,
  shiftFocus: emptyHandler,
  switchTab: emptyHandler,
};
export const TabsContext = React.createContext<TabsContextType>(TabsContextDefaultValue);

TabsContext.displayName = 'TabsContext';
