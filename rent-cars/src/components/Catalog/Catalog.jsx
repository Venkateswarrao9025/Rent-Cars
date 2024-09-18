import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import css from "./Catalog.module.css";

import { getAllCarsThunk } from "../../redux/cars/operations";
import { resetCars, incPage } from "../../redux/cars/slice";
import {
  selectAllCars,
  selectLoading,
  selectPage,
} from "../../redux/cars/selectors";

import Card from "../Card/Card";
import Filter from "../Filter/Filter";
import Loader from "../Loader/Loader";

const Catalog = () => {
  const [searchParams] = useSearchParams();

  const make = searchParams.get("make");
  const price = searchParams.get("price");
  const from = searchParams.get("from") ?? 1;
  const to = searchParams.get("to") ?? 999999999;

  const cars = useSelector(selectAllCars);
  const isLoading = useSelector(selectLoading);
  const page = useSelector(selectPage);

  const [filteredCars, setFilteredCars] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCarsThunk({ page, make }));
  }, [dispatch, page, make]);

  useEffect(() => {
    return () => {
      dispatch(resetCars());
    };
  }, [dispatch]);

  useEffect(() => {
    let tempCars = [...cars];

    if (price) tempCars = tempCars.filter((car) => car.rentalPrice <= price);

    if (from && to)
      tempCars = tempCars.filter(
        (car) => car.mileage >= from && car.mileage <= to
      );

    setFilteredCars(tempCars);
  }, [cars, price, from, to]);

  const handleLoadMore = () => {
    dispatch(incPage());
  };

  return (
    <>
      <div className={css.container}>
        <Filter />
        <section className={css.sectionCatalog}>
          {filteredCars &&
            filteredCars.map((car) => {
              return <Card key={car.id} data={car} />;
            })}
        </section>
        {page < 3 && !make && (
          <button className={css.btn} type="button" onClick={handleLoadMore}>
            Load more
          </button>
        )}
      </div>
      {isLoading && <Loader />}
    </>
  );
};

export default Catalog;
