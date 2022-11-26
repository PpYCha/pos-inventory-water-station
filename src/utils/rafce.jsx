import { id } from "date-fns/locale";
import React from "react";

const inputs = [
  {
    name: "name",
    id: "name",
  },
  {
    name: "id",
    id: "id",
  },
  {
    name: "email",
    id: "email",
  },
  {
    name: "password",
    id: "password",
  },
];

const rafce = () => {
  return (
    <div>
      {/* //Example 1  /*/}
      <input name="name" id="name" />
      <input name="id" id="id" />
      <input name="email" id="email" />
      <input name="password" id="password" />

      {/*Example 2  */}
      {inputs.map((key, index) => {
        <input key={index} name={key.name} id={key.id} />;
      })}
    </div>
  );
};

export default rafce;
