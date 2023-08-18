import { FC, PropsWithChildren, useState } from "react";
import {
  Box,
  Button,
  Card,
  FormGroup,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useForm } from "react-hook-form";
import { Customer } from "@/types/Customer";

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

export interface AddOrEditCustomerModalProps extends PropsWithChildren {
  icon?: boolean;
  onSubmitHandler: (customer: any) => Promise<void>;
  customer?: Customer | null;
}
export const AddOrEditCustomerModal: FC<AddOrEditCustomerModalProps> = ({
  onSubmitHandler,
  icon = false,
  children,
  customer = null,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const onSubmit = async (data: Partial<Customer>) => {
    try {
      setLoading(true);
      await onSubmitHandler(data);
      setOpen(false);
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const { register, handleSubmit, formState } = useForm<Customer>({
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
    },
  });
  return (
    <>
      {icon ? (
        <IconButton color="primary" onClick={() => setOpen(!open)}>
          {children}
        </IconButton>
      ) : (
        <Button
          startIcon={<Add />}
          variant="contained"
          data-testid="customer-list-add-customer__add-button"
          onClick={() => setOpen(!open)}
        >
          {children}
        </Button>
      )}
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
                  minLength: {
                    value: 5,
                    message: "Name must be at least 5 characters long",
                  },
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
              loading={loading}
              role="button"
              color={error ? "error" : "primary"}
              onClick={handleSubmit(onSubmit)}
            >
              Save Customer
            </LoadingButton>
            {error && (
              <Typography color="error" variant="body2">
                {error.message}
              </Typography>
            )}
          </FormGroup>
        </Card>
      </Modal>
    </>
  );
};
