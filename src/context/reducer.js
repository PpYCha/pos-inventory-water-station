const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_LOGIN":
      return { ...state, openLogin: true };
    case "CLOSE_LOGIN":
      return { ...state, openLogin: false };

    case "OPEN_PROFILE":
      return { ...state, openProfile: true };
    case "CLOSE_PROFILE":
      return { ...state, openProfile: false };

    case "OPEN_INVOICE":
      return { ...state, openInvoice: true };
    case "CLOSE_INVOICE":
      return { ...state, openInvoice: false };

    case "START_LOADING":
      return { ...state, loading: true };
    case "END_LOADING":
      return { ...state, loading: false };

    case "CURRENT_USER":
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload },
      };
    case "RESET_CURRENT_USER":
      return {
        ...state,
        currentUser: null,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case "RESET_USER":
      return {
        ...state,
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
      };

    case "UPDATE_PRODUCT":
      return {
        ...state,
        product: { ...state.product, ...action.payload },
      };

    case "RESET_PRODUCT":
      return {
        ...state,
        product: {
          id: "",
          productName: "",
          productPicture: "",
          productDescription: "",
          price: "",
          cost: "",
          stock: 0,
          lowStockLevel: "",
        },
      };
    case "UPDATE_INVENTORY":
      return {
        ...state,
        inventory: { ...state.inventory, ...action.payload },
      };

    case "RESET_INVENTORY":
      return {
        ...state,
        inventory: {
          id: "",
          inventoryProductName: "",
          inventoryProductDescription: "",
          inventoryPrice: "",
          inventoryQuantity: "",
          inventoryIn: "",
          inventoryOut: "",
        },
      };

    case "UPDATE_EMPLOYEE":
      return {
        ...state,
        employee: { ...state.employee, ...action.payload },
      };

    case "RESET_EMPLOYEE":
      return {
        ...state,
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
      };

    case "UPDATE_CUSTOMER":
      return {
        ...state,
        customer: { ...state.customer, ...action.payload },
      };

    case "RESET_CUSTOMER":
      return {
        ...state,
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
      };

    case "UPDATE_METER":
      return {
        ...state,
        meter: { ...state.meter, ...action.payload },
      };

    case "RESET_METER":
      return {
        ...state,
        meter: {
          id: "",
          dateAM: "",
          meterAM: "",
          imageUrlAM: "",
          datePM: "",
          meterPM: "",
          imageUrlPM: "",
        },
      };

    case "UPDATE_PRODUCTS":
      return {
        ...state,
        products: [...state.products, ...action.payload],
      };

    case "RESET_PRODUCTS":
      return {
        ...state,
        products: [],
      };

    case "UPDATE_PRODUCTS_LIST":
      return {
        ...state,
        productsList: [...state.productsList, ...action.payload],
      };

    case "RESET_PRODUCTS_LIST":
      return {
        ...state,
        productsList: [],
      };

    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, { ...action.payload, qty: 1 }] };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((c) => c.id !== action.payload.id),
      };
    case "CHANGE_CART_QTY":
      return {
        ...state,
        cart: state.cart.filter((c) =>
          c.id === action.payload.id ? (c.qty = action.payload.qty) : c.qty
        ),
      };

    case "RESET_CART":
      return {
        ...state,
        cart: [],
      };

    case "OPEN_CART":
      return { ...state, cartDialog: true };
    case "CLOSE_CART":
      return { ...state, cartDialog: false };

    case "UPDATE_EXPENSE":
      return {
        ...state,
        expense: { ...state.expense, ...action.payload },
      };
    case "RESET_EXPENSE":
      return {
        ...state,
        expense: {
          id: "",
          particular: "",
          amount: "",
          date: "",
        },
      };

    case "UPDATE_CUSTOMERINVOICE":
      return {
        ...state,
        customerInvoice: { ...state.customerInvoice, ...action.payload },
      };

    case "RESET_CUSTOMERINVOICE":
      return {
        ...state,
        customerInvoice: {
          id: "",
          amount: "",
          cart: [],
          date: "",
          time: "",
          tax: "",

          name: "",
          address: "",
          tin: "",
          phone: "",
          email: "",
        },
      };

    default:
      throw new Error("No matched action!");
  }
};

export default reducer;
