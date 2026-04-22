"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { RepRosterRow } from "@/app/lib/repRoster";
import { useWikimediaPortraitFallback } from "@/app/lib/useWikimediaPortraitFallback";
import styles from "./repsWrapper.module.scss";

const prefetchedPortraitUrls = new Set<string>();

/** Matches repsWrapper mobile breakpoint (`max-width: 48rem`); hover portraits are desktop-only. */
const HOVER_PORTRAIT_MEDIA_QUERY = "(min-width: 48.0625rem)";

function useHoverPortraitEnabled() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia(HOVER_PORTRAIT_MEDIA_QUERY);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia(HOVER_PORTRAIT_MEDIA_QUERY).matches,
    () => false,
  );
}

function portraitUrlForHover(row: RepRosterRow): string {
  if (row.portraitProxyOcdId) {
    return `/api/state-legislator-portrait?ocd=${encodeURIComponent(row.portraitProxyOcdId)}`;
  }
  return row.portraitSrc ?? row.imageUrl ?? "";
}

function usePrefetchPortraitImages(
  rows: RepRosterRow[],
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    for (const row of rows) {
      const url = portraitUrlForHover(row).trim();
      if (!url || prefetchedPortraitUrls.has(url)) continue;
      prefetchedPortraitUrls.add(url);
      const img = new window.Image();
      img.decoding = "async";
      img.src = url;
    }
  }, [rows, enabled]);
}

function HoverPortrait({ imageUrl }: { imageUrl: string }) {
  const { unoptimized, onError, remountKey } =
    useWikimediaPortraitFallback(imageUrl);
  return (
    <div className={styles.repRowImageInner}>
      {imageUrl.trim() ? (
        <Image
          key={remountKey}
          src={imageUrl}
          alt=""
          fill
          sizes="352px"
          quality={88}
          unoptimized={unoptimized}
          onError={onError}
          className={styles.repRowImageImg}
        />
      ) : (
        <div className={styles.repRowImagePlaceholder} aria-hidden />
      )}
    </div>
  );
}

/** State rows use OCD proxy; federal rows use the rep-image API — details need an external URL for state. */
function isDetailsDisabled(
  row: RepRosterRow,
  onRowDetails?: (row: RepRosterRow) => void,
): boolean {
  if (!onRowDetails) return true;
  if (row.portraitProxyOcdId && !row.externalUrl?.trim()) return true;
  return false;
}

function RosterColumnHeaders() {
  const meta = clsx(
    styles.headerKey,
    styles.headerKeyMeta,
    styles.repRosterDesktopOnly,
  );
  return (
    <div
      className={styles.repNameNavHeader}
      role="row"
      aria-label="Columns"
    >
      <span className={styles.headerKey}>Name</span>
      <span className={styles.headerKey}>Image</span>
      <span className={meta}>Chamber</span>
      <span className={meta}>District</span>
      <span
        className={clsx(
          meta,
          styles.headerKeyTrailDesktop,
        )}
      >
        Term
      </span>
    </div>
  );
}

