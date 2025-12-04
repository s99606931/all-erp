-- CreateEnum: 사용자 역할(Role) 열거형 생성
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MANAGER');

-- CreateTable: 사용자(User) 테이블 생성
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 리프레시 토큰(RefreshToken) 테이블 생성
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 테넌트(Tenant) 테이블 생성
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subdomain" TEXT NOT NULL,
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 공통 코드(CommonCode) 테이블 생성
CREATE TABLE "CommonCode" (
    "id" TEXT NOT NULL,
    "groupCode" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommonCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 부서(Department) 테이블 생성
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 직원(Employee) 테이블 생성
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT,
    "tenantId" TEXT NOT NULL,
    "position" TEXT,
    "salary" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "joinDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 근태(Attendance) 테이블 생성
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 휴가 신청(LeaveRequest) 테이블 생성
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 급여(Payroll) 테이블 생성
CREATE TABLE "Payroll" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 급여 항목(PayrollItem) 테이블 생성
CREATE TABLE "PayrollItem" (
    "id" TEXT NOT NULL,
    "payrollId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "PayrollItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 예산(Budget) 테이블 생성
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "departmentId" TEXT,
    "category" TEXT NOT NULL,
    "fiscalYear" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "spent" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 계정과목(ChartOfAccounts) 테이블 생성
CREATE TABLE "ChartOfAccounts" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartOfAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 분개(JournalEntry) 테이블 생성
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "entryDate" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 분개 상세(JournalEntryLine) 테이블 생성
CREATE TABLE "JournalEntryLine" (
    "id" TEXT NOT NULL,
    "journalEntryId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "debit" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(15,2) NOT NULL DEFAULT 0,

    CONSTRAINT "JournalEntryLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 자산(Asset) 테이블 생성
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "assetNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "acquisitionDate" DATE NOT NULL,
    "acquisitionValue" DECIMAL(15,2) NOT NULL,
    "currentValue" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 자산 이력(AssetHistory) 테이블 생성
CREATE TABLE "AssetHistory" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "changeType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 재고(Inventory) 테이블 생성
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "minQuantity" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 재고 트랜잭션(InventoryTransaction) 테이블 생성
CREATE TABLE "InventoryTransaction" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DECIMAL(15,2) NOT NULL,
    "date" DATE NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 차량(Vehicle) 테이블 생성
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable: 차량 예약(VehicleReservation) 테이블 생성
CREATE TABLE "VehicleReservation" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "purpose" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleReservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex: 인덱스 생성
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "Tenant_subdomain_key" ON "Tenant"("subdomain");

-- CreateIndex: 인덱스 생성
CREATE INDEX "CommonCode_tenantId_idx" ON "CommonCode"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "CommonCode_tenantId_groupCode_code_key" ON "CommonCode"("tenantId", "groupCode", "code");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Department_tenantId_idx" ON "Department"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "Employee_userId_key" ON "Employee"("userId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Employee_tenantId_idx" ON "Employee"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Attendance_tenantId_idx" ON "Attendance"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Attendance_employeeId_idx" ON "Attendance"("employeeId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "Attendance_employeeId_date_key" ON "Attendance"("employeeId", "date");

-- CreateIndex: 인덱스 생성
CREATE INDEX "LeaveRequest_tenantId_idx" ON "LeaveRequest"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "LeaveRequest_employeeId_idx" ON "LeaveRequest"("employeeId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Payroll_tenantId_idx" ON "Payroll"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Payroll_employeeId_idx" ON "Payroll"("employeeId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "Payroll_employeeId_period_key" ON "Payroll"("employeeId", "period");

-- CreateIndex: 인덱스 생성
CREATE INDEX "PayrollItem_payrollId_idx" ON "PayrollItem"("payrollId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Budget_tenantId_idx" ON "Budget"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Budget_fiscalYear_idx" ON "Budget"("fiscalYear");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "Budget_tenantId_departmentId_category_fiscalYear_key" ON "Budget"("tenantId", "departmentId", "category", "fiscalYear");

-- CreateIndex: 인덱스 생성
CREATE INDEX "ChartOfAccounts_tenantId_idx" ON "ChartOfAccounts"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "ChartOfAccounts_tenantId_accountCode_key" ON "ChartOfAccounts"("tenantId", "accountCode");

-- CreateIndex: 인덱스 생성
CREATE INDEX "JournalEntry_tenantId_idx" ON "JournalEntry"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "JournalEntry_entryDate_idx" ON "JournalEntry"("entryDate");

-- CreateIndex: 인덱스 생성
CREATE INDEX "JournalEntryLine_journalEntryId_idx" ON "JournalEntryLine"("journalEntryId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "JournalEntryLine_accountId_idx" ON "JournalEntryLine"("accountId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Asset_tenantId_idx" ON "Asset"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "Asset_tenantId_assetNumber_key" ON "Asset"("tenantId", "assetNumber");

-- CreateIndex: 인덱스 생성
CREATE INDEX "AssetHistory_assetId_idx" ON "AssetHistory"("assetId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Inventory_tenantId_idx" ON "Inventory"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "Inventory_tenantId_itemName_key" ON "Inventory"("tenantId", "itemName");

-- CreateIndex: 인덱스 생성
CREATE INDEX "InventoryTransaction_inventoryId_idx" ON "InventoryTransaction"("inventoryId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "Vehicle_tenantId_idx" ON "Vehicle"("tenantId");

-- CreateIndex: 인덱스 생성
CREATE UNIQUE INDEX "Vehicle_tenantId_licensePlate_key" ON "Vehicle"("tenantId", "licensePlate");

-- CreateIndex: 인덱스 생성
CREATE INDEX "VehicleReservation_vehicleId_idx" ON "VehicleReservation"("vehicleId");

-- CreateIndex: 인덱스 생성
CREATE INDEX "VehicleReservation_startDate_endDate_idx" ON "VehicleReservation"("startDate", "endDate");

-- AddForeignKey: 외래 키 추가
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "Department" ADD CONSTRAINT "Department_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "Payroll" ADD CONSTRAINT "Payroll_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "PayrollItem" ADD CONSTRAINT "PayrollItem_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "Payroll"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "ChartOfAccounts" ADD CONSTRAINT "ChartOfAccounts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ChartOfAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "JournalEntryLine" ADD CONSTRAINT "JournalEntryLine_journalEntryId_fkey" FOREIGN KEY ("journalEntryId") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "JournalEntryLine" ADD CONSTRAINT "JournalEntryLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "ChartOfAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: 외래 키 추가
ALTER TABLE "VehicleReservation" ADD CONSTRAINT "VehicleReservation_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddComments
COMMENT ON TABLE "User" IS '사용자 정보';
COMMENT ON COLUMN "User"."id" IS '사용자 ID';
COMMENT ON COLUMN "User"."email" IS '이메일';
COMMENT ON COLUMN "User"."password" IS '비밀번호';
COMMENT ON COLUMN "User"."name" IS '이름';
COMMENT ON COLUMN "User"."role" IS '역할 (USER, ADMIN, MANAGER)';
COMMENT ON COLUMN "User"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "User"."createdAt" IS '생성일시';
COMMENT ON COLUMN "User"."updatedAt" IS '수정일시';

COMMENT ON TABLE "RefreshToken" IS '리프레시 토큰';
COMMENT ON COLUMN "RefreshToken"."id" IS '토큰 ID';
COMMENT ON COLUMN "RefreshToken"."token" IS '토큰 값';
COMMENT ON COLUMN "RefreshToken"."userId" IS '사용자 ID';
COMMENT ON COLUMN "RefreshToken"."expiresAt" IS '만료일시';
COMMENT ON COLUMN "RefreshToken"."createdAt" IS '생성일시';
COMMENT ON COLUMN "RefreshToken"."revoked" IS '철회 여부';

COMMENT ON TABLE "Tenant" IS '테넌트 (조직/기관)';
COMMENT ON COLUMN "Tenant"."id" IS '테넌트 ID';
COMMENT ON COLUMN "Tenant"."name" IS '테넌트명';
COMMENT ON COLUMN "Tenant"."subdomain" IS '서브도메인';
COMMENT ON COLUMN "Tenant"."subscriptionPlan" IS '구독 플랜';
COMMENT ON COLUMN "Tenant"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Tenant"."updatedAt" IS '수정일시';

COMMENT ON TABLE "CommonCode" IS '공통 코드';
COMMENT ON COLUMN "CommonCode"."id" IS '코드 ID';
COMMENT ON COLUMN "CommonCode"."groupCode" IS '그룹 코드';
COMMENT ON COLUMN "CommonCode"."code" IS '코드';
COMMENT ON COLUMN "CommonCode"."value" IS '코드 값';
COMMENT ON COLUMN "CommonCode"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "CommonCode"."createdAt" IS '생성일시';
COMMENT ON COLUMN "CommonCode"."updatedAt" IS '수정일시';

COMMENT ON TABLE "Department" IS '부서';
COMMENT ON COLUMN "Department"."id" IS '부서 ID';
COMMENT ON COLUMN "Department"."name" IS '부서명';
COMMENT ON COLUMN "Department"."parentId" IS '상위 부서 ID';
COMMENT ON COLUMN "Department"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "Department"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Department"."updatedAt" IS '수정일시';

COMMENT ON TABLE "Employee" IS '직원';
COMMENT ON COLUMN "Employee"."id" IS '직원 ID';
COMMENT ON COLUMN "Employee"."userId" IS '사용자 ID';
COMMENT ON COLUMN "Employee"."departmentId" IS '부서 ID';
COMMENT ON COLUMN "Employee"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "Employee"."position" IS '직급';
COMMENT ON COLUMN "Employee"."salary" IS '급여';
COMMENT ON COLUMN "Employee"."joinDate" IS '입사일';
COMMENT ON COLUMN "Employee"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Employee"."updatedAt" IS '수정일시';
COMMENT ON COLUMN "Employee"."deletedAt" IS '퇴사일시';

COMMENT ON TABLE "Attendance" IS '근태';
COMMENT ON COLUMN "Attendance"."id" IS '근태 ID';
COMMENT ON COLUMN "Attendance"."employeeId" IS '직원 ID';
COMMENT ON COLUMN "Attendance"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "Attendance"."date" IS '날짜';
COMMENT ON COLUMN "Attendance"."checkIn" IS '출근 시간';
COMMENT ON COLUMN "Attendance"."checkOut" IS '퇴근 시간';
COMMENT ON COLUMN "Attendance"."status" IS '상태';
COMMENT ON COLUMN "Attendance"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Attendance"."updatedAt" IS '수정일시';

COMMENT ON TABLE "LeaveRequest" IS '휴가 신청';
COMMENT ON COLUMN "LeaveRequest"."id" IS '신청 ID';
COMMENT ON COLUMN "LeaveRequest"."employeeId" IS '직원 ID';
COMMENT ON COLUMN "LeaveRequest"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "LeaveRequest"."type" IS '휴가 유형';
COMMENT ON COLUMN "LeaveRequest"."startDate" IS '시작일';
COMMENT ON COLUMN "LeaveRequest"."endDate" IS '종료일';
COMMENT ON COLUMN "LeaveRequest"."reason" IS '사유';
COMMENT ON COLUMN "LeaveRequest"."status" IS '상태';
COMMENT ON COLUMN "LeaveRequest"."createdAt" IS '생성일시';
COMMENT ON COLUMN "LeaveRequest"."updatedAt" IS '수정일시';

COMMENT ON TABLE "Payroll" IS '급여 대장';
COMMENT ON COLUMN "Payroll"."id" IS '급여 ID';
COMMENT ON COLUMN "Payroll"."employeeId" IS '직원 ID';
COMMENT ON COLUMN "Payroll"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "Payroll"."period" IS '급여 기간';
COMMENT ON COLUMN "Payroll"."totalAmount" IS '총 지급액';
COMMENT ON COLUMN "Payroll"."status" IS '상태';
COMMENT ON COLUMN "Payroll"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Payroll"."updatedAt" IS '수정일시';

COMMENT ON TABLE "PayrollItem" IS '급여 항목';
COMMENT ON COLUMN "PayrollItem"."id" IS '항목 ID';
COMMENT ON COLUMN "PayrollItem"."payrollId" IS '급여 ID';
COMMENT ON COLUMN "PayrollItem"."type" IS '항목 유형';
COMMENT ON COLUMN "PayrollItem"."amount" IS '금액';

COMMENT ON TABLE "Budget" IS '예산';
COMMENT ON COLUMN "Budget"."id" IS '예산 ID';
COMMENT ON COLUMN "Budget"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "Budget"."departmentId" IS '부서 ID';
COMMENT ON COLUMN "Budget"."category" IS '예산 항목';
COMMENT ON COLUMN "Budget"."fiscalYear" IS '회계연도';
COMMENT ON COLUMN "Budget"."amount" IS '예산액';
COMMENT ON COLUMN "Budget"."spent" IS '지출액';
COMMENT ON COLUMN "Budget"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Budget"."updatedAt" IS '수정일시';

COMMENT ON TABLE "ChartOfAccounts" IS '계정과목';
COMMENT ON COLUMN "ChartOfAccounts"."id" IS '계정 ID';
COMMENT ON COLUMN "ChartOfAccounts"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "ChartOfAccounts"."accountCode" IS '계정 코드';
COMMENT ON COLUMN "ChartOfAccounts"."accountName" IS '계정명';
COMMENT ON COLUMN "ChartOfAccounts"."accountType" IS '계정 유형';
COMMENT ON COLUMN "ChartOfAccounts"."parentId" IS '상위 계정 ID';
COMMENT ON COLUMN "ChartOfAccounts"."createdAt" IS '생성일시';
COMMENT ON COLUMN "ChartOfAccounts"."updatedAt" IS '수정일시';

COMMENT ON TABLE "JournalEntry" IS '분개 (전표)';
COMMENT ON COLUMN "JournalEntry"."id" IS '전표 ID';
COMMENT ON COLUMN "JournalEntry"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "JournalEntry"."entryDate" IS '전기 일자';
COMMENT ON COLUMN "JournalEntry"."description" IS '적요';
COMMENT ON COLUMN "JournalEntry"."createdAt" IS '생성일시';
COMMENT ON COLUMN "JournalEntry"."updatedAt" IS '수정일시';

COMMENT ON TABLE "JournalEntryLine" IS '분개 상세';
COMMENT ON COLUMN "JournalEntryLine"."id" IS '상세 ID';
COMMENT ON COLUMN "JournalEntryLine"."journalEntryId" IS '전표 ID';
COMMENT ON COLUMN "JournalEntryLine"."accountId" IS '계정 ID';
COMMENT ON COLUMN "JournalEntryLine"."debit" IS '차변';
COMMENT ON COLUMN "JournalEntryLine"."credit" IS '대변';

COMMENT ON TABLE "Asset" IS '자산';
COMMENT ON COLUMN "Asset"."id" IS '자산 ID';
COMMENT ON COLUMN "Asset"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "Asset"."assetNumber" IS '자산 번호';
COMMENT ON COLUMN "Asset"."name" IS '자산명';
COMMENT ON COLUMN "Asset"."category" IS '자산 분류';
COMMENT ON COLUMN "Asset"."acquisitionDate" IS '취득일';
COMMENT ON COLUMN "Asset"."acquisitionValue" IS '취득가액';
COMMENT ON COLUMN "Asset"."currentValue" IS '현재가액';
COMMENT ON COLUMN "Asset"."status" IS '상태';
COMMENT ON COLUMN "Asset"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Asset"."updatedAt" IS '수정일시';

COMMENT ON TABLE "AssetHistory" IS '자산 이력';
COMMENT ON COLUMN "AssetHistory"."id" IS '이력 ID';
COMMENT ON COLUMN "AssetHistory"."assetId" IS '자산 ID';
COMMENT ON COLUMN "AssetHistory"."changeType" IS '변동 유형';
COMMENT ON COLUMN "AssetHistory"."description" IS '설명';
COMMENT ON COLUMN "AssetHistory"."changedAt" IS '변동 일시';

COMMENT ON TABLE "Inventory" IS '재고';
COMMENT ON COLUMN "Inventory"."id" IS '재고 ID';
COMMENT ON COLUMN "Inventory"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "Inventory"."itemName" IS '품목명';
COMMENT ON COLUMN "Inventory"."quantity" IS '수량';
COMMENT ON COLUMN "Inventory"."minQuantity" IS '최소 수량';
COMMENT ON COLUMN "Inventory"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Inventory"."updatedAt" IS '수정일시';

COMMENT ON TABLE "InventoryTransaction" IS '재고 트랜잭션';
COMMENT ON COLUMN "InventoryTransaction"."id" IS '트랜잭션 ID';
COMMENT ON COLUMN "InventoryTransaction"."inventoryId" IS '재고 ID';
COMMENT ON COLUMN "InventoryTransaction"."type" IS '유형 (입고/출고)';
COMMENT ON COLUMN "InventoryTransaction"."quantity" IS '수량';
COMMENT ON COLUMN "InventoryTransaction"."date" IS '날짜';
COMMENT ON COLUMN "InventoryTransaction"."description" IS '설명';
COMMENT ON COLUMN "InventoryTransaction"."createdAt" IS '생성일시';

COMMENT ON TABLE "Vehicle" IS '차량';
COMMENT ON COLUMN "Vehicle"."id" IS '차량 ID';
COMMENT ON COLUMN "Vehicle"."tenantId" IS '테넌트 ID';
COMMENT ON COLUMN "Vehicle"."licensePlate" IS '차량 번호';
COMMENT ON COLUMN "Vehicle"."model" IS '모델명';
COMMENT ON COLUMN "Vehicle"."status" IS '상태';
COMMENT ON COLUMN "Vehicle"."createdAt" IS '생성일시';
COMMENT ON COLUMN "Vehicle"."updatedAt" IS '수정일시';

COMMENT ON TABLE "VehicleReservation" IS '차량 예약';
COMMENT ON COLUMN "VehicleReservation"."id" IS '예약 ID';
COMMENT ON COLUMN "VehicleReservation"."vehicleId" IS '차량 ID';
COMMENT ON COLUMN "VehicleReservation"."userId" IS '사용자 ID';
COMMENT ON COLUMN "VehicleReservation"."startDate" IS '시작일';
COMMENT ON COLUMN "VehicleReservation"."endDate" IS '종료일';
COMMENT ON COLUMN "VehicleReservation"."purpose" IS '목적';
COMMENT ON COLUMN "VehicleReservation"."createdAt" IS '생성일시';
