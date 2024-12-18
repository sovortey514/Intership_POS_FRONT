import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { BillingView } from 'src/sections/billing/view/billing-view';



// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <BillingView />
    </>
  );
}
