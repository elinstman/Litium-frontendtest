'use client';
import Backdrop from 'components/Backdrop';
import { PrimaryNavigationContext } from 'contexts/primaryNavigationContext';
import { Fragment, useContext } from 'react';

/**
 * Represents a client component for rendering a backdrop when hovering a navigation on desktop.
 * @returns
 */
export default function HoverableNavigationBackdrop() {
  const visible = useContext(PrimaryNavigationContext).visible;
  return (
    <Fragment>
      {/* Backdrop */}
      {visible && (
        <Backdrop
          className="top-20 z-10 scale-0 delay-300 peer-hover:scale-100"
          data-testid="hoverable-navigation__backdrop"
        ></Backdrop>
      )}
    </Fragment>
  );
}
