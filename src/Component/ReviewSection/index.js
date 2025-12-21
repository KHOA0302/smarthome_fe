import styles from "./ReviewSection.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { reviewService } from "../../api/reviewService";
import { FullStarIcon, StarIcon } from "../../icons";
import userAvatar from "../../images/user-avatar.png";
const cx = classNames.bind(styles);

function calculateDateDifference(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  const differenceInMs = Math.abs(date1 - date2);

  const msInDay = 1000 * 60 * 60 * 24;

  const differenceInDays = Math.floor(differenceInMs / msInDay);

  return differenceInDays;
}
function ReviewSection({ productId, productName }) {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await reviewService.getReviews(productId);
      setReviews(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const averageStar =
    reviews.reduce((acc, review) => {
      return acc + review.rating;
    }, 0) / reviews.length;

  const starBreakdownPercent = (star) =>
    (reviews.reduce((acc, review) => {
      console.log(review.rating);
      if (review.rating === star) {
        return acc + 1;
      }
      return acc;
    }, 0) /
      reviews.length) *
    100;

  const starList = [5, 4, 3, 2, 1];

  const userRatedStar = (numberStar) => {
    let result = [];
    const totalLength = 5;

    for (let i = 1; i <= totalLength; i++) {
      if (i <= numberStar) {
        result = [...result, <FullStarIcon key={i} />];
      } else {
        result = [...result, <StarIcon key={i} />];
      }
    }

    return result;
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <h4>Đánh giá {productName}</h4>
        <div className={cx("rating")}>
          <div className={cx("rating-average")}>
            <div className={cx("top")}>
              <FullStarIcon />
              <span>{!!averageStar ? averageStar.toFixed(1) : 0}</span>
              <span>/5</span>
            </div>
            <span className={cx("bottom")}>{reviews.length} đánh giá</span>
          </div>
          <div className={cx("rating-breakdown")}>
            {starList.map((star) => {
              return (
                <div className={cx("rating-breakdown-bar")} key={star}>
                  <span>
                    {star}
                    <FullStarIcon />
                  </span>
                  <div className={cx("percent-bar")}>
                    <div
                      className={cx("fill-bar")}
                      style={{
                        width: `${
                          reviews.length && starBreakdownPercent(star)
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span
                    style={{
                      placeContent: "end",
                    }}
                  >
                    {reviews.length && starBreakdownPercent(star).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cx("comment")}>
          {reviews.map((review, id) => {
            if (!!review.comment_text) {
              const user = review.user;
              const usedTime = calculateDateDifference(
                review.created_at,
                review.order_item.order.updated_at
              );
              return (
                <div className={cx("comment-box")} key={id}>
                  <div className={cx("left-box")}>
                    <div className={cx("user-avatar")}>
                      <img src={user.avatar ? user.avatar : userAvatar} />
                    </div>
                  </div>
                  <div className={cx("right-box")}>
                    <div className={cx("top")}>
                      <div className={cx("username")}>
                        <span>{user.full_name}</span>
                      </div>
                      <div className={cx("user-rating")}>
                        {userRatedStar(review.rating)}
                      </div>
                    </div>
                    <div className={cx("bottom")}>
                      <div className={cx("user-comment")}>
                        {review.comment_text}
                      </div>
                      <div className={cx("user-used_time")}>
                        Đã sử dụng {usedTime} ngày tính từ lúc nhận hàng
                      </div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default ReviewSection;
