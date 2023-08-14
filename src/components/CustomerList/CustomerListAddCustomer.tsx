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
import { Customer } from "@/types/Customer";
import { LoadingButton } from "@mui/lab";
import { Add } from "@mui/icons-material";

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

interface CustomerListAddCustomerProps {
  customerAdd: (data: Customer) => Promise<void>;
  customerAddLoading: boolean;
  customerAddError: Error | null;
}
export const CustomerListAddCustomer: React.FC<
  CustomerListAddCustomerProps
> = ({ customerAdd, customerAddLoading, customerAddError }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { register, handleSubmit, formState } = useForm<Customer>();
  const onSubmit = async (data: Customer) => {
    await customerAdd(data);
    setOpen(false);
  };

  return (
    <>
      <Button
        startIcon={<Add />}
        variant="contained"
        data-testid="customer-list-add-customer__add-button"
        onClick={() => setOpen(!open)}
      >
        Add Customer
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Card style={style as unknown as any}>
          <Box sx={{ marginBottom: "16px" }}>
            <Typography variant="h6">Add Customer</Typography>
          </Box>
          <FormGroup>
            <Box
              sx={{ marginBottom: "16px" }}
              display="flex"
              flexDirection="column"
              gap="16px"
            >
              <TextField
                label="Name"
                error={Boolean(formState.errors.name)}
                helperText={formState.errors.name?.message as string}
                {...register("name", {
                  required: { value: true, message: "Name required" },
                  minLength: 5,
                })}
              />
              <TextField
                label="Email"
                error={Boolean(formState.errors.email)}
                helperText={formState.errors.email?.message as string}
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
                helperText={formState.errors.phone?.message as string}
                {...register("phone", {
                  required: { value: true, message: "Phone number required" },
                })}
              />
            </Box>
            <LoadingButton
              loading={customerAddLoading}
              role="button"
              color={customerAddError ? "error" : "primary"}
              onClick={handleSubmit(onSubmit)}
            >
              Save Customer
            </LoadingButton>
          </FormGroup>
        </Card>
      </Modal>
    </>
  );
};
