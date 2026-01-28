"use client";
import { Rep } from "../lib/definitions";

type WikiData = {
  extract?: string;
  originalimage?: {
    source: string;
  };
};

type RepInfoProps = {
  rep: Rep;
  wiki: WikiData | null;
  loading: boolean;
  isNextMidTerm: boolean;
};

export default function RepInfo({
  rep,
  wiki,
  loading,
  isNextMidTerm,
}: RepInfoProps) {
  return (
    <article className="mx-auto max-w-5xl px-8 space-y-8">
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
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <p className="text-t1 md:px-24">
            {wiki?.extract || "No additional information available."}
          </p>
        )}
      </section>

      <section aria-labelledby="details-heading">
        <h2
          id="details-heading"
          className="text-xl sm:text-2xl font-semibold mb-3"
        >
          Details
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm sm:text-base md:px-24">
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
        <address className="not-italic space-y-1 text-sm sm:text-base md:px-24">
          {rep.address && (
            <p className="whitespace-pre-line">{rep.address}</p>
          )}
          {rep.phone && (
            <p>
              <a
                className="text-blue-600 hover:underline"
                href={`tel:${rep.phone.replace(/\D/g, "")}`}
              >
                {rep.phone}
              </a>
            </p>
          )}
        </address>

        {isNextMidTerm && rep.phone && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-center sm:text-left md:mx-24">
            <p className="text-red-600 font-bold text-base mb-2">
              This candidate is up for re-election in the next
              mid-term.
            </p>
            <p className="text-sm text-gray-800 mb-3">
              Candidates up for re-election are more likely to be
              responsive to constituents.
            </p>
            <a
              href={`tel:${rep.phone.replace(/\D/g, "")}`}
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
        <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base md:mx-24">
          {rep.opensecrets_id && (
            <li>
              <a
                href={`https://www.opensecrets.org/members-of-congress/summary?cid=${rep.opensecrets_id}`}
                className="text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Who is funding this candidate? (OpenSecrets)
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
                What is this candidate's legislative history? (GovTrack)
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
                What is this candidate's committee assignments? (Ballotpedia)
              </a>
            </li>
          )}
          {rep.wikipedia_id && (
            <li>
              <a
                href={`https://en.wikipedia.org/wiki/${rep.wikipedia_id.replace(
                  " ",
                  "_"
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
  );
}
