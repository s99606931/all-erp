/**
 * 로딩 스피너 컴포넌트
 * Remote 앱 로딩 중이나 데이터 페칭 중에 표시됩니다.
 */
export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    </div>
  );
}
