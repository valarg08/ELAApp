-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AiFeedbackMode" AS ENUM ('IMMEDIATE', 'TEACHER_APPROVAL', 'OFF');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'RETURNED', 'REVISING', 'GRADED');

-- CreateEnum
CREATE TYPE "SnapshotReason" AS ENUM ('AUTOSAVE', 'SUBMIT', 'MANUAL', 'RESTORE');

-- CreateEnum
CREATE TYPE "FeedbackSource" AS ENUM ('AI', 'TEACHER', 'PEER');

-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('QUEUED', 'PENDING_REVIEW', 'READY', 'RELEASED', 'HIDDEN', 'SUPERSEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('QUICK_WRITE', 'CONSTRAINED_WRITE', 'SIX_WORD_STORY', 'SHOW_TELL_TRANSFORM', 'DESCRIBE_WITHOUT_NAMING', 'VIVID_REWRITE', 'MULTIPLE_CHOICE', 'SORT', 'HIGHLIGHT', 'CHARACTER_BUILDER', 'WORLD_BUILDER', 'PLOT_DIAGRAM', 'CONFLICT_SELECTOR', 'POV_REWRITE', 'SENSORY_LAB', 'FIGURATIVE_LAB', 'HAIKU', 'FREE_VERSE', 'SPOKEN_WORD', 'DIALOGUE_SCENE', 'MEMORY_TIMELINE', 'GENRE_STORY', 'REVISION_CHECKLIST', 'PEER_REVIEW', 'PROJECT', 'REFLECTION');

-- CreateEnum
CREATE TYPE "ArtifactType" AS ENUM ('CHARACTER', 'WORLD', 'PLOT', 'CONFLICT', 'TIMELINE', 'POEM_COLLECTION', 'COVER', 'TONE_PROFILE');

-- CreateEnum
CREATE TYPE "XpReason" AS ENUM ('LESSON_STEP', 'LESSON_COMPLETE', 'MISSION_COMPLETE', 'SUBMISSION', 'WORD_TARGET', 'REVISION', 'PROJECT', 'PEER_REVIEW', 'TEST', 'STREAK_MILESTONE', 'BADGE', 'ADMIN_ADJUST');

-- CreateEnum
CREATE TYPE "PortfolioSlot" AS ENUM ('SHORT_STORY', 'PERSONAL_NARRATIVE', 'POETRY_COLLECTION', 'GENRE_STORY', 'DIALOGUE_SCENE', 'REVISED_PIECE', 'REFLECTION');

-- CreateEnum
CREATE TYPE "FlagType" AS ENUM ('SELF_HARM', 'ABUSE_DISCLOSURE', 'VIOLENCE_THREAT', 'BULLYING', 'PERSONAL_INFO', 'PROFANITY', 'OTHER');

-- CreateEnum
CREATE TYPE "FlagStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "orgId" TEXT,
    "displayName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "studentSecretHash" TEXT,
    "studentSecretKind" TEXT,
    "avatar" JSONB,
    "preferences" JSONB,
    "failedLogins" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "teacherId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gradeLevel" INTEGER NOT NULL,
    "joinCode" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "aiFeedbackMode" "AiFeedbackMode" NOT NULL DEFAULT 'TEACHER_APPROVAL',
    "settings" JSONB NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("classId","studentId")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "bigIdeas" JSONB NOT NULL,
    "projectSpec" JSONB,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "contentHash" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "estMinutes" INTEGER NOT NULL,
    "steps" JSONB NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "lessonId" TEXT,
    "key" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "rubricKey" TEXT,
    "xpReward" INTEGER NOT NULL DEFAULT 30,
    "isProject" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassUnit" (
    "classId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "unlockAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ClassUnit_pkey" PRIMARY KEY ("classId","unitId")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "completedSteps" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("studentId","lessonId")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT,
    "contentJson" JSONB NOT NULL,
    "contentText" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "draftRevision" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 0,
    "lastSnapshotAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftVersion" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "revision" INTEGER NOT NULL,
    "reason" "SnapshotReason" NOT NULL,
    "contentJson" JSONB NOT NULL,
    "contentText" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DraftVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "activityId" TEXT,
    "type" "ArtifactType" NOT NULL,
    "title" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rubric" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "maxScore" INTEGER NOT NULL,
    "exemplars" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rubric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "submissionVersion" INTEGER NOT NULL,
    "source" "FeedbackSource" NOT NULL,
    "status" "FeedbackStatus" NOT NULL,
    "authorId" TEXT,
    "rubricId" TEXT,
    "scores" JSONB,
    "totalScore" DOUBLE PRECISION,
    "summary" TEXT,
    "strengths" JSONB,
    "nextSteps" JSONB,
    "inline" JSONB,
    "analyzers" JSONB,
    "model" TEXT,
    "promptVersion" TEXT,
    "overrideOfId" TEXT,
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiCache" (
    "key" TEXT NOT NULL,
    "analyzer" TEXT NOT NULL,
    "output" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiCache_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "ConceptTest" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "unitId" TEXT,
    "title" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "openAt" TIMESTAMP(3),
    "closeAt" TIMESTAMP(3),
    "timeLimitMin" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConceptTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAttempt" (
    "id" TEXT NOT NULL,
    "testId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "autoScore" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION,
    "maxScore" DOUBLE PRECISION NOT NULL,
    "needsReview" BOOLEAN NOT NULL DEFAULT false,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "TestAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeerReview" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "responses" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "moderatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PeerReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentStats" (
    "studentId" TEXT NOT NULL,
    "totalXp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TEXT,
    "streakFreezes" INTEGER NOT NULL DEFAULT 0,
    "lifetimeWords" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentStats_pkey" PRIMARY KEY ("studentId")
);

-- CreateTable
CREATE TABLE "XpEvent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "reason" "XpReason" NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Badge" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "xpBonus" INTEGER NOT NULL DEFAULT 0,
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentBadge" (
    "studentId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentBadge_pkey" PRIMARY KEY ("studentId","badgeId")
);

