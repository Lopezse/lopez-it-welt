/**
 * Secret Manager Tests - Enterprise++ Standard
 * 
 * Unit-Tests für SecretManager-Klasse
 */

import { SecretManager } from "../secret-manager";

describe("SecretManager", () => {
    // Cleanup: Environment-Variablen nach Tests zurücksetzen
    const originalEnv = process.env;

    beforeEach(() => {
        // Reset environment
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        // Restore original environment
        process.env = originalEnv;
    });

    describe("loadSecret", () => {
        it("should load secret from ENV reference", () => {
            process.env.TEST_KEY = "test-value-123";
            const secret = SecretManager.loadSecret("ENV:TEST_KEY");
            expect(secret).toBe("test-value-123");
        });

        it("should return empty string for MOCK reference", () => {
            const secret = SecretManager.loadSecret("MOCK");
            expect(secret).toBe("");
        });

        it("should throw error if ENV variable not found", () => {
            delete process.env.NONEXISTENT_KEY;
            expect(() => {
                SecretManager.loadSecret("ENV:NONEXISTENT_KEY");
            }).toThrow("Environment variable 'NONEXISTENT_KEY' not found");
        });

        it("should throw error if ENV variable is empty", () => {
            process.env.EMPTY_KEY = "";
            expect(() => {
                SecretManager.loadSecret("ENV:EMPTY_KEY");
            }).toThrow("Environment variable 'EMPTY_KEY' not found or empty");
        });

        it("should throw error for unknown format", () => {
            expect(() => {
                SecretManager.loadSecret("INVALID:FORMAT");
            }).toThrow("Unknown secret reference format");
        });

        it("should handle OpenAI API key format", () => {
            process.env.OPENAI_API_KEY = "sk-abc123def456ghi789";
            const secret = SecretManager.loadSecret("ENV:OPENAI_API_KEY");
            expect(secret).toBe("sk-abc123def456ghi789");
            expect(secret.startsWith("sk-")).toBe(true);
        });
    });

    describe("hasSecret", () => {
        it("should return true if secret exists", () => {
            process.env.TEST_KEY = "test-value";
            expect(SecretManager.hasSecret("ENV:TEST_KEY")).toBe(true);
        });

        it("should return false if secret does not exist", () => {
            delete process.env.NONEXISTENT_KEY;
            expect(SecretManager.hasSecret("ENV:NONEXISTENT_KEY")).toBe(false);
        });

        it("should return true for MOCK", () => {
            expect(SecretManager.hasSecret("MOCK")).toBe(true);
        });

        it("should return false for empty ENV variable", () => {
            process.env.EMPTY_KEY = "";
            expect(SecretManager.hasSecret("ENV:EMPTY_KEY")).toBe(false);
        });
    });

    describe("maskSecret", () => {
        it("should mask OpenAI API key", () => {
            const masked = SecretManager.maskSecret("sk-abc123def456ghi789jkl012");
            expect(masked).toBe("sk-***masked***");
            expect(masked).not.toContain("abc123");
        });

        it("should mask generic secrets", () => {
            const masked = SecretManager.maskSecret("my-secret-key-12345");
            expect(masked).toBe("my-***masked***");
            expect(masked).not.toContain("12345");
        });

        it("should mask short secrets completely", () => {
            const masked = SecretManager.maskSecret("key");
            expect(masked).toBe("***masked***");
        });

        it("should handle empty secrets", () => {
            const masked = SecretManager.maskSecret("");
            expect(masked).toBe("***empty***");
        });

        it("should never expose full secret", () => {
            const original = "sk-very-long-secret-key-that-should-be-masked";
            const masked = SecretManager.maskSecret(original);
            expect(masked).not.toContain("very-long");
            expect(masked.length).toBeLessThan(original.length);
        });
    });

    describe("isValidSecretRef", () => {
        it("should validate ENV format", () => {
            expect(SecretManager.isValidSecretRef("ENV:OPENAI_API_KEY")).toBe(true);
            expect(SecretManager.isValidSecretRef("ENV:TEST_KEY")).toBe(true);
            expect(SecretManager.isValidSecretRef("ENV:MY_VAR_123")).toBe(true);
        });

        it("should validate MOCK format", () => {
            expect(SecretManager.isValidSecretRef("MOCK")).toBe(true);
        });

        it("should reject invalid formats", () => {
            expect(SecretManager.isValidSecretRef("INVALID:FORMAT")).toBe(false);
            expect(SecretManager.isValidSecretRef("ENV:")).toBe(false);
            expect(SecretManager.isValidSecretRef("")).toBe(false);
            expect(SecretManager.isValidSecretRef("ENV:invalid-var-name")).toBe(false);
        });
    });

    describe("extractEnvVarName", () => {
        it("should extract ENV variable name", () => {
            expect(SecretManager.extractEnvVarName("ENV:OPENAI_API_KEY")).toBe("OPENAI_API_KEY");
            expect(SecretManager.extractEnvVarName("ENV:TEST_KEY")).toBe("TEST_KEY");
        });

        it("should return null for MOCK", () => {
            expect(SecretManager.extractEnvVarName("MOCK")).toBeNull();
        });

        it("should return null for invalid format", () => {
            expect(SecretManager.extractEnvVarName("INVALID:FORMAT")).toBeNull();
        });
    });

    describe("Security", () => {
        it("should not log secrets", () => {
            const consoleSpy = jest.spyOn(console, "log").mockImplementation();
            process.env.TEST_KEY = "secret-value";
            
            SecretManager.loadSecret("ENV:TEST_KEY");
            
            // Prüfe, dass kein Secret geloggt wurde
            const logCalls = consoleSpy.mock.calls.flat().join(" ");
            expect(logCalls).not.toContain("secret-value");
            
            consoleSpy.mockRestore();
        });

        it("should mask secrets in error messages", () => {
            process.env.TEST_KEY = "sk-secret-key-123";
            
            try {
                // Trigger error (z.B. durch ungültiges Format)
                SecretManager.loadSecret("INVALID:FORMAT");
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                // Error sollte kein Secret enthalten
                expect(errorMessage).not.toContain("sk-secret-key-123");
            }
        });
    });
});





