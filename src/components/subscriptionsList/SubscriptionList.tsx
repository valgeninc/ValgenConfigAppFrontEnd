import {
  Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Divider, Stack, Dialog, DialogContent, TextField, DialogActions, Grid, DialogTitle, Switch, AppBar, Toolbar, IconButton
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
import { getSubscription } from '../../services/subscriptions';
import { ISubscriptionValidationErrors } from "../../types/index";

const dayjs = require('dayjs');
const initialValue: SubscriptionData = {
  subscriptionId: '',
  subscriberId: '',
  subscriberToken: '',
  startDate: '',
  endDate: '',
  maxRequests: undefined,
  timeWindow: undefined,
  isActive: false,
  subscriptionServicesModel: [
    {
      serviceId: "",
      subscriptionId: "",
      endPointDesc: "AnonymizedDetail",
      companyRecords: undefined,
      locationRecords: undefined,
      addtionalCompanyRecords: undefined,
      addtionalLocationRecords: undefined,
      columns: []
    },
    {
      serviceId: "",
      subscriptionId: "",
      endPointDesc: "IdentifiedDetail",
      companyRecords: undefined,
      locationRecords: undefined,
      addtionalCompanyRecords: undefined,
      addtionalLocationRecords: undefined,
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
const columns = {
  "anonymizedColumnList": [
    "Location_ID",
    "Company_ID",
    "Corporate_Family_ID",
    "Street",
    "City",
    "State",
    "Zip",
    "Company_Phone",
    "Company_Fax",
    "Website",
    "Company_Facebook",
    "Company_LinkedIn",
    "Location_Type",
    "Address_Type",
    "Corporate_Franchise_Flag",
    "Number_of_Locations",
    "Company_Employee_Count",
    "Company_Revenues",
    "Primary_SIC_CODE_ID",
    "Primary_SIC_CODE_DESC",
    "SIC_Code_IDs",
    "Primary_NAICS_Code_ID",
    "Primary_NAICS_Code_Desc",
    "Year_Started",
    "Foreign_Parent_Flag",
    "Credit_Grade",
    "Credit_Grade_Desc",
    "Credit_Limit",
    "Green_Score",
    "Square_Footage",
    "Square_Footage_Desc",
    "Growing_Business_Code",
    "Total_Fleet",
    "Total_Fleet_One_Year_Change",
    "Total_Light_Duty",
    "Total_Medium_Duty",
    "Total_Heavy_Duty",
    "Total_Locations_with_Fleet",
    "Location_Fleet",
    "Location_Light_Duty",
    "Location_Medium_Duty",
    "Location_Heavy_Duty",
    "Class1_Vehicles_Present_Flag",
    "Class2_Vehicles_Present_Flag",
    "Class3_Vehicles_Present_Flag",
    "Class4_Vehicles_Present_Flag",
    "Class5_Vehicles_Present_Flag",
    "Class6_Vehicles_Present_Flag",
    "Class7_Vehicles_Present_Flag",
    "Class8_Vehicles_Present_Flag",
    "Body_Cars_Present_Flag",
    "Body_SUV_Present_Flag",
    "Body_Truck_Present_Flag",
    "Body_Van_Present_Flag",
    "Ownership_New_Owned_vehicle_Present_Flag",
    "Ownership_Used_Owned_vehicle_Present_Flag",
    "Ownership_Leased_Vehicle_Present_Flag",
    "Year_Lessthan_1year_Vehicle_Present_Flag",
    "Year1-2_Years_Vehicle_Present_Flag",
    "Year3-5_Years_Vehicle_Present_Flag",
    "Year6-9_Years_Vehicle_Present_Flag",
    "Year10+_Years_Vehicle_Present_Flag"
  ],
  "identifiedColumnList": [
    "Location_ID",
    "Company_ID",
    "Corporate_Family_ID",
    "Street",
    "City",
    "State",
    "Zip",
    "Company_Phone",
    "Company_Fax",
    "Website",
    "Company_Facebook",
    "Company_LinkedIn",
    "Location_Type",
    "Address_Type",
    "Corporate_Franchise_Flag",
    "Number_of_Locations",
    "Company_Employee_Count",
    "Company_Revenues",
    "Primary_SIC_CODE_ID",
    "Primary_SIC_CODE_DESC",
    "SIC_Code_IDs",
    "Primary_NAICS_Code_ID",
    "Primary_NAICS_Code_Desc",
    "Year_Started",
    "Foreign_Parent_Flag",
    "Credit_Grade",
    "Credit_Grade_Desc",
    "Credit_Limit",
    "Green_Score",
    "Square_Footage",
    "Square_Footage_Desc",
    "Growing_Business_Code",
    "Total_Fleet",
    "Total_Fleet_One_Year_Change",
    "Total_Light_Duty",
    "Total_Medium_Duty",
    "Total_Heavy_Duty",
    "Total_Locations_with_Fleet",
    "Location_Fleet",
    "Location_Light_Duty",
    "Location_Medium_Duty",
    "Location_Heavy_Duty",
    "Class1_Vehicles_Present_Flag",
    "Class2_Vehicles_Present_Flag",
    "Class3_Vehicles_Present_Flag",
    "Class4_Vehicles_Present_Flag",
    "Class5_Vehicles_Present_Flag",
    "Class6_Vehicles_Present_Flag",
    "Class7_Vehicles_Present_Flag",
    "Class8_Vehicles_Present_Flag",
    "Body_Cars_Present_Flag",
    "Body_SUV_Present_Flag",
    "Body_Truck_Present_Flag",
    "Body_Van_Present_Flag",
    "Ownership_New_Owned_vehicle_Present_Flag",
    "Ownership_Used_Owned_vehicle_Present_Flag",
    "Ownership_Leased_Vehicle_Present_Flag",
    "Year_Lessthan_1year_Vehicle_Present_Flag",
    "Year1-2_Years_Vehicle_Present_Flag",
    "Year3-5_Years_Vehicle_Present_Flag",
    "Year6-9_Years_Vehicle_Present_Flag",
    "Year10+_Years_Vehicle_Present_Flag"
  ]
}



interface SubscriptionData {
  subscriptionId: string;
  subscriberId: string;
  startDate: string;
  endDate: string;
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
  const [selected, setSelected] = useState<any>([]);
  const [column, setColumn] = useState<IOption[]>([]);
  const [isActiveSubscription, setIsActiveSubscription] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ISubscriptionValidationErrors>({
    maxRequests: '',
    timeWindow: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    getUsersSubscription();
    getColumns();
  }, []);

  const getColumns = () => {

    const options = responseColumnsListToModifiedColumnList(columns);
    setColumn(options);
  }
  const getUsersSubscription = async () => {
    let response = await getSubscription(subscriberId);
    setsubscriptionList(response.data.subscriptions);

  }
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSubscriptionData(initialValue);
  };
  const handleAddDialogOpen = () => {
    setMode('add');
    setSelected([]);
    setDialogOpen(true);
  };
  const handleEditDialogOpen = (subscription: SubscriptionData) => {

    setSubscriptionData(subscription);
    interface ColumnObject {
      anonymizedColumnList: string[];
      identifiedColumnList: string[];
    }
    const columns: ColumnObject = {
      anonymizedColumnList: subscription.subscriptionServicesModel[0].columns,
      identifiedColumnList: subscription.subscriptionServicesModel[1].columns
    }

    const options = responseColumnsListToModifiedColumnList(columns);
    setSelected(options);
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
  const addSubscription = () => {
    const payload = {
      subscriberId: subscriptionData.subscriberId,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      maxRequests: (subscriptionData.maxRequests),
      timeWindow: (subscriptionData.timeWindow),
      subscriptionServicesModel: subscriptionData.subscriptionServicesModel?.map((model) => ({
        endPointDesc: model.endPointDesc,
        companyRecords: (model.companyRecords),
        locationRecords: (model.locationRecords),
        addtionalCompanyRecords: (model.addtionalCompanyRecords),
        addtionalLocationRecords: (model.addtionalLocationRecords),
        columns: model.columns
      }))
    };

  }
  const editSubscriber = () => {
    const columns = modifiedColumnListToResponseColumnsList(selected)
    const payload = {
      subscriberId: subscriptionData.subscriberId,
      startDate: subscriptionData.startDate,
      endDate: subscriptionData.endDate,
      maxRequests: (subscriptionData.maxRequests),
      timeWindow: (subscriptionData.timeWindow),
      subscriptionServicesModel: subscriptionData.subscriptionServicesModel?.map((model) => ({
        endPointDesc: model.endPointDesc,
        companyRecords: (model.companyRecords),
        locationRecords: (model.locationRecords),
        addtionalCompanyRecords: (model.addtionalCompanyRecords),
        addtionalLocationRecords: (model.addtionalLocationRecords),
        columns: model.columns
      }))
    };
    payload.subscriptionServicesModel[0].columns = columns.anonymizedColumnList;
    payload.subscriptionServicesModel[1].columns = columns.identifiedColumnList;

  }
  const handleSaveUpdate = () => {
    const isValid = validateFields();
    if (isValid) {
      if (mode === 'add') {
        addSubscription();
      } else if (mode === 'edit') {
        editSubscriber();
      }
      handleDialogClose();
    }

  };
  const handleChangeStatus = (isActive: boolean) => {
    setIsActiveSubscription(isActive);
    setIsSubscriptionStatus(true);
  }
  const validateFields = (): boolean => {
    const errors: ISubscriptionValidationErrors = {
      maxRequests: '',
      timeWindow: '',
      startDate: '',
      endDate: '',
    };

    if (!subscriptionData.maxRequests) {
      errors.maxRequests = 'Max Calls is required.';
    }
    if (!subscriptionData.timeWindow) {
      errors.timeWindow = 'Time in Seconds is required.';
    }
    if (!subscriptionData.startDate) {
      errors.startDate = 'Start Date is required.';
    }
    if (!subscriptionData.endDate) {
      errors.endDate = 'End Date is required.';
    }

    // if (!subscriptionData.email) {
    //   errors.email = 'Email is required.';
    // } else if (!isValidEmail(subscriptionData.email)) {
    //   errors.email = 'Invalid email format.';
    // }

    // if (!subscriptionData.phone) {
    //   errors.phone = 'Phone is required.';
    // }
    setValidationErrors(errors);
    return Object.keys(errors).every(field => !errors[field]);
  };
  const activateDeactivateSubscription = () => {
    // isSubscriptionStatus
    setIsSubscriptionStatus(false);
  }

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
                          <TableCell align="center">{subscription.subscriberToken}</TableCell>
                          <TableCell align="center">
                            <Switch
                              checked={subscription.isActive}
                              onChange={() => handleChangeStatus(subscription.isActive)}
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
        {/* <DialogTitle>Subscription Details</DialogTitle> */}
        <Divider></Divider>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', fontSize: 21, marginBottom: 2 }}>Global Configuration</Typography>
          <Box className="configuration">
            <Grid container>
              {/* <Grid xs={6}> */}
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center" >
                  <Grid item xs={6}>
                    <Typography variant="subtitle1" sx={{ textAlign: 'start' }} >Max Calls</Typography>
                  </Grid>
                  <Grid item xs={6}>
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
                  <Grid item xs={6}  >
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}> */}
                    <TextField
                      type={"number"}
                      name="timeWindow"
                      value={subscriptionData.timeWindow}
                      onChange={handleInputChange}
                      size="small"
                      margin="normal"
                      error={Boolean(validationErrors.timeWindow)}
                      helperText={validationErrors.timeWindow}
                    />
                    {/* </LocalizationProvider> */}
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

                        // value={subscriptionData?.startDate ? new Date(subscriptionData?.startDate) : ''}
                        format="DD-MM-YYYY"
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
                        // value={subscriptionData?.endDate ? new Date(subscriptionData?.endDate) : ''}
                        format="DD-MM-YYYY"
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
          <Typography sx={{ textAlign: 'center', fontSize: 21, margin: 2 }}>Api Configuration</Typography>
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
              <Grid item xs={6}>
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
                        onChange={handleInputChange}
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
                    value={subscriptionData.subscriptionServicesModel?.[0].addtionalCompanyRecords}
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
                    value={subscriptionData.subscriptionServicesModel?.[0].addtionalLocationRecords}
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
        {isActiveSubscription ? <DialogContent >
          Deactivating this subscription will cancel the presently active subscription.
          Are you sure you want to deactivate this subscription?
        </DialogContent> : <DialogContent >
          Enabling this subscription will deactivate the presently active subscription.
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
interface Column {
  label: string;
  value: string;
}


// function convertModifiedToOriginal(modifiedData: ModifiedData[]): {
//   anonymizedColumnList: OriginalData[];
//   identifiedColumnList: OriginalData[];
// } {
//   const originalData: {
//     anonymizedColumnList: OriginalData[];
//     identifiedColumnList: OriginalData[];
//   } = {
//     anonymizedColumnList: [],
//     identifiedColumnList: [],
//   };

//   modifiedData.forEach(category => {
//     const categoryName = category.label;
//     const targetArray = categoryName === 'Anoymized' ? 'anonymizedColumnList' : 'identifiedColumnList';

//     const options = category.options.map(option => ({
//       label: option.label,
//       value: option.value,
//     }));

//     originalData[targetArray] = originalData[targetArray].concat(options);
//   });

//   return originalData;
// }

interface IOption {
  label: string;
  options: { value: string; label: string }[];
}

function responseColumnsListToModifiedColumnList(columns: { anonymizedColumnList: string[]; identifiedColumnList: string[] }) {
  const anonymizedOptions: IOption = {
    label: 'Anoymized',
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
  const anonymizedColumns: string[] = [];
  const identifiedColumns: string[] = [];

  options.forEach(category => {
    const categoryName = category.label;
    const columnOptions = category.options;

    columnOptions.forEach(option => {
      if (categoryName === 'Anoymized') {
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