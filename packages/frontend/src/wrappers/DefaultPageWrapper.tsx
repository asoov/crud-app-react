import { ReactNode } from "react";
import { MenuBar } from "@/components/MenuBar";
import { Box } from "@mui/material";

export const DefaultPageWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <Box margin="8px">
      <Box sx={{ marginBottom: "32px" }}>
        <MenuBar />
      </Box>
      {children}
    </Box>
  );
};
