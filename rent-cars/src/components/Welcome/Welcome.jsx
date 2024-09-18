import { Link } from "react-router-dom";

import css from "./Welcome.module.css";

const Welcome = () => {
  return (
    <main className={css.wrapper}>
      <div className={css.titleWrapper}>
        <h1 className={css.title}>Car Rental Company</h1>
        <p className={css.subTitle}>
          Navigate your journey, choose our rental for your comfort
        </p>
      </div>
      <Link className={css.btn} to="/catalog">
        Start Your Journey
      </Link>
    </main>
  );
};

export default Welcome;
