"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog.client";
import { Input } from "@/components/ui/input";
import { SearchIcon, CloseIcon } from "@/components/ui/icons";
import { useLocale } from "@/lib/i18n.client";
import { errorMessage } from "@/lib/http/http-error";
import { getAllPokemon, getPokemonPage, parsePage } from "./pokemon.api";
import { PokedexDevice } from "./pokedex-device";

// Public, read-only data: 5m freshness / 10m inactive retention.
// Provider is feature-scoped and created per mounted tree, never shared across SSR requests.
export function PokemonExplorer() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60_000,
            gcTime: 10 * 60_000,
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <PokemonCollection />
    </QueryClientProvider>
  );
}

function PokemonCollection() {
  const { t } = useLocale();
  const params = useSearchParams();
  const page = parsePage(params.get("page"));
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isSearching = Boolean(searchTerm.trim());

  // Keyboard shortcut: Cmd/Ctrl+K to focus search input
  // Authorized effect exception per architecture.md: window-level DOM event listener with proper cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const pageQuery = useQuery({
    queryKey: ["pokemon", "list", page],
    queryFn: ({ signal }) => getPokemonPage(page, signal),
  });

  const allQuery = useQuery({
    queryKey: ["pokemon", "all"],
    queryFn: ({ signal }) => getAllPokemon(signal),
    enabled: isSearching,
  });

  if (pageQuery.isPending && !isSearching) {
    return (
      <p
        role="status"
        className="rounded-panel border border-border bg-surface-raised p-10 font-mono text-sm text-muted-foreground"
      >
        Opening telemetry and field records…
      </p>
    );
  }

  if (pageQuery.isError && !isSearching) {
    return (
      <div
        role="alert"
        className="rounded-panel border border-border bg-surface-raised p-8"
      >
        <p className="mb-4 text-sm text-error-foreground">
          {errorMessage(pageQuery.error)}
        </p>
        <Button onClick={() => void pageQuery.refetch()}>Try again</Button>
      </div>
    );
  }

  const totalPages = pageQuery.data?.meta?.pagination.totalPages ?? 0;
  const totalItems = pageQuery.data?.meta?.pagination.totalItems ?? 0;
  const normalizedSearch = searchTerm.trim().toLowerCase();

  let searchContent = null;
  if (isSearching) {
    if (allQuery.isPending) {
      searchContent = (
        <p
          role="status"
          className="rounded-panel border border-border bg-surface-raised p-10 font-mono text-sm text-muted-foreground"
        >
          Searching catalog registry…
        </p>
      );
    } else if (allQuery.isError) {
      searchContent = (
        <div
          role="alert"
          className="rounded-panel border border-border bg-surface-raised p-8"
        >
          <p className="mb-4 text-sm text-error-foreground">
            {errorMessage(allQuery.error)}
          </p>
          <Button onClick={() => void allQuery.refetch()}>Try again</Button>
        </div>
      );
    } else {
      const allResults = allQuery.data.value;
      const matches = allResults.filter(
        (pokemon) =>
          pokemon.name.includes(normalizedSearch) ||
          String(pokemon.number) === normalizedSearch.replace(/^#/, ""),
      );
      if (matches.length === 0) {
        searchContent = (
          <div
            role="status"
            className="rounded-panel border border-border bg-surface-raised p-12 text-center"
          >
            <p className="font-mono text-sm text-muted-foreground">
              No Pokémon match &ldquo;{searchTerm}&rdquo; in the catalog
              registry.
            </p>
            <Button
              variant="secondary"
              onClick={() => setSearchTerm("")}
              className="mt-4 font-mono text-xs uppercase tracking-wider"
            >
              Clear search
            </Button>
          </div>
        );
      } else {
        searchContent = (
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-3">
              <p className="font-mono text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {matches.length}{" "}
                {matches.length === 1 ? "Specimen Match" : "Specimen Matches"}{" "}
                Found
              </p>
              <span className="font-mono text-xs text-muted-foreground">
                {allResults.length} public records
              </span>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matches.slice(0, 60).map((pokemon) => (
                <PokemonCard
                  key={pokemon.name}
                  name={pokemon.name}
                  number={pokemon.number}
                />
              ))}
            </ul>
            {matches.length > 60 && (
              <p className="mt-8 text-center font-mono text-xs text-muted-foreground">
                Showing top 60 of {matches.length} matches. Type additional
                characters to narrow down.
              </p>
            )}
          </div>
        );
      }
    }
  }

  return (
    <section aria-label="Pokémon collection">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="relative flex-1 sm:max-w-md"
        >
          <label htmlFor="pokemon-search" className="sr-only">
            Search Pokémon across the collection
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <SearchIcon size={16} />
            </span>
            <Input
              ref={inputRef}
              id="pokemon-search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape" && searchTerm) {
                  e.preventDefault();
                  setSearchTerm("");
                }
              }}
              placeholder={t.explore.searchPlaceholder}
              className="pl-10 pr-20 font-sans"
              aria-label={t.explore.searchAria}
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search input"
                  className="rounded-full p-1 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <CloseIcon size={13} />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center rounded border border-border/80 bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>
        </form>
        <div className="flex items-center justify-between gap-4 font-mono text-xs text-muted-foreground sm:justify-end">
          <p>
            {totalItems.toLocaleString("en")} {t.explore.cataloged}
          </p>
          <span aria-hidden="true">·</span>
          <p>
            {t.explore.page} {page} {t.explore.of} {Math.max(1, totalPages)}
          </p>
        </div>
      </div>

      {isSearching ? (
        searchContent
      ) : pageQuery.data?.value.length === 0 ? (
        <p
          role="status"
          className="py-12 font-mono text-sm text-muted-foreground"
        >
          No Pokémon on this page.
        </p>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pageQuery.data?.value.map((pokemon) => (
              <PokemonCard
                key={pokemon.name}
                name={pokemon.name}
                number={pokemon.number}
              />
            ))}
          </ul>
          <nav
            aria-label="Collection pagination"
            className="mt-10 flex min-h-11 items-center justify-between border-t border-border/60 pt-6"
          >
            {page > 1 ? (
              <Link
                href={`?page=${page - 1}`}
                className="rounded-control border border-border bg-surface-raised px-5 py-2.5 font-mono text-xs font-semibold tracking-wider uppercase text-foreground hover:bg-surface-muted"
              >
                {t.explore.prev}
              </Link>
            ) : (
              <span />
            )}
            <span className="font-mono text-xs text-muted-foreground">
              {t.explore.page} {page} / {Math.max(1, totalPages)}
            </span>
            {page < totalPages ? (
              <Link
                href={`?page=${page + 1}`}
                className="rounded-control border border-border bg-surface-raised px-5 py-2.5 font-mono text-xs font-semibold tracking-wider uppercase text-foreground hover:bg-surface-muted"
              >
                {t.explore.next}
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </>
      )}
    </section>
  );
}

