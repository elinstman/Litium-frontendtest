import { render } from '@react-email/render';
import EmailAccountChanged from 'components/emails/EmailAccountChanged';
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

  const subject = translate('logindetails.subjectAccountChanged', texts);
  const mailOptions: Mail.Options = {
    to: data.previousEmail || data.email,
    subject,
    html: render(EmailAccountChanged(texts)),
  };

  try {
    console.debug('Sending account changed email...');
    await sendMail(mailOptions, params);
    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
