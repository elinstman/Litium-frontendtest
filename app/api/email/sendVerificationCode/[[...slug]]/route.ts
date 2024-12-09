import { render } from '@react-email/render';
import EmailVerificationCode from 'components/emails/EmailVerificationCode';
import { translate } from 'hooks/useTranslations';
import { NextRequest, NextResponse } from 'next/server';
import Mail from 'nodemailer/lib/mailer';
import { sendMail } from 'services/mailService.server';
import { get as getWebsite } from 'services/websiteService.server';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const { data } = await request.json();
  const { texts } = await getWebsite(params.slug?.join('/') ?? '/');

  const subject = translate(
    'logindetails.emaildetails.verificationcode.emailsubject',
    texts
  );
  const mailOptions: Mail.Options = {
    to: data.email,
    subject,
    html: render(EmailVerificationCode(data.verificationToken, texts)),
  };

  try {
    console.debug('Sending verification code email...');
    await sendMail(mailOptions, params);
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
