import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

import css from "./Modal.module.css";
import Icon from "../Icon/Icon";

const modalRoot = document.querySelector("#root-modal");

const Modal = ({ onClose, data }) => {
  const modalRef = useRef(null);

  const [ownerDetails, setOwnerDetails] = useState(null);

  const {
    _id,
    brand,
    model,
    year,
    type,
    mileage,
    engineSize,
    fuelConsumption,
    description,
    image,
    price,
    available
  } = data;

  const imPath = `http://localhost:5555/car/image/${_id}`;

  const handleRequestBooking = async () => {
    try {
        const response = await axios.post("http://localhost:5555/owner/requestBooking", {
            carId: data._id,
            message: `I would like to book the ${data.brand} ${data.model}.`,
        });

        setOwnerDetails(response.data.ownerDetails);
        alert(response.data.message);
        // alert("Booking request sent! The owner will be notified.");
    } catch (error) {
        console.error(error);
        alert("Failed to send booking request.");
    }
};

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
          <img className={css.image} src={imPath} alt={model} />
          {ownerDetails && (
                <div className={css.ownerDetails}>
                    <h4>Owner Details</h4>
                    <p>Name: {ownerDetails.name}</p>
                    <p>Phone: {ownerDetails.phone}</p>
                    <p>Email: {ownerDetails.email}</p>
                </div>
            )}
          <h3 className={css.title}>
            {`${brand} `}
            <span className={css.model}>{model}</span>
            {`, ${year}`}
          </h3>
          <div className={css.optionsWrapper}>
            <span className={css.option}>Id: {_id}</span>
            <span className={css.option}>Year: {year}</span>
            <span className={css.option}>Type: {type}</span>
            <span className={css.option}>Mileage: {mileage}</span>
          </div>

          <div className={css.optionsWrapper}>
            <span className={css.option}>Fuel Consumption: {fuelConsumption}</span>
            <span className={css.option}>Engine Size: {engineSize}</span>
            <span className={css.option}><b>Available: {available}</b></span>
          </div>

          <p className={css.description}>{description}</p>

          <div className={css.conditionsWrapper}>
            <span className={css.conditionsItem}>
              Price: <span className={css.blue}>{price}$</span>
            </span>
          </div>

          <button className={css.btn} onClick={handleRequestBooking}>
                    Request Booking
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
