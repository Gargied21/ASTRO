-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'DEVOTEE',
    "code" TEXT NOT NULL,
    "gotra" TEXT NOT NULL DEFAULT 'भारद्वाज (काश्यप प्रवर)',
    "nakshatra" TEXT NOT NULL DEFAULT 'रोहिणी',
    "charan" TEXT NOT NULL DEFAULT '२',
    "rashi" TEXT NOT NULL DEFAULT 'वृषभ (स्वामी: शुक्र)',
    "address" TEXT,
    "dob" TEXT,
    "tob" TEXT,
    "pob" TEXT,
    "kuladaivat" TEXT,
    "panNumber" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "nakshatra" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FamilyMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DevoteeSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'mr',
    "whatsappAlerts" BOOLEAN NOT NULL DEFAULT true,
    "emailDigest" BOOLEAN NOT NULL DEFAULT true,
    "panchangReminders" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DevoteeSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "serviceDomain" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "consultationMode" TEXT NOT NULL,
    "slotDate" TEXT NOT NULL,
    "slotTime" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "birthDate" TEXT,
    "birthTime" TEXT,
    "birthPlace" TEXT,
    "notes" TEXT,
    "whatsappOptIn" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receiptNo" TEXT NOT NULL,
    "userId" TEXT,
    "donorName" TEXT NOT NULL,
    "donorPhone" TEXT NOT NULL,
    "donorPan" TEXT,
    "category" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "purposeMr" TEXT NOT NULL,
    "purposeHi" TEXT,
    "purposeGu" TEXT,
    "amount" REAL NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'Razorpay UPI',
    "status" TEXT NOT NULL DEFAULT '८०-जी जारी (Verified)',
    "fy" TEXT NOT NULL DEFAULT '2024-25',
    "date" TEXT NOT NULL,
    "dateIso" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ritual" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "titleMr" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusLabel" TEXT NOT NULL,
    "dayProgress" TEXT,
    "japaCompleted" INTEGER DEFAULT 0,
    "japaTotal" INTEGER DEFAULT 100000,
    "chiefHotri" TEXT NOT NULL,
    "assistantPandits" TEXT NOT NULL,
    "sankalpaIntent" TEXT NOT NULL,
    "todaySession" TEXT NOT NULL,
    "liveStreamAvailable" BOOLEAN NOT NULL DEFAULT false,
    "trackingNumber" TEXT,
    "trackingStatus" TEXT,
    "trackingStepsJson" TEXT,
    "date" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "recordingDuration" TEXT,
    "shlokaBlessing" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ritual_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AstrologyConsultation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "acharyName" TEXT NOT NULL,
    "acharyaTitle" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "subject" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AstrologyConsultation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AstrologyQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "consultationId" TEXT,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Reviewed by Shastriji',
    "refBhav" TEXT NOT NULL,
    "answer" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AstrologyQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AstrologyQuestion_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "AstrologyConsultation" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PoojaCatalog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameMr" TEXT NOT NULL,
    "nameHi" TEXT,
    "nameGu" TEXT,
    "category" TEXT NOT NULL,
    "categoryLabelEn" TEXT NOT NULL,
    "categoryLabelMr" TEXT NOT NULL,
    "categoryLabelHi" TEXT NOT NULL,
    "categoryLabelGu" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionMr" TEXT NOT NULL,
    "descriptionHi" TEXT,
    "descriptionGu" TEXT,
    "longDescriptionEn" TEXT NOT NULL,
    "longDescriptionMr" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "pandits" TEXT NOT NULL,
    "samagri" TEXT NOT NULL,
    "modesJson" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "priceLabel" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "lineage" TEXT NOT NULL,
    "benefitsJson" TEXT NOT NULL,
    "includedItemsJson" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GurukulCourse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titleEn" TEXT NOT NULL,
    "titleMr" TEXT NOT NULL,
    "titleHi" TEXT NOT NULL,
    "titleGu" TEXT,
    "category" TEXT NOT NULL,
    "categoryLabelEn" TEXT NOT NULL,
    "categoryLabelMr" TEXT,
    "categoryLabelHi" TEXT,
    "categoryLabelGu" TEXT,
    "duration" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionMr" TEXT NOT NULL,
    "descriptionHi" TEXT,
    "descriptionGu" TEXT,
    "eligibility" TEXT NOT NULL,
    "seva" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lessonsCount" INTEGER NOT NULL DEFAULT 0,
    "completedLessons" INTEGER NOT NULL DEFAULT 0,
    "acharya" TEXT NOT NULL,
    "syllabusHighlightsJson" TEXT NOT NULL,
    "isFeaturedAudio" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GurukulSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "refNo" TEXT NOT NULL,
    "mantraTitle" TEXT NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending_review',
    "feedback" TEXT,
    "score" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GurukulSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dateDay" TEXT NOT NULL,
    "dateMonth" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "attendees" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContactInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleMr" TEXT NOT NULL,
    "titleHi" TEXT,
    "titleGu" TEXT,
    "timeEn" TEXT NOT NULL,
    "timeMr" TEXT NOT NULL,
    "timeHi" TEXT,
    "timeGu" TEXT,
    "messageEn" TEXT NOT NULL,
    "messageMr" TEXT NOT NULL,
    "messageHi" TEXT,
    "messageGu" TEXT,
    "unread" BOOLEAN NOT NULL DEFAULT true,
    "actionModule" TEXT NOT NULL,
    "actionTextEn" TEXT NOT NULL,
    "actionTextMr" TEXT NOT NULL,
    "actionTextHi" TEXT,
    "actionTextGu" TEXT,
    "icon" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OtpSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_code_key" ON "User"("code");

-- CreateIndex
CREATE INDEX "FamilyMember_userId_idx" ON "FamilyMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DevoteeSettings_userId_key" ON "DevoteeSettings"("userId");

-- CreateIndex
CREATE INDEX "Appointment_userId_idx" ON "Appointment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_receiptNo_key" ON "Donation"("receiptNo");

-- CreateIndex
CREATE INDEX "Donation_userId_fy_idx" ON "Donation"("userId", "fy");

-- CreateIndex
CREATE INDEX "Ritual_userId_status_idx" ON "Ritual"("userId", "status");

-- CreateIndex
CREATE INDEX "Ritual_trackingNumber_idx" ON "Ritual"("trackingNumber");

-- CreateIndex
CREATE INDEX "AstrologyConsultation_userId_idx" ON "AstrologyConsultation"("userId");

-- CreateIndex
CREATE INDEX "AstrologyQuestion_userId_idx" ON "AstrologyQuestion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GurukulSubmission_refNo_key" ON "GurukulSubmission"("refNo");

-- CreateIndex
CREATE INDEX "GurukulSubmission_userId_idx" ON "GurukulSubmission"("userId");

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_idx" ON "EventRegistration"("eventId");

-- CreateIndex
CREATE INDEX "Notification_userId_unread_idx" ON "Notification"("userId", "unread");

-- CreateIndex
CREATE INDEX "OtpSession_phone_idx" ON "OtpSession"("phone");
