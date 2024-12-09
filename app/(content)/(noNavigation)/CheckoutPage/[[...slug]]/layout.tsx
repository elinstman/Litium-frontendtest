import { Metadata } from 'next';
import { createMetadataFromUrl } from 'services/metadataService.server';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return children;
}

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  return await createMetadataFromUrl(params.slug?.join('/'));
}
