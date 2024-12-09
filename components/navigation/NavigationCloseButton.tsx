'use client';
import { PrimaryNavigationContext } from 'contexts/primaryNavigationContext';
import { useContext } from 'react';
import Close from '../icons/close';

/**
 * Represents a client component for rendering navigation close button, which is used in mobile.
 * @returns
 */
export default function NavigationCloseButton() {
  const setVisible = useContext(PrimaryNavigationContext).setVisible;
  const close = () => setVisible(false);
  return (
    <Close
      alt="close"
      onClick={close}
      data-testid="slide-navigation__close-btn"
    />
  );
}
