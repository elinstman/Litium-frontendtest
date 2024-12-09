import { setContext } from '@apollo/client/link/context';
import { cookies } from 'next/headers';

/**
 * Reads and returns the running host name, including protocol.
 * @param headers incoming HTTP request headers to get host name.
 * @returns host name including protocol.
 */
export function getHost(headerManager: Headers | (() => Headers)) {
  const headers =
    typeof headerManager === 'function' ? headerManager() : headerManager;

  const host =
    headers.get('x-forwarded-host')?.split(',')[0] ?? headers.get('host');
  if (!host) {
    throw 'Unable to get "host" from request headers. Request cancelled.';
  }

  const protocol = headers.get('x-forwarded-proto')?.split(',')[0] ?? 'https';
  return `${protocol}://${host}`;
}

export function getHeadersLink() {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        cookie: cookies()
          .getAll()
          .map((c: any) => `${c.name}=${c.value}`)
          .join('; '),
      },
    };
  });
}
