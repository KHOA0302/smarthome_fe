import classNames from "classnames/bind";
import styles from "./OrderList.module.scss";
import { Fragment, useEffect, useState } from "react";
import { formatNumber } from "../../utils/formatNumber";
import {
  ArrowRightIcon,
  CommentCheckIcon,
  CommentIcon,
  ExistIcon,
  FullStarIcon,
  StarIcon,
} from "../../icons";
import orderService from "../../api/orderService";
import { toast } from "react-toastify";
import { AiOutlineComment } from "react-icons/ai";
import { Toaster } from "react-hot-toast";
import axiosClient from "../../api/axiosClient";
import { reviewService } from "../../api/reviewService";

const cx = classNames.bind(styles);

function TableTitleAdmin() {
  return (
    <tr>
      <th>Mã đơn</th>
      <th>Sản phẩm</th>
      <th>Trạng thái</th>
      <th>Thanh toán</th>
      <th>Ngày tạo</th>
      <th>Tên</th>
      <th>Số điện thoại</th>
      <th>Địa chỉ</th>
      <th>Email</th>
      <th></th>
    </tr>
  );
}

function TableTitleCustomer({ next }) {
  return (
    <tr>
      <th>Mã đơn</th>
      <th>Sản phẩm</th>
      <th>Trạng thái</th>
      <th>Thanh toán</th>
      <th
        style={{
          borderTopRightRadius: "4px",
        }}
      >
        Ngày tạo
      </th>
    </tr>
  );
}

