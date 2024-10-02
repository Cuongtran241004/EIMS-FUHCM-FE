// import axios from 'axios';
//
// export const getUserInfo = async () => {
//     const API_URL = import.meta.env.VITE_APP_API_URL;
//     const path = '/v1/oauth/user/info';
//
//     try {
//       const response = await axios.get(`${API_URL}${path}`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         credentials: 'include',
//       });
//       if (!response.ok) throw new Error('bad server condition');
//       return response.json();
//     } catch (e) {
//       console.error('getUserInfo Error: ', e.message);
//       return false;
//     }
//   };

import axios from 'axios';

export const getUserInfo = async () => {
    const API_URL = import.meta.env.VITE_APP_API_URL;
    const path = '/v1/oauth/user/info';

    try {
        const response = await axios.get(`${API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',

            },
            withCredentials: true, // Ensures cookies or credentials are sent with the request
        });

        // Return the response data (Axios parses JSON automatically)
        return response.data;
    } catch (e) {
        console.error('getUserInfo Error: ', e.message);
        return false;
    }
};