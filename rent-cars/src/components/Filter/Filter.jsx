import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import css from "./Filter.module.css";

import { resetCars } from "../../redux/cars/slice";

import { filterBrandOptions } from "../../data/makes";
import { filterPriceOptions } from "../../data/price";

import Dropdown from "../Dropdown/Dropdown";

const Filter = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const [price, setPrice] = useState(searchParams.get("price"));
  const [from, setFrom] = useState(searchParams.get("from"));
  const [to, setTo] = useState(searchParams.get("to"));

  const [params] = useState({
    make: searchParams.get("make") ?? "",
    price: searchParams.get("price") ?? "",
    from: searchParams.get("from") ?? "",
    to: searchParams.get("to") ?? "",
  });

  for (var key in params) {
    if (!params[key]) {
      delete params[key];
    }
  }

  const handleSelectBrand = async (item) => {
    if (!params.make && item === "All") {
      return;
    }

    if (params.make === item) {
      return;
    }

    dispatch(resetCars());

    if (item === "All") {
      delete params["make"];
      setSearchParams(params);
      return;
    }

    params.make = item;
    setSearchParams(params);
  };

  const handleSearch = () => {
    price ? (params.price = price) : delete params["price"];
    from ? (params.from = from) : delete params["from"];
    to ? (params.to = to) : delete params["to"];
    setSearchParams(params);
  };

  return (
    <div className={css.container}>
      <div className={css.brandWrapper}>
        <span className={css.label}>Car brand</span>
        <Dropdown
          items={filterBrandOptions}
          defaultSelect={params?.make || "Select brand"}
          onSelect={handleSelectBrand}
        />
      </div>
      <div className={css.priceWrapper}>
        <span className={css.label}>Price/ 1 hour</span>
        <Dropdown
          items={filterPriceOptions}
          defaultSelect={price || "To $"}
          onSelect={setPrice}
        />
      </div>
      <div>
        <span className={css.label}>Car mileage / km</span>
        <div className={css.inputWrapper}>
          <label className={css.inputLabel} htmlFor="from">
            From
          </label>
          <input
            id="from"
            className={css.inputFrom}
            type="number"
            value={from || ""}
            onChange={(event) => setFrom(event.target.value)}
          />
        </div>
        <div className={css.inputWrapper}>
          <label className={css.inputLabel} htmlFor="to">
            To
          </label>
          <input
            id="to"
            className={css.inputTo}
            type="number"
            value={to || ""}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
      </div>
      <button className={css.btn} type="button" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default Filter;
