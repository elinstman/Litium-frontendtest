'use client';
import Sidebar from 'components/Sidebar';
import { Text } from 'components/elements/Text';
import CaretDown from 'components/icons/caret-down';
import Close from 'components/icons/close';
import { PrimaryNavigationContext } from 'contexts/primaryNavigationContext';
import { LinkFieldDefinition } from 'models/navigation';
import Link from 'next/link';
import { useContext, useState } from 'react';

/**
 * Represents a mobile primary navigation.
 * @param props
 * @returns
 */
export default function SlideMenu(props: {
  navigationLink: LinkFieldDefinition;
  hasChildren: boolean;
  children: JSX.Element | JSX.Element[] | undefined;
}) {
  const { text, url } = props.navigationLink;
  const [subMenuVisible, setSubMenuVisible] = useState(false);
  const { visible, setVisible } = useContext(PrimaryNavigationContext);
  const close = () => setVisible(false);
  const openSubMenu = () => setSubMenuVisible(true);
  const closeSubMenu = () => setSubMenuVisible(false);

  return (
    <li className="my-5" data-testid="primary-navigation-link">
      {!props.hasChildren && url && (
        <Link href={url} className="text-2xl font-semibold" onClick={close}>
          {text}
        </Link>
      )}
      {props.hasChildren && (
        <div className="flex justify-between" onClick={openSubMenu}>
          <Text className="text-2xl font-semibold">{text}</Text>
          <CaretDown
            alt={text}
            className="inline-block h-6 w-6 -rotate-90"
            data-testid="primary-navigation-link__caret-next"
          ></CaretDown>
        </div>
      )}
      {props.hasChildren && (
        <Sidebar
          visible={subMenuVisible && visible}
          onClose={closeSubMenu}
          data-testid="primary-navigation-link__sub-menu"
          position="top"
          fullscreen={true}
        >
          <div className="flex items-center justify-between">
            <CaretDown
              alt="Back"
              className="inline-block h-6 w-6 rotate-90"
              onClick={closeSubMenu}
              data-testid="primary-navigation-link__caret-back"
            ></CaretDown>
            {url && (
              <Link
                href={url}
                className="text-2xl font-semibold underline"
                onClick={() => {
                  closeSubMenu();
                  close();
                }}
                data-testid="primary-navigation-link__sub-menu--url"
              >
                {text}
              </Link>
            )}
            {!url && <Text className="text-2xl font-semibold">{text}</Text>}
            <Close
              alt="close"
              onClick={() => {
                closeSubMenu();
                close();
              }}
            />
          </div>
          <div
            data-testid="primary-navigation-link__children"
            className="h-full overflow-y-auto"
          >
            {props.children}
          </div>
        </Sidebar>
      )}
    </li>
  );
}
