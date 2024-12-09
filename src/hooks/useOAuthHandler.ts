import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { Provider } from '@/types/AuthType';
import { setStorageItem } from '@/utils/storage';

const useOAuthHandler = (provider: Provider) => {
  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const handleLogin = useCallback(() => {
    const redirectURI =
      provider === 'kakao'
        ? import.meta.env.VITE_KAKAO_OAUTH_REDIRECT_URI
        : import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI;

    // 백엔드 인증 URL로 리다이렉트
    window.location.href = redirectURI;
  }, []);

  const handleRedirectCallback = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const accessToken = searchParams.get('token');
    const guest = searchParams.get('guest') === 'true';
    const error = searchParams.get('error');

    if (accessToken) {
      setStorageItem('accessToken', accessToken);
      //localStorage.setItem('accessToken', accessToken);
      // [Should]: 현재 zustand 스토어에 `accessToken`을 저장하고 있는데, 일반적인 클라이언트 상태 저장으로 저장하여서 메모리 초기화(리로딩등,,,)시 해당 accessToken에 접근할 수 없을거같습니다.
      setAccessToken(accessToken, provider);

      if (guest) {
        navigate('/interest');
      } else {
        navigate('/main');
      }
    }
    if (error) {
      const decodedError = decodeURIComponent(error);
      console.error('로그인 실패:', decodedError);
      navigate('/');
      return;
    }
  }, [setAccessToken, provider]);

  return { handleLogin, handleRedirectCallback };
};

export default useOAuthHandler;
