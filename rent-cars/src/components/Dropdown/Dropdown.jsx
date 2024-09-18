import React, { useEffect, useRef, useState } from "react";

import css from "./Dropdown.module.css";
import Icon from "../Icon/Icon";

const ListDropdown = React.forwardRef(({ items, onSelect, onClose }, ref) => {
  const listRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Escape") {
        onClose(false);
      }
    };

    const handleClose = (event) => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target) &&
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        onClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClose);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClose);
    };
  }, [onClose]);

  return (
    <div className={css.listWrapper} ref={listRef}>
      <ul className={css.list}>
        {items.map((item) => {
          return (
            <li key={item} className={css.item} onClick={() => onSelect(item)}>
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
});

const Dropdown = ({ items = [], defaultSelect, onSelect }) => {
  const [isOpenList, setIsOpenList] = useState(false);
  const [selectText, setSelectText] = useState(defaultSelect);

  const btnRef = useRef(null);

  const handleSelect = (item) => {
    onSelect(item);
    setSelectText(item);
    setIsOpenList(false);
  };

  return (
    <div className={css.wrapper}>
      <button
        className={css.btn}
        onClick={() => {
          setIsOpenList(!isOpenList);
        }}
        ref={btnRef}
      >
        {selectText}
        <Icon id="icon-dropdown" width="20" height="20" />
      </button>
      {isOpenList && (
        <ListDropdown
          items={items}
          onSelect={handleSelect}
          onClose={() => setIsOpenList(false)}
          ref={btnRef}
        />
      )}
    </div>
  );
};

export default Dropdown;
