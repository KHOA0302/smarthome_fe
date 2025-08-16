import Login from "./Pages/Auth/Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import Unauthorized from "./Pages/Unauthorized";
import ProtectedRoute from "./Component/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import CustomerLayout from "./layout/CustomerLayout";
import NotFound from "./Pages/NotFound";
import Register from "./Pages/Auth/Register";
import { DashBoard as AdminDashboard } from "./Pages/Admin";
import ProductAdd from "./Pages/Admin/ProductAdd";
import ProductManagement from "./Pages/Admin/ProductManagement";
import Statistic from "./Pages/Admin/Statistic";
import InvoiceManagement from "./Pages/Admin/InvoiceManagement";
import CommonLayout from "./layout/CommonLayout";
import ProductDetails from "./Pages/ProductDetails";
import { Dashboard as CustomerDashboard } from "./Pages/Customer";
import Cart from "./Pages/Cart";
import ProductEdit from "./Pages/Admin/ProductEdit";
import Order from "./Pages/Customer/Order";
import ProductList from "./Pages/ProductList";
import CBOSSedit from "./Pages/Admin/CBOSSedit";

const ROLE_ADMIN = 1;
const ROLE_CUSTOMER = 2;

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={<ProtectedRoute allowedRoles={[ROLE_ADMIN]} />}
        >
          <Route path="*" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="add-product" element={<ProductAdd />} />
            <Route path="edit-product" element={<ProductManagement />} />
            <Route path="edit-product/:productId" element={<ProductEdit />} />

            <Route path="statistic" element={<Statistic />} />
            <Route
              path="brand-category-option-service-spec"
              element={<CBOSSedit />}
            />
            <Route path="invoice" element={<InvoiceManagement />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<CommonLayout />}>
          <Route exact path="" element={<Home />} />
          <Route exact path="home" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="product/:product_id/variant/:variant_id"
            element={<ProductDetails />}
          />
          <Route path="cart" element={<Cart />} />
          <Route
            path="product-list/:category_slug/:category_id"
            element={<ProductList />}
          />
          <Route path="order" element={<Order />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/customer/*"
          element={<ProtectedRoute allowedRoles={[ROLE_CUSTOMER]} />}
        >
          <Route path="*" element={<CustomerLayout />}>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="order" element={<Order />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
