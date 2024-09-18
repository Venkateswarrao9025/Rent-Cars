import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import css from "./Favorites.module.css";

import { selectAllFavoritesCars } from "../../redux/favorites/selectors";

import Card from "../Card/Card";

const Favorites = () => {
  const cars = useSelector(selectAllFavoritesCars);

  return (
    <>
      <div className={css.container}>
        <section className={css.sectionCatalog}>
          {cars?.length > 0 ? (
            cars.map((car) => {
              return <Card key={car.id} data={car} />;
            })
          ) : (
            <p className={css.noSelect}>
              No selected cars yet. Explore our{" "}
              <Link to="/catalog">catalog</Link> now.
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default Favorites;
