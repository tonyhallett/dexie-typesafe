import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { type Dayjs } from "dayjs";
import { useMemo } from "react";
import { useFilters } from "../state/FiltersContext";

export function FriendFilters() {
  const { filters, setFilters } = useFilters();

  const update = (patch: Partial<typeof filters>) => setFilters({ ...filters, ...patch });

  const dayOfYearLabel = useMemo(() => {
    return filters.dayOfYear ? filters.dayOfYear : "";
  }, [filters.dayOfYear]);

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Filters</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="First name"
          value={filters.firstName.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            update({ firstName: { ...filters.firstName, value: e.target.value } })
          }
          fullWidth
        />
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="fn-mode">Mode</InputLabel>
          <Select
            labelId="fn-mode"
            label="Mode"
            value={filters.firstName.mode}
            onChange={(e: SelectChangeEvent) =>
              update({ firstName: { ...filters.firstName, mode: e.target.value as any } })
            }
          >
            <MenuItem value="startsWith">startsWith</MenuItem>
            <MenuItem value="exact">exact</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Last name"
          value={filters.lastName.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            update({ lastName: { ...filters.lastName, value: e.target.value } })
          }
          fullWidth
        />
        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel id="ln-mode">Mode</InputLabel>
          <Select
            labelId="ln-mode"
            label="Mode"
            value={filters.lastName.mode}
            onChange={(e: SelectChangeEvent) =>
              update({ lastName: { ...filters.lastName, mode: e.target.value as any } })
            }
          >
            <MenuItem value="startsWith">startsWith</MenuItem>
            <MenuItem value="exact">exact</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <DatePicker
          label="On date"
          value={filters.onDate ? dayjs(filters.onDate) : null}
          onChange={(v: Dayjs | null) => update({ onDate: v?.toDate() ?? null })}
        />
        <DatePicker
          label="After date"
          value={filters.afterDate ? dayjs(filters.afterDate) : null}
          onChange={(v: Dayjs | null) => update({ afterDate: v?.toDate() ?? null })}
        />
        <DatePicker
          label="Before date"
          value={filters.beforeDate ? dayjs(filters.beforeDate) : null}
          onChange={(v: Dayjs | null) => update({ beforeDate: v?.toDate() ?? null })}
        />
        <DatePicker
          label="Specific day (MM-DD)"
          views={["month", "day"]}
          value={filters.dayOfYear ? dayjs(`2000-${filters.dayOfYear}`) : null}
          onChange={(v: Dayjs | null) => {
            if (!v) update({ dayOfYear: null });
            else
              update({
                dayOfYear: `${String(v.month() + 1).padStart(2, "0")}-${String(v.date()).padStart(2, "0")}`,
              });
          }}
        />
      </Stack>

      <Box>
        <TextField
          label="Add tag"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val && !filters.tagsAnyOf.includes(val)) {
                update({ tagsAnyOf: [...filters.tagsAnyOf, val] });
              }
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <Box sx={{ mt: 1 }}>
          {filters.tagsAnyOf.map((t) => (
            <Chip
              key={t}
              label={t}
              onDelete={() => update({ tagsAnyOf: filters.tagsAnyOf.filter((x) => x !== t) })}
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
      </Box>
    </Stack>
  );
}
