import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Divider, Stack, Dialog, DialogContent, TextField, DialogActions, Grid, Autocomplete, Checkbox, DialogTitle, Switch, AppBar, Toolbar, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Sidenav from '../sidenav/Sidenav';
import Navbar from '../navbar/Navbar';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "./subscription.css"
import CloseIcon from '@mui/icons-material/Close';
import { subscriberResultData } from "../../SubscriberData";
import Subscribers from '../subscribersList/Subscribers';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const dayjs = require('dayjs');
const initialValue: SubscriptionData = {
  subscriberId: '',
  startDate: '',
  endDate: "",
  maxRequests: undefined,
  timeWindow: undefined,
  createSubscriptionServicesModel: [
    {
      endPointDesc: "",
      companyRecords: undefined,
      locationRecords: undefined,
      addtionalCompanyRecords: undefined,
      addtionalLocationRecords: undefined,
      columns: []
    },
    {
      endPointDesc: "",
      companyRecords: undefined,
      locationRecords: undefined,
      addtionalCompanyRecords: undefined,
      addtionalLocationRecords: undefined,
      columns: []
    },
  ]
}
interface FilmOption {
  title: string;
  year: number;
}
interface SubscriptionData {
  subscriberId: string;
  startDate: string;
  endDate: string;
  maxRequests: number | undefined;
  timeWindow: number | undefined;
  createSubscriptionServicesModel: ServiceModel[];
}
interface ServiceModel {
  endPointDesc: string;
  companyRecords: number | undefined;
  locationRecords: number | undefined;
  addtionalCompanyRecords: number | undefined;
  addtionalLocationRecords: number | undefined;
  columns: FilmOption[];
}

