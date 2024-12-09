import { Body, Head, Html, Tailwind, Text } from '@react-email/components';
import { translate } from 'hooks/useTranslations';
import { WebsiteText } from 'models/website';

function EmailAccountChanged(texts: WebsiteText[]) {
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Text>{translate('logindetails.contentAccountChanged', texts)}</Text>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default EmailAccountChanged;
