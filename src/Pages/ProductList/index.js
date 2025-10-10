import { useEffect, useState } from "react";
import styles from "./ProductList.module.scss";
import classNames from "classnames/bind";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import productService from "../../api/productService";
import { formatNumber } from "../../utils/formatNumber";
import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from "../../icons";

const cx = classNames.bind(styles);

function PagesNavigate({ currentPage, totalPages }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (totalPages < 4) {
    return (
      <div className={cx("pages")}>
        <ArrowCircleLeftIcon />
        <ul>
          {pageNumbers.map((number) => (
            <li className={cx({ active: number === currentPage })}>{number}</li>
          ))}
        </ul>
        <ArrowCircleRightIcon />
      </div>
    );
  }
}

function Product({ variant, saleVolume }) {
  const navigate = useNavigate();

  return (
    <div className={cx("variant-wrapper")}>
      <div className={cx("variant-container")}>
        <div
          className={cx("variant")}
          onClick={() =>
            navigate(
              `/product/${variant.product_id}/variant/${variant.variant_id}`
            )
          }
        >
          <div className={cx("variant-img")}>
            <img src={variant.image_url} />
          </div>
          <div className={cx("variant-main")}>
            <span className={cx("variant-name")}>{variant.variant_name}</span>
            <div className={cx("variant-sold")}>
              <span>{formatNumber(parseInt(variant.price))}đ</span>
              <span> {saleVolume} đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ProductList() {
  const { category_slug, category_id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilters] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalVariants, setTotalVariants] = useState(0);
  const [totalPages, setTotalPages] = useState(currentPage);
  const [fetchBody, setFetchBody] = useState({
    categoryId: category_id,
    brandId: null,
  });

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await productService.getProductByFilter(fetchBody);
        if (res.status === 200) {
          setProducts(res.data.products);
          setTotalPages(res.data.totalPages);
          setTotalVariants(res.data.totalVariants);
          setTotalProducts(res.data.totalProducts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetch();
  }, [fetchBody]);

  if (products.length < 1) {
    return (
      <div className={cx("wrapper")}>
        <div className={cx("path-name")}>
          <Link to="/">Home</Link>
          <span>{" › "}</span>
          <span>
            {category_slug}({totalVariants})
          </span>
        </div>
        <h2>Không có sản phẩm</h2>
      </div>
    );
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("path-name")}>
        <Link to="/">Home</Link>
        <span>{" › "}</span>
        <span>
          {category_slug.replace("_", " ")}({totalVariants})
        </span>
      </div>
      <div className={cx("container")}>
        <div
          className={cx("product")}
          style={{
            gridTemplateColumns: "repeat(5, 1fr)",
          }}
        >
          {products.map((product, id) => {
            return product.variants.map((variant, i) => {
              return (
                <Product
                  variant={variant}
                  saleVolume={product.sale_volume}
                  key={i}
                />
              );
            });
          })}
        </div>
      </div>
      <div className={cx("pages-wrapper")}>
        <PagesNavigate currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

export default ProductList;
