-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "id_token" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubEvents" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "repo_name" TEXT NOT NULL,
    "repo_url" TEXT NOT NULL,
    "branch" TEXT,
    "master_branch" TEXT,
    "description" TEXT,
    "commit_hash_head" TEXT,
    "commit_hash_before" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GithubEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GithubCommit" (
    "id" SERIAL NOT NULL,
    "sha" TEXT NOT NULL,
    "commit_msg" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "addition" INTEGER NOT NULL,
    "deletion" INTEGER NOT NULL,
    "githubEventsId" INTEGER NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GithubCommit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "addition" INTEGER NOT NULL,
    "deletion" INTEGER NOT NULL,
    "changes" INTEGER NOT NULL,
    "blob_url" TEXT NOT NULL,
    "raw_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "githubCommitId" INTEGER,
    "vsCodeEventId" INTEGER,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VsCodeEvent" (
    "id" SERIAL NOT NULL,
    "project_name" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "branch" TEXT NOT NULL,
    "session_start" TIMESTAMP(3) NOT NULL,
    "session_end" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VsCodeEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubEvents" ADD CONSTRAINT "GithubEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GithubCommit" ADD CONSTRAINT "GithubCommit_githubEventsId_fkey" FOREIGN KEY ("githubEventsId") REFERENCES "GithubEvents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_githubCommitId_fkey" FOREIGN KEY ("githubCommitId") REFERENCES "GithubCommit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VsCodeEvent" ADD CONSTRAINT "VsCodeEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
