-- CreateTable
CREATE TABLE "UserRegistration" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "profileImage" TEXT,
    "experience" TEXT,
    "portfolio" TEXT[],
    "documents" TEXT[],
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approvalToken" TEXT NOT NULL,
    "rejectionToken" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserRegistration_email_key" ON "UserRegistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserRegistration_approvalToken_key" ON "UserRegistration"("approvalToken");

-- CreateIndex
CREATE UNIQUE INDEX "UserRegistration_rejectionToken_key" ON "UserRegistration"("rejectionToken");

-- CreateIndex
CREATE INDEX "UserRegistration_email_idx" ON "UserRegistration"("email");

-- CreateIndex
CREATE INDEX "UserRegistration_status_idx" ON "UserRegistration"("status");

-- CreateIndex
CREATE INDEX "UserRegistration_role_idx" ON "UserRegistration"("role");

-- CreateIndex
CREATE INDEX "UserRegistration_approvalToken_idx" ON "UserRegistration"("approvalToken");

-- CreateIndex
CREATE INDEX "UserRegistration_rejectionToken_idx" ON "UserRegistration"("rejectionToken");
