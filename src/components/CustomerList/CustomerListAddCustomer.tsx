import {
  Box,
  Button,
  Card,
  FormGroup,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

const style = {
  position: "absolute",
  padding: "16px 32px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface FormData {
  name: string;
  email: string;
  phone: string;
}
export const CustomerListAddCustomer: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { register, handleSubmit, formState } = useForm();
  const onSubmit = (data: FormData) => console.log(data);
  return (
    <>
      <Button onClick={() => setOpen(!open)}>Add Customer</Button>
      <Modal open={true} onClose={() => setOpen(false)}>
        <Card style={style}>
          <Box sx={{ marginBottom: "16px" }}>
            <Typography variant="h5">Add Customer</Typography>
          </Box>
          <FormGroup onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{ marginBottom: "16px" }}
              display="flex"
              flexDirection="column"
              gap="16px"
            >
              <TextField
                label="Name"
                error={Boolean(formState.errors.name)}
                helperText={formState.errors.name?.message}
                {...register("name", {
                  required: { value: true, message: "Name required" },
                  minLength: 5,
                })}
              />
              <TextField
                label="Email"
                error={Boolean(formState.errors.email)}
                helperText={formState.errors.email?.message}
                {...register("email", {
                  required: { value: true, message: "Email required" },
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format",
                  },
                })}
              />
              <TextField
                label="Phone"
                error={Boolean(formState.errors.phone)}
                helperText={formState.errors.phone?.message}
                {...register("phone", {
                  required: { value: true, message: "Phone number required" },
                })}
              />
            </Box>
            <Button onClick={handleSubmit(onSubmit)}>Add Customer</Button>
          </FormGroup>
        </Card>
      </Modal>
    </>
  );
};
