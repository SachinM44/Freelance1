import axiosInstance from './config/axiosInstance';
import { getToken } from './utils/tokenUtils';

export const getPlans = async () => {
  try {
    const response = await axiosInstance.get('/core/subscription');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching plans:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getSubscriptionPlan = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axiosInstance.get('/users/plans', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching subscription plan:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserDetails = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axiosInstance.get('/users/details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user details:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const userHome = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axiosInstance.get('/users/home', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.info("user gome details", response.data)
    return response.data.data;
  } catch (error) {
    console.error('Error while fetching the user details', error.response ? error.response.data : error.message);
  }
};

export const getUserSubscribedPlans = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axiosInstance.get('/users/plans', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user details:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const addUserSubscription = async (payload) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axiosInstance.post('/core/subscription-mapping', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding user subscription:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getWithdrawal = async (userSubscriberId) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No access token found');
    }
    const response = await axiosInstance.post('/core/user-withdrawal', {
      user_subscriber_id: userSubscriberId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error processing withdrawal:', error.response ? error.response.data : error.message);
    throw error;
  }
};
