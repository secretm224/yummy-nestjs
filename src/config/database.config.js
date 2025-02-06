"use strict";   
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const path_1 = require("path");
const typeOrmConfig = (configService) => {
    return {
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        entities: [(0, path_1.join)(__dirname, '..', '**', '*.entity.{js,ts}')],
    };
};
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=database.config.js.map