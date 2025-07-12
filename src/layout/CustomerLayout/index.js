import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "../../Pages/NotFound";
import { Dashboard } from "../../Pages/Customer";

function CustomerLayout() {
  return (
    <div>
      <h1>Customer</h1>

      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default CustomerLayout;
