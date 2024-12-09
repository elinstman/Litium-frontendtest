'use client';
import { gql } from '@apollo/client';
import Close from 'components/icons/close';
import Magnifier from 'components/icons/magnifier';
import SearchInput from 'components/search/SearchInput';
import SearchResult from 'components/search/SearchResult';
import Sidebar from 'components/Sidebar';
import { CategorySearchQueryInput } from 'models/categorySearchQueryInput';
import { PageSearchQueryInput } from 'models/pageSearchQueryInput';
import { ProductSearchQueryInput } from 'models/productSearchQueryInput';
import { SearchContentType } from 'models/search';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { queryClient } from 'services/dataService.client';
import { useDebounce } from 'use-debounce';

/**
 * Render a search component
 * @returns
 */
function QuickSearch({ searchResultPageUrl }: { searchResultPageUrl: string }) {
  const router = useRouter();
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

  const [text, setText] = useState('');
  const [result, setResult] = useState<SearchContentType | undefined>(
    undefined
  );
  const [debouncedSearchText] = useDebounce(text, 200);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleCloseForm = useCallback(() => {
    searchInputRef.current?.blur();
    setSearchBoxVisibility(false);
  }, []);
  const handleShowForm = useCallback(() => {
    searchInputRef.current?.focus();
    setSearchBoxVisibility(true);
  }, []);

  useEffect(() => {
    const search = async (text: string) => {
      const productParams = new ProductSearchQueryInput({ text });
      const pageParams = new PageSearchQueryInput(text);
      const categoryParams = new CategorySearchQueryInput(text);
      const data = await queryClient({
        query: SEARCH,
        variables: {
          productQuery: { ...productParams },
          pageQuery: { ...pageParams },
          categoryQuery: { ...categoryParams },
          first: 10,
          after: '0',
        },
        context: {
          fetchOptions: {
            signal: aborterCtrl.signal,
          },
        },
      });
      setResult(data);
    };

    const aborterCtrl = new AbortController();
    !debouncedSearchText && setResult(undefined);
    debouncedSearchText.length >= 2 && search(debouncedSearchText);
    return () => {
      aborterCtrl.abort();
    };
  }, [debouncedSearchText]);

  const handleSeeMore = useCallback(
    (activeTab = 0) => {
      router.push(`${searchResultPageUrl}?q=${text}&tab_index=${activeTab}`);
      handleCloseForm();
    },
    [router, searchResultPageUrl, text, handleCloseForm]
  );

  return (
    <Fragment>
      <Magnifier
        alt="search"
        className="inline-block h-5 w-5 cursor-pointer lg:block"
        onClick={handleShowForm}
        data-testid="header__magnifier"
      />
      <Sidebar
        visible={searchBoxVisibility}
        fullscreen={true}
        position="top"
        className="!p-0 duration-200"
        data-testid="quicksearch"
        blockScroll={true}
      >
        <div className="h-full overflow-auto overflow-x-hidden">
          <div className="container m-auto p-5">
            <div className="mb-8 flex justify-end">
              <Close
                alt="close"
                onClick={handleCloseForm}
                data-testid="quicksearch__close"
              />
            </div>
            <SearchInput
              value={text}
              onChange={(value: string) => setText(value)}
              onEnterKeyDown={handleSeeMore}
              ref={searchInputRef}
            />
            <SearchResult
              result={result}
              onClose={handleCloseForm}
              showFilter={false}
              showLoadMore={false}
              showLinkToSearchResult={true}
              onLinkToSearchResultClick={(activeTab) =>
                handleSeeMore(activeTab)
              }
            />
          </div>
        </div>
      </Sidebar>
    </Fragment>
  );
}

const SEARCH = gql`
  query Search(
    $productQuery: ProductSearchQueryInput!
    $categoryQuery: CategorySearchQueryInput!
    $pageQuery: PageSearchQueryInput!
    $first: Int
    $after: String
  ) {
    productSearch(query: $productQuery, first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
      }
      nodes {
        ...ProductCard
      }
    }

    pageSearch(query: $pageQuery, first: $first, after: $after) {
      ...PageSearchResult
    }

    categorySearch(query: $categoryQuery, first: $first, after: $after) {
      ...CategorySearchResult
    }
  }
`;

export default QuickSearch;
