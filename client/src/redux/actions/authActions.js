// redux/actions/authActions.js

import axios from 'axios';


export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch({ type: 'FORGOT_PASSWORD_REQUEST' });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/user/forgot-password', { email }, config);

        dispatch({
            type: 'FORGOT_PASSWORD_SUCCESS',
            payload: data.message,
        });
    } catch (error) {
        dispatch({
            type: 'FORGOT_PASSWORD_FAIL',
            payload: error.response.data.message || 'Something went wrong',
        });
    }
};
