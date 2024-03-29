import { faker } from "@faker-js/faker";
import { sample } from "lodash";
import logo1 from "./assets/Fairways.jpg";

export const usersData = [...Array(100)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: faker.image.avatar(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password: faker.internet.password(),

  status: sample(["active", "banned"]),
  role: sample(["Admin", "Cashier"]),
}));

export const usersDatass = [
  {
    id: 1,
    avatarUrl: logo1,
    name: "dddd",
    email: "ddd",
    username: "dd",
    password: "dd",
    phoneNumber: "dd",
    status: "dd",
    role: "dd",
  },
];

export const productData = [...Array(100)].map((_, index) => ({
  id: faker.datatype.uuid(),
  productPicture: faker.image.cats(),
  productName: faker.commerce.productName(),
  productDescription: faker.commerce.productDescription(),
  unitOfMeasurement: sample([
    "Kilogram (kg)",
    "Liters (l)",
    "Meter (m)",
    "Per pieces (pcs)",
  ]),
  price: faker.commerce.price(100, 200, 0, "₱"),
  cost: faker.commerce.price(100, 200, 0, "₱"),
  stock: faker.datatype.number(),
  lowStockLevel: faker.datatype.number(),
}));
//Sample data static.  for Product List
export const productDataList = [
  {
    id: 1,
    productName: "Product ine",
    productDescription: "Description ine",
    price: 1020,
    stock: 122,
  },
  {
    id: 2,
    productName: "Product ine",
    productDescription: "Description ine",
    price: 100,
    stock: 3,
  },
  {
    id: 3,
    productName: "Product ine",
    productDescription: "Description ine",
    price: 13100,
    stock: 112,
  },
];

export const transactionsData = [...Array(100)].map((s_, index) => ({
  id: faker.datatype.uuid(),

  productName: faker.commerce.productName(),
  customerName: faker.name.fullName(),

  amount: faker.finance.amount(),
  transactionDescription: faker.finance.transactionDescription(),
  transactionDate: faker.date.birthdate({ min: 1980, max: 2008, mode: "year" }),
  transactionType: sample(["Cheque", "Cash", "Debit"]),
}));

export const salesData = [...Array(100)].map((_, index) => ({
  id: faker.datatype.uuid(),
  dateOfPurchase: faker.date.birthdate({
    min: 2021,
    max: 2022,
    mode: "year",
  }),
  customerName: faker.name.fullName(),
  productName: faker.commerce.productName(),
  quantity: faker.datatype.number(),
  price: faker.commerce.price(100, 200, 0, "₱"),
  amount: faker.finance.amount(),
}));

export const customerData = [...Array(100)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: faker.image.avatar(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  address: faker.address.country(),

  birthdate: faker.date.birthdate({ min: 1980, max: 2008, mode: "year" }),
  sex: faker.name.sexType(),
  ordered: faker.datatype.number(2000),
  debit: faker.datatype.number({ min: 1000, max: 50000 }),
}));

export const employeeData = [...Array(20)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: faker.image.avatar(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  position: sample(["Owner", "Cashier", "Driver", "Helper"]),
  address: faker.address.country(),

  sex: faker.name.sexType(),
  birthdate: faker.date.birthdate({ min: 1980, max: 2008, mode: "year" }),
  salary: faker.datatype.number({ min: 350, max: 700 }),
}));

//Home
export const homeData = [...Array(1)].map((_, index) => ({
  transactionCount: faker.datatype.number({ min: 1000, max: 5000 }),
  netSales: faker.finance.amount(1, 100000, 2),
  costOfProductSold: faker.finance.amount(1, 100000, 2),
  margin: faker.finance.amount(1, 100000, 2),
  expenses: faker.finance.amount(1, 100000, 2),
  profit: faker.finance.amount(1, 100000, 2),
  meterReadingYesterday: faker.datatype.number({ min: 1000, max: 40000 }),
  totalMeterReading: faker.datatype.number({ min: 1000, max: 50000 }),
}));

export const homeColorData = [...Array(15)].map((_, index) => ({
  cardColor: faker.color.rgb(),
}));

// , "₱"

//Meter Reading

export const meterData = [...Array(30)].map((_, index) => ({
  id: faker.datatype.uuid(),
  dateAM: faker.datatype.datetime(),
  meterAM: faker.datatype.number(),
  imageUrlAM: faker.image.cats(),
  datePM: faker.datatype.datetime(),
  meterPM: faker.datatype.number(),
  imageUrlPM: faker.image.animals(),
}));
