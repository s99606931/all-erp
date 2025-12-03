import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * 버튼 스타일 변형 정의
 *
 * @description
 * class-variance-authority를 사용하여 버튼의 다양한 스타일을 정의합니다.
 *
 * Variants (변형):
 * - default: 기본 Primary 버튼
 * - destructive: 삭제/위험한 작업용 빨간색 버튼
 * - outline: 테두리만 있는 버튼
 * - secondary: 보조 액션용 버튼
 * - ghost: 배경 없는 투명 버튼
 * - link: 링크처럼 보이는 버튼
 *
 * Sizes (크기):
 * - default: 기본 크기 (h-10)
 * - sm: 작은 크기 (h-9)
 * - lg: 큰 크기 (h-11)
 * - icon: 정사각형 아이콘 버튼 (h-10 w-10)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** true일 경우 자식을 그대로 렌더링 (Radix UI Slot 사용) */
  asChild?: boolean
}

/**
 * Button 컴포넌트
 *
 * @description
 * 재사용 가능한 버튼 컴포넌트입니다.
 * 다양한 스타일과 크기를 지원하며, asChild 옵션으로 Link 등과 결합 가능합니다.
 *
 * @example
 * <Button variant="default" size="lg">클릭하세요</Button>
 * <Button variant="outline" size="icon" aria-label="검색"><SearchIcon /></Button>
 * <Button asChild><Link href="/login">로그인</Link></Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
