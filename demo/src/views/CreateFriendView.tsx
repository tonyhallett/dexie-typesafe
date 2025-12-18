import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { friends } from "../db";
import { FriendForm, type FriendModel } from "../widgets/FriendForm";

export function CreateFriendView() {
  const navigate = useNavigate();
  const initial: FriendModel = { firstName: "", lastName: "", dateOfBirth: null, tags: [] };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create Friend</Typography>
      <FriendForm
        initial={initial}
        submitLabel="Add"
        onSubmit={async (m) => {
          const dobMonthDay = m.dateOfBirth
            ? String(m.dateOfBirth.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(m.dateOfBirth.getDate()).padStart(2, "0")
            : undefined;
          await friends.add({
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
