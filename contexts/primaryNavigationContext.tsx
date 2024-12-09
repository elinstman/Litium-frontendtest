'use client';
import { createContext, useState } from 'react';

type PrimaryNavigationStateType = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const PrimaryNavigationContext =
  createContext<PrimaryNavigationStateType>({
    visible: false,
    setVisible: (_) => {},
  });

export default function PrimaryNavigationProvider({
  value,
  children,
}: {
  value?: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState<boolean>(value ?? false);
  return (
    <PrimaryNavigationContext.Provider value={{ visible, setVisible }}>
      {children}
    </PrimaryNavigationContext.Provider>
  );
}
