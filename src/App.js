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
import ProductInfoForm from "./Pages/Admin/ProductInfoForm";
import ProductManagement from "./Pages/Admin/ProductManagement";
import Statistic from "./Pages/Admin/Statistic";
import InvoiceManagement from "./Pages/Admin/InvoiceManagement";
import ProductDetails from "./Component/ProductDetails";
import CommonLayout from "./layout/CommonLayout";
import { Dashboard as CustomerDashboard } from "./Pages/Customer";

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
            <Route path="add-product" element={<ProductInfoForm />} />
            <Route path="edit-product" element={<ProductManagement />} />

            <Route path="statistic" element={<Statistic />} />

            <Route path="invoice" element={<InvoiceManagement />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route path="*" element={<CommonLayout />}>
          <Route
            path="customer/*"
            element={<ProtectedRoute allowedRoles={[ROLE_CUSTOMER]} />}
          >
            <Route path="*" element={<CustomerLayout />}>
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>

          <Route exact path="" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route
            path="product/:product_id/variant/:variant_id"
            element={<ProductDetails />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