const SubscriptionList = () => {
  const { subscriberId } = useParams();
  const [subscriptionList, setsubscriptionList] = useState<any>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(initialValue);
  const [mode, setMode] = useState('add');
  const navigate = useNavigate();
  const [isAnoymizedAdditionalPull, setIsAnoymizedAdditionalPull] = useState(false);
  const [isIdentifiedAdditionalPull, setIsIdentifiedAdditionalPull] = useState(false);
  const [isSubscriptionStatus, setIsSubscriptionStatus] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3030/result/${subscriberId}`)
      .then(response => {
        setsubscriptionList(response.data.subscriptions);
      })
      .catch(err => console.log(err))
    console.log(subscriptionData.createSubscriptionServicesModel);
    // subscriberResultData.forEach((subscriber:any) => {
    //   if(subscriber.id === subscriberId ){
    //     setsubscriptionList(subscriber.subscriptions);
    //     console.log(subscriber.subscriptions);
    //   }
    // });
  }, [subscriberId, subscriptionData.createSubscriptionServicesModel]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSubscriptionData(initialValue);
  };
  const handleAddDialogOpen = () => {
    setMode('add');
    setDialogOpen(true);
  };
  const handleEditDialogOpen = () => {
    setMode('edit');
    setDialogOpen(true);
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setSubscriptionData((prevData) => ({
      ...prevData,
      [name]: value
    }));

  };
  const handleServiceModelInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    fieldName: string,
  ) => {
    const newValue = parseFloat(event.target.value);
    setSubscriptionData((prevData) => {
      const newServiceModel: any = { ...prevData.createSubscriptionServicesModel[index] };
      newServiceModel[fieldName] = newValue;
      const updatedServiceModels = [...prevData.createSubscriptionServicesModel];
      updatedServiceModels[index] = newServiceModel;

      return {
        ...prevData,
        createSubscriptionServicesModel: updatedServiceModels
      };
    });
  };
  const addSubscription = () => {
    const payload = {
      subscriberId: subscriptionData.subscriberId,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      maxRequests: (subscriptionData.maxRequests),
      timeWindow: (subscriptionData.timeWindow),
      createSubscriptionServicesModel: subscriptionData.createSubscriptionServicesModel.map((model) => ({
        endPointDesc: model.endPointDesc,
        companyRecords: (model.companyRecords),
        locationRecords: (model.locationRecords),
        addtionalCompanyRecords: (model.addtionalCompanyRecords),
        addtionalLocationRecords: (model.addtionalLocationRecords),
        columns: model.columns
      }))
    };

    console.log(payload);
  }
  const editSubscriber = () => {

  }
  const handleSaveUpdate = () => {
    // const isValid = validateFields();
    // if (isValid) {
    if (mode === 'add') {
      addSubscription();
    } else if (mode === 'edit') {
      editSubscriber();
    }
    handleDialogClose();
    // }

  };
  const handleChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubscriptionStatus(true);
  }
  const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
  ];
  return (
    <>
      <div className='bgcolor'>
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Tooltip title="Back to Subscribers">
              <Button sx={{ marginBottom: 1 }} variant="text" onClick={() => navigate("/subscribers")} startIcon={<ArrowBackIcon />}>
                Back
              </Button>
            </Tooltip>
            <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                >
                  Subscriptions List
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ padding: "20px" }}
                >
                  <Tooltip title="Add Subscription">
                    <Button variant="contained" onClick={handleAddDialogOpen} className='btn' endIcon={<AddCircleIcon />}>
                      Add
                    </Button>
                  </Tooltip>
                </Typography>
              </Grid>
              <Divider />
              <Box height={10} />
              <Stack direction="row" spacing={2} className="my-2 mb-2">
              </Stack>
              <Box height={10} />
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow sx={{ fontWeight: "bold" }}>
                      <TableCell align="center" style={{ minWidth: "100px", fontWeight: 'bold' }}>
                        Start Date
                      </TableCell>
                      <TableCell align="center" style={{ minWidth: "100px", fontWeight: 'bold' }}>
                        End Date
                      </TableCell>
                      <TableCell align="center" style={{ minWidth: "100px", fontWeight: 'bold' }}>
                        Token
                      </TableCell>
                      <TableCell align="center" style={{ minWidth: "80px", fontWeight: 'bold' }}>
                        Subscription Status
                      </TableCell>
                      <TableCell align="center" style={{ minWidth: "100px", fontWeight: 'bold' }}>
                        Subscription Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {subscriptionList && subscriptionList.length > 0 ? subscriptionList.map((subscription: { max_records: number, time_seconds: number, start_time: string, end_time: string, token: string, isActive: boolean }) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={subscription.token}>
                          <TableCell align="center">{dayjs(subscription.start_time).format('DD-MM-YYYY')}</TableCell>
                          <TableCell align="center">{dayjs(subscription.end_time).format('DD-MM-YYYY')}</TableCell>
                          <TableCell align="center">{subscription.token}</TableCell>

                          {/* {subscription.isActive ? (
                            <TableCell align="center"> <Typography variant="subtitle1" className='status active-status' >Active</Typography> </TableCell>
                          ) : (
                            <TableCell align="left"><Typography variant="subtitle1" className='status inactive-status' >Inactive</Typography></TableCell>
                          )} */}
                          <TableCell align="center">
                            <Switch
                              checked={subscription.isActive}
                              onChange={handleChangeStatus}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          </TableCell>
                          <TableCell align="center" >
                            <Tooltip title="Edit subscription">
                              <EditIcon
                                style={{
                                  fontSize: "20px",
                                  color: "blue",
                                  cursor: "pointer",
                                }}
                                onClick={handleEditDialogOpen}
                                className="cursor-pointer"
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    }) : (<TableRow>
                      <TableCell align="center" sx={{ fontSize: 20, padding: 10 }} colSpan={6}>
                        No Subscriptions Found
                      </TableCell>
                    </TableRow>)}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

          </Box>
        </Box>
      </div>
      {/* Dialog for adding a new Subscription */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        // maxWidth="md"
        // PaperProps={{ style: { maxHeight: '95vh', minWidth: '600px' } }}
        fullScreen
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Subscription Details
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDialogClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {/* <DialogTitle>Subscription Details</DialogTitle> */}
        <Divider></Divider>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', fontSize: 21, marginBottom: 2 }}>Global Configuration</Typography>
          <Box className="configuration">
            <Grid container >
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center" >
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }} >Max No. of Records</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      type={"number"}
                      name="maxRequests"
                      value={subscriptionData.maxRequests}
                      onChange={handleInputChange}
                      size="small"
                      margin="normal"
                    />
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6} >
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start', marginLeft: 5 }}>Time in Seconds</Typography>
                  </Grid>
                  <Grid item xs={6}  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TextField
                        type={"number"}
                        name="timeWindow"
                        value={subscriptionData.timeWindow}
                        onChange={handleInputChange}
                        size="small"
                        margin="normal"
                      />
                    </LocalizationProvider>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }}>Start Date</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker label="Pick start date"
                        // value={subscriptionData.startDate}
                        onChange={(value: any) => {
                          setSubscriptionData((prevData) => ({
                            ...prevData,
                            startDate: value,
                          }));
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start', marginLeft: 5 }}>End Date</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker label="Pick end date"
                        // value={subscriptionData.endDate}
                        onChange={(value: any) => {
                          setSubscriptionData((prevData) => ({
                            ...prevData,
                            endDate: value,
                          }));
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Typography sx={{ textAlign: 'center', fontSize: 21, margin: 2 }}>Api Configuration</Typography>
          <Box className="configuration">
            <Typography variant="subtitle1" sx={{ textAlign: 'start', fontWeight: '500', marginBottom: 2 }} >Anoymized Details:</Typography>
            <Grid container >
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }} >Columns</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Autocomplete
                      multiple
                      id="checkboxes-tags-demo"
                      options={top100Films}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.title}
                      // onChange={(event, newValue: any) => {
                      //   setSubscriptionData((prevData) => ({
                      //     ...prevData,
                      //     createSubscriptionServicesModel: [
                      //       {
                      //         ...prevData.createSubscriptionServicesModel[0],
                      //         columns: newValue
                      //       },
                      //       ...prevData.createSubscriptionServicesModel.slice(1) // Keep other items as they are
                      //     ]
                      //   }));
                      // }}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.title}
                        </li>
                      )}
                      style={{ width: 500 }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select" />
                      )}
                    />
                  </Grid>
                </Stack>

              </Grid>
              <Grid item xs={10}>

              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }}>Company Records Limit</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      type={"number"}
                      value={subscriptionData.createSubscriptionServicesModel[0].companyRecords}
                      onChange={(event) => handleServiceModelInputChange(event, 0, 'companyRecords')}
                      name="companyRecords"
                      size="small"
                      margin="normal"
                    />
                  </Grid>

                </Stack>

              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start', marginLeft: 4 }}>Location Records Limit</Typography>
                  </Grid>
                  <Grid item xs={3} sx={{ marginRight: 2 }}>
                    <TextField
                      value={subscriptionData.createSubscriptionServicesModel[0].locationRecords}
                      onChange={handleInputChange}
                      type={"number"}
                      name="locationRecords"
                      size="small"
                      margin="normal"
                    />
                  </Grid>
                  <Tooltip title="Add Additional Pull">
                    <Button onClick={() => { setIsAnoymizedAdditionalPull(true) }} endIcon={<AddCircleIcon />}>
                    </Button>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
            <Typography variant="subtitle1" sx={{ textAlign: 'start', fontWeight: '500', marginBottom: 2, marginTop: 4 }} >Identified Api Details:</Typography>
            <Grid container >
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }} >Columns</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      multiple
                      id="checkboxes-tags-demo"
                      options={top100Films}
                      disableCloseOnSelect
                      getOptionLabel={(option) => option.title}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.title}
                        </li>
                      )}
                      style={{ width: 500 }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Select" />
                      )}
                    />
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6}>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }}>Company Records Limit</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      type={"number"}
                      value={subscriptionData.createSubscriptionServicesModel[1].companyRecords}
                      onChange={handleInputChange}
                      name="companyRecords"
                      size="small"
                      margin="normal"
                    />
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start', marginLeft: 4 }}>Location Records Limit</Typography>
                  </Grid>
                  <Grid item xs={3} sx={{ marginRight: 2 }}>
                    <TextField
                      type={"number"}
                      name="locationRecords"
                      value={subscriptionData.createSubscriptionServicesModel[1].locationRecords}
                      onChange={handleInputChange}
                      size="small"
                      margin="normal"
                    />
                  </Grid>
                  <Tooltip title="Add Additional Pull">
                    <Button onClick={() => { setIsIdentifiedAdditionalPull(true) }} endIcon={<AddCircleIcon />}>
                    </Button>
                  </Tooltip>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSaveUpdate}>
            {mode === 'add' ? 'ADD' : 'UPDATE'}
          </Button>
          <Button onClick={handleDialogClose} variant="outlined" color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>


      {/* Modal Window for Additional pull */}
      <Dialog open={isAnoymizedAdditionalPull || isIdentifiedAdditionalPull} onClose={handleDialogClose}>
        <DialogTitle>Additional Pull</DialogTitle>
        <DialogContent>
          <Grid container >
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ textAlign: 'start', marginTop: 1 }}>Company Records</Typography>
                </Grid>
                <Grid item xs={4} sx={{ marginLeft: 1 }}>
                  <TextField
                    type={"number"}
                    name="addtionalCompanyRecords"
                    value={subscriptionData.createSubscriptionServicesModel[0].addtionalCompanyRecords}
                    onChange={handleInputChange}
                    size="small"
                    margin="normal"
                  />
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack direction="row" alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle1" sx={{ textAlign: 'start', marginTop: 1 }}>Location Records</Typography>
                </Grid>
                <Grid item xs={4} sx={{ marginLeft: 1 }}>
                  <TextField
                    type={"number"}
                    value={subscriptionData.createSubscriptionServicesModel[0].addtionalLocationRecords}
                    onChange={handleInputChange}
                    name="addtionalLocationRecords"
                    size="small"
                    margin="normal"
                  />
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setIsAnoymizedAdditionalPull(false); setIsIdentifiedAdditionalPull(false); }} variant="contained" color="primary">
            {mode === 'add' ? 'ADD' : 'UPDATE'}
          </Button>
          <Button onClick={() => { setIsAnoymizedAdditionalPull(false); setIsIdentifiedAdditionalPull(false); }} variant="outlined" >
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>



      <Dialog open={isSubscriptionStatus} onClose={() => setIsSubscriptionStatus(false)}>
        <DialogTitle id="alert-dialog-title">{"Change Subscription"}</DialogTitle>
        <DialogContent >
          Enabling this subscription will deactivate the presently active subscription.
          Are you sure you want to activate this subscription?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsSubscriptionStatus(false)}
            color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => setIsSubscriptionStatus(false)}
            color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SubscriptionList