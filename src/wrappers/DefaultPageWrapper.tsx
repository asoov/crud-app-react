import { ReactNode } from "react";
import { MenuBar } from "../components/MenuBar";
import { Box } from "@mui/material";

export const DefaultPageWrapper: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div>
      <Box sx={{ marginBottom: "32px" }}>
        <MenuBar />
      </Box>
      {children}
    </div>
  );
};
