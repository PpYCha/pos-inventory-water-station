import { Box } from "@mui/material";
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

const Pos = ({ setSelectedLink, link }) => {
  const [productList, setProductList] = useState([{}]);

  const {
    state: { openLogin, cart, loading },
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
          productPicture: doc.data().productPicture,
          productName: doc.data().productName,
          productDescription: doc.data().productDescription,
          price: doc.data().price,
          cost: doc.data().cost,
          stock: doc.data().stock,
          lowStockLevel: doc.data().lowStockLevel,
        });
      });

      setProductList(list);
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
    <Box
      sx={{
        display: "flex",
        width: "78%",
        padding: "20px",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
    >
      {productList.map((prod) => (
        <SingleProduct prod={prod} key={prod.id} />
      ))}
    </Box>
  );
};

export default Pos;
