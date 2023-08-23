import {
  Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Divider, Stack, Dialog, DialogContent, TextField, DialogActions, Grid, DialogTitle, Switch, AppBar, Toolbar, IconButton, Alert, FormControlLabel
} from '@mui/material'
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Sidenav from '../sidenav/Sidenav';
import Navbar from '../navbar/Navbar';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./subscription.css"
import CloseIcon from '@mui/icons-material/Close';
import DualListBox from 'react-dual-listbox';
import 'react-dual-listbox/lib/react-dual-listbox.css';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { createSubscription, getColumnList, getSubscription, renewSubscription, updateSubscription } from '../../services/subscriptions';
import { ISubscriptionValidationErrors } from "../../types/index";
import RefreshIcon from '@mui/icons-material/Refresh';
import { Dayjs } from 'dayjs';
import Snackbar from '@mui/material/Snackbar';


const dayjs = require('dayjs');
const initialValue: SubscriptionData = {
  subscriptionId: '',
  subscriberId: '',
  subscriberToken: '',
  startDate: dayjs(new Date()),
  endDate: dayjs(new Date()),
  maxRequests: undefined,
  timeWindow: undefined,
  isActive: true,
  subscriptionServicesModel: [
    {
      serviceId: "",
      subscriptionId: "",
      endPointDesc: "AnonymizedDetail",
      companyRecords: undefined,
      locationRecords: undefined,
      addtionalCompanyRecords: 0,
      addtionalLocationRecords: 0,
      columns: []
    },
    {
      serviceId: "",
      subscriptionId: "",
      endPointDesc: "IdentifiedDetail",
      companyRecords: undefined,
      locationRecords: undefined,
      addtionalCompanyRecords: 0,
      addtionalLocationRecords: 0,
      columns: []
    },
  ]
}
const dualListBoxLabels = {
  availableFilterHeader: 'Filter available',
  availableHeader: 'Available Columns',
  filterPlaceholder: 'Search...',
  moveAllLeft: 'Move all to available',
  moveAllRight: 'Move all to selected',
  moveLeft: 'Move to available',
  moveRight: 'Move to selected',
  moveBottom: 'Rearrange to bottom',
  moveDown: 'Rearrange down',
  moveUp: 'Rearrange up',
  moveTop: 'Rearrange to top',
  noAvailableOptions: 'No available options',
  noSelectedOptions: 'No selected options',
  requiredError: 'Please select at least one option.',
  selectedFilterHeader: 'Filter selected',
  selectedHeader: 'Selected Columns',
};


interface SubscriptionData {
  subscriptionId: string;
  subscriberId: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  subscriberToken: string;
  isActive: boolean;
  maxRequests: number | undefined;
  timeWindow: number | undefined;
  subscriptionServicesModel: ServiceModel[];
}
interface ServiceModel {
  serviceId: string;
  subscriptionId: string;
  endPointDesc: string;
  companyRecords: number | undefined;
  locationRecords: number | undefined;
  addtionalCompanyRecords: number | undefined;
  addtionalLocationRecords: number | undefined;
  columns: string[];
}
interface IOption {
  label: string,
  options: Option[]
}
interface Option {
  value: string;
  label: string;
}
interface ColumnObject {
  anonymizedColumnList: string[];
  identifiedColumnList: string[];
}