-- CreateTable
CREATE TABLE "DailyMission" (
    "studentId" TEXT NOT NULL,
    "dayKey" TEXT NOT NULL,
    "missionType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "DailyMission_pkey" PRIMARY KEY ("studentId","dayKey")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cover" JSONB,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioItem" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "slot" "PortfolioSlot" NOT NULL,
    "submissionId" TEXT,
    "submissionVersion" INTEGER,
    "artifactId" TEXT,
    "introNote" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PortfolioItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioExport" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "fileKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyFlag" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT,
    "studentId" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "type" "FlagType" NOT NULL,
    "severity" INTEGER NOT NULL,
    "excerpt" TEXT NOT NULL,
    "detectedBy" TEXT NOT NULL,
    "status" "FlagStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_tokenHash_key" ON "RefreshToken"("tokenHash");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_familyId_idx" ON "RefreshToken"("familyId");

-- CreateIndex
CREATE UNIQUE INDEX "Class_joinCode_key" ON "Class"("joinCode");

-- CreateIndex
CREATE INDEX "Enrollment_studentId_idx" ON "Enrollment"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_number_key" ON "Unit"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_slug_key" ON "Unit"("slug");

-- CreateIndex
CREATE INDEX "Lesson_unitId_order_idx" ON "Lesson"("unitId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_unitId_slug_key" ON "Lesson"("unitId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_key_key" ON "Activity"("key");

-- CreateIndex
CREATE INDEX "LessonProgress_classId_idx" ON "LessonProgress"("classId");

-- CreateIndex
CREATE INDEX "Submission_classId_status_idx" ON "Submission"("classId", "status");

-- CreateIndex
CREATE INDEX "Submission_studentId_updatedAt_idx" ON "Submission"("studentId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_activityId_studentId_classId_key" ON "Submission"("activityId", "studentId", "classId");

-- CreateIndex
CREATE INDEX "DraftVersion_submissionId_createdAt_idx" ON "DraftVersion"("submissionId", "createdAt");

-- CreateIndex
CREATE INDEX "Artifact_studentId_type_idx" ON "Artifact"("studentId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Rubric_key_key" ON "Rubric"("key");

-- CreateIndex
CREATE INDEX "Feedback_submissionId_submissionVersion_idx" ON "Feedback"("submissionId", "submissionVersion");

-- CreateIndex
CREATE INDEX "Feedback_status_idx" ON "Feedback"("status");

-- CreateIndex
CREATE UNIQUE INDEX "TestAttempt_testId_studentId_key" ON "TestAttempt"("testId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "PeerReview_submissionId_reviewerId_key" ON "PeerReview"("submissionId", "reviewerId");

-- CreateIndex
CREATE INDEX "XpEvent_studentId_dayKey_idx" ON "XpEvent"("studentId", "dayKey");

-- CreateIndex
CREATE UNIQUE INDEX "XpEvent_studentId_reason_sourceId_key" ON "XpEvent"("studentId", "reason", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Badge_key_key" ON "Badge"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_studentId_classId_key" ON "Portfolio"("studentId", "classId");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioItem_portfolioId_slot_key" ON "PortfolioItem"("portfolioId", "slot");

-- CreateIndex
CREATE INDEX "SafetyFlag_classId_status_idx" ON "SafetyFlag"("classId", "status");

-- CreateIndex
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId", "readAt");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassUnit" ADD CONSTRAINT "ClassUnit_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassUnit" ADD CONSTRAINT "ClassUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftVersion" ADD CONSTRAINT "DraftVersion_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAttempt" ADD CONSTRAINT "TestAttempt_testId_fkey" FOREIGN KEY ("testId") REFERENCES "ConceptTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentStats" ADD CONSTRAINT "StudentStats_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioExport" ADD CONSTRAINT "PortfolioExport_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
