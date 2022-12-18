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
  const [startDate, setStartDate] = useState(dayjs("2022-10-18T21:11:54"));
  const [endDate, setEndDate] = useState(dayjs("2022-11-18T21:11:54"));

  const handleStartDate = (e) => {
    setStartDate(e);
  };

  const handleEndDate = (e) => {
    setEndDate(e);
  };

  useEffect(() => {
    setSelectedLink(link);
  }, []);
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
            <Grid xs={4}>
              <SummaryWidget
                title={"Meter Reading AM"}
                number={homeData[0].meterReadingYesterday}
                cardColor={homeColorData[6].cardColor}
              />
            </Grid>
            <Grid xs={4}>
              <SummaryWidget
                title={"Meter Reading PM"}
                number={homeData[0].meterReadingYesterday}
                cardColor={homeColorData[12].cardColor}
              />
            </Grid>
            <Grid xs={4}>
              <SummaryWidget
                title={"Total Reading of Meter"}
                number={homeData[0].totalMeterReading}
                cardColor={homeColorData[7].cardColor}
              />
            </Grid>
            <Grid xs={2}>
              <SummaryWidget
                title={"Transaction Count"}
                number={homeData[0].transactionCount}
                cardColor={homeColorData[0].cardColor}
                size="h5"
              />
            </Grid>
            <Grid xs={2}>
              <SummaryWidget
                title={"Net Sales"}
                number={homeData[0].netSales}
                cardColor={homeColorData[1].cardColor}
              />
            </Grid>
            <Grid xs={2}>
              <SummaryWidget
                title={"Cost of Product Sold"}
                number={homeData[0].costOfProductSold}
                cardColor={homeColorData[2].cardColor}
              />
            </Grid>
            <Grid xs={2}>
              <SummaryWidget
                title={"Margin"}
                number={homeData[0].margin}
                cardColor={homeColorData[3].cardColor}
              />
            </Grid>

            <Grid xs={2}>
              <SummaryWidget
                title={"Expenses"}
                number={homeData[0].expenses}
                cardColor={homeColorData[4].cardColor}
              />
            </Grid>

            <Grid xs={2}>
              <SummaryWidget
                title={"Profit"}
                number={homeData[0].profit}
                cardColor={homeColorData[5].cardColor}
              />
            </Grid>
            <Grid xs={3}>
              <SummaryWidget
                title={"Unsold Bottle"}
                number={homeData[0].profit}
                cardColor={homeColorData[10].cardColor}
              />
            </Grid>
            <Grid xs={3}>
              <SummaryWidget
                title={"Bottle on Hand"}
                number={homeData[0].profit}
                cardColor={homeColorData[7].cardColor}
              />
            </Grid>
            <Grid xs={3}>
              <SummaryWidget
                title={"Bottles Damage"}
                number={homeData[0].profit}
                cardColor={homeColorData[8].cardColor}
              />
            </Grid>
            <Grid xs={3}>
              <SummaryWidget
                title={"No. of Unpaid Bottles"}
                number={homeData[0].profit}
                cardColor={homeColorData[11].cardColor}
              />
            </Grid>
            <Grid xs={4}>
              <SummaryWidget
                title={"Customer Owe"}
                number={homeData[0].profit}
                cardColor={homeColorData[9].cardColor}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default Main;
