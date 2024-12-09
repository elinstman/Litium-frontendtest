'use client';
import Sidebar from 'components/Sidebar';
import { PrimaryNavigationContext } from 'contexts/primaryNavigationContext';
import { useContext } from 'react';

/**
 * Represents a client component for rendering a slide navigation side menu, which is used in mobile.
 * @param props
 * @returns
 */
export default function SidebarMenu(props: {
  children: JSX.Element | JSX.Element[] | undefined;
  className?: string;
}) {
  const { children, className } = props;
  const visible = useContext(PrimaryNavigationContext).visible;
  return (
    <Sidebar
      visible={visible}
      position="top"
      fullscreen={true}
      className={className}
      data-testid="slide-navigation"
    >
      {children}
    </Sidebar>
  );
}
