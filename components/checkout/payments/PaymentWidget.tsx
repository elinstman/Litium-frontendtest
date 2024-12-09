import { OrderRow } from 'models/order';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { extractScripts } from 'services/dataService.client';

/**
 * Renders a payment widget based on the input `responseString` which is returned by a payment provider.
 * @param responseString an HTML snippet.
 * @param rows a list of OrderRow. The component does not use this param, but we need it in order for the
 * component to re-render when Cart content is changed.
 */
const PaymentWidget = memo(function PaymentWidget({
  responseString,
  rows,
}: {
  responseString: string;
  rows?: OrderRow[];
}) {
  rows = rows ?? []; // to avoid lint error
  const WidgetCheckout: any = dynamic(() =>
    import('./CheckoutWidget').then((mod) => mod.default)
  );
  const { scripts, scriptFiles, html } = extractScripts(responseString);
  const id = 'payment-widget';
  return (
    <WidgetCheckout
      scripts={scripts}
      scriptFiles={scriptFiles}
      html={html}
      id={id}
    />
  );
});

export default PaymentWidget;
