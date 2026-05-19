import "./admin.scss";
import App from "./Components/App";
import { dashboardInfo } from "./utils/data";
document.addEventListener('DOMContentLoaded', () => {
  const dashboardEl = document.getElementById('h5vpAdminDashboard');
  if (!dashboardEl) return;
  const info = JSON.parse(dashboardEl?.dataset?.info);

  ReactDOM.createRoot(dashboardEl).render(<App {...dashboardInfo(info)} />);
});