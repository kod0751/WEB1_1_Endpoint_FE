/**
 * getStorageItem
 * @description 로컬스토리지에서 안전하게 값을 가져오는 유틸 함수
 * @param key 로컬스토리 키 값
 * @returns 파싱된 로컬스토리지 값
 */
export const getStorageItem = (key: string) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsedItem = JSON.parse(item);
    return parsedItem?.state?.accessToken || null;
  } catch (error) {
    console.error('getStorageItem:', error);
    return null;
  }
};

export const setStorageItem = (key: string, value: any) => {
  try {
    const jsonString = JSON.stringify(value);
    localStorage.setItem(key, jsonString);
  } catch (error) {
    console.error('setStorageItem:', error);
  }
};
