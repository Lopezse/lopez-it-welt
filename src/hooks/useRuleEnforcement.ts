'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRuleEnforcement } from '../components/Features/RuleEnforcementSystem';

export function useRuleEnforcementHook() {
  const ruleEnforcement = useRuleEnforcement();

  // Wrapper-Funktionen für bessere Integration
  const checkAction = (action: string): boolean => {
    // console.log(`🔍 Prüfe Aktion: ${action}`);
    return ruleEnforcement.checkRules(action);
  };

  const requestApproval = async (action: string): Promise<boolean> => {
    // console.log(`🚨 Freigabe erforderlich für: ${action}`);
    return await ruleEnforcement.requireApproval(action);
  };

  const logAction = (action: string, status: string) => {
    ruleEnforcement.updateStatus(action, status);
  };

  const getBlockStatus = () => {
    return {
      isBlocked: ruleEnforcement.isBlocked,
      violationCount: ruleEnforcement.violationCount,
      lastViolation: ruleEnforcement.lastViolation,
      currentAction: ruleEnforcement.currentAction,
      blockReason: ruleEnforcement.getBlockReason(),
    };
  };

  const [initialized, setInitialized] = useState(false);
  const [lastEnforcedRule, setLastEnforcedRule] = useState('');
  const [lastEnforcementTime, setLastEnforcementTime] = useState('');

  useEffect(() => {
    // console.log('Rule enforcement initialized');
    setInitialized(true);
  }, []);

  const enforceRule = useCallback(
    (rule: string, context?: Record<string, unknown>) => {
      // console.log('Enforcing rule:', rule, context);
      setLastEnforcedRule(rule);
      setLastEnforcementTime(new Date().toISOString());
    },
    []
  );

  return {
    ...ruleEnforcement,
    checkAction,
    requestApproval,
    logAction,
    getBlockStatus,
    initialized,
    lastEnforcedRule,
    lastEnforcementTime,
    enforceRule,
  };
}
