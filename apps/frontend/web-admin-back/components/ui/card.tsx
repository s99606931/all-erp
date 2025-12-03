import * as React from "react"
import { cn } from "@/lib/utils"

export type CardProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Card 컴포넌트
 *
 * @description
 * 콘텐츠를 담는 카드 컨테이너입니다.
 * 그림자와 테두리가 있는 박스 형태로 콘텐츠를 구분합니다.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-sm p-6",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

/**
 * CardHeader 컴포넌트
 *
 * @description
 * 카드의 헤더 영역입니다.
 * 일반적으로 CardTitle과 함께 사용됩니다.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * CardTitle 컴포넌트
 *
 * @description
 * 카드의 제목을 표시합니다.
 * 기본적으로 h3 태그로 렌더링되며, 크고 굵은 폰트를 사용합니다.
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * CardContent 컴포넌트
 *
 * @description
 * 카드의 메인 콘텐츠 영역입니다.
 * 헤더 아래에 위치하며 실제 내용을 담습니다.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
