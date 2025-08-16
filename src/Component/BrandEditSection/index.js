import { useEffect, useRef, useState } from "react";
import styles from "./BrandEditSection.module.scss";
import classNames from "classnames/bind";
import { brandService } from "../../api/brandService";
import errImg from "../../images/no_img.png";
import { TrashIcon } from "../../icons";
import toast, { Toaster } from "react-hot-toast";
import {
  deleteImageFromFirebase,
  uploadImageToFirebase,
} from "../../utils/firebaseUpload";
const cx = classNames.bind(styles);

const searchBrands = (brands, searchString) => {
  if (!searchString) {
    return brands;
  }

  const normalizedSearchString = searchString.toLowerCase();

  return brands.filter((brand) => {
    const normalizedBrandName = brand.brand_name.toLowerCase();
    return normalizedBrandName.includes(normalizedSearchString);
  });
};

function BrandEditSection() {
  const fileInputRef = useRef(null);
  const [brands, setBrands] = useState([]);
  const [brandSearchResult, setBrandSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [brandSelected, setBrandSelected] = useState({
    brand_id: "",
    brand_name: "",
    logo_url: "",
    isRemove: false,
  });

  const fetch = async () => {
    try {
      const res = await brandService.getAllBrands();
      setBrands(res.data.data);
      setBrandSearchResult(res.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleSearchBrands = (e) => {
    setShowSearchResult(true);
    const searchResult = searchBrands(brands, e.target.value);
    setBrandSearchResult(searchResult);
  };

  const handleBrandSelected = (brand) => {
    setBrandSelected(brand);
    setShowSearchResult(false);
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempImageUrl = URL.createObjectURL(file);
    const newBrandSelected = {
      ...brandSelected,
      logo_url: tempImageUrl,
      imgFile: file,
    };
    setBrandSelected(newBrandSelected);
  };

  const handleChangeBrandName = (e) => {
    setBrandSelected((prev) => ({ ...prev, brand_name: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandSelected.brand_id) {
      toast.error("Vui lòng chọn một thương hiệu để chỉnh sửa.");
      return;
    }

    try {
      let finalBrandData;
      const submitPromise = new Promise(async (resolve, reject) => {
        try {
          finalBrandData = { ...brandSelected };
          let oldLogoUrl = null;

          if (finalBrandData.imgFile) {
            const oldBrand = brands.find(
              (b) => b.brand_id === finalBrandData.brand_id
            );
            if (oldBrand) {
              oldLogoUrl = oldBrand.logo_url;
            }

            const newLogoUrl = await uploadImageToFirebase(
              finalBrandData.imgFile,
              "brand"
            );
            finalBrandData.logo_url = newLogoUrl;
          }

          const res = await brandService.editBrand(finalBrandData);

          if (oldLogoUrl) {
            deleteImageFromFirebase(oldLogoUrl);
          }

          resolve(res.data.message);
        } catch (error) {
          if (finalBrandData && finalBrandData.imgFile) {
            deleteImageFromFirebase(finalBrandData.logo_url);
          }
          reject(error);
        }
      });

      await toast.promise(submitPromise, {
        loading: "Đang xử lý...",
        success: (message) => {
          setBrandSelected({
            brand_id: "",
            brand_name: "",
            logo_url: "",
            isRemove: false,
            imgFile: null,
          });
          fetch();
          return message;
        },
        error: (err) => {
          return err.response?.data?.message || "Đã xảy ra lỗi không xác định.";
        },
      });
    } catch (error) {}
  };

  return (
    <div className={cx("wrapper")}>
      <h1>Thương hiệu</h1>
      <div className={cx("container")}>
        <div className={cx("brand-selects")}>
          <input
            placeholder="Nhập tên brand..."
            id="brand"
            autoComplete="off"
            onChange={handleSearchBrands}
            onFocus={() => setShowSearchResult(true)}
            onBlur={() => setShowSearchResult(false)}
            onClick={() => setShowSearchResult(true)}
            required
          />
          <ul className={cx("brand-search", { show: showSearchResult })}>
            {brandSearchResult.map((brand, id) => {
              return (
                <li
                  className={cx({
                    active: brand.brand_id === brandSelected.brand_id,
                  })}
                  onClick={() => handleBrandSelected(brand)}
                  onMouseDown={(e) => e.preventDefault()}
                  key={brand.brand_id}
                >
                  {brand.brand_name.toUpperCase()}
                </li>
              );
            })}
          </ul>
        </div>
        <form className={cx("brand-form")} onSubmit={handleSubmit}>
          <div
            className={cx("brand-selected", {
              remove: brandSelected.isRemove,
            })}
          >
            <div className={cx("brand-selected-wrapper")}>
              <div className={cx("brand-input")}>
                <input
                  key={brandSelected.brand_id}
                  value={brandSelected.brand_name}
                  id="brand-selected"
                  onChange={handleChangeBrandName}
                  required
                />
              </div>
              <div className={cx("brand-img")}>
                <div className={cx("brand-img-blank")}>
                  <img
                    key={brandSelected.logo_url}
                    src={
                      !!brandSelected.logo_url ? brandSelected.logo_url : errImg
                    }
                  />
                  <div className={cx("img-cover")}>
                    <button type="button" onClick={handleAddImageClick}>
                      ĐỔI
                    </button>
                  </div>
                </div>
              </div>
              <button
                className={cx("brand-delete")}
                onClick={() =>
                  setBrandSelected((prev) => ({
                    ...prev,
                    isRemove: !brandSelected.isRemove,
                  }))
                }
                type="button"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
          <button type="submit">SUBMIT</button>
        </form>
      </div>
      <Toaster position="top-right" reverseOrder={true} />
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
}

export default BrandEditSection;
