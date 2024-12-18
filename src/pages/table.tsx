import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { Tableview } from 'src/sections/table/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <Tableview />
    </>
  );
}
