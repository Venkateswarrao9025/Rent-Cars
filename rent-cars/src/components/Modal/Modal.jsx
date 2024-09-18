import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import css from "./Modal.module.css";
import Icon from "../Icon/Icon";

const modalRoot = document.querySelector("#root-modal");

const Modal = ({ onClose, data }) => {
  const modalRef = useRef(null);

  const {
    id,
    make,
    model,
    year,
    address,
    accessories,
    functionalities,
    rentalCompany,
    rentalPrice,
    img,
    type,
    mileage,
    engineSize,
    fuelConsumption,
    description,
    rentalConditions,
  } = data;

  const city = address.split(",")[1];
  const country = address.split(",")[2];
  const conditions = rentalConditions.split("\n");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") {
        onClose(false);
      }
    };

    const handleClose = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClose);
    document.body.classList.add("body-scroll-lock");
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClose);
      document.body.classList.remove("body-scroll-lock");
    };
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop}>
      <div
        ref={modalRef}
        className={css.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className={css.btnClose}
          onClick={() => onClose(false)}
          title="Close"
        >
          <Icon id="icon-close" width="24" height="24" />
        </button>
        <div className={css.content}>
          <img className={css.image} src={img} alt={model} />
          <h3 className={css.title}>
            {`${make} `}
            <span className={css.model}>{model}</span>
            {`, ${year}`}
          </h3>
          <div className={css.optionsWrapper}>
            <span className={css.option}>{city}</span>
            <span className={css.option}>{country}</span>
            <span className={css.option}>Id: {id}</span>
            <span className={css.option}>Year: {year}</span>
            <span className={css.option}>Type: {type}</span>
          </div>

          <div className={css.optionsWrapper}>
            <span className={css.option}>
              Fuel Consumption: {fuelConsumption}
            </span>
            <span className={css.option}>
              Engine Size: {engineSize}
              {rentalCompany}
            </span>
          </div>

          <p className={css.description}>{description}</p>

          <h4 className={css.optionsTitle}>Accessories and functionalities:</h4>

          <div className={css.optionsWrapper}>
            {accessories.map((item, i) => {
              return (
                <span key={i} className={css.option}>
                  {item}
                </span>
              );
            })}
          </div>

          <div className={css.optionsWrapper}>
            {functionalities.map((item, i) => {
              return (
                <span key={i} className={css.option}>
                  {item}
                </span>
              );
            })}
          </div>

          <h4 className={css.optionsTitle}>Rental Conditions: </h4>

          <div className={css.conditionsWrapper}>
            <span className={css.conditionsItem}>
              {conditions[0].split(":")[0]}:{" "}
              <span className={css.blue}>{conditions[0].split(":")[1]}</span>
            </span>
            <span className={css.conditionsItem}>{conditions[1]}</span>
          </div>

          <div className={css.conditionsWrapper}>
            <span className={css.conditionsItem}>{conditions[2]}</span>
            <span className={css.conditionsItem}>
              Mileage:{" "}
              <span className={css.blue}>
                {new Intl.NumberFormat("en-US").format(mileage)}
              </span>
            </span>
            <span className={css.conditionsItem}>
              Price: <span className={css.blue}>{rentalPrice}$</span>
            </span>
          </div>

          <a className={css.btn} href="tel:+380730000000">
            Rental car
          </a>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
