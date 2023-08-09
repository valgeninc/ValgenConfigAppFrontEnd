import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Typography, Divider, Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import Sidenav from '../sidenav/Sidenav';
import Navbar from '../navbar/Navbar';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import "./subscription.css"
const dayjs = require('dayjs');

const SubscriptionList = () => {
  const { subscriberId } = useParams();
  const [subscriptionList, setsubscriptionList] = useState<any>([]);

  useEffect(() => {
    axios.get(`http://localhost:3030/result/${subscriberId}`)
      .then(response => {
        setsubscriptionList(response.data.subscriptions);
      })
      .catch(err => console.log(err))
  }, [subscriberId]);

  return (
    <>
      <div className='bgcolor'>
        <Navbar />
        <Box height={70} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            {subscriptionList.length > 0 && (
              <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ padding: "20px" }}
                >
                  Subscriptions List
                </Typography>
                <Divider />
                <Box height={10} />
                <Stack direction="row" spacing={2} className="my-2 mb-2">
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  ></Typography>
                  <Tooltip title="Add Subscription">
                    <Button variant="contained" endIcon={<AddCircleIcon />}>
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
                          Subscriber Max Records
                        </TableCell>
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          Time(in seconds)
                        </TableCell>
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          Start Date
                        </TableCell>
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          End Date
                        </TableCell>
                        <TableCell align="left" style={{ minWidth: "100px" }}>
                          Token
                        </TableCell>
                        <TableCell align="left" style={{ minWidth: "100px" }}>

                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {subscriptionList.map((subscription: { max_records: number, time_seconds: number, start_time: string, end_time: string, token: string }) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={subscription.token}>
                            <TableCell align="left">{subscription.max_records}</TableCell>
                            <TableCell align="left">{subscription.time_seconds}</TableCell>
                            <TableCell align="left">{dayjs(subscription.start_time).format('DD-MM-YYYY')}</TableCell>
                            <TableCell align="left">{dayjs(subscription.end_time).format('DD-MM-YYYY')}</TableCell>
                            <TableCell align="left">{subscription.token}</TableCell>
                            <TableCell align="left">

                              <Tooltip title="Edit subscription">
                                <EditIcon
                                  style={{
                                    fontSize: "20px",
                                    color: "blue",
                                    cursor: "pointer",
                                  }}
                                  className="cursor-pointer"
                                />
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Box>
        </Box>
      </div>
    </>
  )
}

export default SubscriptionList