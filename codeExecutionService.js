import vm from 'node:vm';
import { spawn } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const TIMEOUT_MS = 3000; // Strict 3 second execution timeout

/**
 * Normalizes string outputs for robust comparison
 * Handles CRLF vs LF, trailing whitespace, and JSON equivalence
 */
function normalizeOutput(val) {
  if (val === undefined || val === null) return '';
  const str = String(val).trim().replace(/\r\n/g, '\n');

  // Try JSON comparison if both look like JSON
  try {
    const parsed = JSON.parse(str);
    return JSON.stringify(parsed);
  } catch {
    // Return line-by-line trimmed string
    return str.split('\n').map(l => l.trimEnd()).join('\n');
  }
}

/**
 * Checks if actual output matches expected output
 */
function isOutputMatch(actual, expected) {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  if (normActual === normExpected) return true;

  // Case-insensitive fallback check
  if (normActual.toLowerCase() === normExpected.toLowerCase()) return true;

  // Numeric comparison fallback (e.g., 42 vs 42.0)
  const numAct = Number(normActual);
  const numExp = Number(normExpected);
  if (!isNaN(numAct) && !isNaN(numExp) && Math.abs(numAct - numExp) < 0.0001) {
    return true;
  }

  return false;
}

/**
 * Isolated JavaScript Execution Sandbox using node:vm
 */
