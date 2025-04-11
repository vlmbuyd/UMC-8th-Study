export const useLocalStorage = (key: string) => {
  const setItem = (value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      // 인터셉터로 토큰 설정 X
      //   if (typeof value === "string") {
      //     localStorage.setItem(key, value);
      //   } else {
      //     localStorage.setItem(key, JSON.stringify(value));
      //   }
    } catch (e) {
      console.error(e);
    }
  };

  const getItem = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;

      // 인터셉터로 토큰 설정 X
      //   const item = localStorage.getItem(key); // 문자열 그대로 저장했으면 JSON.parse 하면 안 됨
      //   if (!item) return null;
      //   try {
      //     return JSON.parse(item); // object, number 등
      //   } catch {
      //     // 유효한 JSON이 아닐 경우 ex. 파싱할 수 없는 순수 문자열
      //     return item; // 파싱 실패 시 그대로 반환 (string)
      //   }
    } catch (e) {
      console.error(e);
    }
  };

  const removeItem = () => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  };

  return { setItem, getItem, removeItem };
};
