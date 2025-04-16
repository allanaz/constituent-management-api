-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "line1" TEXT,
    "line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Address_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("city", "id", "isPreferred", "line1", "line2", "personId", "postalCode", "state", "type") SELECT "city", "id", "isPreferred", "line1", "line2", "personId", "postalCode", "state", "type" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE TABLE "new_Name" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personId" INTEGER NOT NULL,
    "title" TEXT,
    "first" TEXT NOT NULL,
    "middle" TEXT,
    "last" TEXT,
    "suffix" TEXT,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Name_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Name" ("first", "id", "isPreferred", "last", "middle", "personId", "suffix", "title") SELECT "first", "id", "isPreferred", "last", "middle", "personId", "suffix", "title" FROM "Name";
DROP TABLE "Name";
ALTER TABLE "new_Name" RENAME TO "Name";
CREATE TABLE "new_Person" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Person" ("email", "id") SELECT "email", "id" FROM "Person";
DROP TABLE "Person";
ALTER TABLE "new_Person" RENAME TO "Person";
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
