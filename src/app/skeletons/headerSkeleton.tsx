import clsx from "clsx";
import addressStyles from "@/app/components/address/address.module.css";
import cityStateStyles from "@/app/components/cityStateLabel/cityStateLabel.module.css";
import pageStyles from "@/app/reps/[zip]/repsPageClient.module.scss";
import "./repsPageSkeleton.css";

/**
 * Header-only shell (Address + CityStateLabel) for loading states.
 * Used by `loading.tsx` while the route segment resolves.
 */
export default function HeaderSkeleton() {
  return (
    <section className={pageStyles.headerSection}>
      <header className={pageStyles.header}>
        <div className={addressStyles.addressContainer} aria-hidden>
          <h1 className={addressStyles.label}>&nbsp;</h1>
          <form className={addressStyles.form}>
            <div className={addressStyles.inputWrapper}>
              <input
                type="text"
                readOnly
                tabIndex={-1}
                aria-hidden
                autoComplete="off"
                defaultValue=""
                className={addressStyles.addressTitle}
              />
            </div>
          </form>
        </div>
        <div className={clsx(cityStateStyles.container)} aria-hidden>
          <h1 className={clsx(cityStateStyles.title)}>&nbsp;</h1>
        </div>
      </header>
    </section>
  );
}
