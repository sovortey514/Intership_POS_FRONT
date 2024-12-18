import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { BlogView } from 'src/sections/blog/view';
import { Orderview } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <Orderview />
    </>
  );
}
