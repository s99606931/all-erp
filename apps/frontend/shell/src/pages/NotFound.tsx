

/**
 * 404 Not Found 페이지
 * 존재하지 않는 경로에 접근했을 때 표시됩니다.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-300">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mt-4">
          페이지를 찾을 수 없습니다
        </p>
        <p className="text-gray-500 mt-2">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        
        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            대시보드로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
}
