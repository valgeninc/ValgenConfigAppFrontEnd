import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Divider } from '@mui/material';
import { addSubscribers, editSubscribers } from '../../services/subscribers';
import { addEditSubscriberSchema } from "../../schemas/index";

const AddEditSubscriber = ({
  open,
  onClose,
  mode,
  subscriberData,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  subscriberData: any;
  onSuccess: (message: string) => void;
}) => {
  const [formData, setFormData] = useState<{
    name: string,
    phone: string,
    email: string,
  }>({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(subscriberData)
  }, [subscriberData])


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));

    validateField(e.target.name, e.target.value);
  };

  const validateField = async (name: any, value: any) => {
    try {
      const partialFormData = { ...formData, [name]: value };
      await addEditSubscriberSchema.validateAt(name, partialFormData);
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    } catch (validationError: any) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: validationError.message }));
    }
  };

  const handleDialogClose = () => {
    setErrors({});
    setFormData({ name: '', email: '', phone: '' });
  };
  const handleSaveUpdate = async (e: any) => {
    e.preventDefault();
    try {
      await addEditSubscriberSchema.validate(formData, { abortEarly: false });
      if (mode === 'add') {
        await addSubscribers(formData).then((response) => {
          if (response?.data.status === 'OK') {
            onSuccess(response.data.result);
          }
        }).catch((error) => {
          console.error(error);
        });

      } else if (mode === 'edit') {
        await editSubscribers(subscriberData.id, formData).then((response) => {
          if (response?.data.status === 'OK') {
            onSuccess(response.data.result);
          }
        });
      }
      onClose();
    } catch (validationErrors: any) {
      const newErrors: { [key: string]: string } = {};
      validationErrors.inner.forEach((error: { path: string | number; message: string; }) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Subscriber Details</DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name || ''}
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email || ''}
        />
        <TextField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          onBlur={(e) => validateField(e.target.name, e.target.value)}
          fullWidth
          margin="normal"
          error={!!errors.phone}
          helperText={errors.phone || ''}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={handleSaveUpdate} variant="contained" color="primary">
          {mode === 'add' ? 'ADD' : 'UPDATE'}
        </Button>
        <Button onClick={() => { onClose(); handleDialogClose(); }} variant="outlined">
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEditSubscriber;
