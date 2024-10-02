// import axios from 'axios';
//
// export const postLoginToken = async idToken => {
//     const API_URL = import.meta.env.VITE_APP_API_URL;
//     const path = '/v1/oauth/login';
//
//     try {
//       const response = await axios.post(`${API_URL}${path}`, {
//           credentials: 'include',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(idToken),
//       });
//       if (!response.ok) throw new Error('bad server condition');
//       return true;
//     } catch (e) {
//       console.error('postLoginToken Error: ', e.message);
//       return false;
//     }
//   };

import axios from "axios";

export const postLoginToken = async (idToken) => {
  const API_URL = import.meta.env.VITE_APP_API_URL;
  const path = "/v1/oauth/login";

  try {
    const response = await axios.post(
      `${API_URL}${path}`,
      JSON.stringify(idToken), // Sending the token as the request body
      {
        withCredentials: true, // Include credentials like cookies in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    // If the request is successful, Axios will return a response object
    return response.status === 200; // Check for success by the status code
  } catch (e) {
    console.error("postLoginToken Error: ", e.message);
    return false;
  }
};
