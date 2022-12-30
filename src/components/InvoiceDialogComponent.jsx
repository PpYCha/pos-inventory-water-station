import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useState } from "react";
import { useValue } from "../context/ContextProvider";
import FormInput from "./form/FormInput";

const InvoiceDialogComponent = ({ handleClose, openLogin }) => {
  const {
    state: { cart, loading, products, customerInvoice },
    dispatch,
  } = useValue();

  return (
    <Dialog onClose={handleClose} open={openLogin} maxWidth="100%">
      <DialogTitle>Receipt</DialogTitle>
      <DialogContent>
        <>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={0.5}
            marginBottom={5}
          >
            <Typography variant="h4">Fairways Store</Typography>
            <Typography variant="h6">Catarman, Northern Samar, 6400</Typography>
            <Typography variant="h6"> 09100435993</Typography>
            {/* <Typography>{dateTime}</Typography> */}
          </Stack>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={3}>
                    Details
                  </TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Desc</TableCell>
                  <TableCell align="right">Qty.</TableCell>
                  <TableCell align="right">Unit</TableCell>
                  <TableCell align="right">Sum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerInvoice.cart.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell align="right">{row.qty}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right">
                      {(row.qty * row.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell align="right">
                    {customerInvoice.subTotal}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax</TableCell>
                  <TableCell align="right">{`${(0.12 * 100).toFixed(
                    0
                  )} %`}</TableCell>
                  <TableCell align="right">{customerInvoice.tax}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align="right">{customerInvoice.total}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction="column" spacing={0.5} marginTop={5}>
            <Typography>Customer Name: {customerInvoice.name} </Typography>
            <Typography>Address:{customerInvoice.address}</Typography>
            <Typography>Phone: {customerInvoice.phone}</Typography>
            <Typography>E-mail: {customerInvoice.email}</Typography>
          </Stack>
        </>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDialogComponent;
