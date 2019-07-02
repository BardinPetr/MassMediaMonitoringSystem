import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";
import Base from "./containers/Base";

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/" component={Base} />
  </Hoc>
);

export default BaseRouter;
