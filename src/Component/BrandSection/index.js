import { memo, useEffect, useState } from "react";
import styles from "./BrandSection.module.scss";
import classNames from "classnames/bind";
import { brandService } from "../../api/brandService";
import { uploadImageToFirebase } from "../../utils/firebaseUpload";
import { useProductInfoFormGetContext } from "../../Pages/Admin/ProductInfoForm";
const cx = classNames.bind(styles);

function BrandSection() {
  const { brands, setBrands } = useProductInfoFormGetContext();
  const [brand, setBrand] = useState({ name: "", img: "" });
  const [brandsModified, setBrandsModified] = useState([]);

  useEffect(() => {
    const newBrands = brands.map((b) => {
      return {
        ...b,
        isExist: false,
      };
    });
    setBrandsModified(newBrands);
  }, [brands]);

  const handleChangBrand = (e) => {
    let newBrand;
    switch (e.target.name) {
      case "brand-name":
        if (
          brands.some(
            (a) =>
              a.brand_name.toLowerCase().trim() ===
              e.target.value.toLowerCase().trim()
          )
        ) {
          newBrand = {
            ...brand,
            name: "",
          };
          const newBrandsModified = brandsModified.map((b) => {
            if (
              b.brand_name.toLowerCase().trim() ===
              e.target.value.toLowerCase().trim()
            ) {
              b.isExist = true;
            } else {
              b.isExist = false;
            }

            return b;
          });

          setBrandsModified(newBrandsModified);
          setBrand(newBrand);
        } else {
          newBrand = {
            ...brand,
            name: e.target.value,
          };
          setBrand(newBrand);
        }
        break;
      case "brand-img":
        newBrand = {
          ...brand,
          img: e.target.files[0],
        };
        setBrand(newBrand);
        break;
      default:
        break;
    }
  };

  const fetchCreateBrand = async (e) => {
    e.preventDefault();
    try {
      const updateBrands = {
        brand_name: brand.name,
        logo_url: await uploadImageToFirebase(brand.img, "brand"),
      };

      const res = await brandService.createBrand(updateBrands);

      if (res.status === 201) {
        const allBrands = res.data.data.allBrands;
        setBrands(allBrands);
        setBrand({ name: "", file: "" });
      }
    } catch (err) {
      console.error("Lỗi khi tạo brand:", err);
    }
  };

  const brandsHtml = brandsModified.map((b, id) => {
    return (
      <div key={id} className={cx({ ["brand-exist"]: b.isExist })}>
        <img src={b.logo_url} />
        <span>{b.brand_name}</span>
      </div>
    );
  });

  return (
    <form onSubmit={fetchCreateBrand}>
      <div className={cx("brand-form")}>
        <div className={cx("brand-wrapper")}>
          <div>
            <h1>Thương hiệu</h1>
            <div className={cx("brand-container")}>
              <div className={cx("brand-inputs")}>
                <input
                  type="text"
                  name="brand-name"
                  required
                  value={brand.name}
                  onChange={handleChangBrand}
                  placeholder="Nhập tên thương hiệu..."
                />

                <input
                  type="file"
                  name="brand-img"
                  onChange={handleChangBrand}
                  required
                />
              </div>
              <div className={cx("brands-exist")}>{brandsHtml}</div>
            </div>
          </div>
          <button type="submit">Gửi</button>
        </div>
      </div>
    </form>
  );
}

export default memo(BrandSection);
