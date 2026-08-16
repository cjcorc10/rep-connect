import { useEffect, useSyncExternalStore } from "react";
import type { WikipediaData } from "@/app/lib/wikipedia";

type EntryStatus = "idle" | "loading" | "done" | "error";

type EntrySnapshot = {
  data: WikipediaData | null;
  status: EntryStatus;
};

type Entry = {
  data: WikipediaData | null;
  status: EntryStatus;
  promise?: Promise<WikipediaData | null>;
  listeners: Set<() => void>;
  snapshot: EntrySnapshot;
};

const EMPTY_SNAPSHOT: EntrySnapshot = { data: null, status: "idle" };

const entries = new Map<string, Entry>();

function getEntry(id: string): Entry {
  let entry = entries.get(id);
  if (!entry) {
    entry = {
      data: null,
      status: "idle",
      listeners: new Set(),
      snapshot: { data: null, status: "idle" },
    };
    entries.set(id, entry);
  }
  return entry;
}

function refreshSnapshot(entry: Entry) {
  if (
    entry.snapshot.data !== entry.data ||
    entry.snapshot.status !== entry.status
  ) {
    entry.snapshot = { data: entry.data, status: entry.status };
  }
}

function notify(id: string) {
  const entry = getEntry(id);
  refreshSnapshot(entry);
  entry.listeners.forEach((listener) => listener());
}

async function fetchWiki(id: string): Promise<WikipediaData | null> {
  const res = await fetch(`/api/wikipedia/${encodeURIComponent(id)}`);
  return res.ok ? res.json() : null;
}

/** Shared loader — prefetch and hook both call this. */
export function loadWikipedia(
  wikipediaId: string | undefined,
): Promise<WikipediaData | null> {
  if (!wikipediaId) return Promise.resolve(null);

  const entry = getEntry(wikipediaId);
  if (entry.status === "done" || entry.status === "error") {
    return Promise.resolve(entry.data);
  }
  if (entry.promise) return entry.promise;

  entry.status = "loading";
  notify(wikipediaId);

  entry.promise = fetchWiki(wikipediaId)
    .then((data) => {
      entry.data = data;
      entry.status = "done";
      return data;
    })
    .catch((err) => {
      console.error("Error fetching Wikipedia data:", err);
      entry.data = null;
      entry.status = "error";
      return null;
    })
    .finally(() => {
      entry.promise = undefined;
      notify(wikipediaId);
    });

  return entry.promise;
}

/** Fire-and-forget prefetch (deduped via loadWikipedia). */
export function prefetchWikipedia(wikipediaId: string | undefined) {
  void loadWikipedia(wikipediaId);
}

export function useWikipedia(wikipediaId: string | undefined) {
  const subscribe = (onStoreChange: () => void) => {
    if (!wikipediaId) return () => {};
    const entry = getEntry(wikipediaId);
    entry.listeners.add(onStoreChange);
    return () => {
      entry.listeners.delete(onStoreChange);
    };
  };

  const getSnapshot = () => {
    if (!wikipediaId) return EMPTY_SNAPSHOT;
    return getEntry(wikipediaId).snapshot;
  };

  const { data, status } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  useEffect(() => {
    if (wikipediaId) void loadWikipedia(wikipediaId);
  }, [wikipediaId]);

  return {
    wiki: data,
    loading:
      !!wikipediaId && (status === "loading" || status === "idle"),
  };
}
