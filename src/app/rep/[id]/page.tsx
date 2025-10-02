import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchRep } from '@/app/lib/db';
import AnchorAsButton from '@/app/components/anchorAsButton';

type RepPageProp = { params: Promise<{ id: string }> };

export default async function Page({ params }: RepPageProp) {
  const { id } = await params;
  const rep = await fetchRep(id);
  if (!rep) return notFound();

  // Fetch Wikipedia summary (gracefully handle failures)
  const wikiRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${rep.wikipedia_id.replace(
      ' ',
      '_'
    )}`,
    { next: { revalidate: 60 * 60 * 24 * 7 * 4 } }
  );
  const wiki = await wikiRes.json();
  const role =
    rep.type === 'senator'
      ? `Senator for ${rep.state}`
      : `Representative for ${rep.state}${
          rep.district ? `, District ${rep.district}` : ''
        }`;
  const portraitSrc = wiki?.originalimage?.source || rep.image_url;
  const expiration = new Date(rep.end);
  const currentYear = new Date().getFullYear();

  const nextMidTermYear =
    currentYear % 2 === 0 ? currentYear + 2 : currentYear + 1;
  const electionYear = expiration.getFullYear() - 1;
  const isNextMidTerm = electionYear === nextMidTermYear;

  return (
    <main className="relative">
      <header className="relative">
        <div className="relative w-full aspect-[16/9] sm:h-56 md:h-74">
          <Image
            src="/images/congress.jpg"
            alt="background image of legislative chamber with american flag"
            aria-hidden="true"
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
          />
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 ">
          <div className="relative -mt-12 sm:-mt-14 md:flex">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <figure className="shrink-0">
                <Image
                  src={portraitSrc}
                  alt={rep.full_name}
                  width={256}
                  height={256}
                  className="w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-3xl object-cover object-top border border-white/40 shadow-lg bg-white"
                  sizes="(max-width: 640px) 7rem, (max-width: 768px) 10rem, 14rem"
                />
                <figcaption className="sr-only">
                  Portrait of {rep.full_name}
                </figcaption>
              </figure>
              <div className="text-center sm:text-left">
                <h1 className="font-bold text-2xl sm:text-3xl">
                  {rep.full_name} ({rep.party[0]})
                </h1>
                <p className="text-base sm:text-lg mt-0.5">{role}</p>

                <nav
                  aria-label="Representative links"
                  className="mt-2"
                >
                  <ul className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm sm:text-base">
                    {rep.url && (
                      <li>
                        <AnchorAsButton href={`tel:${rep.phone}`}>
                          Call
                        </AnchorAsButton>
                      </li>
                    )}
                    {rep.twitter && (
                      <li>
                        <AnchorAsButton
                          href={`https://twitter.com/${rep.twitter}`}
                        >
                          Send tweet
                        </AnchorAsButton>
                      </li>
                    )}
                    {rep.opensecrets_id && (
                      <li>
                        <AnchorAsButton
                          href={`https://www.opensecrets.org/members-of-congress/summary?cid=${rep.opensecrets_id}`}
                        >
                          Follow the money
                        </AnchorAsButton>
                      </li>
                    )}
                  </ul>
                </nav>
              </div>
            </div>
            <aside className="flex-1 flex flex-col items-center justify-center text-center sm:text-left mt-6 sm:mt-0">
              <h2 className="text-2xl font-bold">Term expires:</h2>
              <h3
                className={
                  `text-xl` +
                  (isNextMidTerm ? ' text-red-600' : ' text-gray-800')
                }
              >
                {expiration.toLocaleDateString()}
              </h3>
            </aside>
          </div>
        </div>
      </header>

      <article className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        <section
          aria-labelledby="bio-heading"
          className="prose prose-sm sm:prose-base max-w-none"
        >
          <h2
            id="bio-heading"
            className="!mb-2 text-xl sm:text-2xl font-semibold"
          >
            Overview
          </h2>
          <p>
            {wiki?.extract || 'No additional information available.'}
          </p>
        </section>

        <section aria-labelledby="details-heading">
          <h2
            id="details-heading"
            className="text-xl sm:text-2xl font-semibold mb-3"
          >
            Details
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm sm:text-base">
            {rep.party && (
              <>
                <dt className="font-medium text-gray-600">Party</dt>
                <dd>{rep.party}</dd>
              </>
            )}
          </dl>
        </section>

        <aside
          aria-labelledby="contact-heading"
          className="border-t pt-5"
        >
          <h2
            id="contact-heading"
            className="text-xl sm:text-2xl font-semibold mb-2"
          >
            Contact
          </h2>
          <address className="not-italic space-y-1 text-sm sm:text-base">
            {rep.address && (
              <p className="whitespace-pre-line">{rep.address}</p>
            )}
            {rep.phone && (
              <p>
                <a
                  className="text-blue-600 hover:underline"
                  href={`tel:${rep.phone.replace(/\D/g, '')}`}
                >
                  {rep.phone}
                </a>
              </p>
            )}
          </address>

          {isNextMidTerm && rep.phone && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center sm:text-left">
              <p className="text-red-600 font-bold text-base mb-2">
                This candidate is up for re-election in the next
                mid-term.
              </p>
              <p className="text-sm text-gray-800 mb-3">
                Candidates up for re-election are more likely to be
                responsive to constituents.
              </p>
              <a
                href={`tel:${rep.phone.replace(/\D/g, '')}`}
                className="inline-block bg-red-600 text-white font-semibold px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Call Now
              </a>
            </div>
          )}
        </aside>

        <section
          aria-labelledby="transparency-heading"
          className="border-t pt-5"
        >
          <h2
            id="transparency-heading"
            className="text-xl sm:text-2xl font-semibold mb-2"
          >
            Transparency & Data
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
            {rep.opensecrets_id && (
              <li>
                <a
                  href={`https://www.opensecrets.org/members-of-congress/summary?cid=${rep.opensecrets_id}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Campaign finance overview (OpenSecrets)
                </a>
              </li>
            )}
            {rep.govtrack_id && (
              <li>
                <a
                  href={`https://www.govtrack.us/congress/members/${rep.govtrack_id}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Legislative profile (GovTrack)
                </a>
              </li>
            )}
            {rep.ballotpedia_id && (
              <li>
                <a
                  href={`https://ballotpedia.org/${rep.ballotpedia_id}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View committee assignments and more (Ballotpedia)
                </a>
              </li>
            )}
            {rep.wikipedia_id && (
              <li>
                <a
                  href={`https://en.wikipedia.org/wiki/${rep.wikipedia_id.replace(
                    ' ',
                    '_'
                  )}`}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia page
                </a>
              </li>
            )}
          </ul>
        </section>
      </article>
    </main>
  );
}
