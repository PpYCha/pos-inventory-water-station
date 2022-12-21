import { Box, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import SingleProduct from "../../../components/SingleProduct";
import { useValue } from "../../../context/ContextProvider";

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
} from "@firebase/firestore";
import { db_firestore } from "../../../api/firebase";
import BackdropComponent from "../../../components/BackdropComponent";

const Pos = ({ setSelectedLink, link }) => {
  const [productList, setProductList] = useState([{}]);

  const {
    state: { openLogin, cart, loading, products },
    dispatch,
  } = useValue();

  const fetchProductsList = async () => {
    try {
      dispatch({ type: "START_LOADING" });
      const list = [];
      const querySnapshot = await getDocs(collection(db_firestore, "products"));

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.data().id,
          photoUrl: doc.data().photoUrl,
          productName: doc.data().productName,
          productDescription: doc.data().productDescription,
          price: doc.data().price,
          cost: doc.data().cost,
          stock: doc.data().stock,
          lowStockLevel: doc.data().lowStockLevel,
        });
      });

      list.sort((a, b) => {
        // Sort the list in ascending order based on the product name
        if (a.productName < b.productName) {
          return -1;
        }
        if (a.productName > b.productName) {
          return 1;
        }
        return 0;
      });

      setProductList(list);

      dispatch({ type: "UPDATE_PRODUCTS", payload: list });
      dispatch({ type: "END_LOADING" });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSelectedLink(link);
    fetchProductsList();
  }, []);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        width: "100%",
        padding: "10px",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        height: "100vh",
      }}
      spacing={2}
    >
      {loading ? (
        <BackdropComponent />
      ) : (
        <>
          {productList.map((prod) =>
            prod.id == null ? null : <SingleProduct prod={prod} key={prod.id} />
          )}
        </>
      )}
    </Grid>
  );
};

export default Pos;
