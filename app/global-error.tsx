'use client';

import ErrorPage from './error';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <html>
      <body>
        <ErrorPage error={error} />
      </body>
    </html>
  );
}
