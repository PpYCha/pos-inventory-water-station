import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { styled } from "@mui/material/styles";
import { homeData, homeColorData } from "../../../data";
import CountUp from "react-countup";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  addDoc,
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  where,
  query,
} from "@firebase/firestore";
import { db_firestore } from "../../../api/firebase";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const SummaryWidget = ({ title, number, cardColor, size }) => {
  return (
    <Card sx={{ backgroundColor: cardColor }}>
      <CardActionArea>
        <CardContent>
          <Typography
            gutterBottom
            variant={typeof size === "undefined" ? "h5" : size}
            component="div"
          >
            {title}
          </Typography>
          {title == "Transaction Count" ||
          title == "Meter Reading AM" ||
          title == "Meter Reading PM" ||
          title == "Bottle on Hand" ||
          title == "Bottles Damage" ||
          title == "No. of Unpaid Bottles" ||
          title == "Unsold Bottle" ||
          title == "Total Reading of Meter" ? (
            <Typography variant="h6" color="text.secondary">
              <CountUp start={0} end={number} duration={1.5} separator="," />
            </Typography>
          ) : (
            <Typography variant="h6" color="text.secondary">
              ₱ <CountUp start={0} end={number} duration={1.5} separator="," />
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const Main = ({ setSelectedLink, link }) => {
  const [startDate, setStartDate] = useState(dayjs("2023-01-01T21:11:54"));
  const [endDate, setEndDate] = useState(dayjs("2023-12-31T21:11:54"));
  const [transactionCount, setTransactionCount] = useState(0);
  const [profit, setProfit] = useState(0.0);
  const [expensesMain, setExpensesMain] = useState(0.0);
  const [netSales, setNetSales] = useState(0.0);
  const [meterAm, setMeterAm] = useState();
  const [meterPm, setMeterPm] = useState();

  const handleStartDate = (e) => {
    let year = e.$d.getFullYear();
    let month = e.$d.getUTCMonth();
    let day = e.$d.getDate();
    setStartDate(`${year}-${month + 1}-${day}`);
  };

  const handleEndDate = (e) => {
    let year = e.$d.getFullYear();
    let month = e.$d.getUTCMonth();
    let day = e.$d.getDate();
    setEndDate(`${year}-${month + 1}-${day}`);
  };

  const fetchMeter = async () => {
    try {
      const metersRef = collection(db_firestore, "meters");
      let meterAM;
      let meterPM;

      const startDatee = new Date(startDate);
      const endDatee = new Date(endDate);

      const q = query(
        metersRef,
        where("dateAM", ">=", startDatee),
        where("dateAM", "<=", endDatee)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        meterAM = parseFloat(doc.data().meterAM);
        meterPM = parseFloat(doc.data().meterPM);
      });

      setMeterAm(meterAM);
      setMeterPm(meterPM);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfit = async () => {
    try {
      const transactionRef = collection(db_firestore, "transactions");

      const startDatee = new Date(startDate);
      const endDatee = new Date(endDate);

      const q = query(
        transactionRef,
        where("date", ">=", startDatee),
        where("date", "<=", endDatee)
      );

      const querySnapshot = await getDocs(q);
      let total = 0;
      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        total += doc.data().total;
      });
      setTransactionCount(querySnapshot.size);
      setProfit(total);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const expensesRef = collection(db_firestore, "expenses");

      const startDatee = new Date(startDate);
      const endDatee = new Date(endDate);

      const q = query(
        expensesRef,
        where("date", ">=", startDatee),
        where("date", "<=", endDatee)
      );

      let expensesAmount = 0;

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        expensesAmount += parseFloat(doc.data().amount);
      });
      setExpensesMain(expensesAmount);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNetSales = async () => {
    try {
      let gross = profit;
      const expensesRef = collection(db_firestore, "expenses");

      const startDatee = new Date(startDate);
      const endDatee = new Date(endDate);

      const q = query(
        expensesRef,
        where("date", ">=", startDatee),
        where("date", "<=", endDatee)
      );

      let expensesAmount = 0;

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        expensesAmount += parseFloat(doc.data().amount);
      });
      setExpensesMain(expensesAmount);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAll = () => {
    fetchProfit();
    fetchExpenses();
    fetchNetSales();
    fetchMeter();
  };

  useEffect(() => {
    fetchAll();
    setSelectedLink(link);
  }, [startDate, endDate]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Paper elevation={24} sx={{ minHeight: "88vh" }}>
          <Grid container spacing={2} p={2}>
            <Grid xs={12}>
              <Stack direction="row" spacing={2}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="MM/DD/YYYY"
                  value={startDate}
                  onChange={handleStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DesktopDatePicker
                  label="End Date"
                  inputFormat="MM/DD/YYYY"
                  value={endDate}
                  onChange={handleEndDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Stack>
            </Grid>
            <Grid xs={6}>
              <SummaryWidget
                title={"Meter Reading AM"}
                number={meterAm}
                cardColor={homeColorData[1].cardColor}
              />
            </Grid>
            <Grid xs={6}>
              <SummaryWidget
                title={"Meter Reading PM"}
                number={meterPm}
                cardColor={homeColorData[2].cardColor}
              />
            </Grid>

            {/* <Grid xs={4}>
              <SummaryWidget
                title={"Transaction Count"}
                number={transactionCount}
                cardColor={homeColorData[3].cardColor}
                size="h5"
              />
            </Grid> */}

            <Grid xs={4}>
              <SummaryWidget
                title={"Expenses"}
                number={expensesMain}
                cardColor={homeColorData[4].cardColor}
              />
            </Grid>

            {/* <Grid xs={12}>
              <SummaryWidget
                title={"Gross Sales"}
                number={profit}
                cardColor={homeColorData[5].cardColor}
              />
            </Grid> */}
            <Grid xs={12}>
              <SummaryWidget
                title={"Net Sales"}
                number={profit}
                cardColor={homeColorData[6].cardColor}
              />
            </Grid>
            <Grid xs={12}>
              <SummaryWidget
                title={"Net Income"}
                number={profit - expensesMain}
                cardColor={homeColorData[7].cardColor}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Main;
