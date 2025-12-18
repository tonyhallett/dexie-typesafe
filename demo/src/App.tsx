import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  CssBaseline,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Outlet, useLocation, useNavigate } from "react-router";
import { FiltersProvider } from "./state/FiltersContext";

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const value = location.pathname.startsWith("/create") ? 1 : 0;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FiltersProvider>
        <CssBaseline />
        <Container maxWidth="md" sx={{ pb: 8, pt: 2 }}>
          <Outlet />
        </Container>
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(_, newValue) => {
              navigate(newValue === 0 ? "/" : "/create");
            }}
          >
            <BottomNavigationAction label="Home" icon={<PeopleIcon />} />
            <BottomNavigationAction label="Create" icon={<AddIcon />} />
          </BottomNavigation>
        </Paper>
      </FiltersProvider>
    </LocalizationProvider>
  );
}