function PokemonCard({ name, number }: { name: string; number: number }) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${number}.png`;

  return (
    <li className="group flex flex-col justify-between rounded-panel border border-border bg-surface-raised p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-panel">
      <div>
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <span className="font-mono text-xs font-semibold tracking-wider text-muted-foreground">
            #{String(number).padStart(4, "0")}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            RECORD
          </span>
        </div>

        <div className="relative my-4 flex min-h-36 items-center justify-center rounded-control bg-surface-muted/40 p-3 transition-colors group-hover:bg-surface-muted/70">
          {!imageError ? (
            <Image
              src={spriteUrl}
              alt={name}
              width={120}
              height={120}
              unoptimized
              onError={() => setImageError(true)}
              className="drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <span className="font-mono text-xs text-muted-foreground">
              Illustration unavailable
            </span>
          )}
        </div>

        <h2 className="font-display text-xl font-bold capitalize tracking-tight text-foreground">
          {name}
        </h2>
      </div>

      <div className="mt-5 border-t border-border/50 pt-4">
        <Dialog
          open={open}
          onOpenChange={setOpen}
          title={name}
          description="Detailed specimen field analysis and biological telemetry."
          size="wide"
          variant="bare"
          trigger={
            <Button
              variant="secondary"
              aria-label={`Read about ${name}`}
              className="w-full justify-between font-mono text-xs font-medium uppercase tracking-wider group/btn"
            >
              <span>{t.explore.fieldNote}</span>
              <span
                aria-hidden="true"
                className="text-muted-foreground transition-transform group-hover/btn:translate-x-0.5"
              >
                {t.explore.inspect} ↗
              </span>
            </Button>
          }
        >
          {open && <PokedexDevice name={name} onClose={() => setOpen(false)} />}
        </Dialog>
      </div>
    </li>
  );
}

export function PokemonDetails({ name }: { name: string }) {
  return <PokedexDevice name={name} />;
}
