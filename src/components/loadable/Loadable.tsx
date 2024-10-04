import React, { Suspense, type LazyExoticComponent } from "react";

const Loadable = (Component: LazyExoticComponent<() => JSX.Element>) => () =>
  (
    <Suspense>
      <Component />
    </Suspense>
  );

export default Loadable;
