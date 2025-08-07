import { useEffect, useRef, useState } from "react";
import styles from "./Banners.module.scss";
import classNames from "classnames/bind";
import { categoryService } from "../../api/categoryService";
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
  DotBigIcon,
} from "../../icons";
const cx = classNames.bind(styles);

function Banner({ banner }) {
  return (
    <div className={cx("banner")}>
      <img src={banner.banner} className={cx("banner-img")} />
      <div className={cx("banner-slogan")}>
        <span>{banner.slogan}</span>
        <button>Tìm hiểu thêm</button>
      </div>
    </div>
  );
}
function Banners() {
  const bannersRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const resCate = await categoryService.getAllCategories();
        if (resCate.status === 200) {
          const fetchBanners = [
            ...resCate.data.data.filter(
              (banner) => banner.showable && !!banner.banner
            ),
          ];
          setBanners([...fetchBanners]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  const handleNext = () => {
    if (currentBanner === banners.length) {
      setCurrentBanner(1);
      return;
    }
    setCurrentBanner((prev) => prev + 1);
  };

  const handlePrev = () => {
    console.log(currentBanner);
    if (currentBanner === 1) {
      setCurrentBanner(banners.length);
      return;
    }
    setCurrentBanner((prev) => prev - 1);
  };

  const dotsHtml = banners.map((_, id) => {
    return (
      <button
        className={cx({ active: currentBanner === id + 1 })}
        key={id}
        onClick={() => setCurrentBanner(id + 1)}
      >
        <DotBigIcon />
      </button>
    );
  });

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("banners-tools")}>
          <button onClick={handlePrev}>
            <ArrowCircleLeftIcon />
          </button>
          <button onClick={handleNext}>
            <ArrowCircleRightIcon />
          </button>
        </div>
        <div
          className={cx("banners", { transition: true })}
          ref={bannersRef}
          style={{
            transform: `translateX(-${currentBanner * 100 - 100}%)`,
          }}
        >
          {banners.map((banner, id) => {
            return <Banner banner={banner} key={id} />;
          })}
        </div>

        <div className={cx("banner-current")}>
          <div className={cx("banner-dots")}> {dotsHtml}</div>
        </div>
      </div>
    </div>
  );
}

export default Banners;
