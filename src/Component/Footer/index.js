import styles from "./Footer.module.scss";
import classNames from "classnames/bind";
import logo from "../../images/output-onlinepngtools (1).png";
import { GithubIcon, InstagramIcon } from "../../icons";
const cx = classNames.bind(styles);
function Footer() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("top")}>
          <div className={cx("logo")}>
            <img src={logo} />
          </div>
          <div className={cx("main")}>
            <h3>Liên hệ: </h3>
            <ul>
              <li>
                <GithubIcon />
              </li>
              <li>
                <InstagramIcon />
              </li>
            </ul>
          </div>
        </div>
        <div className={cx("bottom")}>
          <span>©_2025</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;
