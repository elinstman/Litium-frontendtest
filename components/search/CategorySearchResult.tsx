'use client';
import { gql } from '@apollo/client';
import { Button } from 'components/elements/Button';
import { useTranslations } from 'hooks/useTranslations';
import { CategoryItemsConnection } from 'models/category';
import { CategorySearchQueryInput } from 'models/categorySearchQueryInput';
import { SearchParams } from 'models/searchParams';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { queryClient } from 'services/dataService.client';
import { PaginationOptions } from 'utils/constants';
import SearchItem from './SearchItem';

interface CategorySearchResultProps {
  items: CategoryItemsConnection;
  onItemClick?: () => void;
}

/**
 * Represents the Category search result component
 * @param items category search result to render
 * @param onItemClick an action on click an item.
 * @returns
 */
function CategorySearchResult(props: CategorySearchResultProps) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState([...props.items.nodes]);
  const [hasNextPage, setHasNextPage] = useState(
    props.items.pageInfo.hasNextPage
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setItems([...props.items.nodes]);
    setHasNextPage(props.items.pageInfo.hasNextPage);
  }, [props, searchParams]);

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true);
    const param = SearchParams.fromReadonlyURLSearchParams(searchParams);
    const categoryParam = new CategorySearchQueryInput(param['q']);
    const itemIncomming = (
      await queryClient({
        query: LOAD_MORE,
        variables: {
          query: { ...categoryParam },
          first: PaginationOptions.PageSize,
          after: String(items.length),
        },
      })
    ).categorySearch;
    setItems([...items, ...itemIncomming.nodes]);
    setHasNextPage(itemIncomming.pageInfo.hasNextPage);
    setIsLoading(false);
  }, [searchParams, items]);
  const t = useTranslations();

  return (
    <div>
      {items.map((node) => {
        return (
          <SearchItem
            key={node.url}
            url={node.url}
            name={node.name}
            description={node?.description || node?.fields?._seoDescription}
            linkLabel={t('categorysearchresult.linklabel')}
            onClick={props.onItemClick}
          />
        );
      })}
      {hasNextPage && (
        <div className="mx-5 mt-5 text-center">
          <Button
            className="p-2 text-xl sm:w-80"
            fluid={true}
            rounded={true}
            disabled={isLoading}
            onClick={() => {
              handleLoadMore();
            }}
            data-testid="searchitems__loadMore"
          >
            {isLoading
              ? t('categorysearchresult.button.loading')
              : t('categorysearchresult.button.loadmore')}
          </Button>
        </div>
      )}
    </div>
  );
}

const LOAD_MORE = gql`
  query SearchCategory(
    $query: CategorySearchQueryInput!
    $first: Int
    $after: String
  ) {
    categorySearch(query: $query, first: $first, after: $after) {
      ...CategorySearchResult
    }
  }
`;

export default CategorySearchResult;