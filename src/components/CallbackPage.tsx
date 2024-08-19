import * as React from "react";
import Cookies from 'js-cookie';
import { Navigate } from "react-router-dom";

function Callback(props: any) {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get('token');

  if (token) {
    Cookies.set('token', token, { expires: 7, domain: ".catsentence.com" });
  }

  Navigate({
    to: "/"
  })

  return (
    <h1>Successfully login, you will be redirected</h1>
  )
}

export default Callback;
