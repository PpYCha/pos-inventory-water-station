import { faker } from "@faker-js/faker";
import { sample } from "lodash";

export const productData = [
  { id: 1, product_name: "Gallon", price: 12, stock: 1 },
];

// export const customerData = [
//   {
//     id: 1,
//     full_name: "Phoebekim Cano",
//     address: "Bobon",
//     ordered: 133,
//   },
//   {
//     id: 2,
//     full_name: "Juby Ann Delos Santos",
//     address: "Bobon",
//     ordered: 133,
//   },
// ];

// export const employeeData = [
//   {
//     id: 1,
//     employee_name: "Jason Olesco",
//     position: "Casher",
//     employee_address: "Catarman",
//     salary: 450,
//     date_hired: "August 21, 2022",
//     branch_assigned: "Dalakit Branch",
//   },
//   {
//     id: 2,
//     employee_name: "Frank Esteron",
//     position: "Driver",
//     employee_address: "Catarman",
//     salary: 350,
//     date_hired: "August 21, 2022",
//     branch_assigned: "Dalakit Branch",
//   },
//   {
//     id: 3,
//     employee_name: "Frank Esteron",
//     position: "Driver",
//     employee_address: "Catarman",
//     salary: 350,
//     date_hired: "August 21, 2022",
//     branch_assigned: "Dalakit Branch",
//   },
// ];

export const customerData = [...Array(20)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: faker.image.avatar(),
  full_name: faker.name.fullName(),
  email: faker.internet.email(),
  address: faker.address.country(),
  phoneNumber: faker.phone.phoneNumber("(+63)9##-###-####"),
  sex: faker.name.sexType(),
  birthdate: faker.date.birthdate({ min: 1980, max: 2008, mode: "year" }),
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

export const usersData = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/static/mock-images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  sex: faker.name.sexType(),
  isVerified: faker.datatype.boolean(),
  status: sample(["active", "banned"]),
  role: sample(["Admin", "Cashier"]),
}));
