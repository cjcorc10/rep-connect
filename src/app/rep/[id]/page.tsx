import { fetchRep } from '@/app/lib/db';

type RepPageProps = {
  params: { id: string };
};
export default async function Page({ params }: RepPageProps) {
  const { id } = await params;
  const rep = await fetchRep(id);

  console.log('rep', rep);

  return <div>Page</div>;
}
