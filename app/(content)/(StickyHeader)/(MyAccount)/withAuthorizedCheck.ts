import { AuthenticationFailureType } from 'models/authenticationFailureType';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { get as getWebsite } from 'services/websiteService.server';
import { HeaderKeys, Token } from 'utils/constants';

/**
 * Represents a Higher Order Function which takes and executes the input
 * function with authentication and authorization checks.
 * @param fn the function to execute
 * @returns the output of fn function, or redirect to login page if authentication
 * or authorization failed.
 */
export default async function withAuthorizedCheck(
  fn: () => Promise<any>
): Promise<any> {
  const token = cookies().get(Token.Name)?.value;
  const { loginPageUrl, myPagesPageUrl } = await getWebsite();
  const redirectUrl = `${loginPageUrl}?redirectUrl=${encodeURIComponent(headers().get(HeaderKeys.OriginalUrl) || myPagesPageUrl)}`;

  if (!token) {
    redirect(redirectUrl);
  }

  try {
    return await fn();
  } catch (error: any) {
    if (
      error[0].extensions?.code ===
      AuthenticationFailureType.AUTH_NOT_AUTHORIZED
    ) {
      redirect(redirectUrl);
    } else {
      throw error;
    }
  }
}
