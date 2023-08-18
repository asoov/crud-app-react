import { Box, CircularProgress, Typography } from "@mui/material";
import { FC } from "react";

export const CustomerListLoading: FC = () => (
  <Box display="flex" justifyContent="center">
    <Box>
      <Box sx={{ marginBottom: "8px" }}>
        <Typography color="black">Data is being loaded...</Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    </Box>
  </Box>
);
