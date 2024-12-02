import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addCar, deleteCar } from "../../redux/favorites/slice";
import { selectAllFavoritesCars } from "../../redux/favorites/selectors";

import css from "./Card.module.css";

import Modal from "../Modal/Modal";
import Icon from "../Icon/Icon";

const Card = ({ data }) => {
  const {
    _id,
    brand,
    model,
    year,
    type,
    mileage,
    price,
    image,
  } = data;

  const imPath = `http://localhost:5555/car/image/${_id}`;

  const dispatch = useDispatch();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const favoritesCars = useSelector(selectAllFavoritesCars);

  useEffect(() => {
    if (favoritesCars.find((car) => car._id === _id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [favoritesCars, dispatch, _id]);

  const handleFavClick = () => {
    if (favoritesCars.find((car) => car._id === _id)) {
      dispatch(deleteCar(data._id));
    } else {
      dispatch(addCar(data));
    }
  };

  const handleMore = () => {
    setIsShowModal(true);
  };

  return (
    <div className={css.wrapper}>
      <div>
        <img className={css.image} src={imPath} alt={model} width="274" />
        <div className={css.titleWrapper}>
          <h3 className={css.title}>
            {`${brand} `}
            <span className={css.model}>{model}</span>
            {`, ${year}`}
          </h3>
          <span className={css.price}>${price}</span>
        </div>
        <div>
          <div className={css.optionsWrapper}>
            <span className={css.option}>Type: {type}</span>
            <span className={css.option}>Mileage: {mileage}</span>
          </div>
        </div>
        <button className={css.btn} onClick={handleMore}>
          Learn more
        </button>
      </div>
      <button
        className={isFavorite ? css.btnFavActive : css.btnFav}
        onClick={handleFavClick}
      >
        <Icon id="icon-fav" width="18" height="18" />
      </button>
      {isShowModal && <Modal onClose={setIsShowModal} data={data} />}
    </div>
  );
};

export default Card;
