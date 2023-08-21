import React, { useEffect, useState } from 'react'
import "./Subscribers.css";
import { Link } from 'react-router-dom';
import { getSubscribers, editSubscribers, addSubscribers } from '../../services/subscribers';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Tooltip, Box, Typography, Divider, Stack, Grid
} from '@mui/material';
import Sidenav from '../sidenav/Sidenav';
import Navbar from '../navbar/Navbar';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
const initialValue = {
  name: '',
  email: '',
  phone: ''
}
const isValidEmail = (email: string): boolean => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};
interface ValidationErrors {
  name: string;
  email: string;
  phone: string;
  [key: string]: string;
}

const Subscribers = () => {
  const [subscriberList, setSubscriberList] = useState<any>([]);
  const [mode, setMode] = useState('add');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [subscriberData, setSubscriberData] = useState(initialValue);
  const [subscriberId, setSubscriberId] = useState('');
  const [snackbar, setSnackbar] = React.useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: '',
    email: '',
    phone: '',
  });


  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    let response = await getSubscribers();
    setSubscriberList(response);
  }

  const handleAddDialogOpen = () => {
    setMode('add');
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setValidationErrors({ name: '', email: '', phone: '' })
    setSubscriberData({ name: '', email: '', phone: '' });

    setDialogOpen(false);
  };
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setSubscriberData({ ...subscriberData, [name]: value });

  };
  const handleSaveUpdate = () => {
    const isValid = validateFields();
    if (isValid) {
      if (mode === 'add') {
        addSubscriber();
      } else if (mode === 'edit') {
        editSubscriber();
      }
      handleDialogClose();
    }

  };
  const handleCloseSnackbar = () => {
    setSnackbar(false);
  }

  const addSubscriber = async () => {
    addSubscribers(subscriberData);
    // <Snackbar
    //   autoHideDuration={4000}
    //   anchorOrigin={{ vertical, horizontal }}
    //   open={snackbar}
    //   onClose={handleCloseSnackbar}
    //   message="Subscriber Added Successfully!"
    //   key={vertical + horizontal}
    // />
    getAllUsers();
    setSubscriberData({ name: '', email: '', phone: '' });
    setDialogOpen(false);
  };

  const handleEditSubscriber = (subscriber: any) => {
    setMode('edit');
    setSubscriberId(subscriber.id);
    setSubscriberData(subscriber);
    setDialogOpen(true);
  }
  const editSubscriber = async () => {
    editSubscribers(subscriberId, subscriberData);
    getAllUsers();
  }
  const validateFields = (): boolean => {
    const errors: ValidationErrors = {
      name: '',
      email: '',
      phone: ''
    };

    if (!subscriberData.name) {
      errors.name = 'name is required.';
    }

    if (!subscriberData.email) {
      errors.email = 'Email is required.';
    } else if (!isValidEmail(subscriberData.email)) {
      errors.email = 'Invalid email format.';
    }

    if (!subscriberData.phone) {
      errors.phone = 'Phone is required.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).every(field => !errors[field]);
  };

  return (
    <>
      <div className='bgcolor'>
        <Navbar />
        <div className="subscribers">
          <Box height={70} />
          <div className="subscribers-table">
            <Box sx={{ display: 'flex' }}>
              <Sidenav />
              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ padding: "20px" }}
                    >
                      Subscriber List
                    </Typography>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ padding: "20px" }}
                    >
                      <Tooltip title="Add Subscriber">
                        <Button className='btn' onClick={handleAddDialogOpen} variant="contained" endIcon={<AddCircleIcon />}>
                          Add
                        </Button>
                      </Tooltip>
                    </Typography>
                  </Grid>
                  <Divider />
                  <TableContainer sx={{ maxHeight: 440 }} className="subscribers-table">
                    <Table stickyHeader aria-label="sticky table" >
                      <TableHead>
                        <TableRow >
                          <TableCell align="left" style={{ minWidth: "100px", fontWeight: 'bold' }}>
                            Name
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: "100px", fontWeight: 'bold' }}>
                            Email
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: "100px", fontWeight: 'bold' }}>
                            Phone
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: "100px", fontWeight: 'bold' }}>
                            Subscriber Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className='subscribers'>
                        {subscriberList.length > 0 ? (subscriberList.map((subscriber: { id: string, name: string, email: string, phone: string }) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={subscriber.id}>
                              <TableCell align="left">{subscriber.name}</TableCell>
                              <TableCell align="left">{subscriber.email}</TableCell>
                              <TableCell align="left">{subscriber.phone}</TableCell>
                              <TableCell  >
                                <Stack spacing={2} direction="row">
                                  <Tooltip title="Edit Subscribers">
                                    <EditIcon
                                      style={{
                                        fontSize: "20px",
                                        color: "blue",
                                        cursor: "pointer",
                                        marginLeft: 30
                                      }}
                                      className="cursor-pointer"
                                      onClick={() => handleEditSubscriber(subscriber)}
                                    />
                                  </Tooltip>
                                  <Tooltip title="View Subscriptions">
                                    <Link to={`/subscribers/${subscriber.id}/subscriptions`}>
                                      <VisibilityIcon
                                        style={{
                                          fontSize: "20px",
                                          color: "darkred",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </Link>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          );
                        })) : (<TableRow>
                          <TableCell align="center" sx={{ fontSize: 20, padding: 10 }} colSpan={4}>
                            No Subscribers Found
                          </TableCell>
                        </TableRow>)}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            </Box>
          </div>
        </div>
      </div>


      {/* Dialog for adding a new subscriber */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Subscriber Details</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={subscriberData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(validationErrors.name)}
            helperText={validationErrors.name}
          />
          <TextField
            label="Email"
            name="email"
            value={subscriberData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(validationErrors.email)}
            helperText={validationErrors.email}
          />
          <TextField
            label="Phone"
            name="phone"
            value={subscriberData.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(validationErrors.phone)}
            helperText={validationErrors.phone}
          />
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button onClick={handleSaveUpdate} variant="contained" color="primary">
            {mode === 'add' ? 'ADD' : 'UPDATE'}
          </Button>
          <Button onClick={handleDialogClose} variant="outlined" >
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Subscribers