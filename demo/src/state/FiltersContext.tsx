import { createContext, useContext, useMemo, useState } from "react";

export type NameMode = "exact" | "startsWith";

export interface FriendsFilters {
  firstName: { value: string; mode: NameMode };
  lastName: { value: string; mode: NameMode };
  onDate?: Date | null;
  beforeDate?: Date | null;
  afterDate?: Date | null;
  dayOfYear?: string | null; // MM-DD
  tagsAnyOf: string[];
}

const defaultFilters: FriendsFilters = {
  firstName: { value: "", mode: "startsWith" },
  lastName: { value: "", mode: "startsWith" },
  onDate: null,
  beforeDate: null,
  afterDate: null,
  dayOfYear: null,
  tagsAnyOf: [],
};

interface FiltersContextValue {
  filters: FriendsFilters;
  setFilters: (next: FriendsFilters) => void;
}

const FiltersContext = createContext<FiltersContextValue | undefined>(undefined);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FriendsFilters>(defaultFilters);
  const value = useMemo(() => ({ filters, setFilters }), [filters]);
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
}
