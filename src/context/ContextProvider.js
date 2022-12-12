import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import reducer from "./reducer";

const initialState = {
  currentUser: null,
  openLogin: false,
  loading: false,
  user: {
    id: "",
    name: "",
    photoUrl: "",
    file: null,
    email: "",
    password: "",
    phoneNumber: "",
    role: "",
    status: "",
  },
  product: {
    id: "",
    productPicture: "",
    productName: "",
    productDescription: "",
    price: "",
    cost: "",
    stock: "",
    lowStockLevel: "",
  },
  employee: {
    id: "",
    avatarUrl: "",
    name: "",
    email: "",
    position: "",
    address: "",
    phoneNumber: "",
    sex: "",
    birthdate: "",
    salary: "",
  },
  customer: {
    id: "",
    avatarUrl: "",
    name: "",
    email: "",
    address: "",
    phoneNumber: "",
    birthdate: "",
    sex: "",
    ordered: "",
    debit: "",
  },
  meter: {
    id: "",
    dateAM: "",
    meterAM: "",
    imageUrlAM: "",
    datePM: "",
    meterPM: "",
    imageUrlPM: "",
  },
  cart: [],
  // {
  //   id: "",
  //   productName: "",
  //   productPicture: "",
  //   price: "",
  //   stock: "",
  //   quantity: "",
  // },
};

const Context = createContext(initialState);

export const useValue = () => {
  return useContext(Context);
};

const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      dispatch({ type: "UPDATE_USER", payload: currentUser });
    }
  }, []);
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export default ContextProvider;
