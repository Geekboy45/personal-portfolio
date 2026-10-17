"use client";
import {
  useState,
  useRef,
  useId,
  useEffect,
  useCallback,
  type FormEvent,
} from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  getPokemon,
  getPokemonSpecies,
  extractSpeciesLore,
} from "./pokemon.api";
import {
  pokemonObservationFormSchema,
  type PokemonObservationForm,
} from "./pokemon.schema";
import {
  readObservation,
  writeObservation,
  removeObservation,
  emptyObservation,
} from "./pokemon-observation.storage";
import { POKEMON_TYPE_COLORS } from "./pokemon.constants";
import { errorMessage } from "@/lib/http/http-error";
import {
  TelemetryIcon,
  LoreIcon,
  StarIcon,
  CloseIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  VolumeIcon,
} from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast.client";
import { useLocale } from "@/lib/i18n.client";

type PokedexDeviceProps = {
  name: string;
  onClose?: () => void;
};

type ScreenTab = "telemetry" | "lore" | "log";

export function PokedexDevice({ name, onClose }: PokedexDeviceProps) {
  const { showToast } = useToast();
  const { t, locale } = useLocale();
  const [activeTab, setActiveTab] = useState<ScreenTab>("telemetry");
  const [imageFailed, setImageFailed] = useState(false);
  const isSubmittingRef = useRef(false);

  const [currentName, setCurrentName] = useState(name);
  const [isPlayingCry, setIsPlayingCry] = useState(false);

  const [prevName, setPrevName] = useState(name);
  if (name !== prevName) {
    setPrevName(name);
    setCurrentName(name);
  }

  const tabId = useId();

  // Form state
  const [formData, setFormData] = useState<PokemonObservationForm>(() =>
    readObservation(name),
  );
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof PokemonObservationForm, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [prevCurrentName, setPrevCurrentName] = useState(currentName);
  if (currentName !== prevCurrentName) {
    setPrevCurrentName(currentName);
    setFormData(readObservation(currentName));
    setFieldErrors({});
    setSavedMessage(null);
    setImageFailed(false);
  }

  const detailQuery = useQuery({
    queryKey: ["pokemon", "detail", currentName],
    queryFn: ({ signal }) => getPokemon(currentName, signal),
  });

  const speciesQuery = useQuery({
    queryKey: ["pokemon", "species", detailQuery.data?.value.species.name],
    queryFn: ({ signal }) =>
      getPokemonSpecies(detailQuery.data!.value.species.name, signal),
    enabled: detailQuery.isSuccess,
  });

  const canGoPrev = Boolean(
    detailQuery.data?.value && detailQuery.data.value.id > 1,
  );
  const canGoNext = Boolean(
    detailQuery.data?.value && detailQuery.data.value.id < 1025,
  );

  const handlePrevPokemon = useCallback(() => {
    if (detailQuery.data?.value && detailQuery.data.value.id > 1) {
      setCurrentName(String(detailQuery.data.value.id - 1));
    }
  }, [detailQuery.data]);

  const handleNextPokemon = useCallback(() => {
    if (detailQuery.data?.value && detailQuery.data.value.id < 1025) {
      setCurrentName(String(detailQuery.data.value.id + 1));
    }
  }, [detailQuery.data]);

  const playCry = useCallback(() => {
    if (!detailQuery.data?.value) return;
    const poke = detailQuery.data.value;
    const audioUrl =
      poke.cries?.latest ||
      `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${poke.id}.ogg`;
    try {
      setIsPlayingCry(true);
      const audio = new Audio(audioUrl);
      audio.volume = 0.5;
      audio
        .play()
        .then(() => {
          audio.onended = () => setIsPlayingCry(false);
        })
        .catch(() => {
          setIsPlayingCry(false);
        });
    } catch {
      setIsPlayingCry(false);
    }
  }, [detailQuery.data]);

  // Authorized useEffect exception per docs/architecture.md#naming-and-organization:
  // Synchronizes with external browser window keyboard events for left/right specimen navigation.
  // Kept narrow with proper cleanup on unmount and dependency changes.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.getAttribute("role") === "tab")
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPokemon();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPokemon();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevPokemon, handleNextPokemon]);

  if (detailQuery.isPending) {
    return (
      <div
        role="status"
        className="flex min-h-96 items-center justify-center rounded-3xl border-4 border-device-shell-border bg-device-shell-dark p-12 text-inverse-foreground"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-surface-raised/20 border-t-device-lens" />
          <p className="font-mono text-sm tracking-wider uppercase">
            Loading Pokémon…
          </p>
        </div>
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div
        role="alert"
        className="rounded-3xl border-4 border-device-shell-border bg-device-shell-dark p-8 text-inverse-foreground"
      >
        <div className="rounded-xl border border-device-shell-border/30 bg-device-shell-border/60 p-6">
          <p className="font-mono text-sm text-inverse-foreground">
            {errorMessage(detailQuery.error)}
          </p>
          <button
            type="button"
            onClick={() => void detailQuery.refetch()}
            className="mt-4 rounded-lg bg-device-shell px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-inverse-foreground hover:bg-device-shell"
          >
            Retry Telemetry Link
          </button>
        </div>
      </div>
    );
  }

  const pokemon = detailQuery.data.value;
  const heightM = pokemon.height / 10;
  const weightKg = pokemon.weight / 10;
  const bmiRatio =
    heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : "—";
  const artworkUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ??
    pokemon.sprites.front_default;

  const speciesLore = speciesQuery.data
    ? extractSpeciesLore(speciesQuery.data.value)
    : null;

  // Immediate in-flight submission guard conforming to docs/api.md#forms-and-request-payloads
  const handleSubmitObservation = (e: FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSavedMessage(null);

    const validation = pokemonObservationFormSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Partial<
        Record<keyof PokemonObservationForm, string>
      > = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as keyof PokemonObservationForm;
        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = issue.message;
        }
      }
      setFieldErrors(formattedErrors);
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    setFieldErrors({});
    try {
      writeObservation(currentName, validation.data);
      const successText = `Observation record filed for #${String(pokemon.id).padStart(4, "0")} ${pokemon.name}.`;
      setSavedMessage(successText);
      showToast({
        title: "Observation Record Filed",
        description: successText,
        variant: "success",
      });
    } catch {
      setFieldErrors({
        observationNotes:
          "Could not save. Your edits remain in this open form.",
      });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const tabs = [
    {
      id: "telemetry" as const,
      label: t.pokedex.telemetryTab,
      Icon: TelemetryIcon,
    },
    { id: "lore" as const, label: t.pokedex.loreTab, Icon: LoreIcon },
    { id: "log" as const, label: t.pokedex.logTab, Icon: StarIcon },
  ];

  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-device-shell-border bg-gradient-to-b from-device-shell via-device-shell to-device-shell-dark p-2.5 sm:p-7 shadow-device text-foreground animate-[pokedex-open_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards] motion-reduce:animate-none min-w-0">
      {/* Top Hardware Device Bar */}
      <div className="mb-3 sm:mb-6 flex items-center justify-between border-b-2 border-device-shell-border pb-2.5 sm:pb-4">
        {/* Left Optical Sensor Cluster */}
        <div className="flex items-center gap-3">
          {/* Big Blue Optical Lens using semantic tokens from tokens.css */}
          <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border-4 border-inverse-foreground bg-gradient-to-br from-device-lens-light via-device-lens to-device-lens-dark shadow-device-lens">
            <div className="h-4 w-4 rounded-full bg-white/90 blur-[0.5px] -translate-x-1.5 -translate-y-1.5" />
          </div>
          {/* Status LEDs */}
          <div className="flex items-center gap-2 pl-1">
            <span className="h-3.5 w-3.5 rounded-full border border-device-shell-border bg-device-shell shadow-device-indicator animate-pulse" />
            <span className="h-3.5 w-3.5 rounded-full border border-warning bg-device-indicator shadow-device-indicator" />
            <span className="h-3.5 w-3.5 rounded-full border border-success bg-success shadow-device-indicator" />
          </div>
        </div>

        {/* Model Identifier & Close Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <span className="font-mono text-xs font-bold tracking-widest text-inverse-foreground">
              SILPH POKÉDEX
            </span>
            <span className="block font-mono text-[10px] text-inverse-foreground/80">
              NAVIGABLE WHITE LCD // PK-098
            </span>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Pokédex"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-device-shell-border/60 bg-device-shell-border text-inverse-foreground transition-colors hover:bg-device-shell-border hover:text-inverse-foreground focus-visible:outline-2 focus-visible:outline-inverse-foreground"
            >
              <CloseIcon size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Main Two-Panel Grid (White LCD Screens) */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-12 items-stretch min-w-0">
        {/* Left Screen Panel: White Artwork LCD & Hardware Controls */}
        <div className="md:col-span-5 flex flex-col justify-between rounded-xl sm:rounded-2xl border-2 border-device-shell-border/80 bg-device-shell-border/30 p-2 sm:p-4 shadow-inner min-w-0">
          {/* Main Visual Display (Clean, Solid White LCD Screen) */}
          <div className="relative flex flex-col items-center justify-center rounded-lg sm:rounded-xl border-2 sm:border-4 border-border bg-surface-raised p-3 sm:p-5 shadow-lg min-w-0">
            {/* Top Screen Sensor Dots */}
            <div className="absolute top-2.5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-device-shell shadow-device-dot" />
              <span className="h-2 w-2 rounded-full bg-device-shell shadow-device-dot" />
            </div>

            {/* Specimen Index Header with Navigation Controls */}
            <div className="mt-2 mb-1 w-full flex justify-between items-center font-mono text-xs font-bold text-primary">
              <span className="flex items-center gap-1.5">
                {formData.isFavorite && (
                  <StarIcon
                    size={13}
                    filled
                    className="text-warning"
                    aria-label="Cataloged Favorite"
                  />
                )}
                <span>{t.pokedex.specimen}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevPokemon}
                  disabled={!canGoPrev || detailQuery.isFetching}
                  title={
                    locale === "es"
                      ? "Espécimen anterior (←)"
                      : "Previous specimen (←)"
                  }
                  aria-label={
                    locale === "es" ? "Espécimen anterior" : "Previous specimen"
                  }
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeftIcon size={12} />
                </button>
                <span>NO. #{String(pokemon.id).padStart(4, "0")}</span>
                <button
                  type="button"
                  onClick={handleNextPokemon}
                  disabled={!canGoNext || detailQuery.isFetching}
                  title={
                    locale === "es"
                      ? "Siguiente espécimen (→)"
                      : "Next specimen (→)"
                  }
                  aria-label={
                    locale === "es" ? "Siguiente espécimen" : "Next specimen"
                  }
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronRightIcon size={12} />
                </button>
              </div>
            </div>

            {/* Official Artwork Display with Cry Playback on Click */}
            <div
              role="button"
              tabIndex={0}
              onClick={playCry}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  playCry();
                }
              }}
              title={
                locale === "es"
                  ? "Haz clic para escuchar el gruñido del Pokémon"
                  : "Click to hear the Pokémon cry"
              }
              aria-label={
                locale === "es"
                  ? `Escuchar gruñido de ${pokemon.name}`
                  : `Play ${pokemon.name} cry`
              }
              className="group relative my-2 sm:my-3 flex h-36 w-36 xs:h-44 xs:w-44 sm:h-52 sm:w-52 items-center justify-center rounded-lg bg-surface-muted/80 p-2 border border-border cursor-pointer transition-all hover:bg-surface-muted hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-focus"
            >
              {artworkUrl && !imageFailed ? (
                <Image
                  src={artworkUrl}
                  alt={pokemon.name}
                  width={210}
                  height={210}
                  unoptimized
                  onError={() => setImageFailed(true)}
                  className={`max-h-full w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105 ${
                    isPlayingCry ? "scale-110" : ""
                  }`}
                />
              ) : (
                <p className="font-mono text-sm text-muted-foreground">
                  No illustration available
                </p>
              )}
              {/* Audio badge overlay */}
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 shadow-sm border border-slate-200 text-slate-700 group-hover:bg-primary group-hover:text-white transition-colors">
                <VolumeIcon
                  size={11}
                  className={
                    isPlayingCry
                      ? "animate-pulse text-amber-500 group-hover:text-amber-300"
                      : ""
                  }
                />
                <span className="font-mono text-[9px] font-bold uppercase">
                  {isPlayingCry
                    ? locale === "es"
                      ? "Gruñendo"
                      : "Crying"
                    : "Cry"}
                </span>
              </span>
            </div>

            {/* Specimen Name Display & Audio Button */}
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground capitalize">
                {pokemon.name}
              </h2>
              <button
                type="button"
                onClick={playCry}
                title={
                  locale === "es" ? "Reproducir gruñido" : "Play vocalization"
                }
                aria-label={
                  locale === "es" ? "Reproducir gruñido" : "Play vocalization"
                }
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-muted hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <VolumeIcon
                  size={13}
                  className={isPlayingCry ? "text-primary animate-pulse" : ""}
                />
              </button>
            </div>
            {speciesLore && (
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                {locale === "es" ? speciesLore.genusEs : speciesLore.genusEn}
              </p>
            )}
          </div>

          {/* Hardware Controls Under Left Screen (Interactable) */}
          <div className="mt-4 flex items-center justify-between px-2">
            {/* Red Hardware Button: Quick Favorite Star Toggle */}
            <button
              type="button"
              onClick={() => {
                const updated = {
                  ...formData,
                  isFavorite: !formData.isFavorite,
                };
                try {
                  writeObservation(currentName, updated);
                  setFormData(updated);
                  showToast({
                    title: updated.isFavorite
                      ? "Specimen Bookmarked"
                      : "Bookmark Removed",
                    variant: "info",
                  });
                } catch {
                  showToast({
                    title: "Could not save favorite",
                    description:
                      "Browser storage is unavailable. Your previous favorite is unchanged.",
                    variant: "error",
                  });
                }
              }}
              title={
                formData.isFavorite ? "Unmark Favorite" : "Mark as Favorite"
              }
              aria-label={
                formData.isFavorite ? "Unmark Favorite" : "Mark as Favorite"
              }
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-device-shell-border shadow-md transition-transform active:scale-90 ${
                formData.isFavorite
                  ? "bg-device-indicator text-foreground"
                  : "bg-device-shell text-inverse-foreground"
              }`}
            >
              <StarIcon size={14} filled={formData.isFavorite} />
            </button>

            {/* Pill Buttons: Quick Tab Switchers */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("telemetry")}
                aria-label="Switch to Telemetry screen"
                className={`h-3 w-8 rounded-full border border-device-lens-dark transition-colors ${
                  activeTab === "telemetry"
                    ? "bg-device-lens-light shadow-sm"
                    : "bg-device-lens"
                }`}
              />
              <button
                type="button"
                onClick={() => setActiveTab("lore")}
                aria-label="Switch to Field Lore screen"
                className={`h-3 w-8 rounded-full border border-warning transition-colors ${
                  activeTab === "lore"
                    ? "bg-device-indicator shadow-sm"
                    : "bg-device-indicator"
                }`}
              />
              <button
                type="button"
                onClick={() => setActiveTab("log")}
                aria-label="Switch to Observation Log screen"
                className={`h-3 w-8 rounded-full border border-success transition-colors ${
                  activeTab === "log" ? "bg-success shadow-sm" : "bg-success"
                }`}
              />
            </div>

            {/* Interactive D-Pad */}
            <div className="relative h-9 w-9">
              {/* Horizontal Bar: Prev / Next Pokémon */}
              <div className="absolute left-0 top-3 flex h-3 w-9 items-center justify-between rounded-sm bg-device-control border border-border">
                <button
                  type="button"
                  onClick={handlePrevPokemon}
                  disabled={!canGoPrev}
                  aria-label="Previous Pokémon specimen"
                  title="Previous Pokémon (←)"
                  className="h-full w-4.5 rounded-l-sm hover:bg-slate-700 active:bg-slate-600 disabled:opacity-40 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleNextPokemon}
                  disabled={!canGoNext}
                  aria-label="Next Pokémon specimen"
                  title="Next Pokémon (→)"
                  className="h-full w-4.5 rounded-r-sm hover:bg-slate-700 active:bg-slate-600 disabled:opacity-40 cursor-pointer"
                />
              </div>

              {/* Vertical Bar: Next Tab Switcher */}
              <button
                type="button"
                onClick={() => {
                  const order: readonly ScreenTab[] = [
                    "telemetry",
                    "lore",
                    "log",
                  ];
                  const currIdx = order.indexOf(activeTab);
                  const nextIdx = (currIdx + 1) % order.length;
                  const targetTab = order[nextIdx] ?? "telemetry";
                  setActiveTab(targetTab);
                }}
                aria-label="Cycle Pokédex Tab View"
                title="Switch view (↑/↓)"
                className="absolute left-3 top-0 h-9 w-3 rounded-sm bg-device-control border border-border hover:bg-slate-700 active:bg-slate-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Screen Panel: Navigable White LCD Screen */}
        <div className="md:col-span-7 flex flex-col justify-between rounded-xl sm:rounded-2xl border-2 sm:border-4 border-border bg-surface-raised p-3 sm:p-6 shadow-lg text-foreground min-w-0">
          <div>
            {/* Screen Header & Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-2.5 sm:pb-3 gap-2 sm:gap-3">
              <div
                role="tablist"
                aria-label="Pokédex Information Views"
                className="flex items-center gap-1 rounded-lg bg-surface-muted p-1 w-full max-w-full overflow-x-auto min-w-0 scrollbar-none"
              >
                {tabs.map((tab) => {
                  const IconComponent = tab.Icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      id={`${tabId}-tab-${tab.id}`}
                      type="button"
                      tabIndex={isSelected ? 0 : -1}
                      onKeyDown={(event) => {
                        const index = tabs.findIndex(
                          (entry) => entry.id === activeTab,
                        );
                        const next =
                          event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? tabs.length - 1
                              : event.key === "ArrowRight"
                                ? (index + 1) % tabs.length
                                : event.key === "ArrowLeft"
                                  ? (index + tabs.length - 1) % tabs.length
                                  : -1;
                        const target = tabs[next];
                        if (!target) return;
                        event.preventDefault();
                        setActiveTab(target.id);
                        document
                          .getElementById(`${tabId}-tab-${target.id}`)
                          ?.focus();
                      }}
                      aria-selected={isSelected}
                      aria-controls={`${tabId}-panel-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1 whitespace-nowrap rounded-md px-2 sm:px-2.5 py-1 font-mono text-[10px] sm:text-[11px] font-semibold transition-colors shrink-0 ${
                        isSelected
                          ? "bg-surface-raised text-primary shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <IconComponent
                        size={13}
                        className={
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }
                      />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              <span className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground font-semibold tracking-wider uppercase shrink-0">
                {activeTab.toUpperCase()} VIEW
              </span>
            </div>

            {/* TAB 1: TELEMETRY & STATS */}
            {
              <div
                hidden={activeTab !== "telemetry"}
                id={`${tabId}-panel-telemetry`}
                tabIndex={0}
                role="tabpanel"
                aria-labelledby={`${tabId}-tab-telemetry`}
                className="mt-4 space-y-4"
              >
                {/* Elemental Classification */}
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.pokedex.elementalTypes}
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {pokemon.types.map(({ type }) => {
                      const style =
                        POKEMON_TYPE_COLORS[type.name] ??
                        POKEMON_TYPE_COLORS.normal!;
                      return (
                        <span
                          key={type.name}
                          style={{
                            backgroundColor: style.bg,
                            color: style.text,
                            borderColor: style.border,
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 font-mono text-xs font-bold capitalize"
                        >
                          <span
                            style={{ backgroundColor: style.dot }}
                            className="h-1.5 w-1.5 rounded-full shadow-[0_0_6px_currentColor]"
                          />
                          {type.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Physical Telemetry Metrics */}
                <div className="rounded-xl border border-border bg-surface-muted p-2.5 sm:p-3 min-w-0">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t.pokedex.measurements}
                  </span>
                  <dl className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2 min-w-0">
                    <div className="rounded-lg border border-border bg-surface-raised p-1.5 sm:p-2 text-center shadow-xs min-w-0 overflow-hidden">
                      <dt className="font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                        {t.pokedex.height}
                      </dt>
                      <dd className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-foreground truncate">
                        {heightM} m
                      </dd>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-raised p-1.5 sm:p-2 text-center shadow-xs min-w-0 overflow-hidden">
                      <dt className="font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                        {t.pokedex.weight}
                      </dt>
                      <dd className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-foreground truncate">
                        {weightKg} kg
                      </dd>
                    </div>
                    <div className="rounded-lg border border-border bg-surface-raised p-1.5 sm:p-2 text-center shadow-xs min-w-0 overflow-hidden">
                      <dt className="font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                        {t.pokedex.ratio}
                      </dt>
                      <dd className="mt-0.5 font-mono text-xs sm:text-sm font-bold text-foreground truncate">
                        {bmiRatio}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Base Combat Statistics */}
                {pokemon.stats && (
                  <div className="space-y-1.5 rounded-xl border border-border bg-surface-muted p-2.5 sm:p-3 min-w-0">
                    <div className="flex items-center justify-between border-b border-border pb-1">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {t.pokedex.stats}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {t.pokedex.max}
                      </span>
                    </div>
                    <div className="grid gap-1.5 pt-1">
                      {pokemon.stats.map((statItem) => {
                        const pct = Math.min(
                          100,
                          Math.round((statItem.base_stat / 255) * 100),
                        );
                        return (
                          <div
                            key={statItem.stat.name}
                            className="flex items-center gap-2 font-mono text-xs"
                          >
                            <span className="w-12 sm:w-16 truncate font-medium text-muted-foreground uppercase text-[9px] sm:text-[10px]">
                              {statItem.stat.name.replace("special-", "sp.")}
                            </span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
                              <div
                                style={{ width: `${pct}%` }}
                                className="h-full rounded-full bg-primary transition-all duration-500 motion-reduce:transition-none"
                              />
                            </div>
                            <span className="w-7 sm:w-8 text-right font-bold text-foreground text-xs">
                              {statItem.base_stat}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            }

            {/* TAB 2: FIELD LORE & CANONICAL POKEDEX TEXT */}
            {
              <div
                hidden={activeTab !== "lore"}
                id={`${tabId}-panel-lore`}
                tabIndex={0}
                role="tabpanel"
                aria-labelledby={`${tabId}-tab-lore`}
                className="mt-4 space-y-4"
              >
                {speciesQuery.isPending && (
                  <p className="py-8 text-center font-mono text-xs text-muted-foreground">
                    Querying Silph biological archives for species lore…
                  </p>
                )}

                {speciesLore && (
                  <>
                    {/* Canonical Pokédex Entry in active language */}
                    <div className="rounded-xl border border-border bg-surface-muted p-4">
                      <div className="flex items-center justify-between border-b border-border pb-2 mb-2.5">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                          {t.pokedex.canonicalEntry}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground uppercase">
                          {locale === "es" ? "ES-LA" : "EN-US"}
                        </span>
                      </div>
                      <p className="font-sans text-sm text-foreground leading-relaxed italic">
                        &ldquo;
                        {locale === "es"
                          ? speciesLore.flavorEs || speciesLore.flavorEn
                          : speciesLore.flavorEn || speciesLore.flavorEs}
                        &rdquo;
                      </p>
                    </div>

                    {/* Biological Classification Metrics */}
                    <div className="rounded-xl border border-border bg-surface-muted p-2.5 sm:p-3 min-w-0">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {t.pokedex.ecologicalData}
                      </span>
                      <dl className="mt-2 grid grid-cols-3 gap-1.5 sm:gap-2 min-w-0">
                        <div className="rounded-lg border border-border bg-surface-raised p-1.5 sm:p-2 text-center shadow-xs min-w-0 overflow-hidden">
                          <dt className="font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                            {t.pokedex.habitat}
                          </dt>
                          <dd className="mt-0.5 font-mono text-[11px] sm:text-xs font-bold text-foreground capitalize truncate">
                            {speciesLore.habitat}
                          </dd>
                        </div>
                        <div className="rounded-lg border border-border bg-surface-raised p-1.5 sm:p-2 text-center shadow-xs min-w-0 overflow-hidden">
                          <dt className="font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                            {t.pokedex.captureRate}
                          </dt>
                          <dd className="mt-0.5 font-mono text-[11px] sm:text-xs font-bold text-foreground truncate">
                            {speciesLore.captureRate} / 255
                          </dd>
                        </div>
                        <div className="rounded-lg border border-border bg-surface-raised p-1.5 sm:p-2 text-center shadow-xs min-w-0 overflow-hidden">
                          <dt className="font-mono text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider text-muted-foreground truncate">
                            {t.pokedex.status}
                          </dt>
                          <dd className="mt-0.5 font-mono text-[11px] sm:text-xs font-bold text-primary truncate">
                            {speciesLore.isLegendary
                              ? t.pokedex.legendary
                              : t.pokedex.standard}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </>
                )}

                {speciesQuery.isError && (
                  <div className="rounded-xl border border-warning bg-warning-surface p-4 font-mono text-xs text-warning">
                    {errorMessage(speciesQuery.error)}
                  </div>
                )}
              </div>
            }

            {/* TAB 3: OBSERVATION LOG & FAVORITE FORM */}
            {
              <div
                hidden={activeTab !== "log"}
                id={`${tabId}-panel-log`}
                tabIndex={0}
                role="tabpanel"
                aria-labelledby={`${tabId}-tab-log`}
                className="mt-4"
              >
                <form
                  onSubmit={handleSubmitObservation}
                  noValidate
                  className="space-y-3 rounded-xl border border-border bg-surface-muted p-4"
                >
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                      {locale === "es"
                        ? "Registro de Observación de Campo"
                        : "Field Observation Record"}
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer font-mono text-xs font-semibold text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.isFavorite}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            isFavorite: e.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-border text-primary focus:ring-focus"
                      />
                      <span className="flex items-center gap-1">
                        <span>{t.pokedex.favorite}</span>
                        <StarIcon
                          size={12}
                          filled={formData.isFavorite}
                          className="text-warning"
                        />
                      </span>
                    </label>
                  </div>

                  {/* Accessible Status Announcement conforming to WCAG 2.2 */}
                  {savedMessage && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="rounded-lg border border-success bg-success-surface p-2.5 font-mono text-xs text-success flex items-center gap-2"
                    >
                      <CheckIcon size={14} className="text-success shrink-0" />
                      <span>{savedMessage}</span>
                    </div>
                  )}

                  {/* Observer Callsign Input */}
                  <div>
                    <label
                      htmlFor="observer-callsign"
                      className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1"
                    >
                      {t.pokedex.observerName}
                    </label>
                    <input
                      id="observer-callsign"
                      type="text"
                      value={formData.observerName}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          observerName: e.target.value,
                        }));
                        if (fieldErrors.observerName) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            observerName: undefined,
                          }));
                        }
                      }}
                      placeholder="e.g. Oak Field Unit #4"
                      aria-invalid={Boolean(fieldErrors.observerName)}
                      aria-describedby={
                        fieldErrors.observerName ? "observer-error" : undefined
                      }
                      className="w-full rounded-lg border border-border bg-surface-raised px-3 py-1.5 font-sans text-xs text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                    />
                    {fieldErrors.observerName && (
                      <p
                        id="observer-error"
                        role="alert"
                        className="mt-1 font-mono text-[11px] text-danger"
                      >
                        {fieldErrors.observerName}
                      </p>
                    )}
                  </div>

                  {/* Priority Classification */}
                  <div>
                    <label
                      htmlFor="priority-level"
                      className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1"
                    >
                      {t.pokedex.priority}
                    </label>
                    <select
                      id="priority-level"
                      value={formData.priorityLevel}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          priorityLevel: e.target
                            .value as PokemonObservationForm["priorityLevel"],
                        }))
                      }
                      className="w-full rounded-lg border border-border bg-surface-raised px-3 py-1.5 font-sans text-xs text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                    >
                      <option value="standard">
                        {t.pokedex.priorityStandard}
                      </option>
                      <option value="priority">{t.pokedex.priorityHigh}</option>
                      <option value="critical">
                        {t.pokedex.priorityCritical}
                      </option>
                    </select>
                  </div>

                  {/* Field Notes Textarea */}
                  <div>
                    <label
                      htmlFor="observation-notes"
                      className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1"
                    >
                      {t.pokedex.fieldNotes}
                    </label>
                    <textarea
                      id="observation-notes"
                      rows={3}
                      value={formData.observationNotes}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          observationNotes: e.target.value,
                        }));
                        if (fieldErrors.observationNotes) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            observationNotes: undefined,
                          }));
                        }
                      }}
                      placeholder="Record behavior, feeding habits, or environmental conditions observed..."
                      aria-invalid={Boolean(fieldErrors.observationNotes)}
                      aria-describedby={
                        fieldErrors.observationNotes ? "notes-error" : undefined
                      }
                      className="w-full rounded-lg border border-border bg-surface-raised p-3 font-sans text-xs text-foreground focus-visible:outline-2 focus-visible:outline-focus"
                    />
                    {fieldErrors.observationNotes && (
                      <p
                        id="notes-error"
                        role="alert"
                        className="mt-1 font-mono text-[11px] text-danger"
                      >
                        {fieldErrors.observationNotes}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="text-danger underline font-mono text-xs cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      try {
                        removeObservation(currentName);
                        setFormData({ ...emptyObservation });
                        setFieldErrors({});
                        setSavedMessage(null);
                        showToast({
                          title:
                            locale === "es"
                              ? "Observación eliminada"
                              : "Observation Deleted",
                          description:
                            locale === "es"
                              ? `Observación de #${String(pokemon.id).padStart(4, "0")} ${pokemon.name} eliminada.`
                              : `Local observation for #${String(pokemon.id).padStart(4, "0")} ${pokemon.name} deleted.`,
                          variant: "info",
                        });
                      } catch {
                        showToast({
                          title:
                            locale === "es"
                              ? "Error al eliminar"
                              : "Could not delete local observation",
                          variant: "error",
                        });
                      }
                    }}
                  >
                    {locale === "es"
                      ? "Eliminar observación local"
                      : "Delete local observation"}
                  </button>
                  {/* Form Submission Action with In-Flight Guard */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {locale === "es"
                        ? "Guardado en este navegador hasta 7 días. No incluyas información privada."
                        : "Saved on this browser for up to 7 days. Do not enter private information."}
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-inverse-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-50"
                    >
                      {isSubmitting ? t.pokedex.filing : t.pokedex.saveRecord}
                    </button>
                  </div>
                </form>
              </div>
            }
          </div>

          {/* Screen Bottom Telemetry Footer */}
          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between border-t border-border pt-2.5 sm:pt-3 font-mono text-[9px] sm:text-[10px] text-muted-foreground gap-2">
            <span>SEC-LEVEL: ALPHA // LAB ID #849</span>
            <span className="flex items-center gap-1.5 font-bold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Public API data
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
