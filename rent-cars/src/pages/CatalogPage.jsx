import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { selectError } from "../redux/cars/selectors";

import Catalog from "../components/Catalog/Catalog";

const CatalogPage = () => {
  const error = useSelector(selectError);

  useEffect(() => {
    if (error) {
      toast.error(
        "Sorry, an error occurred on our website. Please try reloading the page."
      );
    }
  }, [error]);

  return (
    <main>
      <Catalog />
    </main>
  );
};

export default CatalogPage;
