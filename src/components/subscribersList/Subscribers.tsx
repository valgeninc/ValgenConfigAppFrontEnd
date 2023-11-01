import React, { useEffect, useState } from 'react'
import "./Subscribers.css";
import { Link } from 'react-router-dom';
import { getSubscribers } from '../../services/subscribers';
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Tooltip, Box, Typography, Divider, Stack, Grid, Alert
} from '@mui/material';
import AddCardIcon from '@mui/icons-material/AddCard';
import Sidenav from '../sidenav/Sidenav';
import Navbar from '../navbar/Navbar';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import Snackbar from '@mui/material/Snackbar';
import { Oval } from 'react-loader-spinner';
import AddEditSubscriber from './AddEditSubscriber';
const initialValue = {
  name: '',
  email: '',
  phone: ''
}
const Subscribers = () => {
  const [subscriberList, setSubscriberList] = useState<any>([]);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [subscriberData, setSubscriberData] = useState(initialValue);
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getAllUsers();
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    }
  }, []);

  const getAllUsers = async () => {
    setLoading(true);
    await getSubscribers().then((response) => {
      setSubscriberList(response);
    }).catch((error) => {
      console.error(error);
    });
    setLoading(false);
  }

  const handleAddDialogOpen = () => {
    setMode('add');
    setDialogOpen(true);
    setSubscriberData(initialValue);
  };


  const handleCloseSnackbar = () => {
    setIsSnackbar(false);
  };

  const handleEditSubscriber = (subscriber: any) => {
    setMode('edit');
    setSubscriberData(subscriber);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const onSuccess = (message: string) => {
    setIsSnackbar(true);
    setMessage(message);
    setSeverity('success');
    getAllUsers();
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
                        {loading ? (
                          <TableRow>
                            <TableCell align="center" sx={{ fontSize: 20, padding: 10 }} colSpan={4}>
                              <div className="loading"><Oval
                                height={40}
                                width={40}
                                color="#59bdd2 "
                                visible={true}
                                ariaLabel='oval-loading'
                                secondaryColor="#59bdd2 "
                                strokeWidth={2}
                                strokeWidthSecondary={2}
                              /></div>
                            </TableCell>
                          </TableRow>
                        ) : (subscriberList && subscriberList.length > 0 ? (subscriberList.map((subscriber: { id: string, name: string, email: string, phone: string }) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={subscriber.id}>
                              <TableCell align="left" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subscriber.name}</TableCell>
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
                                      <AddCardIcon />
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
                        </TableRow>))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Box>
            </Box>
          </div>
        </div>
      </div>
      <Snackbar open={isSnackbar} autoHideDuration={1000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
      <AddEditSubscriber
        open={isDialogOpen}
        onClose={handleDialogClose}
        mode={mode}
        subscriberData={subscriberData}
        onSuccess={onSuccess}
      />
    </>
  )
}

export default Subscribers;