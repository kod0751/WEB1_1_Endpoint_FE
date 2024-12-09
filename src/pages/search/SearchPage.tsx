import { QuizWrapper, TagList } from '@/components';
import SearchBar from '@/components/common/SearchBar';
import TopBar from '@/components/common/TopBar';
import Container from '@/components/layout/Container';
import { useState } from 'react';
import QuizSkeleton from './QuizSkeleton';
import DropDown from '@/components/common/DropDown';
import useGetTags from '@/api/search/fetchTags';
import TagSkeleton from './TagSkeleton';
import AboutPage from '@/components/common/AboutPage';
import { useSearchQuizzes } from '@/api/search/fetchQuizzes';

const SearchPage = () => {
  const { data: tags = [], isLoading: tagsLoading, error: tagsError } = useGetTags();

  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterType, setFilterType] = useState<string>('전체 문제');
  const [sort, setSort] = useState<string>('인기순');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useSearchQuizzes(searchKeyword, filterType, sort);

  const quizzes = data?.pages.flatMap((page) => page.quizzes) || [];

  const handleTagClick = (updatedTags: string[]) => {
    const tagsWithoutHash = updatedTags.map((tag) => tag.replace(/^#/, ''));
    setKeyword(tagsWithoutHash.join(' '));
    setSearchKeyword(tagsWithoutHash.join(' '));
  };

  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  return (
    <>
      <AboutPage
        title="검색페이지"
        description="원하는 키워드와 인기 태그로 퀴즈를 검색하고, 최신 퀴즈와 인기 퀴즈를 확인하세요."
        keywords="퀴즈 검색, 태그 검색, 최신 퀴즈, 인기 퀴즈, OX퀴즈, 객관식, AB테스트"
      />
      <TopBar />
      <Container>
        <SearchBar
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
        />
        <div className="flex items-center mb-4 gap-1">
          <div>
            <DropDown
              items={['전체 문제', '안 푼 문제']}
              selectedItem={filterType}
              setItem={(value) => {
                setFilterType(value);
                setSearchKeyword(keyword);
              }}
              placeholder="전체 문제"
            />
          </div>
          <div>
            <DropDown
              items={['인기순', '최신순']}
              selectedItem={sort}
              setItem={(value) => {
                setSort(value);
                setSearchKeyword(keyword);
              }}
              placeholder="인기순"
            />
          </div>
        </div>
        {tagsLoading ? (
          <TagSkeleton />
        ) : tagsError ? (
          <p className="text-gray-600">인기 태그를 불러오지 못했습니다.</p>
        ) : (
          <TagList tags={tags} onTagClick={handleTagClick} />
        )}
        {isLoading ? (
          Array(6)
            .fill(null)
            .map((_, idx) => <QuizSkeleton key={idx} />)
        ) : quizzes.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            원하는 검색어와 필터로 퀴즈를 검색해보세요.
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div key={quiz.id} className="mb-4">
              <QuizWrapper quiz={quiz} />
            </div>
          ))
        )}
        {isError && (
          <div className="text-center text-red-500 mt-16">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        )}
        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? '불러오는 중...' : '더보기'}
            </button>
          </div>
        )}
      </Container>
    </>
  );
};

export default SearchPage;
