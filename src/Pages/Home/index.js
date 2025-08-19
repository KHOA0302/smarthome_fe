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
import { useInView } from "react-intersection-observer";
const cx = classNames.bind(styles);

function Home() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { ref: topSaleRef, inView: topSaleInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: latestRef, inView: latestInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: discountRef, inView: discountInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { ref: brandRef, inView: brandInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <Banners />
        <Categories />
        <div
          ref={topSaleRef}
          className={cx("reveal-section", { "is-visible": topSaleInView })}
        >
          <Products
            fetchProduct={(number) => productService.getTopSale(number)}
            title="Sản phẩm bán chạy"
          />
        </div>
        <div
          ref={latestRef}
          className={cx("reveal-section", { "is-visible": latestInView })}
        >
          <Products
            fetchProduct={(number) => productService.getLatest(number)}
            title="Sản phẩm mới"
          />
        </div>

        <div
          ref={discountRef}
          className={cx("reveal-section", { "is-visible": discountInView })}
        >
          <DiscountEventAnnouncement />
        </div>

        <div
          ref={brandRef}
          className={cx("reveal-section", { "is-visible": brandInView })}
        >
          <Brands />
        </div>
      </div>
    </div>
  );
}

export default Home;
