import { User } from '~models';

export const getUser = async (api) => {
  try {
    const response = await api.getMe();

    return User.findOne({
      'spotify.id': response.body.id,
    });
  } catch (error) {
    console.log(error);
  }
};
