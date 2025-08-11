import Banners from "../../Component/Banners";
import Categories from "../../Component/Categories";
import styles from "./Home.module.scss";
import classNames from "classnames/bind";
import Products from "../../Component/Products";
import productService from "../../api/productService";
import DiscountEventAnnouncement from "../../Component/DiscountEventAnnouncement";
import Brands from "../../Component/Brands";
import { useLocation } from "react-router";
import { useEffect } from "react";
const cx = classNames.bind(styles);

function Home() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <Banners />
        <Categories />
        <Products
          fetchProduct={(number) => productService.getTopSale(number)}
          title="Sản phẩm bán chạy"
        />
        <Products
          fetchProduct={(number) => productService.getLatest(number)}
          title="Sản phẩm mới"
        />
        <DiscountEventAnnouncement />
        <Brands />
      </div>
    </div>
  );
}

export default Home;
