'use client';

import { TreeItem, TreeView, treeItemClasses } from '@mui/x-tree-view';
import clsx from 'clsx';
import { PageItem } from 'models/page';
import Link from 'next/link';
import CaretDown from './icons/caret-down';

/**
 *
 * @param data a list of TreeNode to render.
 * @param activeUrl current active Url to make it bold in the Tree.
 * @param defaultExpanded expanded node ids.
 * @returns
 */
function TreeComponent({
  data,
  activeUrl,
  defaultExpanded,
}: {
  data: PageItem[];
  activeUrl: string;
  defaultExpanded?: string[];
}) {
  const renderTree = (treeItems: PageItem[], initIndex?: number) => {
    return treeItems.map((item: any) => {
      let index = initIndex ?? 1;
      let children = undefined;
      if (item.children && item.children.nodes.length > 0) {
        index++;
        children = renderTree(item.children.nodes, index);
      }
      return (
        <TreeItem
          sx={{
            [`& .${treeItemClasses.content}`]: {
              padding: '6px 20px 6px 3px',
              borderRadius: '5px',
              [`& .${treeItemClasses.label}`]: {
                paddingLeft: 0,
                '& > div > a': {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              },
              '&:hover': {
                backgroundColor: '#0000000a',
              },
              [`& .${treeItemClasses.selected}`]: {
                backgroundColor: 'transparent',
              },
              [`& .${treeItemClasses.iconContainer}`]: {
                marginLeft: '8px',
              },
            },
            [`& .${treeItemClasses.group}`]: {
              marginLeft: 0,
              [`& .${treeItemClasses.content}`]: {
                paddingLeft: index === 3 ? '34px' : '17px',
              },
            },
          }}
          key={item.url}
          nodeId={item.url}
          data-testid="tree-item"
          label={
            <div onClick={(event) => event.stopPropagation()}>
              <Link
                className={clsx(
                  'block text-sm',
                  item.url === activeUrl ? 'font-bold' : 'font-normal'
                )}
                href={item.url || ''}
                data-testid="tree-item__link"
              >
                {item.name}
              </Link>
            </div>
          }
        >
          {children}
        </TreeItem>
      );
    });
  };
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={
        <CaretDown className="mr-2 h-2 w-3 flex-shrink-0 stroke-secondary-2 stroke-[50px]" />
      }
      defaultExpandIcon={
        <CaretDown className="mr-2 h-2 w-3 flex-shrink-0 -rotate-90 stroke-secondary-2 stroke-[50px]" />
      }
      defaultExpanded={defaultExpanded}
      sx={{
        flexGrow: 1,
      }}
      multiSelect={false}
    >
      {renderTree(data)}
    </TreeView>
  );
}

export default TreeComponent;
