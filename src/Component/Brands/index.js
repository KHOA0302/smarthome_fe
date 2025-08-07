import styles from "./Brands.module.scss";
import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { brandService } from "../../api/brandService";
import Brand from "../Brand";
import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from "../../icons";
import { flushSync } from "react-dom";
const cx = classNames.bind(styles);
function Brands() {
  const [brands, setBrands] = useState([]);
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await brandService.getAllBrands();
        if (res.status === 200) {
          setBrands(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, []);

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("brands")}>
          {brands.map((brand, i) => {
            return (
              <Brand
                brand={brand}
                key={i}
                ref={index === i ? selectedRef : null}
                isActive={index === i}
              />
            );
          })}
        </div>
        <div className={cx("brand-tools")}>
          <button
            onClick={() => {
              flushSync(() => {
                if (index === 0) {
                  setIndex(brands.length - 1);
                } else {
                  setIndex(index - 1);
                }
              });
              selectedRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            }}
          >
            <ArrowCircleLeftIcon />
          </button>
          <button
            onClick={() => {
              flushSync(() => {
                if (index < brands.length - 1) {
                  setIndex(index + 1);
                } else {
                  setIndex(0);
                }
              });
              selectedRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            }}
          >
            <ArrowCircleRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Brands;
