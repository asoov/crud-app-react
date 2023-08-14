import { FC } from "react";
import { Box, Typography } from "@mui/material";

export const CustomerListError: FC = () => (
  <Box display="flex" justifyContent="center">
    <Typography color="black">Failed to load customers :/</Typography>
  </Box>
);