function RosterRow({
  row,
  index,
  rowCount,
  onRowDetails,
  isHovered,
  onHoverChange,
  showHoverPortrait,
}: {
  row: RepRosterRow;
  index: number;
  rowCount: number;
  onRowDetails?: (row: RepRosterRow) => void;
  isHovered: boolean;
  onHoverChange: (hovering: boolean) => void;
  showHoverPortrait: boolean;
}) {
  const tel = row.phone?.trim().replace(/\s/g, "") ?? "";
  const detailsDisabled = isDetailsDisabled(row, onRowDetails);
  const openDetails = () => {
    if (!detailsDisabled) onRowDetails?.(row);
  };

  const hoverUrl = portraitUrlForHover(row);
  const floatAtBottom = index >= Math.ceil(rowCount / 2);

  const cell = styles.repNameNavCell;
  const desktop = clsx(cell, styles.repRosterDesktopOnly);

  return (
    <div
      className={clsx(
        styles.repNameNav,
        isHovered &&
          showHoverPortrait &&
          styles.repNameNavHoverLift,
      )}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocusCapture={() => onHoverChange(true)}
      onBlurCapture={(e) => {
        const next = e.relatedTarget;
        if (next && e.currentTarget.contains(next as Node)) return;
        onHoverChange(false);
      }}
      onClick={(e) => {
        const el = e.target as HTMLElement | null;
        if (
          el?.closest(
            "a,button,input,textarea,select,[role='button']",
          )
        ) {
          return;
        }
        openDetails();
      }}
    >
      <div className={cell}>
        <span className={styles.colValue}>{row.shortName}</span>
      </div>
      <div className={cell} aria-hidden="true">
        {isHovered && showHoverPortrait ? (
          <div
            className={clsx(
              styles.repRowImageFloat,
              floatAtBottom && styles.repRowImageFloatBottom,
            )}
          >
            <HoverPortrait imageUrl={hoverUrl} />
          </div>
        ) : null}
      </div>
      <div className={desktop}>
        <span className={styles.colValue}>{row.chamber}</span>
      </div>
      <div className={desktop}>
        <span
          className={styles.colValue}
          style={
            row.districtColorFill
              ? { color: row.districtColorFill }
              : undefined
          }
        >
          {row.district}
        </span>
      </div>
      <div
        className={clsx(
          desktop,
          styles.repNameNavCellTrailDesktop,
        )}
      >
        <span
          className={clsx(
            styles.colValue,
            row.termHighlightMidterm && styles.termNextMidterm,
          )}
        >
          {row.termEndDisplay}
        </span>
      </div>
      <div
        className={clsx(
          cell,
          styles.repRosterMobileOnly,
          styles.repNameNavCellMobileActions,
          styles.repNameNavCellTrailMobile,
        )}
      >
        {tel ? (
          <a
            href={`tel:${tel}`}
            className={clsx(
              styles.repRowActionBase,
              styles.repRowActionPill,
            )}
            aria-label={`Call ${row.fullName}`}
          >
            Call
          </a>
        ) : (
          <button
            type="button"
            className={clsx(
              styles.repRowActionBase,
              styles.repRowActionPill,
            )}
            disabled
            aria-label={`No phone listed for ${row.fullName}`}
          >
            Call
          </button>
        )}
        <button
          type="button"
          className={clsx(
            styles.repRowActionBase,
            styles.repRowActionRect,
          )}
          disabled={detailsDisabled}
          aria-label={`Details for ${row.fullName}`}
          onClick={openDetails}
        >
          Details
        </button>
      </div>
    </div>
  );
}

export type RepRosterProps = {
  rows: RepRosterRow[];
  onRowDetails?: (row: RepRosterRow) => void;
  emptyMessage?: string;
};

export default function RepRoster({
  rows,
  onRowDetails,
  emptyMessage,
}: RepRosterProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const showHoverPortrait = useHoverPortraitEnabled();

  usePrefetchPortraitImages(rows, showHoverPortrait);

  if (!rows.length) {
    if (!emptyMessage) return null;
    return (
      <div className={styles.main}>
        <section className={styles.namesSection}>
          <p className={styles.rosterEmpty}>{emptyMessage}</p>
        </section>
      </div>
    );
  }

  const n = rows.length;

  return (
    <div className={styles.main}>
      <section className={styles.namesSection}>
        <div className={styles.namesContainer}>
          <div className={styles.names}>
            <RosterColumnHeaders />
            {rows.map((row, i) => (
              <RosterRow
                key={row.id}
                row={row}
                index={i}
                rowCount={n}
                onRowDetails={onRowDetails}
                isHovered={hoveredId === row.id}
                showHoverPortrait={showHoverPortrait}
                onHoverChange={(hovering) =>
                  setHoveredId(hovering ? row.id : null)
                }
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
