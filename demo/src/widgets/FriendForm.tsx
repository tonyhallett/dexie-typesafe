import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";

export interface FriendModel {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | null;
  tags: string[];
}

export function FriendForm({
  initial,
  onSubmit,
  submitLabel = "Add",
}: {
  initial: FriendModel;
  onSubmit: (model: FriendModel) => void | Promise<void>;
  submitLabel?: string;
}) {
  const [model, setModel] = useState<FriendModel>(initial);

  useEffect(() => setModel(initial), [initial]);

  const canSubmit = useMemo(
    () => !!model.firstName && !!model.lastName,
    [model.firstName, model.lastName],
  );

  const update = (patch: Partial<FriendModel>) => setModel({ ...model, ...patch });

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="First name"
          value={model.firstName}
          onChange={(e) => update({ firstName: e.target.value })}
          fullWidth
        />
        <TextField
          label="Last name"
          value={model.lastName}
          onChange={(e) => update({ lastName: e.target.value })}
          fullWidth
        />
      </Stack>
      <DatePicker
        label="Date of birth"
        value={model.dateOfBirth ? dayjs(model.dateOfBirth) : null}
        onChange={(v: Dayjs | null) =>
          update({ dateOfBirth: v ? v.startOf("day").toDate() : null })
        }
      />
      <Box>
        <TextField
          label="Add tag"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val && !model.tags.includes(val)) {
                update({ tags: [...model.tags, val] });
              }
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <Box sx={{ mt: 1 }}>
          {model.tags.map((t) => (
            <Chip
              key={t}
              label={t}
              onDelete={() => update({ tags: model.tags.filter((x) => x !== t) })}
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
      </Box>
      <Box>
        <Button variant="contained" disabled={!canSubmit} onClick={() => onSubmit(model)}>
          {submitLabel}
        </Button>
      </Box>
    </Stack>
  );
}