const SubscriptionList = () => {
  const { subscriberId } = useParams();
  const [subscriptionList, setsubscriptionList] = useState<any>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(initialValue);
  const [subscriptionId, setSubscriptionId] = useState('');
  const [mode, setMode] = useState('add');
  const navigate = useNavigate();
  const [isAnoymizedAdditionalPull, setIsAnoymizedAdditionalPull] = useState(false);
  const [isIdentifiedAdditionalPull, setIsIdentifiedAdditionalPull] = useState(false);
  const [isSubscriptionStatus, setIsSubscriptionStatus] = useState(false);
  const [selected, setSelected] = useState<any>([]);
  const [column, setColumn] = useState<IOption[]>([]);
  const [isActiveSubscription, setIsActiveSubscription] = useState(false);
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const [validationErrors, setValidationErrors] = useState<any>({
    maxRequests: "",
  });
  const [isRequiredFulfilled, setIsRequiredFulfilled] = useState(true);


  useEffect(() => {
    getUsersSubscription();
    getColumns();
  }, []);

  const getColumns = async () => {
    let columns = await getColumnList();
    if (columns) {
      let options = responseColumnsListToModifiedColumnList(columns);
      setColumn(options);
    }

  }
  const getUsersSubscription = async () => {
    let response = await getSubscription(subscriberId);
    setsubscriptionList(response);
    setIsActiveSubscription(response?.isActive);
  }
  const handleDialogClose = () => {
    setIsRequiredFulfilled(true);
    setDialogOpen(false);
    setSubscriptionData(initialValue);
  };
  const handleAddDialogOpen = () => {
    setMode('add');
    setSelected([]);
    setDialogOpen(true);
  };
  const handleEditDialogOpen = (subscription: SubscriptionData) => {
    try {
      // Set subscription data
      setSubscriptionData(subscription);

      // Extract column data
      const columns: ColumnObject = {
        anonymizedColumnList: subscription.subscriptionServicesModel[0]?.columns || [],
        identifiedColumnList: subscription.subscriptionServicesModel[1]?.columns || [],
      };
      // Convert response columns to modified columns
      const options = responseColumnsListToModifiedColumnList(columns);

      // Set selected options, mode, and open the dialog
      setSelected(options);
      setMode('edit');
      setDialogOpen(true);
    } catch (error) {
      console.error('An error occurred while opening the edit dialog:', error);
      // You can display an error message to the user or handle the error as needed
    }
  };
  const handleInputChange = (e: any) => {
    try {
      const { name, value } = e.target;
    debugger
      if (name === "maxRequests" && value > 0 && value.length > 4) {
        setValidationErrors((prevErrors: any) => ({ ...prevErrors, maxRequests: "Max Calls should be between 1 to 9999 " }));
      }else {
        // Clear the validation error if the input is valid
        setValidationErrors((prevErrors: any) => ({ ...prevErrors, [name]: "" }));
      }

      setSubscriptionData((prevData) => ({
        ...prevData,
        [name]: value
      }));

    } catch (error) {

    }

  };
  const handleServiceModelInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
    fieldName: string,
  ) => {
    const newValue = parseFloat(event.target.value);
    setSubscriptionData((prevData) => {
      const newServiceModel: any = { ...prevData.subscriptionServicesModel?.[index] };
      newServiceModel[fieldName] = newValue;
      const updatedServiceModels = [...prevData.subscriptionServicesModel];
      updatedServiceModels[index] = newServiceModel;

      return {
        ...prevData,
        subscriptionServicesModel: updatedServiceModels
      };
    });
  };
  const addSubscription = async () => {
    debugger
    const columns = modifiedColumnListToResponseColumnsList(selected)
    const payload = {
      subscriberId: subscriberId,
      subscriptionId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      maxRequests: (subscriptionData.maxRequests),
      timeWindow: (subscriptionData.timeWindow),
      IsActive: (subscriptionData.isActive),
      createSubscriptionServicesModel: subscriptionData.subscriptionServicesModel?.map((model) => ({
        serviceId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        endPointDesc: model.endPointDesc,
        companyRecords: (Number(model.companyRecords) + Number(model.addtionalCompanyRecords)),
        locationRecords: (Number(model.locationRecords) + Number(model.addtionalLocationRecords)),
        addtionalCompanyRecords: (model.addtionalCompanyRecords),
        addtionalLocationRecords: (model.addtionalLocationRecords),
        columns: model.columns
      }))
    };
    payload.createSubscriptionServicesModel[0].columns = columns.anonymizedColumnList;
    payload.createSubscriptionServicesModel[1].columns = columns.identifiedColumnList;
    const response = await createSubscription(payload);
    if (response?.data.status === "OK") {
      setMessage(response.data.result);
      setSeverity('success');
      setIsSnackbar(true);
      getUsersSubscription();
    } else {
      setMessage("Something went wrong");
      setSeverity('error');
      setIsSnackbar(true);
    }



  }
  const editSubscriber = async () => {
    debugger
    const columns = modifiedColumnListToResponseColumnsList(selected)
    const payload = {
      subscriberId: subscriberId,
      subscriptionId: subscriptionData.subscriptionId,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      maxRequests: (subscriptionData.maxRequests),
      timeWindow: (subscriptionData.timeWindow),
      IsActive: (subscriptionData.isActive),
      createSubscriptionServicesModel: subscriptionData.subscriptionServicesModel?.map((model) => ({
        serviceId: model.serviceId,
        endPointDesc: model.endPointDesc,
        companyRecords: (model.companyRecords),
        locationRecords: (model.locationRecords),
        addtionalCompanyRecords: (model.addtionalCompanyRecords),
        addtionalLocationRecords: (model.addtionalLocationRecords),
        columns: model.columns
      }))
    };
    payload.createSubscriptionServicesModel[0].columns = columns.anonymizedColumnList;
    payload.createSubscriptionServicesModel[1].columns = columns.identifiedColumnList;

    const response = await updateSubscription(payload);
    if (response?.data.status === "OK") {
      setMessage(response.data.result);
      setSeverity('success');
      setIsSnackbar(true);
      getUsersSubscription();
    } else {
      setMessage("Something went wrong");
      setSeverity('error');
      setIsSnackbar(true);
    }
  }
  const handleSaveUpdate = () => {
    try {
      // Validate data using Zod schema
      // subscriptionSchema.parse(subscriptionData);
      debugger
      setIsRequiredFulfilled(selected.length > 0);
      if (isRequiredFulfilled) {
        if (mode === 'add') {
          addSubscription();
        } else if (mode === 'edit') {
          editSubscriber();
        }
        handleDialogClose();
      }

    } catch (error) {

    }


  };
  const handleChangeStatus = (isActive: boolean, subscriptionId: string) => {
    setIsActiveSubscription(isActive);
    setIsSubscriptionStatus(true);
    setSubscriptionId(subscriptionId);
  }

  const activateDeactivateSubscription = async () => {
    try {
      const response: any = await renewSubscription(subscriptionId, isActiveSubscription);
      // Check if the API call was successful or not
      if (response.data.status == "OK") {
        setMessage(response.data.result);
        setSeverity('success');
        // setIsActiveSubscription(!isActiveSubscription);
        getUsersSubscription();
      } else {
        setMessage(response.data.error);
        setSeverity('error');
      }

      setIsSnackbar(true);
    } catch (error) {
      setMessage('An error occurred while making the API call.');
      setSeverity('error');
      setIsSnackbar(true);
    }

    setIsSubscriptionStatus(false);
  }
  const handleCloseSnackbar = () => {
    setIsSnackbar(false);
  };

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
                    {subscriptionList && subscriptionList.length > 0 ? subscriptionList.map((subscription: SubscriptionData) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={subscription.subscriberToken}>
                          <TableCell align="center">{dayjs(subscription.startDate).format('DD-MM-YYYY')}</TableCell>
                          <TableCell align="center">{dayjs(subscription.endDate).format('DD-MM-YYYY')}</TableCell>
                          <TableCell align="center" sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subscription.subscriberToken}</TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={subscription.isActive}
                              onChange={() => handleChangeStatus(!subscription.isActive, subscription.subscriptionId)}
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
                                onClick={() => handleEditDialogOpen(subscription)}
                                className="cursor-pointer"
                              />
                            </Tooltip>
                            <Tooltip title="Refresh Token | Functionality In Progress">
                              <RefreshIcon style={{
                                fontSize: "20px",
                                color: "blue",
                                cursor: "pointer",
                                marginLeft: "20px",
                              }} />
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
        <Snackbar open={isSnackbar} autoHideDuration={1000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleCloseSnackbar} severity={severity}>
            {message}
          </Alert>
        </Snackbar>
      </div>

      {/* Dialog for adding a new Subscription */}
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        fullScreen
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
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
        <Divider></Divider>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography sx={{ textAlign: 'center', fontSize: 21, marginLeft: 2, marginBottom: 2 }}>Global Configuration</Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={subscriptionData.isActive}
                  onChange={() => setSubscriptionData(prevData => ({ ...prevData, isActive: !prevData.isActive }))}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="IsActive"
              sx={{ textAlign: 'right' }}
            />
          </Box>

          <Box className="configuration">
            <Grid container>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center" >
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }} >Max Calls</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      type={"number"}
                      name="maxRequests"
                      value={subscriptionData.maxRequests}
                      onChange={handleInputChange}
                      size="small"
                      margin="normal"
                      error={Boolean(validationErrors.maxRequests)}
                      helperText={validationErrors.maxRequests}
                    />
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6} >
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start', marginLeft: 5 }}>Time in Seconds</Typography>
                  </Grid>
                  <Grid item xs={5}  >
                    <TextField
                      type={"number"}
                      name="timeWindow"
                      value={subscriptionData.timeWindow}
                      onChange={handleInputChange}
                      size="small"
                      margin="normal"
                    // error={Boolean(validationErrors.find((issue) => issue.path[0] === "timeWindow"))}
                    // helperText={validationErrors.find((issue) => issue.path[0] === "timeWindow")?.message || ""}
                    />
                  </Grid>
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }}>Start Date</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={dayjs(subscriptionData.startDate)}
                        format="DD-MM-YYYY"
                        minDate={dayjs().subtract(0, 'day')}
                        onChange={(value: any) => {
                          const utcDate = value.toISOString();
                          setSubscriptionData((prevData) => ({
                            ...prevData,
                            startDate: utcDate,
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
                  <Grid item xs={5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={dayjs(subscriptionData.endDate)}
                        format="DD-MM-YYYY"
                        minDate={dayjs().subtract(0, 'day')}
                        onChange={(value: any) => {
                          const utcDate = value.toISOString();
                          setSubscriptionData((prevData) => ({
                            ...prevData,
                            endDate: utcDate,
                          }));
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          </Box>
          <Typography sx={{ fontSize: 21, margin: 2 }}>Api Configuration</Typography>
          <Box className="configuration">
            <Grid container item xs={12}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ textAlign: 'start', fontWeight: '500', marginBottom: 2 }} >Anoymized Details:</Typography>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" sx={{ textAlign: 'start' }}>Company Records Limit</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type={"number"}
                        value={subscriptionData.subscriptionServicesModel?.[0].companyRecords}
                        onChange={(event) => handleServiceModelInputChange(event, 0, 'companyRecords')}
                        name="companyRecords"
                        size="small"
                        margin="normal"
                      // error={Boolean(validationErrors.find((issue) => issue.path[0] === 'createSubscriptionServicesModel' && issue.path[1] === 0 && issue.path[2] === 'companyRecords'))}
                      // helperText={validationErrors.find((issue) => issue.path[0] === 'createSubscriptionServicesModel' && issue.path[1] === 0 && issue.path[2] === 'companyRecords')?.message || ''}
                      />
                    </Grid>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" sx={{ textAlign: 'start' }}>Location Records Limit</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        value={subscriptionData.subscriptionServicesModel?.[0].locationRecords}
                        onChange={(event) => handleServiceModelInputChange(event, 0, 'locationRecords')}
                        type={"number"}
                        name="locationRecords"
                        size="small"
                        margin="normal"
                      // error={Boolean(validationErrors.find((issue) => issue.path[0] === 'createSubscriptionServicesModel' && issue.path[1] === 0 && issue.path[2] === 'locationRecords'))}
                      // helperText={validationErrors.find((issue) => issue.path[0] === 'createSubscriptionServicesModel' && issue.path[1] === 0 && issue.path[2] === 'locationRecords')?.message || ''}
                      />
                    </Grid>
                    <Tooltip title="Add Additional Pull">
                      <Button onClick={() => { setIsAnoymizedAdditionalPull(true) }} endIcon={<AddCircleIcon />}>
                      </Button>
                    </Tooltip>
                  </Stack>
                </Grid>
              </Grid>
              <Divider orientation="vertical" sx={{ marginRight: 5, opacity: 1 }} flexItem>

              </Divider>
              <Grid item xs={5}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ textAlign: 'start', fontWeight: '500', marginBottom: 2 }} >Identified Api Details:</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" sx={{ textAlign: 'start' }}>Company Records Limit</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        type={"number"}
                        value={subscriptionData.subscriptionServicesModel?.[1].companyRecords}
                        onChange={(event) => handleServiceModelInputChange(event, 1, 'companyRecords')}
                        name="companyRecords"
                        size="small"
                        margin="normal"
                      />
                    </Grid>
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="subtitle1" sx={{ textAlign: 'start' }}>Location Records Limit</Typography>
                    </Grid>
                    <Grid item xs={4} >
                      <TextField
                        type={"number"}
                        name="locationRecords"
                        value={subscriptionData.subscriptionServicesModel?.[1].locationRecords}
                        onChange={(event) => handleServiceModelInputChange(event, 1, 'locationRecords')}
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
              <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box className="transfer-column">
                  <DualListBox
                    canFilter={true}
                    simpleValue={false}
                    options={column}
                    lang={dualListBoxLabels}
                    selected={selected}
                    showHeaderLabels={true}
                    onChange={(selectedValues) => {
                      setSelected(selectedValues);
                    }}
                    className="transfer-double-content-left"
                    icons={{
                      moveLeft: <KeyboardArrowLeftIcon />,
                      moveAllRight: <KeyboardDoubleArrowRightIcon />,
                      moveAllLeft: <KeyboardDoubleArrowLeftIcon />,
                      moveRight: <KeyboardArrowRightIcon />,
                      moveDown: <KeyboardArrowDownIcon />,
                      moveUp: <KeyboardArrowUpIcon />,
                      moveTop: <KeyboardDoubleArrowUpIcon />,
                      moveBottom: <KeyboardDoubleArrowDownIcon />
                    }}
                  />
                  {!isRequiredFulfilled && <span style={{ color: 'red' }}>This field is required.</span>}

                </Box>
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
                    value={isAnoymizedAdditionalPull ? subscriptionData.subscriptionServicesModel?.[0].addtionalCompanyRecords : subscriptionData.subscriptionServicesModel?.[1].addtionalCompanyRecords}
                    onChange={(event) => isAnoymizedAdditionalPull ? handleServiceModelInputChange(event, 0, 'addtionalCompanyRecords') : handleServiceModelInputChange(event, 1, 'addtionalCompanyRecords')}
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
                    value={isAnoymizedAdditionalPull ? subscriptionData.subscriptionServicesModel?.[0].addtionalLocationRecords : subscriptionData.subscriptionServicesModel?.[1].addtionalLocationRecords}
                    onChange={(event) => {
                      (isAnoymizedAdditionalPull) ? handleServiceModelInputChange(event, 0, 'addtionalLocationRecords') : handleServiceModelInputChange(event, 1, 'addtionalLocationRecords')
                    }}
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
        {!isActiveSubscription ? <DialogContent >
          Are you sure you want to deactivate this subscription?
        </DialogContent> : <DialogContent >
          Are you sure you want to activate this subscription?
        </DialogContent>}
        <DialogActions>
          <Button
            onClick={() => setIsSubscriptionStatus(false)}
            color="primary">
            Cancel
          </Button>
          <Button
            onClick={activateDeactivateSubscription}
            color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

interface IOption {
  label: string;
  options: { value: string; label: string }[];
}

function responseColumnsListToModifiedColumnList(columns: { anonymizedColumnList: string[]; identifiedColumnList: string[] }) {
  const anonymizedOptions: IOption = {
    label: 'Anonymized',
    options: columns.anonymizedColumnList.map((column: any) => ({ value: column + "_anonymized", label: column }))
  };

  const identifiedOptions: IOption = {
    label: 'Identified',
    options: columns.identifiedColumnList.map(column => ({ value: column, label: column }))
  };

  const options: IOption[] = [anonymizedOptions, identifiedOptions];
  return options;
}
function modifiedColumnListToResponseColumnsList(options: IOption[]): { anonymizedColumnList: string[]; identifiedColumnList: string[] } {
  debugger
  const anonymizedColumns: string[] = [];
  const identifiedColumns: string[] = [];

  options.forEach(category => {
    const categoryName = category.label;
    const columnOptions = category.options;

    columnOptions.forEach(option => {
      if (categoryName === 'Anonymized') {
        anonymizedColumns.push(option.label);
      } else if (categoryName === 'Identified') {
        identifiedColumns.push(option.label);
      }
    });
  });

  const columnsLists = {
    anonymizedColumnList: anonymizedColumns,
    identifiedColumnList: identifiedColumns
  };

  return columnsLists;
}


export default SubscriptionList