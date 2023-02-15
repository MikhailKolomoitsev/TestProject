-- AlterTable
ALTER TABLE `Order` ADD COLUMN `salesId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Sales` (
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` VARCHAR(191) NULL,
    `id` VARCHAR(191) NOT NULL,
    `totalPrice` INTEGER NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_salesId_fkey` FOREIGN KEY (`salesId`) REFERENCES `Sales`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sales` ADD CONSTRAINT `Sales_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
