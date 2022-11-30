const reducer = (state, action) => {
  switch (action.type) {
    case "OPEN_LOGIN":
      return { ...state, openLogin: true };
    case "CLOSE_LOGIN":
      return { ...state, openLogin: false };

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
          stock: "",
          lowStockLevel: "",
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

    default:
      throw new Error("No matched action!");
  }
};

export default reducer;
