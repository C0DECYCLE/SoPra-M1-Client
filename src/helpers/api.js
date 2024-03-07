import axios from "axios";
import { getDomain } from "./getDomain";
import { toast } from "react-toastify";
import "styles/index.scss";
import "react-toastify/dist/ReactToastify.css";
import { log, warn } from "helpers/logger";

export const api = axios.create({
  baseURL: getDomain(),
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

export const handleError = (error) => {
  const response = error.response;
  // catch 4xx and 5xx status codes
  if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
    let info = `\nrequest to: ${response.request.responseURL}`;
    if (response.data.status) {
      info += `\nstatus code: ${response.data.status}`;
      info += `\nerror: ${response.data.error}`;
      info += `\nerror message: ${response.data.message}`;
    } else {
      info += `\nstatus code: ${response.status}`;
      info += `\nerror message:\n${response.data}`;
    }
    log(
      "The request was made and answered but was unsuccessful.",
      error.response
    );
    return info;
  } else {
    if (error.message.match(/Network Error/)) {
      toast.error("The server cannot be reached.");
      return;
    }
    log("Something else happened.", error);
    return error.message;
  }
};

export const genericError = (msg, error) => {
  warn(`${msg}: \n${handleError(error)}`, error);
  toast.error("Something went wrong! See the console for details.");
};
