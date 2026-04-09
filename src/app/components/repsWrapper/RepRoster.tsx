"use client";

import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import type { RepRosterRow } from "@/app/lib/repRoster";
import { useWikimediaPortraitFallback } from "@/app/lib/useWikimediaPortraitFallback";
import styles from "./repsWrapper.module.scss";

const prefetchedPortraitUrls = new Set<string>();

function resolveHoverPortraitUrl(row: RepRosterRow): string {
  if (row.portraitProxyOcdId) {
    return `/api/state-legislator-portrait?ocd=${encodeURIComponent(row.portraitProxyOcdId)}`;
  }
  return row.portraitSrc ?? row.imageUrl ?? "";
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

function RosterRow({
  row,
  onRowDetails,
  isActiveHoverRow,
  onRowMouseEnter,
  onRowMouseLeave,
  hoverPortraitUrl,
  portraitAlignBottom,
}: {
  row: RepRosterRow;
  onRowDetails?: (row: RepRosterRow) => void;
  isActiveHoverRow: boolean;
  onRowMouseEnter: () => void;
  onRowMouseLeave: () => void;
  hoverPortraitUrl: string;
  portraitAlignBottom: boolean;
}) {
  const tel = row.phone?.trim().replace(/\s/g, "") ?? "";
  const isStateRow = Boolean(row.portraitProxyOcdId);
  const detailsDisabled =
    !onRowDetails || (isStateRow && !row.externalUrl?.trim());
  const openDetails = () => {
    if (!detailsDisabled) onRowDetails?.(row);
  };

  return (
    <div
      className={clsx(
        styles.repNameNav,
        isActiveHoverRow && styles.repNameNavHoverLift,
      )}
      onMouseEnter={onRowMouseEnter}
      onMouseLeave={onRowMouseLeave}
      onFocusCapture={onRowMouseEnter}
      onBlurCapture={(e) => {
        const next = e.relatedTarget;
        if (next && e.currentTarget.contains(next as Node)) return;
        onRowMouseLeave();
      }}
      onClick={(e) => {
        const target = e.target as HTMLElement | null;
        if (
          target?.closest(
            "a,button,input,textarea,select,[role='button']",
          )
        ) {
          return;
        }
        openDetails();
      }}
    >
      <div className={styles.repNameNavCell}>
        <span className={styles.colValue}>{row.shortName}</span>
      </div>
      <div className={styles.repNameNavCell} aria-hidden="true">
        {isActiveHoverRow ? (
          <div
            className={clsx(
              styles.repRowImageFloat,
              portraitAlignBottom && styles.repRowImageFloatBottom,
            )}
          >
            <HoverPortrait imageUrl={hoverPortraitUrl} />
          </div>
        ) : null}
      </div>
      <div
        className={clsx(styles.repNameNavCell, styles.repRosterDesktopOnly)}
      >
        <span className={styles.colValue}>{row.chamber}</span>
      </div>
      <div
        className={clsx(styles.repNameNavCell, styles.repRosterDesktopOnly)}
      >
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
          styles.repNameNavCell,
          styles.repRosterDesktopOnly,
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
          styles.repNameNavCell,
          styles.repRosterMobileOnly,
          styles.repNameNavCellMobileActions,
          styles.repNameNavCellTrailMobile,
        )}
      >
        {tel ? (
          <a
            href={`tel:${tel}`}
            className={clsx(styles.repRowActionBase, styles.repRowActionPill)}
            aria-label={`Call ${row.fullName}`}
          >
            Call
          </a>
        ) : (
          <button
            type="button"
            className={clsx(styles.repRowActionBase, styles.repRowActionPill)}
            disabled
            aria-label={`No phone listed for ${row.fullName}`}
          >
            Call
          </button>
        )}
        <button
          type="button"
          className={clsx(styles.repRowActionBase, styles.repRowActionRect)}
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

  useEffect(() => {
    rows.forEach((row) => {
      const imageUrl = resolveHoverPortraitUrl(row).trim();
      if (!imageUrl || prefetchedPortraitUrls.has(imageUrl)) return;
      prefetchedPortraitUrls.add(imageUrl);
      const img = new window.Image();
      img.decoding = "async";
      img.src = imageUrl;
    });
  }, [rows]);

  if (!rows.length && emptyMessage) {
    return (
      <div className={styles.main}>
        <section className={styles.namesSection}>
          <p className={styles.rosterEmpty}>{emptyMessage}</p>
        </section>
      </div>
    );
  }

  if (!rows.length) {
    return null;
  }

  return (
    <div className={styles.main}>
      <section className={styles.namesSection}>
        <div className={styles.namesContainer}>
          <div className={styles.names}>
            <div
              className={styles.repNameNavHeader}
              role="row"
              aria-label="Columns"
            >
              <span className={styles.headerKey}>Name</span>
              <span className={styles.headerKey}>Image</span>
              <span
                className={clsx(
                  styles.headerKey,
                  styles.headerKeyMeta,
                  styles.repRosterDesktopOnly,
                )}
              >
                Chamber
              </span>
              <span
                className={clsx(
                  styles.headerKey,
                  styles.headerKeyMeta,
                  styles.repRosterDesktopOnly,
                )}
              >
                District
              </span>
              <span
                className={clsx(
                  styles.headerKey,
                  styles.headerKeyMeta,
                  styles.repRosterDesktopOnly,
                  styles.headerKeyTrailDesktop,
                )}
              >
                Term
              </span>
            </div>
            {rows.map((row, i) => (
              <RosterRow
                key={row.id}
                row={row}
                onRowDetails={onRowDetails}
                isActiveHoverRow={hoveredId === row.id}
                onRowMouseEnter={() => setHoveredId(row.id)}
                onRowMouseLeave={() => setHoveredId(null)}
                hoverPortraitUrl={resolveHoverPortraitUrl(row)}
                portraitAlignBottom={i >= Math.ceil(rows.length / 2)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
