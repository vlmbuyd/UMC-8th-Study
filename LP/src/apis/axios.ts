import axios, { InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 요청 재시도 여부를 나타내는 플래그
}

// 지금 refresh 중인지를 나타내는 Promise 변수
let refreshPromise: Promise<string> | null = null; // 초기값 null === refresh 중이 아님

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터 : 모든 요청 전에 accessToken을 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const { getItem } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = getItem();

    if (accessToken) {
      config.headers = config.headers || {}; // headers가 undefined일 수 있으므로 초기화
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error) // 요청 인터셉터 실패 시 처리
);

// 응답 인터셉터 : 401 에러 발생 시 refreshToken을 통해 accessToken 갱신
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    // 처음 서버에 보냈던 실패 요청 객체 정보를 가져와서 재시도하기 위해 에러 객체 꺼내옴
    // 토큰 갱신 후 여기에 새로운 accessToken을 덧붙여 다시 보내는 것!
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    // 401 에러이면서, 아직 재시도 하지 않은 요청일 때  => 아직 refresh를 시도하지 않은 경우
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      // refresh 실패 시 긴급 대응 로직
      // 직전에 보낸 refresh api 호출에서 401 에러 발생하여 refresh 실패 (refreshToken도 만료되었거나 문제가 생긴 것)
      // => refresh 중복 재시도 방지를 위해 로그아웃 처리. (refresh 시도는 한 번만 되도록)
      if (originalRequest.url === "/v1/auth/refresh") {
        const { removeItem: removeAccessToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.accessToken
        );
        const { removeItem: removeRefreshToken } = useLocalStorage(
          LOCAL_STORAGE_KEY.refreshToken
        );
        removeAccessToken();
        removeRefreshToken();
        window.location.href = "/login";

        return Promise.reject(error);
      }

      // 일반적인 401에러이면 -> 중복 refresh 방지를 위한 재시도 플래그 설정 : refresh 흐름으로 진입
      originalRequest._retry = true;

      // 아직 refresh 요청이 진행중인 API호출이 없으면 (refreshPromise === null)
      if (!refreshPromise) {
        // 즉시 실행 함수로 refreshPromise 생성 후 바로 실행
        // -> 결과를 return하여 refreshPromise에 저장 (지금 진행 중인 refresh 작업 상황을 나타내는 Promise)
        refreshPromise = (async () => {
          // refresh api 호출하여 accessToken 갱신
          const { getItem: getRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          const refreshToken = getRefreshToken();

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          const { setItem: setAccessToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.accessToken
          );
          const { setItem: setRefreshToken } = useLocalStorage(
            LOCAL_STORAGE_KEY.refreshToken
          );
          setAccessToken(data.data.accessToken);
          setRefreshToken(data.data.refreshToken);

          // refresh 성공 시 토큰 반환 : Promise<string>
          return data.data.accessToken;
        })()
          .catch((error) => {
            // refresh 요청 자체가 실패 시 모든 토큰 삭제 후 에러 throw
            const { removeItem: removeAccessToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.accessToken
            );
            const { removeItem: removeRefreshToken } = useLocalStorage(
              LOCAL_STORAGE_KEY.refreshToken
            );
            removeAccessToken();
            removeRefreshToken();
            throw error;
          })
          .finally(() => {
            // refreshPromise 초기화하여 새롭게 refresh 요청 가능하도록 설정
            refreshPromise = null;
          });
      }

      // 이미 refresh 요청이 진행중이면 (401에러 발생 요청이 여러 개일 때)
      // 새로 refresh 요청을 보내지 않고, 기존 refreshPomise가 resolve될 때까지 대기
      // 모든 요청이 하나의 Promise를 공유하여 refresh 중복 제어
      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 새로 발급된 accessToken을 헤더에 추가
        return axiosInstance(originalRequest); // 재갱신된 토큰으로 원본 요청 재시도
      });
    }

    // 401 에러가 아닌 경우에 그대로 오류 반환
    return Promise.reject(error);
  }
);