function TableProduct({ orderItems, setShowProduct, showProduct, orderId }) {
  return (
    <div
      className={cx("product-cover", {
        show: showProduct === orderId,
      })}
    >
      <div className={cx("cover-blank")}>
        <div className={cx("table-product")}>
          <button
            className={cx("exist-btn")}
            onClick={() => setShowProduct("")}
          >
            <ExistIcon />
          </button>
          <table>
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Dịch vụ</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <img src={item.image_url} />
                    </td>
                    <td>{item.variant_name}</td>
                    <td>
                      <ul>
                        {item.orderItemServices.map((service, id) => {
                          return (
                            <li key={id}>
                              <ArrowRightIcon />
                              <span>
                                {
                                  service.packageServiceItem.serviceDefinition
                                    .service_name
                                }
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                    <td>{item.quantity}</td>

                    <td>{formatNumber(parseInt(item.total_price))}đ</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ item, id, reviewsData, setReviewsData }) {
  const reviewData = reviewsData[id];
  const handleRating = (star) => {
    const newReviewsData = reviewsData.map((review, index) => {
      if (index === id) {
        return {
          ...review,
          rating: star,
        };
      }
      return { ...review };
    });
    setReviewsData(newReviewsData);
  };

  const handelComment = (e) => {
    const newReviewsData = reviewsData.map((review, index) => {
      if (index === id) {
        return {
          ...review,
          comment: e.target.value,
        };
      }
      return { ...review };
    });
    setReviewsData(newReviewsData);
  };

  return (
    <div className={cx("review-element")} key={id}>
      <div className={cx("review-product_img")}>
        <img src={item.image_url} />
      </div>
      <div className={cx("review-content")}>
        <h4>{item.variant_name}</h4>
        <ul className={cx("review-stars")}>
          {[...Array(5)].map((_, index) => {
            const Star =
              index + 1 > reviewData?.rating ? StarIcon : FullStarIcon;
            return (
              <li
                key={index}
                className={cx("star", {
                  full: index + 1 <= reviewData?.rating,
                })}
                onMouseEnter={() => handleRating(index + 1)}
              >
                <Star />
              </li>
            );
          })}
        </ul>
        <textarea
          className={cx("review-textarea")}
          id="textarea"
          name="comment"
          value={reviewData?.comment}
          onChange={handelComment}
        ></textarea>
      </div>
    </div>
  );
}

function TableReview({ orderItems, showReview, setShowReview, orderId }) {
  const [reviewsData, setReviewsData] = useState([]);

  useEffect(() => {
    const reviewsDataGen = orderItems.map((item) => {
      const review = item.reviews;
      return {
        order_item_id: item.order_item_id,
        product_id: item.product_id,
        rating: review ? review.rating : 0,
        comment: review ? review.comment_text : "",
      };
    });

    setReviewsData(reviewsDataGen);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const notRating = reviewsData.some((review) => review.rating === 0);

    if (notRating) {
      toast("Vui lòng đánh giá sao!⭐", {
        icon: "⭐",
        duration: 3000,
      });
      return;
    }

    try {
      const fetch = await reviewService.createReview(reviewsData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      className={cx("review-cover", {
        show: showReview === orderId,
      })}
      onSubmit={handleSubmit}
    >
      <div className={cx("review-wrapper")}>
        <div className={cx("review-container")}>
          {orderItems.map((item, id) => (
            <ReviewItem
              key={id}
              item={item}
              id={id}
              reviewsData={reviewsData}
              setReviewsData={setReviewsData}
            />
          ))}
        </div>
        <div className={cx("review-button")}>
          <button type="submit">LƯU</button>
          <button type="button" onClick={() => setShowReview("")}>
            THOÁT
          </button>
        </div>
      </div>
      <Toaster />
    </form>
  );
}

const lookupTableTitle = {
  admin: TableTitleAdmin,
  customer: TableTitleCustomer,
};
const lookupOrderNextStage = {
  pending: "preparing",
  preparing: "shipping",
  shipping: "completed",
};
const lookupColor = {
  pending: "#f0d821",
  preparing: "#eb8c1b",
  shipping: "#2880ea",
  completed: "#1bb052",
  cancel: "#fe6347",
};
function OrderList({ orders, setOrders, role = "customer" }) {
  const isAdmin = role === "admin";
  const TableTile = lookupTableTitle[role];
  const [showProduct, setShowProduct] = useState("");
  const [showReview, setShowReview] = useState("");
  const [showAddress, setShowAddress] = useState("");

  const handleOrderStatus = (orderId, status) => {
    const newOrders = orders.map((order) => {
      if (order.order_id === orderId) {
        return {
          ...order,
          order_status: status,
        };
      }
      return order;
    });

    const editPromise = orderService.editOrderStatus(orderId, status);
    toast
      .promise(editPromise, {
        pending: "Đang chuyển trạn thái đơn hàng...",
        success: "Thay đổi trạng thái đơn hàng thành công! 🎉",
        error: "",
      })
      .then((res) => {
        if (res.status === 200) {
          setOrders([...newOrders]);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi tải đơn hàng:", error);
      });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("table")}>
          <table>
            <thead>
              <TableTile />
            </thead>
            <tbody>
              {orders.map((order, id) => {
                return (
                  <tr key={id}>
                    <td>{order.order_id}</td>
                    <td>
                      <button onClick={() => setShowProduct(id)}>
                        Xem sản phẩm
                      </button>
                    </td>
                    <td
                      style={{
                        color: `${lookupColor[order.order_status]}`,
                      }}
                    >
                      {order.order_status}
                    </td>
                    <td>{formatNumber(parseInt(order.order_total))}đ</td>
                    <td>
                      {new Date(order.created_at).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    {isAdmin && (
                      <Fragment>
                        <td>
                          {!!order.user_id
                            ? order.user.full_name
                            : order.guest_name}
                        </td>
                        <td>
                          {!!order.user_id
                            ? order.user.phone_number
                            : order.guest_phone}
                        </td>
                        <td>
                          <button onClick={() => setShowAddress(id)}>
                            Xem địa chỉ
                          </button>
                        </td>
                        <td>
                          {!!order.user_id ? order.user.email : "(tk khách)"}
                        </td>
                        <td>
                          {order.order_status === "cancel" ||
                          order.order_status === "completed" ? (
                            <button style={{ backgroundColor: "red" }}>
                              xóa
                            </button>
                          ) : (
                            <button> cancel</button>
                          )}

                          {!!lookupOrderNextStage[order.order_status] && (
                            <button
                              onClick={() =>
                                handleOrderStatus(
                                  order.order_id,
                                  lookupOrderNextStage[order.order_status]
                                )
                              }
                              style={{
                                background: `${
                                  lookupColor[
                                    lookupOrderNextStage[order.order_status]
                                  ]
                                }`,
                              }}
                            >
                              {lookupOrderNextStage[order.order_status]}
                            </button>
                          )}
                        </td>
                      </Fragment>
                    )}
                    <td>
                      <TableProduct
                        orderItems={order.orderItems}
                        setShowProduct={setShowProduct}
                        showProduct={showProduct}
                        orderId={id}
                      />
                    </td>

                    {!isAdmin && (
                      <td>
                        <button
                          type="button"
                          className={cx("review-btn", {
                            commented: order.orderItems.some(
                              (item) => item.reviews !== null
                            ),
                          })}
                          onClick={() => setShowReview(id)}
                        >
                          {order.orderItems.some(
                            (item) => item.reviews === null
                          ) ? (
                            <CommentIcon />
                          ) : (
                            <CommentCheckIcon />
                          )}
                        </button>
                      </td>
                    )}
                    <td>
                      <TableReview
                        orderItems={order.orderItems}
                        showReview={showReview}
                        setShowReview={setShowReview}
                        orderId={id}
                      />
                    </td>

                    {isAdmin && (
                      <td>
                        <div
                          className={cx("address-cover", {
                            show: id === showAddress,
                          })}
                        >
                          <div className={cx("cover-blank")}>
                            <div className={cx("table-address")}>
                              <button
                                className={cx("exist-btn-address")}
                                onClick={() => setShowAddress("")}
                              >
                                <ExistIcon />
                              </button>
                              <table>
                                <thead>
                                  <tr>
                                    <th>Tên</th>
                                    <th>Tỉnh</th>
                                    <th>Huyện</th>
                                    <th>Số nhà</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      {!!order.user_id
                                        ? order.user.full_name
                                        : order.guest_name}
                                      {}
                                    </td>
                                    <td>
                                      {!!order.user_id
                                        ? order.user.province
                                        : order.guest_province}
                                    </td>
                                    <td>
                                      {!!order.user_id
                                        ? order.user.district
                                        : order.guest_district}
                                    </td>
                                    <td>
                                      {!!order.user_id
                                        ? order.user.house_number
                                        : order.guest_house_number}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderList;
