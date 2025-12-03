import * as React from "react"

/** 모바일 화면 기준 브레이크포인트 (768px 미만) */
const MOBILE_BREAKPOINT = 768

/**
 * 모바일 디바이스 여부를 감지하는 커스텀 훅
 *
 * @description
 * 화면 너비가 768px 미만인 경우 모바일로 판단합니다.
 * matchMedia API를 사용하여 브라우저의 미디어 쿼리를 추적하고,
 * 화면 크기 변경 시 자동으로 상태를 업데이트합니다.
 *
 * @returns {boolean} 모바일 디바이스 여부 (768px 미만이면 true)
 *
 * @example
 * const isMobile = useIsMobile()
 * return isMobile ? <MobileView /> : <DesktopView />
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // 미디어 쿼리 리스너 생성
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // 화면 크기 변경 핸들러
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // 이벤트 리스너 등록 및 초기값 설정
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // 클린업: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // undefined 방지를 위해 !! 사용
  return !!isMobile
}
