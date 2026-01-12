"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectedRep } from "./selectedRepContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import AnchorAsButton from "./anchorAsButton";
import { X } from "lucide-react";
import PartyBadge from "./partyBadge";
import RepInfo from "./repInfo";

type WikiData = {
  extract?: string;
  originalimage?: {
    source: string;
  };
};

export default function SelectedRepModal() {
  const { selectedRep, setSelectedRep } = useSelectedRep();
  const [wiki, setWiki] = useState<WikiData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRep?.wikipedia_id) {
      setWiki(null);
      return;
    }

    setLoading(true);
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${selectedRep.wikipedia_id.replace(
        " ",
        "_"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        setWiki(data);
      })
      .catch((err) => {
        console.error("Error fetching Wikipedia data:", err);
        setWiki(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedRep?.wikipedia_id]);

  if (!selectedRep) {
    return null;
  }
  const role =
    selectedRep.type === "sen"
      ? `Senator for ${selectedRep.state}`
      : `Representative for ${selectedRep.state}${
          selectedRep.district
            ? `, District ${selectedRep.district}`
            : ""
        }`;

  const currentYear = new Date().getFullYear();
  const nextMidTermYear =
    currentYear % 2 === 0 ? currentYear : currentYear + 1;
  const electionYear = new Date(selectedRep.end).getFullYear() - 1;
  const isNextMidTerm = electionYear === nextMidTermYear;
  const portraitSrc = selectedRep.image_url;
  const expiration = new Date(selectedRep.end);

  return (
    <motion.div
      key={`modal-${selectedRep.bioguide_id}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // exit={{ opacity: 0 }}
      onClick={() => setSelectedRep(null)}
    >
      {/* Modal Content - This uses the same layoutId as the card */}
      <motion.div
        layoutId={`rep-card-${selectedRep.bioguide_id}`}
        className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setSelectedRep(null)}
          className="absolute top-4 right-4 z-50 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={24} className="text-gray-600" />
        </button>

        <header className="relative">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 relative md:flex">
            <motion.div
              layoutId={`rep-image-${selectedRep.bioguide_id}`}
              className="w-28 h-28 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-lg bg-white "
            >
              <Image
                src={portraitSrc}
                alt={selectedRep.full_name}
                width={224}
                height={224}
                className="w-full h-full object-cover object-top"
              />
            </motion.div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
              <div className="text-center sm:text-left">
                <motion.h1
                  layoutId={`${selectedRep.bioguide_id}-name`}
                  className="font-bold text-2xl sm:text-3xl"
                >
                  <motion.div
                    layoutId={`${selectedRep.bioguide_id}-party-badge`}
                    className="inline-block w-12 h-12 mr-4"
                  >
                    <PartyBadge party={selectedRep.party} />
                  </motion.div>
                  {selectedRep.full_name}{" "}
                </motion.h1>
                <p className="text-base sm:text-lg mt-0.5">{role}</p>

                <nav
                  aria-label="Representative links"
                  className="mt-2"
                >
                  <ul className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2 text-sm sm:text-base">
                    {selectedRep.phone && (
                      <li>
                        <AnchorAsButton
                          href={`tel:${selectedRep.phone}`}
                        >
                          Call
                        </AnchorAsButton>
                      </li>
                    )}
                    {selectedRep.twitter && (
                      <li>
                        <AnchorAsButton
                          href={`https://twitter.com/${selectedRep.twitter}`}
                        >
                          Send tweet
                        </AnchorAsButton>
                      </li>
                    )}
                    {selectedRep.opensecrets_id && (
                      <li>
                        <AnchorAsButton
                          href={`https://www.opensecrets.org/members-of-congress/summary?cid=${selectedRep.opensecrets_id}`}
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
                  (isNextMidTerm ? " text-red-600" : " text-gray-800")
                }
              >
                {expiration.toLocaleDateString()}
              </h3>
            </aside>
          </div>
        </header>
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.3, duration: 0.3 },
            }}
            exit={{ opacity: 0 }}
          >
            <RepInfo
              rep={selectedRep}
              wiki={wiki}
              loading={loading}
              isNextMidTerm={isNextMidTerm}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
