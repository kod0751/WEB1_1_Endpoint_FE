import { EventSourcePolyfill } from 'event-source-polyfill';
import axios from 'axios';
import { RandomMatchEvent } from '@/types/GameTypes';
import { getStorageItem, setStorageItem } from '@/utils/storage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

let eventSource: EventSourcePolyfill;

function initializeEventSource() {
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) {
    console.log('이미 EventSource가 초기화되어 있습니다.');
    return; // 기존 연결 재사용
  }

  const token = getStorageItem('accessToken');
  eventSource = new EventSourcePolyfill(`${BACKEND_URL}/api/matching/subscribe`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  eventSource.onerror = async (error: any) => {
    if (error.status === 401) {
      console.log('401 Unauthorized. 토큰 갱신 시도 중...');
      try {
        const refreshResponse = await axios.post(
          `${BACKEND_URL}/auth/reissue`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = refreshResponse.data.result;

        // 새로운 토큰 저장
        setStorageItem('accessToken', accessToken);
        //localStorage.setItem('accessToken', accessToken);

        // SSE 재연결
        console.log('토큰 갱신 성공. SSE 재연결 시도...');
        initializeEventSource();
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        eventSource.close(); // SSE 연결 종료
      }
    }
  };
}

function handleEventMessage(event: MessageEvent<string>) {
  try {
    const data: RandomMatchEvent = JSON.parse(event.data);
    console.log('SSE 데이터:', data, event);

    if (data.event === 'CONNECT') {
      console.log('매칭 성공:', data);
    }
  } catch (error) {
    console.error('SSE 데이터 처리 실패: ', error);
    eventSource.close();
  }
}

export { eventSource, handleEventMessage, initializeEventSource };
