import "./onboarding.scss";
import Onboarding from '../../../bpl-tools/Admin/Onboarding';
import { onboardingInfo } from "./utils/onboarding";
import { dashboardInfo } from "./utils/data";

document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('h5vpOnboarding');
  if (!el) return;

  const info = JSON.parse(el?.dataset?.info || '{}');
  const { adminUrl = '', dashboardUrl = '', ajaxAction = '', nonce = '', values = {} } = info;

  ReactDOM.createRoot(el).render(<Onboarding
    {...dashboardInfo(info)}
    steps={onboardingInfo()}
    values={values}
    ajaxAction={ajaxAction}
    nonce={nonce}
    exitUrl={dashboardUrl}
    finishButton={{
      label: 'Create Your First Player',
      url: `${adminUrl}post-new.php?post_type=videoplayer`
    }}
  />);
});
