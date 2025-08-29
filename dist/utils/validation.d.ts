export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}
/**
 * Validates the environment configuration
 * Following CIQ's Excellence principle - validate thoroughly before proceeding
 */
export declare function validateEnvironment(): ValidationResult;
/**
 * Validates input parameters for tools
 */
export declare function validateToolInput<T>(input: unknown, schema: any): T;
//# sourceMappingURL=validation.d.ts.map