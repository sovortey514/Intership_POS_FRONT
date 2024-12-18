import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { Menuview } from 'src/sections/menu/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <Menuview />
    </>
  );
}
