import { FC } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Home: FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/customers");
  };
  return (
    <Box display="flex" justifyContent="center" flexDirection="column" gap={2}>
      <Typography color="black" align="center">
        This is a typical React CRUD application
      </Typography>
      <Button color="primary" variant="outlined" onClick={handleClick}>
        Start!
      </Button>
    </Box>
  );
};
