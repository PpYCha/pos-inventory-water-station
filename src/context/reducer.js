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
          email: "",
          password: "",
          phoneNumber: "",
          role: "",
          status: "",
        },
      };

    default:
      throw new Error("No matched action!");
  }
};

export default reducer;
