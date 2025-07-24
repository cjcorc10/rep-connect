type PageProps = {
  params: { zipcode: string}
}

export default async function Page({params}: PageProps) {
  const { zipcode } = await params

  return <div>Reps Page for {zipcode}</div>;
}
