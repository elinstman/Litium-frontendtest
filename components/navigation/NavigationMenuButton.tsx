'use client';
import { PrimaryNavigationContext } from 'contexts/primaryNavigationContext';
import { useContext } from 'react';
import HamburgerMenu from '../icons/menu';

/**
 * Represents a client component for rendering a button to open primary navigation.
 * The component is used in mobile.
 * @returns
 */
export default function NavigationMenuButton() {
  const setVisible = useContext(PrimaryNavigationContext).setVisible;
  const open = () => setVisible(true);
  return (
    <HamburgerMenu
      alt="Primary Navigation"
      onClick={open}
      data-testid="slide-navigation__hamburger-menu"
    />
  );
}
