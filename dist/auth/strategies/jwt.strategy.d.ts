import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/auth-response.dto';
import { TokenBlacklistService } from '../token-blacklist.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private tokenBlacklistService;
    constructor(configService: ConfigService, tokenBlacklistService: TokenBlacklistService);
    validate(req: any, payload: JwtPayload): Promise<{
        userId: string;
        username: string;
        email: string;
        role: string;
        roleId: number;
    }>;
}
export {};