async function executeJavaScript(userCode, testInput = '') {
  const startTime = Date.now();
  let logs = [];

  // Prepare isolated sandbox without sensitive Node.js APIs
  const sandbox = {
    console: {
      log: (...args) => {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      error: (...args) => {
        logs.push('[ERR] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      warn: (...args) => {
        logs.push('[WARN] ' + args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
      info: (...args) => {
        logs.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
    },
    Math,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
    String,
    Number,
    Boolean,
    Array,
    Object,
    Date,
    RegExp,
    Map,
    Set,
    BigInt,
    Promise: undefined, // Disallow async unhandled escapes
    setTimeout: undefined,
    setInterval: undefined,
    process: undefined,
    require: undefined,
    import: undefined,
    fetch: undefined,
    global: undefined,
    globalThis: undefined,
  };

  // Create VM context
  const context = vm.createContext(sandbox);

  // Wrap student code to parse input and support return values or console.log
  const wrappedScript = `
    "use strict";
    const __rawInput = ${JSON.stringify(testInput)};
    let __parsedInput;
    try {
      __parsedInput = JSON.parse(__rawInput);
    } catch {
      __parsedInput = __rawInput;
    }
    
    // Inject student code
    ${userCode}
    
    // Determine output
    let __retVal = undefined;
    if (typeof solution === 'function') {
      if (Array.isArray(__parsedInput)) {
        // If solution expects 1 parameter but input is an array, pass the whole array
        if (solution.length === 1) {
          __retVal = solution(__parsedInput);
        } else {
          __retVal = solution(...__parsedInput);
        }
      } else if (typeof __parsedInput === 'object' && __parsedInput !== null && typeof __parsedInput.input !== 'undefined') {
        __retVal = solution(__parsedInput.input);
      } else {
        __retVal = solution(__parsedInput);
      }
    } else if (typeof main === 'function') {
      __retVal = main(__parsedInput);
    }
    
    if (__retVal !== undefined) {
      if (typeof __retVal === 'object') {
        console.log(JSON.stringify(__retVal));
      } else {
        console.log(String(__retVal));
      }
    }
  `;

  try {
    const script = new vm.Script(wrappedScript);
    script.runInContext(context, {
      timeout: TIMEOUT_MS,
      displayErrors: true,
    });

    const executionTimeMs = Date.now() - startTime;
    const actualOutput = logs.join('\n');
    return {
      success: true,
      actualOutput,
      logs: logs.join('\n'),
      executionTimeMs,
      error: null,
    };
  } catch (err) {
    const executionTimeMs = Date.now() - startTime;
    let errMessage = err.message || 'Execution error';
    if (err.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
      errMessage = `Time Limit Exceeded (${TIMEOUT_MS}ms timeout reached)`;
    }
    return {
      success: false,
      actualOutput: logs.join('\n'),
      logs: logs.join('\n'),
      executionTimeMs,
      error: errMessage,
    };
  }
}

/**
 * Isolated Python Execution Engine via child process
 * Strips all sensitive environment variables and restricts execution
 */
async function executePython(userCode, testInput = '') {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';

    // Strip process.env completely. Only keep basic system PATH.
    const cleanEnv = {
      PATH: process.env.PATH || '',
      SYSTEMROOT: process.env.SYSTEMROOT || 'C:\\Windows',
      PYTHONIOENCODING: 'utf-8',
    };

    // Python wrapper script
    const pyWrapper = `
import sys
import json
import inspect

raw_input_data = ${JSON.stringify(testInput)}
try:
    parsed_input = json.loads(raw_input_data)
except Exception:
    parsed_input = raw_input_data

# User code below
${userCode}

# Auto-execute solution function if present
if 'solution' in globals() and callable(globals()['solution']):
    try:
        sig = inspect.signature(globals()['solution'])
        param_count = len(sig.parameters)
        if isinstance(parsed_input, list):
            if param_count == 1:
                res = solution(parsed_input)
            else:
                res = solution(*parsed_input)
        elif isinstance(parsed_input, dict) and 'input' in parsed_input:
            res = solution(parsed_input['input'])
        else:
            res = solution(parsed_input)
        if res is not None:
            if isinstance(res, (dict, list)):
                print(json.dumps(res))
            else:
                print(res)
    except Exception as e:
        sys.stderr.write(f"Runtime Exception in solution(): {str(e)}\\n")
`;

    // Spawn python child process
    const child = spawn('python', ['-c', pyWrapper], {
      timeout: TIMEOUT_MS,
      env: cleanEnv,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (d) => {
      stdout += d.toString('utf-8');
    });

    child.stderr.on('data', (d) => {
      stderr += d.toString('utf-8');
    });

    child.on('error', (err) => {
      resolve({
        success: false,
        actualOutput: '',
        logs: '',
        executionTimeMs: Date.now() - startTime,
        error: `Python runner unavailable or failed: ${err.message}`,
      });
    });

    child.on('close', (code, signal) => {
      const executionTimeMs = Date.now() - startTime;
      if (signal === 'SIGTERM' || executionTimeMs >= TIMEOUT_MS) {
        return resolve({
          success: false,
          actualOutput: stdout,
          logs: stdout,
          executionTimeMs,
          error: `Time Limit Exceeded (${TIMEOUT_MS}ms timeout reached)`,
        });
      }

      if (code !== 0) {
        // Clean python stack trace to remove wrapper internals
        const cleanedErr = stderr
          .split('\n')
          .filter(l => !l.includes('pyWrapper') && !l.includes('File "<string>"'))
          .join('\n')
          .trim() || stderr.trim() || `Process exited with code ${code}`;

        return resolve({
          success: false,
          actualOutput: stdout.trim(),
          logs: stdout.trim(),
          executionTimeMs,
          error: cleanedErr,
        });
      }

      resolve({
        success: true,
        actualOutput: stdout.trim(),
        logs: stdout.trim(),
        executionTimeMs,
        error: null,
      });
    });
  });
}

/**
 * Main Sandbox Execution Service API
 */
export const codeExecutionService = {
  /**
   * Executes code in target language with input
   */
  async runSingle(language, code, input = '') {
    const lang = (language || 'javascript').toLowerCase();
    if (lang === 'javascript' || lang === 'js') {
      return executeJavaScript(code, input);
    } else if (lang === 'python' || lang === 'py') {
      return executePython(code, input);
    } else {
      return {
        success: false,
        actualOutput: '',
        logs: '',
        executionTimeMs: 0,
        error: `Unsupported execution language: ${language}. Please select JavaScript or Python.`,
      };
    }
  },

  /**
   * Runs code against an array of test cases and computes scores
   * Returns complete test report with hidden vs visible details
   */
  async evaluateTestCases(language, code, testCases = [], options = { isStudentView: false }) {
    const results = [];
    let passedCount = 0;
    let totalPointsEarned = 0;
    let maxPoints = 0;

    for (const [index, tc] of testCases.entries()) {
      const tcPoints = tc.points || 10;
      maxPoints += tcPoints;

      const runResult = await this.runSingle(language, code, tc.input || '');
      const passed = runResult.success && isOutputMatch(runResult.actualOutput, tc.expectedOutput);

      if (passed) {
        passedCount++;
        totalPointsEarned += tcPoints;
      }

      // If student view and test case is hidden, conceal expected/actual details
      const isHidden = Boolean(tc.isHidden);
      if (options.isStudentView && isHidden) {
        results.push({
          testCaseNumber: index + 1,
          isHidden: true,
          passed,
          executionTimeMs: runResult.executionTimeMs,
          errorMessage: passed ? null : 'Hidden test case failed',
          points: passed ? tcPoints : 0,
          maxPoints: tcPoints,
        });
      } else {
        results.push({
          testCaseNumber: index + 1,
          isHidden: false,
          passed,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: runResult.actualOutput,
          executionTimeMs: runResult.executionTimeMs,
          errorMessage: runResult.error,
          points: passed ? tcPoints : 0,
          maxPoints: tcPoints,
        });
      }
    }

    return {
      language,
      totalTestCases: testCases.length,
      passedCount,
      totalPointsEarned,
      maxPoints,
      percentage: testCases.length > 0 ? Math.round((passedCount / testCases.length) * 100) : 0,
      results,
    };
  },
};
