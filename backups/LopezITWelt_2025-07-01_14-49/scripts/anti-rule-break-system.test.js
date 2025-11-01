const AntiRuleBreakSystem = require('./anti-rule-break-system');

describe('AntiRuleBreakSystem', () => {
    let system;

    beforeEach(() => {
        system = new AntiRuleBreakSystem();
    });

    describe('System Initialization', () => {
        it('should initialize with correct default values', () => {
            expect(system.violationCount).toBe(0);
            expect(system.blockedActions).toEqual([]);
            expect(system.lastViolation).toBe('');
            expect(system.isBlocked).toBe(false);
            expect(system.approvalGiven).toBe(false);
            expect(system.currentSession).toBe(null);
        });
    });

    describe('System Time Validation', () => {
        it('should validate system time correctly', async () => {
            const result = await system.validateSystemTime();
            expect(result).toHaveProperty('valid');
            expect(typeof result.valid).toBe('boolean');
        });

        it('should detect invalid system time', async () => {
            // Mock execSync to return invalid time
            const originalExecSync = require('child_process').execSync;
            require('child_process').execSync = jest.fn().mockReturnValue('2025-01-19 10:00:00');

            const result = await system.validateSystemTime();
            expect(result.valid).toBe(false);
            expect(result.reason).toContain('Falsche System-Zeit');

            // Restore original
            require('child_process').execSync = originalExecSync;
        });
    });

    describe('Date Copying Validation', () => {
        it('should allow normal actions', async () => {
            const result = await system.validateNoDateCopying('normal action');
            expect(result.valid).toBe(true);
        });

        it('should block date copying patterns', async () => {
            const patterns = [
                '2025-01-19',
                '29.07.2025',
                'copy date',
                'kopiere datum'
            ];

            for (const pattern of patterns) {
                const result = await system.validateNoDateCopying(pattern);
                expect(result.valid).toBe(false);
                expect(result.reason).toContain('Datumskopieren erkannt');
            }
        });
    });

    describe('MD Structure Validation', () => {
        it('should allow new files', async () => {
            const result = await system.validateMdStructure('nonexistent.md');
            expect(result.valid).toBe(true);
        });

        it('should protect large MD files', async () => {
            const fs = require('fs');
            const originalExistsSync = fs.existsSync;
            const originalReadFileSync = fs.readFileSync;

            // Mock file exists and is large
            fs.existsSync = jest.fn().mockReturnValue(true);
            fs.readFileSync = jest.fn().mockReturnValue('x'.repeat(2000));

            const result = await system.validateMdStructure('large.md');
            expect(result.valid).toBe(false);
            expect(result.reason).toContain('Große .md-Datei');

            // Restore
            fs.existsSync = originalExistsSync;
            fs.readFileSync = originalReadFileSync;
        });
    });

    describe('Time Tracking Validation', () => {
        it('should validate time tracking for topic changes', async () => {
            const result = await system.validateTimeTracking('datumsvalidierung test');
            expect(result.valid).toBe(false);
            expect(result.reason).toContain('Zeiterfassung nicht gewechselt');
        });

        it('should allow actions when session is set', async () => {
            system.currentSession = 'datumsvalidierung';
            const result = await system.validateTimeTracking('datumsvalidierung test');
            expect(result.valid).toBe(true);
        });
    });

    describe('Action Blocking', () => {
        it('should block actions and increment violation count', () => {
            const initialCount = system.violationCount;
            system.blockAction('Test Rule', 'Test Reason');

            expect(system.violationCount).toBe(initialCount + 1);
            expect(system.isBlocked).toBe(true);
            expect(system.lastViolation).toBe('Test Rule: Test Reason');
            expect(system.blockedActions).toHaveLength(1);
        });

        it('should document violations', () => {
            const fs = require('fs');
            const originalWriteFileSync = fs.writeFileSync;
            const mockWriteFileSync = jest.fn();
            fs.writeFileSync = mockWriteFileSync;

            system.documentViolation('Test Rule', 'Test Reason');

            expect(mockWriteFileSync).toHaveBeenCalled();
            expect(mockWriteFileSync.mock.calls[0][0]).toBe('STATUS.md');

            fs.writeFileSync = originalWriteFileSync;
        });
    });

    describe('Approval Management', () => {
        it('should grant approval correctly', () => {
            system.grantApproval();
            expect(system.approvalGiven).toBe(true);
            expect(system.isBlocked).toBe(false);
        });

        it('should revoke approval correctly', () => {
            system.approvalGiven = true;
            system.isBlocked = false;

            system.revokeApproval();
            expect(system.approvalGiven).toBe(false);
            expect(system.isBlocked).toBe(true);
        });
    });

    describe('Status Display', () => {
        it('should show correct status', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            system.showStatus();

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Anti-Regelbruch-System Status:'));

            consoleSpy.mockRestore();
        });
    });

    describe('MD File Detection', () => {
        it('should detect MD files correctly', () => {
            expect(system.isMdFile('test.md')).toBe(true);
            expect(system.isMdFile('test.MD')).toBe(true);
            expect(system.isMdFile('test.txt')).toBe(false);
            expect(system.isMdFile('')).toBe(false);
            expect(system.isMdFile(null)).toBe(false);
        });
    });

    describe('Daily Checklist', () => {
        it('should run daily checklist', async () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

            await system.runDailyChecklist();

            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Anti-Regelbruch Tägliche Checkliste:'));

            consoleSpy.mockRestore();
        });
    });

    describe('Before Action Validation', () => {
        it('should validate before action with all checks', async () => {
            // Mock all validation methods to return success
            system.validateSystemTime = jest.fn().mockResolvedValue({ valid: true });
            system.validateNoDateCopying = jest.fn().mockResolvedValue({ valid: true });
            system.validateMdStructure = jest.fn().mockResolvedValue({ valid: true });
            system.validateTimeTracking = jest.fn().mockResolvedValue({ valid: true });
            system.approvalGiven = true;

            const result = await system.validateBeforeAction('test action', 'test.md');

            expect(result).toBe(true);
            expect(system.validateSystemTime).toHaveBeenCalled();
            expect(system.validateNoDateCopying).toHaveBeenCalledWith('test action');
            expect(system.validateMdStructure).toHaveBeenCalledWith('test.md');
            expect(system.validateTimeTracking).toHaveBeenCalledWith('test action');
        });

        it('should block action when system time validation fails', async () => {
            system.validateSystemTime = jest.fn().mockResolvedValue({
                valid: false,
                reason: 'System-Zeit nicht validiert'
            });

            const result = await system.validateBeforeAction('test action');

            expect(result).toBe(false);
            expect(system.isBlocked).toBe(true);
        });
    });
}); 