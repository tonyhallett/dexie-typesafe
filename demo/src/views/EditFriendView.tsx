import { Stack, Typography } from "@mui/material";
import { useLiveQuery } from "dexie-react-hooks";
import { useNavigate, useParams } from "react-router";
import { friends } from "../db";
import { FriendForm, type FriendModel } from "../widgets/FriendForm";

export function EditFriendView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const friend = useLiveQuery(async () => (id ? friends.get(Number(id)) : undefined), [id]);

  if (!id) return null;
  if (!friend) return <Typography>Loading...</Typography>;

  const initial: FriendModel = {
    firstName: friend.firstName ?? "",
    lastName: friend.lastName ?? "",
    dateOfBirth: friend.dateOfBirth ?? null,
    tags: friend.tags ?? [],
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Edit Friend</Typography>
      <FriendForm
        initial={initial}
        submitLabel="Save"
        onSubmit={async (m) => {
          const dobMonthDay = m.dateOfBirth
            ? String(m.dateOfBirth.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(m.dateOfBirth.getDate()).padStart(2, "0")
            : undefined;
          await friends.put({
            id: Number(id),
            firstName: m.firstName,
            lastName: m.lastName,
            tags: m.tags,
            dateOfBirth: m.dateOfBirth ?? undefined,
            dateOfBirthMonthDay: dobMonthDay,
          });
          navigate("/");
        }}
      />
    </Stack>
  );
}
