import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev';
import { Inter } from 'next/font/google';
import 'styles/globals.scss';

if (process.env.NODE_ENV !== 'production') {
  loadDevMessages();
  loadErrorMessages();
}
const inter = Inter({
  subsets: ['latin'],
});

/**
 * A mandatory root layout, defined at the top level of the `app` directory and applies to all routes.
 * @param children Children components. More info: https://nextjs.org/docs/app/api-reference/file-conventions/layout#children-required
 * @param params The dynamic route parameters object from the root segment down to that layout.
 * @returns
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}

export const metadata = {
  title: {
    default: 'Litium Accelerator',
    template: '%s | Litium Accelerator',
  },
};
