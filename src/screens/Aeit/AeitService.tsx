import axios from "axios";
import { UrlConstants } from "../../global/UrlConstants";

export const getAeitByStatus = async (status: any) => {
  const response = await axios
    .get(`${UrlConstants.baseUrl}/getAllAeit/${status}/loggedInUserId/${localStorage.getItem("id")}`)
    .then((response: any) => {
      return response.data;
    })
    .catch((error: any) => {
      console.error("There was an error!", error);
    });
  return response;
};