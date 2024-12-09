import { Body, Head, Html, Tailwind, Text } from '@react-email/components';

export default function EmailVerificationCode(
  verificationCode: string,
  websiteTexts?: { key: string; value: string }[]
) {
  const translate = (key: string) =>
    websiteTexts?.filter((item) => item.key === key)[0]?.value || key;
  return (
    <Html lang="en">
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Text className="mt-2">
            {translate(
              'logindetails.emaildetails.verificationcode.emailcontent'
            ).replace('{code}', verificationCode)}
          </Text>
          <Text className="mt-2">
            Note:{' '}
            {translate('logindetails.emaildetails.verificationcode.emailnote')}
          </Text>
        </Body>
      </Tailwind>
    </Html>
  );
}
