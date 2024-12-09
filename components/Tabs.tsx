'use client';
import clsx from 'clsx';
import { useTranslations } from 'hooks/useTranslations';
import React, { Fragment, ReactNode } from 'react';
import { Input } from './elements/Input';

interface TabProps {
  header: string;
  children: ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
  className?: string;
  sticky?: boolean;
  activeTab?: number;
  onTabChange?: (value: number) => void;
}

/**
 * Represents a Tab component. Title of a tab is defined using `header` attribute.
 * It should have at least 2 tab items.
 * ```
 * <Tabs>
      <Tab header="tab.header.one">
        <div>Content 1</div>
      </Tab>
      <Tab header="tab.header.two">
        <div>Content 2</div>
      </Tab>
    </Tabs>
 * ```
 * @param children a collection of Tab.
 * @param className optional custom css class name.
 * @param sticky a flag to indicate whether a tab is sticky at top.
 * @param activeTab index number of active tab.
 * @param onTabChange event occurs when the active tab is changed.
 * @returns
 */
const Tabs = ({
  children,
  className,
  sticky = true,
  activeTab = 0,
  onTabChange,
}: TabsProps) => {
  const t = useTranslations();
  const tabHeaders = children.map((child, index) => (
    <label
      key={index}
      className={clsx(
        'z-10 cursor-pointer text-sm text-tertiary',
        activeTab === index && 'border-b border-secondary pb-1 !text-primary'
      )}
      data-testid="tabs__header"
    >
      <Input
        type="radio"
        name="tabs"
        value={index}
        onClick={() => onTabChange && onTabChange(index)}
        defaultChecked={activeTab === index}
        className="hidden"
      />
      {t(child.props.header)}
    </label>
  ));

  return (
    <Fragment>
      <div
        className={clsx(
          'flex gap-8 bg-primary',
          'after:content=[""] after:absolute after:bottom-0 after:right-0 after:z-0 after:h-[1px] after:w-full after:bg-tertiary',
          'max-sm:-ml-5 max-sm:pl-5 max-sm:after:w-[calc(100%_-_1.25rem)] -mr-5 w-full overflow-x-auto pt-5 lg:-mr-3',
          sticky && 'sticky top-0 z-10',
          className
        )}
      >
        {tabHeaders}
      </div>
      <div data-testid="tabs__panel">{children[activeTab]}</div>
    </Fragment>
  );
};

const Tab = ({ children }: TabProps) => {
  return <Fragment>{children}</Fragment>;
};

export { Tab, Tabs };
