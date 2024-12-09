import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '@/api/axiosInstance';
import { BaseQuizAPI } from '@/types';

interface FetchQuizzesResponse {
  quizzes: BaseQuizAPI[];
  hasNextPage: boolean;
}

interface FetchQuizzesParams {
  pageParam: number;
  keyword: string;
  filterType: string;
  sort: string;
}

const fetchQuizzes = async ({
  pageParam,
  keyword,
  filterType,
  sort,
}: FetchQuizzesParams): Promise<FetchQuizzesResponse> => {
  const isUnansweredOnly = filterType === '안 푼 문제';
  const endpoint = isUnansweredOnly ? `/quiz/search/unanswered` : `/quiz/search`;

  const response = await axiosInstance.get(endpoint, {
    params: {
      keyword,
      page: pageParam,
      size: 10,
      sort: sort === '인기순' ? 'TRENDING' : 'NEW',
    },
  });

  return {
    quizzes: response.data.result.quizzes || [],
    hasNextPage: response.data.result.quizzes.length > 0,
  };
};

export const useSearchQuizzes = (keyword: string, filterType: string, sort: string) => {
  return useInfiniteQuery<FetchQuizzesResponse>({
    queryKey: ['searchQuizzes', keyword, filterType, sort],
    queryFn: ({ pageParam = 0 }) =>
      fetchQuizzes({
        pageParam: pageParam as number,
        keyword,
        filterType,
        sort,
      }),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasNextPage ? allPages.length : undefined),
    enabled: !!keyword,
    initialPageParam: 0,
  });
};
