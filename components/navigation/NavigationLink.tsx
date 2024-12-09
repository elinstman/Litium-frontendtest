'use client';
import { PrimaryNavigationContext } from 'contexts/primaryNavigationContext';
import { LinkFieldDefinition } from 'models/navigation';
import Link from 'next/link';
import { Fragment, useContext } from 'react';

function NavigationLink(props: {
  link?: LinkFieldDefinition;
  children: React.ReactNode;
}) {
  const setNavigationVisible = useContext(PrimaryNavigationContext).setVisible;
  const onLinkClick = () => {
    setNavigationVisible(false);
  };
  return props.link?.url ? (
    <Link
      href={props.link.url}
      className="text-center"
      data-testid="primary-navigation-banner"
      onClick={onLinkClick}
    >
      {props.children}
    </Link>
  ) : (
    <Fragment>{props.children}</Fragment>
  );
}

export default NavigationLink;
