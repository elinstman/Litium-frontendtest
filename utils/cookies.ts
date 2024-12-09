'use server';
import { cookies } from 'next/headers';
import setCookieParser from 'set-cookie-parser';

export async function setCookieFromResponse(res: any) {
  const parsedCookies = setCookieParser.parse(
    res.__setCookie?.split(',').map((s: string) => s.trim())
  );
  parsedCookies?.forEach((cookie: any) => {
    cookies().set(cookie.name, cookie.value, cookie);
  });
}
