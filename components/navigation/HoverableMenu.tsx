'use client';
import clsx from 'clsx';
import { PrimaryNavigationContext } from 'contexts/primaryNavigationContext';
import { LinkFieldDefinition } from 'models/navigation';
import Link from 'next/link';
import { useContext } from 'react';

/**
 * Represents a hoverable menu which is used in primary navigation for Desktop.
 * @param props
 * @returns
 */
export default function HoverableMenu(props: {
  navigationLink: LinkFieldDefinition;
  hasChildren: boolean;
  children: JSX.Element | JSX.Element[] | undefined;
}) {
  const { visible, setVisible } = useContext(PrimaryNavigationContext);
  const { text, url } = props.navigationLink;
  const open = () => setVisible(true);
  const close = () => setVisible(false);
  return (
    <li
      className={clsx(
        'group relative px-3',
        'hover:after:absolute hover:after:-bottom-0.5 hover:after:left-3 hover:after:right-3 hover:after:h-0.5 hover:after:bg-secondary hover:after:content-[""]'
      )}
      data-testid="primary-navigation-link"
      onMouseEnter={props.hasChildren ? open : close}
    >
      {url && (
        <Link
          href={url}
          onClick={close}
          data-testid="primary-navigation-link__link"
        >
          {text}
        </Link>
      )}
      {!url && text}
      {props.hasChildren && visible && (
        <div
          className={clsx(
            'fixed left-0 top-20 w-screen scale-y-0 bg-primary opacity-0',
            'origin-top transition delay-300 duration-200 group-hover:scale-y-100 group-hover:opacity-100'
          )}
        >
          <div
            className="container mx-auto flex"
            data-testid="primary-navigation-link__children"
          >
            {props.children}
          </div>
        </div>
      )}
    </li>
  );
}
