'use client';

import clsx from 'clsx';
import { useBodyScroll } from 'hooks/useBodyScroll';
import { Fragment, useEffect, useRef } from 'react';
import useOnClickOutside from 'use-onclickoutside';
import Backdrop from './Backdrop';

/**
 * Renders a sidebar
 * @param visible flag to show sidebar
 * @param children content sidebar
 * @param onClose a function to hide sidebar
 * @param position a position to display the sidebar, default to the right
 * @param fullscreen flag to show sidebar in fullscreen, default is false
 * @param blockScroll flag to block scrolling on document body, default is false
 */
function Sidebar({
  visible,
  children,
  onClose = () => {},
  position = 'right',
  className = '',
  fullscreen = false,
  blockScroll = false,
  ...props
}: {
  visible: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  position?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  fullscreen?: boolean;
  blockScroll?: boolean;
}) {
  const sidebarRef = useRef(null);
  const [blockBodyScroll, allowBodyScroll] = useBodyScroll();
  useOnClickOutside(sidebarRef, onClose);

  useEffect(() => {
    if (visible && blockScroll) blockBodyScroll();
    else allowBodyScroll();
  }, [visible, blockScroll, blockBodyScroll, allowBodyScroll]);

  const getPosition = () => {
    switch (position) {
      case 'left':
      case 'right':
        return clsx(
          'top-0',
          visible && `${position}-0 opacity-100 scale-x-100`,
          !visible && `-${position}-full opacity-0 scale-x-0`
        );
      case 'bottom':
        return clsx(
          'inset-y-full transform opacity-0',
          visible && '!-inset-y-0 opacity-100'
        );
      default:
        return clsx(
          'right-0',
          visible && `${position}-0 opacity-100 scale-y-100`,
          !visible && `-${position}-full opacity-0 scale-y-0`
        );
    }
  };

  return (
    <Fragment>
      {visible && <Backdrop className="z-30" data-testid="sidebar__backdrop" />}
      <div
        className={clsx(
          'fixed z-30 bg-primary p-5 transition-all',
          getPosition(),
          className,
          fullscreen && 'h-[100vh] w-full touchable:h-[100dvh]'
        )}
        ref={sidebarRef}
        {...props}
      >
        {children}
      </div>
    </Fragment>
  );
}

export default Sidebar;
