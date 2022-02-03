/* eslint-disable import/prefer-default-export */
import { AxiosError } from 'axios';
import axios from 'utils/customAxios';
import { UserDto } from './dtos';

export const kakaoLogin = async ({
  code,
  redirectUri,
}: UserDto.KakaoLoginRequest): Promise<UserDto.KakaoLoginResponse> => {
  try {
    const res = await axios.post<UserDto.KakaoLoginResponse>('/user/login', { code, redirectUri });
    return res.data;
  } catch (error) {
    const serverError = error as AxiosError;
    throw new Error(serverError.response?.data.detail);
  }
};
