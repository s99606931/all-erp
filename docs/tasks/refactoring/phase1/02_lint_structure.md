# Task: Lint and Structure Enforcement

## 목표
프로젝트의 모듈 경계(Module Boundaries)를 강제하고, 폴더 구조 표준을 문서화하여 코드 품질을 유지합니다.

## 작업 목록
- [ ] `eslint.config.mjs` (또는 `.eslintrc.json`) 확인 및 수정
    - [ ] `@nx/enforce-module-boundaries` 규칙 확인
    - [ ] `depConstraints` 설정 점검 (shared -> apps 금지 등)
- [ ] `docs/guides/project-structure.md` 작성
    - [ ] 권장 폴더 구조 설명 (`api`, `domain`, `infra`)
    - [ ] 네이밍 컨벤션 설명
- [ ] 전체 프로젝트 Lint 실행 (`nx run-many --target=lint`)

## 완료 조건
- Lint 규칙이 정상적으로 작동하고, 위반 사항이 없어야 함.
- 구조 가이드 문서가 작성되어야 함.
