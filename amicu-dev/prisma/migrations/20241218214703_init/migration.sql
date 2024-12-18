-- CreateTable
CREATE TABLE "conversation" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contents" TEXT DEFAULT '',
    "sender" BIGINT,
    "conversation" BIGINT,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT DEFAULT '',
    "title" TEXT DEFAULT '',
    "thumbnail" TEXT DEFAULT '',
    "conversation" BIGINT,
    "creator" BIGINT,
    "github" TEXT,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT DEFAULT '',
    "complexity" BIGINT,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_conversation" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user" BIGINT,
    "conversation" BIGINT,

    CONSTRAINT "user_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_project" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user" BIGINT,
    "project" BIGINT,

    CONSTRAINT "user_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tag" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user" BIGINT,
    "tag" BIGINT,

    CONSTRAINT "user_tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conversation_id_key" ON "conversation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "message_id_key" ON "message"("id");

-- CreateIndex
CREATE UNIQUE INDEX "project_id_key" ON "project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_id_key" ON "tag"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_conversation_id_key" ON "user_conversation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_project_id_key" ON "user_project"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_tag_id_key" ON "user_tag"("id");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_conversation_fkey" FOREIGN KEY ("conversation") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_sender_fkey" FOREIGN KEY ("sender") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_conversation_fkey" FOREIGN KEY ("conversation") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_creator_fkey" FOREIGN KEY ("creator") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_conversation" ADD CONSTRAINT "user_conversation_conversation_fkey" FOREIGN KEY ("conversation") REFERENCES "conversation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_conversation" ADD CONSTRAINT "user_conversation_user_fkey" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_project" ADD CONSTRAINT "user_project_project_fkey" FOREIGN KEY ("project") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_project" ADD CONSTRAINT "user_project_user_fkey" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_tag" ADD CONSTRAINT "user_tag_tag_fkey" FOREIGN KEY ("tag") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_tag" ADD CONSTRAINT "user_tag_user_fkey" FOREIGN KEY ("user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
