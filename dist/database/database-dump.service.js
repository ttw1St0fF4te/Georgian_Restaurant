"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseDumpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const child_process_1 = require("child_process");
const util_1 = require("util");
const path = require("path");
const os = require("os");
const fs = require("fs");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let DatabaseDumpService = class DatabaseDumpService {
    constructor(configService) {
        this.configService = configService;
    }
    async createDatabaseDump() {
        const dbHost = 'localhost';
        const dbPort = this.configService.get('DB_PORT', '5432');
        const dbName = this.configService.get('DB_DATABASE');
        const dbUser = this.configService.get('DB_USERNAME');
        const dbPassword = this.configService.get('DB_PASSWORD');
        const containerName = 'pgdocker';
        if (!dbName || !dbUser) {
            throw new Error('Database configuration not found');
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `db_dump_${timestamp}.sql`;
        const desktopDir = path.join(os.homedir(), 'Desktop');
        const filePath = path.join(desktopDir, fileName);
        if (!fs.existsSync(desktopDir)) {
            throw new Error(`Desktop directory not found: ${desktopDir}`);
        }
        const fullCommand = `PGPASSWORD=${dbPassword} docker exec -i ${containerName} pg_dump -U ${dbUser} --no-password --verbose --clean --create --if-exists --format=plain ${dbName} > "${filePath}"`;
        try {
            console.log(`Creating dump of database: ${dbName}`);
            console.log(`Using container: ${containerName}`);
            console.log(`Output file: ${filePath}`);
            const { stdout, stderr } = await execAsync(fullCommand, {
                shell: '/bin/bash',
                env: { ...process.env, PGPASSWORD: dbPassword },
            });
            if (stderr && !stderr.includes('NOTICE')) {
                console.warn('Command stderr:', stderr);
            }
            if (!fs.existsSync(filePath)) {
                throw new Error('Dump file was not created');
            }
            const stats = fs.statSync(filePath);
            console.log(`Database dump created successfully: ${filePath} (${stats.size} bytes)`);
            return { filePath, fileName };
        }
        catch (error) {
            console.error('Error creating database dump:', error);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                }
                catch (unlinkError) {
                    console.error('Error removing partial dump file:', unlinkError);
                }
            }
            throw new Error(`Failed to create database dump: ${error.message}`);
        }
    }
    async getDatabaseInfo() {
        return {
            host: this.configService.get('DB_HOST', 'localhost'),
            port: this.configService.get('DB_PORT', '5432'),
            database: this.configService.get('DB_DATABASE', ''),
            user: this.configService.get('DB_USERNAME', '')
        };
    }
};
exports.DatabaseDumpService = DatabaseDumpService;
exports.DatabaseDumpService = DatabaseDumpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DatabaseDumpService);
//# sourceMappingURL=database-dump.service.js.map