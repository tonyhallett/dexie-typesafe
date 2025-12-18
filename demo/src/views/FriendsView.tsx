import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { friends } from "../db";
import { useFilters } from "../state/FiltersContext";
import { ConfirmDialog } from "../widgets/ConfirmDialog";
import { FriendFilters } from "../widgets/FriendFilters";

export function FriendsView() {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);

  const startOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  const endOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(23, 59, 59, 999);
    return copy;
  };

  const query = useMemo(() => {
    // Pick an indexed starting point using equality aliases when possible.
    if (filters.firstName.value && filters.firstName.mode === "exact") {
      return friends.whereSingleEquality({ firstName: filters.firstName.value });
    }
    if (filters.lastName.value && filters.lastName.mode === "exact") {
      return friends.whereSingleEquality({ lastName: filters.lastName.value });
    }
    if (filters.firstName.value && filters.firstName.mode === "startsWith") {
      return friends.where("firstName").startsWith(filters.firstName.value);
    }
    if (filters.lastName.value && filters.lastName.mode === "startsWith") {
      return friends.where("lastName").startsWith(filters.lastName.value);
    }
    if (filters.dayOfYear) {
      return friends.whereSingleEquality({ dateOfBirthMonthDay: filters.dayOfYear });
    }
    if (filters.onDate) {
      return friends
        .where("dateOfBirth")
        .between(startOfDay(filters.onDate), endOfDay(filters.onDate));
    }
    if (filters.afterDate) {
      return friends.where("dateOfBirth").aboveOrEqual(startOfDay(filters.afterDate));
    }
    if (filters.beforeDate) {
      return friends.where("dateOfBirth").belowOrEqual(endOfDay(filters.beforeDate));
    }
    if (filters.tagsAnyOf.length) {
      return friends.where("tags").anyOf(filters.tagsAnyOf).distinct();
    }
    return friends.toCollection();
  }, [filters]);

  const items = useLiveQuery(async () => {
    // Apply remaining filters client-side to keep it simple for the demo.
    const list = await query.toArray();
    return list.filter((f) => {
      if (filters.firstName.value) {
        if (filters.firstName.mode === "exact" && f.firstName !== filters.firstName.value)
          return false;
        if (
          filters.firstName.mode === "startsWith" &&
          !f.firstName?.toLowerCase().startsWith(filters.firstName.value.toLowerCase())
        )
          return false;
      }
      if (filters.lastName.value) {
        if (filters.lastName.mode === "exact" && f.lastName !== filters.lastName.value)
          return false;
        if (
          filters.lastName.mode === "startsWith" &&
          !f.lastName?.toLowerCase().startsWith(filters.lastName.value.toLowerCase())
        )
          return false;
      }
      if (filters.tagsAnyOf.length) {
        if (!f.tags?.some((t) => filters.tagsAnyOf.includes(t))) return false;
      }
      if (filters.onDate) {
        const d = f.dateOfBirth ? dayjs(f.dateOfBirth) : null;
        if (!d) return false;
        if (!d.isSame(dayjs(filters.onDate), "day")) return false;
      }
      if (filters.beforeDate) {
        const d = f.dateOfBirth ? dayjs(f.dateOfBirth) : null;
        if (!d) return false;
        if (!d.isBefore(dayjs(filters.beforeDate).endOf("day"))) return false;
      }
      if (filters.afterDate) {
        const d = f.dateOfBirth ? dayjs(f.dateOfBirth) : null;
        if (!d) return false;
        if (!d.isAfter(dayjs(filters.afterDate).startOf("day"))) return false;
      }
      if (filters.dayOfYear) {
        const mmdd = f.dateOfBirth
          ? String(f.dateOfBirth.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(f.dateOfBirth.getDate()).padStart(2, "0")
          : undefined;
        if (mmdd !== filters.dayOfYear) return false;
      }
      return true;
    });
  }, [query, filters]);

  const onDelete = async (id: number) => {
    await friends.delete(id);
  };

  const onDeleteFiltered = async () => {
    if (!items?.length) return;
    await friends.bulkDelete(items.map((i) => i.id));
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Friends</Typography>
      <FriendFilters />
      <Divider />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Results ({items?.length ?? 0})</Typography>
        <Button
          color="error"
          variant="outlined"
          disabled={!items?.length}
          onClick={() => setConfirmAllOpen(true)}
        >
          Delete filtered
        </Button>
      </Stack>
      <List>
        {items?.map((f) => (
          <ListItem key={f.id} divider>
            <ListItemText
              primary={`${f.firstName} ${f.lastName}`}
              secondary={
                <Box>
                  {f.dateOfBirth && (
                    <Typography component="span" variant="body2" sx={{ mr: 1 }}>
                      DOB: {dayjs(f.dateOfBirth).format("YYYY-MM-DD")}
                    </Typography>
                  )}
                  {f.tags?.map((t) => (
                    <Chip key={t} size="small" label={t} sx={{ mr: 0.5 }} />
                  ))}
                </Box>
              }
              secondaryTypographyProps={{ component: "div" }}
            />
            <ListItemSecondaryAction>
              <IconButton aria-label="edit" onClick={() => navigate(`/edit/${f.id}`)}>
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => {
                  setToDeleteId(f.id);
                  setConfirmOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete friend?"
        description="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          if (toDeleteId != null) {
            await onDelete(toDeleteId);
            setToDeleteId(null);
          }
        }}
      />

      <ConfirmDialog
        open={confirmAllOpen}
        title="Delete all filtered?"
        description="This will delete all currently filtered friends."
        onCancel={() => setConfirmAllOpen(false)}
        onConfirm={async () => {
          setConfirmAllOpen(false);
          await onDeleteFiltered();
        }}
      />
    </Stack>
  );
}
