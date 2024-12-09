import Link from 'next/link';
import User from './icons/user';

function Profile({ myPagesPageUrl }: { myPagesPageUrl: string }) {
  return (
    <Link href={myPagesPageUrl} className="hidden lg:flex">
      <User />
    </Link>
  );
}

export default Profile;
