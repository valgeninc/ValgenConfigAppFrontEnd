import { useEffect, useState } from 'react'
import "./Subscribers.css";
import { Link } from 'react-router-dom';
import { getSubscribers, editSubscribers, addSubscribers } from '../../services/subscribers';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Tooltip, Box, Typography, Divider, Stack
} from '@mui/material';
import Sidenav from '../sidenav/Sidenav';
import Navbar from '../navbar/Navbar';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';

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
    setSubscriberData({ name: '', email: '', phone: '' });
    
    setDialogOpen(false);
  };
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setSubscriberData({ ...subscriberData, [name]: value });

  };
  const handleSaveUpdate = () => {
    debugger
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

  const addSubscriber = async () => {
    const response = addSubscribers(subscriberData);
    setSubscriberList([...subscriberList, (await response).data])
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
      errors.name = 'Name is required.';
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
        <Box height={70} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <div className='subscribers'>
              <div className='subscribers-table'>
                {subscriberList.length > 0 && (
                  <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ padding: "20px" }}
                    >
                      Subscriber List
                    </Typography>
                    <Divider />
                    <Box height={10} />
                    <Stack direction="row" spacing={2} className="my-2 mb-2">
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      ></Typography>
                      <Tooltip title="Add Subscriber">
                        <Button onClick={handleAddDialogOpen} variant="contained" endIcon={<AddCircleIcon />}>
                          Add
                        </Button>
                      </Tooltip>
                    </Stack>
                    <Box height={10} />
                    <TableContainer sx={{ maxHeight: 440 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow sx={{ fontWeight: "bold" }}>
                            <TableCell align="left" style={{ minWidth: "100px" }}>
                              Name
                            </TableCell>
                            <TableCell align="left" style={{ minWidth: "100px" }}>
                              Email
                            </TableCell>
                            <TableCell align="left" style={{ minWidth: "100px" }}>
                              Phone
                            </TableCell>
                            <TableCell align="left" style={{ minWidth: "100px" }}>
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subscriberList.map((subscriber: { id: string, userName: string, email: string, phone: string }) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={subscriber.id}>
                                <TableCell align="left">{subscriber.userName}</TableCell>
                                <TableCell align="left">{subscriber.email}</TableCell>
                                <TableCell align="left">{subscriber.phone}</TableCell>
                                <TableCell align="left">
                                  <Stack spacing={2} direction="row">
                                    <Tooltip title="Edit Subscribers">
                                      <EditIcon
                                        style={{
                                          fontSize: "20px",
                                          color: "blue",
                                          cursor: "pointer",
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
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                )}
              </div>
            </div>
          </Box>
        </Box>
      </div>


      {/* Dialog for adding a new subscriber */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Subscriber Details</DialogTitle>
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
        <DialogActions>

          <Button onClick={handleSaveUpdate} variant="contained" color="primary">
            {mode === 'add' ? 'SAVE' : 'UPDATE'}
          </Button>
          <Button onClick={handleDialogClose} variant="outlined" color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Subscribers