import { SearchParams } from 'models/searchParams';
import { ReadonlyURLSearchParams } from 'next/navigation';

/**
 * Builds a relative URL including searchParams.
 * @param path a pathname, usually returned by usePathname: https://nextjs.org/docs/app/api-reference/functions/use-pathname.
 * @param searchParams a search params, usually returned by useSearchParams: https://beta.nextjs.org/docs/api-reference/use-search-params.
 * @param filter a key-value filter object to toggle.
 * @param singleSelect flag to indicate if the filter is single or multiple select.
 * @returns a relative URL
 */
export function buildUrl(
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  filter: { [key: string]: any },
  singleSelect = false
): string {
  const searchParamsObj =
    SearchParams.fromReadonlyURLSearchParams(searchParams);
  searchParamsObj.toogle(filter, singleSelect);
  return `${pathname}${searchParamsObj.toString()}`;
}
