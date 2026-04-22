import clsx from "clsx";
import addressStyles from "@/app/components/address/address.module.css";
import cityStateStyles from "@/app/components/cityStateLabel/cityStateLabel.module.css";
import pageStyles from "./repsPageClient.module.scss";
import skeletonStyles from "./repsPageSkeleton.module.scss";

/**
 * Header-only shell (Address + CityStateLabel) for loading states.
 * Used by `loading.tsx` while the route segment resolves.
 */
export default function RepsPageSkeleton() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading representatives"
      className={clsx(
        "py-4 sm:py-6 h-screen relative flex flex-col items-center justify-center",
        pageStyles.main,
      )}
    >
      <section
        className={clsx(
          pageStyles.headerSection,
          skeletonStyles.headerSectionAlignStart,
        )}
      >
        <header className={pageStyles.header}>
          <div className={addressStyles.addressContainer} aria-hidden>
            <h1
              className={clsx(
                addressStyles.label,
                skeletonStyles.placeholderText,
              )}
            >
              &nbsp;
            </h1>
            <form className={addressStyles.form}>
              <div className={addressStyles.inputWrapper}>
                <input
                  type="text"
                  readOnly
                  tabIndex={-1}
                  aria-hidden
                  autoComplete="off"
                  defaultValue=""
                  className={clsx(
                    addressStyles.addressTitle,
                    skeletonStyles.placeholderText,
                  )}
                />
              </div>
            </form>
          </div>
          <div className={cityStateStyles.container} aria-hidden>
            <h1
              className={clsx(
                cityStateStyles.title,
                skeletonStyles.placeholderText,
              )}
            >
              &nbsp;
            </h1>
          </div>
        </header>
      </section>
    </main>
  );
}
