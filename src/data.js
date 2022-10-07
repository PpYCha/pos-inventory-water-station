import { faker } from "@faker-js/faker";
import { sample } from "lodash";

export const usersData = [...Array(10)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: faker.image.avatar(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  phoneNumber: faker.phone.phoneNumber("(+63)9##-###-####"),
  status: sample(["active", "banned"]),
  role: sample(["Admin", "Cashier"]),
}));

export const productData = [...Array(100)].map((_, index) => ({
  id: faker.datatype.uuid(),
  productName: faker.commerce.productName(),
  productDescription: faker.commerce.productDescription(),
  price: faker.commerce.price(100, 200, 0, "₱"),
  stock: faker.datatype.number(),
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
  full_name: faker.name.fullName(),
  email: faker.internet.email(),
  address: faker.address.country(),
  phoneNumber: faker.phone.phoneNumber("(+63)9##-###-####"),
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
  phoneNumber: faker.phone.phoneNumber("(+63)9##-###-####"),
  sex: faker.name.sexType(),
  birthdate: faker.date.birthdate({ min: 1980, max: 2008, mode: "year" }),
  salary: faker.datatype.number({ min: 350, max: 700 }),
}));
