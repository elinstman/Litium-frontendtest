import NavigationHistoryContextProvider from 'contexts/NavigationHistoryContext';
import CartContextProvider from 'contexts/cartContext';
import WebsiteContextProvider from 'contexts/websiteContext';
import { get as getWebsite } from 'services/websiteService.server';

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const website = await getWebsite();
  return (
    <CartContextProvider>
      <WebsiteContextProvider value={website}>
        <NavigationHistoryContextProvider>
          {children}
        </NavigationHistoryContextProvider>
      </WebsiteContextProvider>
    </CartContextProvider>
  );
}
