$APP.settings.dev = false;
(async () => {
	await (async () => {
function createTestEngine({ terminal = console } = {}) {
	// Private state
	const suites = new Map();
	let currentSuite = null;
	let currentDescribe = null;
	let beforeEachFns = [];
	let afterEachFns = [];
	// Console styling
	const styles = {
		title:
			"font-size: 18px; font-weight: bold; color: #e1e1e1; background: #1e1e1e; padding: 4px 8px; border-radius: 4px;",
		suite:
			"font-size: 16px; font-weight: bold; color: #e1e1e1; background: #0d4a8f; padding: 4px 8px; border-radius: 4px;",
		describe:
			"font-size: 14px; color: #58a6ff; font-weight: bold; border-left: 4px solid #58a6ff; padding-left: 8px;",
		passed: "color: #3fb950; font-weight: bold;",
		failed: "color: #f85149; font-weight: bold;",
		testName: "color: #c9d1d9;",
		errorMsg:
			"color: #f85149; background: #3b1e1f; padding: 2px 4px; border-radius: 2px;",
		summary: "font-size: 15px; font-weight: bold; color: #c9d1d9;",
		summaryPass: "color: #3fb950; font-size: 15px; font-weight: bold;",
		summaryFail: "color: #f85149; font-size: 15px; font-weight: bold;",
		time: "color: #8b949e; font-style: italic;",
	};

	// Create the API
	function suite(name, fn) {
		if (suites.has(name)) {
			throw new Error(`Suite '${name}' already exists`);
		}

		currentSuite = {
			name,
			describes: [],
			beforeEach: null,
			afterEach: null,
			beforeAll: [],
			afterAll: [],
		};

		suites.set(name, currentSuite);
		fn();
		currentSuite = null;
	}

	function describe(description, fn) {
		if (!currentSuite) {
			throw new Error("describe() must be called within a suite()");
		}

		const prevDescribe = currentDescribe;
		const parentDescribe = currentDescribe;
		currentDescribe = {
			description,
			tests: [],
			beforeEach: [],
			afterEach: [],
			beforeAll: [],
			afterAll: [],
			parent: parentDescribe,
		};

		currentSuite.describes.push(currentDescribe);

		// Save current beforeEach/afterEach functions
		const prevBeforeEach = [...beforeEachFns];
		const prevAfterEach = [...afterEachFns];

		// Run the describe function
		fn();

		// Restore state
		currentDescribe = prevDescribe;
		beforeEachFns = prevBeforeEach;
		afterEachFns = prevAfterEach;
	}

	function it(testName, fn) {
		if (!currentDescribe) {
			throw new Error("it() must be called within a describe()");
		}

		currentDescribe.tests.push({
			name: testName,
			fn,
		});
	}

	function beforeEach(fn) {
		if (currentDescribe) {
			beforeEachFns.push(fn);
			currentDescribe.beforeEach.push(fn);
		} else if (currentSuite) {
			currentSuite.beforeEach = fn;
		} else {
			throw new Error(
				"beforeEach() must be called within a suite() or describe()",
			);
		}
	}

	function afterEach(fn) {
		if (currentDescribe) {
			afterEachFns.push(fn);
			currentDescribe.afterEach.push(fn);
		} else if (currentSuite) {
			currentSuite.afterEach = fn;
		} else {
			throw new Error(
				"afterEach() must be called within a suite() or describe()",
			);
		}
	}

	function beforeAll(fn) {
		if (currentDescribe) {
			currentDescribe.beforeAll.push(fn);
		} else if (currentSuite) {
			currentSuite.beforeAll.push(fn);
		} else {
			throw new Error(
				"beforeAll() must be called within a suite() or describe()",
			);
		}
	}

	function afterAll(fn) {
		if (currentDescribe) {
			currentDescribe.afterAll.push(fn);
		} else if (currentSuite) {
			currentSuite.afterAll.push(fn);
		} else {
			throw new Error(
				"afterAll() must be called within a suite() or describe()",
			);
		}
	}

	async function run(suiteName) {
		terminal.info("%c🧪 TEST ENGINE RUNNING", styles.title);

		const startTime = performance.now();

		const results = {
			totalSuites: 0,
			totalTests: 0,
			passed: 0,
			failed: 0,
			skipped: 0,
			failures: [],
		};

		// Run specific suite or all suites
		const suitesToRun = suiteName
			? suites.has(suiteName)
				? [suites.get(suiteName)]
				: []
			: Array.from(suites.values());

		if (suiteName && !suites.has(suiteName)) {
			terminal.info(`%c❌ Suite '${suiteName}' not found`, styles.failed);
			return results;
		}

		results.totalSuites = suitesToRun.length;
		// Run each suite
		for (const suite of suitesToRun) {
			// Run suite-level beforeAll if defined (once per suite)
			if (suite.beforeAll?.length && !suite._beforeAllRun) {
				for (const fn of suite.beforeAll) {
					await fn();
				}
				suite._beforeAllRun = true;
			}

			terminal.info(`%c📦 SUITE: ${suite.name}`, styles.suite);

			for (const describe of suite.describes) {
				// Run describe-level beforeAll hooks
				if (describe.beforeAll?.length) {
					for (const fn of describe.beforeAll) {
						await fn();
					}
				}
				terminal.info(`  %c${describe.description}`, styles.describe);
				results.totalTests += describe.tests.length;

				// Run each test
				for (const test of describe.tests) {
					try {
						const collectHooks = (desc) => {
							const hooks = [];
							while (desc) {
								hooks.unshift(...desc.beforeEach);
								desc = desc.parent;
							}
							return hooks;
						};
						// Run suite-level beforeEach if defined
						if (suite.beforeEach) {
							await suite.beforeEach();
						}

						// Run all beforeEach functions for this describe block
						for (const beforeFn of collectHooks(describe)) {
							await beforeFn();
						}

						// Run the test
						await test.fn();

						// Run all afterEach functions for this describe block
						for (const afterFn of describe.afterEach) {
							await afterFn();
						}

						// Run suite-level afterEach if defined
						if (suite.afterEach) {
							await suite.afterEach();
						}

						terminal.info(
							`%c    ✓%c ${test.name}`,
							styles.passed,
							styles.testName,
						);
						results.passed++;
					} catch (error) {
						terminal.info(
							`%c    ✗%c ${test.name}`,
							styles.failed,
							styles.testName,
						);
						terminal.info(`      %c${error.message}`, styles.errorMsg);
						results.failed++;
						results.failures.push({
							suite: suite.name,
							describe: describe.description,
							test: test.name,
							error,
						});
					}
				}
				// Run describe-level afterAll hooks
				if (describe.afterAll?.length) {
					for (const fn of describe.afterAll) {
						await fn();
					}
				}
			}
			// Run suite-level afterAll hooks
			if (suite.afterAll?.length) {
				for (const fn of suite.afterAll) {
					await fn();
				}
			}
			terminal.info("");
		}

		const endTime = performance.now();
		const duration = ((endTime - startTime) / 1000).toFixed(2);

		terminal.info("%c📊 TEST RESULTS:", styles.summary);
		terminal.info(`%c✅ Passed: ${results.passed}`, styles.summaryPass);

		if (results.failed > 0) {
			terminal.info(`%c❌ Failed: ${results.failed}`, styles.summaryFail);
			terminal.info("\n%cFailure Details:", styles.summaryFail);
			results.failures.forEach((failure, index) => {
				terminal.info(
					`%c${index + 1}) ${failure.suite} > ${failure.describe} > ${failure.test}`,
					styles.failed,
				);
				terminal.info(`   %c${failure.error.message}`, styles.errorMsg);
				terminal.info(`   %c${failure.error.stack}`, styles.errorMsg);
			});
		}

		terminal.info(`%cTotal Suites: ${results.totalSuites}`, styles.summary);
		terminal.info(`%cTotal Tests: ${results.totalTests}`, styles.summary);
		terminal.info(`%cTime: ${duration}s`, styles.time);

		return results;
	}

	async function runFile(filePath) {
		try {
			await import(filePath);
			return run();
		} catch (error) {
			terminal.info(
				`%c❌ Error loading test file: ${error.message}`,
				styles.errorMsg,
			);
			terminal.info(error.stack);
			return {
				totalSuites: 0,
				totalTests: 0,
				passed: 0,
				failed: 1,
				failures: [
					{
						error: `File load failed: ${error.message}`,
					},
				],
			};
		}
	}

	const iframe = {
		run(suiteName) {
			const iframe = document.createElement("iframe");
			iframe.src = `http://test.localhost:1313/test.html?run=suite&suiteName=${encodeURIComponent(suiteName ?? "")}`;
			iframe.style.width = "100%";
			iframe.style.height = "600px";
			document.body.appendChild(iframe);
		},
		runFile(filePath, suiteName) {
			const iframe = document.createElement("iframe");
			iframe.src = `http://test.localhost:1313/test.html?run=file&filePath=${encodeURIComponent(filePath ?? "")}&suiteName=${encodeURIComponent(suiteName ?? "")}`;
			iframe.style.width = "100%";
			iframe.style.height = "600px";
			document.body.appendChild(iframe);
		},
		runDescribe(filePath, suiteName) {
			const iframe = document.createElement("iframe");
			iframe.src = `http://test.localhost:1313/test.html?run=describe&filePath=${encodeURIComponent(filePath ?? "")}&suiteName=${encodeURIComponent(suiteName ?? "")}`;
			iframe.style.width = "100%";
			iframe.style.height = "600px";
			document.body.appendChild(iframe);
		},
	};
	async function runDescribe(filePath, describeName, suiteName) {
		terminal.clear();
		terminal.info("%c🧪 TEST ENGINE RUNNING SPECIFIC DESCRIBE", styles.title);

		const startTime = performance.now();

		const results = {
			totalSuites: 0,
			totalTests: 0,
			passed: 0,
			failed: 0,
			skipped: 0,
			failures: [],
		};

		try {
			// First load the test file if provided
			if (filePath) {
				try {
					await import(filePath);
				} catch (error) {
					terminal.info(
						`%c❌ Error loading test file: ${error.message}`,
						styles.errorMsg,
					);
					terminal.info(error.stack);
					return {
						totalSuites: 0,
						totalTests: 0,
						passed: 0,
						failed: 1,
						failures: [
							{
								error: `File load failed: ${error.message}`,
							},
						],
					};
				}
			}

			let suite;
			if (suiteName) suite = suites.get(suiteName);
			if (!suite) suite = suites.entries().next().value?.[1];
			if (!suite) {
				terminal.info(`%c❌ Suite '${suiteName}' not found`, styles.failed);
				return results;
			}

			results.totalSuites = 1;
			// Find the requested suite
			// Find the requested describe block
			const targetDescribe = suite.describes.find(
				(d) => d.description === describeName,
			);

			if (!targetDescribe) {
				terminal.info(
					`%c❌ Describe block '${describeName}' not found in suite '${suiteName}'`,
					styles.failed,
				);
				return results;
			}

			// Run suite-level beforeAll if defined (once per suite)
			if (suite.beforeAll?.length && !suite._beforeAllRun) {
				for (const fn of suite.beforeAll) {
					await fn();
				}
				suite._beforeAllRun = true;
			}

			terminal.info(`%c📦 SUITE: ${suite.name}`, styles.suite);

			// Run describe-level beforeAll hooks
			if (targetDescribe.beforeAll?.length) {
				for (const fn of targetDescribe.beforeAll) {
					await fn();
				}
			}

			terminal.info(`  %c${targetDescribe.description}`, styles.describe);
			results.totalTests += targetDescribe.tests.length;

			// Collect all parent beforeEach hooks
			const collectHooks = (desc) => {
				const hooks = [];
				let currentDesc = desc;
				while (currentDesc) {
					hooks.unshift(...currentDesc.beforeEach);
					currentDesc = currentDesc.parent;
				}
				return hooks;
			};

			// Run each test
			for (const test of targetDescribe.tests) {
				try {
					// Run suite-level beforeEach if defined
					if (suite.beforeEach) {
						await suite.beforeEach();
					}

					// Run all beforeEach functions for this describe block
					for (const beforeFn of collectHooks(targetDescribe)) {
						await beforeFn();
					}

					// Run the test
					await test.fn();

					// Run all afterEach functions for this describe block
					for (const afterFn of targetDescribe.afterEach) {
						await afterFn();
					}

					// Run suite-level afterEach if defined
					if (suite.afterEach) {
						await suite.afterEach();
					}

					terminal.info(
						`%c    ✓%c ${test.name}`,
						styles.passed,
						styles.testName,
					);
					results.passed++;
				} catch (error) {
					terminal.info(
						`%c    ✗%c ${test.name}`,
						styles.failed,
						styles.testName,
					);
					terminal.info(`      %c${error.message}`, styles.errorMsg);
					results.failed++;
					results.failures.push({
						suite: suite.name,
						describe: targetDescribe.description,
						test: test.name,
						error,
					});
				}
			}

			// Run describe-level afterAll hooks
			if (targetDescribe.afterAll?.length) {
				for (const fn of targetDescribe.afterAll) {
					await fn();
				}
			}

			// Run suite-level afterAll hooks
			if (suite.afterAll?.length) {
				for (const fn of suite.afterAll) {
					await fn();
				}
			}

			const endTime = performance.now();
			const duration = ((endTime - startTime) / 1000).toFixed(2);

			terminal.info("\n%c📊 TEST RESULTS:", styles.summary);
			terminal.info(`%c✅ Passed: ${results.passed}`, styles.summaryPass);

			if (results.failed > 0) {
				terminal.info(`%c❌ Failed: ${results.failed}`, styles.summaryFail);
				terminal.info("\n%cFailure Details:", styles.summaryFail);
				results.failures.forEach((failure, index) => {
					terminal.info(
						`%c${index + 1}) ${failure.suite} > ${failure.describe} > ${
							failure.test
						}`,
						styles.failed,
					);
					terminal.info(
						`   %c${failure.error.message}`,
						styles.errorMsg,
						failure.error.stack,
					);
				});
			}

			terminal.info(`%cTotal Suites: ${results.totalSuites}`, styles.summary);
			terminal.info(`%cTotal Tests: ${results.totalTests}`, styles.summary);
			terminal.info(`%cTime: ${duration}s`, styles.time);

			return results;
		} catch (error) {
			terminal.info(
				`%c❌ Error running tests: ${error.message}`,
				styles.errorMsg,
			);
			terminal.info(error.stack);
			return {
				totalSuites: 0,
				totalTests: 0,
				passed: 0,
				failed: 1,
				failures: [
					{
						error: `Test execution failed: ${error.message}`,
					},
				],
			};
		}
	}

	return {
		suite,
		describe,
		it,
		beforeEach,
		afterEach,
		beforeAll,
		afterAll,
		run,
		runFile,
		runDescribe,
		iframe,
		_getState: () => ({
			suites: Object.fromEntries(suites.entries()),
			currentSuite,
			currentDescribe,
		}),
	};
}

const Testing = createTestEngine();
Testing.createTestEngine = createTestEngine;
$APP.addModule({
	name: "test",
	alias: "Testing",
	base: Testing,
	modules: ["test/assert", "test/mock", "types"],
});

})();
await (async () => {
function assert(condition, message) {
	if (!condition) throw new Error(message || "Assertion failed");
}

const formatError = (defaultMsg, message) => {
	const error = new Error(message || defaultMsg);
	if (error.stack) {
		error.stack = error.stack
			.split("\n")
			.filter((line) => line.includes(".test.js"))
			.join("\n");
	}
	return error;
};

const throwIf = (condition, defaultMsg, message) => {
	if (condition) throw formatError(defaultMsg, message);
};

const stringify = (value) => {
	try {
		return JSON.stringify(value);
	} catch (e) {
		if (e.message.includes("circular structure")) {
			throw formatError(
				"Cannot perform deepEqual: Circular structure detected.",
			);
		}
		throw e;
	}
};

Object.assign(assert, {
	equal: (a, b, msg) =>
		throwIf(
			a !== b,
			`Expected ===: ${b} (${typeof b}) vs ${a} (${typeof a})`,
			msg,
		),
	notEqual: (a, b, msg) =>
		throwIf(a === b, `Expected !==: ${b} (${typeof b})`, msg),
	deepEqual: (a, b, msg) => {
		if (a === b) return;
		const aStr = stringify(a);
		const bStr = stringify(b);
		throwIf(
			aStr !== bStr,
			`Expected deepEqual:\nExpected: ${bStr}\nActual:   ${aStr}`,
			msg,
		);
	},
	isUndefined: (val, msg) =>
		throwIf(
			val !== undefined,
			`Expected undefined, got: ${val} (${typeof val})`,
			msg,
		),
	isDefined: (val, msg) =>
		throwIf(
			val === undefined,
			"Expected value to be defined, but got: undefined",
			msg,
		),
	isObject: (val, msg) =>
		throwIf(
			typeof val !== "object",
			`Expected object, got: ${val} (${typeof val})`,
			msg,
		),
	isNotObject: (val, msg) =>
		throwIf(
			typeof val === "object" && val !== null,
			`Expected not a object, but got: ${val}`,
			msg,
		),
	isFunction: (val, msg) =>
		throwIf(
			typeof val !== "function",
			`Expected function, got: ${val} (${typeof val})`,
			msg,
		),
	isNotFunction: (val, msg) =>
		throwIf(
			typeof val === "function",
			`Expected not a function, but got: ${val}`,
			msg,
		),
	isTrue: (val, msg) =>
		throwIf(val !== true, `Expected true, got: ${val} (${typeof val})`, msg),
	isFalse: (val, msg) =>
		throwIf(val !== false, `Expected false, got: ${val} (${typeof val})`, msg),
	isNull: (val, msg) =>
		throwIf(val !== null, `Expected null, got: ${val} (${typeof val})`, msg),
	isNotNull: (val, msg) =>
		throwIf(val === null, "Expected value not to be null, but got: null", msg),
	isArray: (val, msg) =>
		throwIf(
			!Array.isArray(val),
			`Expected array, got: ${val} (${typeof val})`,
			msg,
		),
	isNotArray: (val, msg) =>
		throwIf(Array.isArray(val), `Expected not array, but got: ${val}`, msg),
	include: (haystack, needle, msg) => {
		const valid = typeof haystack === "string" || Array.isArray(haystack);
		throwIf(
			!valid,
			`assert.include requires string or array, got: ${typeof haystack}`,
		);
		throwIf(!haystack.includes(needle), `Expected to include: ${needle}`, msg);
	},
	notInclude: (haystack, needle, msg) => {
		const valid = typeof haystack === "string" || Array.isArray(haystack);
		throwIf(
			!valid,
			`assert.notInclude requires string or array, got: ${typeof haystack}`,
		);
		throwIf(
			haystack.includes(needle),
			`Expected NOT to include: ${needle}`,
			msg,
		);
	},
	ok: (val, msg) =>
		throwIf(!val, `Expected truthy, got: ${val} (${typeof val})`, msg),
	isOk: (val, msg) => assert.ok(val, msg),
	notOk: (val, msg) =>
		throwIf(val, `Expected falsy, got: ${val} (${typeof val})`, msg),
	isNotOk: (val, msg) => assert.notOk(val, msg),
});

$APP.addFunctions({ name: "test", functions: { assert } });

})();
await (async () => {
const mock = {
	fn: (implementation) => {
		const mockFn = (...args) => {
			// Record call
			const call = {
				args,
				timestamp: Date.now(),
				result: null,
				error: null,
			};

			mockFn.mock.calls.push(call);
			mockFn.mock.lastCall = call;

			try {
				// Use queued implementation or default
				const impl =
					mockFn.mock.queued.shift() ||
					mockFn.mock.implementation ||
					implementation;

				const result = impl ? impl(...args) : undefined;

				// Record result
				call.result = result;
				mockFn.mock.results.push({ type: "return", value: result });

				return result;
			} catch (error) {
				// Record error
				call.error = error;
				mockFn.mock.results.push({ type: "throw", value: error });
				throw error;
			}
		};

		// Mock tracking properties
		mockFn.mock = {
			calls: [],
			instances: [],
			results: [],
			lastCall: null,
			implementation: null,
			queued: [], // For once implementations
		};

		// Mock control methods
		mockFn.mockImplementation = (fn) => {
			mockFn.mock.implementation = fn;
			return mockFn;
		};

		mockFn.mockImplementationOnce = (fn) => {
			mockFn.mock.queued.push(fn);
			return mockFn;
		};

		mockFn.mockClear = () => {
			mockFn.mock.calls = [];
			mockFn.mock.instances = [];
			mockFn.mock.results = [];
			mockFn.mock.lastCall = null;
			mockFn.mock.queued = [];
			return mockFn;
		};

		mockFn.mockReset = () => {
			mockFn.mockClear();
			mockFn.mock.implementation = null;
			return mockFn;
		};

		mockFn.mockReturnValue = (value) => mockFn.mockImplementation(() => value);

		mockFn.mockReturnValueOnce = (value) =>
			mockFn.mockImplementationOnce(() => value);

		mockFn.mockResolvedValue = (value) =>
			mockFn.mockImplementation(() => Promise.resolve(value));

		mockFn.mockResolvedValueOnce = (value) =>
			mockFn.mockImplementationOnce(() => Promise.resolve(value));

		mockFn.mockRejectedValue = (value) =>
			mockFn.mockImplementation(() => Promise.reject(value));

		mockFn.mockRejectedValueOnce = (value) =>
			mockFn.mockImplementationOnce(() => Promise.reject(value));

		Object.assign(mockFn.mock, {
			clear: mockFn.mockClear,
			reset: mockFn.mockReset,
			implementation: mockFn.mockImplementation,
			implementationOnce: mockFn.mockImplementationOnce,
			returnValue: mockFn.mockReturnValue,
			returnValueOnce: mockFn.mockReturnValueOnce,
			resolvedValue: mockFn.mockResolvedValue,
			resolvedValueOnce: mockFn.mockResolvedValueOnce,
			rejectedValue: mockFn.mockRejectedValue,
			rejectedValueOnce: mockFn.mockRejectedValueOnce,
		});

		return mockFn;
	},
};

$APP.addFunctions({ name: "test", functions: { mock } });

})();
await (async () => {
// TODO:
// 1. add private prop that would make it not available externallly (changes in View.js)
// 2. chain props like T.string().default("test").private()

const formats = { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ };

const parseJSON = (value) => {
	try {
		return value in specialCases ? value : JSON.parse(value);
	} catch (error) {
		return undefined;
	}
};

const specialCases = {
	undefined: undefined,
	null: null,
	"": null,
	[undefined]: undefined,
};

const typeHandlers = {
	any: (value) => value,
	function: (value) => value,
	extension: () => undefined,
	boolean: (value, { attribute = true } = {}) =>
		(attribute && value === "") || ["true", 1, "1", true].includes(value),
	string: (val) => (val in specialCases ? specialCases[val] : String(val)),
	array: (value, prop = {}) => {
		if (Array.isArray(value)) return value;
		const { itemType } = prop;
		try {
			if (!value) throw value;
			const parsedArray = parseJSON(value);
			if (!Array.isArray(parsedArray)) throw parsedArray;
			return !itemType
				? parsedArray
				: parsedArray.map((item) =>
						typeof item !== "object"
							? item
							: Object.entries(item).reduce((obj, [key, val]) => {
									obj[key] = typeHandlers[itemType[key]?.type]
										? typeHandlers[itemType[key].type](val, prop)
										: val;
									return obj;
								}, {}),
					);
		} catch (err) {
			return [];
		}
	},
	number: (value) => {
		return value ? Number(value) : value;
	},
	date: (value) => new Date(value),
	object: (v, prop = {}) => {
		const value = typeof v === "string" ? parseJSON(v) : v;
		if (prop.properties) {
			Object.entries(prop.properties).map(([propKey, propProps]) => {
				if (propProps.defaultValue !== undefined) {
					value[propKey] = propProps.defaultValue;
				}
			});
		}
		return value;
	},
};

const stringToType = (value, prop = {}) => {
	const { type } = prop;
	return (typeHandlers[type] || ((val) => val))(value, prop);
};

const validations = {
	number: (value, prop = {}) => {
		if ("min" in prop && value < prop.min) {
			return ["minimum", null];
		}
		if ("max" in prop && value > prop.max) {
			return ["maximum", null];
		}
		if (Number.isNaN(Number(value))) {
			return ["NaN", null];
		}
	},
};

const validateField = (value, prop) => {
	if (
		prop.required === true &&
		(value === undefined || value === null || value === "")
	)
		return ["required", null];
	const typeHandler = typeHandlers[prop.type];
	if (prop.relationship) {
		if (prop.many) {
			return [
				null,
				Array.isArray(value)
					? value.map((i) => (prop.mixed ? i : (i?.id ?? i)))
					: [],
			];
		}
		return [null, value?.id ?? value];
	}
	const typedValue = typeHandler
		? typeHandler(value, prop)
		: [undefined, null, ""].includes(value)
			? (prop.defaultValue ?? null)
			: value;
	const validation = validations[prop.type];
	if (validation) {
		const errors = validation(value, prop);
		if (errors) return errors;
	}

	if ("format" in prop || formats[prop.key]) {
		const formatFn = "format" in prop ? prop.format : formats[prop.key];
		const format =
			typeof formatFn === "function"
				? prop.format
				: (value) => formatFn.test(value);
		const isValid = format(typedValue);
		if (!isValid) return ["invalid", null];
	}

	return [null, typedValue];
};

function interpolate(str, data) {
	return str.replace(/\${(.*?)}/g, (match, key) => {
		return data[key.trim()];
	});
}

const validateType = (
	object,
	{ schema, row = {}, undefinedProps = true, validateVirtual = false },
) => {
	if (!schema) return [null, object];
	const errors = {};
	let hasError = false;

	const props = undefinedProps ? schema : object;
	for (const key in props) {
		const prop = { ...schema[key], key };
		if ("virtual" in prop || prop.persist === false) continue;
		const [error, value] =
			[undefined, null, ""].includes(object[key]) && !prop.required
				? [null, prop.defaultValue]
				: validateField(object[key], prop);
		if (error) {
			hasError = true;
			errors[key] = error;
		} else if (value !== undefined) object[key] = value;
	}
	const virtual = Object.fromEntries(
		Object.entries(schema).filter(([name, prop]) => "virtual" in prop),
	);
	for (const prop in virtual) {
		if (validateVirtual) {
			// Example: virtual: "${directory}/${name}"
			const [error, value] = validateField(
				interpolate(virtual[prop].virtual, { ...row, ...object }),
				virtual[prop],
			);
			if (error) {
				hasError = true;
				errors[prop] = error;
			} else if (value !== undefined) object[prop] = value;
		} else
			object[prop] = interpolate(virtual[prop].virtual, { ...row, ...object });
	}

	if (hasError) return [errors, null];
	return [null, object];
};

const createChainableType = (obj = {}) =>
	new Proxy(obj, {
		get(target, prop, receiver) {
			if (prop === "$") return { ...target };
			if (prop in target) return Reflect.get(target, prop, receiver);
			return (value) => {
				target[prop] = value === undefined || value;
				return receiver;
			};
		},
	});

const createType = (type, options) => {
	const normalizedOptions =
		typeof options === "object" && !Array.isArray(options) && options !== null
			? options
			: { defaultValue: options };

	return createChainableType({
		type,
		persist: true,
		attribute: true,
		...normalizedOptions,
	});
};

const createRelationType =
	(relationship) =>
	(...args) => {
		const targetModel = args[0];
		let targetForeignKey;
		let options = args[2];
		if (typeof args[1] === "string") targetForeignKey = args[1];
		else options = args[1];
		const belongs = belongTypes.includes(relationship);
		return createChainableType({
			type: belongs
				? relationship === "belongs_many"
					? "array"
					: "string"
				: relationship === "one"
					? "object"
					: "array",
			many: manyTypes.includes(relationship),
			belongs,
			persist: belongs,
			relationship,
			defaultValue: relationship === "belongs_many" ? [] : null,
			polymorphic: targetModel === "*" || Array.isArray(targetModel),
			targetModel,
			targetForeignKey,
			index: belongTypes.includes(relationship),
			...options,
		});
	};

const typesHelpers = {
	createType,
	stringToType,
	validateType,
};

const relationshipTypes = ["one", "many", "belongs", "belongs_many"];
const manyTypes = ["many", "belongs_many"];
const belongTypes = ["belongs", "belongs_many"];
const proxyHandler = {
	get(target, prop) {
		if (typesHelpers[prop]) return typesHelpers[prop];
		const type = prop.toLowerCase();
		if (relationshipTypes.includes(prop)) return createRelationType(prop);
		if (type === "extension")
			return (options = {}) =>
				createType("extension", {
					...options,
					persist: false,
					extension: true,
				});
		return (options = {}) => {
			if (!typeHandlers[type]) throw new Error(`Unknown type: ${type}`);
			return createType(type, options);
		};
	},
};

const Types = new Proxy({}, proxyHandler);
$APP.addModule({
	name: "types",
	alias: "T",
	base: Types,
	functions: typesHelpers,
});

})();
await (async () => {
$APP.addModule({
	name: "mvc",
	modules: ["mvc/view", "mvc/model", "mvc/controller", "app"],
});

})();
await (async () => {
$APP.addModule({
	name: "view",
	path: "mvc/view",
	alias: "View",
	frontend: true,
	backend: true,
	modules: [
		"mvc/view/html",
		"mvc/view/html/directive",
		"mvc/view/html/spread",
		"mvc/view/loader",
		"mvc/view/theme",
		"mvc/view/fonts",
		"mvc/view/unocss",
	],
});

})();
await (async () => {
$APP.addModule({
	name: "html",
	path: "mvc/view/html",
	frontend: true,
});

})();
await (async () => {
const DEV_MODE = false;
const ENABLE_EXTRA_SECURITY_HOOKS = false;
const ENABLE_SHADYDOM_NOPATCH = false;
const NODE_MODE = false;

// Allows minifiers to rename references to globalThis
const global = globalThis;

/**
 * Contains types that are part of the unstable debug API.
 *
 * Everything in this API is not stable and may change or be removed in the future,
 * even on patch releases.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
let LitUnstable;
/**
 * Useful for visualizing and logging insights into what the Lit template system is doing.
 *
 * Compiled out of prod mode builds.
 */
const debugLogEvent = DEV_MODE
	? (event) => {
			const shouldEmit = global.emitLitDebugLogEvents;
			if (!shouldEmit) {
				return;
			}
			global.dispatchEvent(
				new CustomEvent("lit-debug", {
					detail: event,
				}),
			);
		}
	: undefined;
// Used for connecting beginRender and endRender events when there are nested
// renders when errors are thrown preventing an endRender event from being
// called.
let debugLogRenderId = 0;
let issueWarning;
if (DEV_MODE) {
	global.litIssuedWarnings ??= new Set();

	// Issue a warning, if we haven't already.
	issueWarning = (code, warning) => {
		warning += code
			? ` See https://lit.dev/msg/${code} for more information.`
			: "";
		if (!global.litIssuedWarnings.has(warning)) {
			console.warn(warning);
			global.litIssuedWarnings.add(warning);
		}
	};
	issueWarning(
		"dev-mode",
		"Lit is in dev mode. Not recommended for production!",
	);
}
const wrap =
	ENABLE_SHADYDOM_NOPATCH &&
	global.ShadyDOM?.inUse &&
	global.ShadyDOM?.noPatch === true
		? global.ShadyDOM.wrap
		: (node) => node;
const trustedTypes = global.trustedTypes;

/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = trustedTypes
	? trustedTypes.createPolicy("lit-html", {
			createHTML: (s) => s,
		})
	: undefined;

/**
 * Used to sanitize any value before it is written into the DOM. This can be
 * used to implement a security policy of allowed and disallowed values in
 * order to prevent XSS attacks.
 *
 * One way of using this callback would be to check attributes and properties
 * against a list of high risk fields, and require that values written to such
 * fields be instances of a class which is safe by construction. Closure's Safe
 * HTML Types is one implementation of this technique (
 * https://github.com/google/safe-html-types/blob/master/doc/safehtml-types.md).
 * The TrustedTypes polyfill in API-only mode could also be used as a basis
 * for this technique (https://github.com/WICG/trusted-types).
 *
 * @param node The HTML node (usually either a #text node or an Element) that
 *     is being written to. Note that this is just an exemplar node, the write
 *     may take place against another instance of the same class of node.
 * @param name The name of an attribute or property (for example, 'href').
 * @param type Indicates whether the write that's about to be performed will
 *     be to a property or a node.
 * @return A function that will sanitize this class of writes.
 */

/**
 * A function which can sanitize values that will be written to a specific kind
 * of DOM sink.
 *
 * See SanitizerFactory.
 *
 * @param value The value to sanitize. Will be the actual value passed into
 *     the lit-html template literal, so this could be of any type.
 * @return The value to write to the DOM. Usually the same as the input value,
 *     unless sanitization is needed.
 */

const identityFunction = (value) => value;
const noopSanitizer = (_node, _name, _type) => identityFunction;

/** Sets the global sanitizer factory. */
const setSanitizer = (newSanitizer) => {
	if (!ENABLE_EXTRA_SECURITY_HOOKS) {
		return;
	}
	if (sanitizerFactoryInternal !== noopSanitizer) {
		throw new Error(
			"Attempted to overwrite existing lit-html security policy." +
				" setSanitizeDOMValueFactory should be called at most once.",
		);
	}
	sanitizerFactoryInternal = newSanitizer;
};

/**
 * Only used in internal tests, not a part of the public API.
 */
const _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
	sanitizerFactoryInternal = noopSanitizer;
};
const createSanitizer = (node, name, type) => {
	return sanitizerFactoryInternal(node, name, type);
};

// Added to an attribute name to mark the attribute as bound so we can find
// it easily.
const boundAttributeSuffix = "$lit$";

// This marker is used in many syntactic positions in HTML, so it must be
// a valid element name and attribute name. We don't support dynamic names (yet)
// but this at least ensures that the parse tree is closer to the template
// intention.
const marker = `lit$${Math.random().toFixed(9).slice(2)}$`;

// String used to tell if a comment is a marker comment
const markerMatch = "?" + marker;

// Text used to insert a comment marker node. We use processing instruction
// syntax because it's slightly smaller, but parses as a comment node.
const nodeMarker = `<${markerMatch}>`;
const d =
	NODE_MODE && global.document === undefined
		? {
				createTreeWalker() {
					return {};
				},
			}
		: document;

// Creates a dynamic marker. We never have to search for these in the DOM.
const createMarker = () => d.createComment("");

// https://tc39.github.io/ecma262/#sec-typeof-operator

const isPrimitive = (value) =>
	value === null || (typeof value != "object" && typeof value != "function");
const isArray = Array.isArray;
const isIterable = (value) =>
	isArray(value) ||
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	typeof value?.[Symbol.iterator] === "function";
const SPACE_CHAR = "[ \t\n\f\r]";
const ATTR_VALUE_CHAR = `[^ \t\n\f\r"'\`<>=]`;
const NAME_CHAR = `[^\\s"'>=/]`;

// These regexes represent the five parsing states that we care about in the
// Template's HTML scanner. They match the *end* of the state they're named
// after.
// Depending on the match, we transition to a new state. If there's no match,
// we stay in the same state.
// Note that the regexes are stateful. We utilize lastIndex and sync it
// across the multiple regexes used. In addition to the five regexes below
// we also dynamically create a regex to find the matching end tags for raw
// text elements.

/**
 * End of text is: `<` followed by:
 *   (comment start) or (tag) or (dynamic tag binding)
 */
const textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
const COMMENT_START = 1;
const TAG_NAME = 2;
const DYNAMIC_TAG_NAME = 3;
const commentEndRegex = /-->/g;
/**
 * Comments not started with <!--, like </{, can be ended by a single `>`
 */
const comment2EndRegex = />/g;

/**
 * The tagEnd regex matches the end of the "inside an opening" tag syntax
 * position. It either matches a `>`, an attribute-like sequence, or the end
 * of the string after a space (attribute-name position ending).
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \t\n\f\r" are HTML space characters:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * So an attribute is:
 *  * The name: any character except a whitespace character, ("), ('), ">",
 *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const tagEndRegex = new RegExp(
	`>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`,
	"g",
);
const ENTIRE_MATCH = 0;
const ATTRIBUTE_NAME = 1;
const SPACES_AND_EQUALS = 2;
const QUOTE_CHAR = 3;
const singleQuoteAttrEndRegex = /'/g;
const doubleQuoteAttrEndRegex = /"/g;
/**
 * Matches the raw text elements.
 *
 * Comments are not parsed within raw text elements, so we need to search their
 * text content for marker strings.
 */
const rawTextElement = /^(?:script|style|textarea|title)$/i;

/** TemplateResult types */
const HTML_RESULT = 1;
const SVG_RESULT = 2;
const MATHML_RESULT = 3;
// TemplatePart types
// IMPORTANT: these must match the values in PartType
const ATTRIBUTE_PART = 1;
const CHILD_PART = 2;
const PROPERTY_PART = 3;
const BOOLEAN_ATTRIBUTE_PART = 4;
const EVENT_PART = 5;
const ELEMENT_PART = 6;
const COMMENT_PART = 7;

/**
 * The return type of the template tag functions, {@linkcode html} and
 * {@linkcode svg} when it hasn't been compiled by @lit-labs/compiler.
 *
 * A `TemplateResult` object holds all the information about a template
 * expression required to render it: the template strings, expression values,
 * and type of template (html or svg).
 *
 * `TemplateResult` objects do not create any DOM on their own. To create or
 * update DOM you need to render the `TemplateResult`. See
 * [Rendering](https://lit.dev/docs/components/rendering) for more information.
 *
 */

/**
 * This is a template result that may be either uncompiled or compiled.
 *
 * In the future, TemplateResult will be this type. If you want to explicitly
 * note that a template result is potentially compiled, you can reference this
 * type and it will continue to behave the same through the next major version
 * of Lit. This can be useful for code that wants to prepare for the next
 * major version of Lit.
 */

/**
 * The return type of the template tag functions, {@linkcode html} and
 * {@linkcode svg}.
 *
 * A `TemplateResult` object holds all the information about a template
 * expression required to render it: the template strings, expression values,
 * and type of template (html or svg).
 *
 * `TemplateResult` objects do not create any DOM on their own. To create or
 * update DOM you need to render the `TemplateResult`. See
 * [Rendering](https://lit.dev/docs/components/rendering) for more information.
 *
 * In Lit 4, this type will be an alias of
 * MaybeCompiledTemplateResult, so that code will get type errors if it assumes
 * that Lit templates are not compiled. When deliberately working with only
 * one, use either {@linkcode CompiledTemplateResult} or
 * {@linkcode UncompiledTemplateResult} explicitly.
 */

/**
 * A TemplateResult that has been compiled by @lit-labs/compiler, skipping the
 * prepare step.
 */

/**
 * Generates a template literal tag function that returns a TemplateResult with
 * the given result type.
 */
const tag =
	(type) =>
	(strings, ...values) => {
		// Warn against templates octal escape sequences
		// We do this here rather than in render so that the warning is closer to the
		// template definition.
		if (DEV_MODE && strings.some((s) => s === undefined)) {
			console.warn(
				"Some template strings are undefined.\n" +
					"This is probably caused by illegal octal escape sequences.",
			);
		}
		if (DEV_MODE) {
			// Import static-html.js results in a circular dependency which g3 doesn't
			// handle. Instead we know that static values must have the field
			// `_$litStatic$`.
			if (values.some((val) => val?.["_$litStatic$"])) {
				issueWarning(
					"",
					`Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.\n` +
						`Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`,
				);
			}
		}
		return {
			// This property needs to remain unminified.
			["_$litType$"]: type,
			strings,
			values,
		};
	};

/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 *
 * ```ts
 * const header = (title: string) => html`<h1>${title}</h1>`;
 * ```
 *
 * The `html` tag returns a description of the DOM to render as a value. It is
 * lazy, meaning no work is done until the template is rendered. When rendering,
 * if a template comes from the same expression as a previously rendered result,
 * it's efficiently updated instead of replaced.
 */
const html = tag(HTML_RESULT);

/**
 * Interprets a template literal as an SVG fragment that can efficiently render
 * to and update a container.
 *
 * ```ts
 * const rect = svg`<rect width="10" height="10"></rect>`;
 *
 * const myImage = html`
 *   <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
 *     ${rect}
 *   </svg>`;
 * ```
 *
 * The `svg` *tag function* should only be used for SVG fragments, or elements
 * that would be contained **inside** an `<svg>` HTML element. A common error is
 * placing an `<svg>` *element* in a template tagged with the `svg` tag
 * function. The `<svg>` element is an HTML element and should be used within a
 * template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an SVG fragment from the
 * `render()` method, as the SVG fragment will be contained within the element's
 * shadow root and thus not be properly contained within an `<svg>` HTML
 * element.
 */
const svg = tag(SVG_RESULT);

/**
 * Interprets a template literal as MathML fragment that can efficiently render
 * to and update a container.
 *
 * ```ts
 * const num = mathml`<mn>1</mn>`;
 *
 * const eq = html`
 *   <math>
 *     ${num}
 *   </math>`;
 * ```
 *
 * The `mathml` *tag function* should only be used for MathML fragments, or
 * elements that would be contained **inside** a `<math>` HTML element. A common
 * error is placing a `<math>` *element* in a template tagged with the `mathml`
 * tag function. The `<math>` element is an HTML element and should be used
 * within a template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an MathML fragment from the
 * `render()` method, as the MathML fragment will be contained within the
 * element's shadow root and thus not be properly contained within a `<math>`
 * HTML element.
 */
const mathml = tag(MATHML_RESULT);

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = Symbol.for("lit-noChange");

/**
 * A sentinel value that signals a ChildPart to fully clear its content.
 *
 * ```ts
 * const button = html`${
 *  user.isAdmin
 *    ? html`<button>DELETE</button>`
 *    : nothing
 * }`;
 * ```
 *
 * Prefer using `nothing` over other falsy values as it provides a consistent
 * behavior between various expression binding contexts.
 *
 * In child expressions, `undefined`, `null`, `''`, and `nothing` all behave the
 * same and render no nodes. In attribute expressions, `nothing` _removes_ the
 * attribute, while `undefined` and `null` will render an empty string. In
 * property expressions `nothing` becomes `undefined`.
 */
const nothing = Symbol.for("lit-nothing");

/**
 * The cache of prepared templates, keyed by the tagged TemplateStringsArray
 * and _not_ accounting for the specific template tag used. This means that
 * template tags cannot be dynamic - they must statically be one of html, svg,
 * or attr. This restriction simplifies the cache lookup, which is on the hot
 * path for rendering.
 */
const templateCache = new WeakMap();

/**
 * Object specifying options for controlling lit-html rendering. Note that
 * while `render` may be called multiple times on the same `container` (and
 * `renderBefore` reference node) to efficiently update the rendered content,
 * only the options passed in during the first render are respected during
 * the lifetime of renders to that unique `container` + `renderBefore`
 * combination.
 */

const walker = d.createTreeWalker(
	d,
	129 /* NodeFilter.SHOW_{ELEMENT|COMMENT} */,
);
let sanitizerFactoryInternal = noopSanitizer;

//
// Classes only below here, const variable declarations only above here...
//
// Keeping variable declarations and classes together improves minification.
// Interfaces and type aliases can be interleaved freely.
//

// Type for classes that have a `_directive` or `_directives[]` field, used by
// `resolveDirective`

function trustFromTemplateString(tsa, stringFromTSA) {
	// A security check to prevent spoofing of Lit template results.
	// In the future, we may be able to replace this with Array.isTemplateObject,
	// though we might need to make that check inside of the html and svg
	// functions, because precompiled templates don't come in as
	// TemplateStringArray objects.
	if (!isArray(tsa) || !Object.hasOwn(tsa, "raw")) {
		let message = "invalid template strings array";
		if (DEV_MODE) {
			message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `
				.trim()
				.replace(/\n */g, "\n");
		}
		throw new Error(message);
	}
	return policy !== undefined
		? policy.createHTML(stringFromTSA)
		: stringFromTSA;
}

/**
 * Returns an HTML string for the given TemplateStringsArray and result type
 * (HTML or SVG), along with the case-sensitive bound attribute names in
 * template order. The HTML contains comment markers denoting the `ChildPart`s
 * and suffixes on bound attributes denoting the `AttributeParts`.
 *
 * @param strings template strings array
 * @param type HTML or SVG
 * @return Array containing `[html, attrNames]` (array returned for terseness,
 *     to avoid object fields since this code is shared with non-minified SSR
 *     code)
 */
const getTemplateHtml = (strings, type) => {
	// Insert makers into the template HTML to represent the position of
	// bindings. The following code scans the template strings to determine the
	// syntactic position of the bindings. They can be in text position, where
	// we insert an HTML comment, attribute value position, where we insert a
	// sentinel string and re-write the attribute name, or inside a tag where
	// we insert the sentinel string.
	const l = strings.length - 1;
	// Stores the case-sensitive bound attribute names in the order of their
	// parts. ElementParts are also reflected in this array as undefined
	// rather than a string, to disambiguate from attribute bindings.
	const attrNames = [];
	let html =
		type === SVG_RESULT ? "<svg>" : type === MATHML_RESULT ? "<math>" : "";

	// When we're inside a raw text tag (not it's text content), the regex
	// will still be tagRegex so we can find attributes, but will switch to
	// this regex when the tag ends.
	let rawTextEndRegex;

	// The current parsing state, represented as a reference to one of the
	// regexes
	let regex = textEndRegex;
	for (let i = 0; i < l; i++) {
		const s = strings[i];
		// The index of the end of the last attribute name. When this is
		// positive at end of a string, it means we're in an attribute value
		// position and need to rewrite the attribute name.
		// We also use a special value of -2 to indicate that we encountered
		// the end of a string in attribute name position.
		let attrNameEndIndex = -1;
		let attrName;
		let lastIndex = 0;
		let match;

		// The conditions in this loop handle the current parse state, and the
		// assignments to the `regex` variable are the state transitions.
		while (lastIndex < s.length) {
			// Make sure we start searching from where we previously left off
			regex.lastIndex = lastIndex;
			match = regex.exec(s);
			if (match === null) {
				break;
			}
			lastIndex = regex.lastIndex;
			if (regex === textEndRegex) {
				if (match[COMMENT_START] === "!--") {
					regex = commentEndRegex;
				} else if (match[COMMENT_START] !== undefined) {
					// We started a weird comment, like </{
					regex = comment2EndRegex;
				} else if (match[TAG_NAME] !== undefined) {
					if (rawTextElement.test(match[TAG_NAME])) {
						// Record if we encounter a raw-text element. We'll switch to
						// this regex at the end of the tag.
						rawTextEndRegex = new RegExp(`</${match[TAG_NAME]}`, "g");
					}
					regex = tagEndRegex;
				} else if (match[DYNAMIC_TAG_NAME] !== undefined) {
					if (DEV_MODE) {
						throw new Error(
							"Bindings in tag names are not supported. Please use static templates instead. " +
								"See https://lit.dev/docs/templates/expressions/#static-expressions",
						);
					}
					regex = tagEndRegex;
				}
			} else if (regex === tagEndRegex) {
				if (match[ENTIRE_MATCH] === ">") {
					// End of a tag. If we had started a raw-text element, use that
					// regex
					regex = rawTextEndRegex ?? textEndRegex;
					// We may be ending an unquoted attribute value, so make sure we
					// clear any pending attrNameEndIndex
					attrNameEndIndex = -1;
				} else if (match[ATTRIBUTE_NAME] === undefined) {
					// Attribute name position
					attrNameEndIndex = -2;
				} else {
					attrNameEndIndex = regex.lastIndex - match[SPACES_AND_EQUALS].length;
					attrName = match[ATTRIBUTE_NAME];
					regex =
						match[QUOTE_CHAR] === undefined
							? tagEndRegex
							: match[QUOTE_CHAR] === '"'
								? doubleQuoteAttrEndRegex
								: singleQuoteAttrEndRegex;
				}
			} else if (
				regex === doubleQuoteAttrEndRegex ||
				regex === singleQuoteAttrEndRegex
			) {
				regex = tagEndRegex;
			} else if (regex === commentEndRegex || regex === comment2EndRegex) {
				regex = textEndRegex;
			} else {
				// Not one of the five state regexes, so it must be the dynamically
				// created raw text regex and we're at the close of that element.
				regex = tagEndRegex;
				rawTextEndRegex = undefined;
			}
		}
		if (DEV_MODE) {
			// If we have a attrNameEndIndex, which indicates that we should
			// rewrite the attribute name, assert that we're in a valid attribute
			// position - either in a tag, or a quoted attribute value.
			console.assert(
				attrNameEndIndex === -1 ||
					regex === tagEndRegex ||
					regex === singleQuoteAttrEndRegex ||
					regex === doubleQuoteAttrEndRegex,
				"unexpected parse state B",
			);
		}

		// We have four cases:
		//  1. We're in text position, and not in a raw text element
		//     (regex === textEndRegex): insert a comment marker.
		//  2. We have a non-negative attrNameEndIndex which means we need to
		//     rewrite the attribute name to add a bound attribute suffix.
		//  3. We're at the non-first binding in a multi-binding attribute, use a
		//     plain marker.
		//  4. We're somewhere else inside the tag. If we're in attribute name
		//     position (attrNameEndIndex === -2), add a sequential suffix to
		//     generate a unique attribute name.

		// Detect a binding next to self-closing tag end and insert a space to
		// separate the marker from the tag end:
		const end =
			regex === tagEndRegex && strings[i + 1].startsWith("/>") ? " " : "";
		html +=
			regex === textEndRegex
				? s + nodeMarker
				: attrNameEndIndex >= 0
					? (attrNames.push(attrName),
						s.slice(0, attrNameEndIndex) +
							boundAttributeSuffix +
							s.slice(attrNameEndIndex)) +
						marker +
						end
					: s + marker + (attrNameEndIndex === -2 ? i : end);
	}
	const htmlResult =
		html +
		(strings[l] || "<?>") +
		(type === SVG_RESULT ? "</svg>" : type === MATHML_RESULT ? "</math>" : "");

	// Returned as an array for terseness
	return [trustFromTemplateString(strings, htmlResult), attrNames];
};

/** @internal */

class Template {
	/** @internal */

	parts = [];
	constructor(
		// This property needs to remain unminified.
		{ strings, ["_$litType$"]: type },
		options,
	) {
		let node;
		let nodeIndex = 0;
		let attrNameIndex = 0;
		const partCount = strings.length - 1;
		const parts = this.parts;

		// Create template element
		const [html, attrNames] = getTemplateHtml(strings, type);
		this.el = Template.createElement(html, options);
		walker.currentNode = this.el.content;

		// Re-parent SVG or MathML nodes into template root
		if (type === SVG_RESULT || type === MATHML_RESULT) {
			const wrapper = this.el.content.firstChild;
			wrapper.replaceWith(...wrapper.childNodes);
		}

		// Walk the template to find binding markers and create TemplateParts
		while ((node = walker.nextNode()) !== null && parts.length < partCount) {
			if (node.nodeType === 1) {
				if (DEV_MODE) {
					const tag = node.localName;
					// Warn if `textarea` includes an expression and throw if `template`
					// does since these are not supported. We do this by checking
					// innerHTML for anything that looks like a marker. This catches
					// cases like bindings in textarea there markers turn into text nodes.
					if (
						/^(?:textarea|template)$/i.test(tag) &&
						node.innerHTML.includes(marker)
					) {
						const m =
							`Expressions are not supported inside \`${tag}\` ` +
							`elements. See https://lit.dev/msg/expression-in-${tag} for more ` +
							"information.";
						if (tag === "template") {
							throw new Error(m);
						}
						issueWarning("", m);
					}
				}
				// TODO (justinfagnani): for attempted dynamic tag names, we don't
				// increment the bindingIndex, and it'll be off by 1 in the element
				// and off by two after it.
				if (node.hasAttributes()) {
					for (const name of node.getAttributeNames()) {
						if (name.endsWith(boundAttributeSuffix)) {
							const realName = attrNames[attrNameIndex++];
							const value = node.getAttribute(name);
							const statics = value.split(marker);
							const m = /([.?@])?(.*)/.exec(realName);
							parts.push({
								type: ATTRIBUTE_PART,
								index: nodeIndex,
								name: m[2],
								strings: statics,
								ctor:
									m[1] === "."
										? PropertyPart
										: m[1] === "?"
											? BooleanAttributePart
											: m[1] === "@"
												? EventPart
												: AttributePart,
							});
							node.removeAttribute(name);
						} else if (name.startsWith(marker)) {
							parts.push({
								type: ELEMENT_PART,
								index: nodeIndex,
							});
							node.removeAttribute(name);
						}
					}
				}
				// TODO (justinfagnani): benchmark the regex against testing for each
				// of the 3 raw text element names.
				if (rawTextElement.test(node.tagName)) {
					// For raw text elements we need to split the text content on
					// markers, create a Text node for each segment, and create
					// a TemplatePart for each marker.
					const strings = node.textContent.split(marker);
					const lastIndex = strings.length - 1;
					if (lastIndex > 0) {
						node.textContent = trustedTypes ? trustedTypes.emptyScript : "";
						// Generate a new text node for each literal section
						// These nodes are also used as the markers for node parts
						// We can't use empty text nodes as markers because they're
						// normalized when cloning in IE (could simplify when
						// IE is no longer supported)
						for (let i = 0; i < lastIndex; i++) {
							node.append(strings[i], createMarker());
							// Walk past the marker node we just added
							walker.nextNode();
							parts.push({
								type: CHILD_PART,
								index: ++nodeIndex,
							});
						}
						// Note because this marker is added after the walker's current
						// node, it will be walked to in the outer loop (and ignored), so
						// we don't need to adjust nodeIndex here
						node.append(strings[lastIndex], createMarker());
					}
				}
			} else if (node.nodeType === 8) {
				const data = node.data;
				if (data === markerMatch) {
					parts.push({
						type: CHILD_PART,
						index: nodeIndex,
					});
				} else {
					let i = -1;
					while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
						// Comment node has a binding marker inside, make an inactive part
						// The binding won't work, but subsequent bindings will
						parts.push({
							type: COMMENT_PART,
							index: nodeIndex,
						});
						// Move to the end of the match
						i += marker.length - 1;
					}
				}
			}
			nodeIndex++;
		}
		if (DEV_MODE) {
			// If there was a duplicate attribute on a tag, then when the tag is
			// parsed into an element the attribute gets de-duplicated. We can detect
			// this mismatch if we haven't precisely consumed every attribute name
			// when preparing the template. This works because `attrNames` is built
			// from the template string and `attrNameIndex` comes from processing the
			// resulting DOM.
			if (attrNames.length !== attrNameIndex) {
				throw new Error(
					"Detected duplicate attribute bindings. This occurs if your template " +
						"has duplicate attributes on an element tag. For example " +
						`"<input ?disabled=\${true} ?disabled=\${false}>" contains a ` +
						`duplicate "disabled" attribute. The error was detected in ` +
						"the following template: \n" +
						"`" +
						strings.join("${...}") +
						"`",
				);
			}
		}

		// We could set walker.currentNode to another node here to prevent a memory
		// leak, but every time we prepare a template, we immediately render it
		// and re-use the walker in new TemplateInstance._clone().
		debugLogEvent?.({
			kind: "template prep",
			template: this,
			clonableTemplate: this.el,
			parts: this.parts,
			strings,
		});
	}

	// Overridden via `litHtmlPolyfillSupport` to provide platform support.
	/** @nocollapse */
	static createElement(html, _options) {
		const el = d.createElement("template");
		el.innerHTML = html;
		return el;
	}
}
function resolveDirective(part, value, parent = part, attributeIndex) {
	// Bail early if the value is explicitly noChange. Note, this means any
	// nested directive is still attached and is not run.
	if (value === noChange || value === nothing) {
		return value;
	}

	let currentDirective =
		attributeIndex !== undefined
			? parent.__directives?.[attributeIndex]
			: parent.__directive;
	const nextDirectiveConstructor = isPrimitive(value)
		? undefined
		: // This property needs to remain unminified.
			value["_$litDirective$"];
	if (currentDirective?.constructor !== nextDirectiveConstructor) {
		// This property needs to remain unminified.
		currentDirective?.["_$notifyDirectiveConnectionChanged"]?.(false);
		if (nextDirectiveConstructor === undefined) {
			currentDirective = undefined;
		} else {
			currentDirective = new nextDirectiveConstructor(part);
			currentDirective?._$initialize(part, parent, attributeIndex);
		}
		if (attributeIndex !== undefined) {
			(parent.__directives ??= [])[attributeIndex] = currentDirective;
		} else {
			parent.__directive = currentDirective;
		}
	}
	if (currentDirective !== undefined) {
		value = resolveDirective(
			part,
			currentDirective._$resolve(part, value.values),
			currentDirective,
			attributeIndex,
		);
	}
	return value;
}
/**
 * An updateable instance of a Template. Holds references to the Parts used to
 * update the template instance.
 */
class TemplateInstance {
	_$parts = [];

	/** @internal */

	/** @internal */
	_$disconnectableChildren = undefined;
	constructor(template, parent) {
		this._$template = template;
		this._$parent = parent;
	}

	// Called by ChildPart parentNode getter
	get parentNode() {
		return this._$parent.parentNode;
	}

	// See comment in Disconnectable interface for why this is a getter
	get _$isConnected() {
		return this._$parent._$isConnected;
	}

	// This method is separate from the constructor because we need to return a
	// DocumentFragment and we don't want to hold onto it with an instance field.
	_clone(options) {
		const {
			el: { content },
			parts,
		} = this._$template;
		const fragment = (options?.creationScope ?? d).importNode(content, true);
		walker.currentNode = fragment;
		let node = walker.nextNode();
		let nodeIndex = 0;
		let partIndex = 0;
		let templatePart = parts[0];
		while (templatePart !== undefined) {
			if (nodeIndex === templatePart.index) {
				let part;
				if (templatePart.type === CHILD_PART) {
					part = new ChildPart(node, node.nextSibling, this, options);
				} else if (templatePart.type === ATTRIBUTE_PART) {
					part = new templatePart.ctor(
						node,
						templatePart.name,
						templatePart.strings,
						this,
						options,
					);
				} else if (templatePart.type === ELEMENT_PART) {
					part = new ElementPart(node, this, options);
				}
				this._$parts.push(part);
				templatePart = parts[++partIndex];
			}
			if (nodeIndex !== templatePart?.index) {
				node = walker.nextNode();
				nodeIndex++;
			}
		}
		// We need to set the currentNode away from the cloned tree so that we
		// don't hold onto the tree even if the tree is detached and should be
		// freed.
		walker.currentNode = d;
		return fragment;
	}
	_update(values) {
		let i = 0;
		for (const part of this._$parts) {
			if (part !== undefined) {
				debugLogEvent?.({
					kind: "set part",
					part,
					value: values[i],
					valueIndex: i,
					values,
					templateInstance: this,
				});
				if (part.strings !== undefined) {
					part._$setValue(values, part, i);
					// The number of values the part consumes is part.strings.length - 1
					// since values are in between template spans. We increment i by 1
					// later in the loop, so increment it by part.strings.length - 2 here
					i += part.strings.length - 2;
				} else {
					part._$setValue(values[i]);
				}
			}
			i++;
		}
	}
}

/*
 * Parts
 */

/**
 * A TemplatePart represents a dynamic part in a template, before the template
 * is instantiated. When a template is instantiated Parts are created from
 * TemplateParts.
 */

class ChildPart {
	type = CHILD_PART;
	_$committedValue = nothing;
	/** @internal */

	/** @internal */

	/** @internal */

	/** @internal */

	/**
	 * Connection state for RootParts only (i.e. ChildPart without _$parent
	 * returned from top-level `render`). This field is unused otherwise. The
	 * intention would be clearer if we made `RootPart` a subclass of `ChildPart`
	 * with this field (and a different _$isConnected getter), but the subclass
	 * caused a perf regression, possibly due to making call sites polymorphic.
	 * @internal
	 */

	// See comment in Disconnectable interface for why this is a getter
	get _$isConnected() {
		// ChildParts that are not at the root should always be created with a
		// parent; only RootChildNode's won't, so they return the local isConnected
		// state
		return this._$parent?._$isConnected ?? this.__isConnected;
	}

	// The following fields will be patched onto ChildParts when required by
	// AsyncDirective
	/** @internal */
	_$disconnectableChildren = undefined;
	/** @internal */

	/** @internal */

	constructor(startNode, endNode, parent, options) {
		this._$startNode = startNode;
		this._$endNode = endNode;
		this._$parent = parent;
		this.options = options;
		// Note __isConnected is only ever accessed on RootParts (i.e. when there is
		// no _$parent); the value on a non-root-part is "don't care", but checking
		// for parent would be more code
		this.__isConnected = options?.isConnected ?? true;
		if (ENABLE_EXTRA_SECURITY_HOOKS) {
			// Explicitly initialize for consistent class shape.
			this._textSanitizer = undefined;
		}
	}

	/**
	 * The parent node into which the part renders its content.
	 *
	 * A ChildPart's content consists of a range of adjacent child nodes of
	 * `.parentNode`, possibly bordered by 'marker nodes' (`.startNode` and
	 * `.endNode`).
	 *
	 * - If both `.startNode` and `.endNode` are non-null, then the part's content
	 * consists of all siblings between `.startNode` and `.endNode`, exclusively.
	 *
	 * - If `.startNode` is non-null but `.endNode` is null, then the part's
	 * content consists of all siblings following `.startNode`, up to and
	 * including the last child of `.parentNode`. If `.endNode` is non-null, then
	 * `.startNode` will always be non-null.
	 *
	 * - If both `.endNode` and `.startNode` are null, then the part's content
	 * consists of all child nodes of `.parentNode`.
	 */
	get parentNode() {
		let parentNode = wrap(this._$startNode).parentNode;
		const parent = this._$parent;
		if (
			parent !== undefined &&
			parentNode?.nodeType === 11 /* Node.DOCUMENT_FRAGMENT */
		) {
			// If the parentNode is a DocumentFragment, it may be because the DOM is
			// still in the cloned fragment during initial render; if so, get the real
			// parentNode the part will be committed into by asking the parent.
			parentNode = parent.parentNode;
		}
		return parentNode;
	}

	/**
	 * The part's leading marker node, if any. See `.parentNode` for more
	 * information.
	 */
	get startNode() {
		return this._$startNode;
	}

	/**
	 * The part's trailing marker node, if any. See `.parentNode` for more
	 * information.
	 */
	get endNode() {
		return this._$endNode;
	}
	_$setValue(value, directiveParent = this) {
		if (DEV_MODE && this.parentNode === null) {
			throw new Error(
				`This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`,
			);
		}
		value = resolveDirective(this, value, directiveParent);
		if (isPrimitive(value)) {
			// Non-rendering child values. It's important that these do not render
			// empty text nodes to avoid issues with preventing default <slot>
			// fallback content.
			if (value === nothing || value == null || value === "") {
				if (this._$committedValue !== nothing) {
					debugLogEvent?.({
						kind: "commit nothing to child",
						start: this._$startNode,
						end: this._$endNode,
						parent: this._$parent,
						options: this.options,
					});
					this._$clear();
				}
				this._$committedValue = nothing;
			} else if (value !== this._$committedValue && value !== noChange) {
				this._commitText(value);
			}
			// This property needs to remain unminified.
		} else if (value["_$litType$"] !== undefined) {
			this._commitTemplateResult(value);
		} else if (value.nodeType !== undefined) {
			if (DEV_MODE && this.options?.host === value) {
				this._commitText(
					`[probable mistake: rendered a template's host in itself ` +
						"(commonly caused by writing \${this} in a template]",
				);
				console.warn(
					"Attempted to render the template host",
					value,
					"inside itself. This is almost always a mistake, and in dev mode ",
					`we render some warning text. In production however, we'll `,
					"render it, which will usually result in an error, and sometimes ",
					"in the element disappearing from the DOM.",
				);
				return;
			}
			this._commitNode(value);
		} else if (isIterable(value)) {
			this._commitIterable(value);
		} else {
			// Fallback, will render the string representation
			this._commitText(value);
		}
	}
	_insert(node) {
		return wrap(wrap(this._$startNode).parentNode).insertBefore(
			node,
			this._$endNode,
		);
	}
	_commitNode(value) {
		if (this._$committedValue !== value) {
			this._$clear();
			if (
				ENABLE_EXTRA_SECURITY_HOOKS &&
				sanitizerFactoryInternal !== noopSanitizer
			) {
				const parentNodeName = this._$startNode.parentNode?.nodeName;
				if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
					let message = "Forbidden";
					if (DEV_MODE) {
						if (parentNodeName === "STYLE") {
							message =
								"Lit does not support binding inside style nodes. " +
								"This is a security risk, as style injection attacks can " +
								"exfiltrate data and spoof UIs. " +
								"Consider instead using css\`...\` literals " +
								"to compose styles, and do dynamic styling with " +
								"css custom properties, ::parts, <slot>s, " +
								"and by mutating the DOM rather than stylesheets.";
						} else {
							message =
								"Lit does not support binding inside script nodes. " +
								"This is a security risk, as it could allow arbitrary " +
								"code execution.";
						}
					}
					throw new Error(message);
				}
			}
			debugLogEvent?.({
				kind: "commit node",
				start: this._$startNode,
				parent: this._$parent,
				value: value,
				options: this.options,
			});
			this._$committedValue = this._insert(value);
		}
	}
	_commitText(value) {
		// If the committed value is a primitive it means we called _commitText on
		// the previous render, and we know that this._$startNode.nextSibling is a
		// Text node. We can now just replace the text content (.data) of the node.
		if (
			this._$committedValue !== nothing &&
			isPrimitive(this._$committedValue)
		) {
			const node = wrap(this._$startNode).nextSibling;
			if (ENABLE_EXTRA_SECURITY_HOOKS) {
				if (this._textSanitizer === undefined) {
					this._textSanitizer = createSanitizer(node, "data", "property");
				}
				value = this._textSanitizer(value);
			}
			debugLogEvent?.({
				kind: "commit text",
				node,
				value,
				options: this.options,
			});
			node.data = value;
		} else {
			if (ENABLE_EXTRA_SECURITY_HOOKS) {
				const textNode = d.createTextNode("");
				this._commitNode(textNode);
				// When setting text content, for security purposes it matters a lot
				// what the parent is. For example, <style> and <script> need to be
				// handled with care, while <span> does not. So first we need to put a
				// text node into the document, then we can sanitize its content.
				if (this._textSanitizer === undefined) {
					this._textSanitizer = createSanitizer(textNode, "data", "property");
				}
				value = this._textSanitizer(value);
				debugLogEvent?.({
					kind: "commit text",
					node: textNode,
					value,
					options: this.options,
				});
				textNode.data = value;
			} else {
				this._commitNode(d.createTextNode(value));
				debugLogEvent?.({
					kind: "commit text",
					node: wrap(this._$startNode).nextSibling,
					value,
					options: this.options,
				});
			}
		}
		this._$committedValue = value;
	}
	_commitTemplateResult(result) {
		// This property needs to remain unminified.
		const { values, ["_$litType$"]: type } = result;
		// If $litType$ is a number, result is a plain TemplateResult and we get
		// the template from the template cache. If not, result is a
		// CompiledTemplateResult and _$litType$ is a CompiledTemplate and we need
		// to create the <template> element the first time we see it.
		const template =
			typeof type === "number"
				? this._$getTemplate(result)
				: (type.el === undefined &&
						(type.el = Template.createElement(
							trustFromTemplateString(type.h, type.h[0]),
							this.options,
						)),
					type);
		if (this._$committedValue?._$template === template) {
			debugLogEvent?.({
				kind: "template updating",
				template,
				instance: this._$committedValue,
				parts: this._$committedValue._$parts,
				options: this.options,
				values,
			});
			this._$committedValue._update(values);
		} else {
			const instance = new TemplateInstance(template, this);
			const fragment = instance._clone(this.options);
			debugLogEvent?.({
				kind: "template instantiated",
				template,
				instance,
				parts: instance._$parts,
				options: this.options,
				fragment,
				values,
			});
			instance._update(values);
			debugLogEvent?.({
				kind: "template instantiated and updated",
				template,
				instance,
				parts: instance._$parts,
				options: this.options,
				fragment,
				values,
			});
			this._commitNode(fragment);
			this._$committedValue = instance;
		}
	}

	// Overridden via `litHtmlPolyfillSupport` to provide platform support.
	/** @internal */
	_$getTemplate(result) {
		let template = templateCache.get(result.strings);
		if (template === undefined) {
			templateCache.set(result.strings, (template = new Template(result)));
		}
		return template;
	}
	_commitIterable(value) {
		// For an Iterable, we create a new InstancePart per item, then set its
		// value to the item. This is a little bit of overhead for every item in
		// an Iterable, but it lets us recurse easily and efficiently update Arrays
		// of TemplateResults that will be commonly returned from expressions like:
		// array.map((i) => html`${i}`), by reusing existing TemplateInstances.

		// If value is an array, then the previous render was of an
		// iterable and value will contain the ChildParts from the previous
		// render. If value is not an array, clear this part and make a new
		// array for ChildParts.
		if (!isArray(this._$committedValue)) {
			this._$committedValue = [];
			this._$clear();
		}

		// Lets us keep track of how many items we stamped so we can clear leftover
		// items from a previous render
		const itemParts = this._$committedValue;
		let partIndex = 0;
		let itemPart;
		for (const item of value) {
			if (partIndex === itemParts.length) {
				// If no existing part, create a new one
				// TODO (justinfagnani): test perf impact of always creating two parts
				// instead of sharing parts between nodes
				// https://github.com/lit/lit/issues/1266
				itemParts.push(
					(itemPart = new ChildPart(
						this._insert(createMarker()),
						this._insert(createMarker()),
						this,
						this.options,
					)),
				);
			} else {
				// Reuse an existing part
				itemPart = itemParts[partIndex];
			}
			itemPart._$setValue(item);
			partIndex++;
		}
		if (partIndex < itemParts.length) {
			// itemParts always have end nodes
			this._$clear(itemPart && wrap(itemPart._$endNode).nextSibling, partIndex);
			// Truncate the parts array so _value reflects the current state
			itemParts.length = partIndex;
		}
	}

	/**
	 * Removes the nodes contained within this Part from the DOM.
	 *
	 * @param start Start node to clear from, for clearing a subset of the part's
	 *     DOM (used when truncating iterables)
	 * @param from  When `start` is specified, the index within the iterable from
	 *     which ChildParts are being removed, used for disconnecting directives in
	 *     those Parts.
	 *
	 * @internal
	 */
	_$clear(start = wrap(this._$startNode).nextSibling, from) {
		this._$notifyConnectionChanged?.(false, true, from);
		while (start && start !== this._$endNode) {
			const n = wrap(start).nextSibling;
			wrap(start).remove();
			start = n;
		}
	}
	/**
	 * Implementation of RootPart's `isConnected`. Note that this method
	 * should only be called on `RootPart`s (the `ChildPart` returned from a
	 * top-level `render()` call). It has no effect on non-root ChildParts.
	 * @param isConnected Whether to set
	 * @internal
	 */
	setConnected(isConnected) {
		if (this._$parent === undefined) {
			this.__isConnected = isConnected;
			this._$notifyConnectionChanged?.(isConnected);
		} else if (DEV_MODE) {
			throw new Error(
				"part.setConnected() may only be called on a " +
					"RootPart returned from render().",
			);
		}
	}
}

/**
 * A top-level `ChildPart` returned from `render` that manages the connected
 * state of `AsyncDirective`s created throughout the tree below it.
 */

class AttributePart {
	type = ATTRIBUTE_PART;

	/**
	 * If this attribute part represents an interpolation, this contains the
	 * static strings of the interpolation. For single-value, complete bindings,
	 * this is undefined.
	 */

	/** @internal */
	_$committedValue = nothing;
	/** @internal */

	/** @internal */

	/** @internal */
	_$disconnectableChildren = undefined;
	get tagName() {
		return this.element.tagName;
	}

	// See comment in Disconnectable interface for why this is a getter
	get _$isConnected() {
		return this._$parent._$isConnected;
	}
	constructor(element, name, strings, parent, options) {
		this.element = element;
		this.name = name;
		this._$parent = parent;
		this.options = options;
		if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
			this._$committedValue = new Array(strings.length - 1).fill(new String());
			this.strings = strings;
		} else {
			this._$committedValue = nothing;
		}
		if (ENABLE_EXTRA_SECURITY_HOOKS) {
			this._sanitizer = undefined;
		}
	}

	/**
	 * Sets the value of this part by resolving the value from possibly multiple
	 * values and static strings and committing it to the DOM.
	 * If this part is single-valued, `this._strings` will be undefined, and the
	 * method will be called with a single value argument. If this part is
	 * multi-value, `this._strings` will be defined, and the method is called
	 * with the value array of the part's owning TemplateInstance, and an offset
	 * into the value array from which the values should be read.
	 * This method is overloaded this way to eliminate short-lived array slices
	 * of the template instance values, and allow a fast-path for single-valued
	 * parts.
	 *
	 * @param value The part value, or an array of values for multi-valued parts
	 * @param valueIndex the index to start reading values from. `undefined` for
	 *   single-valued parts
	 * @param noCommit causes the part to not commit its value to the DOM. Used
	 *   in hydration to prime attribute parts with their first-rendered value,
	 *   but not set the attribute, and in SSR to no-op the DOM operation and
	 *   capture the value for serialization.
	 *
	 * @internal
	 */
	_$setValue(value, directiveParent = this, valueIndex, noCommit) {
		const strings = this.strings;

		// Whether any of the values has changed, for dirty-checking
		let change = false;
		if (strings === undefined) {
			// Single-value binding case
			value = resolveDirective(this, value, directiveParent, 0);
			change =
				!isPrimitive(value) ||
				(value !== this._$committedValue && value !== noChange);
			if (change) {
				this._$committedValue = value;
			}
		} else {
			// Interpolation case
			const values = value;
			value = strings[0];
			let i, v;
			for (i = 0; i < strings.length - 1; i++) {
				v = resolveDirective(this, values[valueIndex + i], directiveParent, i);
				if (v === noChange) {
					// If the user-provided value is `noChange`, use the previous value
					v = this._$committedValue[i];
				}
				change ||= !isPrimitive(v) || v !== this._$committedValue[i];
				if (v === nothing) {
					value = nothing;
				} else if (value !== nothing) {
					value += (v ?? "") + strings[i + 1];
				}
				// We always record each value, even if one is `nothing`, for future
				// change detection.
				this._$committedValue[i] = v;
			}
		}
		if (change && !noCommit) {
			this._commitValue(value);
		}
	}

	/** @internal */
	_commitValue(value) {
		if (value === nothing) {
			wrap(this.element).removeAttribute(this.name);
		} else {
			if (ENABLE_EXTRA_SECURITY_HOOKS) {
				if (this._sanitizer === undefined) {
					this._sanitizer = sanitizerFactoryInternal(
						this.element,
						this.name,
						"attribute",
					);
				}
				value = this._sanitizer(value ?? "");
			}
			debugLogEvent?.({
				kind: "commit attribute",
				element: this.element,
				name: this.name,
				value,
				options: this.options,
			});
			wrap(this.element).setAttribute(this.name, value ?? "");
		}
	}
}
class PropertyPart extends AttributePart {
	type = PROPERTY_PART;

	/** @internal */
	_commitValue(value) {
		if (ENABLE_EXTRA_SECURITY_HOOKS) {
			if (this._sanitizer === undefined) {
				this._sanitizer = sanitizerFactoryInternal(
					this.element,
					this.name,
					"property",
				);
			}
			value = this._sanitizer(value);
		}
		debugLogEvent &&
			debugLogEvent({
				kind: "commit property",
				element: this.element,
				name: this.name,
				value,
				options: this.options,
			});

		const oldValue = this.element[this.name];
		this.element[this.name] = value === nothing ? undefined : value;

		// MONKEY PATCH: for some reason, properties passed using . (<uix-test .obj=${obj}>) aren't not triggering requestUpdate when they change
		if (this.element?.requestUpdate && oldValue !== value)
			this.element.requestUpdate(this.name, oldValue);
	}
}
class BooleanAttributePart extends AttributePart {
	type = BOOLEAN_ATTRIBUTE_PART;

	/** @internal */
	_commitValue(value) {
		debugLogEvent?.({
			kind: "commit boolean attribute",
			element: this.element,
			name: this.name,
			value: !!(value && value !== nothing),
			options: this.options,
		});
		wrap(this.element).toggleAttribute(this.name, !!value && value !== nothing);
	}
}

/**
 * An AttributePart that manages an event listener via add/removeEventListener.
 *
 * This part works by adding itself as the event listener on an element, then
 * delegating to the value passed to it. This reduces the number of calls to
 * add/removeEventListener if the listener changes frequently, such as when an
 * inline function is used as a listener.
 *
 * Because event options are passed when adding listeners, we must take case
 * to add and remove the part as a listener when the event options change.
 */

class EventPart extends AttributePart {
	type = EVENT_PART;
	constructor(element, name, strings, parent, options) {
		super(element, name, strings, parent, options);
		if (DEV_MODE && this.strings !== undefined) {
			throw new Error(
				`A \`<${element.localName}>\` has a \`@${name}=...\` listener with ` +
					"invalid content. Event listeners in templates must have exactly " +
					"one expression and no surrounding text.",
			);
		}
	}

	// EventPart does not use the base _$setValue/_resolveValue implementation
	// since the dirty checking is more complex
	/** @internal */
	_$setValue(newListener, directiveParent = this) {
		newListener =
			resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
		if (newListener === noChange) {
			return;
		}
		const oldListener = this._$committedValue;

		// If the new value is nothing or any options change we have to remove the
		// part as a listener.
		const shouldRemoveListener =
			(newListener === nothing && oldListener !== nothing) ||
			newListener.capture !== oldListener.capture ||
			newListener.once !== oldListener.once ||
			newListener.passive !== oldListener.passive;

		// If the new value is not nothing and we removed the listener, we have
		// to add the part as a listener.
		const shouldAddListener =
			newListener !== nothing &&
			(oldListener === nothing || shouldRemoveListener);
		debugLogEvent?.({
			kind: "commit event listener",
			element: this.element,
			name: this.name,
			value: newListener,
			options: this.options,
			removeListener: shouldRemoveListener,
			addListener: shouldAddListener,
			oldListener,
		});
		if (shouldRemoveListener) {
			this.element.removeEventListener(this.name, this, oldListener);
		}
		if (shouldAddListener) {
			// Beware: IE11 and Chrome 41 don't like using the listener as the
			// options object. Figure out how to deal w/ this in IE11 - maybe
			// patch addEventListener?
			this.element.addEventListener(this.name, this, newListener);
		}
		this._$committedValue = newListener;
	}
	handleEvent(event) {
		if (typeof this._$committedValue === "function") {
			this._$committedValue.call(this.options?.host ?? this.element, event);
		} else {
			this._$committedValue.handleEvent(event);
		}
	}
}
class ElementPart {
	type = ELEMENT_PART;

	/** @internal */

	// This is to ensure that every Part has a _$committedValue

	/** @internal */

	/** @internal */
	_$disconnectableChildren = undefined;
	constructor(element, parent, options) {
		this.element = element;
		this._$parent = parent;
		this.options = options;
	}

	// See comment in Disconnectable interface for why this is a getter
	get _$isConnected() {
		return this._$parent._$isConnected;
	}
	_$setValue(value) {
		debugLogEvent?.({
			kind: "commit to element binding",
			element: this.element,
			value,
			options: this.options,
		});
		resolveDirective(this, value);
	}
}

/**
 * END USERS SHOULD NOT RELY ON THIS OBJECT.
 *
 * Private exports for use by other Lit packages, not intended for use by
 * external users.
 *
 * We currently do not make a mangled rollup build of the lit-ssr code. In order
 * to keep a number of (otherwise private) top-level exports mangled in the
 * client side code, we a _$LH object containing those members (or
 * helper methods for accessing private fields of those members), and then
 * re-them for use in lit-ssr. This keeps lit-ssr agnostic to whether the
 * client-side code is being used in `dev` mode or `prod` mode.
 *
 * This has a unique name, to disambiguate it from private exports in
 * lit-element, which re-exports all of lit-html.
 *
 * @private
 */
const _$LH = {
	// Used in lit-ssr
	_boundAttributeSuffix: boundAttributeSuffix,
	_marker: marker,
	_markerMatch: markerMatch,
	_HTML_RESULT: HTML_RESULT,
	_getTemplateHtml: getTemplateHtml,
	// Used in tests and private-ssr-support
	_TemplateInstance: TemplateInstance,
	_isIterable: isIterable,
	_resolveDirective: resolveDirective,
	_ChildPart: ChildPart,
	_AttributePart: AttributePart,
	_BooleanAttributePart: BooleanAttributePart,
	_EventPart: EventPart,
	_PropertyPart: PropertyPart,
	_ElementPart: ElementPart,
};

// Apply polyfills if available
const polyfillSupport = DEV_MODE
	? global.litHtmlPolyfillSupportDevMode
	: global.litHtmlPolyfillSupport;
polyfillSupport?.(Template, ChildPart);

// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
(global.litHtmlVersions ??= []).push("3.2.0");
if (DEV_MODE && global.litHtmlVersions.length > 1) {
	issueWarning(
		"multiple-versions",
		"Multiple versions of Lit loaded. " +
			"Loading multiple versions is not recommended.",
	);
}

/**
 * Renders a value, usually a lit-html TemplateResult, to the container.
 *
 * This example renders the text "Hello, Zoe!" inside a paragraph tag, appending
 * it to the container `document.body`.
 *
 * ```js
 * import {html, render} from 'lit';
 *
 * const name = "Zoe";
 * render(html`<p>Hello, ${name}!</p>`, document.body);
 * ```
 *
 * @param value Any [renderable
 *   value](https://lit.dev/docs/templates/expressions/#child-expressions),
 *   typically a {@linkcode TemplateResult} created by evaluating a template tag
 *   like {@linkcode html} or {@linkcode svg}.
 * @param container A DOM container to render to. The first render will append
 *   the rendered value to the container, and subsequent renders will
 *   efficiently update the rendered value if the same result type was
 *   previously rendered there.
 * @param options See {@linkcode RenderOptions} for options documentation.
 * @see
 * {@link https://lit.dev/docs/libraries/standalone-templates/#rendering-lit-html-templates| Rendering Lit HTML Templates}
 */
const render = (value, container, options) => {
	if (DEV_MODE && container == null) {
		// Give a clearer error message than
		//     Uncaught TypeError: Cannot read properties of null (reading
		//     '_$litPart$')
		// which reads like an internal Lit error.
		throw new TypeError(`The container to render into may not be ${container}`);
	}
	const renderId = DEV_MODE ? debugLogRenderId++ : 0;
	const partOwnerNode = options?.renderBefore ?? container;
	// This property needs to remain unminified.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let part = partOwnerNode["_$litPart$"];
	debugLogEvent?.({
		kind: "begin render",
		id: renderId,
		value,
		container,
		options,
		part,
	});
	if (part === undefined) {
		const endNode = options?.renderBefore ?? null;
		// This property needs to remain unminified.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		partOwnerNode["_$litPart$"] = part = new ChildPart(
			container.insertBefore(createMarker(), endNode),
			endNode,
			undefined,
			options ?? {},
		);
	}
	part._$setValue(value);
	debugLogEvent?.({
		kind: "end render",
		id: renderId,
		value,
		container,
		options,
		part,
	});
	return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
	render.setSanitizer = setSanitizer;
	render.createSanitizer = createSanitizer;
	if (DEV_MODE) {
		render._testOnlyClearSanitizerFactoryDoNotCallOrElse =
			_testOnlyClearSanitizerFactoryDoNotCallOrElse;
	}
}

/**
 * Prevents JSON injection attacks.
 *
 * The goals of this brand:
 *   1) fast to check
 *   2) code is small on the wire
 *   3) multiple versions of Lit in a single page will all produce mutually
 *      interoperable StaticValues
 *   4) normal JSON.parse (without an unusual reviver) can not produce a
 *      StaticValue
 *
 * Symbols satisfy (1), (2), and (4). We use Symbol.for to satisfy (3), but
 * we don't care about the key, so we break ties via (2) and use the empty
 * string.
 */
const brand = Symbol.for("");

/** Safely extracts the string part of a StaticValue. */
const unwrapStaticValue = (value) => {
	if (value?.r !== brand) {
		return undefined;
	}
	return value?.["_$litStatic$"];
};

/**
 * Wraps a string so that it behaves like part of the static template
 * strings instead of a dynamic value.
 *
 * Users must take care to ensure that adding the static string to the template
 * results in well-formed HTML, or else templates may break unexpectedly.
 *
 * Note that this function is unsafe to use on untrusted content, as it will be
 * directly parsed into HTML. Do not pass user input to this function
 * without sanitizing it.
 *
 * Static values can be changed, but they will cause a complete re-render
 * since they effectively create a new template.
 */
const unsafeStatic = (value) => ({
	["_$litStatic$"]: value,
	r: brand,
});
const textFromStatic = (value) => {
	if (value["_$litStatic$"] !== undefined) {
		return value["_$litStatic$"];
	}
	throw new Error(`Value passed to 'literal' function must be a 'literal' result: ${value}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
};

/**
 * Tags a string literal so that it behaves like part of the static template
 * strings instead of a dynamic value.
 *
 * The only values that may be used in template expressions are other tagged
 * `literal` results or `unsafeStatic` values (note that untrusted content
 * should never be passed to `unsafeStatic`).
 *
 * Users must take care to ensure that adding the static string to the template
 * results in well-formed HTML, or else templates may break unexpectedly.
 *
 * Static values can be changed, but they will cause a complete re-render since
 * they effectively create a new template.
 */
const literal = (strings, ...values) => ({
	["_$litStatic$"]: values.reduce(
		(acc, v, idx) => acc + textFromStatic(v) + strings[idx + 1],
		strings[0],
	),
	r: brand,
});
const stringsCache = new Map();

/**
 * Wraps a lit-html template tag (`html` or `svg`) to add static value support.
 */
const withStatic =
	(coreTag) =>
	(strings, ...values) => {
		const l = values.length;
		let staticValue;
		let dynamicValue;
		const staticStrings = [];
		const dynamicValues = [];
		let i = 0;
		let hasStatics = false;
		let s;
		while (i < l) {
			s = strings[i];
			// Collect any unsafeStatic values, and their following template strings
			// so that we treat a run of template strings and unsafe static values as
			// a single template string.
			while (
				i < l &&
				((dynamicValue = values[i]),
				(staticValue = unwrapStaticValue(dynamicValue))) !== undefined
			) {
				s += staticValue + strings[++i];
				hasStatics = true;
			}
			// If the last value is static, we don't need to push it.
			if (i !== l) {
				dynamicValues.push(dynamicValue);
			}
			staticStrings.push(s);
			i++;
		}
		// If the last value isn't static (which would have consumed the last
		// string), then we need to add the last string.
		if (i === l) {
			staticStrings.push(strings[l]);
		}
		if (hasStatics) {
			const key = staticStrings.join("$$lit$$");
			strings = stringsCache.get(key);
			if (strings === undefined) {
				// Beware: in general this pattern is unsafe, and doing so may bypass
				// lit's security checks and allow an attacker to execute arbitrary
				// code and inject arbitrary content.
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				staticStrings.raw = staticStrings;
				stringsCache.set(key, (strings = staticStrings));
			}
			values = dynamicValues;
		}
		return coreTag(strings, ...values);
	};

/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 *
 * Includes static value support from `lit-html/static.js`.
 */
const staticHTML = withStatic(html);
const unsafeHTML = (html) => staticHTML`${unsafeStatic(html)}`;
const staticSVG = withStatic(svg);
const unsafeSVG = (svg) => staticSVG`${unsafeStatic(svg)}`;

const helpers = {
	unsafeHTML,
	unsafeStatic,
	staticHTML,
	staticSVG,
	unsafeSVG,
	render,
	html,
	literal,
	svg,
};

function css(strings, ...values) {
	return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}
$APP.addModule({ name: "css", base: css });
$APP.updateModule({ name: "html", base: html, functions: helpers });

})();
await (async () => {
$APP.addModule({
	name: "directive",
	path: "mvc/view/html/directive",
	frontend: true,
});

})();
await (async () => {
/**
 * Creates a user-facing directive function from a Directive class. This
 * function has the same parameters as the directive's render() method.
 */
export const directive =
	(c) =>
	(...values) => ({
		// This property needs to remain unminified.
		["_$litDirective$"]: c,
		values,
	});

/**
 * Base class for creating custom directives. Users should extend this class,
 * implement `render` and/or `update`, and then pass their subclass to
 * `directive`.
 */
export class Directive {
	//@internal
	__part;
	//@internal
	__attributeIndex;
	//@internal
	__directive;
	//@internal
	_$parent;

	// These will only exist on the AsyncDirective subclass
	//@internal
	_$disconnectableChildren;
	// This property needs to remain unminified.
	//@internal
	["_$notifyDirectiveConnectionChanged"];

	constructor(_partInfo) {}

	// See comment in Disconnectable interface for why this is a getter
	get _$isConnected() {
		return this._$parent._$isConnected;
	}

	/** @internal */
	_$initialize(part, parent, attributeIndex) {
		this.__part = part;
		this._$parent = parent;
		this.__attributeIndex = attributeIndex;
	}
	/** @internal */
	_$resolve(part, props) {
		return this.update(part, props);
	}

	render(...props) {
		throw new Error("The `render()` method must be implemented.");
	}

	update(_part, props) {
		return this.render(...props);
	}
}

// A sentinel value that can never appear as a part value except when set by
// live(). Used to force a dirty-check to fail and cause a re-render.
const RESET_VALUE = {};

/**
 * Sets the committed value of a ChildPart directly without triggering the
 * commit stage of the part.
 *
 * This is useful in cases where a directive needs to update the part such
 * that the next update detects a value change or not. When value is omitted,
 * the next update will be guaranteed to be detected as a change.
 *
 * @param part
 * @param value
 */
const setCommittedValue = (part, value = RESET_VALUE) =>
	(part._$committedValue = value);
const nothing = Symbol.for("lit-nothing");
class Keyed extends Directive {
	key = nothing;
	render(k, v) {
		this.key = k;
		return v;
	}
	update(part, [k, v]) {
		if (k !== this.key) {
			// Clear the part before returning a value. The one-arg form of
			// setCommittedValue sets the value to a sentinel which forces a
			// commit the next render.
			setCommittedValue(part);
			this.key = k;
		}
		return v;
	}
}

/**
 * Associates a renderable value with a unique key. When the key changes, the
 * previous DOM is removed and disposed before rendering the next value, even
 * if the value - such as a template - is the same.
 *
 * This is useful for forcing re-renders of stateful components, or working
 * with code that expects new data to generate new HTML elements, such as some
 * animation techniques.
 */
const keyed = directive(Keyed);

/**
 * The type of the class that powers this directive. Necessary for naming the
 * directive's return type.
 */
const base = { Directive, directive, keyed };
$APP.updateModule({ name: "html", functions: base });

})();
await (async () => {
$APP.addModule({
	name: "spread",
	path: "mvc/view/html/spread",
	modules: ["mvc/view/html", "mvc/view/html/directive"],
	frontend: true,
});

})();
await (async () => {
const { Directive, directive } = $APP.html;
const prefixValueKeys = (value, prefix) => {
	const o = {};
	for (const p in value) {
		o[prefix + p] = value[p];
	}
	return o;
};

export const toSpread = ({
	properties,
	events,
	attributes,
	booleanAttributes,
}) => {
	properties ??= {};
	return {
		...attributes,
		...prefixValueKeys(properties ?? {}, "."),
		...prefixValueKeys(events ?? {}, "@"),
		...prefixValueKeys(booleanAttributes ?? {}, "?"),
	};
};

export class Spread extends Directive {
	element;
	host;
	previousValue;

	render(value, events) {}

	isEqual(o, v) {
		return Object.is(o, v);
	}

	update(part, [value]) {
		this.element ??= part.element;
		if (this.element === undefined) {
			this.element = part.parentNode;
		}
		this.host ??= part.options?.host;
		// if value is an array,
		// 0: auto, 1: events, 2: boolean attributes, n: auto
		if (Array.isArray(value)) {
			value = value.reduce((a, o, i) => {
				Object.entries(o).forEach(([key, v]) => {
					if (i === 1) {
						key = `@${key}`;
					} else if (i === 2) {
						key = `?${key}`;
					}
					a[key] = v;
				});
				return a;
			}, {});
		}
		const { previousValue } = this;
		if (this.isEqual(value, previousValue)) {
			return;
		}
		this.previousValue = value;
		Object.entries(value).forEach(([key, v]) => {
			if (!this.isEqual(previousValue?.[key], v)) {
				const [, token, name] = key.match(/([.?@])?(.*)/);
				this.updateItem(token, name, v);
			}
		});
		// Unset previous
		if (previousValue == null) {
			return;
		}
		Object.entries(previousValue).forEach(([key]) => {
			if (!(key in value)) {
				const [, token, name] = key.match(/([.?@])?(.*)/);
				this.updateItem(token, name, undefined, true);
			}
		});
	}

	updateItem(token, name, value, unset = false) {
		switch (token) {
			case ".":
				return !unset && this.updateProperty(name, value);
			case "@":
				return this.updateEvent(name, value);
			case "?":
				return this.updateAttribute(name, value, true);
			default:
				if (typeof value === "object" && value !== null) {
					if (name === "class") {
						return this.updateClass(value);
					}
					if (name === "style") {
						return this.updateStyle(value);
					}
					return this.updateAttribute(name, JSON.stringify(value));
				}
				return name in this.element
					? this.updateProperty(name, value)
					: this.updateAttribute(name, value);
		}
	}

	listeners = new Map();

	updateEvent(name, value) {
		const handleEvent =
			typeof value === "function"
				? (e) => value.call(this.host ?? this.element, e)
				: null;
		let listener = this.listeners.get(name);
		if (handleEvent === null) {
			if (listener) {
				this.listeners.delete(name);
				this.element.removeEventListener(name, listener);
			}
			return;
		}
		if (listener === undefined) {
			this.listeners.set(
				name,
				(listener = {
					handleEvent,
				}),
			);
			this.element.addEventListener(name, listener);
		} else {
			listener.handleEvent = handleEvent;
		}
	}

	updateClass(value) {
		this.updateAttribute(
			"class",
			Object.entries(value)
				.filter(([k, v]) => v)
				.map(([k]) => k)
				.join(" "),
		);
	}

	updateStyle(value) {
		this.updateAttribute(
			"style",
			Object.entries(value)
				.map(([k, v]) => `${k}: ${v}`)
				.join("; "),
		);
	}

	updateAttribute(name, value, asBoolean = false) {
		if (typeof value === "boolean") {
			value = value ? "" : null;
		}
		// TODO: does this match Lit's semantics?
		if (value == null || (asBoolean && !value)) {
			this.element.removeAttribute(name);
		} else {
			this.element.setAttribute(name, asBoolean ? "" : value);
		}
	}

	updateProperty(name, value) {
		this.element[name] = value;
	}
}

const spread = directive(Spread);

$APP.updateModule({ name: "html", functions: { spread } });

})();
await (async () => {
$APP.addModule({
	dev: true,
	name: "loader",
	path: "mvc/view/loader",
	frontend: true,
});

})();
await (async () => {
// Helper functions
const getSize = (value, multiplier) => {
	const size = $APP.theme.sizes[value] || value;
	if (typeof size === "number")
		return multiplier ? `calc(${size}px * ${multiplier})` : `${size}px`;
	if (typeof size === "string" && size.includes("/")) {
		const [num, den] = size.split("/");
		const percent = `${((Number.parseFloat(num) / Number.parseFloat(den)) * 100).toFixed(3)}%`;
		return multiplier ? `calc(${percent} * ${multiplier})` : percent;
	}
	return size;
};

const getTextSize = (
	size,
	{ base = $APP.theme.text.base, ratio = $APP.theme.text.ratio } = {},
) => {
	const baseIndex = $APP.theme.text.sizes.indexOf("md");
	const sizeIndex = $APP.theme.text.sizes.indexOf(size);
	const diff = sizeIndex - baseIndex;
	const result =
		diff < 0 ? base / ratio ** Math.abs(diff) : base * ratio ** diff;
	return `${result.toFixed(2)}rem`;
};

$APP.addModule({
	name: "theme",
	path: "mvc/view/theme",
	alias: "ThemeManager",
	frontend: true,
	functions: {
		getSize,
		getTextSize,
	},
	namespace: true,
	base: {
		colors: {
			default: "darkgray",
			primary: "#00a7f1",
			secondary: "#007400",
			tertiary: "#00998d",
			success: "#49f09c",
			warning: "#fc8700",
			error: "#ff0040",
			surface: "darkgray",
			red: "#F44336",
			pink: "#E91E63",
			purple: "#9C27B0",
			blue: "#2196F3",
			cyan: "#00BCD4",
			green: "#4CAF50",
			yellow: "#FFEB3B",
			orange: "#FF9800",
			brown: "#795548",
			gray: "#9E9E9E",
			black: "#000000",
			white: "#FFFFFF",
		},
		font: {
			family:
				"'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
			iconFamily: "lucide",
			icon: {
				family: "lucide",
			},
		},
		background: {
			color: "var(--color-primary-10)",
		},
		button: {
			shade: 60,
			border: {
				shade: 90,
			},
		},
		text: {
			color: "var(--color-surface-100)",
			sizes: [
				"2xs",
				"xs",
				"sm",
				"md",
				"lg",
				"xl",
				"2xl",
				"xl",
				"2xl",
				"3xl",
				"4xl",
			],
			base: 1,
			ratio: 1.2,
		},
		border: {
			radius: "md",
			size: "1px",
			style: "solid",
			color: "var(--color-default-70)",
		},
		radius: {
			xs: "2px",
			sm: "4px",
			md: "8px",
			lg: "12px",
			xl: "16px",
			"2xl": "24px",
			full: "100%",
		},
		spacing: {
			none: "0",
			xs: "0.25rem",
			sm: "0.5rem",
			md: "1rem",
			lg: "1.5rem",
			xl: "2rem",
			"2xl": "2.5rem",
			"3xl": "3rem",
			"4xl": "4rem",
		},
		sizes: {
			"3xs": 50,
			"2xs": 80,
			xs: 120,
			sm: 200,
			md: 320,
			lg: 480,
			xl: 768,
			"2xl": 1024,
			"3xl": 1280,
			"4xl": 1536,
			min: "min-content",
			max: "max-content",
			fit: "fit-content",
			"fit-content": "fit-content",
			screen: "100vh",
			full: "100%",
			auto: "auto",
		},
	},
});

$APP.addModule({ name: "icons", alias: "Icons" });

})();
await (async () => {
const Theme = new Map();

const camelToKebab = (str) =>
	str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

const generateShade = (baseColorVar, percentage) =>
	percentage >= 0
		? `color-mix(in hsl, white ${percentage}%, ${baseColorVar})`
		: `color-mix(in hsl, ${baseColorVar}, black ${Math.abs(percentage)}%)`;

const shades = {
	0: 100,
	1: 98,
	5: 90,
	10: 80,
	20: 60,
	30: 40,
	40: 20,
	50: 0,
	60: -20,
	70: -30,
	80: -40,
	90: -55,
	95: -65,
	99: -80,
	100: -100,
};

// Generate CSS variables for colors and shades
const generateColorVariables = (colors) =>
	Object.entries(colors)
		.flatMap(([color, value]) => [
			`--color-${color}: ${value};`,
			...Object.entries(shades).map(
				([shade, percentage]) =>
					`--color-${color}-${shade}: ${generateShade(`var(--color-${color})`, percentage)};`,
			),
		])
		.join("\n");

// Generate CSS variables for general theme properties
const generateGeneralVariables = (obj, prefix = "--") =>
	Object.entries(obj)
		.flatMap(([key, value]) =>
			key === "colors"
				? []
				: typeof value === "object" && value !== null
					? generateGeneralVariables(value, `${prefix}${camelToKebab(key)}-`)
					: `${prefix}${camelToKebab(key)}: ${value};`,
		)
		.join("\n");

// Apply CSS variables to the root element
const setCSSVariables = (root, { colors, ...theme }) => {
	const cssString = `${generateColorVariables(colors)}\n${generateGeneralVariables(theme)}`;
	cssString
		.split("\n")
		.filter(Boolean)
		.forEach((variable) => {
			const [name, value] = variable.trim().split(": ");
			root.style.setProperty(name, value.slice(0, -1)); // Remove semicolon
		});
};

// Build-time CSS generation
const generateThemeCSS = ({ colors, ...theme }) =>
	`:root {\n${generateColorVariables(colors)}\n${generateGeneralVariables(theme)}}\n`;

// Helper function to generate CSS rules from resolved properties
const generateCSSRules = (tag, resolvedProps) =>
	Object.entries(resolvedProps)
		.filter(([_, value]) => value && value !== true)
		.map(([property, value]) => `--${tag}-${property}: ${value};`)
		.join(" ");

// Generate variant styles for components
const generateVariantStyles = ({ tag, theme: { types }, properties }) =>
	Object.entries(types || {})
		.flatMap(([variantName, variantProps]) =>
			typeof variantProps === "function"
				? (() => {
						let accessedField = null;
						const getterProxy = new Proxy(
							{},
							{ get: (_, field) => ((accessedField = field), field) },
						);
						variantProps(getterProxy);
						const options = properties?.[accessedField]?.enum;
						return (
							Array.isArray(options) ? options : Object.keys(options)
						).map((enumValue) => {
							const resolvedProps = variantProps({
								[accessedField]: enumValue,
							});
							const rules = generateCSSRules(tag, resolvedProps);
							return rules
								? `&${variantName === "default" ? "" : `[${variantName}]`}[${accessedField}="${enumValue}"] { ${rules} }`
								: "";
						});
					})()
				: generateCSSRules(tag, variantProps)
					? `&[${variantName}] { ${generateCSSRules(tag, variantProps)} }`
					: [],
		)
		.join("\n");

const globalStyleTag = (() => {
	const styleTag =
		document.querySelector("#compstyles") ||
		(() => {
			const tag = document.createElement("style");
			tag.id = "compstyles";
			document.head.appendChild(tag);
			return tag;
		})();
	return styleTag;
})();

const addCSSRule = ({
	attr,
	key,
	fn,
	tag,
	instance,
	inject,
	injectionKey,
	component,
}) => {
	const prop = component.properties[attr] || {};
	const stylesObject = fn({ value: key, prop, options: prop.enum, instance });
	let rules = "";
	for (const [property, cssValue] of Object.entries(stylesObject))
		rules += `${property}: ${cssValue};`;
	const finalRule =
		prop.type === "boolean"
			? `&[${attr}] { ${rules} }\n`
			: `&[${attr}~="${key}"] { ${rules} }\n`;
	if (!inject || !injectionKey || inject.has(injectionKey)) return;
	const classRule = `.${tag} { ${finalRule} }\n`;
	globalStyleTag.textContent += classRule;
	inject.add(injectionKey);
};

async function loadStyle(component) {
	const { tag, theme } = component;
	if (Theme.has(tag)) return;
	Theme.set(tag, "");
	const css = [
		component.css,
		theme?.types ? generateVariantStyles(component) : "",
	]
		.filter(Boolean)
		.join("\n");

	if (css) globalStyleTag.textContent += `.${tag} { ${css} }`;
}

const fetchCSS = async (file, addToStyle = false) => {
	console.log($APP.fs.getFilePath(file));
	const cssContent = await $APP.fs.fetchResource(
		file,
		async (response) => await response.text(),
		"css",
	);
	if (!addToStyle) return cssContent;
	const style = document.createElement("style");
	style.textContent = cssContent;
	document.head.appendChild(style);
	return cssContent;
};

const attributeChangedCallback = ({ component, key, value, instance }) => {
	const themeFn = component.theme?.[key];
	const tag = component.tag;
	const injectionKey = `${tag}-${key}-${value}`;
	if (!themeFn || injectedCSSRules.has(injectionKey)) return;
	addCSSRule({
		attr: key,
		instance,
		tag,
		fn: themeFn,
		key: value,
		component,
		inject: injectedCSSRules,
		injectionKey,
	});
};

const injectedCSSRules = new Set();

const functions = {
	fetchCSS,
	generateThemeCSS,
	loadStyle,
	attributeChangedCallback,
};

const hooks = ({ context }) => ({
	init: () => {
		setCSSVariables(document.documentElement, $APP.theme);
	},
	moduleAdded({ module }) {
		if (module.theme) context[module.name] = module.theme;
	},
});

$APP.updateModule({
	name: "theme",
	path: "mvc/view/theme",
	functions,
	hooks,
});

if ($APP.settings.dev) fetchCSS("theme.css", true);

})();
await (async () => {
$APP.addModule({
	name: "fonts",
	path: "mvc/view/fonts",
	frontend: true,
	base: [],
});

})();
await (async () => {
const fontFormats = { ttf: "truetype" };
const Weight = {
	extralight: 200,
	light: 300,
	regular: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	extrabold: 800,
};
const prepareFont = (extension, config) => {
	const { variants, name, type = "woff2" } = config;
	const fontFaces = variants
		.map((weight) => {
			const fontWeight = Weight[weight] || 400;
			return `@font-face {
      font-family: '${name}';
      font-weight: ${fontWeight};
      src: url('${$APP.settings.basePath}/modules/font/${extension}/${weight}.${type}') format('${fontFormats[type] || type}');
    }`;
		})
		.join("\n");
	return fontFaces;
};

const load = (name, config) => {
	const css = prepareFont(name, config);
	const style = document.createElement("style");
	style.textContent = css;
	document.head.appendChild(style);
};

$APP.addFunctions({
	name: "fonts",
	functions: { load },
});

$APP.addHooks({
	name: "fonts",
	hooks: {
		moduleAdded({ module }) {
			if (!module.font) return;
			load(module.name, module.font);
		},
	},
});

})();
await (async () => {
$APP.addModule({
	name: "unocss",
	path: "mvc/view/unocss",
	frontend: true,
});

})();
await (async () => {
"use strict";(()=>{var _f=Object.defineProperty;var Lf=(e,t)=>{for(var r in t)_f(e,r,{get:t[r],enumerable:!0})};var Xe="default",It="preflights",Wf="shortcuts",Uf="imports",Oo={[Uf]:-200,[It]:-100,[Wf]:-10,[Xe]:0};var Dt=/[\\:]?[\s'"`;{}]+/g;function Bf(e){return e.split(Dt)}var Nt={name:"@unocss/core/extractor-split",order:0,extract({code:e}){return Bf(e)}};function S(e=[]){return Array.isArray(e)?e:[e]}function ue(e){return Array.from(new Set(e))}function $n(e,t){return e.reduce((r,n)=>(r.findIndex(i=>t(n,i))===-1&&r.push(n),r),[])}function F(e){return typeof e=="string"}var Ze=class extends Set{_map=new Map;constructor(t){if(super(),t)for(let r of t)this.add(r)}add(t){return this._map.set(t,(this._map.get(t)??0)+1),super.add(t)}delete(t){return this._map.has(t)?(this._map.delete(t),super.delete(t)):!1}clear(){this._map.clear(),super.clear()}getCount(t){return this._map.get(t)??0}setCount(t,r){return this._map.set(t,r),super.add(t)}};function Kt(e){return e instanceof Ze}function K(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function J(e){let t=e.length,r=-1,n,o="",i=e.charCodeAt(0);for(;++r<t;){if(n=e.charCodeAt(r),n===0){o+="\uFFFD";continue}if(n===37){o+="\\%";continue}if(n===44){o+="\\,";continue}if(n>=1&&n<=31||n===127||r===0&&n>=48&&n<=57||r===1&&n>=48&&n<=57&&i===45){o+=`\\${n.toString(16)} `;continue}if(r===0&&t===1&&n===45){o+=`\\${e.charAt(r)}`;continue}if(n>=128||n===45||n===95||n>=48&&n<=57||n>=65&&n<=90||n>=97&&n<=122){o+=e.charAt(r);continue}o+=`\\${e.charAt(r)}`}return o}var Gt=J;function Vo(){return{events:{},emit(e,...t){(this.events[e]||[]).forEach(r=>r(...t))},on(e,t){return(this.events[e]=this.events[e]||[]).push(t),()=>this.events[e]=(this.events[e]||[]).filter(r=>r!==t)}}}var If=/[\w\u00A0-\uFFFF%-?]/;function Mo(e=""){return If.test(e)}function Fo(e){return typeof e=="function"?{match:e}:e}function wn(e){return e.length===3}function Ht(e){return e!=null}function _o(){}var qt=class{_map=new Map;get(t,r){let n=this._map.get(t);if(n)return n.get(r)}getFallback(t,r,n){let o=this._map.get(t);return o||(o=new Map,this._map.set(t,o)),o.has(r)||o.set(r,n),o.get(r)}set(t,r,n){let o=this._map.get(t);return o||(o=new Map,this._map.set(t,o)),o.set(r,n),this}has(t,r){return this._map.get(t)?.has(r)}delete(t,r){return this._map.get(t)?.delete(r)||!1}deleteTop(t){return this._map.delete(t)}map(t){return Array.from(this._map.entries()).flatMap(([r,n])=>Array.from(n.entries()).map(([o,i])=>t(i,r,o)))}},Yt=class extends Map{getFallback(t,r){let n=this.get(t);return n===void 0?(this.set(t,r),r):n}map(t){let r=[];return this.forEach((n,o)=>{r.push(t(n,o))}),r}flatMap(t){let r=[];return this.forEach((n,o)=>{r.push(...t(n,o))}),r}};function Qe(e){return F(e)?e:(Array.isArray(e)?e:Object.entries(e)).filter(t=>t[1]!=null)}function Lo(e){return Array.isArray(e)?e.find(t=>!Array.isArray(t)||Array.isArray(t[0]))?e.map(t=>Qe(t)):[e]:[Qe(e)]}function Df(e){return e.filter(([t,r],n)=>{if(t.startsWith("$$"))return!1;for(let o=n-1;o>=0;o--)if(e[o][0]===t&&e[o][1]===r)return!1;return!0})}function Le(e){return e==null?"":Df(e).map(([t,r])=>r!=null&&typeof r!="function"?`${t}:${r};`:void 0).filter(Boolean).join("")}function Xt(e){return e&&typeof e=="object"&&!Array.isArray(e)}function kn(e,t,r=!1){let n=e,o=t;if(Array.isArray(o))return r&&Array.isArray(o)?[...n,...o]:[...o];let i={...n};return Xt(n)&&Xt(o)&&Object.keys(o).forEach(s=>{Xt(n[s])&&Xt(o[s])||Array.isArray(n[s])&&Array.isArray(o[s])?i[s]=kn(n[s],o[s],r):Object.assign(i,{[s]:o[s]})}),i}function Je(e){let t,r,n;if(Array.isArray(e)){for(r=Array.from({length:t=e.length});t--;)r[t]=(n=e[t])&&typeof n=="object"?Je(n):n;return r}if(Object.prototype.toString.call(e)==="[object Object]"){r={};for(t in e)t==="__proto__"?Object.defineProperty(r,t,{value:Je(e[t]),configurable:!0,enumerable:!0,writable:!0}):r[t]=(n=e[t])&&typeof n=="object"?Je(n):n;return r}return e}function Wo(e){return F(e[0])}function Uo(e){return F(e[0])}var Zt={};function Nf(e=["-",":"]){let t=e.join("|");return Zt[t]||(Zt[t]=new RegExp(`((?:[!@<~\\w+:_-]|\\[&?>?:?\\S*\\])+?)(${t})\\(((?:[~!<>\\w\\s:/\\\\,%#.$?-]|\\[[^\\]]*?\\])+?)\\)(?!\\s*?=>)`,"gm")),Zt[t].lastIndex=0,Zt[t]}function Kf(e,t=["-",":"],r=5){let n=Nf(t),o,i=e.toString(),s=new Set,a=new Map;do o=!1,i=i.replace(n,(l,u,d,h,m)=>{if(!t.includes(d))return l;o=!0,s.add(u+d);let g=m+u.length+d.length+1,x={length:l.length,items:[]};a.set(m,x);for(let k of[...h.matchAll(/\S+/g)]){let C=g+k.index,v=a.get(C)?.items;v?a.delete(C):v=[{offset:C,length:k[0].length,className:k[0]}];for(let b of v)b.className=b.className==="~"?u:b.className.replace(/^(!?)(.*)/,`$1${u}${d}$2`),x.items.push(b)}return"$".repeat(l.length)}),r-=1;while(o&&r);let c;if(typeof e=="string"){c="";let l=0;for(let[u,d]of a)c+=e.slice(l,u),c+=d.items.map(h=>h.className).join(" "),l=u+d.length;c+=e.slice(l)}else{c=e;for(let[l,u]of a)c.overwrite(l,l+u.length,u.items.map(d=>d.className).join(" "))}return{prefixes:Array.from(s),hasChanged:o,groupsByOffset:a,get expanded(){return c.toString()}}}function Bo(e,t=["-",":"],r=5){let n=Kf(e,t,r);return typeof e=="string"?n.expanded:e}var Io=new Set;function Do(e){Io.has(e)||(console.warn("[unocss]",e),Io.add(e))}function Go(e){return S(e).flatMap(t=>Array.isArray(t)?[t]:Object.entries(t))}var No="_uno_resolved";async function Gf(e){let t=typeof e=="function"?await e():await e;if(No in t)return t;t={...t},Object.defineProperty(t,No,{value:!0,enumerable:!1});let r=t.shortcuts?Go(t.shortcuts):void 0;if(t.shortcuts=r,t.prefix||t.layer){let n=o=>{o[2]||(o[2]={});let i=o[2];i.prefix==null&&t.prefix&&(i.prefix=S(t.prefix)),i.layer==null&&t.layer&&(i.layer=t.layer)};r?.forEach(n),t.rules?.forEach(n)}return t}async function Ho(e){let t=await Gf(e);if(!t.presets)return[t];let r=(await Promise.all((t.presets||[]).flatMap(S).flatMap(Ho))).flat();return[t,...r]}function Hf(e){if(e.length===0)return{};let t=[],r=[],n=!1,o=[],i=[];for(let a of e){if(a.pipeline===!1){n=!0;break}else a.pipeline?.include&&t.push(a.pipeline.include),a.pipeline?.exclude&&r.push(a.pipeline.exclude);a.filesystem&&o.push(a.filesystem),a.inline&&i.push(a.inline)}let s={pipeline:n?!1:{include:ue(Ko(...t)),exclude:ue(Ko(...r))}};return o.length&&(s.filesystem=ue(o.flat())),i.length&&(s.inline=ue(i.flat())),s}async function Sn(e={},t={}){let r=Object.assign({},t,e),n=$n((await Promise.all((r.presets||[]).flatMap(S).flatMap(Ho))).flat(),(y,P)=>y.name===P.name),o=[...n.filter(y=>y.enforce==="pre"),...n.filter(y=>!y.enforce),...n.filter(y=>y.enforce==="post")],i=[...o,r],s=[...i].reverse(),a=Object.assign({},Oo,...i.map(y=>y.layers));function c(y){return ue(i.flatMap(P=>S(P[y]||[])))}let l=c("extractors"),u=s.find(y=>y.extractorDefault!==void 0)?.extractorDefault;u===void 0&&(u=Nt),u&&!l.includes(u)&&l.unshift(u),l.sort((y,P)=>(y.order||0)-(P.order||0));let d=c("rules"),h={},m=d.length,g=d.filter(y=>Wo(y)?(S(y[2]?.prefix||"").forEach(w=>{h[w+y[0]]=y}),!1):!0).reverse(),x={templates:ue(i.flatMap(y=>S(y.autocomplete?.templates))),extractors:i.flatMap(y=>S(y.autocomplete?.extractors)).sort((y,P)=>(y.order||0)-(P.order||0)),shorthands:Yf(i.map(y=>y.autocomplete?.shorthands||{}))},k=c("separators");k.length||(k=[":","-"]);let C=c("content"),v=Hf(C),b={mergeSelectors:!0,warn:!0,sortLayers:y=>y,...r,blocklist:c("blocklist"),presets:o,envMode:r.envMode||"build",shortcutsLayer:r.shortcutsLayer||"shortcuts",layers:a,theme:qf(i.map(y=>y.theme)),rules:d,rulesSize:m,rulesDynamic:g,rulesStaticMap:h,preprocess:c("preprocess"),postprocess:c("postprocess"),preflights:c("preflights"),autocomplete:x,variants:c("variants").map(Fo).sort((y,P)=>(y.order||0)-(P.order||0)),shortcuts:Go(c("shortcuts")).reverse(),extractors:l,safelist:c("safelist"),separators:k,details:r.details??r.envMode==="dev",content:v,transformers:$n(c("transformers"),(y,P)=>y.name===P.name)},z=c("extendTheme");for(let y of z)b.theme=y(b.theme,b)||b.theme;for(let y of i)y?.configResolved?.(b);return b}function qf(e){return e.map(t=>t?Je(t):{}).reduce((t,r)=>kn(t,r),{})}function Yf(e){return e.reduce((t,r)=>{let n={};for(let o in r){let i=r[o];Array.isArray(i)?n[o]=`(${i.join("|")})`:n[o]=i}return{...t,...n}},{})}function Ko(...e){return e.flatMap(Xf)}function Xf(e){return Array.isArray(e)?e:e?[e]:[]}var qo="66.3.3";var $e={shortcutsNoMerge:"$$symbol-shortcut-no-merge",noMerge:"$$symbol-no-merge",variants:"$$symbol-variants",parent:"$$symbol-parent",selector:"$$symbol-selector",layer:"$$symbol-layer",sort:"$$symbol-sort"},Cn=class e{constructor(t={},r={}){this.userConfig=t;this.defaults=r}version=qo;events=Vo();config=void 0;cache=new Map;blocked=new Set;parentOrders=new Map;activatedRules=new Set;static async create(t={},r={}){let n=new e(t,r);return n.config=await Sn(n.userConfig,n.defaults),n.events.emit("config",n.config),n}async setConfig(t,r){t&&(r&&(this.defaults=r),this.userConfig=t,this.blocked.clear(),this.parentOrders.clear(),this.activatedRules.clear(),this.cache.clear(),this.config=await Sn(t,this.defaults),this.events.emit("config",this.config))}async applyExtractors(t,r,n=new Set){let o={original:t,code:t,id:r,extracted:n,envMode:this.config.envMode};for(let i of this.config.extractors){let s=await i.extract?.(o);if(s)if(Kt(s)&&Kt(n))for(let a of s)n.setCount(a,n.getCount(a)+s.getCount(a));else for(let a of s)n.add(a)}return n}makeContext(t,r){let n={rawSelector:t,currentSelector:r[1],theme:this.config.theme,generator:this,symbols:$e,variantHandlers:r[2],constructCSS:(...o)=>this.constructCustomCSS(n,...o),variantMatch:r};return n}async parseToken(t,r){if(this.blocked.has(t))return;let n=`${t}${r?` ${r}`:""}`;if(this.cache.has(n))return this.cache.get(n);let o=this.config.preprocess.reduce((c,l)=>l(c)??c,t);if(this.isBlocked(o)){this.blocked.add(t),this.cache.set(n,null);return}let i=await this.matchVariants(t,o);if(i.every(c=>!c||this.isBlocked(c[1]))){this.blocked.add(t),this.cache.set(n,null);return}let s=async c=>{let l=this.makeContext(t,[r||c[0],c[1],c[2],c[3]]);this.config.details&&(l.variants=[...c[3]]);let u=await this.expandShortcut(l.currentSelector,l);return u?await this.stringifyShortcuts(l.variantMatch,l,u[0],u[1]):(await this.parseUtil(l.variantMatch,l))?.map(h=>this.stringifyUtil(h,l)).filter(Ht)},a=(await Promise.all(i.map(c=>s(c)))).flat().filter(c=>!!c);if(a?.length)return this.cache.set(n,a),a;this.cache.set(n,null)}async generate(t,r={}){let{id:n,scope:o,preflights:i=!0,safelist:s=!0,minify:a=!1,extendedInfo:c=!1}=r,l=F(t)?await this.applyExtractors(t,n,c?new Ze:new Set):Array.isArray(t)?new Set(t):t;if(s){let w={generator:this,theme:this.config.theme};this.config.safelist.flatMap(R=>typeof R=="function"?R(w):R).forEach(R=>{let O=R.trim();O&&!l.has(O)&&l.add(O)})}let u=a?"":`
`,d=new Set([Xe]),h=c?new Map:new Set,m=new Map,g={},x=Array.from(l).map(async w=>{if(h.has(w))return;let R=await this.parseToken(w);if(R!=null){h instanceof Map?h.set(w,{data:R,count:Kt(l)?l.getCount(w):-1}):h.add(w);for(let O of R){let ee=O[3]||"",te=O[4]?.layer;m.has(ee)||m.set(ee,[]),m.get(ee).push(O),te&&d.add(te)}}});await Promise.all(x),await(async()=>{if(!i)return;let w={generator:this,theme:this.config.theme},R=new Set([]);this.config.preflights.forEach(({layer:O=It})=>{d.add(O),R.add(O)}),g=Object.fromEntries(await Promise.all(Array.from(R).map(async O=>{let te=(await Promise.all(this.config.preflights.filter(le=>(le.layer||It)===O).map(async le=>await le.getCSS(w)))).filter(Boolean).join(u);return[O,te]})))})();let k=this.config.sortLayers(Array.from(d).sort((w,R)=>(this.config.layers[w]??0)-(this.config.layers[R]??0)||w.localeCompare(R))),C={},v=this.config.outputToCssLayers,b=w=>{let R=w;return typeof v=="object"&&(R=v.cssLayerName?.(w)),R===null?null:R??w},z=(w=Xe)=>{if(C[w])return C[w];let R=Array.from(m).sort((te,le)=>(this.parentOrders.get(te[0])??0)-(this.parentOrders.get(le[0])??0)||te[0]?.localeCompare(le[0]||"")||0).map(([te,le])=>{let E=le.length,V=le.filter(I=>(I[4]?.layer||Xe)===w).sort((I,fe)=>I[0]-fe[0]||(I[4]?.sort||0)-(fe[4]?.sort||0)||I[5]?.currentSelector?.localeCompare(fe[5]?.currentSelector??"")||I[1]?.localeCompare(fe[1]||"")||I[2]?.localeCompare(fe[2]||"")||0).map(([,I,fe,,Bt,,yn])=>[[[(I&&Qf(I,o))??"",Bt?.sort??0]],fe,!!(yn??Bt?.noMerge)]);if(!V.length)return;let B=V.reverse().map(([I,fe,Bt],yn)=>{if(!Bt&&this.config.mergeSelectors)for(let Re=yn+1;Re<E;Re++){let ge=V[Re];if(ge&&!ge[2]&&(I&&ge[0]||I==null&&ge[0]==null)&&ge[1]===fe)return I&&ge[0]&&ge[0].push(...I),null}let vn=I?ue(I.sort((Re,ge)=>Re[1]-ge[1]||Re[0]?.localeCompare(ge[0]||"")||0).map(Re=>Re[0]).filter(Boolean)):[];return vn.length?`${vn.join(`,${u}`)}{${fe}}`:fe}).filter(Boolean),D=Array.from(new Set(B)).reverse().join(u);if(!te)return D;let Q=te.split(" $$ ");return`${Q.join("{")}{${u}${D}${u}${"}".repeat(Q.length)}`}).filter(Boolean).join(u);i&&(R=[g[w],R].filter(Boolean).join(u));let O;v&&R&&(O=b(w),O!==null&&(R=`@layer ${O}{${u}${R}${u}}`));let ee=a?"":`/* layer: ${w}${O&&O!==w?`, alias: ${O}`:""} */${u}`;return C[w]=R?ee+R:""},y=(w=k,R)=>{let O=w.filter(ee=>!R?.includes(ee));return[v&&O.length>0?`@layer ${O.map(b).filter(Ht).join(", ")};`:void 0,...O.map(ee=>z(ee)||"")].filter(Boolean).join(u)};return{get css(){return y()},layers:k,matched:h,getLayers:y,getLayer:z,setLayer:async(w,R)=>{let O=await R(z(w));return C[w]=O,O}}}async matchVariants(t,r){let n={rawSelector:t,theme:this.config.theme,generator:this},o=async i=>{let s=!0,[,,a,c]=i;for(;s;){s=!1;let l=i[1];for(let u of this.config.variants){if(!u.multiPass&&c.has(u))continue;let d=await u.match(l,n);if(d){if(F(d)){if(d===l)continue;d={matcher:d}}if(Array.isArray(d)){if(!d.length)continue;if(d.length===1)d=d[0];else{if(u.multiPass)throw new Error("multiPass can not be used together with array return variants");let h=d.map(m=>{let g=m.matcher??l,x=[m,...a],k=new Set(c);return k.add(u),[i[0],g,x,k]});return(await Promise.all(h.map(m=>o(m)))).flat()}}i[1]=d.matcher??l,a.unshift(d),c.add(u),s=!0;break}}if(!s)break;if(a.length>500)throw new Error(`Too many variants applied to "${t}"`)}return[i]};return await o([t,r||t,[],new Set])}applyVariants(t,r=t[4],n=t[1]){let i=r.slice().sort((l,u)=>(l.order||0)-(u.order||0)).reduceRight((l,u)=>d=>{let h=u.body?.(d.entries)||d.entries,m=Array.isArray(u.parent)?u.parent:[u.parent,void 0],g=u.selector?.(d.selector,h);return(u.handle??tu)({...d,entries:h,selector:g||d.selector,parent:m[0]||d.parent,parentOrder:m[1]||d.parentOrder,layer:u.layer||d.layer,sort:u.sort||d.sort},l)},l=>l)({prefix:"",selector:eu(n),pseudo:"",entries:t[2]}),{parent:s,parentOrder:a}=i;s!=null&&a!=null&&this.parentOrders.set(s,a);let c={selector:[i.prefix,i.selector,i.pseudo].join(""),entries:i.entries,parent:s,layer:i.layer,sort:i.sort,noMerge:i.noMerge};for(let l of this.config.postprocess)l(c);return c}constructCustomCSS(t,r,n){let o=Qe(r);if(F(o))return o;let{selector:i,entries:s,parent:a}=this.applyVariants([0,n||t.rawSelector,o,void 0,t.variantHandlers]),c=`${i}{${Le(s)}}`;return a?`${a}{${c}}`:c}async parseUtil(t,r,n=!1,o){let i=F(t)?await this.matchVariants(t):[t],s=async([c,l,u])=>{this.config.details&&(r.rules=r.rules??[]);let d={...r,variantHandlers:u},h=this.config.rulesStaticMap[l];if(h&&h[1]&&(n||!h[2]?.internal))return this.resolveCSSResult(c,h[1],h,d);for(let m of this.config.rulesDynamic){let[g,x,k]=m;if(k?.internal&&!n)continue;let C=l;if(k?.prefix){let y=S(k.prefix);if(o){let P=S(o);if(!y.some(w=>P.includes(w)))continue}else{let P=y.find(w=>l.startsWith(w));if(P==null)continue;C=l.slice(P.length)}}let v=C.match(g);if(!v)continue;let b=await x(v,d);if(!b)continue;if(typeof b!="string")if(Symbol.asyncIterator in b){let y=[];for await(let P of b)P&&y.push(P);b=y}else Symbol.iterator in b&&!Array.isArray(b)&&(b=Array.from(b).filter(Ht));let z=this.resolveCSSResult(c,b,m,d);if(z)return z}},a=(await Promise.all(i.map(c=>s(c)))).flat().filter(c=>!!c);if(a.length)return a}resolveCSSResult=(t,r,n,o)=>{let i=Lo(r).filter(s=>s.length);if(i.length){this.config.details&&o.rules.push(n),o.generator.activatedRules.add(n);let s=o.generator.config.rules.indexOf(n),a=n[2];return i.map(c=>{if(F(c))return[s,c,a];let l=o.variantHandlers,u=a;for(let d of c)d[0]===$e.variants?typeof d[1]=="function"?l=d[1](l)||l:l=[...S(d[1]),...l]:d[0]===$e.parent?l=[{parent:d[1]},...l]:d[0]===$e.selector?l=[{selector:d[1]},...l]:d[0]===$e.layer?l=[{layer:d[1]},...l]:d[0]===$e.sort?u={...u,sort:d[1]}:d[0]===$e.noMerge&&(u={...u,noMerge:d[1]});return[s,t,c,u,l]})}};stringifyUtil(t,r){if(!t)return;if(wn(t))return[t[0],void 0,t[1],void 0,t[2],this.config.details?r:void 0,void 0];let{selector:n,entries:o,parent:i,layer:s,sort:a,noMerge:c}=this.applyVariants(t),l=Le(o);if(!l)return;let{layer:u,sort:d,...h}=t[3]??{},m={...h,layer:s??u,sort:a??d};return[t[0],n,l,i,m,this.config.details?r:void 0,c]}async expandShortcut(t,r,n=5){if(n===0)return;let o=this.config.details?l=>{r.shortcuts=r.shortcuts??[],r.shortcuts.push(l)}:_o,i,s,a,c;for(let l of this.config.shortcuts){let u=t;if(l[2]?.prefix){let h=S(l[2].prefix).find(m=>t.startsWith(m));if(h==null)continue;u=t.slice(h.length)}if(Uo(l)){if(l[0]===u){i=i||l[2],s=l[1],o(l);break}}else{let d=u.match(l[0]);if(d&&(s=l[1](d,r)),s){i=i||l[2],o(l);break}}}if(s&&(a=ue(S(s).filter(F).map(l=>Bo(l.trim()).split(/\s+/g)).flat()),c=S(s).filter(l=>!F(l)).map(l=>({handles:[],value:l}))),!s){let l=F(t)?await this.matchVariants(t):[t];for(let u of l){let[d,h,m]=u;if(d!==h){let g=await this.expandShortcut(h,r,n-1);g&&(a=g[0].filter(F).map(x=>d.replace(h,x)),c=g[0].filter(x=>!F(x)).map(x=>({handles:[...x.handles,...m],value:x.value})))}}}if(!(!a?.length&&!c?.length))return[[await Promise.all(S(a).map(async l=>(await this.expandShortcut(l,r,n-1))?.[0]||[l])),c].flat(2).filter(l=>!!l),i]}async stringifyShortcuts(t,r,n,o={layer:this.config.shortcutsLayer}){let i=new Yt,s=(await Promise.all(ue(n).map(async u=>{let d=F(u)?await this.parseUtil(u,r,!0,o.prefix):[[Number.POSITIVE_INFINITY,"{inline}",Qe(u.value),void 0,u.handles]];return!d&&this.config.warn&&Do(`unmatched utility "${u}" in shortcut "${t[1]}"`),d||[]}))).flat(1).filter(Boolean).sort((u,d)=>u[0]-d[0]),[a,,c]=t,l=[];for(let u of s){if(wn(u)){l.push([u[0],void 0,u[1],void 0,u[2],r,void 0]);continue}let{selector:d,entries:h,parent:m,sort:g,noMerge:x,layer:k}=this.applyVariants(u,[...u[4],...c],a);i.getFallback(k??o.layer,new qt).getFallback(d,m,[[],u[0]])[0].push([h,!!(x??u[3]?.noMerge),g??0])}return l.concat(i.flatMap((u,d)=>u.map(([h,m],g,x)=>{let k=(v,b,z)=>{let y=Math.max(...z.map(w=>w[1])),P=z.map(w=>w[0]);return(v?[P.flat(1)]:P).map(w=>{let R=Le(w);if(R)return[m,g,R,x,{...o,noMerge:b,sort:y,layer:d},r,void 0]})};return[[h.filter(([,v])=>v).map(([v,,b])=>[v,b]),!0],[h.filter(([,v])=>!v).map(([v,,b])=>[v,b]),!1]].map(([v,b])=>[...k(!1,b,v.filter(([z])=>z.some(y=>y[0]===$e.shortcutsNoMerge))),...k(!0,b,v.filter(([z])=>z.every(y=>y[0]!==$e.shortcutsNoMerge)))])}).flat(2).filter(Boolean)))}isBlocked(t){return!t||this.config.blocklist.map(r=>Array.isArray(r)?r[0]:r).some(r=>typeof r=="function"?r(t):F(r)?r===t:r.test(t))}getBlocked(t){let r=this.config.blocklist.find(n=>{let o=Array.isArray(n)?n[0]:n;return typeof o=="function"?o(t):F(o)?o===t:o.test(t)});return r?Array.isArray(r)?r:[r,void 0]:void 0}};async function Xo(e,t){return await Cn.create(e,t)}var Zo=/\s\$\$\s+/g;function Jf(e){return Zo.test(e)}function Qf(e,t){return Jf(e)?e.replace(Zo,t?` ${t} `:" "):t?`${t} ${e}`:e}var Yo=/^\[(.+?)(~?=)"(.*)"\]$/;function eu(e){return Yo.test(e)?e.replace(Yo,(t,r,n,o)=>`[${Gt(r)}${n}"${Gt(o)}"]`):`.${Gt(e)}`}function tu(e,t){return t(e)}function ru(e){let t,r,n=2166136261;for(t=0,r=e.length;t<r;t++)n^=e.charCodeAt(t),n+=(n<<1)+(n<<4)+(n<<7)+(n<<8)+(n<<24);return`00000${(n>>>0).toString(36)}`.slice(-6)}function Jo(e,t,r,n){for(let o of Array.from(e.matchAll(r)))if(o!=null){let i=o[0],s=`${n}${ru(i)}`;t.set(s,i),e=e.replace(i,s)}return e}function Qo(e,t){for(let[r,n]of t.entries())e=e.replaceAll(r,n);return e}var nu=/\/\/#\s*sourceMappingURL=.*\n?/g;function ei(e){return e.includes("sourceMappingURL=")?e.replace(nu,""):e}var ou=/(?:[\w&:[\]-]|\[\S{1,64}=\S{1,64}\]){1,64}\[\\?['"]?\S{1,64}?['"]\]\]?[\w:-]{0,64}/g,iu=/\[(\\\W|[\w-]){1,64}:[^\s:]{0,64}?("\S{1,64}?"|'\S{1,64}?'|`\S{1,64}?`|[^\s:]{1,64}?)[^\s:]{0,64}?\)?\]/g,su=/^\[(?:\\\W|[\w-]){1,64}:['"]?\S{1,64}?['"]?\]$/;function au(e){let t=[];for(let o of e.matchAll(iu))o.index!==0&&!/^[\s'"`]/.test(e[o.index-1]??"")||t.push(o[0]);for(let o of e.matchAll(ou))t.push(o[0]);let r=new Map,n="@unocss-skip-arbitrary-brackets";return e=Jo(e,r,/-\[(?!&.+?;)[^\]]*\]/g,n),e&&e.split(Dt).forEach(o=>{o.includes(n)&&(o=Qo(o,r)),Mo(o)&&!su.test(o)&&t.push(o)}),t}function ti(){return{name:"@unocss/extractor-arbitrary-variants",order:0,extract({code:e}){return au(ei(e))}}}function ri(e){if(e.preflight)return[{layer:"preflights",getCSS({theme:t,generator:r}){if(t.preflightBase){let n=Object.entries(t.preflightBase);if(e.preflight==="on-demand"){let o=new Set(Array.from(r.activatedRules).map(i=>i[2]?.custom?.preflightKeys).filter(Boolean).flat());n=n.filter(([i])=>o.has(i))}if(n.length>0){let o=Le(n);return e.variablePrefix!=="un-"&&(o=o.replace(/--un-/g,`--${e.variablePrefix}`)),S(t.preflightRoot??["*,::before,::after","::backdrop"]).map(s=>`${s}{${o}}`).join("")}}}}]}function re(e,t,r){if(e==="")return;let n=e.length,o=0,i=!1,s=0;for(let a=0;a<n;a++)switch(e[a]){case t:i||(i=!0,s=a),o++;break;case r:if(--o,o<0)return;if(o===0)return[e.slice(s,a+1),e.slice(a+1),e.slice(0,s)];break}}function pe(e,t,r,n){if(e===""||(F(n)&&(n=[n]),n.length===0))return;let o=e.length,i=0;for(let s=0;s<o;s++)switch(e[s]){case t:i++;break;case r:if(--i<0)return;break;default:for(let a of n){let c=a.length;if(c&&a===e.slice(s,s+c)&&i===0)return s===0||s===o-c?void 0:[e.slice(0,s),e.slice(s+c)]}}return[e,""]}function Ee(e,t,r,n="(",o=")"){r=r??10;let i=[],s=0;for(;e!=="";){if(++s>r)return;let a=pe(e,n,o,t);if(!a)return;let[c,l]=a;i.push(c),e=l}if(i.length>0)return i}var Rn=["hsl","hsla","hwb","lab","lch","oklab","oklch","rgb","rgba"];var ni=["%alpha","<alpha-value>"],cu=new RegExp(ni.map(e=>K(e)).join("|"),"g");function Y(e=""){let t=lu(e);if(t==null||t===!1)return;let{type:r,components:n,alpha:o}=t,i=r.toLowerCase();if(n.length!==0&&!(Rn.includes(i)&&![1,3].includes(n.length)))return{type:i,components:n.map(s=>typeof s=="string"?s.trim():s),alpha:typeof o=="string"?o.trim():o}}function ie(e){let t=e.alpha??1;return typeof t=="string"&&ni.includes(t)?1:t}function j(e,t){if(typeof e=="string")return e.replace(cu,`${t??1}`);let{components:r}=e,{alpha:n,type:o}=e;return n=t??n,o=o.toLowerCase(),["hsla","rgba"].includes(o)?`${o}(${r.join(", ")}${n==null?"":`, ${n}`})`:(n=n==null?"":` / ${n}`,Rn.includes(o)?`${o}(${r.join(" ")}${n})`:`color(${o} ${r.join(" ")}${n})`)}function lu(e){if(!e)return;let t=fu(e);if(t!=null||(t=uu(e),t!=null)||(t=pu(e),t!=null)||(t=mu(e),t!=null)||(t=gu(e),t!=null))return t}function fu(e){let[,t]=e.match(/^#([\da-f]+)$/i)||[];if(t)switch(t.length){case 3:case 4:{let r=Array.from(t,n=>Number.parseInt(n,16)).map(n=>n<<4|n);return{type:"rgb",components:r.slice(0,3),alpha:t.length===3?void 0:Math.round(r[3]/255*100)/100}}case 6:case 8:{let r=Number.parseInt(t,16);return{type:"rgb",components:t.length===6?[r>>16&255,r>>8&255,r&255]:[r>>24&255,r>>16&255,r>>8&255],alpha:t.length===6?void 0:Math.round((r&255)/255*100)/100}}}}function uu(e){let t={rebeccapurple:[102,51,153,1]}[e];if(t!=null)return{type:"rgb",components:t.slice(0,3),alpha:t[3]}}function pu(e){let t=e.match(/^(rgb|rgba|hsl|hsla)\((.+)\)$/i);if(!t)return;let[,r,n]=t,o=Ee(n,",",5);if(o){if([3,4].includes(o.length))return{type:r,components:o.slice(0,3),alpha:o[3]};if(o.length!==1)return!1}}var du=new RegExp(`^(${Rn.join("|")})\\((.+)\\)$`,"i");function mu(e){let t=e.match(du);if(!t)return;let[,r,n]=t,o=oi(`${r} ${n}`);if(o){let{alpha:i,components:[s,...a]}=o;return{type:s,components:a,alpha:i}}}function gu(e){let t=e.match(/^color\((.+)\)$/);if(!t)return;let r=oi(t[1]);if(r){let{alpha:n,components:[o,...i]}=r;return{type:o,components:i,alpha:n}}}function oi(e){let t=Ee(e," ");if(!t)return;let r=t.length;if(t[r-2]==="/")return{components:t.slice(0,r-2),alpha:t[r-1]};if(t[r-2]!=null&&(t[r-2].endsWith("/")||t[r-1].startsWith("/"))){let i=t.splice(r-2);t.push(i.join(" ")),--r}let n=Ee(t[r-1],"/",2);if(!n)return;if(n.length===1||n[n.length-1]==="")return{components:t};let o=n.pop();return t[r-1]=n.join("/"),{components:t,alpha:o}}var ii="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",ci=new Uint8Array(64),hu=new Uint8Array(128);for(let e=0;e<ii.length;e++){let t=ii.charCodeAt(e);ci[e]=t,hu[t]=e}function et(e,t,r){let n=t-r;n=n<0?-n<<1|1:n<<1;do{let o=n&31;n>>>=5,n>0&&(o|=32),e.write(ci[o])}while(n>0);return t}var si=1024*16,ai=typeof TextDecoder<"u"?new TextDecoder:typeof Buffer<"u"?{decode(e){return Buffer.from(e.buffer,e.byteOffset,e.byteLength).toString()}}:{decode(e){let t="";for(let r=0;r<e.length;r++)t+=String.fromCharCode(e[r]);return t}},En=class{constructor(){this.pos=0,this.out="",this.buffer=new Uint8Array(si)}write(t){let{buffer:r}=this;r[this.pos++]=t,this.pos===si&&(this.out+=ai.decode(r),this.pos=0)}flush(){let{buffer:t,out:r,pos:n}=this;return n>0?r+ai.decode(t.subarray(0,n)):r}};function li(e){let t=new En,r=0,n=0,o=0,i=0;for(let s=0;s<e.length;s++){let a=e[s];if(s>0&&t.write(59),a.length===0)continue;let c=0;for(let l=0;l<a.length;l++){let u=a[l];l>0&&t.write(44),c=et(t,u[0],c),u.length!==1&&(r=et(t,u[1],r),n=et(t,u[2],n),o=et(t,u[3],o),u.length!==4&&(i=et(t,u[4],i)))}}return t.flush()}var Jt=class e{constructor(t){this.bits=t instanceof e?t.bits.slice():[]}add(t){this.bits[t>>5]|=1<<(t&31)}has(t){return!!(this.bits[t>>5]&1<<(t&31))}},Qt=class e{constructor(t,r,n){this.start=t,this.end=r,this.original=n,this.intro="",this.outro="",this.content=n,this.storeName=!1,this.edited=!1,this.previous=null,this.next=null}appendLeft(t){this.outro+=t}appendRight(t){this.intro=this.intro+t}clone(){let t=new e(this.start,this.end,this.original);return t.intro=this.intro,t.outro=this.outro,t.content=this.content,t.storeName=this.storeName,t.edited=this.edited,t}contains(t){return this.start<t&&t<this.end}eachNext(t){let r=this;for(;r;)t(r),r=r.next}eachPrevious(t){let r=this;for(;r;)t(r),r=r.previous}edit(t,r,n){return this.content=t,n||(this.intro="",this.outro=""),this.storeName=r,this.edited=!0,this}prependLeft(t){this.outro=t+this.outro}prependRight(t){this.intro=t+this.intro}reset(){this.intro="",this.outro="",this.edited&&(this.content=this.original,this.storeName=!1,this.edited=!1)}split(t){let r=t-this.start,n=this.original.slice(0,r),o=this.original.slice(r);this.original=n;let i=new e(t,this.end,o);return i.outro=this.outro,this.outro="",this.end=t,this.edited?(i.edit("",!1),this.content=""):this.content=n,i.next=this.next,i.next&&(i.next.previous=i),i.previous=this,this.next=i,i}toString(){return this.intro+this.content+this.outro}trimEnd(t){if(this.outro=this.outro.replace(t,""),this.outro.length)return!0;let r=this.content.replace(t,"");if(r.length)return r!==this.content&&(this.split(this.start+r.length).edit("",void 0,!0),this.edited&&this.edit(r,this.storeName,!0)),!0;if(this.edit("",void 0,!0),this.intro=this.intro.replace(t,""),this.intro.length)return!0}trimStart(t){if(this.intro=this.intro.replace(t,""),this.intro.length)return!0;let r=this.content.replace(t,"");if(r.length){if(r!==this.content){let n=this.split(this.end-r.length);this.edited&&n.edit(r,this.storeName,!0),this.edit("",void 0,!0)}return!0}else if(this.edit("",void 0,!0),this.outro=this.outro.replace(t,""),this.outro.length)return!0}};function bu(){return typeof globalThis<"u"&&typeof globalThis.btoa=="function"?e=>globalThis.btoa(unescape(encodeURIComponent(e))):typeof Buffer=="function"?e=>Buffer.from(e,"utf-8").toString("base64"):()=>{throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.")}}var xu=bu(),Tn=class{constructor(t){this.version=3,this.file=t.file,this.sources=t.sources,this.sourcesContent=t.sourcesContent,this.names=t.names,this.mappings=li(t.mappings),typeof t.x_google_ignoreList<"u"&&(this.x_google_ignoreList=t.x_google_ignoreList),typeof t.debugId<"u"&&(this.debugId=t.debugId)}toString(){return JSON.stringify(this)}toUrl(){return"data:application/json;charset=utf-8;base64,"+xu(this.toString())}};function yu(e){let t=e.split(`
`),r=t.filter(i=>/^\t+/.test(i)),n=t.filter(i=>/^ {2,}/.test(i));if(r.length===0&&n.length===0)return null;if(r.length>=n.length)return"	";let o=n.reduce((i,s)=>{let a=/^ +/.exec(s)[0].length;return Math.min(a,i)},1/0);return new Array(o+1).join(" ")}function vu(e,t){let r=e.split(/[/\\]/),n=t.split(/[/\\]/);for(r.pop();r[0]===n[0];)r.shift(),n.shift();if(r.length){let o=r.length;for(;o--;)r[o]=".."}return r.concat(n).join("/")}var $u=Object.prototype.toString;function wu(e){return $u.call(e)==="[object Object]"}function fi(e){let t=e.split(`
`),r=[];for(let n=0,o=0;n<t.length;n++)r.push(o),o+=t[n].length+1;return function(o){let i=0,s=r.length;for(;i<s;){let l=i+s>>1;o<r[l]?s=l:i=l+1}let a=i-1,c=o-r[a];return{line:a,column:c}}}var ku=/\w/,jn=class{constructor(t){this.hires=t,this.generatedCodeLine=0,this.generatedCodeColumn=0,this.raw=[],this.rawSegments=this.raw[this.generatedCodeLine]=[],this.pending=null}addEdit(t,r,n,o){if(r.length){let i=r.length-1,s=r.indexOf(`
`,0),a=-1;for(;s>=0&&i>s;){let l=[this.generatedCodeColumn,t,n.line,n.column];o>=0&&l.push(o),this.rawSegments.push(l),this.generatedCodeLine+=1,this.raw[this.generatedCodeLine]=this.rawSegments=[],this.generatedCodeColumn=0,a=s,s=r.indexOf(`
`,s+1)}let c=[this.generatedCodeColumn,t,n.line,n.column];o>=0&&c.push(o),this.rawSegments.push(c),this.advance(r.slice(a+1))}else this.pending&&(this.rawSegments.push(this.pending),this.advance(r));this.pending=null}addUneditedChunk(t,r,n,o,i){let s=r.start,a=!0,c=!1;for(;s<r.end;){if(n[s]===`
`)o.line+=1,o.column=0,this.generatedCodeLine+=1,this.raw[this.generatedCodeLine]=this.rawSegments=[],this.generatedCodeColumn=0,a=!0,c=!1;else{if(this.hires||a||i.has(s)){let l=[this.generatedCodeColumn,t,o.line,o.column];this.hires==="boundary"?ku.test(n[s])?c||(this.rawSegments.push(l),c=!0):(this.rawSegments.push(l),c=!1):this.rawSegments.push(l)}o.column+=1,this.generatedCodeColumn+=1,a=!1}s+=1}this.pending=null}advance(t){if(!t)return;let r=t.split(`
`);if(r.length>1){for(let n=0;n<r.length-1;n++)this.generatedCodeLine++,this.raw[this.generatedCodeLine]=this.rawSegments=[];this.generatedCodeColumn=0}this.generatedCodeColumn+=r[r.length-1].length}},tt=`
`,We={insertLeft:!1,insertRight:!1,storeName:!1},er=class e{constructor(t,r={}){let n=new Qt(0,t.length,t);Object.defineProperties(this,{original:{writable:!0,value:t},outro:{writable:!0,value:""},intro:{writable:!0,value:""},firstChunk:{writable:!0,value:n},lastChunk:{writable:!0,value:n},lastSearchedChunk:{writable:!0,value:n},byStart:{writable:!0,value:{}},byEnd:{writable:!0,value:{}},filename:{writable:!0,value:r.filename},indentExclusionRanges:{writable:!0,value:r.indentExclusionRanges},sourcemapLocations:{writable:!0,value:new Jt},storedNames:{writable:!0,value:{}},indentStr:{writable:!0,value:void 0},ignoreList:{writable:!0,value:r.ignoreList},offset:{writable:!0,value:r.offset||0}}),this.byStart[0]=n,this.byEnd[t.length]=n}addSourcemapLocation(t){this.sourcemapLocations.add(t)}append(t){if(typeof t!="string")throw new TypeError("outro content must be a string");return this.outro+=t,this}appendLeft(t,r){if(t=t+this.offset,typeof r!="string")throw new TypeError("inserted content must be a string");this._split(t);let n=this.byEnd[t];return n?n.appendLeft(r):this.intro+=r,this}appendRight(t,r){if(t=t+this.offset,typeof r!="string")throw new TypeError("inserted content must be a string");this._split(t);let n=this.byStart[t];return n?n.appendRight(r):this.outro+=r,this}clone(){let t=new e(this.original,{filename:this.filename,offset:this.offset}),r=this.firstChunk,n=t.firstChunk=t.lastSearchedChunk=r.clone();for(;r;){t.byStart[n.start]=n,t.byEnd[n.end]=n;let o=r.next,i=o&&o.clone();i&&(n.next=i,i.previous=n,n=i),r=o}return t.lastChunk=n,this.indentExclusionRanges&&(t.indentExclusionRanges=this.indentExclusionRanges.slice()),t.sourcemapLocations=new Jt(this.sourcemapLocations),t.intro=this.intro,t.outro=this.outro,t}generateDecodedMap(t){t=t||{};let r=0,n=Object.keys(this.storedNames),o=new jn(t.hires),i=fi(this.original);return this.intro&&o.advance(this.intro),this.firstChunk.eachNext(s=>{let a=i(s.start);s.intro.length&&o.advance(s.intro),s.edited?o.addEdit(r,s.content,a,s.storeName?n.indexOf(s.original):-1):o.addUneditedChunk(r,s,this.original,a,this.sourcemapLocations),s.outro.length&&o.advance(s.outro)}),{file:t.file?t.file.split(/[/\\]/).pop():void 0,sources:[t.source?vu(t.file||"",t.source):t.file||""],sourcesContent:t.includeContent?[this.original]:void 0,names:n,mappings:o.raw,x_google_ignoreList:this.ignoreList?[r]:void 0}}generateMap(t){return new Tn(this.generateDecodedMap(t))}_ensureindentStr(){this.indentStr===void 0&&(this.indentStr=yu(this.original))}_getRawIndentString(){return this._ensureindentStr(),this.indentStr}getIndentString(){return this._ensureindentStr(),this.indentStr===null?"	":this.indentStr}indent(t,r){let n=/^[^\r\n]/gm;if(wu(t)&&(r=t,t=void 0),t===void 0&&(this._ensureindentStr(),t=this.indentStr||"	"),t==="")return this;r=r||{};let o={};r.exclude&&(typeof r.exclude[0]=="number"?[r.exclude]:r.exclude).forEach(u=>{for(let d=u[0];d<u[1];d+=1)o[d]=!0});let i=r.indentStart!==!1,s=l=>i?`${t}${l}`:(i=!0,l);this.intro=this.intro.replace(n,s);let a=0,c=this.firstChunk;for(;c;){let l=c.end;if(c.edited)o[a]||(c.content=c.content.replace(n,s),c.content.length&&(i=c.content[c.content.length-1]===`
`));else for(a=c.start;a<l;){if(!o[a]){let u=this.original[a];u===`
`?i=!0:u!=="\r"&&i&&(i=!1,a===c.start||(this._splitChunk(c,a),c=c.next),c.prependRight(t))}a+=1}a=c.end,c=c.next}return this.outro=this.outro.replace(n,s),this}insert(){throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)")}insertLeft(t,r){return We.insertLeft||(console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"),We.insertLeft=!0),this.appendLeft(t,r)}insertRight(t,r){return We.insertRight||(console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"),We.insertRight=!0),this.prependRight(t,r)}move(t,r,n){if(t=t+this.offset,r=r+this.offset,n=n+this.offset,n>=t&&n<=r)throw new Error("Cannot move a selection inside itself");this._split(t),this._split(r),this._split(n);let o=this.byStart[t],i=this.byEnd[r],s=o.previous,a=i.next,c=this.byStart[n];if(!c&&i===this.lastChunk)return this;let l=c?c.previous:this.lastChunk;return s&&(s.next=a),a&&(a.previous=s),l&&(l.next=o),c&&(c.previous=i),o.previous||(this.firstChunk=i.next),i.next||(this.lastChunk=o.previous,this.lastChunk.next=null),o.previous=l,i.next=c||null,l||(this.firstChunk=o),c||(this.lastChunk=i),this}overwrite(t,r,n,o){return o=o||{},this.update(t,r,n,{...o,overwrite:!o.contentOnly})}update(t,r,n,o){if(t=t+this.offset,r=r+this.offset,typeof n!="string")throw new TypeError("replacement content must be a string");if(this.original.length!==0){for(;t<0;)t+=this.original.length;for(;r<0;)r+=this.original.length}if(r>this.original.length)throw new Error("end is out of bounds");if(t===r)throw new Error("Cannot overwrite a zero-length range \u2013 use appendLeft or prependRight instead");this._split(t),this._split(r),o===!0&&(We.storeName||(console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"),We.storeName=!0),o={storeName:!0});let i=o!==void 0?o.storeName:!1,s=o!==void 0?o.overwrite:!1;if(i){let l=this.original.slice(t,r);Object.defineProperty(this.storedNames,l,{writable:!0,value:!0,enumerable:!0})}let a=this.byStart[t],c=this.byEnd[r];if(a){let l=a;for(;l!==c;){if(l.next!==this.byStart[l.end])throw new Error("Cannot overwrite across a split point");l=l.next,l.edit("",!1)}a.edit(n,i,!s)}else{let l=new Qt(t,r,"").edit(n,i);c.next=l,l.previous=c}return this}prepend(t){if(typeof t!="string")throw new TypeError("outro content must be a string");return this.intro=t+this.intro,this}prependLeft(t,r){if(t=t+this.offset,typeof r!="string")throw new TypeError("inserted content must be a string");this._split(t);let n=this.byEnd[t];return n?n.prependLeft(r):this.intro=r+this.intro,this}prependRight(t,r){if(t=t+this.offset,typeof r!="string")throw new TypeError("inserted content must be a string");this._split(t);let n=this.byStart[t];return n?n.prependRight(r):this.outro=r+this.outro,this}remove(t,r){if(t=t+this.offset,r=r+this.offset,this.original.length!==0){for(;t<0;)t+=this.original.length;for(;r<0;)r+=this.original.length}if(t===r)return this;if(t<0||r>this.original.length)throw new Error("Character is out of bounds");if(t>r)throw new Error("end must be greater than start");this._split(t),this._split(r);let n=this.byStart[t];for(;n;)n.intro="",n.outro="",n.edit(""),n=r>n.end?this.byStart[n.end]:null;return this}reset(t,r){if(t=t+this.offset,r=r+this.offset,this.original.length!==0){for(;t<0;)t+=this.original.length;for(;r<0;)r+=this.original.length}if(t===r)return this;if(t<0||r>this.original.length)throw new Error("Character is out of bounds");if(t>r)throw new Error("end must be greater than start");this._split(t),this._split(r);let n=this.byStart[t];for(;n;)n.reset(),n=r>n.end?this.byStart[n.end]:null;return this}lastChar(){if(this.outro.length)return this.outro[this.outro.length-1];let t=this.lastChunk;do{if(t.outro.length)return t.outro[t.outro.length-1];if(t.content.length)return t.content[t.content.length-1];if(t.intro.length)return t.intro[t.intro.length-1]}while(t=t.previous);return this.intro.length?this.intro[this.intro.length-1]:""}lastLine(){let t=this.outro.lastIndexOf(tt);if(t!==-1)return this.outro.substr(t+1);let r=this.outro,n=this.lastChunk;do{if(n.outro.length>0){if(t=n.outro.lastIndexOf(tt),t!==-1)return n.outro.substr(t+1)+r;r=n.outro+r}if(n.content.length>0){if(t=n.content.lastIndexOf(tt),t!==-1)return n.content.substr(t+1)+r;r=n.content+r}if(n.intro.length>0){if(t=n.intro.lastIndexOf(tt),t!==-1)return n.intro.substr(t+1)+r;r=n.intro+r}}while(n=n.previous);return t=this.intro.lastIndexOf(tt),t!==-1?this.intro.substr(t+1)+r:this.intro+r}slice(t=0,r=this.original.length-this.offset){if(t=t+this.offset,r=r+this.offset,this.original.length!==0){for(;t<0;)t+=this.original.length;for(;r<0;)r+=this.original.length}let n="",o=this.firstChunk;for(;o&&(o.start>t||o.end<=t);){if(o.start<r&&o.end>=r)return n;o=o.next}if(o&&o.edited&&o.start!==t)throw new Error(`Cannot use replaced character ${t} as slice start anchor.`);let i=o;for(;o;){o.intro&&(i!==o||o.start===t)&&(n+=o.intro);let s=o.start<r&&o.end>=r;if(s&&o.edited&&o.end!==r)throw new Error(`Cannot use replaced character ${r} as slice end anchor.`);let a=i===o?t-o.start:0,c=s?o.content.length+r-o.end:o.content.length;if(n+=o.content.slice(a,c),o.outro&&(!s||o.end===r)&&(n+=o.outro),s)break;o=o.next}return n}snip(t,r){let n=this.clone();return n.remove(0,t),n.remove(r,n.original.length),n}_split(t){if(this.byStart[t]||this.byEnd[t])return;let r=this.lastSearchedChunk,n=t>r.end;for(;r;){if(r.contains(t))return this._splitChunk(r,t);r=n?this.byStart[r.end]:this.byEnd[r.start]}}_splitChunk(t,r){if(t.edited&&t.content.length){let o=fi(this.original)(r);throw new Error(`Cannot split a chunk that has already been edited (${o.line}:${o.column} \u2013 "${t.original}")`)}let n=t.split(r);return this.byEnd[r]=t,this.byStart[r]=n,this.byEnd[n.end]=n,t===this.lastChunk&&(this.lastChunk=n),this.lastSearchedChunk=t,!0}toString(){let t=this.intro,r=this.firstChunk;for(;r;)t+=r.toString(),r=r.next;return t+this.outro}isEmpty(){let t=this.firstChunk;do if(t.intro.length&&t.intro.trim()||t.content.length&&t.content.trim()||t.outro.length&&t.outro.trim())return!1;while(t=t.next);return!0}length(){let t=this.firstChunk,r=0;do r+=t.intro.length+t.content.length+t.outro.length;while(t=t.next);return r}trimLines(){return this.trim("[\\r\\n]")}trim(t){return this.trimStart(t).trimEnd(t)}trimEndAborted(t){let r=new RegExp((t||"\\s")+"+$");if(this.outro=this.outro.replace(r,""),this.outro.length)return!0;let n=this.lastChunk;do{let o=n.end,i=n.trimEnd(r);if(n.end!==o&&(this.lastChunk===n&&(this.lastChunk=n.next),this.byEnd[n.end]=n,this.byStart[n.next.start]=n.next,this.byEnd[n.next.end]=n.next),i)return!0;n=n.previous}while(n);return!1}trimEnd(t){return this.trimEndAborted(t),this}trimStartAborted(t){let r=new RegExp("^"+(t||"\\s")+"+");if(this.intro=this.intro.replace(r,""),this.intro.length)return!0;let n=this.firstChunk;do{let o=n.end,i=n.trimStart(r);if(n.end!==o&&(n===this.lastChunk&&(this.lastChunk=n.next),this.byEnd[n.end]=n,this.byStart[n.next.start]=n.next,this.byEnd[n.next.end]=n.next),i)return!0;n=n.next}while(n);return!1}trimStart(t){return this.trimStartAborted(t),this}hasChanged(){return this.original!==this.toString()}_replaceRegexp(t,r){function n(i,s){return typeof r=="string"?r.replace(/\$(\$|&|\d+)/g,(a,c)=>c==="$"?"$":c==="&"?i[0]:+c<i.length?i[+c]:`$${c}`):r(...i,i.index,s,i.groups)}function o(i,s){let a,c=[];for(;a=i.exec(s);)c.push(a);return c}if(t.global)o(t,this.original).forEach(s=>{if(s.index!=null){let a=n(s,this.original);a!==s[0]&&this.overwrite(s.index,s.index+s[0].length,a)}});else{let i=this.original.match(t);if(i&&i.index!=null){let s=n(i,this.original);s!==i[0]&&this.overwrite(i.index,i.index+i[0].length,s)}}return this}_replaceString(t,r){let{original:n}=this,o=n.indexOf(t);return o!==-1&&this.overwrite(o,o+t.length,r),this}replace(t,r){return typeof t=="string"?this._replaceString(t,r):this._replaceRegexp(t,r)}_replaceAllString(t,r){let{original:n}=this,o=t.length;for(let i=n.indexOf(t);i!==-1;i=n.indexOf(t,i+o))n.slice(i,i+o)!==r&&this.overwrite(i,i+o,r);return this}replaceAll(t,r){if(typeof t=="string")return this._replaceAllString(t,r);if(!t.global)throw new TypeError("MagicString.prototype.replaceAll called with a non-global RegExp argument");return this._replaceRegexp(t,r)}};var Su=/theme\(\s*(['"])?(.*?)\1?\s*\)/g;function tr(e){return e.includes("theme(")&&e.includes(")")}function rr(e,t,r=!0){let n=Array.from(e.toString().matchAll(Su));if(!n.length)return e;let o=new er(e);for(let i of n){let s=i[2];if(!s)throw new Error("theme() expect exact one argument, but got 0");let a=Cu(s,t,r);a&&o.overwrite(i.index,i.index+i[0].length,a)}return o.toString()}function Cu(e,t,r=!0){let[n,o]=e.split("/"),s=n.trim().split(".").reduce((a,c)=>a?.[c],t);if(typeof s=="object"&&(s=s.DEFAULT),typeof s=="string"){if(o){let a=Y(s);a&&(s=j(a,o))}return s}else if(r)throw new Error(`theme of "${e}" did not found`)}function Ue(e){let t=e.match(/^-?\d+\.?\d*/)?.[0]||"",r=e.slice(t.length);if(r==="px"){let n=Number.parseFloat(t)-.1;return Number.isNaN(n)?e:`${n}${r}`}return`calc(${e} - 0.1px)`}function nr(e){let t=function(n){let o=this.__options?.sequence||[];this.__options.sequence=[];for(let i of o){let s=e[i](n);if(s!=null)return s}};function r(n,o){return n.__options||(n.__options={sequence:[]}),n.__options.sequence.push(o),n}for(let n of Object.keys(e))Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get(){return r(this,n)}});return t}var mi="__pseudo_placeholder__",Be=Object.fromEntries([["first-letter","::first-letter"],["first-line","::first-line"],"any-link","link","visited","target",["open","[open]"],"default","checked","indeterminate","placeholder-shown","autofill","optional","required","valid","invalid","user-valid","user-invalid","in-range","out-of-range","read-only","read-write","empty","focus-within","hover","focus","focus-visible","active","enabled","disabled","popover-open","root","empty",["even-of-type",":nth-of-type(even)"],["even",":nth-child(even)"],["odd-of-type",":nth-of-type(odd)"],["odd",":nth-child(odd)"],["nth",`:nth-child(${mi})`],"first-of-type",["first",":first-child"],"last-of-type",["last",":last-child"],"only-child","only-of-type",["backdrop-element","::backdrop"],["placeholder","::placeholder"],["before","::before"],["after","::after"],["file","::file-selector-button"]].map(e=>Array.isArray(e)?e:[e,`:${e}`])),gi=Object.keys(Be),Ie=Object.fromEntries([["backdrop","::backdrop"]].map(e=>Array.isArray(e)?e:[e,`:${e}`])),hi=Object.keys(Ie),Ru=["not","is","where","has"],bi=Object.fromEntries([["selection",["::selection"," *::selection"]],["marker",["::marker"," *::marker"]]]),zn=Object.entries(Be).filter(([,e])=>!e.startsWith("::")).map(([e])=>e).sort((e,t)=>t.length-e.length).join("|"),An=Object.entries(Ie).filter(([,e])=>!e.startsWith("::")).map(([e])=>e).sort((e,t)=>t.length-e.length).join("|"),Pe=Ru.join("|"),ui=Object.keys(bi).sort((e,t)=>t.length-e.length).join("|"),Eu=["::-webkit-resizer","::-webkit-scrollbar","::-webkit-scrollbar-button","::-webkit-scrollbar-corner","::-webkit-scrollbar-thumb","::-webkit-scrollbar-track","::-webkit-scrollbar-track-piece","::file-selector-button"],pi=Object.entries(Be).map(([e])=>e).sort((e,t)=>t.length-e.length).join("|"),di=Object.entries(Ie).map(([e])=>e).sort((e,t)=>t.length-e.length).join("|");function Tu(e,t,r,n){let{h:o,variantGetBracket:i}=n,s=new RegExp(`^(${K(t)}:)(\\S+)${K(r)}\\1`),a,c,l,u,d=g=>{let x=i(`${e}-`,g,[]);if(!x)return;let[k,C]=x,v=o.bracket(k);if(v==null)return;let b=C.split(a,1)?.[0]??"",z=`${t}${J(b)}`;return[b,g.slice(g.length-(C.length-b.length-1)),v.includes("&")?v.replace(/&/g,z):`${z}${v}`]},h=g=>{let x=g.match(c)||g.match(l);if(!x)return;let[k,C,v]=x,b=x[3]??"",z=Be[v]||Ie[v]||`:${v}`;return C&&(z=`:${C}(${z})`),[b,g.slice(k.length),`${t}${J(b)}${z}`,v]},m=g=>{let x=g.match(u);if(!x)return;let[k,C,v]=x,b=x[3]??"",z=`:${C}(${v})`;return[b,g.slice(k.length),`${t}${J(b)}${z}`]};return{name:`pseudo:${e}`,match(g,x){if(a&&c&&l||(a=new RegExp(`(?:${x.generator.config.separators.join("|")})`),c=new RegExp(`^${e}-(?:(?:(${Pe})-)?(${zn}))(?:(/[\\w-]+))?(?:${x.generator.config.separators.join("|")})`),l=new RegExp(`^${e}-(?:(?:(${Pe})-)?(${An}))(?:(/[\\w-]+))?(?:${x.generator.config.separators.filter(y=>y!=="-").join("|")})`),u=new RegExp(`^${e}-(?:(${Pe})-)?\\[(.+)\\](?:(/[\\w-]+))?(?:${x.generator.config.separators.filter(y=>y!=="-").join("|")})`)),!g.startsWith(e))return;let k=d(g)||h(g)||m(g);if(!k)return;let[C,v,b,z=""]=k;return{matcher:v,handle:(y,P)=>P({...y,prefix:`${b}${r}${y.prefix}`.replace(s,"$1$2:"),sort:gi.indexOf(z)??hi.indexOf(z)})}},multiPass:!0}}function or(e){let{h:t}=e,r,n,o;return[{name:"pseudo",match(i,s){r&&n||(r=new RegExp(`^(${pi})(?:-(\\d+|\\[\\w+\\]))?(?:${s.generator.config.separators.join("|")})`),n=new RegExp(`^(${di})(?:${s.generator.config.separators.filter(c=>c!=="-").join("|")})`));let a=i.match(r)||i.match(n);if(a){let c=Be[a[1]]||Ie[a[1]]||`:${a[1]}`;if(a[2]){let u;a[2].startsWith("[")&&a[2].endsWith("]")?u=t.bracket(a[2]):u=a[2],u&&(c=c.replace(mi,u))}let l=gi.indexOf(a[1]);return l===-1&&(l=hi.indexOf(a[1])),l===-1&&(l=void 0),{matcher:i.slice(a[0].length),handle:(u,d)=>{let h=c.includes("::")&&!Eu.includes(c)?{pseudo:`${u.pseudo}${c}`}:{selector:`${u.selector}${c}`};return d({...u,...h,sort:l,noMerge:!0})}}}},multiPass:!0,autocomplete:`(${pi}|${di}):`},{name:"pseudo:multi",match(i,s){o||(o=new RegExp(`^(${ui})(?:${s.generator.config.separators.join("|")})`));let a=i.match(o);if(a)return bi[a[1]].map(l=>({matcher:i.slice(a[0].length),handle:(u,d)=>d({...u,pseudo:`${u.pseudo}${l}`})}))},multiPass:!1,autocomplete:`(${ui}):`}]}function ir(e){let{getBracket:t,h:r}=e,n,o,i;return{match(s,a){n&&o||(n=new RegExp(`^(${Pe})-(${zn})(?:${a.generator.config.separators.join("|")})`),o=new RegExp(`^(${Pe})-(${An})(?:${a.generator.config.separators.filter(l=>l!=="-").join("|")})`),i=new RegExp(`^(${Pe})-(\\[.+\\])(?:${a.generator.config.separators.filter(l=>l!=="-").join("|")})`));let c=s.match(n)||s.match(o)||s.match(i);if(c){let l=c[1],d=t(c[2],"[","]")?r.bracket(c[2]):Be[c[2]]||Ie[c[2]]||`:${c[2]}`;return{matcher:s.slice(c[0].length),selector:h=>`${h}:${l}(${d})`}}},multiPass:!0,autocomplete:`(${Pe})-(${zn}|${An}):`}}function sr(e,t){let r=!!e?.attributifyPseudo,n=e?.prefix??"";n=(Array.isArray(n)?n:[n]).filter(Boolean)[0]??"";let o=(i,s)=>Tu(i,r?`[${n}${i}=""]`:`.${n}${i}`,s,t);return[o("group"," "),o("peer","~"),o("parent",">"),o("previous","+")]}var ju=/(part-\[(.+)\]:)(.+)/;function ar(){return{match(e){let t=e.match(ju);if(t){let r=`part(${t[2]})`;return{matcher:e.slice(t[1].length),selector:n=>`${n}::${r}`}}},multiPass:!0}}function N(e,t,r={}){let n;return{name:e,match(o,i){n||(n=new RegExp(`^${K(e)}(?:${i.generator.config.separators.join("|")})`));let s=o.match(n);if(s){let a=o.slice(s[0].length),c=S(t).map(l=>({matcher:a,handle:(u,d)=>d({...u,...l(u)}),...r}));return c.length===1?c[0]:c}},autocomplete:`${e}:`}}function G(e,t){let r;return{name:e,match(n,o){r||(r=new RegExp(`^${K(e)}(?:${o.generator.config.separators.join("|")})`));let i=n.match(r);if(i)return{matcher:n.slice(i[0].length),handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}${t}`})}},autocomplete:`${e}:`}}function X(e,t,r){if(t.startsWith(`${e}[`)){let[n,o]=re(t.slice(e.length),"[","]")??[];if(n&&o){for(let i of r)if(o.startsWith(i))return[n,o.slice(i.length),i];return[n,o,""]}}}function A(e,t,r){for(let n of S(e))if(t.startsWith(n)){let o=X(n,t,r);if(o){let[i="",s=o[1]]=A("/",o[1],r)??[];return[o[0],s,i]}for(let i of r.filter(s=>s!=="/")){let s=t.indexOf(i,n.length);if(s!==-1){let a=t.indexOf("/",n.length),c=a===-1||s<=a;return[t.slice(n.length,c?s:a),t.slice(s+i.length),c?"":t.slice(a+1,s)]}}}}var _n={};Lf(_n,{auto:()=>Pu,bracket:()=>Lu,bracketOfColor:()=>Wu,bracketOfLength:()=>Uu,bracketOfPosition:()=>Bu,cssvar:()=>Iu,degree:()=>Nu,fraction:()=>_u,global:()=>Ku,number:()=>Mu,numberWithUnit:()=>Au,percent:()=>Fu,position:()=>Hu,properties:()=>Gu,px:()=>Vu,rem:()=>Ou,time:()=>Du});var ne={l:["-left"],r:["-right"],t:["-top"],b:["-bottom"],s:["-inline-start"],e:["-inline-end"],x:["-left","-right"],y:["-top","-bottom"],"":[""],bs:["-block-start"],be:["-block-end"],is:["-inline-start"],ie:["-inline-end"],block:["-block-start","-block-end"],inline:["-inline-start","-inline-end"]},Pn={...ne,s:["-inset-inline-start"],start:["-inset-inline-start"],e:["-inset-inline-end"],end:["-inset-inline-end"],bs:["-inset-block-start"],be:["-inset-block-end"],is:["-inset-inline-start"],ie:["-inset-inline-end"],block:["-inset-block-start","-inset-block-end"],inline:["-inset-inline-start","-inset-inline-end"]},On={l:["-top-left","-bottom-left"],r:["-top-right","-bottom-right"],t:["-top-left","-top-right"],b:["-bottom-left","-bottom-right"],tl:["-top-left"],lt:["-top-left"],tr:["-top-right"],rt:["-top-right"],bl:["-bottom-left"],lb:["-bottom-left"],br:["-bottom-right"],rb:["-bottom-right"],"":[""],bs:["-start-start","-start-end"],be:["-end-start","-end-end"],s:["-end-start","-start-start"],is:["-end-start","-start-start"],e:["-start-end","-end-end"],ie:["-start-end","-end-end"],ss:["-start-start"],"bs-is":["-start-start"],"is-bs":["-start-start"],se:["-start-end"],"bs-ie":["-start-end"],"ie-bs":["-start-end"],es:["-end-start"],"be-is":["-end-start"],"is-be":["-end-start"],ee:["-end-end"],"be-ie":["-end-end"],"ie-be":["-end-end"]},yi={x:["-x"],y:["-y"],z:["-z"],"":["-x","-y"]},vi=["x","y","z"],xi=["top","top center","top left","top right","bottom","bottom center","bottom left","bottom right","left","left center","left top","left bottom","right","right center","right top","right bottom","center","center top","center bottom","center left","center right","center center"],rt=Object.assign({},...xi.map(e=>({[e.replace(/ /,"-")]:e})),...xi.map(e=>({[e.replace(/\b(\w)\w+/g,"$1").replace(/ /,"")]:e}))),_=["inherit","initial","revert","revert-layer","unset"],nt=/^(calc|clamp|min|max)\s*\((.+)\)(.*)/,cr=/^(var)\s*\((.+)\)(.*)/;var De=/^(-?\d*(?:\.\d+)?)(px|pt|pc|%|r?(?:em|ex|lh|cap|ch|ic)|(?:[sld]?v|cq)(?:[whib]|min|max)|in|cm|mm|rpx)?$/i,Vn=/^(-?\d*(?:\.\d+)?)$/,Mn=/^(px|[sld]?v[wh])$/i,Fn={px:1,vw:100,vh:100,svw:100,svh:100,dvw:100,dvh:100,lvh:100,lvw:100},lr=/^\[(color|image|length|size|position|quoted|string):/i,$i=/,(?![^()]*\))/g;var zu=["color","border-color","background-color","outline-color","text-decoration-color","flex-grow","flex","flex-shrink","caret-color","font","gap","opacity","visibility","z-index","font-weight","zoom","text-shadow","transform","box-shadow","border","background-position","left","right","top","bottom","object-position","max-height","min-height","max-width","min-width","height","width","border-width","margin","padding","outline-width","outline-offset","font-size","line-height","text-indent","vertical-align","border-spacing","letter-spacing","word-spacing","stroke","filter","backdrop-filter","fill","mask","mask-size","mask-border","clip-path","clip","border-radius"];function se(e){return+e.toFixed(10)}function Au(e){let t=e.match(De);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(n&&!Number.isNaN(o))return`${se(o)}${n}`}function Pu(e){if(e==="auto"||e==="a")return"auto"}function Ou(e){if(!e)return;if(Mn.test(e))return`${Fn[e]}${e}`;let t=e.match(De);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(!Number.isNaN(o))return o===0?"0":n?`${se(o)}${n}`:`${se(o/4)}rem`}function Vu(e){if(Mn.test(e))return`${Fn[e]}${e}`;let t=e.match(De);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(!Number.isNaN(o))return n?`${se(o)}${n}`:`${se(o)}px`}function Mu(e){if(!Vn.test(e))return;let t=Number.parseFloat(e);if(!Number.isNaN(t))return se(t)}function Fu(e){if(e.endsWith("%")&&(e=e.slice(0,-1)),!Vn.test(e))return;let t=Number.parseFloat(e);if(!Number.isNaN(t))return`${se(t/100)}`}function _u(e){if(!e)return;if(e==="full")return"100%";let[t,r]=e.split("/"),n=Number.parseFloat(t)/Number.parseFloat(r);if(!Number.isNaN(n))return n===0?"0":`${se(n*100)}%`}function fr(e,t){if(e&&e.startsWith("[")&&e.endsWith("]")){let r,n,o=e.match(lr);if(o?(t||(n=o[1]),r=e.slice(o[0].length,-1)):r=e.slice(1,-1),!r||r==='=""')return;r.startsWith("--")&&(r=`var(${r})`);let i=0;for(let s of r)if(s==="[")i+=1;else if(s==="]"&&(i-=1,i<0))return;if(i)return;switch(n){case"string":return r.replace(/(^|[^\\])_/g,"$1 ").replace(/\\_/g,"_");case"quoted":return r.replace(/(^|[^\\])_/g,"$1 ").replace(/\\_/g,"_").replace(/(["\\])/g,"\\$1").replace(/^(.+)$/,'"$1"')}return r.replace(/(url\(.*?\))/g,s=>s.replace(/_/g,"\\_")).replace(/(^|[^\\])_/g,"$1 ").replace(/\\_/g,"_").replace(/(?:calc|clamp|max|min)\((.*)/g,s=>{let a=[];return s.replace(/var\((--.+?)[,)]/g,(c,l)=>(a.push(l),c.replace(l,"--un-calc"))).replace(/(-?\d*\.?\d(?!-\d.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,"$1 $2 ").replace(/--un-calc/g,()=>a.shift())})}}function Lu(e){return fr(e)}function Wu(e){return fr(e,"color")}function Uu(e){return fr(e,"length")}function Bu(e){return fr(e,"position")}function Iu(e){if(/^\$[^\s'"`;{}]/.test(e)){let[t,r]=e.slice(1).split(",");return`var(--${J(t)}${r?`, ${r}`:""})`}}function Du(e){let t=e.match(/^(-?[0-9.]+)(s|ms)?$/i);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(!Number.isNaN(o))return o===0&&!n?"0s":n?`${se(o)}${n}`:`${se(o)}ms`}function Nu(e){let t=e.match(/^(-?[0-9.]+)(deg|rad|grad|turn)?$/i);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(!Number.isNaN(o))return o===0?"0":n?`${se(o)}${n}`:`${se(o)}deg`}function Ku(e){if(_.includes(e))return e}function Gu(e){if(e.split(",").every(t=>zu.includes(t)))return e}function Hu(e){if(["top","left","right","bottom","center"].includes(e))return e}var qu=nr(_n),p=qu;var wi={mid:"middle",base:"baseline",btm:"bottom",baseline:"baseline",top:"top",start:"top",middle:"middle",bottom:"bottom",end:"bottom","text-top":"text-top","text-bottom":"text-bottom",sub:"sub",super:"super",...Object.fromEntries(_.map(e=>[e,e]))},Si=[[/^(?:vertical|align|v)-(.+)$/,([,e])=>({"vertical-align":wi[e]??p.bracket.cssvar.numberWithUnit(e)}),{autocomplete:[`(vertical|align|v)-(${Object.keys(wi).join("|")})`,"(vertical|align|v)-<percentage>"]}]],ki=["center","left","right","justify","start","end"],Ci=[...ki.map(e=>[`text-${e}`,{"text-align":e}]),...[..._,...ki].map(e=>[`text-align-${e}`,{"text-align":e}])];var ji="$$mini-no-negative";function oe(e){return([t,r,n],{theme:o})=>{let i=o.spacing?.[n||"DEFAULT"]??p.bracket.cssvar.global.auto.fraction.rem(n);if(i!=null)return ne[r].map(s=>[`${e}${s}`,i]);if(n?.startsWith("-")){let s=o.spacing?.[n.slice(1)];if(s!=null)return ne[r].map(a=>[`${e}${a}`,`calc(${s} * -1)`])}}}function Ri(e,t,r="colors"){let n=e[r],o=-1;for(let i of t){if(o+=1,n&&typeof n!="string"){let s=t.slice(o).join("-").replace(/(-[a-z])/g,a=>a.slice(1).toUpperCase());if(n[s])return n[s];if(n[i]){n=n[i];continue}}return}return n}function Ei(e,t,r){return Ri(e,t,r)||Ri(e,t,"colors")}function Wn(e,t){let[r,n]=pe(e,"[","]",["/",":"])??[];if(r!=null){let o=(r.match(lr)??[])[1];if(o==null||o===t)return[r,n]}}function ur(e,t,r){let n=Wn(e,"color");if(!n)return;let[o,i]=n,s=o.replace(/([a-z])(\d)/g,"$1-$2").split(/-/g),[a]=s;if(!a)return;let c,l=p.bracketOfColor(o),u=l||o;if(p.numberWithUnit(u))return;if(/^#[\da-f]+$/i.test(u)?c=u:/^hex-[\da-fA-F]+$/.test(u)?c=`#${u.slice(4)}`:o.startsWith("$")&&(c=p.cssvar(o)),c=c||l,!c){let h=Ei(t,[o],r);typeof h=="string"&&(c=h)}let d="DEFAULT";if(!c){let h=s,m,[g]=s.slice(-1);/^\d+$/.test(g)&&(d=m=g,h=s.slice(0,-1));let x=Ei(t,h,r);typeof x=="object"?c=x[m??d]:typeof x=="string"&&!m&&(c=x)}return{opacity:i,name:a,no:d,color:c,cssColor:Y(c),alpha:p.bracket.cssvar.percent(i??"")}}function H(e,t,r,n){return([,o],{theme:i,generator:s})=>{let a=ur(o??"",i,r);if(!a)return;let{alpha:c,color:l,cssColor:u}=a,h=s.config.envMode==="dev"&&l?` /* ${l} */`:"",m={};if(u)if(c!=null)m[e]=j(u,c)+h;else{let g=`--un-${t}-opacity`,x=j(u,`var(${g})`);x.includes(g)&&(m[g]=ie(u)),m[e]=x+h}else if(l)if(c!=null)m[e]=j(l,c)+h;else{let g=`--un-${t}-opacity`,x=j(l,`var(${g})`);x.includes(g)&&(m[g]=1),m[e]=x+h}if(n?.(m)!==!1)return m}}function pr(e,t){let r=[];e=S(e);for(let n=0;n<e.length;n++){let o=Ee(e[n]," ",6);if(!o||o.length<3)return e;let i=!1,s=o.indexOf("inset");s!==-1&&(o.splice(s,1),i=!0);let a="",c=o.at(-1);if(Y(o.at(0))){let l=Y(o.shift());l&&(a=`, ${j(l)}`)}else if(Y(c)){let l=Y(o.pop());l&&(a=`, ${j(l)}`)}else c&&cr.test(c)&&(a=`, ${o.pop()}`);r.push(`${i?"inset ":""}${o.join(" ")} var(${t}${a})`)}return r}function dr(e,t,r){return e!=null&&!!ur(e,t,r)?.color}var Ti=/[a-z]+/gi,Ln=new WeakMap;function mr({theme:e,generator:t},r="breakpoints"){let n=t?.userConfig?.theme?.[r]||e[r];if(!n)return;if(Ln.has(e))return Ln.get(e);let o=Object.entries(n).sort((i,s)=>Number.parseInt(i[1].replace(Ti,""))-Number.parseInt(s[1].replace(Ti,""))).map(([i,s])=>({point:i,size:s}));return Ln.set(e,o),o}function W(e,t){return _.map(r=>[`${e}-${r}`,{[t??e]:r}])}function ae(e){return e!=null&&nt.test(e)}function zi(e){return e[0]==="["&&e.slice(-1)==="]"&&(e=e.slice(1,-1)),nt.test(e)||De.test(e)}function gr(e,t,r){let n=t.split($i);return e||!e&&n.length===1?yi[e].map(o=>[`--un-${r}${o}`,t]):n.map((o,i)=>[`--un-${r}-${vi[i]}`,o])}var Ai=[[/^outline-(?:width-|size-)?(.+)$/,Pi,{autocomplete:"outline-(width|size)-<num>"}],[/^outline-(?:color-)?(.+)$/,Yu,{autocomplete:"outline-$colors"}],[/^outline-offset-(.+)$/,([,e],{theme:t})=>({"outline-offset":t.lineWidth?.[e]??p.bracket.cssvar.global.px(e)}),{autocomplete:"outline-(offset)-<num>"}],["outline",{"outline-style":"solid"}],...["auto","dashed","dotted","double","hidden","solid","groove","ridge","inset","outset",..._].map(e=>[`outline-${e}`,{"outline-style":e}]),["outline-none",{outline:"2px solid transparent","outline-offset":"2px"}]];function Pi([,e],{theme:t}){return{"outline-width":t.lineWidth?.[e]??p.bracket.cssvar.global.px(e)}}function Yu(e,t){return ae(p.bracket(e[1]))?Pi(e,t):H("outline-color","outline-color","borderColor")(e,t)}var Oi=[["appearance-auto",{"-webkit-appearance":"auto",appearance:"auto"}],["appearance-none",{"-webkit-appearance":"none",appearance:"none"}]];function Xu(e){return p.properties.auto.global(e)??{contents:"contents",scroll:"scroll-position"}[e]}var Vi=[[/^will-change-(.+)/,([,e])=>({"will-change":Xu(e)})]];var ct=["solid","dashed","dotted","double","hidden","none","groove","ridge","inset","outset",..._],Fi=[[/^(?:border|b)()(?:-(.+))?$/,de,{autocomplete:"(border|b)-<directions>"}],[/^(?:border|b)-([xy])(?:-(.+))?$/,de],[/^(?:border|b)-([rltbse])(?:-(.+))?$/,de],[/^(?:border|b)-(block|inline)(?:-(.+))?$/,de],[/^(?:border|b)-([bi][se])(?:-(.+))?$/,de],[/^(?:border|b)-()(?:width|size)-(.+)$/,de,{autocomplete:["(border|b)-<num>","(border|b)-<directions>-<num>"]}],[/^(?:border|b)-([xy])-(?:width|size)-(.+)$/,de],[/^(?:border|b)-([rltbse])-(?:width|size)-(.+)$/,de],[/^(?:border|b)-(block|inline)-(?:width|size)-(.+)$/,de],[/^(?:border|b)-([bi][se])-(?:width|size)-(.+)$/,de],[/^(?:border|b)-()(?:color-)?(.+)$/,ot,{autocomplete:["(border|b)-$colors","(border|b)-<directions>-$colors"]}],[/^(?:border|b)-([xy])-(?:color-)?(.+)$/,ot],[/^(?:border|b)-([rltbse])-(?:color-)?(.+)$/,ot],[/^(?:border|b)-(block|inline)-(?:color-)?(.+)$/,ot],[/^(?:border|b)-([bi][se])-(?:color-)?(.+)$/,ot],[/^(?:border|b)-()op(?:acity)?-?(.+)$/,it,{autocomplete:"(border|b)-(op|opacity)-<percent>"}],[/^(?:border|b)-([xy])-op(?:acity)?-?(.+)$/,it],[/^(?:border|b)-([rltbse])-op(?:acity)?-?(.+)$/,it],[/^(?:border|b)-(block|inline)-op(?:acity)?-?(.+)$/,it],[/^(?:border|b)-([bi][se])-op(?:acity)?-?(.+)$/,it],[/^(?:border-|b-)?(?:rounded|rd)()(?:-(.+))?$/,st,{autocomplete:["(border|b)-(rounded|rd)","(border|b)-(rounded|rd)-$borderRadius","(rounded|rd)","(rounded|rd)-$borderRadius"]}],[/^(?:border-|b-)?(?:rounded|rd)-([rltbse])(?:-(.+))?$/,st],[/^(?:border-|b-)?(?:rounded|rd)-([rltb]{2})(?:-(.+))?$/,st],[/^(?:border-|b-)?(?:rounded|rd)-([bise][se])(?:-(.+))?$/,st],[/^(?:border-|b-)?(?:rounded|rd)-([bi][se]-[bi][se])(?:-(.+))?$/,st],[/^(?:border|b)-(?:style-)?()(.+)$/,at,{autocomplete:["(border|b)-style",`(border|b)-(${ct.join("|")})`,"(border|b)-<directions>-style",`(border|b)-<directions>-(${ct.join("|")})`,`(border|b)-<directions>-style-(${ct.join("|")})`,`(border|b)-style-(${ct.join("|")})`]}],[/^(?:border|b)-([xy])-(?:style-)?(.+)$/,at],[/^(?:border|b)-([rltbse])-(?:style-)?(.+)$/,at],[/^(?:border|b)-(block|inline)-(?:style-)?(.+)$/,at],[/^(?:border|b)-([bi][se])-(?:style-)?(.+)$/,at]];function Mi(e,t,r){if(t!=null)return{[`border${r}-color`]:j(e,t)};if(r===""){let n={},o="--un-border-opacity",i=j(e,`var(${o})`);return i.includes(o)&&(n[o]=typeof e=="string"?1:ie(e)),n["border-color"]=i,n}else{let n={},o="--un-border-opacity",i=`--un-border${r}-opacity`,s=j(e,`var(${i})`);return s.includes(i)&&(n[o]=typeof e=="string"?1:ie(e),n[i]=`var(${o})`),n[`border${r}-color`]=s,n}}function Zu(e){return([,t],r)=>{let n=ur(t,r,"borderColor");if(!n)return;let{alpha:o,color:i,cssColor:s}=n;if(s)return Mi(s,o,e);if(i)return Mi(i,o,e)}}function de([,e="",t],{theme:r}){let n=r.lineWidth?.[t||"DEFAULT"]??p.bracket.cssvar.global.px(t||"1");if(e in ne&&n!=null)return ne[e].map(o=>[`border${o}-width`,n])}function ot([,e="",t],r){if(e in ne){if(ae(p.bracket(t)))return de(["",e,t],r);if(dr(t,r.theme,"borderColor"))return Object.assign({},...ne[e].map(n=>Zu(n)(["",t],r.theme)))}}function it([,e="",t]){let r=p.bracket.percent.cssvar(t);if(e in ne&&r!=null)return ne[e].map(n=>[`--un-border${n}-opacity`,r])}function st([,e="",t],{theme:r}){let n=r.borderRadius?.[t||"DEFAULT"]||p.bracket.cssvar.global.fraction.rem(t||"1");if(e in On&&n!=null)return On[e].map(o=>[`border${o}-radius`,n])}function at([,e="",t]){if(ct.includes(t)&&e in ne)return ne[e].map(r=>[`border${r}-style`,t])}var _i=[[/^op(?:acity)?-?(.+)$/,([,e])=>({opacity:p.bracket.percent.cssvar(e)})]],Ju=/^\[url\(.+\)\]$/,Qu=/^\[(?:length|size):.+\]$/,ep=/^\[position:.+\]$/,tp=/^\[(?:linear|conic|radial)-gradient\(.+\)\]$/,rp=/^\[image:.+\]$/,Li=[[/^bg-(.+)$/,(...e)=>{let t=e[0][1];if(Ju.test(t))return{"--un-url":p.bracket(t),"background-image":"var(--un-url)"};if(Qu.test(t)&&p.bracketOfLength(t)!=null)return{"background-size":p.bracketOfLength(t).split(" ").map(r=>p.fraction.auto.px.cssvar(r)??r).join(" ")};if((zi(t)||ep.test(t))&&p.bracketOfPosition(t)!=null)return{"background-position":p.bracketOfPosition(t).split(" ").map(r=>p.position.fraction.auto.px.cssvar(r)??r).join(" ")};if(tp.test(t)||rp.test(t)){let r=p.bracket(t);if(r)return{"background-image":(r.startsWith("http")?`url(${r})`:p.cssvar(r))??r}}return H("background-color","bg","backgroundColor")(...e)},{autocomplete:"bg-$colors"}],[/^bg-op(?:acity)?-?(.+)$/,([,e])=>({"--un-bg-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"bg-(op|opacity)-<percent>"}]],Wi=[[/^color-scheme-(\w+)$/,([,e])=>({"color-scheme":e})]];var Ui=[[/^@container(?:\/(\w+))?(?:-(normal|inline-size|size))?$/,([,e,t])=>({"container-type":t??"inline-size","container-name":e})]];var Bi=["solid","double","dotted","dashed","wavy",..._],Ii=[[/^(?:decoration-)?(underline|overline|line-through)$/,([,e])=>({"text-decoration-line":e}),{autocomplete:"decoration-(underline|overline|line-through)"}],[/^(?:underline|decoration)-(?:size-)?(.+)$/,Di,{autocomplete:"(underline|decoration)-<num>"}],[/^(?:underline|decoration)-(auto|from-font)$/,([,e])=>({"text-decoration-thickness":e}),{autocomplete:"(underline|decoration)-(auto|from-font)"}],[/^(?:underline|decoration)-(.+)$/,np,{autocomplete:"(underline|decoration)-$colors"}],[/^(?:underline|decoration)-op(?:acity)?-?(.+)$/,([,e])=>({"--un-line-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"(underline|decoration)-(op|opacity)-<percent>"}],[/^(?:underline|decoration)-offset-(.+)$/,([,e],{theme:t})=>({"text-underline-offset":t.lineWidth?.[e]??p.auto.bracket.cssvar.global.px(e)}),{autocomplete:"(underline|decoration)-(offset)-<num>"}],...Bi.map(e=>[`underline-${e}`,{"text-decoration-style":e}]),...Bi.map(e=>[`decoration-${e}`,{"text-decoration-style":e}]),["no-underline",{"text-decoration":"none"}],["decoration-none",{"text-decoration":"none"}]];function Di([,e],{theme:t}){return{"text-decoration-thickness":t.lineWidth?.[e]??p.bracket.cssvar.global.px(e)}}function np(e,t){if(ae(p.bracket(e[1])))return Di(e,t);let r=H("text-decoration-color","line","borderColor")(e,t);if(r)return{"-webkit-text-decoration-color":r["text-decoration-color"],...r}}var Ni=[["flex",{display:"flex"}],["inline-flex",{display:"inline-flex"}],["flex-inline",{display:"inline-flex"}],[/^flex-(.*)$/,([,e])=>({flex:p.bracket(e)!=null?p.bracket(e).split(" ").map(t=>p.cssvar.fraction(t)??t).join(" "):p.cssvar.fraction(e)})],["flex-1",{flex:"1 1 0%"}],["flex-auto",{flex:"1 1 auto"}],["flex-initial",{flex:"0 1 auto"}],["flex-none",{flex:"none"}],[/^(?:flex-)?shrink(?:-(.*))?$/,([,e=""])=>({"flex-shrink":p.bracket.cssvar.number(e)??1}),{autocomplete:["flex-shrink-<num>","shrink-<num>"]}],[/^(?:flex-)?grow(?:-(.*))?$/,([,e=""])=>({"flex-grow":p.bracket.cssvar.number(e)??1}),{autocomplete:["flex-grow-<num>","grow-<num>"]}],[/^(?:flex-)?basis-(.+)$/,([,e],{theme:t})=>({"flex-basis":t.spacing?.[e]??p.bracket.cssvar.auto.fraction.rem(e)}),{autocomplete:["flex-basis-$spacing","basis-$spacing"]}],["flex-row",{"flex-direction":"row"}],["flex-row-reverse",{"flex-direction":"row-reverse"}],["flex-col",{"flex-direction":"column"}],["flex-col-reverse",{"flex-direction":"column-reverse"}],["flex-wrap",{"flex-wrap":"wrap"}],["flex-wrap-reverse",{"flex-wrap":"wrap-reverse"}],["flex-nowrap",{"flex-wrap":"nowrap"}]];var op={"":"",x:"column-",y:"row-",col:"column-",row:"row-"};function Un([,e="",t],{theme:r}){let n=r.spacing?.[t]??p.bracket.cssvar.global.rem(t);if(n!=null)return{[`${op[e]}gap`]:n}}var Ki=[[/^(?:flex-|grid-)?gap-?()(.+)$/,Un,{autocomplete:["gap-$spacing","gap-<num>"]}],[/^(?:flex-|grid-)?gap-([xy])-?(.+)$/,Un,{autocomplete:["gap-(x|y)-$spacing","gap-(x|y)-<num>"]}],[/^(?:flex-|grid-)?gap-(col|row)-?(.+)$/,Un,{autocomplete:["gap-(col|row)-$spacing","gap-(col|row)-<num>"]}]];function he(e){return e.replace("col","column")}function Bn(e){return e[0]==="r"?"Row":"Column"}function ip(e,t,r){let n=t[`gridAuto${Bn(e)}`]?.[r];if(n!=null)return n;switch(r){case"min":return"min-content";case"max":return"max-content";case"fr":return"minmax(0,1fr)"}return p.bracket.cssvar.auto.rem(r)}var Gi=[["grid",{display:"grid"}],["inline-grid",{display:"inline-grid"}],[/^(?:grid-)?(row|col)-(.+)$/,([,e,t],{theme:r})=>({[`grid-${he(e)}`]:r[`grid${Bn(e)}`]?.[t]??p.bracket.cssvar.auto(t)})],[/^(?:grid-)?(row|col)-span-(.+)$/,([,e,t])=>{if(t==="full")return{[`grid-${he(e)}`]:"1/-1"};let r=p.bracket.number(t);if(r!=null)return{[`grid-${he(e)}`]:`span ${r}/span ${r}`}},{autocomplete:"(grid-row|grid-col|row|col)-span-<num>"}],[/^(?:grid-)?(row|col)-start-(.+)$/,([,e,t])=>({[`grid-${he(e)}-start`]:p.bracket.cssvar(t)??t})],[/^(?:grid-)?(row|col)-end-(.+)$/,([,e,t])=>({[`grid-${he(e)}-end`]:p.bracket.cssvar(t)??t}),{autocomplete:"(grid-row|grid-col|row|col)-(start|end)-<num>"}],[/^(?:grid-)?auto-(rows|cols)-(.+)$/,([,e,t],{theme:r})=>({[`grid-auto-${he(e)}`]:ip(e,r,t)}),{autocomplete:"(grid-auto|auto)-(rows|cols)-<num>"}],[/^(?:grid-auto-flow|auto-flow|grid-flow)-(.+)$/,([,e])=>({"grid-auto-flow":p.bracket.cssvar(e)})],[/^(?:grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)$/,([,e])=>({"grid-auto-flow":he(e).replace("-"," ")}),{autocomplete:["(grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)"]}],[/^(?:grid-)?(rows|cols)-(.+)$/,([,e,t],{theme:r})=>({[`grid-template-${he(e)}`]:r[`gridTemplate${Bn(e)}`]?.[t]??p.bracket.cssvar(t)})],[/^(?:grid-)?(rows|cols)-minmax-([\w.-]+)$/,([,e,t])=>({[`grid-template-${he(e)}`]:`repeat(auto-fill,minmax(${t},1fr))`})],[/^(?:grid-)?(rows|cols)-(\d+)$/,([,e,t])=>({[`grid-template-${he(e)}`]:`repeat(${t},minmax(0,1fr))`}),{autocomplete:"(grid-rows|grid-cols|rows|cols)-<num>"}],[/^grid-area(s)?-(.+)$/,([,e,t])=>e!=null?{"grid-template-areas":p.cssvar(t)??t.split("-").map(r=>`"${p.bracket(r)}"`).join(" ")}:{"grid-area":p.bracket.cssvar(t)}],["grid-rows-none",{"grid-template-rows":"none"}],["grid-cols-none",{"grid-template-columns":"none"}],["grid-rows-subgrid",{"grid-template-rows":"subgrid"}],["grid-cols-subgrid",{"grid-template-columns":"subgrid"}]];var hr=["auto","hidden","clip","visible","scroll","overlay",..._],Hi=[[/^(?:overflow|of)-(.+)$/,([,e])=>hr.includes(e)?{overflow:e}:void 0,{autocomplete:[`(overflow|of)-(${hr.join("|")})`,`(overflow|of)-(x|y)-(${hr.join("|")})`]}],[/^(?:overflow|of)-([xy])-(.+)$/,([,e,t])=>hr.includes(t)?{[`overflow-${e}`]:t}:void 0]];var qi=[[/^(?:position-|pos-)?(relative|absolute|fixed|sticky)$/,([,e])=>({position:e}),{autocomplete:["(position|pos)-<position>","(position|pos)-<globalKeyword>","<position>"]}],[/^(?:position-|pos-)([-\w]+)$/,([,e])=>_.includes(e)?{position:e}:void 0],[/^(?:position-|pos-)?(static)$/,([,e])=>({position:e})]],Dn=[["justify-start",{"justify-content":"flex-start"}],["justify-end",{"justify-content":"flex-end"}],["justify-center",{"justify-content":"center"}],["justify-between",{"justify-content":"space-between"}],["justify-around",{"justify-content":"space-around"}],["justify-evenly",{"justify-content":"space-evenly"}],["justify-stretch",{"justify-content":"stretch"}],["justify-left",{"justify-content":"left"}],["justify-right",{"justify-content":"right"}],["justify-center-safe",{"justify-content":"safe center"}],["justify-end-safe",{"justify-content":"safe flex-end"}],["justify-normal",{"justify-content":"normal"}],...W("justify","justify-content"),["justify-items-start",{"justify-items":"start"}],["justify-items-end",{"justify-items":"end"}],["justify-items-center",{"justify-items":"center"}],["justify-items-stretch",{"justify-items":"stretch"}],["justify-items-center-safe",{"justify-items":"safe center"}],["justify-items-end-safe",{"justify-items":"safe flex-end"}],...W("justify-items"),["justify-self-auto",{"justify-self":"auto"}],["justify-self-start",{"justify-self":"start"}],["justify-self-end",{"justify-self":"end"}],["justify-self-center",{"justify-self":"center"}],["justify-self-stretch",{"justify-self":"stretch"}],["justify-self-baseline",{"justify-self":"baseline"}],["justify-self-center-safe",{"justify-self":"safe center"}],["justify-self-end-safe",{"justify-self":"safe flex-end"}],...W("justify-self")],Yi=[[/^order-(.+)$/,([,e])=>({order:p.bracket.cssvar.number(e)})],["order-first",{order:"-9999"}],["order-last",{order:"9999"}],["order-none",{order:"0"}]],Nn=[["content-center",{"align-content":"center"}],["content-start",{"align-content":"flex-start"}],["content-end",{"align-content":"flex-end"}],["content-between",{"align-content":"space-between"}],["content-around",{"align-content":"space-around"}],["content-evenly",{"align-content":"space-evenly"}],["content-baseline",{"align-content":"baseline"}],["content-center-safe",{"align-content":"safe center"}],["content-end-safe",{"align-content":"safe flex-end"}],["content-stretch",{"align-content":"stretch"}],["content-normal",{"align-content":"normal"}],...W("content","align-content"),["items-start",{"align-items":"flex-start"}],["items-end",{"align-items":"flex-end"}],["items-center",{"align-items":"center"}],["items-baseline",{"align-items":"baseline"}],["items-stretch",{"align-items":"stretch"}],["items-baseline-last",{"align-items":"last baseline"}],["items-center-safe",{"align-items":"safe center"}],["items-end-safe",{"align-items":"safe flex-end"}],...W("items","align-items"),["self-auto",{"align-self":"auto"}],["self-start",{"align-self":"flex-start"}],["self-end",{"align-self":"flex-end"}],["self-center",{"align-self":"center"}],["self-stretch",{"align-self":"stretch"}],["self-baseline",{"align-self":"baseline"}],["self-baseline-last",{"align-self":"last baseline"}],["self-center-safe",{"align-self":"safe center"}],["self-end-safe",{"align-self":"safe flex-end"}],...W("self","align-self")],Kn=[["place-content-center",{"place-content":"center"}],["place-content-start",{"place-content":"start"}],["place-content-end",{"place-content":"end"}],["place-content-between",{"place-content":"space-between"}],["place-content-around",{"place-content":"space-around"}],["place-content-evenly",{"place-content":"space-evenly"}],["place-content-stretch",{"place-content":"stretch"}],["place-content-baseline",{"place-content":"baseline"}],["place-content-center-safe",{"place-content":"safe center"}],["place-content-end-safe",{"place-content":"safe flex-end"}],...W("place-content"),["place-items-start",{"place-items":"start"}],["place-items-end",{"place-items":"end"}],["place-items-center",{"place-items":"center"}],["place-items-stretch",{"place-items":"stretch"}],["place-items-baseline",{"place-items":"baseline"}],["place-items-center-safe",{"place-items":"safe center"}],["place-items-end-safe",{"place-items":"safe flex-end"}],...W("place-items"),["place-self-auto",{"place-self":"auto"}],["place-self-start",{"place-self":"start"}],["place-self-end",{"place-self":"end"}],["place-self-center",{"place-self":"center"}],["place-self-stretch",{"place-self":"stretch"}],["place-self-center-safe",{"place-self":"safe center"}],["place-self-end-safe",{"place-self":"safe flex-end"}],...W("place-self")],Xi=[...Dn,...Nn,...Kn].flatMap(([e,t])=>[[`flex-${e}`,t],[`grid-${e}`,t]]);function In(e,{theme:t}){return t.spacing?.[e]??p.bracket.cssvar.global.auto.fraction.rem(e)}function lt([,e,t],r){let n=In(t,r);if(n!=null&&e in Pn)return Pn[e].map(o=>[o.slice(1),n])}var Zi=[[/^(?:position-|pos-)?inset-(.+)$/,([,e],t)=>({inset:In(e,t)}),{autocomplete:["(position|pos)-inset-<directions>-$spacing","(position|pos)-inset-(block|inline)-$spacing","(position|pos)-inset-(bs|be|is|ie)-$spacing","(position|pos)-(top|left|right|bottom)-$spacing"]}],[/^(?:position-|pos-)?(start|end)-(.+)$/,lt],[/^(?:position-|pos-)?inset-([xy])-(.+)$/,lt],[/^(?:position-|pos-)?inset-([rltbse])-(.+)$/,lt],[/^(?:position-|pos-)?inset-(block|inline)-(.+)$/,lt],[/^(?:position-|pos-)?inset-([bi][se])-(.+)$/,lt],[/^(?:position-|pos-)?(top|left|right|bottom)-(.+)$/,([,e,t],r)=>({[e]:In(t,r)})]],Ji=[["float-left",{float:"left"}],["float-right",{float:"right"}],["float-start",{float:"inline-start"}],["float-end",{float:"inline-end"}],["float-none",{float:"none"}],...W("float"),["clear-left",{clear:"left"}],["clear-right",{clear:"right"}],["clear-both",{clear:"both"}],["clear-start",{clear:"inline-start"}],["clear-end",{clear:"inline-end"}],["clear-none",{clear:"none"}],...W("clear")],Qi=[[/^(?:position-|pos-)?z([\d.]+)$/,([,e])=>({"z-index":p.number(e)})],[/^(?:position-|pos-)?z-(.+)$/,([,e],{theme:t})=>({"z-index":t.zIndex?.[e]??p.bracket.cssvar.global.auto.number(e)}),{autocomplete:"z-<num>"}]],es=[["box-border",{"box-sizing":"border-box"}],["box-content",{"box-sizing":"content-box"}],...W("box","box-sizing")];var ts=[[/^(where|\?)$/,(e,{constructCSS:t,generator:r})=>{if(r.userConfig.envMode==="dev")return`@keyframes __un_qm{0%{box-shadow:inset 4px 4px #ff1e90, inset -4px -4px #ff1e90}100%{box-shadow:inset 8px 8px #3399ff, inset -8px -8px #3399ff}} ${t({animation:"__un_qm 0.5s ease-in-out alternate infinite"})}`}]];var sp=["auto","default","none","context-menu","help","pointer","progress","wait","cell","crosshair","text","vertical-text","alias","copy","move","no-drop","not-allowed","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out"],ap=["none","strict","content","size","inline-size","layout","style","paint"],br=" ",rs=[["inline",{display:"inline"}],["block",{display:"block"}],["inline-block",{display:"inline-block"}],["contents",{display:"contents"}],["flow-root",{display:"flow-root"}],["list-item",{display:"list-item"}],["hidden",{display:"none"}],[/^display-(.+)$/,([,e])=>({display:p.bracket.cssvar.global(e)})]],ns=[["visible",{visibility:"visible"}],["invisible",{visibility:"hidden"}],["backface-visible",{"backface-visibility":"visible"}],["backface-hidden",{"backface-visibility":"hidden"}],...W("backface","backface-visibility")],os=[[/^cursor-(.+)$/,([,e])=>({cursor:p.bracket.cssvar.global(e)})],...sp.map(e=>[`cursor-${e}`,{cursor:e}])],is=[[/^contain-(.*)$/,([,e])=>p.bracket(e)!=null?{contain:p.bracket(e).split(" ").map(t=>p.cssvar.fraction(t)??t).join(" ")}:ap.includes(e)?{contain:e}:void 0]],ss=[["pointer-events-auto",{"pointer-events":"auto"}],["pointer-events-none",{"pointer-events":"none"}],...W("pointer-events")],as=[["resize-x",{resize:"horizontal"}],["resize-y",{resize:"vertical"}],["resize",{resize:"both"}],["resize-none",{resize:"none"}],...W("resize")],cs=[["select-auto",{"-webkit-user-select":"auto","user-select":"auto"}],["select-all",{"-webkit-user-select":"all","user-select":"all"}],["select-text",{"-webkit-user-select":"text","user-select":"text"}],["select-none",{"-webkit-user-select":"none","user-select":"none"}],...W("select","user-select")],ls=[[/^(?:whitespace-|ws-)([-\w]+)$/,([,e])=>["normal","nowrap","pre","pre-line","pre-wrap","break-spaces",..._].includes(e)?{"white-space":e}:void 0,{autocomplete:"(whitespace|ws)-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)"}]],fs=[[/^intrinsic-size-(.+)$/,([,e])=>({"contain-intrinsic-size":p.bracket.cssvar.global.fraction.rem(e)}),{autocomplete:"intrinsic-size-<num>"}],["content-visibility-visible",{"content-visibility":"visible"}],["content-visibility-hidden",{"content-visibility":"hidden"}],["content-visibility-auto",{"content-visibility":"auto"}],...W("content-visibility")],us=[[/^content-(.+)$/,([,e])=>({content:p.bracket.cssvar(e)})],["content-empty",{content:'""'}],["content-none",{content:"none"}]],ps=[["break-normal",{"overflow-wrap":"normal","word-break":"normal"}],["break-words",{"overflow-wrap":"break-word"}],["break-all",{"word-break":"break-all"}],["break-keep",{"word-break":"keep-all"}],["break-anywhere",{"overflow-wrap":"anywhere"}]],ds=[["text-wrap",{"text-wrap":"wrap"}],["text-nowrap",{"text-wrap":"nowrap"}],["text-balance",{"text-wrap":"balance"}],["text-pretty",{"text-wrap":"pretty"}]],ms=[["truncate",{overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap"}],["text-truncate",{overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap"}],["text-ellipsis",{"text-overflow":"ellipsis"}],["text-clip",{"text-overflow":"clip"}]],gs=[["case-upper",{"text-transform":"uppercase"}],["case-lower",{"text-transform":"lowercase"}],["case-capital",{"text-transform":"capitalize"}],["case-normal",{"text-transform":"none"}],...W("case","text-transform")],hs=[["italic",{"font-style":"italic"}],["not-italic",{"font-style":"normal"}],["font-italic",{"font-style":"italic"}],["font-not-italic",{"font-style":"normal"}],["oblique",{"font-style":"oblique"}],["not-oblique",{"font-style":"normal"}],["font-oblique",{"font-style":"oblique"}],["font-not-oblique",{"font-style":"normal"}]],bs=[["antialiased",{"-webkit-font-smoothing":"antialiased","-moz-osx-font-smoothing":"grayscale"}],["subpixel-antialiased",{"-webkit-font-smoothing":"auto","-moz-osx-font-smoothing":"auto"}]],xs=[["field-sizing-fixed",{"field-sizing":"fixed"}],["field-sizing-content",{"field-sizing":"content"}]];var Gn={"--un-ring-inset":br,"--un-ring-offset-width":"0px","--un-ring-offset-color":"#fff","--un-ring-width":"0px","--un-ring-color":"rgb(147 197 253 / 0.5)","--un-shadow":"0 0 rgb(0 0 0 / 0)"},cp=Object.keys(Gn),ys=[[/^ring(?:-(.+))?$/,([,e],{theme:t})=>{let r=t.ringWidth?.[e||"DEFAULT"]??p.px(e||"1");if(r)return{"--un-ring-width":r,"--un-ring-offset-shadow":"var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color)","--un-ring-shadow":"var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color)","box-shadow":"var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"}},{custom:{preflightKeys:cp},autocomplete:"ring-$ringWidth"}],[/^ring-(?:width-|size-)(.+)$/,vs,{autocomplete:"ring-(width|size)-$lineWidth"}],["ring-offset",{"--un-ring-offset-width":"1px"}],[/^ring-offset-(?:width-|size-)?(.+)$/,([,e],{theme:t})=>({"--un-ring-offset-width":t.lineWidth?.[e]??p.bracket.cssvar.px(e)}),{autocomplete:"ring-offset-(width|size)-$lineWidth"}],[/^ring-(.+)$/,lp,{autocomplete:"ring-$colors"}],[/^ring-op(?:acity)?-?(.+)$/,([,e])=>({"--un-ring-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"ring-(op|opacity)-<percent>"}],[/^ring-offset-(.+)$/,H("--un-ring-offset-color","ring-offset","borderColor"),{autocomplete:"ring-offset-$colors"}],[/^ring-offset-op(?:acity)?-?(.+)$/,([,e])=>({"--un-ring-offset-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"ring-offset-(op|opacity)-<percent>"}],["ring-inset",{"--un-ring-inset":"inset"}]];function vs([,e],{theme:t}){return{"--un-ring-width":t.ringWidth?.[e]??p.bracket.cssvar.px(e)}}function lp(e,t){return ae(p.bracket(e[1]))?vs(e,t):H("--un-ring-color","ring","borderColor")(e,t)}var Hn={"--un-ring-offset-shadow":"0 0 rgb(0 0 0 / 0)","--un-ring-shadow":"0 0 rgb(0 0 0 / 0)","--un-shadow-inset":br,"--un-shadow":"0 0 rgb(0 0 0 / 0)"},fp=Object.keys(Hn),$s=[[/^shadow(?:-(.+))?$/,(e,t)=>{let[,r]=e,{theme:n}=t,o=n.boxShadow?.[r||"DEFAULT"],i=r?p.bracket.cssvar(r):void 0;return(o!=null||i!=null)&&!dr(i,n,"shadowColor")?{"--un-shadow":pr(o||i,"--un-shadow-color").join(","),"box-shadow":"var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"}:H("--un-shadow-color","shadow","shadowColor")(e,t)},{custom:{preflightKeys:fp},autocomplete:["shadow-$colors","shadow-$boxShadow"]}],[/^shadow-op(?:acity)?-?(.+)$/,([,e])=>({"--un-shadow-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"shadow-(op|opacity)-<percent>"}],["shadow-inset",{"--un-shadow-inset":"inset"}]];var up={h:"height",w:"width",inline:"inline-size",block:"block-size"};function Oe(e,t){return`${e||""}${up[t]}`}function xr(e,t,r,n){let o=Oe(e,t).replace(/-(\w)/g,(s,a)=>a.toUpperCase()),i=r[o]?.[n];if(i!=null)return i;switch(n){case"fit":case"max":case"min":return`${n}-content`}return p.bracket.cssvar.global.auto.fraction.rem(n)}var ks=[[/^size-(min-|max-)?(.+)$/,([,e,t],{theme:r})=>({[Oe(e,"w")]:xr(e,"w",r,t),[Oe(e,"h")]:xr(e,"h",r,t)})],[/^(?:size-)?(min-|max-)?([wh])-?(.+)$/,([,e,t,r],{theme:n})=>({[Oe(e,t)]:xr(e,t,n,r)})],[/^(?:size-)?(min-|max-)?(block|inline)-(.+)$/,([,e,t,r],{theme:n})=>({[Oe(e,t)]:xr(e,t,n,r)}),{autocomplete:["(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize","(block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize","(max|min)-(w|h|block|inline)","(max|min)-(w|h|block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize","(w|h)-full","(max|min)-(w|h)-full"]}],[/^(?:size-)?(min-|max-)?(h)-screen-(.+)$/,([,e,t,r],n)=>({[Oe(e,t)]:ws(n,r,"verticalBreakpoints")})],[/^(?:size-)?(min-|max-)?(w)-screen-(.+)$/,([,e,t,r],n)=>({[Oe(e,t)]:ws(n,r)}),{autocomplete:["(w|h)-screen","(min|max)-(w|h)-screen","h-screen-$verticalBreakpoints","(min|max)-h-screen-$verticalBreakpoints","w-screen-$breakpoints","(min|max)-w-screen-$breakpoints"]}]];function ws(e,t,r="breakpoints"){let n=mr(e,r);if(n)return n.find(o=>o.point===t)?.size}function pp(e){if(/^\d+\/\d+$/.test(e))return e;switch(e){case"square":return"1/1";case"video":return"16/9"}return p.bracket.cssvar.global.auto.number(e)}var Ss=[[/^(?:size-)?aspect-(?:ratio-)?(.+)$/,([,e])=>({"aspect-ratio":pp(e)}),{autocomplete:["aspect-(square|video|ratio)","aspect-ratio-(square|video)"]}]];var Cs=[[/^pa?()-?(.+)$/,oe("padding"),{autocomplete:["(m|p)<num>","(m|p)-<num>"]}],[/^p-?xy()()$/,oe("padding"),{autocomplete:"(m|p)-(xy)"}],[/^p-?([xy])(?:-?(.+))?$/,oe("padding")],[/^p-?([rltbse])(?:-?(.+))?$/,oe("padding"),{autocomplete:"(m|p)<directions>-<num>"}],[/^p-(block|inline)(?:-(.+))?$/,oe("padding"),{autocomplete:"(m|p)-(block|inline)-<num>"}],[/^p-?([bi][se])(?:-?(.+))?$/,oe("padding"),{autocomplete:"(m|p)-(bs|be|is|ie)-<num>"}]],Rs=[[/^ma?()-?(.+)$/,oe("margin")],[/^m-?xy()()$/,oe("margin")],[/^m-?([xy])(?:-?(.+))?$/,oe("margin")],[/^m-?([rltbse])(?:-?(.+))?$/,oe("margin")],[/^m-(block|inline)(?:-(.+))?$/,oe("margin")],[/^m-?([bi][se])(?:-?(.+))?$/,oe("margin")]];var Es=[[/^fill-(.+)$/,H("fill","fill","backgroundColor"),{autocomplete:"fill-$colors"}],[/^fill-op(?:acity)?-?(.+)$/,([,e])=>({"--un-fill-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"fill-(op|opacity)-<percent>"}],["fill-none",{fill:"none"}],[/^stroke-(?:width-|size-)?(.+)$/,Ts,{autocomplete:["stroke-width-$lineWidth","stroke-size-$lineWidth"]}],[/^stroke-dash-(.+)$/,([,e])=>({"stroke-dasharray":p.bracket.cssvar.number(e)}),{autocomplete:"stroke-dash-<num>"}],[/^stroke-offset-(.+)$/,([,e],{theme:t})=>({"stroke-dashoffset":t.lineWidth?.[e]??p.bracket.cssvar.px.numberWithUnit(e)}),{autocomplete:"stroke-offset-$lineWidth"}],[/^stroke-(.+)$/,dp,{autocomplete:"stroke-$colors"}],[/^stroke-op(?:acity)?-?(.+)$/,([,e])=>({"--un-stroke-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"stroke-(op|opacity)-<percent>"}],["stroke-cap-square",{"stroke-linecap":"square"}],["stroke-cap-round",{"stroke-linecap":"round"}],["stroke-cap-auto",{"stroke-linecap":"butt"}],["stroke-join-arcs",{"stroke-linejoin":"arcs"}],["stroke-join-bevel",{"stroke-linejoin":"bevel"}],["stroke-join-clip",{"stroke-linejoin":"miter-clip"}],["stroke-join-round",{"stroke-linejoin":"round"}],["stroke-join-auto",{"stroke-linejoin":"miter"}],["stroke-none",{stroke:"none"}]];function Ts([,e],{theme:t}){return{"stroke-width":t.lineWidth?.[e]??p.bracket.cssvar.fraction.px.number(e)}}function dp(e,t){return ae(p.bracket(e[1]))?Ts(e,t):H("stroke","stroke","borderColor")(e,t)}var yr=["translate","rotate","scale"],mp=["translateX(var(--un-translate-x))","translateY(var(--un-translate-y))","rotate(var(--un-rotate))","rotateZ(var(--un-rotate-z))","skewX(var(--un-skew-x))","skewY(var(--un-skew-y))","scaleX(var(--un-scale-x))","scaleY(var(--un-scale-y))"].join(" "),Ne=["translateX(var(--un-translate-x))","translateY(var(--un-translate-y))","translateZ(var(--un-translate-z))","rotate(var(--un-rotate))","rotateX(var(--un-rotate-x))","rotateY(var(--un-rotate-y))","rotateZ(var(--un-rotate-z))","skewX(var(--un-skew-x))","skewY(var(--un-skew-y))","scaleX(var(--un-scale-x))","scaleY(var(--un-scale-y))","scaleZ(var(--un-scale-z))"].join(" "),gp=["translate3d(var(--un-translate-x), var(--un-translate-y), var(--un-translate-z))","rotate(var(--un-rotate))","rotateX(var(--un-rotate-x))","rotateY(var(--un-rotate-y))","rotateZ(var(--un-rotate-z))","skewX(var(--un-skew-x))","skewY(var(--un-skew-y))","scaleX(var(--un-scale-x))","scaleY(var(--un-scale-y))","scaleZ(var(--un-scale-z))"].join(" "),qn={"--un-rotate":0,"--un-rotate-x":0,"--un-rotate-y":0,"--un-rotate-z":0,"--un-scale-x":1,"--un-scale-y":1,"--un-scale-z":1,"--un-skew-x":0,"--un-skew-y":0,"--un-translate-x":0,"--un-translate-y":0,"--un-translate-z":0},be=Object.keys(qn),Os=[[/^(?:transform-)?origin-(.+)$/,([,e])=>({"transform-origin":rt[e]??p.bracket.cssvar(e)}),{autocomplete:[`transform-origin-(${Object.keys(rt).join("|")})`,`origin-(${Object.keys(rt).join("|")})`]}],[/^(?:transform-)?perspect(?:ive)?-(.+)$/,([,e])=>{let t=p.bracket.cssvar.px.numberWithUnit(e);if(t!=null)return{"-webkit-perspective":t,perspective:t}}],[/^(?:transform-)?perspect(?:ive)?-origin-(.+)$/,([,e])=>{let t=p.bracket.cssvar(e)??(e.length>=3?rt[e]:void 0);if(t!=null)return{"-webkit-perspective-origin":t,"perspective-origin":t}}],[/^(?:transform-)?translate-()(.+)$/,js,{custom:{preflightKeys:be}}],[/^(?:transform-)?translate-([xyz])-(.+)$/,js,{custom:{preflightKeys:be}}],[/^(?:transform-)?rotate-()(.+)$/,As,{custom:{preflightKeys:be}}],[/^(?:transform-)?rotate-([xyz])-(.+)$/,As,{custom:{preflightKeys:be}}],[/^(?:transform-)?skew-()(.+)$/,Ps,{custom:{preflightKeys:be}}],[/^(?:transform-)?skew-([xy])-(.+)$/,Ps,{custom:{preflightKeys:be},autocomplete:["transform-skew-(x|y)-<percent>","skew-(x|y)-<percent>"]}],[/^(?:transform-)?scale-()(.+)$/,zs,{custom:{preflightKeys:be}}],[/^(?:transform-)?scale-([xyz])-(.+)$/,zs,{custom:{preflightKeys:be},autocomplete:[`transform-(${yr.join("|")})-<percent>`,`transform-(${yr.join("|")})-(x|y|z)-<percent>`,`(${yr.join("|")})-<percent>`,`(${yr.join("|")})-(x|y|z)-<percent>`]}],[/^(?:transform-)?preserve-3d$/,()=>({"transform-style":"preserve-3d"})],[/^(?:transform-)?preserve-flat$/,()=>({"transform-style":"flat"})],["transform",{transform:Ne},{custom:{preflightKeys:be}}],["transform-cpu",{transform:mp},{custom:{preflightKeys:["--un-translate-x","--un-translate-y","--un-rotate","--un-rotate-z","--un-skew-x","--un-skew-y","--un-scale-x","--un-scale-y"]}}],["transform-gpu",{transform:gp},{custom:{preflightKeys:be}}],["transform-none",{transform:"none"}],...W("transform")];function js([,e,t],{theme:r}){let n=r.spacing?.[t]??p.bracket.cssvar.fraction.rem(t);if(n!=null)return[...gr(e,n,"translate"),["transform",Ne]]}function zs([,e,t]){let r=p.bracket.cssvar.fraction.percent(t);if(r!=null)return[...gr(e,r,"scale"),["transform",Ne]]}function As([,e="",t]){let r=p.bracket.cssvar.degree(t);if(r!=null)return e?{"--un-rotate":0,[`--un-rotate-${e}`]:r,transform:Ne}:{"--un-rotate-x":0,"--un-rotate-y":0,"--un-rotate-z":0,"--un-rotate":r,transform:Ne}}function Ps([,e,t]){let r=p.bracket.cssvar.degree(t);if(r!=null)return[...gr(e,r,"skew"),["transform",Ne]]}function Vs(e,t){let r;if(p.cssvar(e)!=null)r=p.cssvar(e);else{e.startsWith("[")&&e.endsWith("]")&&(e=e.slice(1,-1));let n=e.split(",").map(o=>t.transitionProperty?.[o]??p.properties(o));n.every(Boolean)&&(r=n.join(","))}return r}var Ms=[[/^transition(?:-(\D+?))?(?:-(\d+))?$/,([,e,t],{theme:r})=>{if(!e&&!t)return{"transition-property":r.transitionProperty?.DEFAULT,"transition-timing-function":r.easing?.DEFAULT,"transition-duration":r.duration?.DEFAULT??p.time("150")};if(e!=null){let n=Vs(e,r),o=r.duration?.[t||"DEFAULT"]??p.time(t||"150");if(n)return{"transition-property":n,"transition-timing-function":r.easing?.DEFAULT,"transition-duration":o}}else if(t!=null)return{"transition-property":r.transitionProperty?.DEFAULT,"transition-timing-function":r.easing?.DEFAULT,"transition-duration":r.duration?.[t]??p.time(t)}},{autocomplete:"transition-$transitionProperty-$duration"}],[/^(?:transition-)?duration-(.+)$/,([,e],{theme:t})=>({"transition-duration":t.duration?.[e||"DEFAULT"]??p.bracket.cssvar.time(e)}),{autocomplete:["transition-duration-$duration","duration-$duration"]}],[/^(?:transition-)?delay-(.+)$/,([,e],{theme:t})=>({"transition-delay":t.duration?.[e||"DEFAULT"]??p.bracket.cssvar.time(e)}),{autocomplete:["transition-delay-$duration","delay-$duration"]}],[/^(?:transition-)?ease(?:-(.+))?$/,([,e],{theme:t})=>({"transition-timing-function":t.easing?.[e||"DEFAULT"]??p.bracket.cssvar(e)}),{autocomplete:["transition-ease-(linear|in|out|in-out|DEFAULT)","ease-(linear|in|out|in-out|DEFAULT)"]}],[/^(?:transition-)?property-(.+)$/,([,e],{theme:t})=>{let r=p.global(e)||Vs(e,t);if(r)return{"transition-property":r}},{autocomplete:[`transition-property-(${[..._].join("|")})`,"transition-property-$transitionProperty","property-$transitionProperty"]}],["transition-none",{transition:"none"}],...W("transition"),["transition-discrete",{"transition-behavior":"allow-discrete"}],["transition-normal",{"transition-behavior":"normal"}]];var Fs=[[/^text-(.+)$/,bp,{autocomplete:"text-$fontSize"}],[/^(?:text|font)-size-(.+)$/,Bs,{autocomplete:"text-size-$fontSize"}],[/^text-(?:color-)?(.+)$/,hp,{autocomplete:"text-$colors"}],[/^(?:color|c)-(.+)$/,H("color","text","textColor"),{autocomplete:"(color|c)-$colors"}],[/^(?:text|color|c)-(.+)$/,([,e])=>_.includes(e)?{color:e}:void 0,{autocomplete:`(text|color|c)-(${_.join("|")})`}],[/^(?:text|color|c)-op(?:acity)?-?(.+)$/,([,e])=>({"--un-text-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"(text|color|c)-(op|opacity)-<percent>"}],[/^(?:font|fw)-?([^-]+)$/,([,e],{theme:t})=>({"font-weight":t.fontWeight?.[e]||p.bracket.global.number(e)}),{autocomplete:["(font|fw)-(100|200|300|400|500|600|700|800|900)","(font|fw)-$fontWeight"]}],[/^(?:font-)?(?:leading|lh|line-height)-(.+)$/,([,e],{theme:t})=>({"line-height":Yn(e,t,"lineHeight")}),{autocomplete:"(leading|lh|line-height)-$lineHeight"}],["font-synthesis-weight",{"font-synthesis":"weight"}],["font-synthesis-style",{"font-synthesis":"style"}],["font-synthesis-small-caps",{"font-synthesis":"small-caps"}],["font-synthesis-none",{"font-synthesis":"none"}],[/^font-synthesis-(.+)$/,([,e])=>({"font-synthesis":p.bracket.cssvar.global(e)})],[/^(?:font-)?tracking-(.+)$/,([,e],{theme:t})=>({"letter-spacing":t.letterSpacing?.[e]||p.bracket.cssvar.global.rem(e)}),{autocomplete:"tracking-$letterSpacing"}],[/^(?:font-)?word-spacing-(.+)$/,([,e],{theme:t})=>({"word-spacing":t.wordSpacing?.[e]||p.bracket.cssvar.global.rem(e)}),{autocomplete:"word-spacing-$wordSpacing"}],["font-stretch-normal",{"font-stretch":"normal"}],["font-stretch-ultra-condensed",{"font-stretch":"ultra-condensed"}],["font-stretch-extra-condensed",{"font-stretch":"extra-condensed"}],["font-stretch-condensed",{"font-stretch":"condensed"}],["font-stretch-semi-condensed",{"font-stretch":"semi-condensed"}],["font-stretch-semi-expanded",{"font-stretch":"semi-expanded"}],["font-stretch-expanded",{"font-stretch":"expanded"}],["font-stretch-extra-expanded",{"font-stretch":"extra-expanded"}],["font-stretch-ultra-expanded",{"font-stretch":"ultra-expanded"}],[/^font-stretch-(.+)$/,([,e])=>({"font-stretch":p.bracket.cssvar.fraction.global(e)}),{autocomplete:"font-stretch-<percentage>"}],[/^font-(.+)$/,([,e],{theme:t})=>({"font-family":t.fontFamily?.[e]||p.bracket.cssvar.global(e)}),{autocomplete:"font-$fontFamily"}]],_s=[[/^tab(?:-(.+))?$/,([,e])=>{let t=p.bracket.cssvar.global.number(e||"4");if(t!=null)return{"-moz-tab-size":t,"-o-tab-size":t,"tab-size":t}}]],Ls=[[/^indent(?:-(.+))?$/,([,e],{theme:t})=>({"text-indent":t.textIndent?.[e||"DEFAULT"]||p.bracket.cssvar.global.fraction.rem(e)}),{autocomplete:"indent-$textIndent"}]],Ws=[[/^text-stroke(?:-(.+))?$/,([,e],{theme:t})=>({"-webkit-text-stroke-width":t.textStrokeWidth?.[e||"DEFAULT"]||p.bracket.cssvar.px(e)}),{autocomplete:"text-stroke-$textStrokeWidth"}],[/^text-stroke-(.+)$/,H("-webkit-text-stroke-color","text-stroke","borderColor"),{autocomplete:"text-stroke-$colors"}],[/^text-stroke-op(?:acity)?-?(.+)$/,([,e])=>({"--un-text-stroke-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"text-stroke-(op|opacity)-<percent>"}]],Us=[[/^text-shadow(?:-(.+))?$/,([,e],{theme:t})=>{let r=t.textShadow?.[e||"DEFAULT"];return r!=null?{"--un-text-shadow":pr(r,"--un-text-shadow-color").join(","),"text-shadow":"var(--un-text-shadow)"}:{"text-shadow":p.bracket.cssvar.global(e)}},{autocomplete:"text-shadow-$textShadow"}],[/^text-shadow-color-(.+)$/,H("--un-text-shadow-color","text-shadow","shadowColor"),{autocomplete:"text-shadow-color-$colors"}],[/^text-shadow-color-op(?:acity)?-?(.+)$/,([,e])=>({"--un-text-shadow-opacity":p.bracket.percent.cssvar(e)}),{autocomplete:"text-shadow-color-(op|opacity)-<percent>"}]];function Yn(e,t,r){return t[r]?.[e]||p.bracket.cssvar.global.rem(e)}function Bs([,e],{theme:t}){let n=S(t.fontSize?.[e])?.[0]??p.bracket.cssvar.global.rem(e);if(n!=null)return{"font-size":n}}function hp(e,t){return ae(p.bracket(e[1]))?Bs(e,t):H("color","text","textColor")(e,t)}function bp([,e="base"],{theme:t}){let r=Wn(e,"length");if(!r)return;let[n,o]=r,i=S(t.fontSize?.[n]),s=o?Yn(o,t,"lineHeight"):void 0;if(i?.[0]){let[c,l,u]=i;return typeof l=="object"?{"font-size":c,...l}:{"font-size":c,"line-height":s??l??"1","letter-spacing":u?Yn(u,t,"letterSpacing"):void 0}}let a=p.bracketOfLength.rem(n);return s&&a?{"font-size":a,"line-height":s}:{"font-size":p.bracketOfLength.rem(e)}}var xp={backface:"backface-visibility",break:"word-break",case:"text-transform",content:"align-content",fw:"font-weight",items:"align-items",justify:"justify-content",select:"user-select",self:"align-self",vertical:"vertical-align",visible:"visibility",whitespace:"white-space",ws:"white-space"},Is=[[/^(.+?)-(\$.+)$/,([,e,t])=>{let r=xp[e];if(r)return{[r]:p.cssvar(t)}}]],Ds=[[/^\[(.*)\]$/,([e,t])=>{if(!t.includes(":"))return;let[r,...n]=t.split(":"),o=n.join(":");if(!vp(t)&&/^[\w-]+$/.test(r)&&yp(o)){let i=p.bracket(`[${o}]`);if(i)return{[r]:i}}}]];function yp(e){let t=0;function r(n){for(;t<e.length;)if(t+=1,e[t]===n)return!0;return!1}for(t=0;t<e.length;t++){let n=e[t];if("\"`'".includes(n)){if(!r(n))return!1}else if(n==="("){if(!r(")"))return!1}else if("[]{}:".includes(n))return!1}return!0}function vp(e){if(!e.includes("://"))return!1;try{return new URL(e).host!==""}catch{return!1}}var Ns=[Is,Ds,is,ss,ns,qi,Zi,Qi,Yi,Gi,Ji,Rs,es,rs,Ss,ks,Ni,Os,os,cs,as,Oi,Kn,Nn,Dn,Ki,Xi,Hi,ms,ls,ps,Fi,Li,Wi,Es,Cs,Ci,Ls,ds,Si,Fs,gs,hs,Ii,bs,_s,Ws,Us,_i,$s,Ai,ys,Ms,Vi,fs,us,Ui,xs,ts].flat(1);var Ks={position:["relative","absolute","fixed","sticky","static"],globalKeyword:_};var Xn={inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000",white:"#fff",rose:{50:"#fff1f2",100:"#ffe4e6",200:"#fecdd3",300:"#fda4af",400:"#fb7185",500:"#f43f5e",600:"#e11d48",700:"#be123c",800:"#9f1239",900:"#881337",950:"#4c0519"},pink:{50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843",950:"#500724"},fuchsia:{50:"#fdf4ff",100:"#fae8ff",200:"#f5d0fe",300:"#f0abfc",400:"#e879f9",500:"#d946ef",600:"#c026d3",700:"#a21caf",800:"#86198f",900:"#701a75",950:"#4a044e"},purple:{50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87",950:"#3b0764"},violet:{50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95",950:"#2e1065"},indigo:{50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81",950:"#1e1b4b"},blue:{50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a",950:"#172554"},sky:{50:"#f0f9ff",100:"#e0f2fe",200:"#bae6fd",300:"#7dd3fc",400:"#38bdf8",500:"#0ea5e9",600:"#0284c7",700:"#0369a1",800:"#075985",900:"#0c4a6e",950:"#082f49"},cyan:{50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63",950:"#083344"},teal:{50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e",800:"#115e59",900:"#134e4a",950:"#042f2e"},emerald:{50:"#ecfdf5",100:"#d1fae5",200:"#a7f3d0",300:"#6ee7b7",400:"#34d399",500:"#10b981",600:"#059669",700:"#047857",800:"#065f46",900:"#064e3b",950:"#022c22"},green:{50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",950:"#052e16"},lime:{50:"#f7fee7",100:"#ecfccb",200:"#d9f99d",300:"#bef264",400:"#a3e635",500:"#84cc16",600:"#65a30d",700:"#4d7c0f",800:"#3f6212",900:"#365314",950:"#1a2e05"},yellow:{50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12",950:"#422006"},amber:{50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f",950:"#451a03"},orange:{50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12",950:"#431407"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},gray:{50:"#f9fafb",100:"#f3f4f6",200:"#e5e7eb",300:"#d1d5db",400:"#9ca3af",500:"#6b7280",600:"#4b5563",700:"#374151",800:"#1f2937",900:"#111827",950:"#030712"},slate:{50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",800:"#1e293b",900:"#0f172a",950:"#020617"},zinc:{50:"#fafafa",100:"#f4f4f5",200:"#e4e4e7",300:"#d4d4d8",400:"#a1a1aa",500:"#71717a",600:"#52525b",700:"#3f3f46",800:"#27272a",900:"#18181b",950:"#09090b"},neutral:{50:"#fafafa",100:"#f5f5f5",200:"#e5e5e5",300:"#d4d4d4",400:"#a3a3a3",500:"#737373",600:"#525252",700:"#404040",800:"#262626",900:"#171717",950:"#0a0a0a"},stone:{50:"#fafaf9",100:"#f5f5f4",200:"#e7e5e4",300:"#d6d3d1",400:"#a8a29e",500:"#78716c",600:"#57534e",700:"#44403c",800:"#292524",900:"#1c1917",950:"#0c0a09"},light:{50:"#fdfdfd",100:"#fcfcfc",200:"#fafafa",300:"#f8f9fa",400:"#f6f6f6",500:"#f2f2f2",600:"#f1f3f5",700:"#e9ecef",800:"#dee2e6",900:"#dde1e3",950:"#d8dcdf"},dark:{50:"#4a4a4a",100:"#3c3c3c",200:"#323232",300:"#2d2d2d",400:"#222222",500:"#1f1f1f",600:"#1c1c1e",700:"#1b1b1b",800:"#181818",900:"#0f0f0f",950:"#080808"},get lightblue(){return this.sky},get lightBlue(){return this.sky},get warmgray(){return this.stone},get warmGray(){return this.stone},get truegray(){return this.neutral},get trueGray(){return this.neutral},get coolgray(){return this.gray},get coolGray(){return this.gray},get bluegray(){return this.slate},get blueGray(){return this.slate}};Object.values(Xn).forEach(e=>{typeof e!="string"&&e!==void 0&&(e.DEFAULT=e.DEFAULT||e[400],Object.keys(e).forEach(t=>{let r=+t/100;r===Math.round(r)&&(e[r]=e[t])}))});var Gs={DEFAULT:"8px",0:"0",sm:"4px",md:"12px",lg:"16px",xl:"24px","2xl":"40px","3xl":"64px"},Hs={DEFAULT:["0 1px 2px rgb(0 0 0 / 0.1)","0 1px 1px rgb(0 0 0 / 0.06)"],sm:"0 1px 1px rgb(0 0 0 / 0.05)",md:["0 4px 3px rgb(0 0 0 / 0.07)","0 2px 2px rgb(0 0 0 / 0.06)"],lg:["0 10px 8px rgb(0 0 0 / 0.04)","0 4px 3px rgb(0 0 0 / 0.1)"],xl:["0 20px 13px rgb(0 0 0 / 0.03)","0 8px 5px rgb(0 0 0 / 0.08)"],"2xl":"0 25px 25px rgb(0 0 0 / 0.15)",none:"0 0 rgb(0 0 0 / 0)"};var qs={sans:["ui-sans-serif","system-ui","-apple-system","BlinkMacSystemFont",'"Segoe UI"',"Roboto",'"Helvetica Neue"',"Arial",'"Noto Sans"',"sans-serif",'"Apple Color Emoji"','"Segoe UI Emoji"','"Segoe UI Symbol"','"Noto Color Emoji"'].join(","),serif:["ui-serif","Georgia","Cambria",'"Times New Roman"',"Times","serif"].join(","),mono:["ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas",'"Liberation Mono"','"Courier New"',"monospace"].join(",")},Ys={xs:["0.75rem","1rem"],sm:["0.875rem","1.25rem"],base:["1rem","1.5rem"],lg:["1.125rem","1.75rem"],xl:["1.25rem","1.75rem"],"2xl":["1.5rem","2rem"],"3xl":["1.875rem","2.25rem"],"4xl":["2.25rem","2.5rem"],"5xl":["3rem","1"],"6xl":["3.75rem","1"],"7xl":["4.5rem","1"],"8xl":["6rem","1"],"9xl":["8rem","1"]},Xs={DEFAULT:"1.5rem",xs:"0.5rem",sm:"1rem",md:"1.5rem",lg:"2rem",xl:"2.5rem","2xl":"3rem","3xl":"4rem"},Zs={DEFAULT:"1.5rem",none:"0",sm:"thin",md:"medium",lg:"thick"},Js={DEFAULT:["0 0 1px rgb(0 0 0 / 0.2)","0 0 1px rgb(1 0 5 / 0.1)"],none:"0 0 rgb(0 0 0 / 0)",sm:"1px 1px 3px rgb(36 37 47 / 0.25)",md:["0 1px 2px rgb(30 29 39 / 0.19)","1px 2px 4px rgb(54 64 147 / 0.18)"],lg:["3px 3px 6px rgb(0 0 0 / 0.26)","0 0 5px rgb(15 3 86 / 0.22)"],xl:["1px 1px 3px rgb(0 0 0 / 0.29)","2px 4px 7px rgb(73 64 125 / 0.35)"]},Qs={none:"1",tight:"1.25",snug:"1.375",normal:"1.5",relaxed:"1.625",loose:"2"},Zn={tighter:"-0.05em",tight:"-0.025em",normal:"0em",wide:"0.025em",wider:"0.05em",widest:"0.1em"},ea={thin:"100",extralight:"200",light:"300",normal:"400",medium:"500",semibold:"600",bold:"700",extrabold:"800",black:"900"},ta=Zn;var Jn={sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},ra={...Jn},na={DEFAULT:"1px",none:"0"},oa={DEFAULT:"1rem",none:"0",xs:"0.75rem",sm:"0.875rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem","5xl":"3rem","6xl":"3.75rem","7xl":"4.5rem","8xl":"6rem","9xl":"8rem"},ia={DEFAULT:"150ms",none:"0s",75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},sa={DEFAULT:"0.25rem",none:"0",sm:"0.125rem",md:"0.375rem",lg:"0.5rem",xl:"0.75rem","2xl":"1rem","3xl":"1.5rem",full:"9999px"},aa={DEFAULT:["var(--un-shadow-inset) 0 1px 3px 0 rgb(0 0 0 / 0.1)","var(--un-shadow-inset) 0 1px 2px -1px rgb(0 0 0 / 0.1)"],none:"0 0 rgb(0 0 0 / 0)",sm:"var(--un-shadow-inset) 0 1px 2px 0 rgb(0 0 0 / 0.05)",md:["var(--un-shadow-inset) 0 4px 6px -1px rgb(0 0 0 / 0.1)","var(--un-shadow-inset) 0 2px 4px -2px rgb(0 0 0 / 0.1)"],lg:["var(--un-shadow-inset) 0 10px 15px -3px rgb(0 0 0 / 0.1)","var(--un-shadow-inset) 0 4px 6px -4px rgb(0 0 0 / 0.1)"],xl:["var(--un-shadow-inset) 0 20px 25px -5px rgb(0 0 0 / 0.1)","var(--un-shadow-inset) 0 8px 10px -6px rgb(0 0 0 / 0.1)"],"2xl":"var(--un-shadow-inset) 0 25px 50px -12px rgb(0 0 0 / 0.25)",inner:"inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"},ca={DEFAULT:"3px",none:"0"},la={auto:"auto"},fa={mouse:"(hover) and (pointer: fine)"};var ua={...qn,...Hn,...Gn};var we={xs:"20rem",sm:"24rem",md:"28rem",lg:"32rem",xl:"36rem","2xl":"42rem","3xl":"48rem","4xl":"56rem","5xl":"64rem","6xl":"72rem","7xl":"80rem",prose:"65ch"},pa={auto:"auto",...we,screen:"100vw"},Qn={none:"none",...we,screen:"100vw"},da={auto:"auto",...we,screen:"100vb"},ma={auto:"auto",...we,screen:"100vi"},ga={auto:"auto",...we,screen:"100vh"},eo={none:"none",...we,screen:"100vh"},to={none:"none",...we,screen:"100vb"},ro={none:"none",...we,screen:"100vi"},ha={...we};var ba={DEFAULT:"cubic-bezier(0.4, 0, 0.2, 1)",linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)","in-out":"cubic-bezier(0.4, 0, 0.2, 1)"},xa={none:"none",all:"all",colors:["color","background-color","border-color","text-decoration-color","fill","stroke"].join(","),opacity:"opacity",shadow:"box-shadow",transform:"transform",get DEFAULT(){return[this.colors,"opacity","box-shadow","transform","filter","backdrop-filter"].join(",")}};var ya={width:pa,height:ga,maxWidth:Qn,maxHeight:eo,minWidth:Qn,minHeight:eo,inlineSize:ma,blockSize:da,maxInlineSize:ro,maxBlockSize:to,minInlineSize:ro,minBlockSize:to,colors:Xn,fontFamily:qs,fontSize:Ys,fontWeight:ea,breakpoints:Jn,verticalBreakpoints:ra,borderRadius:sa,lineHeight:Qs,letterSpacing:Zn,wordSpacing:ta,boxShadow:aa,textIndent:Xs,textShadow:Js,textStrokeWidth:Zs,blur:Gs,dropShadow:Hs,easing:ba,transitionProperty:xa,lineWidth:na,spacing:oa,duration:ia,ringWidth:ca,preflightBase:ua,containers:ha,zIndex:la,media:fa};var va={name:"aria",match(e,t){let r=A("aria-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n)??t.theme.aria?.[n]??"";if(i)return{matcher:o,selector:s=>`${s}[aria-${i}]`}}},multiPass:!0};function vr(e,t,r={}){return{name:`${e}-aria`,match(n,o){let i=A(`${e}-aria-`,n,o.generator.config.separators);if(i){let[s,a,c]=i,l=p.bracket(s)??o.theme.aria?.[s]??"";if(l){let u=!!r?.attributifyPseudo,d=r?.prefix??"";d=(Array.isArray(d)?d:[d]).filter(Boolean)[0]??"";let h=`${u?`[${d}${e}=""]`:`.${d}${e}`}`,m=J(c?`/${c}`:"");return{matcher:a,handle:(g,x)=>{let k=new RegExp(`${K(h)}${K(m)}(?:\\[.+?\\])+`),C=g.prefix.match(k),v;if(C){let b=(C.index??0)+h.length+m.length;v=[g.prefix.slice(0,b),`[aria-${l}]`,g.prefix.slice(b)].join("")}else{let b=Math.max(g.prefix.indexOf(h),0);v=[g.prefix.slice(0,b),h,m,`[aria-${l}]`,t,g.prefix.slice(b)].join("")}return x({...g,prefix:v})}}}}},multiPass:!0}}function $p(){return{name:"has-aria",match(e,t){let r=A("has-aria-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n)??t.theme.aria?.[n]??"";if(i)return{matcher:o,handle:(s,a)=>a({...s,pseudo:`${s.pseudo}:has([aria-${i}])`})}}},multiPass:!0}}function $a(e={}){return[vr("group"," ",e),vr("peer","~",e),vr("parent",">",e),vr("previous","+",e),$p()]}var wa=/(max|min)-\[([^\]]*)\]:/;function ka(){let e={};return{name:"breakpoints",match(t,r){if(wa.test(t)){let o=t.match(wa);return{matcher:t.replace(o[0],""),handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}@media (${o[1]}-width: ${o[2]})`})}}let n=(mr(r)??[]).map(({point:o,size:i},s)=>[o,i,s]);for(let[o,i,s]of n){e[o]||(e[o]=new RegExp(`^((?:([al]t-|[<~]|max-))?${o}(?:${r.generator.config.separators.join("|")}))`));let a=t.match(e[o]);if(!a)continue;let[,c]=a,l=t.slice(c.length);if(l==="container")continue;let u=c.startsWith("lt-")||c.startsWith("<")||c.startsWith("max-"),d=c.startsWith("at-")||c.startsWith("~"),h=3e3;return u?(h-=s+1,{matcher:l,handle:(m,g)=>g({...m,parent:`${m.parent?`${m.parent} $$ `:""}@media (max-width: ${Ue(i)})`,parentOrder:h})}):(h+=s+1,d&&s<n.length-1?{matcher:l,handle:(m,g)=>g({...m,parent:`${m.parent?`${m.parent} $$ `:""}@media (min-width: ${i}) and (max-width: ${Ue(n[s+1][1])})`,parentOrder:h})}:{matcher:l,handle:(m,g)=>g({...m,parent:`${m.parent?`${m.parent} $$ `:""}@media (min-width: ${i})`,parentOrder:h})})}},multiPass:!0,autocomplete:"(at-|lt-|max-|)$breakpoints:"}}var Sa=[N("*",e=>({selector:`${e.selector} > *`}),{order:-1})];function ft(e,t){return{name:`combinator:${e}`,match(r,n){if(!r.startsWith(e))return;let o=n.generator.config.separators,i=X(`${e}-`,r,o);if(!i){for(let a of o)if(r.startsWith(`${e}${a}`)){i=["",r.slice(e.length+a.length)];break}if(!i)return}let s=p.bracket(i[0])??"";return s===""&&(s="*"),{matcher:i[1],selector:a=>`${a}${t}${s}`}},multiPass:!0}}var Ca=[ft("all"," "),ft("children",">"),ft("next","+"),ft("sibling","+"),ft("siblings","~")];var Ra={name:"@",match(e,t){if(e.startsWith("@container"))return;let r=A("@",e,t.generator.config.separators);if(r){let[n,o,i]=r,s=p.bracket(n),a;if(s?a=p.numberWithUnit(s):a=t.theme.containers?.[n]??"",a){let c=1e3+Object.keys(t.theme.containers??{}).indexOf(n);return i&&(c+=1e3),{matcher:o,handle:(l,u)=>u({...l,parent:`${l.parent?`${l.parent} $$ `:""}@container${i?` ${i} `:" "}(min-width: ${a})`,parentOrder:c})}}}},multiPass:!0};function Ea(e={}){if(e?.dark==="class"||typeof e.dark=="object"){let{dark:t=".dark",light:r=".light"}=typeof e.dark=="string"?{}:e.dark;return[N("dark",S(t).map(n=>o=>({prefix:`${n} $$ ${o.prefix}`}))),N("light",S(r).map(n=>o=>({prefix:`${n} $$ ${o.prefix}`})))]}return[G("dark","@media (prefers-color-scheme: dark)"),G("light","@media (prefers-color-scheme: light)")]}var Ta={name:"data",match(e,t){let r=A("data-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n)??t.theme.data?.[n]??"";if(i)return{matcher:o,selector:s=>`${s}[data-${i}]`}}},multiPass:!0};function $r(e,t,r={}){return{name:`${e}-data`,match(n,o){let i=A(`${e}-data-`,n,o.generator.config.separators);if(i){let[s,a,c]=i,l=p.bracket(s)??o.theme.data?.[s]??"";if(l){let u=!!r?.attributifyPseudo,d=r?.prefix??"";d=(Array.isArray(d)?d:[d]).filter(Boolean)[0]??"";let h=`${u?`[${d}${e}=""]`:`.${d}${e}`}`,m=J(c?`/${c}`:"");return{matcher:a,handle:(g,x)=>{let k=new RegExp(`${K(h)}${K(m)}(?:\\[.+?\\])+`),C=g.prefix.match(k),v;if(C){let b=(C.index??0)+h.length+m.length;v=[g.prefix.slice(0,b),`[data-${l}]`,g.prefix.slice(b)].join("")}else{let b=Math.max(g.prefix.indexOf(h),0);v=[g.prefix.slice(0,b),h,m,`[data-${l}]`,t,g.prefix.slice(b)].join("")}return x({...g,prefix:v})}}}}},multiPass:!0}}function wp(){return{name:"has-data",match(e,t){let r=A("has-data-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n)??t.theme.data?.[n]??"";if(i)return{matcher:o,handle:(s,a)=>a({...s,pseudo:`${s.pseudo}:has([data-${i}])`})}}},multiPass:!0}}function ja(e={}){return[$r("group"," ",e),$r("peer","~",e),$r("parent",">",e),$r("previous","+",e),wp()]}var za=[N("rtl",e=>({prefix:`[dir="rtl"] $$ ${e.prefix}`})),N("ltr",e=>({prefix:`[dir="ltr"] $$ ${e.prefix}`}))];function Aa(){let e;return{name:"important",match(t,r){e||(e=new RegExp(`^(important(?:${r.generator.config.separators.join("|")})|!)`));let n,o=t.match(e);if(o?n=t.slice(o[0].length):t.endsWith("!")&&(n=t.slice(0,-1)),n)return{matcher:n,body:i=>(i.forEach(s=>{s[1]!=null&&(s[1]+=" !important")}),i)}}}}var Pa=G("print","@media print"),Oa={name:"media",match(e,t){let r=A("media-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n)??"";if(i===""&&(i=t.theme.media?.[n]??""),i)return{matcher:o,handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}@media ${i}`})}}},multiPass:!0};var Va={name:"selector",match(e,t){let r=X("selector-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n);if(i)return{matcher:o,selector:()=>i}}}},Ma={name:"layer",match(e,t){let r=A("layer-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n)??n;if(i)return{matcher:o,handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}@layer ${i}`})}}}},Fa={name:"uno-layer",match(e,t){let r=A("uno-layer-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n)??n;if(i)return{matcher:o,layer:i}}}},_a={name:"scope",match(e,t){let r=X("scope-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n);if(i)return{matcher:o,selector:s=>`${i} $$ ${s}`}}}},La={name:"variables",match(e,t){if(!e.startsWith("["))return;let[r,n]=re(e,"[","]")??[];if(!(r&&n))return;let o;for(let a of t.generator.config.separators)if(n.startsWith(a)){o=n.slice(a.length);break}if(o==null)return;let i=p.bracket(r)??"",s=i.startsWith("@");if(s||i.includes("&"))return{matcher:o,handle(a,c){let l=s?{parent:`${a.parent?`${a.parent} $$ `:""}${i}`}:{selector:i.replace(/&/g,a.selector)};return c({...a,...l})}}},multiPass:!0},Wa={name:"theme-variables",match(e,t){if(tr(e))return{matcher:e,handle(r,n){return n({...r,entries:JSON.parse(rr(JSON.stringify(r.entries),t.theme))})}}}};var Ua=/^-?[0-9.]+(?:[a-z]+|%)?$/,Ba=/-?[0-9.]+(?:[a-z]+|%)?/,kp=[/\b(opacity|color|flex|backdrop-filter|^filter|transform)\b/];function Sp(e){let t=e.match(nt)||e.match(cr);if(t){let[r,n]=pe(`(${t[2]})${t[3]}`,"(",")"," ")??[];if(r)return`calc(${t[1]}${r} * -1)${n?` ${n}`:""}`}}var Cp=/\b(hue-rotate)\s*(\(.*)/;function Rp(e){let t=e.match(Cp);if(t){let[r,n]=pe(t[2],"(",")"," ")??[];if(r){let o=Ua.test(r.slice(1,-1))?r.replace(Ba,i=>i.startsWith("-")?i.slice(1):`-${i}`):`(calc(${r} * -1))`;return`${t[1]}${o}${n?` ${n}`:""}`}}}var Ia={name:"negative",match(e){if(e.startsWith("-"))return{matcher:e.slice(1),body:t=>{if(t.find(n=>n[0]===ji))return;let r=!1;return t.forEach(n=>{let o=n[1]?.toString();if(!o||o==="0"||kp.some(a=>a.test(n[0])))return;let i=Sp(o);if(i){n[1]=i,r=!0;return}let s=Rp(o);if(s){n[1]=s,r=!0;return}Ua.test(o)&&(n[1]=o.replace(Ba,a=>a.startsWith("-")?a.slice(1):`-${a}`),r=!0)}),r?t:[]}}}};function Da(){return or({getBracket:re,h:p,variantGetBracket:X})}function Na(){return ir({getBracket:re,h:p,variantGetBracket:X})}function Ka(e={}){return sr(e,{getBracket:re,h:p,variantGetBracket:X})}var Ga=ar();var Ha={name:"starting",match(e){if(e.startsWith("starting:"))return{matcher:e.slice(9),handle:(t,r)=>r({...t,parent:"@starting-style"})}}};var qa={name:"supports",match(e,t){let r=A("supports-",e,t.generator.config.separators);if(r){let[n,o]=r,i=p.bracket(n)??"";if(i===""&&(i=t.theme.supports?.[n]??""),i)return i.startsWith("(")&&i.endsWith(")")||(i=`(${i})`),{matcher:o,handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}@supports ${i}`})}}},multiPass:!0};function Ya(e){return[va,Ta,Ma,Va,Fa,Ia,Ha,Aa(),qa,Pa,Oa,ka(),...Ca,...Da(),Na(),...Ka(e),Ga,...Ea(e),...za,_a,...Sa,Ra,La,...ja(e),...$a(e),Wa]}var no=(e={})=>(e.dark=e.dark??"class",e.attributifyPseudo=e.attributifyPseudo??!1,e.preflight=e.preflight??!0,e.variablePrefix=e.variablePrefix??"un-",{name:"@unocss/preset-mini",theme:ya,rules:Ns,variants:Ya(e),options:e,prefix:e.prefix,postprocess:Ep(e.variablePrefix),preflights:ri(e),extractorDefault:e.arbitraryVariants===!1?void 0:ti(),autocomplete:{shorthands:Ks}}),Xa=no;function Ep(e){if(e!=="un-")return t=>{t.entries.forEach(r=>{r[0]=r[0].replace(/^--un-/,`--${e}`),typeof r[1]=="string"&&(r[1]=r[1].replace(/var\(--un-/g,`var(--${e}`))})}}function Za(e){if(e==null||e===!1)return[];let t=r=>r.startsWith(":is(")&&r.endsWith(")")?r:r.includes("::")?r.replace(/(.*?)((?:\s\*)?::.*)/,":is($1)$2"):`:is(${r})`;return[e===!0?r=>{r.entries.forEach(n=>{n[1]!=null&&!String(n[1]).endsWith("!important")&&(n[1]+=" !important")})}:r=>{r.selector.startsWith(e)||(r.selector=`${e} ${t(r.selector)}`)}]}function Ja(e){return[...S(Xa(e).postprocess),...Za(e.important)]}var Z={l:["-left"],r:["-right"],t:["-top"],b:["-bottom"],s:["-inline-start"],e:["-inline-end"],x:["-left","-right"],y:["-top","-bottom"],"":[""],bs:["-block-start"],be:["-block-end"],is:["-inline-start"],ie:["-inline-end"],block:["-block-start","-block-end"],inline:["-inline-start","-inline-end"]},wr={...Z,s:["-inset-inline-start"],start:["-inset-inline-start"],e:["-inset-inline-end"],end:["-inset-inline-end"],bs:["-inset-block-start"],be:["-inset-block-end"],is:["-inset-inline-start"],ie:["-inset-inline-end"],block:["-inset-block-start","-inset-block-end"],inline:["-inset-inline-start","-inset-inline-end"]},kr={l:["-top-left","-bottom-left"],r:["-top-right","-bottom-right"],t:["-top-left","-top-right"],b:["-bottom-left","-bottom-right"],tl:["-top-left"],lt:["-top-left"],tr:["-top-right"],rt:["-top-right"],bl:["-bottom-left"],lb:["-bottom-left"],br:["-bottom-right"],rb:["-bottom-right"],"":[""],bs:["-start-start","-start-end"],be:["-end-start","-end-end"],s:["-end-start","-start-start"],is:["-end-start","-start-start"],e:["-start-end","-end-end"],ie:["-start-end","-end-end"],ss:["-start-start"],"bs-is":["-start-start"],"is-bs":["-start-start"],se:["-start-end"],"bs-ie":["-start-end"],"ie-bs":["-start-end"],es:["-end-start"],"be-is":["-end-start"],"is-be":["-end-start"],ee:["-end-end"],"be-ie":["-end-end"],"ie-be":["-end-end"]},nc={x:["-x"],y:["-y"],z:["-z"],"":["-x","-y"]},oc=["x","y","z"],Qa=["top","top center","top left","top right","bottom","bottom center","bottom left","bottom right","left","left center","left top","left bottom","right","right center","right top","right bottom","center","center top","center bottom","center left","center right","center center"],q=Object.assign({},...Qa.map(e=>({[e.replace(/ /,"-")]:e})),...Qa.map(e=>({[e.replace(/\b(\w)\w+/g,"$1").replace(/ /,"")]:e}))),M=["inherit","initial","revert","revert-layer","unset"],ut=/^(calc|clamp|min|max)\s*\((.+)\)(.*)/,Sr=/^(var)\s*\((.+)\)(.*)/,Cr=/^(-?\d*(?:\.\d+)?)(px|pt|pc|%|r?(?:em|ex|lh|cap|ch|ic)|(?:[sld]?v|cq)(?:[whib]|min|max)|in|cm|mm|rpx)?$/i,ic=/^(-?\d*(?:\.\d+)?)$/,sc=/^(px|[sld]?v[wh])$/i,ac={px:1,vw:100,vh:100,svw:100,svh:100,dvw:100,dvh:100,lvh:100,lvw:100},cc=/^\[(color|image|length|size|position|quoted|string):/i,Tp=/,(?![^()]*\))/g,jp=["color","border-color","background-color","outline-color","text-decoration-color","flex-grow","flex","flex-shrink","caret-color","font","gap","opacity","visibility","z-index","font-weight","zoom","text-shadow","transform","box-shadow","border","background-position","left","right","top","bottom","object-position","max-height","min-height","max-width","min-width","height","width","border-width","margin","padding","outline-width","outline-offset","font-size","line-height","text-indent","vertical-align","border-spacing","letter-spacing","word-spacing","stroke","filter","backdrop-filter","fill","mask","mask-size","mask-border","clip-path","clip","border-radius"];function ce(e){return+e.toFixed(10)}function zp(e){let t=e.match(Cr);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(n&&!Number.isNaN(o))return`${ce(o)}${n}`}function Ap(e){if(e==="auto"||e==="a")return"auto"}function Pp(e){if(!e)return;if(sc.test(e))return`${ac[e]}${e}`;let t=e.match(Cr);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(!Number.isNaN(o))return o===0?"0":n?`${ce(o)}${n}`:`${ce(o/4)}rem`}function Op(e){if(sc.test(e))return`${ac[e]}${e}`;let t=e.match(Cr);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(!Number.isNaN(o))return n?`${ce(o)}${n}`:`${ce(o)}px`}function Vp(e){if(!ic.test(e))return;let t=Number.parseFloat(e);if(!Number.isNaN(t))return ce(t)}function Mp(e){if(e.endsWith("%")&&(e=e.slice(0,-1)),!ic.test(e))return;let t=Number.parseFloat(e);if(!Number.isNaN(t))return`${ce(t/100)}`}function Fp(e){if(!e)return;if(e==="full")return"100%";let[t,r]=e.split("/"),n=Number.parseFloat(t)/Number.parseFloat(r);if(!Number.isNaN(n))return n===0?"0":`${ce(n*100)}%`}function Rr(e,t){if(e&&e.startsWith("[")&&e.endsWith("]")){let r,n,o=e.match(cc);if(o?(t||(n=o[1]),r=e.slice(o[0].length,-1)):r=e.slice(1,-1),!r||r==='=""')return;r.startsWith("--")&&(r=`var(${r})`);let i=0;for(let s of r)if(s==="[")i+=1;else if(s==="]"&&(i-=1,i<0))return;if(i)return;switch(n){case"string":return r.replace(/(^|[^\\])_/g,"$1 ").replace(/\\_/g,"_");case"quoted":return r.replace(/(^|[^\\])_/g,"$1 ").replace(/\\_/g,"_").replace(/(["\\])/g,"\\$1").replace(/^(.+)$/,'"$1"')}return r.replace(/(url\(.*?\))/g,s=>s.replace(/_/g,"\\_")).replace(/(^|[^\\])_/g,"$1 ").replace(/\\_/g,"_").replace(/(?:calc|clamp|max|min)\((.*)/g,s=>{let a=[];return s.replace(/var\((--.+?)[,)]/g,(c,l)=>(a.push(l),c.replace(l,"--un-calc"))).replace(/(-?\d*\.?\d(?!-\d.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g,"$1 $2 ").replace(/--un-calc/g,()=>a.shift())})}}function _p(e){return Rr(e)}function Lp(e){return Rr(e,"color")}function Wp(e){return Rr(e,"length")}function Up(e){return Rr(e,"position")}function Bp(e){if(/^\$[^\s'"`;{}]/.test(e)){let[t,r]=e.slice(1).split(",");return`var(--${J(t)}${r?`, ${r}`:""})`}}function Ip(e){let t=e.match(/^(-?[0-9.]+)(s|ms)?$/i);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(!Number.isNaN(o))return o===0&&!n?"0s":n?`${ce(o)}${n}`:`${ce(o)}ms`}function Dp(e){let t=e.match(/^(-?[0-9.]+)(deg|rad|grad|turn)?$/i);if(!t)return;let[,r,n]=t,o=Number.parseFloat(r);if(!Number.isNaN(o))return o===0?"0":n?`${ce(o)}${n}`:`${ce(o)}deg`}function Np(e){if(M.includes(e))return e}function Kp(e){if(e.split(",").every(t=>jp.includes(t)))return e}function Gp(e){if(["top","left","right","bottom","center"].includes(e))return e}var lc={__proto__:null,auto:Ap,bracket:_p,bracketOfColor:Lp,bracketOfLength:Wp,bracketOfPosition:Up,cssvar:Bp,degree:Dp,fraction:Fp,global:Np,number:Vp,numberWithUnit:zp,percent:Mp,position:Gp,properties:Kp,px:Op,rem:Pp,time:Ip},fc=nr(lc),f=fc,io="$$mini-no-negative";function L(e){return([t,r,n],{theme:o})=>{let i=o.spacing?.[n||"DEFAULT"]??f.bracket.cssvar.global.auto.fraction.rem(n);if(i!=null)return Z[r].map(s=>[`${e}${s}`,i]);if(n?.startsWith("-")){let s=o.spacing?.[n.slice(1)];if(s!=null)return Z[r].map(a=>[`${e}${a}`,`calc(${s} * -1)`])}}}function ec(e,t,r="colors"){let n=e[r],o=-1;for(let i of t){if(o+=1,n&&typeof n!="string"){let s=t.slice(o).join("-").replace(/(-[a-z])/g,a=>a.slice(1).toUpperCase());if(n[s])return n[s];if(n[i]){n=n[i];continue}}return}return n}function tc(e,t,r){return ec(e,t,r)||ec(e,t,"colors")}function Er(e,t){let[r,n]=pe(e,"[","]",["/",":"])??[];if(r!=null){let o=(r.match(cc)??[])[1];if(o==null||o===t)return[r,n]}}function Ve(e,t,r){let n=Er(e,"color");if(!n)return;let[o,i]=n,s=o.replace(/([a-z])(\d)/g,"$1-$2").split(/-/g),[a]=s;if(!a)return;let c,l=f.bracketOfColor(o),u=l||o;if(f.numberWithUnit(u))return;if(/^#[\da-f]+$/i.test(u)?c=u:/^hex-[\da-fA-F]+$/.test(u)?c=`#${u.slice(4)}`:o.startsWith("$")&&(c=f.cssvar(o)),c=c||l,!c){let h=tc(t,[o],r);typeof h=="string"&&(c=h)}let d="DEFAULT";if(!c){let h=s,m,[g]=s.slice(-1);/^\d+$/.test(g)&&(d=m=g,h=s.slice(0,-1));let x=tc(t,h,r);typeof x=="object"?c=x[m??d]:typeof x=="string"&&!m&&(c=x)}return{opacity:i,name:a,no:d,color:c,cssColor:Y(c),alpha:f.bracket.cssvar.percent(i??"")}}function U(e,t,r,n){return([,o],{theme:i,generator:s})=>{let a=Ve(o??"",i,r);if(!a)return;let{alpha:c,color:l,cssColor:u}=a,h=s.config.envMode==="dev"&&l?` /* ${l} */`:"",m={};if(u)if(c!=null)m[e]=j(u,c)+h;else{let g=`--un-${t}-opacity`,x=j(u,`var(${g})`);x.includes(g)&&(m[g]=ie(u)),m[e]=x+h}else if(l)if(c!=null)m[e]=j(l,c)+h;else{let g=`--un-${t}-opacity`,x=j(l,`var(${g})`);x.includes(g)&&(m[g]=1),m[e]=x+h}if(n?.(m)!==!1)return m}}function Me(e,t){let r=[];e=S(e);for(let n=0;n<e.length;n++){let o=Ee(e[n]," ",6);if(!o||o.length<3)return e;let i=!1,s=o.indexOf("inset");s!==-1&&(o.splice(s,1),i=!0);let a="",c=o.at(-1);if(Y(o.at(0))){let l=Y(o.shift());l&&(a=`, ${j(l)}`)}else if(Y(c)){let l=Y(o.pop());l&&(a=`, ${j(l)}`)}else c&&Sr.test(c)&&(a=`, ${o.pop()}`);r.push(`${i?"inset ":""}${o.join(" ")} var(${t}${a})`)}return r}function Fe(e,t,r){return e!=null&&!!Ve(e,t,r)?.color}var rc=/[a-z]+/gi,oo=new WeakMap;function Te({theme:e,generator:t},r="breakpoints"){let n=t?.userConfig?.theme?.[r]||e[r];if(!n)return;if(oo.has(e))return oo.get(e);let o=Object.entries(n).sort((i,s)=>Number.parseInt(i[1].replace(rc,""))-Number.parseInt(s[1].replace(rc,""))).map(([i,s])=>({point:i,size:s}));return oo.set(e,o),o}function $(e,t){return M.map(r=>[`${e}-${r}`,{[t??e]:r}])}function ke(e){return e!=null&&ut.test(e)}function so(e){return e[0]==="["&&e.slice(-1)==="]"&&(e=e.slice(1,-1)),ut.test(e)||Cr.test(e)}function pt(e,t,r){let n=t.split(Tp);return e||!e&&n.length===1?nc[e].map(o=>[`--un-${r}${o}`,t]):n.map((o,i)=>[`--un-${r}-${oc[i]}`,o])}var uc=[[/^(?:animate-)?keyframes-(.+)$/,([,e],{theme:t})=>{let r=t.animation?.keyframes?.[e];if(r)return[`@keyframes ${e}${r}`,{animation:e}]},{autocomplete:["animate-keyframes-$animation.keyframes","keyframes-$animation.keyframes"]}],[/^animate-(.+)$/,([,e],{theme:t})=>{let r=t.animation?.keyframes?.[e];if(r){let n=t.animation?.durations?.[e]??"1s",o=t.animation?.timingFns?.[e]??"linear",i=t.animation?.counts?.[e]??1,s=t.animation?.properties?.[e];return[`@keyframes ${e}${r}`,{animation:`${e} ${n} ${o} ${i}`,...s}]}return{animation:f.bracket.cssvar(e)}},{autocomplete:"animate-$animation.keyframes"}],[/^animate-name-(.+)/,([,e])=>({"animation-name":f.bracket.cssvar(e)??e})],[/^animate-duration-(.+)$/,([,e],{theme:t})=>({"animation-duration":t.duration?.[e||"DEFAULT"]??f.bracket.cssvar.time(e)}),{autocomplete:["animate-duration","animate-duration-$duration"]}],[/^animate-delay-(.+)$/,([,e],{theme:t})=>({"animation-delay":t.duration?.[e||"DEFAULT"]??f.bracket.cssvar.time(e)}),{autocomplete:["animate-delay","animate-delay-$duration"]}],[/^animate-ease(?:-(.+))?$/,([,e],{theme:t})=>({"animation-timing-function":t.easing?.[e||"DEFAULT"]??f.bracket.cssvar(e)}),{autocomplete:["animate-ease","animate-ease-$easing"]}],[/^animate-(fill-mode-|fill-|mode-)?(.+)$/,([,e,t])=>["none","forwards","backwards","both",e?M:[]].includes(t)?{"animation-fill-mode":t}:void 0,{autocomplete:["animate-(fill|mode|fill-mode)","animate-(fill|mode|fill-mode)-(none|forwards|backwards|both|inherit|initial|revert|revert-layer|unset)","animate-(none|forwards|backwards|both|inherit|initial|revert|revert-layer|unset)"]}],[/^animate-(direction-)?(.+)$/,([,e,t])=>["normal","reverse","alternate","alternate-reverse",e?M:[]].includes(t)?{"animation-direction":t}:void 0,{autocomplete:["animate-direction","animate-direction-(normal|reverse|alternate|alternate-reverse|inherit|initial|revert|revert-layer|unset)","animate-(normal|reverse|alternate|alternate-reverse|inherit|initial|revert|revert-layer|unset)"]}],[/^animate-(?:iteration-count-|iteration-|count-)(.+)$/,([,e])=>({"animation-iteration-count":f.bracket.cssvar(e)??e.replace(/-/g,",")}),{autocomplete:["animate-(iteration|count|iteration-count)","animate-(iteration|count|iteration-count)-<num>"]}],[/^animate-(play-state-|play-|state-)?(.+)$/,([,e,t])=>["paused","running",e?M:[]].includes(t)?{"animation-play-state":t}:void 0,{autocomplete:["animate-(play|state|play-state)","animate-(play|state|play-state)-(paused|running|inherit|initial|revert|revert-layer|unset)","animate-(paused|running|inherit|initial|revert|revert-layer|unset)"]}],["animate-none",{animation:"none"}],...$("animate","animation")];function pc(e){return e?j(e,0):"rgb(255 255 255 / 0)"}function Hp(e,t,r,n){return t?n!=null?j(t,n):j(t,`var(--un-${e}-opacity, ${ie(t)})`):j(r,n)}function ao(){return([,e,t],{theme:r})=>{let n=Ve(t,r,"backgroundColor");if(!n)return;let{alpha:o,color:i,cssColor:s}=n;if(!i)return;let a=Hp(e,s,i,o);switch(e){case"from":return{"--un-gradient-from-position":"0%","--un-gradient-from":`${a} var(--un-gradient-from-position)`,"--un-gradient-to-position":"100%","--un-gradient-to":`${pc(s)} var(--un-gradient-to-position)`,"--un-gradient-stops":"var(--un-gradient-from), var(--un-gradient-to)"};case"via":return{"--un-gradient-via-position":"50%","--un-gradient-to":pc(s),"--un-gradient-stops":`var(--un-gradient-from), ${a} var(--un-gradient-via-position), var(--un-gradient-to)`};case"to":return{"--un-gradient-to-position":"100%","--un-gradient-to":`${a} var(--un-gradient-to-position)`}}}}function qp(){return([,e,t])=>({[`--un-gradient-${e}-position`]:`${Number(f.bracket.cssvar.percent(t))*100}%`})}var dc=[[/^bg-gradient-(.+)$/,([,e])=>({"--un-gradient":f.bracket(e)}),{autocomplete:["bg-gradient","bg-gradient-(from|to|via)","bg-gradient-(from|to|via)-$colors","bg-gradient-(from|to|via)-(op|opacity)","bg-gradient-(from|to|via)-(op|opacity)-<percent>"]}],[/^(?:bg-gradient-)?stops-(\[.+\])$/,([,e])=>({"--un-gradient-stops":f.bracket(e)})],[/^(?:bg-gradient-)?(from)-(.+)$/,ao()],[/^(?:bg-gradient-)?(via)-(.+)$/,ao()],[/^(?:bg-gradient-)?(to)-(.+)$/,ao()],[/^(?:bg-gradient-)?(from|via|to)-op(?:acity)?-?(.+)$/,([,e,t])=>({[`--un-${e}-opacity`]:f.bracket.percent(t)})],[/^(from|via|to)-([\d.]+)%$/,qp()],[/^bg-gradient-((?:repeating-)?(?:linear|radial|conic))$/,([,e])=>({"background-image":`${e}-gradient(var(--un-gradient, var(--un-gradient-stops, rgb(255 255 255 / 0))))`}),{autocomplete:["bg-gradient-repeating","bg-gradient-(linear|radial|conic)","bg-gradient-repeating-(linear|radial|conic)"]}],[/^bg-gradient-to-([rltb]{1,2})$/,([,e])=>{if(e in q)return{"--un-gradient-shape":`to ${q[e]} in oklch`,"--un-gradient":"var(--un-gradient-shape), var(--un-gradient-stops)","background-image":"linear-gradient(var(--un-gradient))"}},{autocomplete:`bg-gradient-to-(${Object.keys(q).filter(e=>e.length<=2&&Array.from(e).every(t=>"rltb".includes(t))).join("|")})`}],[/^(?:bg-gradient-)?shape-(.+)$/,([,e])=>{let t=e in q?`to ${q[e]}`:f.bracket(e);if(t!=null)return{"--un-gradient-shape":`${t} in oklch`,"--un-gradient":"var(--un-gradient-shape), var(--un-gradient-stops)"}},{autocomplete:["bg-gradient-shape",`bg-gradient-shape-(${Object.keys(q).join("|")})`,`shape-(${Object.keys(q).join("|")})`]}],["bg-none",{"background-image":"none"}],["box-decoration-slice",{"box-decoration-break":"slice"}],["box-decoration-clone",{"box-decoration-break":"clone"}],...$("box-decoration","box-decoration-break"),["bg-auto",{"background-size":"auto"}],["bg-cover",{"background-size":"cover"}],["bg-contain",{"background-size":"contain"}],["bg-fixed",{"background-attachment":"fixed"}],["bg-local",{"background-attachment":"local"}],["bg-scroll",{"background-attachment":"scroll"}],["bg-clip-border",{"-webkit-background-clip":"border-box","background-clip":"border-box"}],["bg-clip-content",{"-webkit-background-clip":"content-box","background-clip":"content-box"}],["bg-clip-padding",{"-webkit-background-clip":"padding-box","background-clip":"padding-box"}],["bg-clip-text",{"-webkit-background-clip":"text","background-clip":"text"}],...M.map(e=>[`bg-clip-${e}`,{"-webkit-background-clip":e,"background-clip":e}]),[/^bg-([-\w]{3,})$/,([,e])=>({"background-position":q[e]})],["bg-repeat",{"background-repeat":"repeat"}],["bg-no-repeat",{"background-repeat":"no-repeat"}],["bg-repeat-x",{"background-repeat":"repeat-x"}],["bg-repeat-y",{"background-repeat":"repeat-y"}],["bg-repeat-round",{"background-repeat":"round"}],["bg-repeat-space",{"background-repeat":"space"}],...$("bg-repeat","background-repeat"),["bg-origin-border",{"background-origin":"border-box"}],["bg-origin-padding",{"background-origin":"padding-box"}],["bg-origin-content",{"background-origin":"content-box"}],...$("bg-origin","background-origin")];var co={disc:"disc",circle:"circle",square:"square",decimal:"decimal","zero-decimal":"decimal-leading-zero",greek:"lower-greek",roman:"lower-roman","upper-roman":"upper-roman",alpha:"lower-alpha","upper-alpha":"upper-alpha",latin:"lower-latin","upper-latin":"upper-latin"},mc=[[/^list-(.+?)(?:-(outside|inside))?$/,([,e,t])=>{let r=co[e];if(r)return t?{"list-style-position":t,"list-style-type":r}:{"list-style-type":r}},{autocomplete:[`list-(${Object.keys(co).join("|")})`,`list-(${Object.keys(co).join("|")})-(outside|inside)`]}],["list-outside",{"list-style-position":"outside"}],["list-inside",{"list-style-position":"inside"}],["list-none",{"list-style-type":"none"}],[/^list-image-(.+)$/,([,e])=>{if(/^\[url\(.+\)\]$/.test(e))return{"list-style-image":f.bracket(e)}}],["list-image-none",{"list-style-image":"none"}],...$("list","list-style-type")],gc=[[/^accent-(.+)$/,U("accent-color","accent","accentColor"),{autocomplete:"accent-$colors"}],[/^accent-op(?:acity)?-?(.+)$/,([,e])=>({"--un-accent-opacity":f.bracket.percent(e)}),{autocomplete:["accent-(op|opacity)","accent-(op|opacity)-<percent>"]}]],hc=[[/^caret-(.+)$/,U("caret-color","caret","textColor"),{autocomplete:"caret-$colors"}],[/^caret-op(?:acity)?-?(.+)$/,([,e])=>({"--un-caret-opacity":f.bracket.percent(e)}),{autocomplete:["caret-(op|opacity)","caret-(op|opacity)-<percent>"]}]],bc=[["image-render-auto",{"image-rendering":"auto"}],["image-render-edge",{"image-rendering":"crisp-edges"}],["image-render-pixel",[["-ms-interpolation-mode","nearest-neighbor"],["image-rendering","-webkit-optimize-contrast"],["image-rendering","-moz-crisp-edges"],["image-rendering","-o-pixelated"],["image-rendering","pixelated"]]]],xc=[["overscroll-auto",{"overscroll-behavior":"auto"}],["overscroll-contain",{"overscroll-behavior":"contain"}],["overscroll-none",{"overscroll-behavior":"none"}],...$("overscroll","overscroll-behavior"),["overscroll-x-auto",{"overscroll-behavior-x":"auto"}],["overscroll-x-contain",{"overscroll-behavior-x":"contain"}],["overscroll-x-none",{"overscroll-behavior-x":"none"}],...$("overscroll-x","overscroll-behavior-x"),["overscroll-y-auto",{"overscroll-behavior-y":"auto"}],["overscroll-y-contain",{"overscroll-behavior-y":"contain"}],["overscroll-y-none",{"overscroll-behavior-y":"none"}],...$("overscroll-y","overscroll-behavior-y")],yc=[["scroll-auto",{"scroll-behavior":"auto"}],["scroll-smooth",{"scroll-behavior":"smooth"}],...$("scroll","scroll-behavior")];var vc=[[/^columns-(.+)$/,([,e])=>({columns:f.bracket.global.number.auto.numberWithUnit(e)}),{autocomplete:"columns-<num>"}],["break-before-auto",{"break-before":"auto"}],["break-before-avoid",{"break-before":"avoid"}],["break-before-all",{"break-before":"all"}],["break-before-avoid-page",{"break-before":"avoid-page"}],["break-before-page",{"break-before":"page"}],["break-before-left",{"break-before":"left"}],["break-before-right",{"break-before":"right"}],["break-before-column",{"break-before":"column"}],...$("break-before"),["break-inside-auto",{"break-inside":"auto"}],["break-inside-avoid",{"break-inside":"avoid"}],["break-inside-avoid-page",{"break-inside":"avoid-page"}],["break-inside-avoid-column",{"break-inside":"avoid-column"}],...$("break-inside"),["break-after-auto",{"break-after":"auto"}],["break-after-avoid",{"break-after":"avoid"}],["break-after-all",{"break-after":"all"}],["break-after-avoid-page",{"break-after":"avoid-page"}],["break-after-page",{"break-after":"page"}],["break-after-left",{"break-after":"left"}],["break-after-right",{"break-after":"right"}],["break-after-column",{"break-after":"column"}],...$("break-after")];var Yp=/@media \(min-width: (.+)\)/,$c=[[/^__container$/,(e,t)=>{let{theme:r,variantHandlers:n}=t,o=r.container?.padding,i;F(o)?i=o:i=o?.DEFAULT;let s=r.container?.maxWidth,a;for(let l of n){let u=l.handle?.({},d=>d)?.parent;if(F(u)){let d=u.match(Yp)?.[1];if(d){let m=(Te(t)??[]).find(g=>g.size===d)?.point;s?m&&(a=s?.[m]):a=d,m&&!F(o)&&(i=o?.[m]??i)}}}let c={"max-width":a};return n.length||(c.width="100%"),r.container?.center&&(c["margin-left"]="auto",c["margin-right"]="auto"),o&&(c["padding-left"]=i,c["padding-right"]=i),c},{internal:!0}]],wc=[[/^(?:(\w+)[:-])?container$/,([,e],t)=>{let r=(Te(t)??[]).map(o=>o.point);if(e){if(!r.includes(e))return;r=r.slice(r.indexOf(e))}let n=r.map(o=>`${o}:__container`);return e||n.unshift("__container"),n}]];var Xp=["auto","default","none","context-menu","help","pointer","progress","wait","cell","crosshair","text","vertical-text","alias","copy","move","no-drop","not-allowed","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out"],Zp=["none","strict","content","size","inline-size","layout","style","paint"],T=" ",dt=[["inline",{display:"inline"}],["block",{display:"block"}],["inline-block",{display:"inline-block"}],["contents",{display:"contents"}],["flow-root",{display:"flow-root"}],["list-item",{display:"list-item"}],["hidden",{display:"none"}],[/^display-(.+)$/,([,e])=>({display:f.bracket.cssvar.global(e)})]],mt=[["visible",{visibility:"visible"}],["invisible",{visibility:"hidden"}],["backface-visible",{"backface-visibility":"visible"}],["backface-hidden",{"backface-visibility":"hidden"}],...$("backface","backface-visibility")],gt=[[/^cursor-(.+)$/,([,e])=>({cursor:f.bracket.cssvar.global(e)})],...Xp.map(e=>[`cursor-${e}`,{cursor:e}])],ht=[[/^contain-(.*)$/,([,e])=>f.bracket(e)!=null?{contain:f.bracket(e).split(" ").map(t=>f.cssvar.fraction(t)??t).join(" ")}:Zp.includes(e)?{contain:e}:void 0]],bt=[["pointer-events-auto",{"pointer-events":"auto"}],["pointer-events-none",{"pointer-events":"none"}],...$("pointer-events")],xt=[["resize-x",{resize:"horizontal"}],["resize-y",{resize:"vertical"}],["resize",{resize:"both"}],["resize-none",{resize:"none"}],...$("resize")],yt=[["select-auto",{"-webkit-user-select":"auto","user-select":"auto"}],["select-all",{"-webkit-user-select":"all","user-select":"all"}],["select-text",{"-webkit-user-select":"text","user-select":"text"}],["select-none",{"-webkit-user-select":"none","user-select":"none"}],...$("select","user-select")],vt=[[/^(?:whitespace-|ws-)([-\w]+)$/,([,e])=>["normal","nowrap","pre","pre-line","pre-wrap","break-spaces",...M].includes(e)?{"white-space":e}:void 0,{autocomplete:"(whitespace|ws)-(normal|nowrap|pre|pre-line|pre-wrap|break-spaces)"}]],$t=[[/^intrinsic-size-(.+)$/,([,e])=>({"contain-intrinsic-size":f.bracket.cssvar.global.fraction.rem(e)}),{autocomplete:"intrinsic-size-<num>"}],["content-visibility-visible",{"content-visibility":"visible"}],["content-visibility-hidden",{"content-visibility":"hidden"}],["content-visibility-auto",{"content-visibility":"auto"}],...$("content-visibility")],wt=[[/^content-(.+)$/,([,e])=>({content:f.bracket.cssvar(e)})],["content-empty",{content:'""'}],["content-none",{content:"none"}]],kt=[["break-normal",{"overflow-wrap":"normal","word-break":"normal"}],["break-words",{"overflow-wrap":"break-word"}],["break-all",{"word-break":"break-all"}],["break-keep",{"word-break":"keep-all"}],["break-anywhere",{"overflow-wrap":"anywhere"}]],St=[["text-wrap",{"text-wrap":"wrap"}],["text-nowrap",{"text-wrap":"nowrap"}],["text-balance",{"text-wrap":"balance"}],["text-pretty",{"text-wrap":"pretty"}]],Ct=[["truncate",{overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap"}],["text-truncate",{overflow:"hidden","text-overflow":"ellipsis","white-space":"nowrap"}],["text-ellipsis",{"text-overflow":"ellipsis"}],["text-clip",{"text-overflow":"clip"}]],Rt=[["case-upper",{"text-transform":"uppercase"}],["case-lower",{"text-transform":"lowercase"}],["case-capital",{"text-transform":"capitalize"}],["case-normal",{"text-transform":"none"}],...$("case","text-transform")],Et=[["italic",{"font-style":"italic"}],["not-italic",{"font-style":"normal"}],["font-italic",{"font-style":"italic"}],["font-not-italic",{"font-style":"normal"}],["oblique",{"font-style":"oblique"}],["not-oblique",{"font-style":"normal"}],["font-oblique",{"font-style":"oblique"}],["font-not-oblique",{"font-style":"normal"}]],Tt=[["antialiased",{"-webkit-font-smoothing":"antialiased","-moz-osx-font-smoothing":"grayscale"}],["subpixel-antialiased",{"-webkit-font-smoothing":"auto","-moz-osx-font-smoothing":"auto"}]],jt=[["field-sizing-fixed",{"field-sizing":"fixed"}],["field-sizing-content",{"field-sizing":"content"}]],Ge={"--un-ring-inset":T,"--un-ring-offset-width":"0px","--un-ring-offset-color":"#fff","--un-ring-width":"0px","--un-ring-color":"rgb(147 197 253 / 0.5)","--un-shadow":"0 0 rgb(0 0 0 / 0)"},Jp=Object.keys(Ge),zt=[[/^ring(?:-(.+))?$/,([,e],{theme:t})=>{let r=t.ringWidth?.[e||"DEFAULT"]??f.px(e||"1");if(r)return{"--un-ring-width":r,"--un-ring-offset-shadow":"var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color)","--un-ring-shadow":"var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color)","box-shadow":"var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"}},{custom:{preflightKeys:Jp},autocomplete:"ring-$ringWidth"}],[/^ring-(?:width-|size-)(.+)$/,Ec,{autocomplete:"ring-(width|size)-$lineWidth"}],["ring-offset",{"--un-ring-offset-width":"1px"}],[/^ring-offset-(?:width-|size-)?(.+)$/,([,e],{theme:t})=>({"--un-ring-offset-width":t.lineWidth?.[e]??f.bracket.cssvar.px(e)}),{autocomplete:"ring-offset-(width|size)-$lineWidth"}],[/^ring-(.+)$/,Qp,{autocomplete:"ring-$colors"}],[/^ring-op(?:acity)?-?(.+)$/,([,e])=>({"--un-ring-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"ring-(op|opacity)-<percent>"}],[/^ring-offset-(.+)$/,U("--un-ring-offset-color","ring-offset","borderColor"),{autocomplete:"ring-offset-$colors"}],[/^ring-offset-op(?:acity)?-?(.+)$/,([,e])=>({"--un-ring-offset-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"ring-offset-(op|opacity)-<percent>"}],["ring-inset",{"--un-ring-inset":"inset"}]];function Ec([,e],{theme:t}){return{"--un-ring-width":t.ringWidth?.[e]??f.bracket.cssvar.px(e)}}function Qp(e,t){return ke(f.bracket(e[1]))?Ec(e,t):U("--un-ring-color","ring","borderColor")(e,t)}var He={"--un-ring-offset-shadow":"0 0 rgb(0 0 0 / 0)","--un-ring-shadow":"0 0 rgb(0 0 0 / 0)","--un-shadow-inset":T,"--un-shadow":"0 0 rgb(0 0 0 / 0)"},ed=Object.keys(He),At=[[/^shadow(?:-(.+))?$/,(e,t)=>{let[,r]=e,{theme:n}=t,o=n.boxShadow?.[r||"DEFAULT"],i=r?f.bracket.cssvar(r):void 0;return(o!=null||i!=null)&&!Fe(i,n,"shadowColor")?{"--un-shadow":Me(o||i,"--un-shadow-color").join(","),"box-shadow":"var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)"}:U("--un-shadow-color","shadow","shadowColor")(e,t)},{custom:{preflightKeys:ed},autocomplete:["shadow-$colors","shadow-$boxShadow"]}],[/^shadow-op(?:acity)?-?(.+)$/,([,e])=>({"--un-shadow-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"shadow-(op|opacity)-<percent>"}],["shadow-inset",{"--un-shadow-inset":"inset"}]],Tr=["translate","rotate","scale"],td=["translateX(var(--un-translate-x))","translateY(var(--un-translate-y))","rotate(var(--un-rotate))","rotateZ(var(--un-rotate-z))","skewX(var(--un-skew-x))","skewY(var(--un-skew-y))","scaleX(var(--un-scale-x))","scaleY(var(--un-scale-y))"].join(" "),Ke=["translateX(var(--un-translate-x))","translateY(var(--un-translate-y))","translateZ(var(--un-translate-z))","rotate(var(--un-rotate))","rotateX(var(--un-rotate-x))","rotateY(var(--un-rotate-y))","rotateZ(var(--un-rotate-z))","skewX(var(--un-skew-x))","skewY(var(--un-skew-y))","scaleX(var(--un-scale-x))","scaleY(var(--un-scale-y))","scaleZ(var(--un-scale-z))"].join(" "),rd=["translate3d(var(--un-translate-x), var(--un-translate-y), var(--un-translate-z))","rotate(var(--un-rotate))","rotateX(var(--un-rotate-x))","rotateY(var(--un-rotate-y))","rotateZ(var(--un-rotate-z))","skewX(var(--un-skew-x))","skewY(var(--un-skew-y))","scaleX(var(--un-scale-x))","scaleY(var(--un-scale-y))","scaleZ(var(--un-scale-z))"].join(" "),qe={"--un-rotate":0,"--un-rotate-x":0,"--un-rotate-y":0,"--un-rotate-z":0,"--un-scale-x":1,"--un-scale-y":1,"--un-scale-z":1,"--un-skew-x":0,"--un-skew-y":0,"--un-translate-x":0,"--un-translate-y":0,"--un-translate-z":0},xe=Object.keys(qe),Pt=[[/^(?:transform-)?origin-(.+)$/,([,e])=>({"transform-origin":q[e]??f.bracket.cssvar(e)}),{autocomplete:[`transform-origin-(${Object.keys(q).join("|")})`,`origin-(${Object.keys(q).join("|")})`]}],[/^(?:transform-)?perspect(?:ive)?-(.+)$/,([,e])=>{let t=f.bracket.cssvar.px.numberWithUnit(e);if(t!=null)return{"-webkit-perspective":t,perspective:t}}],[/^(?:transform-)?perspect(?:ive)?-origin-(.+)$/,([,e])=>{let t=f.bracket.cssvar(e)??(e.length>=3?q[e]:void 0);if(t!=null)return{"-webkit-perspective-origin":t,"perspective-origin":t}}],[/^(?:transform-)?translate-()(.+)$/,kc,{custom:{preflightKeys:xe}}],[/^(?:transform-)?translate-([xyz])-(.+)$/,kc,{custom:{preflightKeys:xe}}],[/^(?:transform-)?rotate-()(.+)$/,Cc,{custom:{preflightKeys:xe}}],[/^(?:transform-)?rotate-([xyz])-(.+)$/,Cc,{custom:{preflightKeys:xe}}],[/^(?:transform-)?skew-()(.+)$/,Rc,{custom:{preflightKeys:xe}}],[/^(?:transform-)?skew-([xy])-(.+)$/,Rc,{custom:{preflightKeys:xe},autocomplete:["transform-skew-(x|y)-<percent>","skew-(x|y)-<percent>"]}],[/^(?:transform-)?scale-()(.+)$/,Sc,{custom:{preflightKeys:xe}}],[/^(?:transform-)?scale-([xyz])-(.+)$/,Sc,{custom:{preflightKeys:xe},autocomplete:[`transform-(${Tr.join("|")})-<percent>`,`transform-(${Tr.join("|")})-(x|y|z)-<percent>`,`(${Tr.join("|")})-<percent>`,`(${Tr.join("|")})-(x|y|z)-<percent>`]}],[/^(?:transform-)?preserve-3d$/,()=>({"transform-style":"preserve-3d"})],[/^(?:transform-)?preserve-flat$/,()=>({"transform-style":"flat"})],["transform",{transform:Ke},{custom:{preflightKeys:xe}}],["transform-cpu",{transform:td},{custom:{preflightKeys:["--un-translate-x","--un-translate-y","--un-rotate","--un-rotate-z","--un-skew-x","--un-skew-y","--un-scale-x","--un-scale-y"]}}],["transform-gpu",{transform:rd},{custom:{preflightKeys:xe}}],["transform-none",{transform:"none"}],...$("transform")];function kc([,e,t],{theme:r}){let n=r.spacing?.[t]??f.bracket.cssvar.fraction.rem(t);if(n!=null)return[...pt(e,n,"translate"),["transform",Ke]]}function Sc([,e,t]){let r=f.bracket.cssvar.fraction.percent(t);if(r!=null)return[...pt(e,r,"scale"),["transform",Ke]]}function Cc([,e="",t]){let r=f.bracket.cssvar.degree(t);if(r!=null)return e?{"--un-rotate":0,[`--un-rotate-${e}`]:r,transform:Ke}:{"--un-rotate-x":0,"--un-rotate-y":0,"--un-rotate-z":0,"--un-rotate":r,transform:Ke}}function Rc([,e,t]){let r=f.bracket.cssvar.degree(t);if(r!=null)return[...pt(e,r,"skew"),["transform",Ke]]}var Tc={mid:"middle",base:"baseline",btm:"bottom",baseline:"baseline",top:"top",start:"top",middle:"middle",bottom:"bottom",end:"bottom","text-top":"text-top","text-bottom":"text-bottom",sub:"sub",super:"super",...Object.fromEntries(M.map(e=>[e,e]))},Ar=[[/^(?:vertical|align|v)-(.+)$/,([,e])=>({"vertical-align":Tc[e]??f.bracket.cssvar.numberWithUnit(e)}),{autocomplete:[`(vertical|align|v)-(${Object.keys(Tc).join("|")})`,"(vertical|align|v)-<percentage>"]}]],jc=["center","left","right","justify","start","end"],Pr=[...jc.map(e=>[`text-${e}`,{"text-align":e}]),...[...M,...jc].map(e=>[`text-align-${e}`,{"text-align":e}])],Or=[[/^outline-(?:width-|size-)?(.+)$/,Vc,{autocomplete:"outline-(width|size)-<num>"}],[/^outline-(?:color-)?(.+)$/,nd,{autocomplete:"outline-$colors"}],[/^outline-offset-(.+)$/,([,e],{theme:t})=>({"outline-offset":t.lineWidth?.[e]??f.bracket.cssvar.global.px(e)}),{autocomplete:"outline-(offset)-<num>"}],["outline",{"outline-style":"solid"}],...["auto","dashed","dotted","double","hidden","solid","groove","ridge","inset","outset",...M].map(e=>[`outline-${e}`,{"outline-style":e}]),["outline-none",{outline:"2px solid transparent","outline-offset":"2px"}]];function Vc([,e],{theme:t}){return{"outline-width":t.lineWidth?.[e]??f.bracket.cssvar.global.px(e)}}function nd(e,t){return ke(f.bracket(e[1]))?Vc(e,t):U("outline-color","outline-color","borderColor")(e,t)}var Vr=[["appearance-auto",{"-webkit-appearance":"auto",appearance:"auto"}],["appearance-none",{"-webkit-appearance":"none",appearance:"none"}]];function od(e){return f.properties.auto.global(e)??{contents:"contents",scroll:"scroll-position"}[e]}var Mr=[[/^will-change-(.+)/,([,e])=>({"will-change":od(e)})]],je=["solid","dashed","dotted","double","hidden","none","groove","ridge","inset","outset",...M],Fr=[[/^(?:border|b)()(?:-(.+))?$/,me,{autocomplete:"(border|b)-<directions>"}],[/^(?:border|b)-([xy])(?:-(.+))?$/,me],[/^(?:border|b)-([rltbse])(?:-(.+))?$/,me],[/^(?:border|b)-(block|inline)(?:-(.+))?$/,me],[/^(?:border|b)-([bi][se])(?:-(.+))?$/,me],[/^(?:border|b)-()(?:width|size)-(.+)$/,me,{autocomplete:["(border|b)-<num>","(border|b)-<directions>-<num>"]}],[/^(?:border|b)-([xy])-(?:width|size)-(.+)$/,me],[/^(?:border|b)-([rltbse])-(?:width|size)-(.+)$/,me],[/^(?:border|b)-(block|inline)-(?:width|size)-(.+)$/,me],[/^(?:border|b)-([bi][se])-(?:width|size)-(.+)$/,me],[/^(?:border|b)-()(?:color-)?(.+)$/,Ot,{autocomplete:["(border|b)-$colors","(border|b)-<directions>-$colors"]}],[/^(?:border|b)-([xy])-(?:color-)?(.+)$/,Ot],[/^(?:border|b)-([rltbse])-(?:color-)?(.+)$/,Ot],[/^(?:border|b)-(block|inline)-(?:color-)?(.+)$/,Ot],[/^(?:border|b)-([bi][se])-(?:color-)?(.+)$/,Ot],[/^(?:border|b)-()op(?:acity)?-?(.+)$/,Vt,{autocomplete:"(border|b)-(op|opacity)-<percent>"}],[/^(?:border|b)-([xy])-op(?:acity)?-?(.+)$/,Vt],[/^(?:border|b)-([rltbse])-op(?:acity)?-?(.+)$/,Vt],[/^(?:border|b)-(block|inline)-op(?:acity)?-?(.+)$/,Vt],[/^(?:border|b)-([bi][se])-op(?:acity)?-?(.+)$/,Vt],[/^(?:border-|b-)?(?:rounded|rd)()(?:-(.+))?$/,Mt,{autocomplete:["(border|b)-(rounded|rd)","(border|b)-(rounded|rd)-$borderRadius","(rounded|rd)","(rounded|rd)-$borderRadius"]}],[/^(?:border-|b-)?(?:rounded|rd)-([rltbse])(?:-(.+))?$/,Mt],[/^(?:border-|b-)?(?:rounded|rd)-([rltb]{2})(?:-(.+))?$/,Mt],[/^(?:border-|b-)?(?:rounded|rd)-([bise][se])(?:-(.+))?$/,Mt],[/^(?:border-|b-)?(?:rounded|rd)-([bi][se]-[bi][se])(?:-(.+))?$/,Mt],[/^(?:border|b)-(?:style-)?()(.+)$/,Ye,{autocomplete:["(border|b)-style",`(border|b)-(${je.join("|")})`,"(border|b)-<directions>-style",`(border|b)-<directions>-(${je.join("|")})`,`(border|b)-<directions>-style-(${je.join("|")})`,`(border|b)-style-(${je.join("|")})`]}],[/^(?:border|b)-([xy])-(?:style-)?(.+)$/,Ye],[/^(?:border|b)-([rltbse])-(?:style-)?(.+)$/,Ye],[/^(?:border|b)-(block|inline)-(?:style-)?(.+)$/,Ye],[/^(?:border|b)-([bi][se])-(?:style-)?(.+)$/,Ye]];function zc(e,t,r){if(t!=null)return{[`border${r}-color`]:j(e,t)};if(r===""){let n={},o="--un-border-opacity",i=j(e,`var(${o})`);return i.includes(o)&&(n[o]=typeof e=="string"?1:ie(e)),n["border-color"]=i,n}else{let n={},o="--un-border-opacity",i=`--un-border${r}-opacity`,s=j(e,`var(${i})`);return s.includes(i)&&(n[o]=typeof e=="string"?1:ie(e),n[i]=`var(${o})`),n[`border${r}-color`]=s,n}}function id(e){return([,t],r)=>{let n=Ve(t,r,"borderColor");if(!n)return;let{alpha:o,color:i,cssColor:s}=n;if(s)return zc(s,o,e);if(i)return zc(i,o,e)}}function me([,e="",t],{theme:r}){let n=r.lineWidth?.[t||"DEFAULT"]??f.bracket.cssvar.global.px(t||"1");if(e in Z&&n!=null)return Z[e].map(o=>[`border${o}-width`,n])}function Ot([,e="",t],r){if(e in Z){if(ke(f.bracket(t)))return me(["",e,t],r);if(Fe(t,r.theme,"borderColor"))return Object.assign({},...Z[e].map(n=>id(n)(["",t],r.theme)))}}function Vt([,e="",t]){let r=f.bracket.percent.cssvar(t);if(e in Z&&r!=null)return Z[e].map(n=>[`--un-border${n}-opacity`,r])}function Mt([,e="",t],{theme:r}){let n=r.borderRadius?.[t||"DEFAULT"]||f.bracket.cssvar.global.fraction.rem(t||"1");if(e in kr&&n!=null)return kr[e].map(o=>[`border${o}-radius`,n])}function Ye([,e="",t]){if(je.includes(t)&&e in Z)return Z[e].map(r=>[`border${r}-style`,t])}var _r=[[/^op(?:acity)?-?(.+)$/,([,e])=>({opacity:f.bracket.percent.cssvar(e)})]],sd=/^\[url\(.+\)\]$/,ad=/^\[(?:length|size):.+\]$/,cd=/^\[position:.+\]$/,ld=/^\[(?:linear|conic|radial)-gradient\(.+\)\]$/,fd=/^\[image:.+\]$/,Lr=[[/^bg-(.+)$/,(...e)=>{let t=e[0][1];if(sd.test(t))return{"--un-url":f.bracket(t),"background-image":"var(--un-url)"};if(ad.test(t)&&f.bracketOfLength(t)!=null)return{"background-size":f.bracketOfLength(t).split(" ").map(r=>f.fraction.auto.px.cssvar(r)??r).join(" ")};if((so(t)||cd.test(t))&&f.bracketOfPosition(t)!=null)return{"background-position":f.bracketOfPosition(t).split(" ").map(r=>f.position.fraction.auto.px.cssvar(r)??r).join(" ")};if(ld.test(t)||fd.test(t)){let r=f.bracket(t);if(r)return{"background-image":(r.startsWith("http")?`url(${r})`:f.cssvar(r))??r}}return U("background-color","bg","backgroundColor")(...e)},{autocomplete:"bg-$colors"}],[/^bg-op(?:acity)?-?(.+)$/,([,e])=>({"--un-bg-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"bg-(op|opacity)-<percent>"}]],Wr=[[/^color-scheme-(\w+)$/,([,e])=>({"color-scheme":e})]],Ur=[[/^@container(?:\/(\w+))?(?:-(normal|inline-size|size))?$/,([,e,t])=>({"container-type":t??"inline-size","container-name":e})]],Ac=["solid","double","dotted","dashed","wavy",...M],Br=[[/^(?:decoration-)?(underline|overline|line-through)$/,([,e])=>({"text-decoration-line":e}),{autocomplete:"decoration-(underline|overline|line-through)"}],[/^(?:underline|decoration)-(?:size-)?(.+)$/,Mc,{autocomplete:"(underline|decoration)-<num>"}],[/^(?:underline|decoration)-(auto|from-font)$/,([,e])=>({"text-decoration-thickness":e}),{autocomplete:"(underline|decoration)-(auto|from-font)"}],[/^(?:underline|decoration)-(.+)$/,ud,{autocomplete:"(underline|decoration)-$colors"}],[/^(?:underline|decoration)-op(?:acity)?-?(.+)$/,([,e])=>({"--un-line-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"(underline|decoration)-(op|opacity)-<percent>"}],[/^(?:underline|decoration)-offset-(.+)$/,([,e],{theme:t})=>({"text-underline-offset":t.lineWidth?.[e]??f.auto.bracket.cssvar.global.px(e)}),{autocomplete:"(underline|decoration)-(offset)-<num>"}],...Ac.map(e=>[`underline-${e}`,{"text-decoration-style":e}]),...Ac.map(e=>[`decoration-${e}`,{"text-decoration-style":e}]),["no-underline",{"text-decoration":"none"}],["decoration-none",{"text-decoration":"none"}]];function Mc([,e],{theme:t}){return{"text-decoration-thickness":t.lineWidth?.[e]??f.bracket.cssvar.global.px(e)}}function ud(e,t){if(ke(f.bracket(e[1])))return Mc(e,t);let r=U("text-decoration-color","line","borderColor")(e,t);if(r)return{"-webkit-text-decoration-color":r["text-decoration-color"],...r}}var Ir=[["flex",{display:"flex"}],["inline-flex",{display:"inline-flex"}],["flex-inline",{display:"inline-flex"}],[/^flex-(.*)$/,([,e])=>({flex:f.bracket(e)!=null?f.bracket(e).split(" ").map(t=>f.cssvar.fraction(t)??t).join(" "):f.cssvar.fraction(e)})],["flex-1",{flex:"1 1 0%"}],["flex-auto",{flex:"1 1 auto"}],["flex-initial",{flex:"0 1 auto"}],["flex-none",{flex:"none"}],[/^(?:flex-)?shrink(?:-(.*))?$/,([,e=""])=>({"flex-shrink":f.bracket.cssvar.number(e)??1}),{autocomplete:["flex-shrink-<num>","shrink-<num>"]}],[/^(?:flex-)?grow(?:-(.*))?$/,([,e=""])=>({"flex-grow":f.bracket.cssvar.number(e)??1}),{autocomplete:["flex-grow-<num>","grow-<num>"]}],[/^(?:flex-)?basis-(.+)$/,([,e],{theme:t})=>({"flex-basis":t.spacing?.[e]??f.bracket.cssvar.auto.fraction.rem(e)}),{autocomplete:["flex-basis-$spacing","basis-$spacing"]}],["flex-row",{"flex-direction":"row"}],["flex-row-reverse",{"flex-direction":"row-reverse"}],["flex-col",{"flex-direction":"column"}],["flex-col-reverse",{"flex-direction":"column-reverse"}],["flex-wrap",{"flex-wrap":"wrap"}],["flex-wrap-reverse",{"flex-wrap":"wrap-reverse"}],["flex-nowrap",{"flex-wrap":"nowrap"}]],pd={"":"",x:"column-",y:"row-",col:"column-",row:"row-"};function lo([,e="",t],{theme:r}){let n=r.spacing?.[t]??f.bracket.cssvar.global.rem(t);if(n!=null)return{[`${pd[e]}gap`]:n}}var Dr=[[/^(?:flex-|grid-)?gap-?()(.+)$/,lo,{autocomplete:["gap-$spacing","gap-<num>"]}],[/^(?:flex-|grid-)?gap-([xy])-?(.+)$/,lo,{autocomplete:["gap-(x|y)-$spacing","gap-(x|y)-<num>"]}],[/^(?:flex-|grid-)?gap-(col|row)-?(.+)$/,lo,{autocomplete:["gap-(col|row)-$spacing","gap-(col|row)-<num>"]}]];function ye(e){return e.replace("col","column")}function fo(e){return e[0]==="r"?"Row":"Column"}function dd(e,t,r){let n=t[`gridAuto${fo(e)}`]?.[r];if(n!=null)return n;switch(r){case"min":return"min-content";case"max":return"max-content";case"fr":return"minmax(0,1fr)"}return f.bracket.cssvar.auto.rem(r)}var Nr=[["grid",{display:"grid"}],["inline-grid",{display:"inline-grid"}],[/^(?:grid-)?(row|col)-(.+)$/,([,e,t],{theme:r})=>({[`grid-${ye(e)}`]:r[`grid${fo(e)}`]?.[t]??f.bracket.cssvar.auto(t)})],[/^(?:grid-)?(row|col)-span-(.+)$/,([,e,t])=>{if(t==="full")return{[`grid-${ye(e)}`]:"1/-1"};let r=f.bracket.number(t);if(r!=null)return{[`grid-${ye(e)}`]:`span ${r}/span ${r}`}},{autocomplete:"(grid-row|grid-col|row|col)-span-<num>"}],[/^(?:grid-)?(row|col)-start-(.+)$/,([,e,t])=>({[`grid-${ye(e)}-start`]:f.bracket.cssvar(t)??t})],[/^(?:grid-)?(row|col)-end-(.+)$/,([,e,t])=>({[`grid-${ye(e)}-end`]:f.bracket.cssvar(t)??t}),{autocomplete:"(grid-row|grid-col|row|col)-(start|end)-<num>"}],[/^(?:grid-)?auto-(rows|cols)-(.+)$/,([,e,t],{theme:r})=>({[`grid-auto-${ye(e)}`]:dd(e,r,t)}),{autocomplete:"(grid-auto|auto)-(rows|cols)-<num>"}],[/^(?:grid-auto-flow|auto-flow|grid-flow)-(.+)$/,([,e])=>({"grid-auto-flow":f.bracket.cssvar(e)})],[/^(?:grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)$/,([,e])=>({"grid-auto-flow":ye(e).replace("-"," ")}),{autocomplete:["(grid-auto-flow|auto-flow|grid-flow)-(row|col|dense|row-dense|col-dense)"]}],[/^(?:grid-)?(rows|cols)-(.+)$/,([,e,t],{theme:r})=>({[`grid-template-${ye(e)}`]:r[`gridTemplate${fo(e)}`]?.[t]??f.bracket.cssvar(t)})],[/^(?:grid-)?(rows|cols)-minmax-([\w.-]+)$/,([,e,t])=>({[`grid-template-${ye(e)}`]:`repeat(auto-fill,minmax(${t},1fr))`})],[/^(?:grid-)?(rows|cols)-(\d+)$/,([,e,t])=>({[`grid-template-${ye(e)}`]:`repeat(${t},minmax(0,1fr))`}),{autocomplete:"(grid-rows|grid-cols|rows|cols)-<num>"}],[/^grid-area(s)?-(.+)$/,([,e,t])=>e!=null?{"grid-template-areas":f.cssvar(t)??t.split("-").map(r=>`"${f.bracket(r)}"`).join(" ")}:{"grid-area":f.bracket.cssvar(t)}],["grid-rows-none",{"grid-template-rows":"none"}],["grid-cols-none",{"grid-template-columns":"none"}],["grid-rows-subgrid",{"grid-template-rows":"subgrid"}],["grid-cols-subgrid",{"grid-template-columns":"subgrid"}]],jr=["auto","hidden","clip","visible","scroll","overlay",...M],Kr=[[/^(?:overflow|of)-(.+)$/,([,e])=>jr.includes(e)?{overflow:e}:void 0,{autocomplete:[`(overflow|of)-(${jr.join("|")})`,`(overflow|of)-(x|y)-(${jr.join("|")})`]}],[/^(?:overflow|of)-([xy])-(.+)$/,([,e,t])=>jr.includes(t)?{[`overflow-${e}`]:t}:void 0]],Gr=[[/^(?:position-|pos-)?(relative|absolute|fixed|sticky)$/,([,e])=>({position:e}),{autocomplete:["(position|pos)-<position>","(position|pos)-<globalKeyword>","<position>"]}],[/^(?:position-|pos-)([-\w]+)$/,([,e])=>M.includes(e)?{position:e}:void 0],[/^(?:position-|pos-)?(static)$/,([,e])=>({position:e})]],_t=[["justify-start",{"justify-content":"flex-start"}],["justify-end",{"justify-content":"flex-end"}],["justify-center",{"justify-content":"center"}],["justify-between",{"justify-content":"space-between"}],["justify-around",{"justify-content":"space-around"}],["justify-evenly",{"justify-content":"space-evenly"}],["justify-stretch",{"justify-content":"stretch"}],["justify-left",{"justify-content":"left"}],["justify-right",{"justify-content":"right"}],["justify-center-safe",{"justify-content":"safe center"}],["justify-end-safe",{"justify-content":"safe flex-end"}],["justify-normal",{"justify-content":"normal"}],...$("justify","justify-content"),["justify-items-start",{"justify-items":"start"}],["justify-items-end",{"justify-items":"end"}],["justify-items-center",{"justify-items":"center"}],["justify-items-stretch",{"justify-items":"stretch"}],["justify-items-center-safe",{"justify-items":"safe center"}],["justify-items-end-safe",{"justify-items":"safe flex-end"}],...$("justify-items"),["justify-self-auto",{"justify-self":"auto"}],["justify-self-start",{"justify-self":"start"}],["justify-self-end",{"justify-self":"end"}],["justify-self-center",{"justify-self":"center"}],["justify-self-stretch",{"justify-self":"stretch"}],["justify-self-baseline",{"justify-self":"baseline"}],["justify-self-center-safe",{"justify-self":"safe center"}],["justify-self-end-safe",{"justify-self":"safe flex-end"}],...$("justify-self")],Hr=[[/^order-(.+)$/,([,e])=>({order:f.bracket.cssvar.number(e)})],["order-first",{order:"-9999"}],["order-last",{order:"9999"}],["order-none",{order:"0"}]],Lt=[["content-center",{"align-content":"center"}],["content-start",{"align-content":"flex-start"}],["content-end",{"align-content":"flex-end"}],["content-between",{"align-content":"space-between"}],["content-around",{"align-content":"space-around"}],["content-evenly",{"align-content":"space-evenly"}],["content-baseline",{"align-content":"baseline"}],["content-center-safe",{"align-content":"safe center"}],["content-end-safe",{"align-content":"safe flex-end"}],["content-stretch",{"align-content":"stretch"}],["content-normal",{"align-content":"normal"}],...$("content","align-content"),["items-start",{"align-items":"flex-start"}],["items-end",{"align-items":"flex-end"}],["items-center",{"align-items":"center"}],["items-baseline",{"align-items":"baseline"}],["items-stretch",{"align-items":"stretch"}],["items-baseline-last",{"align-items":"last baseline"}],["items-center-safe",{"align-items":"safe center"}],["items-end-safe",{"align-items":"safe flex-end"}],...$("items","align-items"),["self-auto",{"align-self":"auto"}],["self-start",{"align-self":"flex-start"}],["self-end",{"align-self":"flex-end"}],["self-center",{"align-self":"center"}],["self-stretch",{"align-self":"stretch"}],["self-baseline",{"align-self":"baseline"}],["self-baseline-last",{"align-self":"last baseline"}],["self-center-safe",{"align-self":"safe center"}],["self-end-safe",{"align-self":"safe flex-end"}],...$("self","align-self")],Wt=[["place-content-center",{"place-content":"center"}],["place-content-start",{"place-content":"start"}],["place-content-end",{"place-content":"end"}],["place-content-between",{"place-content":"space-between"}],["place-content-around",{"place-content":"space-around"}],["place-content-evenly",{"place-content":"space-evenly"}],["place-content-stretch",{"place-content":"stretch"}],["place-content-baseline",{"place-content":"baseline"}],["place-content-center-safe",{"place-content":"safe center"}],["place-content-end-safe",{"place-content":"safe flex-end"}],...$("place-content"),["place-items-start",{"place-items":"start"}],["place-items-end",{"place-items":"end"}],["place-items-center",{"place-items":"center"}],["place-items-stretch",{"place-items":"stretch"}],["place-items-baseline",{"place-items":"baseline"}],["place-items-center-safe",{"place-items":"safe center"}],["place-items-end-safe",{"place-items":"safe flex-end"}],...$("place-items"),["place-self-auto",{"place-self":"auto"}],["place-self-start",{"place-self":"start"}],["place-self-end",{"place-self":"end"}],["place-self-center",{"place-self":"center"}],["place-self-stretch",{"place-self":"stretch"}],["place-self-center-safe",{"place-self":"safe center"}],["place-self-end-safe",{"place-self":"safe flex-end"}],...$("place-self")],qr=[..._t,...Lt,...Wt].flatMap(([e,t])=>[[`flex-${e}`,t],[`grid-${e}`,t]]);function uo(e,{theme:t}){return t.spacing?.[e]??f.bracket.cssvar.global.auto.fraction.rem(e)}function Ft([,e,t],r){let n=uo(t,r);if(n!=null&&e in wr)return wr[e].map(o=>[o.slice(1),n])}var Yr=[[/^(?:position-|pos-)?inset-(.+)$/,([,e],t)=>({inset:uo(e,t)}),{autocomplete:["(position|pos)-inset-<directions>-$spacing","(position|pos)-inset-(block|inline)-$spacing","(position|pos)-inset-(bs|be|is|ie)-$spacing","(position|pos)-(top|left|right|bottom)-$spacing"]}],[/^(?:position-|pos-)?(start|end)-(.+)$/,Ft],[/^(?:position-|pos-)?inset-([xy])-(.+)$/,Ft],[/^(?:position-|pos-)?inset-([rltbse])-(.+)$/,Ft],[/^(?:position-|pos-)?inset-(block|inline)-(.+)$/,Ft],[/^(?:position-|pos-)?inset-([bi][se])-(.+)$/,Ft],[/^(?:position-|pos-)?(top|left|right|bottom)-(.+)$/,([,e,t],r)=>({[e]:uo(t,r)})]],Xr=[["float-left",{float:"left"}],["float-right",{float:"right"}],["float-start",{float:"inline-start"}],["float-end",{float:"inline-end"}],["float-none",{float:"none"}],...$("float"),["clear-left",{clear:"left"}],["clear-right",{clear:"right"}],["clear-both",{clear:"both"}],["clear-start",{clear:"inline-start"}],["clear-end",{clear:"inline-end"}],["clear-none",{clear:"none"}],...$("clear")],Zr=[[/^(?:position-|pos-)?z([\d.]+)$/,([,e])=>({"z-index":f.number(e)})],[/^(?:position-|pos-)?z-(.+)$/,([,e],{theme:t})=>({"z-index":t.zIndex?.[e]??f.bracket.cssvar.global.auto.number(e)}),{autocomplete:"z-<num>"}]],Jr=[["box-border",{"box-sizing":"border-box"}],["box-content",{"box-sizing":"content-box"}],...$("box","box-sizing")],Qr=[[/^(where|\?)$/,(e,{constructCSS:t,generator:r})=>{if(r.userConfig.envMode==="dev")return`@keyframes __un_qm{0%{box-shadow:inset 4px 4px #ff1e90, inset -4px -4px #ff1e90}100%{box-shadow:inset 8px 8px #3399ff, inset -8px -8px #3399ff}} ${t({animation:"__un_qm 0.5s ease-in-out alternate infinite"})}`}]],md={h:"height",w:"width",inline:"inline-size",block:"block-size"};function _e(e,t){return`${e||""}${md[t]}`}function zr(e,t,r,n){let o=_e(e,t).replace(/-(\w)/g,(s,a)=>a.toUpperCase()),i=r[o]?.[n];if(i!=null)return i;switch(n){case"fit":case"max":case"min":return`${n}-content`}return f.bracket.cssvar.global.auto.fraction.rem(n)}var en=[[/^size-(min-|max-)?(.+)$/,([,e,t],{theme:r})=>({[_e(e,"w")]:zr(e,"w",r,t),[_e(e,"h")]:zr(e,"h",r,t)})],[/^(?:size-)?(min-|max-)?([wh])-?(.+)$/,([,e,t,r],{theme:n})=>({[_e(e,t)]:zr(e,t,n,r)})],[/^(?:size-)?(min-|max-)?(block|inline)-(.+)$/,([,e,t,r],{theme:n})=>({[_e(e,t)]:zr(e,t,n,r)}),{autocomplete:["(w|h)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize","(block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize","(max|min)-(w|h|block|inline)","(max|min)-(w|h|block|inline)-$width|height|maxWidth|maxHeight|minWidth|minHeight|inlineSize|blockSize|maxInlineSize|maxBlockSize|minInlineSize|minBlockSize","(w|h)-full","(max|min)-(w|h)-full"]}],[/^(?:size-)?(min-|max-)?(h)-screen-(.+)$/,([,e,t,r],n)=>({[_e(e,t)]:Pc(n,r,"verticalBreakpoints")})],[/^(?:size-)?(min-|max-)?(w)-screen-(.+)$/,([,e,t,r],n)=>({[_e(e,t)]:Pc(n,r)}),{autocomplete:["(w|h)-screen","(min|max)-(w|h)-screen","h-screen-$verticalBreakpoints","(min|max)-h-screen-$verticalBreakpoints","w-screen-$breakpoints","(min|max)-w-screen-$breakpoints"]}]];function Pc(e,t,r="breakpoints"){let n=Te(e,r);if(n)return n.find(o=>o.point===t)?.size}function gd(e){if(/^\d+\/\d+$/.test(e))return e;switch(e){case"square":return"1/1";case"video":return"16/9"}return f.bracket.cssvar.global.auto.number(e)}var tn=[[/^(?:size-)?aspect-(?:ratio-)?(.+)$/,([,e])=>({"aspect-ratio":gd(e)}),{autocomplete:["aspect-(square|video|ratio)","aspect-ratio-(square|video)"]}]],rn=[[/^pa?()-?(.+)$/,L("padding"),{autocomplete:["(m|p)<num>","(m|p)-<num>"]}],[/^p-?xy()()$/,L("padding"),{autocomplete:"(m|p)-(xy)"}],[/^p-?([xy])(?:-?(.+))?$/,L("padding")],[/^p-?([rltbse])(?:-?(.+))?$/,L("padding"),{autocomplete:"(m|p)<directions>-<num>"}],[/^p-(block|inline)(?:-(.+))?$/,L("padding"),{autocomplete:"(m|p)-(block|inline)-<num>"}],[/^p-?([bi][se])(?:-?(.+))?$/,L("padding"),{autocomplete:"(m|p)-(bs|be|is|ie)-<num>"}]],nn=[[/^ma?()-?(.+)$/,L("margin")],[/^m-?xy()()$/,L("margin")],[/^m-?([xy])(?:-?(.+))?$/,L("margin")],[/^m-?([rltbse])(?:-?(.+))?$/,L("margin")],[/^m-(block|inline)(?:-(.+))?$/,L("margin")],[/^m-?([bi][se])(?:-?(.+))?$/,L("margin")]],on=[[/^fill-(.+)$/,U("fill","fill","backgroundColor"),{autocomplete:"fill-$colors"}],[/^fill-op(?:acity)?-?(.+)$/,([,e])=>({"--un-fill-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"fill-(op|opacity)-<percent>"}],["fill-none",{fill:"none"}],[/^stroke-(?:width-|size-)?(.+)$/,Fc,{autocomplete:["stroke-width-$lineWidth","stroke-size-$lineWidth"]}],[/^stroke-dash-(.+)$/,([,e])=>({"stroke-dasharray":f.bracket.cssvar.number(e)}),{autocomplete:"stroke-dash-<num>"}],[/^stroke-offset-(.+)$/,([,e],{theme:t})=>({"stroke-dashoffset":t.lineWidth?.[e]??f.bracket.cssvar.px.numberWithUnit(e)}),{autocomplete:"stroke-offset-$lineWidth"}],[/^stroke-(.+)$/,hd,{autocomplete:"stroke-$colors"}],[/^stroke-op(?:acity)?-?(.+)$/,([,e])=>({"--un-stroke-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"stroke-(op|opacity)-<percent>"}],["stroke-cap-square",{"stroke-linecap":"square"}],["stroke-cap-round",{"stroke-linecap":"round"}],["stroke-cap-auto",{"stroke-linecap":"butt"}],["stroke-join-arcs",{"stroke-linejoin":"arcs"}],["stroke-join-bevel",{"stroke-linejoin":"bevel"}],["stroke-join-clip",{"stroke-linejoin":"miter-clip"}],["stroke-join-round",{"stroke-linejoin":"round"}],["stroke-join-auto",{"stroke-linejoin":"miter"}],["stroke-none",{stroke:"none"}]];function Fc([,e],{theme:t}){return{"stroke-width":t.lineWidth?.[e]??f.bracket.cssvar.fraction.px.number(e)}}function hd(e,t){return ke(f.bracket(e[1]))?Fc(e,t):U("stroke","stroke","borderColor")(e,t)}function Oc(e,t){let r;if(f.cssvar(e)!=null)r=f.cssvar(e);else{e.startsWith("[")&&e.endsWith("]")&&(e=e.slice(1,-1));let n=e.split(",").map(o=>t.transitionProperty?.[o]??f.properties(o));n.every(Boolean)&&(r=n.join(","))}return r}var sn=[[/^transition(?:-(\D+?))?(?:-(\d+))?$/,([,e,t],{theme:r})=>{if(!e&&!t)return{"transition-property":r.transitionProperty?.DEFAULT,"transition-timing-function":r.easing?.DEFAULT,"transition-duration":r.duration?.DEFAULT??f.time("150")};if(e!=null){let n=Oc(e,r),o=r.duration?.[t||"DEFAULT"]??f.time(t||"150");if(n)return{"transition-property":n,"transition-timing-function":r.easing?.DEFAULT,"transition-duration":o}}else if(t!=null)return{"transition-property":r.transitionProperty?.DEFAULT,"transition-timing-function":r.easing?.DEFAULT,"transition-duration":r.duration?.[t]??f.time(t)}},{autocomplete:"transition-$transitionProperty-$duration"}],[/^(?:transition-)?duration-(.+)$/,([,e],{theme:t})=>({"transition-duration":t.duration?.[e||"DEFAULT"]??f.bracket.cssvar.time(e)}),{autocomplete:["transition-duration-$duration","duration-$duration"]}],[/^(?:transition-)?delay-(.+)$/,([,e],{theme:t})=>({"transition-delay":t.duration?.[e||"DEFAULT"]??f.bracket.cssvar.time(e)}),{autocomplete:["transition-delay-$duration","delay-$duration"]}],[/^(?:transition-)?ease(?:-(.+))?$/,([,e],{theme:t})=>({"transition-timing-function":t.easing?.[e||"DEFAULT"]??f.bracket.cssvar(e)}),{autocomplete:["transition-ease-(linear|in|out|in-out|DEFAULT)","ease-(linear|in|out|in-out|DEFAULT)"]}],[/^(?:transition-)?property-(.+)$/,([,e],{theme:t})=>{let r=f.global(e)||Oc(e,t);if(r)return{"transition-property":r}},{autocomplete:[`transition-property-(${[...M].join("|")})`,"transition-property-$transitionProperty","property-$transitionProperty"]}],["transition-none",{transition:"none"}],...$("transition"),["transition-discrete",{"transition-behavior":"allow-discrete"}],["transition-normal",{"transition-behavior":"normal"}]],an=[[/^text-(.+)$/,xd,{autocomplete:"text-$fontSize"}],[/^(?:text|font)-size-(.+)$/,_c,{autocomplete:"text-size-$fontSize"}],[/^text-(?:color-)?(.+)$/,bd,{autocomplete:"text-$colors"}],[/^(?:color|c)-(.+)$/,U("color","text","textColor"),{autocomplete:"(color|c)-$colors"}],[/^(?:text|color|c)-(.+)$/,([,e])=>M.includes(e)?{color:e}:void 0,{autocomplete:`(text|color|c)-(${M.join("|")})`}],[/^(?:text|color|c)-op(?:acity)?-?(.+)$/,([,e])=>({"--un-text-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"(text|color|c)-(op|opacity)-<percent>"}],[/^(?:font|fw)-?([^-]+)$/,([,e],{theme:t})=>({"font-weight":t.fontWeight?.[e]||f.bracket.global.number(e)}),{autocomplete:["(font|fw)-(100|200|300|400|500|600|700|800|900)","(font|fw)-$fontWeight"]}],[/^(?:font-)?(?:leading|lh|line-height)-(.+)$/,([,e],{theme:t})=>({"line-height":po(e,t,"lineHeight")}),{autocomplete:"(leading|lh|line-height)-$lineHeight"}],["font-synthesis-weight",{"font-synthesis":"weight"}],["font-synthesis-style",{"font-synthesis":"style"}],["font-synthesis-small-caps",{"font-synthesis":"small-caps"}],["font-synthesis-none",{"font-synthesis":"none"}],[/^font-synthesis-(.+)$/,([,e])=>({"font-synthesis":f.bracket.cssvar.global(e)})],[/^(?:font-)?tracking-(.+)$/,([,e],{theme:t})=>({"letter-spacing":t.letterSpacing?.[e]||f.bracket.cssvar.global.rem(e)}),{autocomplete:"tracking-$letterSpacing"}],[/^(?:font-)?word-spacing-(.+)$/,([,e],{theme:t})=>({"word-spacing":t.wordSpacing?.[e]||f.bracket.cssvar.global.rem(e)}),{autocomplete:"word-spacing-$wordSpacing"}],["font-stretch-normal",{"font-stretch":"normal"}],["font-stretch-ultra-condensed",{"font-stretch":"ultra-condensed"}],["font-stretch-extra-condensed",{"font-stretch":"extra-condensed"}],["font-stretch-condensed",{"font-stretch":"condensed"}],["font-stretch-semi-condensed",{"font-stretch":"semi-condensed"}],["font-stretch-semi-expanded",{"font-stretch":"semi-expanded"}],["font-stretch-expanded",{"font-stretch":"expanded"}],["font-stretch-extra-expanded",{"font-stretch":"extra-expanded"}],["font-stretch-ultra-expanded",{"font-stretch":"ultra-expanded"}],[/^font-stretch-(.+)$/,([,e])=>({"font-stretch":f.bracket.cssvar.fraction.global(e)}),{autocomplete:"font-stretch-<percentage>"}],[/^font-(.+)$/,([,e],{theme:t})=>({"font-family":t.fontFamily?.[e]||f.bracket.cssvar.global(e)}),{autocomplete:"font-$fontFamily"}]],cn=[[/^tab(?:-(.+))?$/,([,e])=>{let t=f.bracket.cssvar.global.number(e||"4");if(t!=null)return{"-moz-tab-size":t,"-o-tab-size":t,"tab-size":t}}]],ln=[[/^indent(?:-(.+))?$/,([,e],{theme:t})=>({"text-indent":t.textIndent?.[e||"DEFAULT"]||f.bracket.cssvar.global.fraction.rem(e)}),{autocomplete:"indent-$textIndent"}]],fn=[[/^text-stroke(?:-(.+))?$/,([,e],{theme:t})=>({"-webkit-text-stroke-width":t.textStrokeWidth?.[e||"DEFAULT"]||f.bracket.cssvar.px(e)}),{autocomplete:"text-stroke-$textStrokeWidth"}],[/^text-stroke-(.+)$/,U("-webkit-text-stroke-color","text-stroke","borderColor"),{autocomplete:"text-stroke-$colors"}],[/^text-stroke-op(?:acity)?-?(.+)$/,([,e])=>({"--un-text-stroke-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"text-stroke-(op|opacity)-<percent>"}]],un=[[/^text-shadow(?:-(.+))?$/,([,e],{theme:t})=>{let r=t.textShadow?.[e||"DEFAULT"];return r!=null?{"--un-text-shadow":Me(r,"--un-text-shadow-color").join(","),"text-shadow":"var(--un-text-shadow)"}:{"text-shadow":f.bracket.cssvar.global(e)}},{autocomplete:"text-shadow-$textShadow"}],[/^text-shadow-color-(.+)$/,U("--un-text-shadow-color","text-shadow","shadowColor"),{autocomplete:"text-shadow-color-$colors"}],[/^text-shadow-color-op(?:acity)?-?(.+)$/,([,e])=>({"--un-text-shadow-opacity":f.bracket.percent.cssvar(e)}),{autocomplete:"text-shadow-color-(op|opacity)-<percent>"}]];function po(e,t,r){return t[r]?.[e]||f.bracket.cssvar.global.rem(e)}function _c([,e],{theme:t}){let n=S(t.fontSize?.[e])?.[0]??f.bracket.cssvar.global.rem(e);if(n!=null)return{"font-size":n}}function bd(e,t){return ke(f.bracket(e[1]))?_c(e,t):U("color","text","textColor")(e,t)}function xd([,e="base"],{theme:t}){let r=Er(e,"length");if(!r)return;let[n,o]=r,i=S(t.fontSize?.[n]),s=o?po(o,t,"lineHeight"):void 0;if(i?.[0]){let[c,l,u]=i;return typeof l=="object"?{"font-size":c,...l}:{"font-size":c,"line-height":s??l??"1","letter-spacing":u?po(u,t,"letterSpacing"):void 0}}let a=f.bracketOfLength.rem(n);return s&&a?{"font-size":a,"line-height":s}:{"font-size":f.bracketOfLength.rem(e)}}var yd={backface:"backface-visibility",break:"word-break",case:"text-transform",content:"align-content",fw:"font-weight",items:"align-items",justify:"justify-content",select:"user-select",self:"align-self",vertical:"vertical-align",visible:"visibility",whitespace:"white-space",ws:"white-space"},pn=[[/^(.+?)-(\$.+)$/,([,e,t])=>{let r=yd[e];if(r)return{[r]:f.cssvar(t)}}]],dn=[[/^\[(.*)\]$/,([e,t])=>{if(!t.includes(":"))return;let[r,...n]=t.split(":"),o=n.join(":");if(!$d(t)&&/^[\w-]+$/.test(r)&&vd(o)){let i=f.bracket(`[${o}]`);if(i)return{[r]:i}}}]];function vd(e){let t=0;function r(n){for(;t<e.length;)if(t+=1,e[t]===n)return!0;return!1}for(t=0;t<e.length;t++){let n=e[t];if("\"`'".includes(n)){if(!r(n))return!1}else if(n==="("){if(!r(")"))return!1}else if("[]{}:".includes(n))return!1}return!0}function $d(e){if(!e.includes("://"))return!1;try{return new URL(e).host!==""}catch{return!1}}var wd=[pn,dn,ht,bt,mt,Gr,Yr,Zr,Hr,Nr,Xr,nn,Jr,dt,tn,en,Ir,Pt,gt,yt,xt,Vr,Wt,Lt,_t,Dr,qr,Kr,Ct,vt,kt,Fr,Lr,Wr,on,rn,Pr,ln,St,Ar,an,Rt,Et,Br,Tt,cn,fn,un,_r,At,Or,zt,sn,Mr,$t,wt,Ur,jt,Qr].flat(1);var Lc=[[/^divide-?([xy])$/,mn,{autocomplete:["divide-(x|y|block|inline)","divide-(x|y|block|inline)-reverse","divide-(x|y|block|inline)-$lineWidth"]}],[/^divide-?([xy])-?(.+)$/,mn],[/^divide-?([xy])-reverse$/,([,e])=>({[`--un-divide-${e}-reverse`]:1})],[/^divide-(block|inline)$/,mn],[/^divide-(block|inline)-(.+)$/,mn],[/^divide-(block|inline)-reverse$/,([,e])=>({[`--un-divide-${e}-reverse`]:1})],[/^divide-(.+)$/,U("border-color","divide","borderColor"),{autocomplete:"divide-$colors"}],[/^divide-op(?:acity)?-?(.+)$/,([,e])=>({"--un-divide-opacity":f.bracket.percent(e)}),{autocomplete:["divide-(op|opacity)","divide-(op|opacity)-<percent>"]}],...je.map(e=>[`divide-${e}`,{"border-style":e}])];function mn([,e,t],{theme:r}){let n=r.lineWidth?.[t||"DEFAULT"]??f.bracket.cssvar.px(t||"1");if(n!=null){n==="0"&&(n="0px");let o=Z[e].map(i=>{let s=`border${i}-width`,a=i.endsWith("right")||i.endsWith("bottom")?`calc(${n} * var(--un-divide-${e}-reverse))`:`calc(${n} * calc(1 - var(--un-divide-${e}-reverse)))`;return[s,a]});if(o)return[[`--un-divide-${e}-reverse`,0],...o]}}var go={"--un-blur":T,"--un-brightness":T,"--un-contrast":T,"--un-drop-shadow":T,"--un-grayscale":T,"--un-hue-rotate":T,"--un-invert":T,"--un-saturate":T,"--un-sepia":T},Uc=Object.keys(go),Wc={preflightKeys:Uc},gn="var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia)",ho={"--un-backdrop-blur":T,"--un-backdrop-brightness":T,"--un-backdrop-contrast":T,"--un-backdrop-grayscale":T,"--un-backdrop-hue-rotate":T,"--un-backdrop-invert":T,"--un-backdrop-opacity":T,"--un-backdrop-saturate":T,"--un-backdrop-sepia":T},Bc=Object.keys(ho),Sd={preflightKeys:Bc},hn="var(--un-backdrop-blur) var(--un-backdrop-brightness) var(--un-backdrop-contrast) var(--un-backdrop-grayscale) var(--un-backdrop-hue-rotate) var(--un-backdrop-invert) var(--un-backdrop-opacity) var(--un-backdrop-saturate) var(--un-backdrop-sepia)",Se={preflightKeys:[...Uc,...Bc]};function mo(e){let t=f.bracket.cssvar(e||"");if(t!=null||(t=e?f.percent(e):"1",t!=null&&Number.parseFloat(t)<=1))return t}function Ce(e,t){return([,r,n],{theme:o})=>{let i=t(n,o)??(n==="none"?"0":"");if(i!=="")return r?{[`--un-${r}${e}`]:`${e}(${i})`,"-webkit-backdrop-filter":hn,"backdrop-filter":hn}:{[`--un-${e}`]:`${e}(${i})`,filter:gn}}}function Cd([,e],{theme:t}){let r=t.dropShadow?.[e||"DEFAULT"];if(r!=null)return{"--un-drop-shadow":`drop-shadow(${Me(r,"--un-drop-shadow-color").join(") drop-shadow(")})`,filter:gn};if(r=f.bracket.cssvar(e),r!=null)return{"--un-drop-shadow":`drop-shadow(${r})`,filter:gn}}var Ic=[[/^(?:(backdrop-)|filter-)?blur(?:-(.+))?$/,Ce("blur",(e,t)=>t.blur?.[e||"DEFAULT"]||f.bracket.cssvar.px(e)),{custom:Se,autocomplete:["(backdrop|filter)-blur-$blur","blur-$blur","filter-blur"]}],[/^(?:(backdrop-)|filter-)?brightness-(.+)$/,Ce("brightness",e=>f.bracket.cssvar.percent(e)),{custom:Se,autocomplete:["(backdrop|filter)-brightness-<percent>","brightness-<percent>"]}],[/^(?:(backdrop-)|filter-)?contrast-(.+)$/,Ce("contrast",e=>f.bracket.cssvar.percent(e)),{custom:Se,autocomplete:["(backdrop|filter)-contrast-<percent>","contrast-<percent>"]}],[/^(?:filter-)?drop-shadow(?:-(.+))?$/,Cd,{custom:Wc,autocomplete:["filter-drop","filter-drop-shadow","filter-drop-shadow-color","drop-shadow","drop-shadow-color","filter-drop-shadow-$dropShadow","drop-shadow-$dropShadow","filter-drop-shadow-color-$colors","drop-shadow-color-$colors","filter-drop-shadow-color-(op|opacity)","drop-shadow-color-(op|opacity)","filter-drop-shadow-color-(op|opacity)-<percent>","drop-shadow-color-(op|opacity)-<percent>"]}],[/^(?:filter-)?drop-shadow-color-(.+)$/,U("--un-drop-shadow-color","drop-shadow","shadowColor")],[/^(?:filter-)?drop-shadow-color-op(?:acity)?-?(.+)$/,([,e])=>({"--un-drop-shadow-opacity":f.bracket.percent(e)})],[/^(?:(backdrop-)|filter-)?grayscale(?:-(.+))?$/,Ce("grayscale",mo),{custom:Se,autocomplete:["(backdrop|filter)-grayscale","(backdrop|filter)-grayscale-<percent>","grayscale-<percent>"]}],[/^(?:(backdrop-)|filter-)?hue-rotate-(.+)$/,Ce("hue-rotate",e=>f.bracket.cssvar.degree(e)),{custom:Se}],[/^(?:(backdrop-)|filter-)?invert(?:-(.+))?$/,Ce("invert",mo),{custom:Se,autocomplete:["(backdrop|filter)-invert","(backdrop|filter)-invert-<percent>","invert-<percent>"]}],[/^(backdrop-)op(?:acity)?-(.+)$/,Ce("opacity",e=>f.bracket.cssvar.percent(e)),{custom:Se,autocomplete:["backdrop-(op|opacity)","backdrop-(op|opacity)-<percent>"]}],[/^(?:(backdrop-)|filter-)?saturate-(.+)$/,Ce("saturate",e=>f.bracket.cssvar.percent(e)),{custom:Se,autocomplete:["(backdrop|filter)-saturate","(backdrop|filter)-saturate-<percent>","saturate-<percent>"]}],[/^(?:(backdrop-)|filter-)?sepia(?:-(.+))?$/,Ce("sepia",mo),{custom:Se,autocomplete:["(backdrop|filter)-sepia","(backdrop|filter)-sepia-<percent>","sepia-<percent>"]}],["filter",{filter:gn},{custom:Wc}],["backdrop-filter",{"-webkit-backdrop-filter":hn,"backdrop-filter":hn},{custom:Sd}],["filter-none",{filter:"none"}],["backdrop-filter-none",{"-webkit-backdrop-filter":"none","backdrop-filter":"none"}],...M.map(e=>[`filter-${e}`,{filter:e}]),...M.map(e=>[`backdrop-filter-${e}`,{"-webkit-backdrop-filter":e,"backdrop-filter":e}])];var Dc=[[/^line-clamp-(\d+)$/,([,e])=>({overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":e,"line-clamp":e}),{autocomplete:["line-clamp","line-clamp-<num>"]}],...["none",...M].map(e=>[`line-clamp-${e}`,{overflow:"visible",display:"block","-webkit-box-orient":"horizontal","-webkit-line-clamp":e,"line-clamp":e}])];var Nc=[[/^\$ placeholder-(.+)$/,U("color","placeholder","accentColor"),{autocomplete:"placeholder-$colors"}],[/^\$ placeholder-op(?:acity)?-?(.+)$/,([,e])=>({"--un-placeholder-opacity":f.bracket.percent(e)}),{autocomplete:["placeholder-(op|opacity)","placeholder-(op|opacity)-<percent>"]}]];var bo={"--un-scroll-snap-strictness":"proximity"},Kc={preflightKeys:Object.keys(bo)},Gc=[[/^snap-(x|y)$/,([,e])=>({"scroll-snap-type":`${e} var(--un-scroll-snap-strictness)`}),{custom:Kc,autocomplete:"snap-(x|y|both)"}],[/^snap-both$/,()=>({"scroll-snap-type":"both var(--un-scroll-snap-strictness)"}),{custom:Kc}],["snap-mandatory",{"--un-scroll-snap-strictness":"mandatory"}],["snap-proximity",{"--un-scroll-snap-strictness":"proximity"}],["snap-none",{"scroll-snap-type":"none"}],["snap-start",{"scroll-snap-align":"start"}],["snap-end",{"scroll-snap-align":"end"}],["snap-center",{"scroll-snap-align":"center"}],["snap-align-none",{"scroll-snap-align":"none"}],["snap-normal",{"scroll-snap-stop":"normal"}],["snap-always",{"scroll-snap-stop":"always"}],[/^scroll-ma?()-?(.+)$/,L("scroll-margin"),{autocomplete:["scroll-(m|p|ma|pa|block|inline)","scroll-(m|p|ma|pa|block|inline)-$spacing","scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)","scroll-(m|p|ma|pa|block|inline)-(x|y|r|l|t|b|bs|be|is|ie)-$spacing"]}],[/^scroll-m-?([xy])-?(.+)$/,L("scroll-margin")],[/^scroll-m-?([rltb])-?(.+)$/,L("scroll-margin")],[/^scroll-m-(block|inline)-(.+)$/,L("scroll-margin")],[/^scroll-m-?([bi][se])-?(.+)$/,L("scroll-margin")],[/^scroll-pa?()-?(.+)$/,L("scroll-padding")],[/^scroll-p-?([xy])-?(.+)$/,L("scroll-padding")],[/^scroll-p-?([rltb])-?(.+)$/,L("scroll-padding")],[/^scroll-p-(block|inline)-(.+)$/,L("scroll-padding")],[/^scroll-p-?([bi][se])-?(.+)$/,L("scroll-padding")]];var qc=[[/^space-([xy])-(.+)$/,Hc,{autocomplete:["space-(x|y|block|inline)","space-(x|y|block|inline)-reverse","space-(x|y|block|inline)-$spacing"]}],[/^space-([xy])-reverse$/,([,e])=>({[`--un-space-${e}-reverse`]:1})],[/^space-(block|inline)-(.+)$/,Hc],[/^space-(block|inline)-reverse$/,([,e])=>({[`--un-space-${e}-reverse`]:1})]];function Hc([,e,t],{theme:r}){let n=r.spacing?.[t||"DEFAULT"]??f.bracket.cssvar.auto.fraction.rem(t||"1");if(n!=null){n==="0"&&(n="0px");let o=Z[e].map(i=>{let s=`margin${i}`,a=i.endsWith("right")||i.endsWith("bottom")?`calc(${n} * var(--un-space-${e}-reverse))`:`calc(${n} * calc(1 - var(--un-space-${e}-reverse)))`;return[s,a]});if(o)return[[`--un-space-${e}-reverse`,0],...o]}}var Yc=[["uppercase",{"text-transform":"uppercase"}],["lowercase",{"text-transform":"lowercase"}],["capitalize",{"text-transform":"capitalize"}],["normal-case",{"text-transform":"none"}]],Xc=[...["manual","auto","none",...M].map(e=>[`hyphens-${e}`,{"-webkit-hyphens":e,"-ms-hyphens":e,hyphens:e}])],Zc=[["write-vertical-right",{"writing-mode":"vertical-rl"}],["write-vertical-left",{"writing-mode":"vertical-lr"}],["write-normal",{"writing-mode":"horizontal-tb"}],...$("write","writing-mode")],Jc=[["write-orient-mixed",{"text-orientation":"mixed"}],["write-orient-sideways",{"text-orientation":"sideways"}],["write-orient-upright",{"text-orientation":"upright"}],...$("write-orient","text-orientation")],Qc=[["sr-only",{position:"absolute",width:"1px",height:"1px",padding:"0",margin:"-1px",overflow:"hidden",clip:"rect(0,0,0,0)","white-space":"nowrap","border-width":0}],["not-sr-only",{position:"static",width:"auto",height:"auto",padding:"0",margin:"0",overflow:"visible",clip:"auto","white-space":"normal"}]],el=[["isolate",{isolation:"isolate"}],["isolate-auto",{isolation:"auto"}],["isolation-auto",{isolation:"auto"}]],tl=[["object-cover",{"object-fit":"cover"}],["object-contain",{"object-fit":"contain"}],["object-fill",{"object-fit":"fill"}],["object-scale-down",{"object-fit":"scale-down"}],["object-none",{"object-fit":"none"}],[/^object-(.+)$/,([,e])=>{if(q[e])return{"object-position":q[e]};if(f.bracketOfPosition(e)!=null)return{"object-position":f.bracketOfPosition(e).split(" ").map(t=>f.position.fraction.auto.px.cssvar(t)??t).join(" ")}},{autocomplete:`object-(${Object.keys(q).join("|")})`}]],rl=[["bg-blend-multiply",{"background-blend-mode":"multiply"}],["bg-blend-screen",{"background-blend-mode":"screen"}],["bg-blend-overlay",{"background-blend-mode":"overlay"}],["bg-blend-darken",{"background-blend-mode":"darken"}],["bg-blend-lighten",{"background-blend-mode":"lighten"}],["bg-blend-color-dodge",{"background-blend-mode":"color-dodge"}],["bg-blend-color-burn",{"background-blend-mode":"color-burn"}],["bg-blend-hard-light",{"background-blend-mode":"hard-light"}],["bg-blend-soft-light",{"background-blend-mode":"soft-light"}],["bg-blend-difference",{"background-blend-mode":"difference"}],["bg-blend-exclusion",{"background-blend-mode":"exclusion"}],["bg-blend-hue",{"background-blend-mode":"hue"}],["bg-blend-saturation",{"background-blend-mode":"saturation"}],["bg-blend-color",{"background-blend-mode":"color"}],["bg-blend-luminosity",{"background-blend-mode":"luminosity"}],["bg-blend-normal",{"background-blend-mode":"normal"}],...$("bg-blend","background-blend")],nl=[["mix-blend-multiply",{"mix-blend-mode":"multiply"}],["mix-blend-screen",{"mix-blend-mode":"screen"}],["mix-blend-overlay",{"mix-blend-mode":"overlay"}],["mix-blend-darken",{"mix-blend-mode":"darken"}],["mix-blend-lighten",{"mix-blend-mode":"lighten"}],["mix-blend-color-dodge",{"mix-blend-mode":"color-dodge"}],["mix-blend-color-burn",{"mix-blend-mode":"color-burn"}],["mix-blend-hard-light",{"mix-blend-mode":"hard-light"}],["mix-blend-soft-light",{"mix-blend-mode":"soft-light"}],["mix-blend-difference",{"mix-blend-mode":"difference"}],["mix-blend-exclusion",{"mix-blend-mode":"exclusion"}],["mix-blend-hue",{"mix-blend-mode":"hue"}],["mix-blend-saturation",{"mix-blend-mode":"saturation"}],["mix-blend-color",{"mix-blend-mode":"color"}],["mix-blend-luminosity",{"mix-blend-mode":"luminosity"}],["mix-blend-plus-lighter",{"mix-blend-mode":"plus-lighter"}],["mix-blend-normal",{"mix-blend-mode":"normal"}],...$("mix-blend")],ol=[["min-h-dvh",{"min-height":"100dvh"}],["min-h-svh",{"min-height":"100svh"}],["min-h-lvh",{"min-height":"100lvh"}],["h-dvh",{height:"100dvh"}],["h-svh",{height:"100svh"}],["h-lvh",{height:"100lvh"}],["max-h-dvh",{"max-height":"100dvh"}],["max-h-svh",{"max-height":"100svh"}],["max-h-lvh",{"max-height":"100lvh"}]];var xo={"--un-border-spacing-x":0,"--un-border-spacing-y":0},il={preflightKeys:Object.keys(xo)},sl="var(--un-border-spacing-x) var(--un-border-spacing-y)",al=[["inline-table",{display:"inline-table"}],["table",{display:"table"}],["table-caption",{display:"table-caption"}],["table-cell",{display:"table-cell"}],["table-column",{display:"table-column"}],["table-column-group",{display:"table-column-group"}],["table-footer-group",{display:"table-footer-group"}],["table-header-group",{display:"table-header-group"}],["table-row",{display:"table-row"}],["table-row-group",{display:"table-row-group"}],["border-collapse",{"border-collapse":"collapse"}],["border-separate",{"border-collapse":"separate"}],[/^border-spacing-(.+)$/,([,e],{theme:t})=>{let r=t.spacing?.[e]??f.bracket.cssvar.global.auto.fraction.rem(e);if(r!=null)return{"--un-border-spacing-x":r,"--un-border-spacing-y":r,"border-spacing":sl}},{custom:il,autocomplete:["border-spacing","border-spacing-$spacing"]}],[/^border-spacing-([xy])-(.+)$/,([,e,t],{theme:r})=>{let n=r.spacing?.[t]??f.bracket.cssvar.global.auto.fraction.rem(t);if(n!=null)return{[`--un-border-spacing-${e}`]:n,"border-spacing":sl}},{custom:il,autocomplete:["border-spacing-(x|y)","border-spacing-(x|y)-$spacing"]}],["caption-top",{"caption-side":"top"}],["caption-bottom",{"caption-side":"bottom"}],["table-auto",{"table-layout":"auto"}],["table-fixed",{"table-layout":"fixed"}],["table-empty-cells-visible",{"empty-cells":"show"}],["table-empty-cells-hidden",{"empty-cells":"hide"}]];var $o={"--un-pan-x":T,"--un-pan-y":T,"--un-pinch-zoom":T},yo={preflightKeys:Object.keys($o)},vo="var(--un-pan-x) var(--un-pan-y) var(--un-pinch-zoom)",cl=[[/^touch-pan-(x|left|right)$/,([,e])=>({"--un-pan-x":`pan-${e}`,"touch-action":vo}),{custom:yo,autocomplete:["touch-pan","touch-pan-(x|left|right|y|up|down)"]}],[/^touch-pan-(y|up|down)$/,([,e])=>({"--un-pan-y":`pan-${e}`,"touch-action":vo}),{custom:yo}],["touch-pinch-zoom",{"--un-pinch-zoom":"pinch-zoom","touch-action":vo},{custom:yo}],["touch-auto",{"touch-action":"auto"}],["touch-manipulation",{"touch-action":"manipulation"}],["touch-none",{"touch-action":"none"}],...$("touch","touch-action")];var wo={"--un-ordinal":T,"--un-slashed-zero":T,"--un-numeric-figure":T,"--un-numeric-spacing":T,"--un-numeric-fraction":T},ze={preflightKeys:Object.keys(wo)};function Ae(e){return{...e,"font-variant-numeric":"var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)"}}var ll=[[/^ordinal$/,()=>Ae({"--un-ordinal":"ordinal"}),{custom:ze,autocomplete:"ordinal"}],[/^slashed-zero$/,()=>Ae({"--un-slashed-zero":"slashed-zero"}),{custom:ze,autocomplete:"slashed-zero"}],[/^lining-nums$/,()=>Ae({"--un-numeric-figure":"lining-nums"}),{custom:ze,autocomplete:"lining-nums"}],[/^oldstyle-nums$/,()=>Ae({"--un-numeric-figure":"oldstyle-nums"}),{custom:ze,autocomplete:"oldstyle-nums"}],[/^proportional-nums$/,()=>Ae({"--un-numeric-spacing":"proportional-nums"}),{custom:ze,autocomplete:"proportional-nums"}],[/^tabular-nums$/,()=>Ae({"--un-numeric-spacing":"tabular-nums"}),{custom:ze,autocomplete:"tabular-nums"}],[/^diagonal-fractions$/,()=>Ae({"--un-numeric-fraction":"diagonal-fractions"}),{custom:ze,autocomplete:"diagonal-fractions"}],[/^stacked-fractions$/,()=>Ae({"--un-numeric-fraction":"stacked-fractions"}),{custom:ze,autocomplete:"stacked-fractions"}],["normal-nums",{"font-variant-numeric":"normal"}]];var Rd={"bg-blend":"background-blend-mode","bg-clip":"-webkit-background-clip","bg-gradient":"linear-gradient","bg-image":"background-image","bg-origin":"background-origin","bg-position":"background-position","bg-repeat":"background-repeat","bg-size":"background-size","mix-blend":"mix-blend-mode",object:"object-fit","object-position":"object-position",write:"writing-mode","write-orient":"text-orientation"},fl=[[/^(.+?)-(\$.+)$/,([,e,t])=>{let r=Rd[e];if(r)return{[r]:f.cssvar(t)}}]];var ul=[[/^view-transition-([\w-]+)$/,([,e])=>({"view-transition-name":e})]];var pl=[pn,fl,dn,$c,ht,Qc,bt,mt,Gr,Yr,Dc,el,Zr,Hr,Nr,Xr,nn,Jr,dt,tn,en,Ir,al,Pt,uc,gt,cl,yt,xt,Gc,mc,Vr,vc,Wt,Lt,_t,Dr,qr,qc,Lc,Kr,xc,yc,Ct,vt,kt,Fr,Lr,dc,Wr,on,tl,rn,Pr,ln,St,Ar,an,Rt,Yc,Et,ll,Br,Tt,cn,fn,un,Xc,Zc,Jc,hc,gc,_r,rl,nl,At,Or,zt,bc,Ic,sn,Mr,$t,wt,Nc,Ur,ul,ol,jt,Qr].flat(1);var dl=[...wc];var ko={inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000",white:"#fff",rose:{50:"#fff1f2",100:"#ffe4e6",200:"#fecdd3",300:"#fda4af",400:"#fb7185",500:"#f43f5e",600:"#e11d48",700:"#be123c",800:"#9f1239",900:"#881337",950:"#4c0519"},pink:{50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843",950:"#500724"},fuchsia:{50:"#fdf4ff",100:"#fae8ff",200:"#f5d0fe",300:"#f0abfc",400:"#e879f9",500:"#d946ef",600:"#c026d3",700:"#a21caf",800:"#86198f",900:"#701a75",950:"#4a044e"},purple:{50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87",950:"#3b0764"},violet:{50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95",950:"#2e1065"},indigo:{50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81",950:"#1e1b4b"},blue:{50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a",950:"#172554"},sky:{50:"#f0f9ff",100:"#e0f2fe",200:"#bae6fd",300:"#7dd3fc",400:"#38bdf8",500:"#0ea5e9",600:"#0284c7",700:"#0369a1",800:"#075985",900:"#0c4a6e",950:"#082f49"},cyan:{50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63",950:"#083344"},teal:{50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e",800:"#115e59",900:"#134e4a",950:"#042f2e"},emerald:{50:"#ecfdf5",100:"#d1fae5",200:"#a7f3d0",300:"#6ee7b7",400:"#34d399",500:"#10b981",600:"#059669",700:"#047857",800:"#065f46",900:"#064e3b",950:"#022c22"},green:{50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",950:"#052e16"},lime:{50:"#f7fee7",100:"#ecfccb",200:"#d9f99d",300:"#bef264",400:"#a3e635",500:"#84cc16",600:"#65a30d",700:"#4d7c0f",800:"#3f6212",900:"#365314",950:"#1a2e05"},yellow:{50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12",950:"#422006"},amber:{50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f",950:"#451a03"},orange:{50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12",950:"#431407"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},gray:{50:"#f9fafb",100:"#f3f4f6",200:"#e5e7eb",300:"#d1d5db",400:"#9ca3af",500:"#6b7280",600:"#4b5563",700:"#374151",800:"#1f2937",900:"#111827",950:"#030712"},slate:{50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",800:"#1e293b",900:"#0f172a",950:"#020617"},zinc:{50:"#fafafa",100:"#f4f4f5",200:"#e4e4e7",300:"#d4d4d8",400:"#a1a1aa",500:"#71717a",600:"#52525b",700:"#3f3f46",800:"#27272a",900:"#18181b",950:"#09090b"},neutral:{50:"#fafafa",100:"#f5f5f5",200:"#e5e5e5",300:"#d4d4d4",400:"#a3a3a3",500:"#737373",600:"#525252",700:"#404040",800:"#262626",900:"#171717",950:"#0a0a0a"},stone:{50:"#fafaf9",100:"#f5f5f4",200:"#e7e5e4",300:"#d6d3d1",400:"#a8a29e",500:"#78716c",600:"#57534e",700:"#44403c",800:"#292524",900:"#1c1917",950:"#0c0a09"},light:{50:"#fdfdfd",100:"#fcfcfc",200:"#fafafa",300:"#f8f9fa",400:"#f6f6f6",500:"#f2f2f2",600:"#f1f3f5",700:"#e9ecef",800:"#dee2e6",900:"#dde1e3",950:"#d8dcdf"},dark:{50:"#4a4a4a",100:"#3c3c3c",200:"#323232",300:"#2d2d2d",400:"#222222",500:"#1f1f1f",600:"#1c1c1e",700:"#1b1b1b",800:"#181818",900:"#0f0f0f",950:"#080808"},get lightblue(){return this.sky},get lightBlue(){return this.sky},get warmgray(){return this.stone},get warmGray(){return this.stone},get truegray(){return this.neutral},get trueGray(){return this.neutral},get coolgray(){return this.gray},get coolGray(){return this.gray},get bluegray(){return this.slate},get blueGray(){return this.slate}};Object.values(ko).forEach(e=>{typeof e!="string"&&e!==void 0&&(e.DEFAULT=e.DEFAULT||e[400],Object.keys(e).forEach(t=>{let r=+t/100;r===Math.round(r)&&(e[r]=e[t])}))});var ml={DEFAULT:"8px",0:"0",sm:"4px",md:"12px",lg:"16px",xl:"24px","2xl":"40px","3xl":"64px"},gl={DEFAULT:["0 1px 2px rgb(0 0 0 / 0.1)","0 1px 1px rgb(0 0 0 / 0.06)"],sm:"0 1px 1px rgb(0 0 0 / 0.05)",md:["0 4px 3px rgb(0 0 0 / 0.07)","0 2px 2px rgb(0 0 0 / 0.06)"],lg:["0 10px 8px rgb(0 0 0 / 0.04)","0 4px 3px rgb(0 0 0 / 0.1)"],xl:["0 20px 13px rgb(0 0 0 / 0.03)","0 8px 5px rgb(0 0 0 / 0.08)"],"2xl":"0 25px 25px rgb(0 0 0 / 0.15)",none:"0 0 rgb(0 0 0 / 0)"},hl={sans:["ui-sans-serif","system-ui","-apple-system","BlinkMacSystemFont",'"Segoe UI"',"Roboto",'"Helvetica Neue"',"Arial",'"Noto Sans"',"sans-serif",'"Apple Color Emoji"','"Segoe UI Emoji"','"Segoe UI Symbol"','"Noto Color Emoji"'].join(","),serif:["ui-serif","Georgia","Cambria",'"Times New Roman"',"Times","serif"].join(","),mono:["ui-monospace","SFMono-Regular","Menlo","Monaco","Consolas",'"Liberation Mono"','"Courier New"',"monospace"].join(",")},bl={xs:["0.75rem","1rem"],sm:["0.875rem","1.25rem"],base:["1rem","1.5rem"],lg:["1.125rem","1.75rem"],xl:["1.25rem","1.75rem"],"2xl":["1.5rem","2rem"],"3xl":["1.875rem","2.25rem"],"4xl":["2.25rem","2.5rem"],"5xl":["3rem","1"],"6xl":["3.75rem","1"],"7xl":["4.5rem","1"],"8xl":["6rem","1"],"9xl":["8rem","1"]},xl={DEFAULT:"1.5rem",xs:"0.5rem",sm:"1rem",md:"1.5rem",lg:"2rem",xl:"2.5rem","2xl":"3rem","3xl":"4rem"},yl={DEFAULT:"1.5rem",none:"0",sm:"thin",md:"medium",lg:"thick"},vl={DEFAULT:["0 0 1px rgb(0 0 0 / 0.2)","0 0 1px rgb(1 0 5 / 0.1)"],none:"0 0 rgb(0 0 0 / 0)",sm:"1px 1px 3px rgb(36 37 47 / 0.25)",md:["0 1px 2px rgb(30 29 39 / 0.19)","1px 2px 4px rgb(54 64 147 / 0.18)"],lg:["3px 3px 6px rgb(0 0 0 / 0.26)","0 0 5px rgb(15 3 86 / 0.22)"],xl:["1px 1px 3px rgb(0 0 0 / 0.29)","2px 4px 7px rgb(73 64 125 / 0.35)"]},$l={none:"1",tight:"1.25",snug:"1.375",normal:"1.5",relaxed:"1.625",loose:"2"},To={tighter:"-0.05em",tight:"-0.025em",normal:"0em",wide:"0.025em",wider:"0.05em",widest:"0.1em"},wl={thin:"100",extralight:"200",light:"300",normal:"400",medium:"500",semibold:"600",bold:"700",extrabold:"800",black:"900"},kl=To,jo={sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},Sl={...jo},Cl={DEFAULT:"1px",none:"0"},Rl={DEFAULT:"1rem",none:"0",xs:"0.75rem",sm:"0.875rem",lg:"1.125rem",xl:"1.25rem","2xl":"1.5rem","3xl":"1.875rem","4xl":"2.25rem","5xl":"3rem","6xl":"3.75rem","7xl":"4.5rem","8xl":"6rem","9xl":"8rem"},El={DEFAULT:"150ms",none:"0s",75:"75ms",100:"100ms",150:"150ms",200:"200ms",300:"300ms",500:"500ms",700:"700ms",1e3:"1000ms"},Tl={DEFAULT:"0.25rem",none:"0",sm:"0.125rem",md:"0.375rem",lg:"0.5rem",xl:"0.75rem","2xl":"1rem","3xl":"1.5rem",full:"9999px"},jl={DEFAULT:["var(--un-shadow-inset) 0 1px 3px 0 rgb(0 0 0 / 0.1)","var(--un-shadow-inset) 0 1px 2px -1px rgb(0 0 0 / 0.1)"],none:"0 0 rgb(0 0 0 / 0)",sm:"var(--un-shadow-inset) 0 1px 2px 0 rgb(0 0 0 / 0.05)",md:["var(--un-shadow-inset) 0 4px 6px -1px rgb(0 0 0 / 0.1)","var(--un-shadow-inset) 0 2px 4px -2px rgb(0 0 0 / 0.1)"],lg:["var(--un-shadow-inset) 0 10px 15px -3px rgb(0 0 0 / 0.1)","var(--un-shadow-inset) 0 4px 6px -4px rgb(0 0 0 / 0.1)"],xl:["var(--un-shadow-inset) 0 20px 25px -5px rgb(0 0 0 / 0.1)","var(--un-shadow-inset) 0 8px 10px -6px rgb(0 0 0 / 0.1)"],"2xl":"var(--un-shadow-inset) 0 25px 50px -12px rgb(0 0 0 / 0.25)",inner:"inset 0 2px 4px 0 rgb(0 0 0 / 0.05)"},zl={DEFAULT:"3px",none:"0"},Al={auto:"auto"},Pl={mouse:"(hover) and (pointer: fine)"},Ol={...qe,...He,...Ge},ve={xs:"20rem",sm:"24rem",md:"28rem",lg:"32rem",xl:"36rem","2xl":"42rem","3xl":"48rem","4xl":"56rem","5xl":"64rem","6xl":"72rem","7xl":"80rem",prose:"65ch"},Vl={auto:"auto",...ve,screen:"100vw"},So={none:"none",...ve,screen:"100vw"},Ml={auto:"auto",...ve,screen:"100vb"},Fl={auto:"auto",...ve,screen:"100vi"},_l={auto:"auto",...ve,screen:"100vh"},Co={none:"none",...ve,screen:"100vh"},Ro={none:"none",...ve,screen:"100vb"},Eo={none:"none",...ve,screen:"100vi"},Ll={...ve},Ed={DEFAULT:"cubic-bezier(0.4, 0, 0.2, 1)",linear:"linear",in:"cubic-bezier(0.4, 0, 1, 1)",out:"cubic-bezier(0, 0, 0.2, 1)","in-out":"cubic-bezier(0.4, 0, 0.2, 1)"},Td={none:"none",all:"all",colors:["color","background-color","border-color","text-decoration-color","fill","stroke"].join(","),opacity:"opacity",shadow:"box-shadow",transform:"transform",get DEFAULT(){return[this.colors,"opacity","box-shadow","transform","filter","backdrop-filter"].join(",")}},zo={width:Vl,height:_l,maxWidth:So,maxHeight:Co,minWidth:So,minHeight:Co,inlineSize:Fl,blockSize:Ml,maxInlineSize:Eo,maxBlockSize:Ro,minInlineSize:Eo,minBlockSize:Ro,colors:ko,fontFamily:hl,fontSize:bl,fontWeight:wl,breakpoints:jo,verticalBreakpoints:Sl,borderRadius:Tl,lineHeight:$l,letterSpacing:To,wordSpacing:kl,boxShadow:jl,textIndent:xl,textShadow:vl,textStrokeWidth:yl,blur:ml,dropShadow:gl,easing:Ed,transitionProperty:Td,lineWidth:Cl,spacing:Rl,duration:El,ringWidth:zl,preflightBase:Ol,containers:Ll,zIndex:Al,media:Pl};var Wl={...zo,aria:{busy:'busy="true"',checked:'checked="true"',disabled:'disabled="true"',expanded:'expanded="true"',hidden:'hidden="true"',pressed:'pressed="true"',readonly:'readonly="true"',required:'required="true"',selected:'selected="true"'},animation:{keyframes:{pulse:"{0%, 100% {opacity:1} 50% {opacity:.5}}",bounce:"{0%, 100% {transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1)} 50% {transform:translateY(0);animation-timing-function:cubic-bezier(0,0,0.2,1)}}",spin:"{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",ping:"{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2);opacity:0}}","bounce-alt":"{from,20%,53%,80%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:translate3d(0,0,0)}40%,43%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-30px,0)}70%{animation-timing-function:cubic-bezier(0.755,0.05,0.855,0.06);transform:translate3d(0,-15px,0)}90%{transform:translate3d(0,-4px,0)}}",flash:"{from,50%,to{opacity:1}25%,75%{opacity:0}}","pulse-alt":"{from{transform:scale3d(1,1,1)}50%{transform:scale3d(1.05,1.05,1.05)}to{transform:scale3d(1,1,1)}}","rubber-band":"{from{transform:scale3d(1,1,1)}30%{transform:scale3d(1.25,0.75,1)}40%{transform:scale3d(0.75,1.25,1)}50%{transform:scale3d(1.15,0.85,1)}65%{transform:scale3d(0.95,1.05,1)}75%{transform:scale3d(1.05,0.95,1)}to{transform:scale3d(1,1,1)}}","shake-x":"{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(-10px,0,0)}20%,40%,60%,80%{transform:translate3d(10px,0,0)}}","shake-y":"{from,to{transform:translate3d(0,0,0)}10%,30%,50%,70%,90%{transform:translate3d(0,-10px,0)}20%,40%,60%,80%{transform:translate3d(0,10px,0)}}","head-shake":"{0%{transform:translateX(0)}6.5%{transform:translateX(-6px) rotateY(-9deg)}18.5%{transform:translateX(5px) rotateY(7deg)}31.5%{transform:translateX(-3px) rotateY(-5deg)}43.5%{transform:translateX(2px) rotateY(3deg)}50%{transform:translateX(0)}}",swing:"{20%{transform:rotate3d(0,0,1,15deg)}40%{transform:rotate3d(0,0,1,-10deg)}60%{transform:rotate3d(0,0,1,5deg)}80%{transform:rotate3d(0,0,1,-5deg)}to{transform:rotate3d(0,0,1,0deg)}}",tada:"{from{transform:scale3d(1,1,1)}10%,20%{transform:scale3d(0.9,0.9,0.9) rotate3d(0,0,1,-3deg)}30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg)}40%,60%,80%{transform:scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg)}to{transform:scale3d(1,1,1)}}",wobble:"{from{transform:translate3d(0,0,0)}15%{transform:translate3d(-25%,0,0) rotate3d(0,0,1,-5deg)}30%{transform:translate3d(20%,0,0) rotate3d(0,0,1,3deg)}45%{transform:translate3d(-15%,0,0) rotate3d(0,0,1,-3deg)}60%{transform:translate3d(10%,0,0) rotate3d(0,0,1,2deg)}75%{transform:translate3d(-5%,0,0) rotate3d(0,0,1,-1deg)}to{transform:translate3d(0,0,0)}}",jello:"{from,11.1%,to{transform:translate3d(0,0,0)}22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{transform:skewX(6.25deg) skewY(6.25deg)}44.4%{transform:skewX(-3.125deg)skewY(-3.125deg)}55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{transform:skewX(-0.78125deg) skewY(-0.78125deg)}77.7%{transform:skewX(0.390625deg) skewY(0.390625deg)}88.8%{transform:skewX(-0.1953125deg) skewY(-0.1953125deg)}}","heart-beat":"{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}",hinge:"{0%{transform-origin:top left;animation-timing-function:ease-in-out}20%,60%{transform:rotate3d(0,0,1,80deg);transform-origin:top left;animation-timing-function:ease-in-out}40%,80%{transform:rotate3d(0,0,1,60deg);transform-origin:top left;animation-timing-function:ease-in-out}to{transform:translate3d(0,700px,0);opacity:0}}","jack-in-the-box":"{from{opacity:0;transform-origin:center bottom;transform:scale(0.1) rotate(30deg)}50%{transform:rotate(-10deg)}70%{transform:rotate(3deg)}to{transform:scale(1)}}","light-speed-in-left":"{from{opacity:0;transform:translate3d(-100%,0,0) skewX(-30deg)}60%{opacity:1;transform:skewX(20deg)}80%{transform:skewX(-5deg)}to{transform:translate3d(0,0,0)}}","light-speed-in-right":"{from{opacity:0;transform:translate3d(100%,0,0) skewX(-30deg)}60%{opacity:1;transform:skewX(20deg)}80%{transform:skewX(-5deg)}to{transform:translate3d(0,0,0)}}","light-speed-out-left":"{from{opacity:1}to{opacity:0;transform:translate3d(-100%,0,0) skewX(30deg)}}","light-speed-out-right":"{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) skewX(30deg)}}",flip:"{from{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,0) rotate3d(0,1,0,-360deg);animation-timing-function:ease-out}40%{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,150px) rotate3d(0,1,0,-190deg);animation-timing-function:ease-out}50%{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,150px) rotate3d(0,1,0,-170deg);animation-timing-function:ease-in}80%{transform:perspective(400px) scale3d(0.95,0.95,0.95) translate3d(0,0,0) rotate3d(0,1,0,0deg);animation-timing-function:ease-in}to{transform:perspective(400px) scale3d(1,1,1) translate3d(0,0,0) rotate3d(0,1,0,0deg);animation-timing-function:ease-in}}","flip-in-x":"{from{transform:perspective(400px) rotate3d(1,0,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(1,0,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(1,0,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(1,0,0,-5deg)}to{transform:perspective(400px)}}","flip-in-y":"{from{transform:perspective(400px) rotate3d(0,1,0,90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotate3d(0,1,0,-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotate3d(0,1,0,10deg);opacity:1}80%{transform:perspective(400px) rotate3d(0,1,0,-5deg)}to{transform:perspective(400px)}}","flip-out-x":"{from{transform:perspective(400px)}30%{transform:perspective(400px) rotate3d(1,0,0,-20deg);opacity:1}to{transform:perspective(400px) rotate3d(1,0,0,90deg);opacity:0}}","flip-out-y":"{from{transform:perspective(400px)}30%{transform:perspective(400px) rotate3d(0,1,0,-15deg);opacity:1}to{transform:perspective(400px) rotate3d(0,1,0,90deg);opacity:0}}","rotate-in":"{from{transform-origin:center;transform:rotate3d(0,0,1,-200deg);opacity:0}to{transform-origin:center;transform:translate3d(0,0,0);opacity:1}}","rotate-in-down-left":"{from{transform-origin:left bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}to{transform-origin:left bottom;transform:translate3d(0,0,0);opacity:1}}","rotate-in-down-right":"{from{transform-origin:right bottom;transform:rotate3d(0,0,1,45deg);opacity:0}to{transform-origin:right bottom;transform:translate3d(0,0,0);opacity:1}}","rotate-in-up-left":"{from{transform-origin:left top;transform:rotate3d(0,0,1,45deg);opacity:0}to{transform-origin:left top;transform:translate3d(0,0,0);opacity:1}}","rotate-in-up-right":"{from{transform-origin:right bottom;transform:rotate3d(0,0,1,-90deg);opacity:0}to{transform-origin:right bottom;transform:translate3d(0,0,0);opacity:1}}","rotate-out":"{from{transform-origin:center;opacity:1}to{transform-origin:center;transform:rotate3d(0,0,1,200deg);opacity:0}}","rotate-out-down-left":"{from{transform-origin:left bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,45deg);opacity:0}}","rotate-out-down-right":"{from{transform-origin:right bottom;opacity:1}to{transform-origin:right bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}}","rotate-out-up-left":"{from{transform-origin:left bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,-45deg);opacity:0}}","rotate-out-up-right":"{from{transform-origin:right bottom;opacity:1}to{transform-origin:left bottom;transform:rotate3d(0,0,1,90deg);opacity:0}}","roll-in":"{from{opacity:0;transform:translate3d(-100%,0,0) rotate3d(0,0,1,-120deg)}to{opacity:1;transform:translate3d(0,0,0)}}","roll-out":"{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0) rotate3d(0,0,1,120deg)}}","zoom-in":"{from{opacity:0;transform:scale3d(0.3,0.3,0.3)}50%{opacity:1}}","zoom-in-down":"{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,-1000px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,60px,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}","zoom-in-left":"{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(-1000px,0,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(10px,0,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}","zoom-in-right":"{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(1000px,0,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(-10px,0,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}","zoom-in-up":"{from{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,1000px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}60%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}","zoom-out":"{from{opacity:1}50%{opacity:0;transform:scale3d(0.3,0.3,0.3)}to{opacity:0}}","zoom-out-down":"{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,-60px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}to{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,2000px,0);transform-origin:center bottom;animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}","zoom-out-left":"{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(42px,0,0)}to{opacity:0;transform:scale(0.1) translate3d(-2000px,0,0);transform-origin:left center}}","zoom-out-right":"{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(-42px,0,0)}to{opacity:0;transform:scale(0.1) translate3d(2000px,0,0);transform-origin:right center}}","zoom-out-up":"{40%{opacity:1;transform:scale3d(0.475,0.475,0.475) translate3d(0,60px,0);animation-timing-function:cubic-bezier(0.55,0.055,0.675,0.19)}to{opacity:0;transform:scale3d(0.1,0.1,0.1) translate3d(0,-2000px,0);transform-origin:center bottom;animation-timing-function:cubic-bezier(0.175,0.885,0.32,1)}}","bounce-in":"{from,20%,40%,60%,80%,to{animation-timing-function:ease-in-out}0%{opacity:0;transform:scale3d(0.3,0.3,0.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(0.9,0.9,0.9)}60%{transform:scale3d(1.03,1.03,1.03);opacity:1}80%{transform:scale3d(0.97,0.97,0.97)}to{opacity:1;transform:scale3d(1,1,1)}}","bounce-in-down":"{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0)}60%{opacity:1;transform:translate3d(0,25px,0)}75%{transform:translate3d(0,-10px,0)}90%{transform:translate3d(0,5px,0)}to{transform:translate3d(0,0,0)}}","bounce-in-left":"{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0)}60%{opacity:1;transform:translate3d(25px,0,0)}75%{transform:translate3d(-10px,0,0)}90%{transform:translate3d(5px,0,0)}to{transform:translate3d(0,0,0)}}","bounce-in-right":"{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0)}60%{opacity:1;transform:translate3d(-25px,0,0)}75%{transform:translate3d(10px,0,0)}90%{transform:translate3d(-5px,0,0)}to{transform:translate3d(0,0,0)}}","bounce-in-up":"{from,60%,75%,90%,to{animation-timing-function:cubic-bezier(0.215,0.61,0.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0)}60%{opacity:1;transform:translate3d(0,-20px,0)}75%{transform:translate3d(0,10px,0)}90%{transform:translate3d(0,-5px,0)}to{transform:translate3d(0,0,0)}}","bounce-out":"{20%{transform:scale3d(0.9,0.9,0.9)}50%,55%{opacity:1;transform:scale3d(1.1,1.1,1.1)}to{opacity:0;transform:scale3d(0.3,0.3,0.3)}}","bounce-out-down":"{20%{transform:translate3d(0,10px,0)}40%,45%{opacity:1;transform:translate3d(0,-20px,0)}to{opacity:0;transform:translate3d(0,2000px,0)}}","bounce-out-left":"{20%{opacity:1;transform:translate3d(20px,0,0)}to{opacity:0;transform:translate3d(-2000px,0,0)}}","bounce-out-right":"{20%{opacity:1;transform:translate3d(-20px,0,0)}to{opacity:0;transform:translate3d(2000px,0,0)}}","bounce-out-up":"{20%{transform:translate3d(0,-10px,0)}40%,45%{opacity:1;transform:translate3d(0,20px,0)}to{opacity:0;transform:translate3d(0,-2000px,0)}}","slide-in-down":"{from{transform:translate3d(0,-100%,0);visibility:visible}to{transform:translate3d(0,0,0)}}","slide-in-left":"{from{transform:translate3d(-100%,0,0);visibility:visible}to{transform:translate3d(0,0,0)}}","slide-in-right":"{from{transform:translate3d(100%,0,0);visibility:visible}to{transform:translate3d(0,0,0)}}","slide-in-up":"{from{transform:translate3d(0,100%,0);visibility:visible}to{transform:translate3d(0,0,0)}}","slide-out-down":"{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(0,100%,0)}}","slide-out-left":"{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(-100%,0,0)}}","slide-out-right":"{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(100%,0,0)}}","slide-out-up":"{from{transform:translate3d(0,0,0)}to{visibility:hidden;transform:translate3d(0,-100%,0)}}","fade-in":"{from{opacity:0}to{opacity:1}}","fade-in-down":"{from{opacity:0;transform:translate3d(0,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-down-big":"{from{opacity:0;transform:translate3d(0,-2000px,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-left":"{from{opacity:0;transform:translate3d(-100%,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-left-big":"{from{opacity:0;transform:translate3d(-2000px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-right":"{from{opacity:0;transform:translate3d(100%,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-right-big":"{from{opacity:0;transform:translate3d(2000px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-up":"{from{opacity:0;transform:translate3d(0,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-up-big":"{from{opacity:0;transform:translate3d(0,2000px,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-top-left":"{from{opacity:0;transform:translate3d(-100%,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-top-right":"{from{opacity:0;transform:translate3d(100%,-100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-bottom-left":"{from{opacity:0;transform:translate3d(-100%,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-in-bottom-right":"{from{opacity:0;transform:translate3d(100%,100%,0)}to{opacity:1;transform:translate3d(0,0,0)}}","fade-out":"{from{opacity:1}to{opacity:0}}","fade-out-down":"{from{opacity:1}to{opacity:0;transform:translate3d(0,100%,0)}}","fade-out-down-big":"{from{opacity:1}to{opacity:0;transform:translate3d(0,2000px,0)}}","fade-out-left":"{from{opacity:1}to{opacity:0;transform:translate3d(-100%,0,0)}}","fade-out-left-big":"{from{opacity:1}to{opacity:0;transform:translate3d(-2000px,0,0)}}","fade-out-right":"{from{opacity:1}to{opacity:0;transform:translate3d(100%,0,0)}}","fade-out-right-big":"{from{opacity:1}to{opacity:0;transform:translate3d(2000px,0,0)}}","fade-out-up":"{from{opacity:1}to{opacity:0;transform:translate3d(0,-100%,0)}}","fade-out-up-big":"{from{opacity:1}to{opacity:0;transform:translate3d(0,-2000px,0)}}","fade-out-top-left":"{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-100%,-100%,0)}}","fade-out-top-right":"{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(100%,-100%,0)}}","fade-out-bottom-left":"{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(-100%,100%,0)}}","fade-out-bottom-right":"{from{opacity:1;transform:translate3d(0,0,0)}to{opacity:0;transform:translate3d(100%,100%,0)}}","back-in-up":"{0%{opacity:0.7;transform:translateY(1200px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}","back-in-down":"{0%{opacity:0.7;transform:translateY(-1200px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}","back-in-right":"{0%{opacity:0.7;transform:translateX(2000px) scale(0.7)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}","back-in-left":"{0%{opacity:0.7;transform:translateX(-2000px) scale(0.7)}80%{opacity:0.7;transform:translateX(0px) scale(0.7)}100%{opacity:1;transform:scale(1)}}","back-out-up":"{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateY(-700px) scale(0.7)}}","back-out-down":"{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateY(700px) scale(0.7)}}","back-out-right":"{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateY(0px) scale(0.7)}100%{opacity:0.7;transform:translateX(2000px) scale(0.7)}}","back-out-left":"{0%{opacity:1;transform:scale(1)}80%{opacity:0.7;transform:translateX(-2000px) scale(0.7)}100%{opacity:0.7;transform:translateY(-700px) scale(0.7)}}"},durations:{pulse:"2s","heart-beat":"1.3s","bounce-in":"0.75s","bounce-out":"0.75s","flip-out-x":"0.75s","flip-out-y":"0.75s",hinge:"2s"},timingFns:{pulse:"cubic-bezier(0.4,0,.6,1)",ping:"cubic-bezier(0,0,.2,1)","head-shake":"ease-in-out","heart-beat":"ease-in-out","pulse-alt":"ease-in-out","light-speed-in-left":"ease-out","light-speed-in-right":"ease-out","light-speed-out-left":"ease-in","light-speed-out-right":"ease-in"},properties:{"bounce-alt":{"transform-origin":"center bottom"},jello:{"transform-origin":"center"},swing:{"transform-origin":"top center"},flip:{"backface-visibility":"visible"},"flip-in-x":{"backface-visibility":"visible !important"},"flip-in-y":{"backface-visibility":"visible !important"},"flip-out-x":{"backface-visibility":"visible !important"},"flip-out-y":{"backface-visibility":"visible !important"},"rotate-in":{"transform-origin":"center"},"rotate-in-down-left":{"transform-origin":"left bottom"},"rotate-in-down-right":{"transform-origin":"right bottom"},"rotate-in-up-left":{"transform-origin":"left bottom"},"rotate-in-up-right":{"transform-origin":"right bottom"},"rotate-out":{"transform-origin":"center"},"rotate-out-down-left":{"transform-origin":"left bottom"},"rotate-out-down-right":{"transform-origin":"right bottom"},"rotate-out-up-left":{"transform-origin":"left bottom"},"rotate-out-up-right":{"transform-origin":"right bottom"},hinge:{"transform-origin":"top left"},"zoom-out-down":{"transform-origin":"center bottom"},"zoom-out-left":{"transform-origin":"left center"},"zoom-out-right":{"transform-origin":"right center"},"zoom-out-up":{"transform-origin":"center bottom"}},counts:{spin:"infinite",ping:"infinite",pulse:"infinite","pulse-alt":"infinite",bounce:"infinite","bounce-alt":"infinite"},category:{pulse:"Attention Seekers",bounce:"Attention Seekers",spin:"Attention Seekers",ping:"Attention Seekers","bounce-alt":"Attention Seekers",flash:"Attention Seekers","pulse-alt":"Attention Seekers","rubber-band":"Attention Seekers","shake-x":"Attention Seekers","shake-y":"Attention Seekers","head-shake":"Attention Seekers",swing:"Attention Seekers",tada:"Attention Seekers",wobble:"Attention Seekers",jello:"Attention Seekers","heart-beat":"Attention Seekers",hinge:"Specials","jack-in-the-box":"Specials","light-speed-in-left":"Lightspeed","light-speed-in-right":"Lightspeed","light-speed-out-left":"Lightspeed","light-speed-out-right":"Lightspeed",flip:"Flippers","flip-in-x":"Flippers","flip-in-y":"Flippers","flip-out-x":"Flippers","flip-out-y":"Flippers","rotate-in":"Rotating Entrances","rotate-in-down-left":"Rotating Entrances","rotate-in-down-right":"Rotating Entrances","rotate-in-up-left":"Rotating Entrances","rotate-in-up-right":"Rotating Entrances","rotate-out":"Rotating Exits","rotate-out-down-left":"Rotating Exits","rotate-out-down-right":"Rotating Exits","rotate-out-up-left":"Rotating Exits","rotate-out-up-right":"Rotating Exits","roll-in":"Specials","roll-out":"Specials","zoom-in":"Zooming Entrances","zoom-in-down":"Zooming Entrances","zoom-in-left":"Zooming Entrances","zoom-in-right":"Zooming Entrances","zoom-in-up":"Zooming Entrances","zoom-out":"Zooming Exits","zoom-out-down":"Zooming Exits","zoom-out-left":"Zooming Exits","zoom-out-right":"Zooming Exits","zoom-out-up":"Zooming Exits","bounce-in":"Bouncing Entrances","bounce-in-down":"Bouncing Entrances","bounce-in-left":"Bouncing Entrances","bounce-in-right":"Bouncing Entrances","bounce-in-up":"Bouncing Entrances","bounce-out":"Bouncing Exits","bounce-out-down":"Bouncing Exits","bounce-out-left":"Bouncing Exits","bounce-out-right":"Bouncing Exits","bounce-out-up":"Bouncing Exits","slide-in-down":"Sliding Entrances","slide-in-left":"Sliding Entrances","slide-in-right":"Sliding Entrances","slide-in-up":"Sliding Entrances","slide-out-down":"Sliding Exits","slide-out-left":"Sliding Exits","slide-out-right":"Sliding Exits","slide-out-up":"Sliding Exits","fade-in":"Fading Entrances","fade-in-down":"Fading Entrances","fade-in-down-big":"Fading Entrances","fade-in-left":"Fading Entrances","fade-in-left-big":"Fading Entrances","fade-in-right":"Fading Entrances","fade-in-right-big":"Fading Entrances","fade-in-up":"Fading Entrances","fade-in-up-big":"Fading Entrances","fade-in-top-left":"Fading Entrances","fade-in-top-right":"Fading Entrances","fade-in-bottom-left":"Fading Entrances","fade-in-bottom-right":"Fading Entrances","fade-out":"Fading Exits","fade-out-down":"Fading Exits","fade-out-down-big":"Fading Exits","fade-out-left":"Fading Exits","fade-out-left-big":"Fading Exits","fade-out-right":"Fading Exits","fade-out-right-big":"Fading Exits","fade-out-up":"Fading Exits","fade-out-up-big":"Fading Exits","fade-out-top-left":"Fading Exits","fade-out-top-right":"Fading Exits","fade-out-bottom-left":"Fading Exits","fade-out-bottom-right":"Fading Exits","back-in-up":"Back Entrances","back-in-down":"Back Entrances","back-in-right":"Back Entrances","back-in-left":"Back Entrances","back-out-up":"Back Exits","back-out-down":"Back Exits","back-out-right":"Back Exits","back-out-left":"Back Exits"}},media:{portrait:"(orientation: portrait)",landscape:"(orientation: landscape)",os_dark:"(prefers-color-scheme: dark)",os_light:"(prefers-color-scheme: light)",motion_ok:"(prefers-reduced-motion: no-preference)",motion_not_ok:"(prefers-reduced-motion: reduce)",high_contrast:"(prefers-contrast: high)",low_contrast:"(prefers-contrast: low)",opacity_ok:"(prefers-reduced-transparency: no-preference)",opacity_not_ok:"(prefers-reduced-transparency: reduce)",use_data_ok:"(prefers-reduced-data: no-preference)",use_data_not_ok:"(prefers-reduced-data: reduce)",touch:"(hover: none) and (pointer: coarse)",stylus:"(hover: none) and (pointer: fine)",pointer:"(hover) and (pointer: coarse)",mouse:"(hover) and (pointer: fine)",hd_color:"(dynamic-range: high)"},supports:{grid:"(display: grid)"},preflightBase:{...qe,...$o,...bo,...wo,...xo,...He,...Ge,...go,...ho}};var Ul=[N("svg",e=>({selector:`${e.selector} svg`}))];var Bl=[N(".dark",e=>({prefix:`.dark $$ ${e.prefix}`})),N(".light",e=>({prefix:`.light $$ ${e.prefix}`})),G("@dark","@media (prefers-color-scheme: dark)"),G("@light","@media (prefers-color-scheme: light)")];var Dl={name:"aria",match(e,t){let r=A("aria-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n)??t.theme.aria?.[n]??"";if(i)return{matcher:o,selector:s=>`${s}[aria-${i}]`}}},multiPass:!0};function bn(e,t,r={}){return{name:`${e}-aria`,match(n,o){let i=A(`${e}-aria-`,n,o.generator.config.separators);if(i){let[s,a,c]=i,l=f.bracket(s)??o.theme.aria?.[s]??"";if(l){let u=!!r?.attributifyPseudo,d=r?.prefix??"";d=(Array.isArray(d)?d:[d]).filter(Boolean)[0]??"";let h=`${u?`[${d}${e}=""]`:`.${d}${e}`}`,m=J(c?`/${c}`:"");return{matcher:a,handle:(g,x)=>{let k=new RegExp(`${K(h)}${K(m)}(?:\\[.+?\\])+`),C=g.prefix.match(k),v;if(C){let b=(C.index??0)+h.length+m.length;v=[g.prefix.slice(0,b),`[aria-${l}]`,g.prefix.slice(b)].join("")}else{let b=Math.max(g.prefix.indexOf(h),0);v=[g.prefix.slice(0,b),h,m,`[aria-${l}]`,t,g.prefix.slice(b)].join("")}return x({...g,prefix:v})}}}}},multiPass:!0}}function jd(){return{name:"has-aria",match(e,t){let r=A("has-aria-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n)??t.theme.aria?.[n]??"";if(i)return{matcher:o,handle:(s,a)=>a({...s,pseudo:`${s.pseudo}:has([aria-${i}])`})}}},multiPass:!0}}function Nl(e={}){return[bn("group"," ",e),bn("peer","~",e),bn("parent",">",e),bn("previous","+",e),jd()]}var Il=/(max|min)-\[([^\]]*)\]:/;function Kl(){let e={};return{name:"breakpoints",match(t,r){if(Il.test(t)){let o=t.match(Il);return{matcher:t.replace(o[0],""),handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}@media (${o[1]}-width: ${o[2]})`})}}let n=(Te(r)??[]).map(({point:o,size:i},s)=>[o,i,s]);for(let[o,i,s]of n){e[o]||(e[o]=new RegExp(`^((?:([al]t-|[<~]|max-))?${o}(?:${r.generator.config.separators.join("|")}))`));let a=t.match(e[o]);if(!a)continue;let[,c]=a,l=t.slice(c.length);if(l==="container")continue;let u=c.startsWith("lt-")||c.startsWith("<")||c.startsWith("max-"),d=c.startsWith("at-")||c.startsWith("~"),h=3e3;return u?(h-=s+1,{matcher:l,handle:(m,g)=>g({...m,parent:`${m.parent?`${m.parent} $$ `:""}@media (max-width: ${Ue(i)})`,parentOrder:h})}):(h+=s+1,d&&s<n.length-1?{matcher:l,handle:(m,g)=>g({...m,parent:`${m.parent?`${m.parent} $$ `:""}@media (min-width: ${i}) and (max-width: ${Ue(n[s+1][1])})`,parentOrder:h})}:{matcher:l,handle:(m,g)=>g({...m,parent:`${m.parent?`${m.parent} $$ `:""}@media (min-width: ${i})`,parentOrder:h})})}},multiPass:!0,autocomplete:"(at-|lt-|max-|)$breakpoints:"}}var Gl=[N("*",e=>({selector:`${e.selector} > *`}),{order:-1})];function Ut(e,t){return{name:`combinator:${e}`,match(r,n){if(!r.startsWith(e))return;let o=n.generator.config.separators,i=X(`${e}-`,r,o);if(!i){for(let a of o)if(r.startsWith(`${e}${a}`)){i=["",r.slice(e.length+a.length)];break}if(!i)return}let s=f.bracket(i[0])??"";return s===""&&(s="*"),{matcher:i[1],selector:a=>`${a}${t}${s}`}},multiPass:!0}}var Hl=[Ut("all"," "),Ut("children",">"),Ut("next","+"),Ut("sibling","+"),Ut("siblings","~")],ql={name:"@",match(e,t){if(e.startsWith("@container"))return;let r=A("@",e,t.generator.config.separators);if(r){let[n,o,i]=r,s=f.bracket(n),a;if(s?a=f.numberWithUnit(s):a=t.theme.containers?.[n]??"",a){let c=1e3+Object.keys(t.theme.containers??{}).indexOf(n);return i&&(c+=1e3),{matcher:o,handle:(l,u)=>u({...l,parent:`${l.parent?`${l.parent} $$ `:""}@container${i?` ${i} `:" "}(min-width: ${a})`,parentOrder:c})}}}},multiPass:!0};function Yl(e={}){if(e?.dark==="class"||typeof e.dark=="object"){let{dark:t=".dark",light:r=".light"}=typeof e.dark=="string"?{}:e.dark;return[N("dark",S(t).map(n=>o=>({prefix:`${n} $$ ${o.prefix}`}))),N("light",S(r).map(n=>o=>({prefix:`${n} $$ ${o.prefix}`})))]}return[G("dark","@media (prefers-color-scheme: dark)"),G("light","@media (prefers-color-scheme: light)")]}var Xl={name:"data",match(e,t){let r=A("data-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n)??t.theme.data?.[n]??"";if(i)return{matcher:o,selector:s=>`${s}[data-${i}]`}}},multiPass:!0};function xn(e,t,r={}){return{name:`${e}-data`,match(n,o){let i=A(`${e}-data-`,n,o.generator.config.separators);if(i){let[s,a,c]=i,l=f.bracket(s)??o.theme.data?.[s]??"";if(l){let u=!!r?.attributifyPseudo,d=r?.prefix??"";d=(Array.isArray(d)?d:[d]).filter(Boolean)[0]??"";let h=`${u?`[${d}${e}=""]`:`.${d}${e}`}`,m=J(c?`/${c}`:"");return{matcher:a,handle:(g,x)=>{let k=new RegExp(`${K(h)}${K(m)}(?:\\[.+?\\])+`),C=g.prefix.match(k),v;if(C){let b=(C.index??0)+h.length+m.length;v=[g.prefix.slice(0,b),`[data-${l}]`,g.prefix.slice(b)].join("")}else{let b=Math.max(g.prefix.indexOf(h),0);v=[g.prefix.slice(0,b),h,m,`[data-${l}]`,t,g.prefix.slice(b)].join("")}return x({...g,prefix:v})}}}}},multiPass:!0}}function zd(){return{name:"has-data",match(e,t){let r=A("has-data-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n)??t.theme.data?.[n]??"";if(i)return{matcher:o,handle:(s,a)=>a({...s,pseudo:`${s.pseudo}:has([data-${i}])`})}}},multiPass:!0}}function Zl(e={}){return[xn("group"," ",e),xn("peer","~",e),xn("parent",">",e),xn("previous","+",e),zd()]}var Jl=[N("rtl",e=>({prefix:`[dir="rtl"] $$ ${e.prefix}`})),N("ltr",e=>({prefix:`[dir="ltr"] $$ ${e.prefix}`}))];function Ql(){let e;return{name:"important",match(t,r){e||(e=new RegExp(`^(important(?:${r.generator.config.separators.join("|")})|!)`));let n,o=t.match(e);if(o?n=t.slice(o[0].length):t.endsWith("!")&&(n=t.slice(0,-1)),n)return{matcher:n,body:i=>(i.forEach(s=>{s[1]!=null&&(s[1]+=" !important")}),i)}}}}var ef=G("print","@media print"),tf={name:"media",match(e,t){let r=A("media-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n)??"";if(i===""&&(i=t.theme.media?.[n]??""),i)return{matcher:o,handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}@media ${i}`})}}},multiPass:!0},rf={name:"selector",match(e,t){let r=X("selector-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n);if(i)return{matcher:o,selector:()=>i}}}},nf={name:"layer",match(e,t){let r=A("layer-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n)??n;if(i)return{matcher:o,handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}@layer ${i}`})}}}},of={name:"uno-layer",match(e,t){let r=A("uno-layer-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n)??n;if(i)return{matcher:o,layer:i}}}},sf={name:"scope",match(e,t){let r=X("scope-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n);if(i)return{matcher:o,selector:s=>`${i} $$ ${s}`}}}},af={name:"variables",match(e,t){if(!e.startsWith("["))return;let[r,n]=re(e,"[","]")??[];if(!(r&&n))return;let o;for(let a of t.generator.config.separators)if(n.startsWith(a)){o=n.slice(a.length);break}if(o==null)return;let i=f.bracket(r)??"",s=i.startsWith("@");if(s||i.includes("&"))return{matcher:o,handle(a,c){let l=s?{parent:`${a.parent?`${a.parent} $$ `:""}${i}`}:{selector:i.replace(/&/g,a.selector)};return c({...a,...l})}}},multiPass:!0},cf={name:"theme-variables",match(e,t){if(tr(e))return{matcher:e,handle(r,n){return n({...r,entries:JSON.parse(rr(JSON.stringify(r.entries),t.theme))})}}}},lf=/^-?[0-9.]+(?:[a-z]+|%)?$/,ff=/-?[0-9.]+(?:[a-z]+|%)?/,Ad=[/\b(opacity|color|flex|backdrop-filter|^filter|transform)\b/];function Pd(e){let t=e.match(ut)||e.match(Sr);if(t){let[r,n]=pe(`(${t[2]})${t[3]}`,"(",")"," ")??[];if(r)return`calc(${t[1]}${r} * -1)${n?` ${n}`:""}`}}var Od=/\b(hue-rotate)\s*(\(.*)/;function Vd(e){let t=e.match(Od);if(t){let[r,n]=pe(t[2],"(",")"," ")??[];if(r){let o=lf.test(r.slice(1,-1))?r.replace(ff,i=>i.startsWith("-")?i.slice(1):`-${i}`):`(calc(${r} * -1))`;return`${t[1]}${o}${n?` ${n}`:""}`}}}var uf={name:"negative",match(e){if(e.startsWith("-"))return{matcher:e.slice(1),body:t=>{if(t.find(n=>n[0]===io))return;let r=!1;return t.forEach(n=>{let o=n[1]?.toString();if(!o||o==="0"||Ad.some(a=>a.test(n[0])))return;let i=Pd(o);if(i){n[1]=i,r=!0;return}let s=Vd(o);if(s){n[1]=s,r=!0;return}lf.test(o)&&(n[1]=o.replace(ff,a=>a.startsWith("-")?a.slice(1):`-${a}`),r=!0)}),r?t:[]}}}};function pf(){return or({getBracket:re,h:f,variantGetBracket:X})}function df(){return ir({getBracket:re,h:f,variantGetBracket:X})}function mf(e={}){return sr(e,{getBracket:re,h:f,variantGetBracket:X})}var gf=ar(),hf={name:"starting",match(e){if(e.startsWith("starting:"))return{matcher:e.slice(9),handle:(t,r)=>r({...t,parent:"@starting-style"})}}},bf={name:"supports",match(e,t){let r=A("supports-",e,t.generator.config.separators);if(r){let[n,o]=r,i=f.bracket(n)??"";if(i===""&&(i=t.theme.supports?.[n]??""),i)return i.startsWith("(")&&i.endsWith(")")||(i=`(${i})`),{matcher:o,handle:(s,a)=>a({...s,parent:`${s.parent?`${s.parent} $$ `:""}@supports ${i}`})}}},multiPass:!0};function Ao(e){return[Dl,Xl,nf,rf,of,uf,hf,Ql(),bf,ef,tf,Kl(),...Hl,...pf(),df(),...mf(e),gf,...Yl(e),...Jl,sf,...Gl,ql,af,...Zl(e),...Nl(e),cf]}var xf=[G("contrast-more","@media (prefers-contrast: more)"),G("contrast-less","@media (prefers-contrast: less)")],yf=[G("motion-reduce","@media (prefers-reduced-motion: reduce)"),G("motion-safe","@media (prefers-reduced-motion: no-preference)")],vf=[G("landscape","@media (orientation: landscape)"),G("portrait","@media (orientation: portrait)")];var $f=e=>{if(!e.startsWith("_")&&(/space-[xy]-.+$/.test(e)||/divide-/.test(e)))return{matcher:e,selector:t=>{let r=">:not([hidden])~:not([hidden])";return t.includes(r)?t:`${t}${r}`}}},wf=[N("@hover",e=>({parent:`${e.parent?`${e.parent} $$ `:""}@media (hover: hover) and (pointer: fine)`,selector:`${e.selector||""}:hover`}))];function kf(e,t,r){return`calc(${t} + (${e} - ${t}) * ${r} / 100)`}function Sf(e,t,r){let n=[e,t],o=[];for(let s=0;s<2;s++){let a=typeof n[s]=="string"?Y(n[s]):n[s];if(!a||!["rgb","rgba"].includes(a.type))return;o.push(a)}let i=[];for(let s=0;s<3;s++)i.push(kf(o[0].components[s],o[1].components[s],r));return{type:"rgb",components:i,alpha:kf(o[0].alpha??1,o[1].alpha??1,r)}}function Cf(e,t){return Sf("#fff",e,t)}function Rf(e,t){return Sf("#000",e,t)}function Md(e,t){let r=Number.parseFloat(`${t}`);if(!Number.isNaN(r))return r>0?Rf(e,t):Cf(e,-r)}var Fd={tint:Cf,shade:Rf,shift:Md};function Ef(){let e;return{name:"mix",match(t,r){e||(e=new RegExp(`^mix-(tint|shade|shift)-(-?\\d{1,3})(?:${r.generator.config.separators.join("|")})`));let n=t.match(e);if(n)return{matcher:t.slice(n[0].length),body:o=>(o.forEach(i=>{if(i[1]){let s=Y(`${i[1]}`);if(s){let a=Fd[n[1]](s,n[2]);a&&(i[1]=j(a))}}}),o)}}}}var Tf=(e,{theme:t})=>{let r=e.match(/^(.*)\b(placeholder-)(.+)$/);if(r){let[,n="",o,i]=r;if(Fe(i,t,"accentColor")||_d(i))return{matcher:`${n}placeholder-$ ${o}${i}`}}};function _d(e){let t=e.match(/^op(?:acity)?-?(.+)$/);return t&&t[1]!=null?f.bracket.percent(t[1])!=null:!1}function jf(e){return[Tf,$f,...Ao(e),...xf,...vf,...yf,...Ul,...Bl,...wf,Ef()]}var zf=(e={})=>(e.important=e.important??!1,{...no(e),name:"@unocss/preset-wind3",theme:Wl,rules:pl,shortcuts:dl,variants:jf(e),postprocess:Ja(e)});var Ld=(e={})=>({...zf(e),name:"@unocss/preset-uno"}),Af=Ld;function Wd(e){return e.replace(/-(\w)/g,(t,r)=>r?r.toUpperCase():"")}function Pf(e){return e.charAt(0).toUpperCase()+e.slice(1)}function Of(e){return e.replace(/(?:^|\B)([A-Z])/g,"-$1").toLowerCase()}var Vf=["Webkit","Moz","ms"];function Mf(e){let t={};function r(n){let o=t[n];if(o)return o;let i=Wd(n);if(i!=="filter"&&i in e)return t[n]=Of(i);i=Pf(i);for(let s=0;s<Vf.length;s++){let a=`${Vf[s]}${i}`;if(a in e)return t[n]=Of(Pf(a))}return n}return({entries:n})=>n.forEach(o=>{o[0].startsWith("--")||(o[0]=r(o[0]))})}function Ff(e){return e.replace(/&amp;/g,"&").replace(/&gt;/g,">").replace(/&lt;/g,"<")}async function Po(e={}){if(typeof window>"u"){console.warn("@unocss/runtime been used in non-browser environment, skipped.");return}let t=window,r=window.document,n=()=>r.documentElement,o=t.__unocss||{},i=Object.assign({},e,o.runtime),s=i.defaults||{},a=i.cloakAttribute??"un-cloak";i.autoPrefix&&(s.postprocess=S(s.postprocess)).unshift(Mf(r.createElement("div").style)),i.configResolved?.(o,s);let c=await Xo(o,s),l=E=>i.inject?i.inject(E):n().prepend(E),u=()=>i.rootElement?i.rootElement():r.body,d=new Map,h=!0,m=new Set,g,x,k=[],C=()=>new Promise(E=>{k.push(E),x!=null&&clearTimeout(x),x=setTimeout(()=>z().then(()=>{let V=k;k=[],V.forEach(B=>B())}),0)});function v(E,V=!1){if(E.nodeType!==1)return;let B=E;B.hasAttribute(a)&&B.removeAttribute(a),V&&B.querySelectorAll(`[${a}]`).forEach(D=>{D.removeAttribute(a)})}function b(E,V){let B=d.get(E);if(!B)if(B=r.createElement("style"),B.setAttribute("data-unocss-runtime-layer",E),d.set(E,B),V==null)l(B);else{let D=b(V),Q=D.parentNode;Q?Q.insertBefore(B,D.nextSibling):l(B)}return B}async function z(){let E=[...m],V=await c.generate(E);return V.layers.reduce((D,Q)=>(b(Q,D).innerHTML=V.getLayer(Q)??"",Q),void 0),E.filter(D=>!V.matched.has(D)).forEach(D=>m.delete(D)),{...V,getStyleElement:D=>d.get(D),getStyleElements:()=>d}}async function y(E){let V=m.size;await c.applyExtractors(E,void 0,m),V!==m.size&&await C()}async function P(E=u()){let V=E&&E.outerHTML;V&&(await y(`${V} ${Ff(V)}`),v(n()),v(E,!0))}let w=new MutationObserver(E=>{h||E.forEach(async V=>{if(V.target.nodeType!==1)return;let B=V.target;for(let D of d)if(B===D[1])return;if(V.type==="childList")V.addedNodes.forEach(async D=>{if(D.nodeType!==1)return;let Q=D;g&&!g(Q)||(await y(Q.outerHTML),v(Q))});else{if(g&&!g(B))return;if(V.attributeName!==a){let D=Array.from(B.attributes).map(I=>I.value?`${I.name}="${I.value}"`:I.name).join(" "),Q=`<${B.tagName.toLowerCase()} ${D}>`;await y(Q)}v(B)}})}),R=!1;function O(){if(R)return;let E=i.observer?.target?i.observer.target():u();E&&(w.observe(E,{childList:!0,subtree:!0,attributes:!0,attributeFilter:i.observer?.attributeFilter}),R=!0)}function ee(){i.bypassDefined&&Ud(c.blocked),P(),O()}function te(){r.readyState==="loading"?t.addEventListener("DOMContentLoaded",ee):ee()}let le=t.__unocss_runtime=t.__unocss_runtime={version:c.version,uno:c,async extract(E){F(E)||(E.forEach(V=>m.add(V)),E=""),await y(E)},extractAll:P,inspect(E){g=E},toggleObserver(E){E===void 0?h=!h:h=!!E,!R&&!h&&te()},update:z,presets:t.__unocss_runtime?.presets??{}};i.ready?.(le)!==!1&&(h=!1,te())}function Ud(e=new Set){for(let t=0;t<document.styleSheets.length;t++){let r=document.styleSheets[t],n;try{if(n=r.cssRules||r.rules,!n)continue;Array.from(n).flatMap(o=>o.selectorText?.split(/,/g)||[]).forEach(o=>{o&&(o=o.trim(),o.startsWith(".")&&(o=o.slice(1)),e.add(o))})}catch{continue}}return e}Po({defaults:{presets:[Af()]}});})();


})();
await (async () => {
const { T } = $APP;
const _data = T.object({
	properties: {
		model: T.string().$,
		id: T.string().$,
		method: T.string().$,
		filter: T.object().$,
		includes: T.string().$,
		order: T.string().$,
		limit: T.number().$,
		offset: T.number().$,
		count: T.number().$,
		rows: T.array().$,
		row: T.object().$,
	},
}).$;

const _actions = T.object({}).$;
const _map = T.object({}).$;
const _rows = T.array({}).$;
const _row = T.object({}).$;

function addClassTags(instance, proto) {
	if (proto?.constructor) {
		addClassTags(instance, Object.getPrototypeOf(proto));
		if (proto.constructor.tag) {
			instance.classList.add(proto.constructor.tag);
		}
	}
}

class View extends HTMLElement {
	static get observedAttributes() {
		return Object.keys(this.properties).filter(
			(key) => this.properties[key].attribute !== false,
		);
	}

	static properties = { _data, _actions, _map, _rows, _row };
	static _attrs = {};
	static plugins = [];
	state = {};
	_hasUpdated = false;
	_ignoreAttributeChange = false;
	_changedProps = {};
	constructor() {
		super();
		$APP.events.install(this);
		this.on("attributeChangedCallback", $APP.theme.attributeChangedCallback);
	}
	connectedCallback() {
		if (this.constructor.properties) this.initProps();
		addClassTags(this, Object.getPrototypeOf(this));
		for (const plugin of this.constructor.plugins) {
			const { event, fn, test } = plugin;
			if (
				fn &&
				(!test || test({ instance: this, component: this.constructor }))
			)
				this.on(event, fn.bind(this));
		}
		this.emit("connectedCallback", {
			instance: this,
			component: this.constructor,
		});
		this.requestUpdate();
	}

	disconnectedCallback() {
		this.emit("disconnectedCallback", {
			instance: this,
			component: this.constructor,
		});
	}

	q(element) {
		return this.querySelector(element);
	}

	qa(element) {
		return this.querySelectorAll(element);
	}

	prop(prop) {
		return {
			value: this[prop],
			setValue: ((newValue) => (this[prop] = newValue)).bind(this),
		};
	}

	initProps() {
		for (const attr of this.attributes) {
			const key = this.constructor._attrs[attr.name];
			const prop = this.constructor.properties[key];
			if (prop && prop.type !== "boolean" && attr.value === "") {
				this.removeAttribute(attr.name);
				continue;
			}
			this.state[key] = prop
				? $APP.types.stringToType(attr.value, {
						...prop,
						attribute: true,
					})
				: attr.value;
		}

		for (const [key, prop] of Object.entries(this.constructor.properties)) {
			const {
				type,
				sync,
				defaultValue,
				attribute = true,
				setter,
				getter,
			} = prop;
			if (sync) continue;
			this.state[key] ??= this[key] ?? defaultValue;

			if (!Object.getOwnPropertyDescriptor(this, key)) {
				Object.defineProperty(this, key, {
					get: getter ? getter.bind(this) : () => this.state[key],
					set: setter
						? setter.bind(this)
						: (value) => {
								const oldValue = this.state[key];
								if (oldValue === value) return;
								this.state[key] = value;
								this.updateAttribute({
									key,
									value,
									skipPropUpdate: true,
									type,
								});
								this.requestUpdate(key, oldValue, value);
							},
				});
			}
			const value = this.state[key];
			if (!attribute || this.hasAttribute(key) || value === undefined) continue;

			this.updateAttribute({
				key,
				value,
				skipPropUpdate: true,
				type,
			});

			this._changedProps[key] = undefined;
		}
	}

	requestUpdate(key, oldValue, value) {
		if (key) this._changedProps[key] = oldValue;
		if (this.updateComplete) clearTimeout(this.updateComplete);
		const changedProps = { ...this._changedProps };
		this.updateComplete = setTimeout(() => {
			this.performUpdate(changedProps, key === undefined);
		}, 0);
		return this.updateComplete;
	}

	performUpdate(changedProps, forceUpdate) {
		this.updateComplete = null;
		if (!forceUpdate && !this.shouldUpdate(changedProps)) return;
		this.emit("willUpdate", changedProps);
		this.update(changedProps);
		if (!this._hasUpdated) {
			this._hasUpdated = true;
			this.emit("firstUpdated", changedProps);
		}
		this.emit("updated", changedProps);
		this._changedProps = {};
	}

	shouldUpdate(changedProps) {
		for (const [key, oldValue] of Object.entries(changedProps)) {
			const newValue = this[key];
			const prop = this.constructor.properties[key];
			const hasChanged = prop?.hasChanged
				? prop.hasChanged(newValue, oldValue)
				: oldValue !== newValue;
			if (key === "darkmode") console.log({ hasChanged }, prop.hasChanged);
			if (!hasChanged) delete changedProps[key];
		}
		this.changedProps = {};
		return Object.keys(changedProps).length > 0 || !this._hasUpdated;
	}

	update() {
		$APP.html.render(this.render(), this);
	}

	render() {
		return $APP.html``;
	}

	attributeChangedCallback(key, oldValue, value) {
		if (oldValue === value) return;
		this.emit("attributeChangedCallback", {
			instance: this,
			component: this.constructor,
			key,
			value,
			oldValue,
		});

		if (this._ignoreAttributeChange) return;
		this.state[key] = $APP.types.stringToType(
			value,
			this.constructor.properties[key],
		);
		if (this._hasUpdated) this.requestUpdate(key, oldValue);
	}

	updateAttribute({ key, value, type, skipPropUpdate = false }) {
		if (!type) return;
		this._ignoreAttributeChange = skipPropUpdate;
		if (type === "function" && typeof value === "function") {
			this.setAttribute(key, value.toString());
		} else if (type === "boolean") {
			if (value) this.setAttribute(key, "");
			else this.removeAttribute(key);
		} else {
			if (value === undefined) this.removeAttribute(key);
			else {
				if (["array", "object"].includes(type))
					this.setAttribute(key, JSON.stringify(value));
				else this.setAttribute(key, value);
			}
		}

		if (skipPropUpdate) this._ignoreAttributeChange = false;
		else this[key] = value;
	}
}

window.$ = (element) => document.querySelector(element);
window.$$ = (element) => document.querySelectorAll(element);

$APP.setLibrary({
	name: "view",
	path: "mvc/view",
	alias: "View",
	base: View,
});

})();
await (async () => {
const instanceProxyHandler = {
	get(target, prop, receiver) {
		if (prop === "remove") {
			return () =>
				$APP.Model.request("REMOVE", target._modelName, { id: target.id });
		}

		if (prop === "update") {
			return () => {
				const cleanRow = { ...target };
				delete cleanRow._modelName;
				return $APP.Model.request("EDIT", target._modelName, {
					row: cleanRow,
				});
			};
		}

		if (prop === "include") {
			return async (include) => {
				if (!target.id || !target._modelName) {
					console.error(
						"Cannot run .include() on an object without an ID or model name.",
					);
					return receiver; // Return the proxy itself for chaining.
				}

				const { models } = $APP;
				if (!(target._modelName in models))
					throw new Error(
						`Model ${target._modelName} does not exist in models`,
					);

				const model = models[target._modelName];
				const prop = model[include];
				if (!prop)
					throw new Error(
						`Relationship '${include}' not found in ${target._modelName} model`,
					);
				const freshData = await $APP.Model.request(
					"GET_MANY",
					prop.targetModel,
					{
						opts: {
							filter: prop.belongs
								? target[include]
								: { [prop.targetForeignKey]: target.id },
						},
					},
				);
				target[include] = proxifyMultipleRows(freshData, prop.targetModel);

				return receiver;
			};
		}
		return target[prop];
	},

	set(target, prop, value) {
		target[prop] = value;
		return true;
	},
};

const handleModelRequest = async ({ modelName, action, payload }) => {
	const result = await $APP.Model.request(action, modelName, payload);
	if (action === "ADD_MANY" && result && Array.isArray(result.results)) {
		result.results.forEach((res) => {
			if (res.status === "fulfilled" && res.value) {
				res.value = proxifyRow(res.value, modelName);
			}
		});
		return result;
	}

	if (action.includes("MANY")) {
		if (payload.opts.object) return result;
		if (result?.items) {
			result.items = proxifyMultipleRows(result.items, modelName);
			return result;
		}
		return proxifyMultipleRows(result, modelName);
	}

	return proxifyRow(result, modelName);
};

const getMethodRegistry = (modelName) => [
	{
		type: "static",
		name: "get",
		handler: (id, opts = {}) =>
			handleModelRequest({
				modelName,
				action: "GET",
				payload: id ? { id, opts } : { opts },
			}),
	},
	{
		type: "static",
		name: "getAll",
		handler: (opts = {}) =>
			handleModelRequest({
				modelName,
				action: "GET_MANY",
				payload: { opts },
			}),
	},
	{
		type: "static",
		name: "add",
		handler: (row, opts) =>
			handleModelRequest({
				modelName,
				action: "ADD",
				payload: { row, opts },
			}),
	},
	{
		type: "static",
		name: "addMany",
		handler: (rows, opts) =>
			handleModelRequest({
				modelName,
				action: "ADD_MANY",
				payload: { rows, opts },
			}),
	},
	{
		type: "static",
		name: "remove",
		handler: (id) => $APP.Model.request("REMOVE", modelName, { id }),
	},
	{
		type: "static",
		name: "removeAll",
		handler: (filter) =>
			$APP.Model.request("REMOVE_MANY", modelName, { opts: { filter } }),
	},
	{
		type: "static",
		name: "edit",
		handler: (row) =>
			handleModelRequest({
				modelName,
				action: "EDIT",
				payload: { row },
			}),
	},
	{
		type: "static",
		name: "editAll",
		handler: (filter, updates) =>
			$APP.Model.request("EDIT_MANY", modelName, { opts: { filter, updates } }),
	},

	{ type: "dynamic", prefix: "getBy", action: "GET" },
	{ type: "dynamic", prefix: "getAllBy", action: "GET_MANY" },
	{ type: "dynamic", prefix: "editAllBy", action: "EDIT_MANY" },
	{ type: "dynamic", prefix: "editBy", action: "EDIT" },
	{ type: "dynamic", prefix: "removeBy", action: "REMOVE" },
	{ type: "dynamic", prefix: "removeAllBy", action: "REMOVE_MANY" },
];

const proxifyRow = (row, modelName) => {
	if (!row || typeof row !== "object" || row.errors) return row;
	$APP.Model[modelName].rows[row.id] = row;
	$APP.Model[modelName].on(`get:${row.id}`, (data) => {
		if (data === undefined) {
			delete $APP.Model[modelName].rows[row.id];
			return;
		}
		const { id, ...newRow } = data;
		Object.assign($APP.Model[modelName].rows[row.id], newRow);
	});
	row._modelName = modelName;
	return new Proxy($APP.Model[modelName].rows[row.id], instanceProxyHandler);
};

const proxifyMultipleRows = (rows, modelName) => {
	if (!Array.isArray(rows)) return rows;
	return rows.map((row) => proxifyRow(row, modelName));
};

const uncapitalize = (str) => {
	if (typeof str !== "string" || !str) return str;
	return str.charAt(0).toLowerCase() + str.slice(1);
};

const modelApiCache = new Map();
const Model = new Proxy(
	{},
	{
		get(target, prop, receiver) {
			if (prop in target) return Reflect.get(target, prop, receiver);
			if (modelApiCache.has(prop)) return modelApiCache.get(prop);

			const modelName = prop;
			const { models } = $APP;
			if (!(prop in models)) {
				throw new Error(`Model ${modelName} does not exist in models`);
			}
			const modelSchema = models[modelName];
			const methodRegistry = getMethodRegistry(modelName, modelSchema);
			const modelApi = new Proxy(
				{},
				{
					get(target, methodName, modelReceiver) {
						if (methodName in target)
							return Reflect.get(target, methodName, modelReceiver);
						for (const definition of methodRegistry) {
							if (
								definition.type === "static" &&
								definition.name === methodName
							)
								return definition.handler;

							if (
								definition.type === "dynamic" &&
								methodName.startsWith(definition.prefix)
							) {
								const property = methodName.slice(definition.prefix.length);
								if (!property) continue;

								const propertyKey = uncapitalize(property);

								if (!(propertyKey in modelSchema))
									throw new Error(
										`Property '${propertyKey}' not found in model '${modelName}'`,
									);

								return (value, row = null) => {
									const payload = {
										opts: { filter: { [propertyKey]: value } },
									};
									if (row) payload.opts.row = row;

									return handleModelRequest({
										modelName,
										action: definition.action,
										payload,
									});
								};
							}
						}
						throw new Error(
							`Method '${methodName}' not found in model '${modelName}'`,
						);
					},
				},
			);

			$APP.events.install(modelApi);

			modelApi.rows = $APP.storage.install({});
			modelApiCache.set(prop, modelApi);
			return modelApi;
		},
	},
);
Model.proxifyRow = proxifyRow;
Model.proxifyMultipleRows = proxifyMultipleRows;
$APP.addModule({
	name: "model",
	alias: "Model",
	path: "mvc/model",
	backend: true,
	frontend: true,
	base: Model,
	modules: [
		"types",
		"mvc/model/database",
		"mvc/model/metadata",
		"mvc/model/operations",
	],
});

$APP.addModule({
	name: "data",
});

})();
await (async () => {
var { T } = $APP;

$APP.addModule({
	name: "database",
	path: "mvc/model/database",
	alias: "Database",
	backend: true,
	modules: ["mvc/model/indexeddb"],
});

$APP.addModule({
	name: "sysmodel",
	alias: "SysModel",
});

const addModels = ({ context, collection = "models" }) => {
	return ({ module }) => {
		if (!module[collection]) return;
		const models = Object.fromEntries(
			Object.keys(module[collection]).map((model) => {
				const props = {
					id: T.string({ primary: true }),
					...module[collection][model],
				};
				return [
					model,
					Object.fromEntries(
						Object.entries(props).map(([key, _prop]) => {
							const prop = _prop?.$ || _prop;
							prop.name = key;
							if (prop.relationship && !prop.targetForeignKey)
								prop.targetForeignKey = model;
							return [key, prop];
						}),
					),
				];
			}),
		);
		context.set(models);
	};
};

$APP.addModule({
	name: "models",
	hooks: ({ context }) => ({
		moduleAdded: addModels({ context, collection: "models" }),
		moduleUpdated: addModels({ context, collection: "models" }),
	}),
});

$APP.addModule({
	name: "sysmodels",
	hooks: ({ context }) => ({
		moduleAdded: addModels({ context, collection: "sysmodels" }),
	}),
	settings: { APP: "App", USER: "User", DEVICE: "Device" },
});

$APP.sysmodels.set({
	[$APP.settings.sysmodels.APP]: {
		name: T.string({ index: true, primary: true }).$,
		version: T.number().$,
		users: T.many($APP.settings.sysmodels.USER, "appId").$,
		active: T.boolean({ defaultValue: true, index: true }).$,
		models: T.object().$,
		migrationTimestamp: T.number().$,
	},
	[$APP.settings.sysmodels.USER]: {
		name: T.string({ index: true, primary: true }).$,
		appId: T.one($APP.settings.sysmodels.APP, "users").$,
		devices: T.many($APP.settings.sysmodels.DEVICE, "userId").$,
		publicKey: T.string().$,
		privateKey: T.string().$,
		active: T.boolean({ index: true }).$,
	},
	[$APP.settings.sysmodels.DEVICE]: {
		name: T.string({ index: true, primary: true }).$,
		userId: T.one($APP.settings.sysmodels.USER, "devices").$,
		deviceData: T.string().$,
		active: T.number({ defaultValue: true, index: true }).$,
	},
});

})();
await (async () => {
$APP.addModule({
	name: "indexeddb",
	path: "mvc/model/indexeddb",
	alias: "indexeddb",
	backend: true,
});

})();
await (async () => {
$APP.addModule({
	name: "databaseMetadata",
	path: "mvc/model/metadata",
	backend: true,
});

})();
await (async () => {
$APP.addModule({
	name: "databaseOperations",
	path: "mvc/model/operations",
	backend: true,
});

})();
await (async () => {
const request = (action, modelName, params = {}) => {
	return $APP.Controller.backend(action, {
		model: modelName,
		...params,
	});
};

$APP.addFunctions({
	functions: { request },
	name: "model",
});

})();
await (async () => {
$APP.addModule({
	name: "controller",
	path: "mvc/controller",
	frontend: true,
	alias: "Controller",
	modules: [
		"mvc/controller/backend",
		"mvc/controller/adapter-storage",
		"mvc/controller/adapter-url",
	],
	settings: { syncKeySeparator: "_-_" },
});

})();
await (async () => {
const sanitize = (obj) => {
	if (obj === null || typeof obj !== "object") return obj;
	if (Array.isArray(obj)) return obj.map((item) => sanitize(item));
	const newObj = {};
	for (const key in obj) {
		if (Object.hasOwn(obj, key)) {
			const value = obj[key];
			if (typeof value !== "function") newObj[key] = sanitize(value);
		}
	}
	return newObj;
};

$APP.addModule({
	name: "backend",
	alias: "Backend",
	path: "mvc/controller/backend",
	base: { sanitize },
	frontend: true,
	backend: true,
});

})();
await (async () => {
let SW;
const pendingRequests = {};
const handleSWMessage = async (message = {}) => {
	const { data, source } = message;
	const { eventId, type, payload, connection } = data;
	const handler = $APP.events[type];
	let response = payload;
	const respond =
		eventId &&
		((responsePayload) =>
			source.postMessage({
				eventId,
				payload: responsePayload,
				connection,
			}));

	if (handler) response = await handler({ respond, payload, eventId });
	if (eventId && pendingRequests[eventId]) {
		try {
			pendingRequests[data.eventId].resolve(response);
		} catch (error) {
			pendingRequests[data.eventId].reject(new Error(error));
		} finally {
			delete pendingRequests[eventId];
		}
		return;
	}
	if (respond) return respond(response);
};

let count = 0;
const postMessage = async (params) => {
	if (SW?.active) return SW.active.postMessage(params);
	if (count++ > 3) return;
	await initServiceWorker();
	postMessage(params);
};

const initServiceWorker = async () => {
	if (!("serviceWorker" in navigator)) return;
	if (self.chrome?.runtime?.id) {
		SW = await navigator.serviceWorker.ready;
		return;
	}
	const swFile = $APP.settings.ENV === "PREVIEW" ? "sw.preview" : "sw";
	SW = await navigator.serviceWorker.register(
		`/modules/mvc/controller/backend/${swFile}.js?project=${encodeURIComponent(JSON.stringify($APP.settings))}`,
	);
	navigator.serviceWorker.addEventListener("message", handleSWMessage);
	const granted = await navigator.storage.persist();
	if (!granted) {
		console.log("Persistent storage not granted");
	}
};

const backend = async (type, payload = {}, connection = null) => {
	const eventId =
		Date.now().toString() + Math.random().toString(36).substr(2, 9);
	const params = { type, payload, eventId };
	return new Promise((resolve, reject) => {
		if (connection) params.connection = connection;
		pendingRequests[eventId] = { resolve, reject };
		$APP.Backend.postMessage(params);
	});
};

$APP.addFunctions({
	name: "backend",
	functions: { handleSWMessage, postMessage },
});
$APP.hooks.add("init", initServiceWorker);

const requestDataSync = ({ instance }) => {
	const {
		id,
		model,
		limit,
		offset = 0,
		includes,
		recursive,
		order,
		filter,
		count,
	} = instance._data;
	const method = (instance._data.method ?? id) ? "get" : "getMany";
	const opts = { limit, offset, order, recursive };
	if (filter && Object.keys(filter).length > 0)
		opts.filter = DisplayHandler.resolveObject(filter, instance);
	if (includes)
		opts.includes = Array.isArray(includes) ? includes : includes.split(",");
	if (method.toLowerCase() === "get")
		$APP.Model[model].get(id, opts).then((results) => {
			instance._row = results;
			instance.requestUpdate();
			instance.emit("dataLoaded", {
				instance,
				component: instance.constructor,
			});
		});
	else {
		$APP.Model[model].getAll(opts).then((results) => {
			instance._rows = results.items ?? results;
			if (results.count) instance._data.count = results.count;
			instance.requestUpdate();

			instance.emit("dataLoaded", {
				instance,
				component: instance.constructor,
			});
		});
	}
};

const argsFn = ({ value, ...context }) => {
	const [, ...args] = value.split(":");
	return args.map((arg) =>
		DisplayHandler.resolveValue({ ...context, value: arg }),
	);
};

const componentsFunctions = {
	$find: (context) => {
		const args = argsFn(context);
		const { instance } = context;
		const sourceArray = args[0];
		const condition = args[1];
		if (!Array.isArray(sourceArray) || !condition) return undefined;
		let [key, value] = condition.split("=");
		value = DisplayHandler.resolveValue({ prop: key, instance, value });
		if (!key || value === undefined) return undefined;
		return sourceArray.find((item) => String(item[key]) === String(value));
	},
	$boolean: (context) => {
		const args = argsFn(context);
		const { instance, prop } = context;
		const source = args[0];
		const value = DisplayHandler.resolveValue({
			prop,
			instance,
			value: source,
		});
		return Boolean(value);
	},
	$filter: (context) => {
		const args = argsFn(context);
		const sourceArray = args[0];
		const condition = args[1];

		if (!Array.isArray(sourceArray) || !condition) return [];

		const [key, value] = condition.split("=");
		if (!key || value === undefined) return [];

		return sourceArray.filter((item) => String(item[key]) === String(value));
	},
	$includes: (context) => {
		const args = argsFn(context);
		const sourceArray = args[0];
		const condition = args[1];
		if (!Array.isArray(sourceArray) || !condition) return false;
		const [key, value] = condition.split("=");
		if (!key || value === undefined) return false;

		return sourceArray.some((item) => String(item[key]) === String(value));
	},
	$map: (context) => {
		const mapFn = (context) => {
			const args = argsFn(context);
			const sourceArray = args[0];
			const key = args[1];
			if (!Array.isArray(sourceArray) || !key) return [];
			return sourceArray.map((row) => row[key]);
		};
		const willUpdate =
			({ instance, prop }) =>
			() => {
				instance[prop] = mapFn(context);
				instance.requestUpdate();
			};
		return mapFn({ ...context, willUpdate });
	},
	$count: ({ instance }) => {
		return instance?._rows?.count ?? instance?._rows?.length;
	},
	$now: () => Date.now(),

	$data: (context) => {
		const { value, prop, instance } = context;
		const [, event] = value.split(":");
		if (!componentsEvents.data[event]) return;
		const eventFn = componentsEvents.data[event];
		const _data = instance._data || instance.closest("[_data]")?._data || {};
		if (prop.startsWith("on")) instance[prop] = eventFn({ ..._data, instance });
		return eventFn({ ..._data, instance });
	},
	$closest: (context) => {
		const { value, instance } = context;
		const [element, fn] = value.slice(9).split(".");
		const node = instance.closest(element);
		return node[fn].bind(node);
	},
	$query: (context) => {
		const { value } = context;
		if (value.startsWith("@parent"))
			return componentsFunctions.$parent(context);
		if (value.startsWith("@")) return componentsFunctions.$row(context);
	},
	$row: ({ value, instance }) => {
		const parent = instance.closest("[_row]");
		const row = instance._row ?? parent?._row ?? {};
		return value === "@" ? row : row[value.slice(1)];
	},
	$parent: ({ value, instance, prop, row: _row, willUpdate }) => {
		const [, key] = value.split(".");
		const parent = instance.parentElement.closest("[_row]");
		if (!parent && !instance._parentListener) return;
		if (!instance._parentListener) {
			instance._parentListener = parent;
			if (willUpdate) parent.on("willUpdate", willUpdate({ prop, instance }));
		}
		const row = instance._parentListener._row || {};
		if (!row) return;
		return key ? row[key] : row;
	},
	$today: () => {
		const d = new Date();
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	},
	$todayLocale: () => {
		return new Intl.DateTimeFormat(undefined, {
			dateStyle: "short",
		}).format(new Date());
	},
	$currentTime: () => {
		return new Intl.DateTimeFormat(undefined, {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}).format(new Date());
	},
	$currentDay: () => new Date().getDate(),
	$currentMonth: () => new Date().getMonth() + 1,
	$currentYear: () => new Date().getFullYear(),
	$currentHour: () => new Date().getHours(),
	$timeAgo: ({ value }) => {
		if (!value) return "";
		const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
		const date = new Date(value);
		const seconds = Math.round((date.getTime() - Date.now()) / 1000);
		const time = {
			year: 31536000,
			month: 2592000,
			week: 604800,
			day: 86400,
			hour: 3600,
			minute: 60,
		};
		for (const unit in time) {
			const interval = seconds / time[unit];
			if (Math.abs(interval) > 1) {
				return rtf.format(Math.round(interval), unit);
			}
		}
		return rtf.format(seconds, "second");
	},
};

const DisplayHandler = {
	operators: {
		$eq: (subject, param) => subject === param,
		$neq: (subject, param) => subject !== param,
		$exists: (subject) => subject != null,
		$nexists: (subject) => subject == null,
		$gt: (subject, param) => Number(subject) > Number(param),
		$inc: (subject, params) => {
			if (!Array.isArray(subject)) return false;
			const [paramKey, paramValue] = Object.entries(params)[0];
			return subject.some((item) => item && item[paramKey] === paramValue);
		},
		$ninc: (subject, params) => {
			if (!Array.isArray(subject)) return true;
			const [paramKey, paramValue] = Object.entries(params)[0];
			return !subject.some((item) => item && item[paramKey] === paramValue);
		},
	},
	resolveObject(object, instance) {
		return Object.fromEntries(
			Object.entries(object).map(([prop, value]) => [
				prop,
				DisplayHandler.resolveValue({ prop, value, instance }),
			]),
		);
	},

	resolveValue(context) {
		const { value } = context;
		if (typeof value === "object" && value.tag)
			return value.function
				? (args = {}) =>
						$APP.blocks.render({
							block: {
								...value,
								properties: { ...(value.properties || {}), ...args },
							},
						})
				: $APP.blocks.render({
						block: value,
					});

		if (typeof value !== "string") return value;

		if (value.startsWith("@")) return componentsFunctions.$query(context);
		if (value.startsWith("$")) {
			const [fn] = value.split(":");
			return componentsFunctions[fn]?.(context);
		}
		return value;
	},

	resolveParams(params, context) {
		if (typeof params !== "object" || params === null) {
			return this.resolveValue({ ...context, value: params });
		}
		const resolved = {};
		for (const key in params) {
			resolved[key] = this.resolveValue({
				...context,
				value: params[key],
			});
		}
		return resolved;
	},

	evaluate(rules, context) {
		for (const subjectStr in rules) {
			const condition = rules[subjectStr];
			const subject = this.resolveValue({
				...context,
				value: subjectStr,
			});
			for (const operator in condition) {
				if (!this.operators[operator]) {
					console.warn(`DisplayHandler: Unknown operator ${operator}`);
					continue;
				}

				// --- THE FIX ---
				// Get the raw parameters from the rule.
				const rawParams = condition[operator];
				// Resolve them *before* passing them to the operator.
				const resolvedParams = this.resolveParams(rawParams, context);

				const result = this.operators[operator](subject, resolvedParams);

				if (!result) return false;
			}
		}
		return true;
	},
};

const componentsEvents = {
	data: {
		_prepareRow(model, instance) {
			const modelProps = $APP.models[model];
			if (!modelProps) return console.error(`Model '${model}' does not exist.`);
			if (!instance._row) instance._row = {};
			[...instance.qa(".uix-input")].forEach(
				(input) => (instance._row[input.name] = input.inputValue()),
			);
			const row = { ...instance._row };
			Object.keys(instance._row).forEach((prop) => {
				if (prop !== "id" && modelProps[prop] === undefined) delete row[prop];
			});
			return row;
		},
		render() {
			const { model, tag, blocks, properties = {} } = this._data;
			const { _rows: rows, _row } = this;
			if (!rows && !_row) return;
			return (rows ?? [_row]).map((row) =>
				$APP.blocks.render({
					row,
					block: {
						tag,
						blocks,
						properties: {
							_data: { model, id: row.id },
							_row: row,
							...properties,
						},
					},
				}),
			);
		},
		remove: ({ model, id, instance }) => {
			return () => {
				if (id) return $APP.Model[model].remove(id);
				const row = componentsEvents.data._prepareRow(model, instance);
				$APP.Model[model].removeAll(row);
			};
		},
		add: ({ model, instance }) => {
			return async () => {
				const rowData = componentsEvents.data._prepareRow(model, instance);
				if (!rowData) return;
				const res = await $APP.Model[model].add(rowData);
				if (res?.id) instance._row.id = res.id;
			};
		},
		edit: ({ model, instance }) => {
			return async () => {
				const rowData = componentsEvents.data._prepareRow(model, instance);
				if (rowData?.id) await $APP.Model[model].edit(rowData);
			};
		},
		upsert: ({ model, instance }) => {
			return async () => {
				const rowData = componentsEvents.data._prepareRow(model, instance);
				if (!rowData) return;
				if (rowData.id) await $APP.Model[model].edit(rowData);
				else {
					const res = await $APP.Model[model].add(rowData);
					if (res?.id) instance._row.id = res.id;
				}
			};
		},
	},
};

$APP.View.plugins.push({
	event: "connectedCallback",
	test: ({ instance }) => !!instance._data?.displayIf,
	fn: ({ instance }) => {
		const { displayIf } = instance._data;
		const evaluate = () => {
			if (!DisplayHandler.evaluate(displayIf, context))
				instance.classList.add("hide");
			else instance.classList.remove("hide");
		};

		const context = {
			instance,
			row: instance._row,
			listener: evaluate,
		};

		evaluate();
		instance.on("dataLoaded", evaluate);
	},
});

const instanceMapProperties = ({ instance }) => {
	Object.entries(instance._map).map(([propKey, value]) => {
		if (!propKey || !value) return;
		instance.state[propKey] = DisplayHandler.resolveValue({
			value,
			instance,
			prop: propKey,
		});
		const prop = instance.constructor.properties[propKey];
		if (prop?.attribute && propKey !== "_row") {
			instance.updateAttribute({
				key: propKey,
				value: instance.state[propKey],
				type: prop.type,
				skipPropUpdate: true,
			});
		}

		if (!instance.state._row) instance.state._row = {};
		instance.state._row[propKey] = instance.state[propKey];
	});
};

$APP.View.plugins.push({
	event: "connectedCallback",
	test: ({ instance }) =>
		instance?._data?.model &&
		!["add", "edit", "remove"].includes(instance?._data?.method),
	fn: ({ instance }) => {
		instance._listeners = {};
		if (instance._data.tag)
			instance.on("dataLoaded", () => {
				if (!instance._updatedRender) {
					instance.render = componentsEvents.data.render.bind(instance);
					instance._updatedRender = true;
				}
				instance.requestUpdate();
			});

		const row = instance._row;
		if (row && !instance._data.id) {
			instance._data.id = row.id;
			instance.emit("dataLoaded", {
				instance,
				component: instance.constructor,
			});
		}

		if ((row && !instance._data.id) || instance._rows) {
			instance.emit("dataLoaded", {
				instance,
				component: instance.constructor,
			});
		}

		const { model, id } = instance._data;
		const modelRows = $APP.Model[model]?.rows;
		if (!modelRows) return;
		if (id) {
			const listenerKey = `get:${id}`;
			if (row !== undefined && modelRows[id] === undefined) {
				modelRows[id] = row;
				instance._listeners[listenerKey] = ({ id, ...newRow }) => {
					Object.assign(modelRows[id], newRow);
					instance._row = modelRows[id];
					instance.requestUpdate();
				};
			} else
				instance._listeners[listenerKey] = () => {
					instance._row = modelRows[id];
					instance.requestUpdate();
				};
			$APP.Model[model].on(listenerKey, instance._listeners[listenerKey]);
		} else {
			instance._listeners.any = () => requestDataSync({ instance });
			$APP.Model[model].onAny(instance._listeners.any);
		}
		if (!instance._row && !instance._rows) requestDataSync({ instance });
		instance.syncable = true;
	},
});

$APP.View.plugins.push({
	event: "connectedCallback",
	test: ({ instance }) => !!instance._map,
	fn: ({ instance }) => {
		const container = instance.parentElement.closest("[_data]");
		if (!container) return;
		container.on("dataLoaded", ({ instance }) => {
			instanceMapProperties({
				instance,
			});
			instance.requestUpdate();
		});
	},
});

$APP.View.plugins.push({
	event: "willUpdate",
	test: ({ instance }) => !!instance._map,
	fn() {
		instanceMapProperties({
			instance: this,
		});
	},
});

$APP.View.plugins.push({
	event: "disconnectedCallback",
	test: ({ instance }) => instance.syncable,
	fn: ({ instance }) => {
		Object.keys(instance._listeners).forEach((key) => {
			if (key === "any")
				$APP.Model[instance._data.model].offAny(instance._listeners[key]);
			else $APP.Model[instance._data.model].off(key, instance._listeners[key]);
		});
	},
});

$APP.adapters.set({ backend });

$APP.events.set({
	UPDATE_MODELS: ({ payload: { models } }) => $APP.models.set(models),
	REQUEST_DATA_SYNC: ({ payload: { model, key, data } }) => {
		if (!model || !$APP.Model[model] || !key)
			return console.error(
				`Request Sync failed: model '${model}' or key '${key}' not found.`,
			);
		$APP.Model[model].emit(key, data);
	},
});

})();
await (async () => {
$APP.addModule({
	name: "adapter-storage",
	path: "mvc/controller/adapter-storage",
	frontend: true,
});

})();
await (async () => {
const serialize = (value) => {
	if ((typeof value === "object" && value !== null) || Array.isArray(value)) {
		return JSON.stringify(value);
	}
	return value;
};

const deserialize = (value) => {
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
};

const get = (storage) => (key) => {
	const value = storage.getItem(key);
	return value !== null ? deserialize(value) : null;
};

const set = (storage) => (key, value) => {
	storage.setItem(key, serialize(value));
	return { key };
};

const remove = (storage) => (key) => {
	storage.removeItem(key);
	return { key };
};
const keys = (storage) => () => {
	return Object.keys(storage);
};

const has = (storage) => (key) => {
	return storage.getItem(key) !== null && storage.getItem(key) !== undefined;
};

const createStorageAdapter = (storage) => {
	return {
		has: has(storage),
		set: set(storage),
		remove: remove(storage),
		get: get(storage),
		keys: get(storage),
	};
};

const ramStore = new Map();
const ram = {
	has: (key) => {
		return ramStore.has(key);
	},
	get: (key) => {
		return ramStore.get(key);
	},
	set: (key, value) => {
		ramStore.set(key, value);
		return { key };
	},
	remove: (key) => {
		ramStore.delete(key);
		return { key };
	},
	keys: () => ramStore.keys(),
};

const local = createStorageAdapter(window.localStorage);
const session = createStorageAdapter(window.sessionStorage);

$APP.adapters.set({ local, ram, session });

})();
await (async () => {
$APP.addModule({
	name: "adapter-url",
	path: "mvc/controller/adapter-url",
	frontend: true,
});

})();
await (async () => {
const getHashParams = () => {
	const hash = window.location.hash.substring(1);
	return new URLSearchParams(hash);
};

const setHashParams = (params) => {
	const newHash = params.toString();
	window.location.hash = newHash;
};

const hash = {
	get: (key) => {
		const params = getHashParams();
		return params.get(key);
	},
	has: (key) => {
		const params = getHashParams();
		return params.has(key);
	},
	set: (key, value) => {
		const params = getHashParams();
		params.set(key, value);
		setHashParams(params);
		window.dispatchEvent(new Event("popstate"));
		return { key };
	},
	remove: (key) => {
		const params = getHashParams();
		params.delete(key);
		setHashParams(params);
		return { key };
	},
	keys: () => {
		const params = getHashParams();
		return [...params.keys()];
	},
	entries: () => {
		const params = getHashParams();
		return [...params.entries()];
	},
};

const querystring = {
	get(key) {
		const params = new URLSearchParams(window.location.search);
		return params.get(key);
	},

	set(key, value) {
		const params = new URLSearchParams(window.location.search);
		params.set(key, value);
		window.history?.pushState?.(
			{},
			"",
			`${window.location.pathname}?${params}`,
		);
		window.dispatchEvent(new Event("popstate"));
		return { key };
	},

	remove(key) {
		const params = new URLSearchParams(window.location.search);
		params.delete(key);
		window.history.pushState?.({}, "", `${window.location.pathname}?${params}`);
		return { key };
	},
	keys() {
		const params = new URLSearchParams(window.location.search);
		return [...params.keys()];
	},
	has(key) {
		const params = new URLSearchParams(window.location.search);
		return params.has(key);
	},
	entries: () => {
		const params = new URLSearchParams(window.location.search);
		return [...params.entries()];
	},
};

$APP.adapters.set({ querystring, hash });

})();
await (async () => {
const parseKey = (key) => {
	if (typeof key === "string" && key.includes(".")) {
		const [storeKey, path] = key.split(".", 2);
		return { storeKey, path };
	}
	return { storeKey: key, path: null };
};

const createAdapter = (store, storeName) => {
	const adapter =
		typeof store === "function"
			? store
			: (key, value) =>
					value !== undefined ? adapter.set(key, value) : adapter.get(key);

	$APP.events.install(adapter);

	const notify = (key, value) => {
		Controller[storeName]?.emit(key, value);
	};

	adapter.get = (key) => {
		const { storeKey, path } = parseKey(key);
		const baseValue = store.get(storeKey);
		//console.log({ baseValue, key });
		if (path && typeof baseValue === "object" && baseValue !== null) {
			return baseValue[path];
		}
		return baseValue;
	};

	adapter.set = (key, value) => {
		const { storeKey, path } = parseKey(key);
		if (path) {
			const baseObject = store.get(storeKey) || {};
			const newValue = { ...baseObject, [path]: value };

			store.set(storeKey, newValue);
			notify(storeKey, newValue);
			return newValue;
		}
		store.set(storeKey, value);
		notify(storeKey, value);
		return value;
	};

	adapter.remove = (key) => {
		const { storeKey, path } = parseKey(key);
		if (path) {
			const baseObject = store.get(storeKey);
			if (typeof baseObject === "object" && baseObject !== null) {
				delete baseObject[path];
				store.set(storeKey, baseObject);
				notify(storeKey, baseObject);
			}
			return { key: storeKey };
		}
		store.remove(storeKey);
		notify(storeKey, undefined);
		return { key: storeKey };
	};

	adapter.has = store.has;
	adapter.keys = store.keys;
	adapter.entries = store.entries;

	adapterCache.set(storeName, adapter);
	return adapter;
};

const adapterCache = new Map();

const Controller = new Proxy(
	{},
	{
		get(target, prop) {
			if (prop in target) return target[prop];
			if (adapterCache.has(prop)) return adapterCache.get(prop);
			if (prop in $APP.adapters)
				return createAdapter($APP.adapters[prop], prop);
			if ($APP.mv3Connections?.includes(prop)) {
				return (type, payload = {}) => {
					const backendAdapter =
						adapterCache.get("backend") ||
						createAdapter($APP.adapters.backend, "backend");
					return backendAdapter(type, payload, prop);
				};
			}
			return undefined;
		},
	},
);

$APP.updateModule({
	name: "controller",
	path: "mvc/controller",
	alias: "Controller",
	base: Controller,
});

const init = () => {
	const syncUrlAdapter = (adapterName) => {
		const adapter = Controller[adapterName];
		const newEntries = new Map(adapter.entries());
		const oldKeys = new Set(adapter.listeners.keys());

		newEntries.forEach((value, key) => {
			adapter.emit(key, value);
			oldKeys.delete(key);
		});

		oldKeys.forEach((key) => adapter.emit(key, undefined));
	};

	window.addEventListener("popstate", () => {
		syncUrlAdapter("querystring");
		syncUrlAdapter("hash");
	});
};

$APP.hooks.add("init", init);

const getScopedKey = (baseKey, prop, instance) => {
	if (prop.scope) {
		if (prop.scope.includes(".")) {
			const [obj, objProp] = prop.scope.split(".");
			if (instance[obj]?.[objProp])
				return `${instance[obj]?.[objProp]}:${baseKey}`;
		}

		if (instance[prop.scope]) return `${instance[prop.scope]}:${baseKey}`;
	}
	return baseKey;
};

$APP.View.plugins.push({
	event: "connectedCallback",
	test: ({ component }) => !!component.properties,
	fn: ({ instance, component }) => {
		if (!component.properties) return;
		Object.entries(component.properties)
			.filter(([, prop]) => prop.sync)
			.forEach(([key, prop]) => {
				const adapter = Controller[prop.sync];
				if (!adapter) return;

				const scopedKey = getScopedKey(key, prop, instance);
				const initialValue = adapter.get(scopedKey);

				const eventFn = (value) => {
					instance.state[key] = value;
					instance.requestUpdate();
				};

				if (!instance._listeners) instance._listeners = {};
				if (!instance._listeners[prop.sync])
					instance._listeners[prop.sync] = {};
				instance._listeners[prop.sync][scopedKey] = eventFn;

				if (!Object.getOwnPropertyDescriptor(instance, key)) {
					Object.defineProperty(instance, key, {
						get: () => instance.state[key],
						set: (newValue) => {
							if (instance.state[key] === newValue) return;
							instance.state[key] = newValue;
							if (newValue !== adapter.get(scopedKey)) {
								adapter.set(scopedKey, newValue);
							}
						},
					});
				}

				adapter.on(scopedKey, eventFn);
				eventFn(initialValue ?? prop.defaultValue);
			});
	},
});

$APP.View.plugins.push({
	event: "disconnectedCallback",
	test: ({ component }) => !!component._listeners,
	fn: ({ instance }) => {
		if (!instance._listeners) return;
		Object.entries(instance._listeners).forEach(([adapterName, fns]) => {
			const adapter = Controller[adapterName];
			if (adapter) {
				Object.entries(fns).forEach(([key, fn]) => adapter.off(key, fn));
			}
		});
	},
});

})();
await (async () => {
$APP.addModule({ name: "app", modules: ["router"] });

})();
await (async () => {
$APP.addModule({
	name: "router",
	alias: "routes",
	frontend: true,
});

})();
await (async () => {
const { Controller, html } = $APP;
const { ram } = Controller;

class Router {
	static stack = [];
	static routes = {};

	static init(routes, defaultTitle) {
		if (!Object.keys(routes).length)
			return console.error("Error: no routes loaded");

		this.routes = routes;
		this.defaultTitle = defaultTitle;

		// Add popstate event listener for browser back/forward
		window.addEventListener("popstate", () => {
			const currentPath = window.location.pathname + window.location.search;
			this.handleHistoryNavigation(currentPath);
		});

		this.setCurrentRoute(
			window.location.pathname + window.location.search,
			true,
		);
	}

	static handleHistoryNavigation(path) {
		// Find the index of this path in our stack
		const stackIndex = this.stack.findIndex(
			(item) => this.normalizePath(item.path) === this.normalizePath(path),
		);

		if (stackIndex !== -1) {
			this.truncateStack(stackIndex);
			const matched = this.matchRoute(path);
			if (matched) this.updateCurrentRouteInRam(matched);
		} else this.setCurrentRoute(path, true);
	}

	static go(path) {
		this.setCurrentRoute(path, true);
	}

	static home() {
		this.stack = [];
		this.go("/");
	}

	static back() {
		if (this.stack.length <= 1) {
			this.home();
			return;
		}

		this.stack = this.stack.slice(0, -1);
		window.history.back();
	}

	static pushToStack(path, params = {}, title = this.defaultTitle) {
		if (path === "/") {
			this.stack = [];
		} else {
			this.stack.push({ path, params, title });
		}
	}

	static isRoot() {
		return this.stack.length === 0;
	}

	static truncateStack(index = 0) {
		if (index >= this.stack.length) return;
		this.stack = this.stack.slice(0, index + 1);
	}

	static normalizePath(path = "/") {
		const normalized = path.includes("url=")
			? path.split("url=")[1]
			: path.split("?")[0];
		return (normalized || "/").replace(/\/+$/, "");
	}

	static push(path, state = {}) {
		window.history.pushState(state, "", path);
		const popstateEvent = new PopStateEvent("popstate", { state });
		window.dispatchEvent(popstateEvent);
	}

	static setCurrentRoute(path, pushToStack = true) {
		if (!this.routes) return;
		const normalizedPath = this.normalizePath(path);
		const matched = this.matchRoute(normalizedPath);
		if (!matched) return this.go("/");

		this.updateCurrentRouteInRam(matched);
		if (!pushToStack) return;
		this.pushToStack(
			normalizedPath,
			matched.params,
			matched.route.title || this.defaultTitle,
		);
		this.push(path, { path: normalizedPath });
	}

	static matchRoute(url) {
		const path = url.split("?")[0];
		if (this.routes[path])
			return { route: this.routes[path], params: {}, path };

		for (const routePath in this.routes) {
			const paramNames = [];
			const regexPath = routePath.replace(/:([^/]+)/g, (_, paramName) => {
				paramNames.push(paramName);
				return "([^/]+)";
			});

			const regex = new RegExp(`^${regexPath.replace(/\/+$/, "")}$`);
			const match = path.match(regex);
			if (!match) continue;
			const params = {};
			paramNames.forEach((name, index) => {
				params[name] = match[index + 1];
			});
			return { route: this.routes[routePath], params, path };
		}
		return null;
	}

	static setTitle(newTitle) {
		document.title = newTitle;
		this.stack.at(-1).title = newTitle;
		this.currentRoute.route.title = newTitle;
		ram.set("currentRoute", { ...this.currentRoute });
	}

	static updateCurrentRouteInRam(route) {
		this.currentRoute = route;
		this.currentRoute.root = this.isRoot();
		ram.set("currentRoute", this.currentRoute);
	}
}

const init = () => {
	Router.init($APP.routes);
};

$APP.hooks.add("init", init);
$APP.setLibrary({ name: "router", alias: "Router", base: Router });
$APP.routes.set({ "/": { component: () => html`<app-index></app-index>` } });

})();
await (async () => {
const date = {
	formatKey(date) {
		if (!date) return null;
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	},
};
$APP.addModule({
	name: "date",
	alias: "Date",
	base: date,
});

})();
await (async () => {
$APP.addModule({
	name: "habits",
	path: "apps/habits",
	frontend: true,
	backend: true,
	modules: ["blocks", "trystero"],
});

})();
await (async () => {
const { unsafeStatic, staticHTML: html, literal } = $APP.html;

function parse(htmlString) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlString, "text/html");

	function parseValue(value) {
		if (value === "" || value.toLowerCase() === "true") return true;
		if (value.toLowerCase() === "false") return false;
		if (value.trim() !== "" && !Number.isNaN(Number(value))) {
			return Number(value);
		}
		return value;
	}

	function elementToBlock(element) {
		const properties = {};
		for (const attr of element.attributes) {
			properties[attr.name] = parseValue(attr.value);
		}

		const block = {
			tag: element.tagName.toLowerCase(),
			properties: properties,
			blocks: Array.from(element.children).map(elementToBlock),
		};

		return block;
	}
	return Array.from(doc.body.children).map(elementToBlock);
}

function render({ block, row, filter, keyed = true }) {
	if (!block || !block.tag) return "";
	const { tag, properties = {}, value, topBlock, bottomBlock } = block;
	let blocks = block.blocks || [];
	const tagName = tag;
	if (topBlock) blocks.unshift(topBlock);
	if (bottomBlock) blocks.push(bottomBlock);
	if (filter) blocks = blocks.filter(filter);

	const children = blocks?.length
		? blocks.map((child) => render({ block: child, filter, keyed: false }))
		: value?.tag
			? render({ block: value, filter, keyed: false })
			: (value ?? "");
	const template = html`<${unsafeStatic(tagName)}  ${$APP.html.spread(properties)}>${children}</${unsafeStatic(tagName)}>`;
	return row?.id && keyed === true
		? $APP.html.keyed(row.id, template)
		: template;
}

const blocks = { render, parse };

$APP.addModule({
	name: "bo",
	alias: "blocks",
	base: blocks,
	path: "blocks",
});

})();
await (async () => {
$APP.addModule({ name: "trystero", frontend: true });

})();
await (async () => {
const { floor: e, random: r } = Math,
	t = "Trystero",
	n = (e, r) => Array(e).fill().map(r),
	a = "0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",
	o = (t) => n(t, () => a[e(62 * r())]).join(""),
	s = o(20),
	i = Promise.all.bind(Promise),
	c = "undefined" != typeof window,
	{ entries: l, fromEntries: d, keys: f } = Object,
	u = () => {},
	p = (e) => Error(`${t}: ${e}`),
	y = new TextEncoder(),
	m = new TextDecoder(),
	w = (e) => y.encode(e),
	g = (e) => m.decode(e),
	h = (...e) => e.join("@"),
	b = JSON.stringify,
	k = JSON.parse,
	v = {},
	P = "AES-GCM",
	T = {},
	A = async (e) =>
		T[e] ||
		(T[e] = Array.from(
			new Uint8Array(await crypto.subtle.digest("SHA-1", w(e))),
		)
			.map((e) => e.toString(36))
			.join("")),
	S = async (e, r) => {
		const t = crypto.getRandomValues(new Uint8Array(16));
		return (
			t.join(",") +
			"$" +
			((n = await crypto.subtle.encrypt({ name: P, iv: t }, await e, w(r))),
			btoa(String.fromCharCode.apply(null, new Uint8Array(n))))
		);
		var n;
	},
	D = async (e, r) => {
		const [t, n] = r.split("$");
		return g(
			await crypto.subtle.decrypt(
				{ name: P, iv: new Uint8Array(t.split(",")) },
				await e,
				((e) => {
					const r = atob(e);
					return new Uint8Array(r.length).map((e, t) => r.charCodeAt(t)).buffer;
				})(n),
			),
		);
	},
	L = "icegatheringstatechange",
	I = "offer";
var $ = (e, { rtcConfig: r, rtcPolyfill: t, turnConfig: n }) => {
	const a = new (t || RTCPeerConnection)({
			iceServers: E.concat(n || []),
			...r,
		}),
		o = {};
	let s = !1,
		c = !1,
		l = null;
	const d = (e) => {
			(e.binaryType = "arraybuffer"),
				(e.bufferedAmountLowThreshold = 65535),
				(e.onmessage = (e) => o.data?.(e.data)),
				(e.onopen = () => o.connect?.()),
				(e.onclose = () => o.close?.()),
				(e.onerror = (e) => o.error?.(e));
		},
		f = (e) =>
			Promise.race([
				new Promise((r) => {
					const t = () => {
						"complete" === e.iceGatheringState &&
							(e.removeEventListener(L, t), r());
					};
					e.addEventListener(L, t), t();
				}),
				new Promise((e) => setTimeout(e, 5e3)),
			]).then(() => ({
				type: e.localDescription.type,
				sdp: e.localDescription.sdp.replace(/a=ice-options:trickle\s\n/g, ""),
			}));
	return (
		e
			? ((l = a.createDataChannel("data")), d(l))
			: (a.ondatachannel = ({ channel: e }) => {
					(l = e), d(e);
				}),
		(a.onnegotiationneeded = async () => {
			try {
				(s = !0), await a.setLocalDescription();
				const e = await f(a);
				o.signal?.(e);
			} catch (e) {
				o.error?.(e);
			} finally {
				s = !1;
			}
		}),
		(a.onconnectionstatechange = () => {
			["disconnected", "failed", "closed"].includes(a.connectionState) &&
				o.close?.();
		}),
		(a.ontrack = (e) => {
			o.track?.(e.track, e.streams[0]), o.stream?.(e.streams[0]);
		}),
		(a.onremovestream = (e) => o.stream?.(e.stream)),
		e && (a.canTrickleIceCandidates || a.onnegotiationneeded()),
		{
			created: Date.now(),
			connection: a,
			get channel() {
				return l;
			},
			get isDead() {
				return "closed" === a.connectionState;
			},
			async signal(r) {
				if ("open" !== l?.readyState || r.sdp?.includes("a=rtpmap"))
					try {
						if (r.type === I) {
							if (s || ("stable" !== a.signalingState && !c)) {
								if (e) return;
								await i([
									a.setLocalDescription({ type: "rollback" }),
									a.setRemoteDescription(r),
								]);
							} else await a.setRemoteDescription(r);
							await a.setLocalDescription();
							const t = await f(a);
							return o.signal?.(t), t;
						}
						if ("answer" === r.type) {
							c = !0;
							try {
								await a.setRemoteDescription(r);
							} finally {
								c = !1;
							}
						}
					} catch (e) {
						o.error?.(e);
					}
			},
			sendData(e) {
				return l.send(e);
			},
			destroy() {
				l?.close(), a.close(), (s = !1), (c = !1);
			},
			setHandlers(e) {
				return Object.assign(o, e);
			},
			offerPromise: e
				? new Promise(
						(e) =>
							(o.signal = (r) => {
								r.type === I && e(r);
							}),
					)
				: Promise.resolve(),
			addStream(e) {
				return e.getTracks().forEach((r) => a.addTrack(r, e));
			},
			removeStream(e) {
				return a
					.getSenders()
					.filter((r) => e.getTracks().includes(r.track))
					.forEach((e) => a.removeTrack(e));
			},
			addTrack(e, r) {
				return a.addTrack(e, r);
			},
			removeTrack(e) {
				const r = a.getSenders().find((r) => r.track === e);
				r && a.removeTrack(r);
			},
			replaceTrack(e, r) {
				const t = a.getSenders().find((r) => r.track === e);
				if (t) return t.replaceTrack(r);
			},
		}
	);
};
const E = [
		...n(3, (e, r) => `stun:stun${r || ""}.l.google.com:19302`),
		"stun:stun.cloudflare.com:3478",
	].map((e) => ({ urls: e })),
	C = Object.getPrototypeOf(Uint8Array),
	U = 16369,
	_ = 255,
	O = "bufferedamountlow",
	j = (e) => "@_" + e;
const H = {},
	J = {},
	M = {},
	R = {},
	x = {},
	q = {},
	B = {},
	G = {},
	N = async (e) => {
		if (J[e]) return J[e];
		const r = (await A(e)).slice(0, 20);
		return (J[e] = r), (M[r] = e), r;
	},
	z = async (e, r, t) =>
		e.send(b({ action: "announce", info_hash: await N(r), peer_id: s, ...t })),
	K = (e, r, n) =>
		console.warn(
			`${t}: torrent tracker ${n ? "failure" : "warning"} from ${e} - ${r}`,
		),
	V = (({ init: e, subscribe: r, announce: a }) => {
		const o = {};
		let y,
			m,
			v,
			T = !1;
		return (L, I, E) => {
			const { appId: H } = L;
			if (o[H]?.[I]) return o[H][I];
			const J = {},
				M = {},
				R = h(t, H, I),
				x = A(R),
				q = A(h(R, s)),
				B = (async (e, r, t) =>
					crypto.subtle.importKey(
						"raw",
						await crypto.subtle.digest(
							{ name: "SHA-256" },
							w(`${e}:${r}:${t}`),
						),
						{ name: P },
						!1,
						["encrypt", "decrypt"],
					))(L.password || "", H, I),
				G = (e) => async (r) => ({ type: r.type, sdp: await e(B, r.sdp) }),
				N = G(D),
				z = G(S),
				K = () => $(!0, L),
				V = (e, r, t) => {
					M[r]
						? M[r] !== e && e.destroy()
						: ((M[r] = e),
							re(e, r),
							J[r]?.forEach((e, r) => {
								r !== t && e.destroy();
							}),
							delete J[r]);
				},
				W = (e, r) => {
					M[r] === e && delete M[r];
				},
				F = (e) => (
					m.push(...n(e, K)),
					i(
						m
							.splice(0, e)
							.map((e) =>
								e.offerPromise.then(z).then((r) => ({ peer: e, offer: r })),
							),
					)
				),
				Q = (e, r) =>
					E?.({
						error: `incorrect password (${L.password}) when decrypting ${r}`,
						appId: H,
						peerId: e,
						roomId: I,
					}),
				X = (e) => async (r, t, n) => {
					const [a, o] = await i([x, q]);
					if (r !== a && r !== o) return;
					const {
						peerId: c,
						offer: l,
						answer: d,
						peer: f,
					} = "string" == typeof t ? k(t) : t;
					if (c !== s && !M[c])
						if (!c || l || d) {
							if (l) {
								const r = J[c]?.[e];
								if (r && s > c) return;
								const t = $(!1, L);
								let a;
								t.setHandlers({
									connect() {
										return V(t, c, e);
									},
									close() {
										return W(t, c);
									},
								});
								try {
									a = await N(l);
								} catch {
									return void Q(c, "offer");
								}
								if (t.isDead) return;
								const [o, d] = await i([A(h(R, c)), t.signal(a)]);
								n(o, b({ peerId: s, answer: await z(d) }));
							} else if (d) {
								let r;
								try {
									r = await N(d);
								} catch (e) {
									return void Q(c, "answer");
								}
								if (f)
									f.setHandlers({
										connect() {
											return V(f, c, e);
										},
										close() {
											return W(f, c);
										},
									}),
										f.signal(r);
								else {
									const t = J[c]?.[e];
									t && !t.isDead && t.signal(r);
								}
							}
						} else {
							if (J[c]?.[e]) return;
							const [[{ peer: r, offer: t }], a] = await i([F(1), A(h(R, c))]);
							(J[c] ||= []),
								(J[c][e] = r),
								setTimeout(
									() =>
										((e, r) => {
											if (M[e]) return;
											const t = J[e]?.[r];
											t && (delete J[e][r], t.destroy());
										})(c, e),
									0.9 * Y[e],
								),
								r.setHandlers({
									connect() {
										return V(r, c, e);
									},
									close() {
										return W(r, c);
									},
								}),
								n(a, b({ peerId: s, offer: t }));
						}
				};
			if (!L) throw p("requires a config map as the first argument");
			if (!H && !L.firebaseApp) throw p("config map is missing appId field");
			if (!I) throw p("roomId argument required");
			if (!T) {
				const r = e(L);
				(m = n(20, K)),
					(y = Array.isArray(r) ? r : [r]),
					(T = !0),
					(v = setInterval(
						() =>
							(m = m.filter((e) => {
								const r = Date.now() - e.created < 57333;
								return r || e.destroy(), r;
							})),
						59052.99,
					));
			}
			const Y = y.map(() => 5333),
				Z = [],
				ee = y.map(async (e, t) => r(await e, await x, await q, X(t), F));
			i([x, q]).then(([e, r]) => {
				const t = async (n, o) => {
					const s = await a(n, e, r);
					"number" == typeof s && (Y[o] = s),
						(Z[o] = setTimeout(() => t(n, o), Y[o]));
				};
				ee.forEach(async (e, r) => {
					await e, t(await y[r], r);
				});
			});
			let re = u;
			return (
				(o[H] ||= {}),
				(o[H][I] = ((e, r, a) => {
					const o = {},
						s = {},
						y = {},
						m = {},
						h = {},
						v = {},
						P = {},
						T = {
							onPeerJoin: u,
							onPeerLeave: u,
							onPeerStream: u,
							onPeerTrack: u,
						},
						A = (e, r) =>
							(e ? (Array.isArray(e) ? e : [e]) : f(o)).flatMap((e) => {
								const n = o[e];
								return n
									? r(e, n)
									: (console.warn(`${t}: no peer with id ${e} found`), []);
							}),
						S = (e) => {
							o[e] &&
								(delete o[e], delete m[e], delete h[e], T.onPeerLeave(e), r(e));
						},
						D = (e) => {
							if (s[e]) return y[e];
							if (!e) throw p("action type argument is required");
							const r = w(e);
							if (r.byteLength > 12)
								throw p(
									`action type string "${e}" (${r.byteLength}b) exceeds byte limit (12). Hint: choose a shorter name.`,
								);
							const t = new Uint8Array(12);
							t.set(r);
							let a = 0;
							return (
								(s[e] = {
									onComplete: u,
									onProgress: u,
									setOnComplete: (r) => (s[e] = { ...s[e], onComplete: r }),
									setOnProgress: (r) => (s[e] = { ...s[e], onProgress: r }),
									async send(e, r, s, c) {
										if (s && "object" != typeof s)
											throw p("action meta argument must be an object");
										const l = typeof e;
										if ("undefined" === l)
											throw p("action data cannot be undefined");
										const d = "string" !== l,
											f = e instanceof Blob,
											u = f || e instanceof ArrayBuffer || e instanceof C;
										if (s && !u)
											throw p(
												"action meta argument can only be used with binary data",
											);
										const y = u
												? new Uint8Array(f ? await e.arrayBuffer() : e)
												: w(d ? b(e) : e),
											m = s ? w(b(s)) : null,
											g = Math.ceil(y.byteLength / U) + (s ? 1 : 0) || 1,
											h = n(g, (e, r) => {
												const n = r === g - 1,
													o = s && 0 === r,
													i = new Uint8Array(
														15 +
															(o
																? m.byteLength
																: n
																	? y.byteLength - U * (g - (s ? 2 : 1))
																	: U),
													);
												return (
													i.set(t),
													i.set([a], 12),
													i.set([n | (o << 1) | (u << 2) | (d << 3)], 13),
													i.set([Math.round(((r + 1) / g) * _)], 14),
													i.set(
														s
															? o
																? m
																: y.subarray((r - 1) * U, r * U)
															: y.subarray(r * U, (r + 1) * U),
														15,
													),
													i
												);
											});
										return (
											(a = (a + 1) & _),
											i(
												A(r, async (e, r) => {
													const { channel: t } = r;
													let n = 0;
													for (; n < g; ) {
														const a = h[n];
														if (
															(t.bufferedAmount >
																t.bufferedAmountLowThreshold &&
																(await new Promise((e) => {
																	const r = () => {
																		t.removeEventListener(O, r), e();
																	};
																	t.addEventListener(O, r);
																})),
															!o[e])
														)
															break;
														r.sendData(a), n++, c?.(a[14] / _, e, s);
													}
												}),
											)
										);
									},
								}),
								(y[e] ||= [s[e].send, s[e].setOnComplete, s[e].setOnProgress])
							);
						},
						L = (e, r) => {
							const n = new Uint8Array(r),
								a = g(n.subarray(0, 12)).replaceAll("\0", ""),
								[o] = n.subarray(12, 13),
								[i] = n.subarray(13, 14),
								[c] = n.subarray(14, 15),
								l = n.subarray(15),
								d = !!(1 & i),
								f = !!(2 & i),
								u = !!(4 & i),
								p = !!(8 & i);
							if (!s[a])
								return void console.warn(
									`${t}: received message with unregistered type (${a})`,
								);
							(m[e] ||= {}), (m[e][a] ||= {});
							const y = (m[e][a][o] ||= { chunks: [] });
							if (
								(f ? (y.meta = k(g(l))) : y.chunks.push(l),
								s[a].onProgress(c / _, e, y.meta),
								!d)
							)
								return;
							const w = new Uint8Array(
								y.chunks.reduce((e, r) => e + r.byteLength, 0),
							);
							if (
								(y.chunks.reduce((e, r) => (w.set(r, e), e + r.byteLength), 0),
								delete m[e][a][o],
								u)
							)
								s[a].onComplete(w, e, y.meta);
							else {
								const r = g(w);
								s[a].onComplete(p ? k(r) : r, e);
							}
						},
						I = async () => {
							await N(""),
								await new Promise((e) => setTimeout(e, 99)),
								l(o).forEach(([e, r]) => {
									r.destroy(), delete o[e];
								}),
								a();
						},
						[$, E] = D(j("ping")),
						[H, J] = D(j("pong")),
						[M, R] = D(j("signal")),
						[x, q] = D(j("stream")),
						[B, G] = D(j("track")),
						[N, z] = D(j("leave"));
					return (
						e((e, r) => {
							o[r] ||
								((o[r] = e),
								e.setHandlers({
									data: (e) => L(r, e),
									stream(e) {
										T.onPeerStream(e, r, v[r]), delete v[r];
									},
									track(e, t) {
										T.onPeerTrack(e, t, r, P[r]), delete P[r];
									},
									signal: (e) => M(e, r),
									close: () => S(r),
									error(e) {
										console.error(e), S(r);
									},
								}),
								T.onPeerJoin(r),
								e.drainEarlyData?.((e) => L(r, e)));
						}),
						E((e, r) => H("", r)),
						J((e, r) => {
							h[r]?.(), delete h[r];
						}),
						R((e, r) => o[r]?.signal(e)),
						q((e, r) => (v[r] = e)),
						G((e, r) => (P[r] = e)),
						z((e, r) => S(r)),
						c && addEventListener("beforeunload", I),
						{
							makeAction: D,
							leave: I,
							async ping(e) {
								if (!e) throw p("ping() must be called with target peer ID");
								const r = Date.now();
								return (
									$("", e), await new Promise((r) => (h[e] = r)), Date.now() - r
								);
							},
							getPeers: () => d(l(o).map(([e, r]) => [e, r.connection])),
							addStream: (e, r, t) =>
								A(r, async (r, n) => {
									t && (await x(t, r)), n.addStream(e);
								}),
							removeStream: (e, r) => A(r, (r, t) => t.removeStream(e)),
							addTrack: (e, r, t, n) =>
								A(t, async (t, a) => {
									n && (await B(n, t)), a.addTrack(e, r);
								}),
							removeTrack: (e, r) => A(r, (r, t) => t.removeTrack(e)),
							replaceTrack: (e, r, t, n) =>
								A(t, async (t, a) => {
									n && (await B(n, t)), a.replaceTrack(e, r);
								}),
							onPeerJoin: (e) => (T.onPeerJoin = e),
							onPeerLeave: (e) => (T.onPeerLeave = e),
							onPeerStream: (e) => (T.onPeerStream = e),
							onPeerTrack: (e) => (T.onPeerTrack = e),
						}
					);
				})(
					(e) => (re = e),
					(e) => delete M[e],
					() => {
						delete o[H][I],
							Z.forEach(clearTimeout),
							ee.forEach(async (e) => (await e)()),
							clearInterval(v);
					},
				))
			);
		};
	})({
		init(e) {
			return ((e, r, t) =>
				(e.relayUrls || r).slice(
					0,
					e.relayUrls ? e.relayUrls.length : e.relayRedundancy || t,
				))(e, Q, 3).map((e) => {
				const r = ((e, r) => {
						const t = {},
							n = () => {
								const a = new WebSocket(e);
								(a.onclose = () => {
									(v[e] ??= 3333), setTimeout(n, v[e]), (v[e] *= 2);
								}),
									(a.onmessage = (e) => r(e.data)),
									(t.socket = a),
									(t.url = a.url),
									(t.ready = new Promise(
										(r) =>
											(a.onopen = () => {
												r(t), (v[e] = 3333);
											}),
									)),
									(t.send = (e) => {
										1 === a.readyState && a.send(e);
									});
							};
						return n(), t;
					})(e, (e) => {
						const r = k(e),
							n = r["failure reason"],
							a = r["warning message"],
							{ interval: o } = r,
							s = M[r.info_hash];
						if (n) K(t, n, !0);
						else {
							if ((a && K(t, a), o && 1e3 * o > q[t] && x[t][s])) {
								const e = Math.min(1e3 * o, 120333);
								clearInterval(R[t][s]),
									(q[t] = e),
									(R[t][s] = setInterval(x[t][s], e));
							}
							B[r.offer_id] ||
								((r.offer || r.answer) && ((B[r.offer_id] = !0), G[t][s]?.(r)));
						}
					}),
					{ url: t } = r;
				return (H[t] = r), (G[t] = {}), r.ready;
			});
		},
		subscribe(e, r, t, n, a) {
			const { url: s } = e,
				i = async () => {
					const t = d((await a(10)).map((e) => [o(20), e]));
					(G[e.url][r] = (a) => {
						if (a.offer)
							n(r, { offer: a.offer, peerId: a.peer_id }, (t, n) =>
								z(e, r, {
									answer: k(n).answer,
									offer_id: a.offer_id,
									to_peer_id: a.peer_id,
								}),
							);
						else if (a.answer) {
							const e = t[a.offer_id];
							e && n(r, { answer: a.answer, peerId: a.peer_id, peer: e.peer });
						}
					}),
						z(e, r, {
							numwant: 10,
							offers: l(t).map(([e, { offer: r }]) => ({
								offer_id: e,
								offer: r,
							})),
						});
				};
			return (
				(q[s] = 33333),
				(x[s] ||= {}),
				(x[s][r] = i),
				(R[s] ||= {}),
				(R[s][r] = setInterval(i, q[s])),
				i(),
				() => {
					clearInterval(R[s][r]), delete G[s][r], delete x[s][r];
				}
			);
		},
		announce(e) {
			return q[e.url];
		},
	}),
	W = ((F = H), () => d(l(F).map(([e, r]) => [e, r.socket])));
var F;
const Q = [
	"tracker.webtorrent.dev",
	"tracker.openwebtorrent.com",
	"tracker.btorrent.xyz",
	"tracker.files.fm:7073/announce",
].map((e) => "wss://" + e);
const trystero = {
	defaultRelayUrls: Q,
	getRelaySockets: W,
	joinRoom: V,
	selfId: s,
};

$APP.updateModule({ name: "trystero", base: trystero, frontend: true });

})();
await (async () => {
const { html } = $APP;

$APP.define("app-container", {
	render() {
		return html`<uix-container max-resolution="xl" gap="2xl" padding="lg">
									<uix-container gap="md">
										<uix-text size="3xl" text="center" weight="bold">
											<uix-icon name="calendar-heart" size="4xl" color="blue-60"></uix-icon>
											Habit Tracker
										</uix-text>
										<uix-text size="xl" text="center" weight="bold">Build better habits, one day at a time</uix-text>
									</uix-container>
									<uix-card>
										<uix-text size="2xl" weight="bold">									
											<uix-icon name="circle-plus" size="lg" color="green-60"></uix-icon>	
											New Habit
										</uix-text>
										<uix-form ._data=${{ model: "habits" }} ._map=${{ submit: "$data:add" }}>
											<uix-join>
												<uix-input name="name" size="xl"></uix-input>
												<uix-button label="ADD" icon="plus" type="submit" size="xl"></uix-button>
											</uix-join>
										</uix-form>
									</uix-card>
									<uix-container			
										justify="space-between"  
										gap="md"
										._data=${{
											model: "habits",
											tag: "uix-card",
											includes: "checkins,notes",
											blocks: [
												{
													tag: "uix-container",
													properties: {
														horizontal: true,
														justify: "space-between",
													},
													blocks: [
														{
															tag: "uix-link",
															properties: {
																size: "xl",
																_map: { label: "@parent.name" },
															},
														},
														{
															tag: "uix-link",
															properties: {
																icon: "trash",
																confirmation:
																	"Are you sure you want to remove habit?",
																_map: { click: "$data:remove" },
															},
														},
													],
												},
												{
													tag: "uix-calendar",
													properties: {
														gap: "10px",
														_map: {
															toggledDays: "$map:@parent.checkins:date",
															habit: "@parent.id",
															dayContent: {
																tag: "uix-calendar-day",
																function: true,
															},
														},
													},
												},
												{
													tag: "uix-container",
													properties: {
														horizontal: true,
														justify: "space-between",
													},
													blocks: [
														{
															tag: "uix-button",
															properties: {
																label: "Complete today",

																_data: {
																	model: "checkins",
																	method: "edit",
																	displayIf: {
																		"@parent.checkins": {
																			$ninc: { date: "$today" },
																		},
																	},
																},
																_map: {
																	_row: "$find:@parent.checkins:date=$today",
																	habit: "@parent.id",
																	date: "$today",
																	click: "$data:add",
																},
															},
														},
														{
															tag: "uix-button",
															properties: {
																label: "Today Completed",
																_data: {
																	model: "checkins",
																	method: "edit",
																	displayIf: {
																		"@parent.checkins": {
																			$inc: { date: "$today" },
																		},
																	},
																},
																_map: {
																	habit: "@parent.id",
																	date: "$today",
																	click: "$data:remove",
																},
															},
														},
														{
															tag: "uix-modal",
															properties: {
																icon: "message",
																label: "Add notes",
																_map: {
																	cta: {
																		tag: "uix-button",
																		properties: {
																			icon: "message-square-text",
																			label: "Notes",
																		},
																	},
																	content: {
																		tag: "uix-form",
																		properties: {
																			_data: { model: "notes", method: "add" },
																			_map: {
																				_row: "$find:@parent.notes:date=$today",
																				habit: "@parent.id",
																				date: "$today",
																				submit: "$data:upsert",
																				submitSuccess:
																					"$closest:uix-modal.hide",
																			},
																		},
																		blocks: [
																			{
																				tag: "uix-join",
																				blocks: [
																					{
																						tag: "uix-input",
																						properties: {
																							name: "notes",
																							size: "xl",
																							_map: {
																								_row: "$find:@parent.notes:date=$today",
																								value: "@notes",
																							},
																						},
																					},
																					{
																						tag: "uix-button",
																						properties: {
																							label: "ADD",
																							icon: "plus",
																							type: "submit",
																							size: "xl",
																						},
																					},
																				],
																			},
																		],
																	},
																},
															},
														},
													],
												},
												{},
											],
										}}>	
									</uix-container>
									<uix-card>
										<uix-text size="lg" weight="bold">Your Progress</uix-text>
										<uix-list gap="lg" horizontal justify="space-evenly">
											<uix-stat label="Total Habits" ._data=${{ model: "habits" }} ._map=${{ value: "$count" }} background="lightblue"></uix-stat>
											<uix-stat label="Total Streaks" value="5" background="lightblue"></uix-stat>
											<uix-stat label="Longest Streaks" value="5" background="lightblue"></uix-stat>
										</uix-list>
									</uix-card>
								</uix-container>
			<app-button></app-button>      
    `;
	},
});

})();
await (async () => {
$APP.addModule({ name: "icon-lucide", icon: true });

})();
await (async () => {
$APP.addModule({
	name: "manrope",
	font: {
		name: "Manrope",
		type: "woff2",
		variants: [
			"extralight",
			"light",
			"medium",
			"regular",
			"semibold",
			"bold",
			"extrabold",
		],
	},
});

})();
await (async () => {
$APP.addModule({
	name: "uix",
	frontend: true,
	modules: ["router"],
	components: {
		form: [
			"form",
			"form-control",
			"input",
			"select",
			"textarea",
			"checkbox",
			"radio",
			"time",
			"rating",
			"join",
			"file-upload", // 🔺 ToDo
			"number-input", // 🔺 ToDo
			"switch", // 🔺 ToDo
			"slider", // 🔺 ToDo
		],

		navigation: [
			"navbar",
			"breadcrumbs",
			"menu", // 🔺 ToDo (menu dropdown)
			"sidebar", // 🔺 ToDo
			"pagination",
			"tabs",
			"tabbed",
		],

		overlay: [
			"overlay",
			"modal",
			"drawer",
			"tooltip",
			"popover", // 🔺 ToDo
			"alert-dialog", // 🔺 ToDo
			"toast", // 🔺 ToDo
		],

		display: [
			"text",
			"link",
			"button",
			"avatar",
			"badge",
			"card",
			"circle",
			"image",
			"logo",
			"media",
			"table",
			"table-row",
			"icon",
			"calendar",
			"calendar-day",
			"tag", // 🔺 ToDo
			"stat",
			"chart",
			"content",
		],

		layout: [
			"list",
			"accordion",
			"grid",
			"grid-cell",
			"row",
			"container",
			"divider",
			"section", // 🔺 ToDo
			"page", // 🔺 ToDo
			"flex", // 🔺 ToDo
			"stack", // 🔺 ToDo
			"spacer", // 🔺 ToDo
		],

		feedback: [
			"spinner",
			"progress-bar", // 🔺 ToDo
			"circular-progress", // 🔺 ToDo
			"skeleton", // 🔺 ToDo
		],

		utility: [
			"draggable",
			"droparea",
			"clipboard", // 🔺 ToDo
			"theme-toggle", // 🔺 ToDo
			"dark-mode-switch", // 🔺 ToDo
		],
	},
});

})();
await (async () => {
const routes = {
	"/theme": {
		component: () => $APP.html`<theme-ui></theme-ui>`,
		title: "Theme",
		template: "uix-template",
	},
};

$APP.routes.set(routes);

})();
await (async () => {
const templateJS = (bundle) => `$APP.settings.dev = false;
(async () => {
	${bundle}
	}
)();
`;

const bundleAssets = async () => {
	return $APP.fs.assets();
};

const bundleJS = async (wrap = false) => {
	const {
		js: jsEntries = [],
		json: jsonEntries = [],
		component: components = [],
	} = $APP.fs.list();

	let bundledJS = "";

	for (const file of jsEntries) {
		const { path } = file;
		try {
			const response = await fetch(path);
			if (response.ok) {
				let jsContent = await response.text();
				if (wrap) {
					jsContent = `await (async () => {\n${jsContent}\n})();`;
				}
				bundledJS += `${jsContent}\n`;
			}
		} catch (error) {
			console.error(`Failed to fetch JavaScript file at ${jsPath}:`, error);
		}
	}
	for (const file of components) {
		const { path } = file;
		try {
			const response = await fetch(path);
			if (response.ok) {
				let jsContent = await response.text();
				if (wrap) {
					jsContent = `await (async () => {\n${jsContent}\n})();`;
				}
				bundledJS += `${jsContent}\n`;
			}
		} catch (error) {
			console.error(
				`Failed to fetch JavaScript file at ${componentPath}:`,
				error,
			);
		}
	}

	const finalBundle = templateJS(bundledJS);
	return finalBundle;
};

const bundleCSS = async () => {
	const themeCSS = $APP.theme.generateThemeCSS();
	const cssEntries = $APP.fs.getAllEntries().css;
	let bundledCSS = `${themeCSS}\n`;

	for (const cssPath of cssEntries) {
		try {
			const response = await fetch(cssPath);
			if (response.ok) {
				const cssContent = await response.text();
				bundledCSS += `${cssContent}\n`;
			}
		} catch (error) {
			console.error(`Failed to fetch CSS file at ${cssPath}:`, error);
		}
	}

	return bundledCSS;
};

$APP.addModule({
	name: "bundler",
	path: "apps/bundler",
	frontend: true,
	backend: true,
	dev: true,
	functions: { bundleCSS, bundleJS, bundleAssets },
	modules: ["integrations/github"],
});

$APP.events.set({ bundleCSS, bundleJS, bundleAssets });

})();
await (async () => {
$APP.addModule({
	name: "github",
	alias: "Github",
	path: "integrations/github",
	backend: true,
	dev: true,
});

})();
await (async () => {
const p2p = {};
$APP.events.install(p2p);
$APP.addModule({
	name: "p2p",
	frontend: true,
	backend: true,
	base: p2p,
});

})();
await (async () => {
const events = {
	"P2P:SEND_DATA_OP": ({ payload }) => {
		console.log("P2P DATA OP", { payload });
		$APP.p2p.emit("SEND_DATA_OP", payload);
	},
};
$APP.events.set(events);

})();
await (async () => {
const { T, theme, css } = $APP;
const alignItems = {
	start: "flex-start",
	center: "center",
	end: "flex-end",
	baseline: "baseline",
	stretch: "stretch",
};

const overflowOptions = {
	"x-auto": "auto hidden",
	"y-auto": "hidden auto",
	"x-hidden": "hidden visible",
	"y-hidden": "visible hidden",
	"x-clip": "clip visible",
	"y-clip": "visible clip",
	"x-visible": "visible hidden",
	"y-visible": "hidden visible",
	"x-scroll": "scroll hidden",
	"y-scroll": "hidden scroll",
};

const shadowOptions = {
	none: "none",
	sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
	default: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
	md: "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
	lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1)",
	xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
	"2xl": "0 25px 50px rgba(0, 0, 0, 0.25)",
};

const flex = ["1", "initial", "none", "auto"];

$APP.define("uix-container", {
	css: css`& {
  --uix-container-shadow: none;
  --uix-container-border-style: solid;
  --uix-container-border-color: transparent;
  --uix-container-border-size: 0;
  --uix-container-padding: 0;
  --uix-container-justify: flex-start;
  --uix-container-align-items: stretch;
  --uix-container-overflow: visible;
  --uix-container-position: static;
  --uix-container-max-resolution: none;
  --uix-container-list-style-type: none;
  --uix-container-height: auto;
  --uix-container-text-color: var(--text-color);
  --uix-container-background-color: var(--background-color);
  --uix-container-width: auto;
  --uix-container-gap: 0;
  --uix-container-flex-wrap: nowrap;
  --uix-container-border-radius: 4px;
  --uix-container-rows: 1;
  --uix-container-width: auto;
  --uix-container-margin: 0;

  overflow-y: auto;
  display: flex;
  flex-wrap: var(--uix-container-flex-wrap);
  margin: var(--uix-container-margin);
  background-color: var(--uix-container-background-color);
  color: var(--uix-container-text-color);
  border: var(--uix-container-border-size) var(--uix-container-border-style) var(--uix-container-border-color);
  box-shadow: var(--uix-container-shadow);
  width: var(--uix-container-width);
  height: var(--uix-container-height);
  gap: var(--uix-container-gap);
  padding: var(--uix-container-padding);
  justify-content: var(--uix-container-justify);
  align-items: var(--uix-container-align-items);
  overflow: var(--uix-container-overflow);
  position: var(--uix-container-position);
  max-width: var(--uix-container-max-resolution);
}

&[children-flex="1"] > * { flex: 1; }
&[children-flex="2"] > * { flex: 2; }
&[children-flex="3"] > * { flex: 3; }

&[rows] {
  > * {
    flex: 1 1 calc(100% / var(--uix-container-rows) - 16px);
  }
}

&:not([horizontal]) {
  flex-direction: column;
}

&[reverse]:not([horizontal]) {
  flex-direction: column-reverse;
}

&[reverse][horizontal] {
  flex-direction: row-reverse;
}

&[grid] {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 640px) {
  &[grid] {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  &[grid] {
    grid-template-columns: repeat(3, 1fr);
  }
}

&[grid] {
  gap: 1rem;
}

&[rounded] {
  border-radius: var(--uix-container-border-radius);
}

&[secondary] {
  background-color: var(--color-secondary-30);
}

&[responsive] {
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
}
 
&[grow] {
  flex-grow: 1;
}

&[no-shrink] {
  flex-shrink: 0;
}

&[relative] {
  position: relative;
}

&[gap='stack'] {
  margin-right: -1rem;
}

[center] {
  margin-inline: auto;
}

[left] {
  margin-right: auto;
}

[right] {
  margin-left: auto;
}

[animate] {
  transition: all 1s ease, opacity 1s ease;  
}

[bordered] {
	--uix-container-border-style: var(--border-style);
	--uix-container-border-size: var(--border-size);
	--uix-container-border-color: var(--border-color);
}
`,
	properties: {
		"data-model": T.string(),
		"data-includes": T.string(),
		"data-type": T.string(),
		"data-id": T.string(),
		"data-row": T.object(),
		"content-visibility": T.string({
			theme: ({ value }) => ({ "content-visibility": value }),
		}),
		rows: T.string({
			theme: ({ value }) => ({
				"--uix-container-flex-wrap": "wrap",
				"--uix-container-rows": value,
			}),
		}),
		shadow: T.string({
			enum: shadowOptions,
			theme: ({ value, options }) => ({
				"--uix-container-box-shadow": options[value],
			}),
		}),
		items: T.string({
			enum: alignItems,
			theme: ({ value, options }) => ({
				"--uix-container-align-items": options[value],
			}),
		}),
		"max-resolution": T.string({
			enum: theme.sizes,
			theme: ({ value }) => ({
				"--uix-container-max-resolution": theme.getSize(value) || value,
				margin: "auto",
				width: "100%",
			}),
		}),
		overflow: T.string({
			enum: overflowOptions,
			theme: ({ value, options }) => ({
				"--uix-container-overflow": options[value] ?? value,
			}),
		}),
		position: T.string({
			theme: ({ value }) => ({ "--uix-container-position": value }),
		}),
		list: T.string({
			enum: ["disc", "decimal", "none"],
			theme: ({ value }) => ({
				"--uix-container-list-style-type": value,
			}),
		}),
		justify: T.string({
			theme: ({ value }) => ({
				"--uix-container-justify": value,
			}),
		}),
		background: T.string({
			theme: ({ value }) => ({
				background: value,
			}),
		}),
		bordered: T.string({
			theme: ({ value }) => ({
				border: value,
			}),
		}),
		padding: T.string({
			enum: theme.spacing,
			theme: ({ value, options }) => {
				const parts = value.split("-");
				return {
					"--uix-container-padding": parts
						.map((part) => options[part] || part)
						.join(" "),
				};
			},
		}),
		margin: T.string({
			enum: theme.spacing,
			theme: ({ value }) => {
				const parts = value.split("-");
				return {
					"--uix-container-margin": parts
						.map((part) => options[part] || part)
						.join(" "),
				};
			},
		}),
		spacing: T.string({
			enum: theme.spacing,
			theme: ({ value, options }) => ({
				"--uix-container-row-gap": options[value],
				"--uix-container-column-gap": options[value],
			}),
		}),
		gap: T.string({
			enum: theme.spacing,
			theme: ({ value, options }) => ({
				"--uix-container-gap": options[value],
			}),
		}),
		wrap: T.string({
			enum: ["nowrap", "wrap", "wrap-reverse"],
			theme: ({ value }) => ({ "--uix-container-flex-wrap": value }),
		}),
		"background-color": T.string({
			theme: ({ value }) => ({
				"--uix-container-background-color": `var(--color-${value})`,
			}),
		}),
		"flex-basis": T.string({
			theme: ({ value }) => ({ "flex-basis": value }),
		}),
		shrink: T.number({
			theme: ({ value }) => ({ "flex-shrink": value }),
		}),
		flex: T.string({
			theme: ({ value }) => ({ "--uix-container-flex": value }),
		}),
		"z-index": T.number({
			theme: ({ value }) => ({ "z-index": value }),
		}),
		width: T.string({
			enum: theme.sizes,
			theme: ({ value }) => ({
				"--uix-container-width": theme.getSize(value),
			}),
		}),
		height: T.string({
			enum: theme.sizes,
			theme: ({ value }) => ({
				"--uix-container-height": theme.getSize(value),
			}),
		}),
		secondary: T.boolean(),
		horizontal: T.boolean(),
		relative: T.boolean(),
		responsive: T.boolean(),
		reverse: T.boolean(),
		grow: T.boolean(),
		rounded: T.boolean(),
		grid: T.boolean(),
	},
});

})();
await (async () => {
const { View, T, css, theme } = $APP;

const FontWeight = {
	thin: 100,
	light: 300,
	normal: 400,
	semibold: 600,
	bold: 700,
	black: 900,
};

const FontType = ["sans", "serif", "mono"];
const LeadingSizes = {
	xs: "1.25",
	sm: "1.25",
	md: "1.5",
	xl: "2",
	"2xl": "3",
};
const TrackingSizes = {
	tighter: "-0.05em",
	tight: "-0.025em",
	normal: "0",
	wide: "0.025em",
	wider: "0.05em",
	widest: "0.1em",
};

const CursorTypes = [
	"auto",
	"default",
	"pointer",
	"wait",
	"text",
	"move",
	"not-allowed",
	"crosshair",
	"grab",
	"grabbing",
];

$APP.define("uix-text", {
	css: css`& {
    --uix-text-gap: 0.5rem; 
    --uix-text-align: left; 
    --uix-text-margin-right: auto; 
    --uix-text-size: 1rem;
    --uix-text-color: var(--text-color, var(--color-default));
    --uix-text-font-weight: 400; 
    --uix-text-font-family: var(--font-family); 
    --uix-text-font-sans: var(--font-family);
    --uix-text-align-self: auto;
    --uix-text-font-mono: 'Lucida Sans Typewriter', 'Lucida Console', monaco, 'Bitstream Vera Sans Mono', monospace; 
    --uix-text-font-serif: 'Georgia', 'Times New Roman', serif;
    --uix-text-line-height: 1.2; 
    --uix-text-letter-spacing: 0;
    --uix-text-text-transform: none;
    --uix-text-cursor: inherit; 
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-self: var(--uix-text-align-self);
    gap: var(--uix-text-gap);
    word-break: break-word;
    font-size: var(--uix-text-size);
    color: var(--uix-text-color);
    font-weight: var(--uix-text-font-weight);
    font-family: var(--uix-text-font-family);
    line-height: var(--uix-text-line-height);
    letter-spacing: var(--uix-text-letter-spacing);
    text-transform: var(--uix-text-text-transform);
    cursor: var(--uix-text-cursor);
    display: inline;
    text-align: var(--uix-text-align);    
  }
  `,
	properties: {
		text: T.string({
			theme: ({ value }) => ({ "--uix-text-align": value }),
		}),
		valign: T.string({
			theme: ({ value }) => ({ "--uix-text-align-self": value }),
		}),
		"word-break": T.string({
			theme: ({ value }) => ({ "word-break": value }),
		}),
		heading: T.string({
			enum: theme.text.sizes,
			theme: ({ value }) => ({
				"--uix-text-size": theme.getTextSize(value),
				"--uix-text-font-weight": FontWeight.bold,
			}),
		}),
		size: T.string({
			enum: theme.text.sizes,
			theme: ({ value }) => ({
				"--uix-text-size": theme.getTextSize(value),
			}),
		}),
		variant: T.string({
			enum: theme.colors,
			theme: ({ value }) => ({
				"--uix-text-color": `var(--color-${value}-60)`,
			}),
		}),
		weight: T.string({
			enum: FontWeight,
			theme: ({ value, options }) => ({
				"--uix-text-font-weight": options[value],
			}),
		}),
		font: T.string({
			enum: FontType,
			default: "sans",
			theme: ({ value }) => ({
				"--font-family": value,
			}),
		}),
		transform: T.string({
			theme: ({ value }) => ({ "--uix-text-text-transform": value }),
		}),
		leading: T.string({
			enum: LeadingSizes,
			theme: ({ value, options }) => ({
				"--uix-text-line-height": options[value],
			}),
		}),
		cursor: T.string({
			enum: CursorTypes,
			theme: ({ value }) => ({ "--uix-text-cursor": value }),
		}),
		tracking: T.string({
			enum: TrackingSizes,
			theme: ({ value, options }) => ({
				"--uix-text-letter-spacing": options[value],
			}),
		}),
		wrap: T.string({
			// Added wrap property
			theme: ({ value }) => ({ "text-wrap": value }),
		}),
		shadow: T.string({
			theme: ({ value }) => ({ "--uix-text-shadow": value }),
		}),
		indent: T.number(),
		reverse: T.boolean(),
		vertical: T.boolean(),
		inherit: T.boolean(),
	},
});

})();
await (async () => {
const { Icons, T, theme, css, html } = $APP;
const { getSize } = theme;

$APP.define("uix-icon", {
	css: css`& {
		--uix-icon-bg: none;
		--uix-icon-color: currentColor;
		--uix-icon-fill: none;
		--uix-icon-stroke: currentColor;
		--uix-icon-stroke-width: 2;
		--uix-icon-size: 1rem;
		display: inline-block;
		vertical-align: middle;	
		width: var(--uix-icon-size);
		svg {
			width: var(--uix-icon-size) !important;
			height: var(--uix-icon-size) !important;
		}
		svg, path {
		color: var(--uix-icon-color) !important;
		fill: var(--uix-icon-fill) !important;
		stroke: var(--uix-icon-stroke) !important;
		stroke-width: var(--uix-icon-stroke-width) !important;
		}
	}
	
	&[solid] {
		stroke: currentColor;
		fill: currentColor;
	}`,

	properties: {
		name: T.string(),
		svg: T.string(),
		size: T.string({
			enum: theme.sizes,
			theme: ({ value }) => ({
				"--uix-icon-size": theme.getTextSize(value),
			}),
		}),
		solid: T.boolean(),
		fill: T.string({
			theme: ({ value }) => ({ "--uix-icon-fill": value }),
		}),
		stroke: T.string({
			theme: ({ value }) => ({ "--uix-icon-stroke": value }),
		}),
		"stroke-width": T.string({
			theme: ({ value }) => ({ "--uix-icon-stroke-width": value }),
		}),
		"background-color": T.string({
			theme: ({ value }) => ({ "--uix-icon-background-color": value }),
		}),
		color: T.string({
			theme: ({ value }) => {
				const [color] = value.split("-");
				if (!theme.colors[color]) return value;
				return {
					"--uix-icon-color": !theme.colors[color]
						? value
						: `var(--color-${value})`,
				};
			},
		}),
	},

	async getIcon(name) {
		if (Icons[name]) {
			this.svg = Icons[name];
		} else {
			try {
				const response = await fetch(
					$APP.fs.getFilePath(
						`modules/icon-${theme.font.icon.family}/${theme.font.icon.family}/${name}.svg`,
					),
				);
				if (response.ok) {
					const svgElement = await response.text();
					Icons.set({ name: svgElement });
					this.svg = svgElement;
				} else {
					console.error(`Failed to fetch icon: ${name}`);
				}
			} catch (error) {
				console.error(`Error fetching icon: ${name}`, error);
			}
		}
	},
	willUpdate() {
		if (this.name) {
			this.getIcon(this.name);
		}
	},
	render() {
		return !this.svg ? null : html.unsafeHTML(this.svg);
	},
});

})();
await (async () => {
const { T, theme, css } = $APP;

$APP.define("uix-card", {
	css: css`& {
		--uix-card-width: auto;
		--uix-card-padding: var(--uix-container-padding, 0);
		--uix-card-border-size: var(--uix-container-border-size, 0px);
		--uix-card-border-radius: var(--radius-md);
		--uix-card-background-color: var(--color-default-1, #f0f0f0);
		--uix-card-border-color: var(--uix-container-border-color, var(--color-default, #cccccc));
		--uix-card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		--uix-card-min-height: var(--uix-container-min-height, 50px);
		--uix-card-gap: var(--uix-container-gap, 0);
		--uix-card-height: auto;
		--uix-card-justify: var(--uix-container-justify, flex-start);
		--uix-card-align-items: var(--uix-container-align-items, stretch);
		--uix-card-overflow: var(--uix-container-overflow, visible);
		--uix-card-position: var(--uix-container-position, static);
		--uix-card-list-style-type: var(--uix-container-list-style-type, none);
		--uix-card-text-color: var(--uix-container-text-color, var(--uix-text-color));
	
		border-width: var(--uix-card-border-size);
		border-radius: var(--uix-card-border-radius);
		background-color: var(--uix-card-background-color);
		border-color: var(--uix-card-border-color); 
		box-shadow: var(--uix-card-shadow);
		width: var(--uix-card-width); 
		min-height: var(--uix-card-min-height);
		gap: var(--uix-card-gap);
		padding: var(--uix-card-padding);
		height: var(--uix-card-height);
		justify-content: var(--uix-card-justify);
		align-items: var(--uix-card-align-items);
		overflow: var(--uix-card-overflow);
		position: var(--uix-card-position);
		list-style-type: var(--uix-card-list-style-type);
		color: var(--uix-card-text-color);
	
		&[clickable], &[clickable] * {
			cursor: pointer;
		}
	
		> :last-child.uix-join {
			margin-left: calc(-1 * var(--uix-card-padding));
			margin-right: calc(-1 * var(--uix-card-padding));
			margin-bottom: calc(-1 * var(--uix-card-padding));
			padding-bottom: 0;
	
			border-radius: var(--uix-card-border-radius) !important;  
			.uix-button {
				border-radius: 0 !important;
				border-top-right-radius: 0 !important;      
				&:last-child {
					border-bottom-right-radius: var(--uix-card-border-radius) !important;
				}
				&:first-child {
					border-right-width: 0;
					border-bottom-left-radius: var(--uix-card-border-radius) !important;
				}
			}
		}
	
		&[horizontal] > :last-child.uix-join {
			margin-top: calc(-1 * var(--uix-card-padding));
			margin-bottom: calc(-1 * var(--uix-card-padding));
			margin-right: 0;
			padding-right: 0;
		}
	}`,
	extends: "uix-container",
	properties: {
		variant: T.string({
			defaultValue: "default",
			enum: theme.colors,
			theme: ({ value }) => ({
				"--background-color": `var(--color-${value}-1)`,
				"--text-color": `var(--color-${value}-90)`,
				"--uix-card-border-color": `var(--color-${value})`,
			}),
		}),
		size: {
			defaultValue: "md",
			theme: ({ value }) => ({
				"--uix-card-width": theme.getSize(value),
				"--uix-card-min-height": theme.getSize(value, "0.5"),
			}),
		},
		gap: {
			defaultValue: "md",
		},
		shadow: {
			defaultValue: "md",
		},
		padding: {
			defaultValue: "lg",
		},
		justify: {
			defaultValue: "space-between",
		},
	},
});

})();
await (async () => {
const { View, T, css } = $APP;

$APP.define("uix-join", {
	css: css`& {
		--uix-list-button-radius: var(--uix-item-border-radius, 5px);
		--uix-list-button-border-width: 1px;
		--uix-list-button-margin: 0;
		list-style-type: var(--uix-list-container-list-style-type);
		width: auto;
		&.uix-join {
			flex-direction: row;
			&[vertical] {
				flex-direction: column;
			}
			&[reverse][vertical] {
				flex-direction: column-reverse;
			}
			&[reverse]:not([vertical]) {
				flex-direction: row-reverse;
			}
		}
		display: flex;
		flex-direction: row;
		& > * {
			width: 100%;
			margin: var(--uix-list-button-margin);
			&:first-child {
				border-top-left-radius: var(--uix-list-button-radius);
				border-bottom-left-radius: var(--uix-list-button-radius);
				border-bottom-right-radius: 0;
				border-top-right-radius: 0;
			}
			&:last-child {
				border-top-right-radius: var(--uix-list-button-radius);
				border-bottom-right-radius: var(--uix-list-button-radius);
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				border-left-width: 0;
			}
		}
		& > [bordered], & > [outline] {
			&:last-child {
				border-width: var(--uix-list-button-border-width); 
			}
			&:hover:active {
				border-width: var(--uix-list-button-border-width);
			}
			&:has(+ *:active) {
				border-width: var(--uix-list-button-border-width);
			}
		}
		&[vertical] {    
			& > * {
				border-radius: 0;
				margin: var(--uix-list-button-margin);
				&:first-child {
					border-top-left-radius: var(--uix-list-button-radius);
					border-top-right-radius: var(--uix-list-button-radius);
				}
				&:last-child {
					border-bottom-left-radius: var(--uix-list-button-radius);
					border-bottom-right-radius: var(--uix-list-button-radius);
				}
			}
			& > .uix-button[bordered], & > .uix-button[outline] {
				border-width: var(--uix-list-button-border-width);
				&:last-child {
					border-width: var(--uix-list-button-border-width); 
				}
				&:hover:active {
					border-width: var(--uix-list-button-border-width);
				}
				&:has(+ .uix-button:active) {
					border-width: var(--uix-list-button-border-width);
				}
			}
		}
	}`,
	extends: "uix-container",
	properties: {
		vertical: T.boolean(),
	},
});

})();
await (async () => {
const { T, View, css } = $APP;

$APP.define("uix-form", {
	css: css`& {
		display: flex;
		flex-direction: column; 
		gap: 1rem; 
		padding-top: 1rem;
	}`,
	properties: {
		method: T.string({ defaultValue: "post" }),
		endpoint: T.string(),
		submit: T.function(),
		submitSuccess: T.function(),
		submitError: T.function(),
	},
	getFormControls() {
		return this.querySelectorAll("uix-form-control");
	},
	validate() {
		const formControls = this.getFormControls();
		return [...formControls].every((control) => control.reportValidity());
	},
	async handleSubmit(event) {
		event.preventDefault();
		if (this.submit) this.submit();
		console.log(this.submitSuccess);
		if (this.submitSuccess) this.submitSuccess();

		if (!this.validate()) return;
		const formData = this.formData();
		const response = await fetch(this.endpoint, {
			method: this.method,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		if (!response.ok) console.error("Form submission failed", response);
	},
	reset() {
		this.getFormControls().forEach((control) => control.formResetCallback?.());
	},
	formData() {
		const formData = Object.fromEntries(
			[...this.getFormControls()].map((element) => [
				element.name,
				element?.value(),
			]),
		);
		return formData;
	},
	connectedCallback() {
		const submitButton = this.querySelector('uix-button[type="submit"]');
		if (submitButton)
			submitButton.addEventListener("click", this.handleSubmit.bind(this));
		this.addEventListener("keydown", (event) => {
			if (event.key !== "Enter") return;
			event.preventDefault();
			this.handleSubmit(event);
		});
		this.addEventListener(`data-retrieved-${this.id}`, (event) =>
			this.updateFields(event.detail),
		);
	},
	updateFields(data) {
		const formControls = this.getFormControls();
		Object.keys(data).forEach((key) => {
			const control = [...formControls].find((control) => control.name === key);
			if (control) control.value = data[key];
		});
	},
});

})();
await (async () => {
const { T, theme, css } = $APP;

$APP.define("uix-button", {
	extends: "uix-link",
	css: css`& {
		--uix-button-font-weight: 700; 
		--uix-button-text-color: var(--color-default-80);
		--uix-button-background-color: var(--color-default-100);
		--uix-button-hover-background-color: var(--color-default-20);
		--uix-button-border-radius: var(--radius-sm);
		--uix-button-border-size:  0;
		--uix-button-border-color: var(--color-default-40);
		--uix-button-hover-opacity:  0.9;
		--uix-button-active-scale: 0.9;
		--uix-button-width: fit-content;
		--uix-button-height: fit-content;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem; 
		cursor: pointer;
		transition: all 0.3s ease-in-out;
		font-weight: var(--uix-button-font-weight);
		color: var(--uix-button-text-color);
		background-color: var(--uix-button-background-color);
		width: var(--uix-button-width);
		height: var(--uix-button-height);
		border: var(--uix-button-border-size) solid var(--uix-button-border-color);
		border-radius: var(--uix-button-border-radius);
	 
		> button, > a, > input {
			padding: var(--uix-button-padding, var(--uix-link-padding));
			word-break: keep-all;
			height: 100%;
			line-height: var(--uix-button-height);
			border-radius: var(--uix-button-border-radius);
			flex-basis: 100%;
			justify-content: var(--uix-text-align);
			&:hover {
				opacity: var(--uix-button-hover-opacity); 
				background-color: var(--uix-button-hover-background-color);
			}
			
			&:hover:active {
				opacity: var(--uix-button-hover-opacity);
			}  
		}
	
		.uix-icon, button, input, a {
			cursor: pointer;      
		}
	}
	`,
	properties: {
		width: T.string({
			enum: theme.sizes,
			theme: ({ value, options }) => ({
				"--uix-button-width": `${!options[value] ? value : typeof options[value] === "string" ? options[value] : `${options[value] / 2}px`}`,
			}),
		}),
		text: T.string({ defaultValue: "center" }),
		rounded: T.string({
			theme: ({ value }) => ({ "--uix-button-border-radius": value }),
		}),
		variant: T.string({
			defaultValue: "default",
			enum: theme.colors,
		}),
		size: T.string({
			enum: theme.sizes,
			defaultValue: "md",
			theme: ({ value }) => ({
				"--uix-button-size": theme.getTextSize(value),
				"--uix-button-height": theme.getSize(value, "0.1"),
				"--uix-link-padding": `0 ${theme.getSize(value, "0.05")}`,
			}),
		}),
	},
	types: {
		default: ({ variant }) => ({
			"border-size": "0",
			"background-color":
				variant === "default"
					? `var(--color-${variant}-100)`
					: `var(--color-${variant}-60)`,
			"hover-background-color": `var(--color-${variant}-30)`,
			"text-color": `var(--color-${variant}-1)`,
		}),
		bordered: ({ variant }) => ({
			"border-size": "1px",
			"background-color": "transparent",
			"hover-background-color": `var(--color-${variant}-30)`,
			"border-color": `var(--color-${variant}-40)`,
			"text-color": `var(--color-${variant}-100)`,
		}),
		ghost: ({ variant }) => ({
			"background-color": "transparent",
			"hover-background-color": `var(--color-${variant}-30)`,
			"border-size": "0px",
			"text-color": `var(--color-${variant}-100)`,
		}),
		outline: ({ variant }) => ({
			"background-color": "transparent",
			"hover-background-color": `var(--color-${variant}-30)`,
			"text-color": `var(--color-${variant}-90)`,
			"border-size": "1px",
		}),
		float: ({ variant }) => ({
			"background-color": `var(--color-${variant}-60)`,
			"hover-background-color": `var(--color-${variant}-50)`,
			"text-color": `var(--color-${variant}-1)`,
			"border-size": "0px",
			"border-radius": "100%",
			width: "var(--uix-button-height)",
			padding: "0",
			"justify-content": "center",
			shadow: "var(--shadow-md)",
			"hover-shadow": "var(--shadow-lg)",
		}),
	},
});

})();
await (async () => {
const { View, T, html } = $APP;

$APP.define("uix-list", {
	extends: "uix-container",
	properties: {
		multiple: T.boolean(),
		multipleWithCtrl: T.boolean(),
		multipleWithShift: T.boolean(),
		lastSelectedIndex: T.number(),
		selectedIds: T.array(),
		onSelectedChanged: T.function(),
		gap: T.string({ defaultValue: "md" }),
		itemId: T.string(".uix-link"),
		selectable: T.boolean(),
	},
	connectedCallback() {
		if (this.selectable)
			this.addEventListener("click", this.handleClick.bind(this));
	},
	disconnectedCallback() {
		if (this.selectable)
			this.removeEventListener("click", this.handleClick.bind(this));
	},
	handleClick: function (e) {
		console.log(this);
		const link = e.target.closest(".uix-link");
		if (!link || !this.contains(link)) return;
		e.preventDefault();
		const links = Array.from(this.qa(".uix-link"));
		const index = links.indexOf(link);
		if (index === -1) return;
		// Handle multipleWithShift selection: select range between last and current click.
		if (
			this.multipleWithShift &&
			e.shiftKey &&
			this.lastSelectedIndex !== null
		) {
			const start = Math.min(this.lastSelectedIndex, index);
			const end = Math.max(this.lastSelectedIndex, index);
			links
				.slice(start, end + 1)
				.forEach((el) => el.setAttribute("selected", ""));
			this.lastSelectedIndex = index;
			this.updateSelectedIds();
			return;
		}
		// Handle multipleWithCtrl: toggle selection when Ctrl key is pressed.
		if (this.multipleWithCtrl) {
			if (e.ctrlKey) {
				link.hasAttribute("selected")
					? link.removeAttribute("selected")
					: link.setAttribute("selected", "");
				this.lastSelectedIndex = index;
				this.updateSelectedIds();
				return;
			}
			// Without Ctrl, treat as single selection with toggle.
			links.forEach((el) => el.removeAttribute("selected"));
			if (link.hasAttribute("selected")) {
				link.removeAttribute("selected");
				this.lastSelectedIndex = null;
			} else {
				link.setAttribute("selected", "");
				this.lastSelectedIndex = index;
			}
			this.updateSelectedIds();
			return;
		}

		// Handle multiple: toggle selection on each click.
		if (this.multiple) {
			link.hasAttribute("selected")
				? link.removeAttribute("selected")
				: link.setAttribute("selected", "");
			this.lastSelectedIndex = index;
			this.updateSelectedIds();
			return;
		}

		// Default single selection: toggle selection.
		if (link.hasAttribute("selected")) {
			// If already selected, unselect it.
			links.forEach((el) => el.removeAttribute("selected"));
			this.lastSelectedIndex = null;
		} else {
			links.forEach((el) => el.removeAttribute("selected"));
			link.setAttribute("selected", "");
			this.lastSelectedIndex = index;
		}
		this.updateSelectedIds();
	},
	updateSelectedIds() {
		const links = Array.from(this.qa(this.itemId));
		this.selectedIds = links.reduce((ids, el, index) => {
			if (el.hasAttribute("selected")) ids.push(index);
			return ids;
		}, []);
		if (this.onSelectedChanged) this.onSelectedChanged(this.selectedIds);
	},
});

})();
await (async () => {
const { T, html, theme, css } = $APP;
const { getSize } = theme;

$APP.define("uix-input", {
	css: css`& {
		--uix-input-background-color: var(--color-default-10);
		--uix-input-border-color: var(--color-default-70);
		--uix-input-text-color: var(--color-default-95); 
		--uix-input-border-radius: 0.375rem; 
		--uix-input-padding-x: 5px; 
		--uix-input-padding-y: 5px; 
		--uix-input-font-size: 1rem; 
		--uix-input-focus-ring-width: 2px; 
		--uix-input-focus-ring-offset-width: 2px;
		--uix-input-height:  2.5rem;
		position: relative;
		display: flex;
		width: 100%; 
		height: var(--uix-input-height); 
		border-radius: var(--uix-input-border-radius); 
		border: 2px solid var(--uix-input-border-color); 
		font-size: var(--uix-input-font-size); 
		background-color: var(--uix-input-background-color);
		color: var(--uix-input-text-color);
		&:focus {
			outline: none;outline-style: none;
			box-shadow: none;
			border-color: transparent;
		}
		/* Default (text-based) inputs */
		input[type="text"],
		input[type="password"],
		input[type="email"],
		input[type="number"],
		input[type="decimal"],
		input[type="search"],
		input[type="tel"],
		input[type="url"] {
			width: 100%;
			outline: none;
			color: var(--uix-input-text-color);
			background-color: transparent;
			padding: var(--uix-input-padding-x) var(--uix-input-padding-y);
			border: 0;
			&:focus + label, &:not(:placeholder-shown) + label {
				transition: margin-top 0.3s ease, font-size 0.3s ease;
				margin-top: -0.4rem;
				font-size: 0.6rem;
				cursor: default;
				.uix-text {
					--uix-text-size: 0.8rem;
				}
			}
			&::placeholder {
				color: transparent;
			}
			&:focus {
				outline: none;outline-style: none;
				box-shadow: none;
				border-color: transparent;
				&::placeholder {
					color: var(--uix-input-text-color);
				}
			}
		}
		label {
			.uix-text {
				--uix-text-font-weight: 600;
			}
			cursor: text;
			position: absolute;
			margin-top: 0.5rem; 
			font-family: monospace; 
			letter-spacing: 0.05em; 
			text-transform: uppercase; 
			font-weight: 600;
			margin-left: 0.75rem;
			padding-right: 0.5rem; 
			padding-left: 0.25rem;
			background-color: var(--uix-input-background-color);
			color: var(--uix-input-text-color);
			transition: margin-top 0.3s ease, font-size 0.3s ease;
		}
		label[required]::after {
			content: '*';
			color: var(--color-error-50); 
		}
		&:not([type=checkbox]):not([radio]) input:focus-visible {
			outline: none; 
			box-shadow: 0 0 0 var(--uix-input-focus-ring-width) var(--uix-input-border-color);
		}
		&:not([type=checkbox]):not([radio]) input:disabled {
			cursor: not-allowed; 
			opacity: 0.6;
		}
		&[type=checkbox],
		&[radio] {
			border: 0;
			align-items: center;
			height: auto;
			width: auto;
			position: relative;
			cursor: pointer;
		}
		&[type=checkbox] label,
		&[radio] label {
			position: static;
			margin-top: 0;
			background-color: transparent;
			padding: 0;
			cursor: pointer;
			margin-left: 0.5rem;    
			text-transform: none;
			font-family: inherit;
			letter-spacing: normal;
			font-weight: normal;
			.uix-text {
				--uix-text-font-weight: 400;
			}
		}
		&[type=checkbox] input,
		&[radio] input[type="radio"] {
			width: var(--uix-input-size);
			height: var(--uix-input-size);
			margin: 0;
			border: none;
			background: none;
			box-shadow: none;
			padding: 0;    
		}
		&[type=checkbox] input:disabled,
		&[radio] input[type="radio"]:disabled {
			cursor: not-allowed;
			opacity: 0.6;
		}
		&[type=checkbox], &[radio] {
			gap: 0.75rem;
			padding: 0.5rem 0;
			--uix-checkbox-size: 1.5rem;
			--uix-checkbox-border-radius: 0.375rem;
			--uix-checkbox-checked-bg: var(--uix-input-border-color);
			--uix-checkbox-check-color: var(--uix-input-background-color);
			input, input[type="radio"] {
				appearance: none;
				-webkit-appearance: none;
				width: var(--uix-checkbox-size);
				height: var(--uix-checkbox-size);
				margin: 0;
				border: 2px solid var(--uix-input-border-color);
				border-radius: var(--uix-checkbox-border-radius);
				background-color: var(--uix-input-background-color);
				cursor: pointer;
				position: relative;
				transition: 
					background-color 0.2s ease,
					border-color 0.2s ease;
				&::after {
					content: "";
					position: absolute;
					display: none;
					left: 50%;
					top: 50%;
					width: 0.375rem;
					height: 0.75rem;
					border: solid var(--uix-checkbox-check-color);
					border-width: 0 2px 2px 0;
					transform: translate(-50%, -60%) rotate(45deg);
				}
				&:checked {
					background-color: var(--uix-checkbox-checked-bg);
					border-color: var(--uix-checkbox-checked-bg);
					&::after {
						display: block;
					}
				}
				&:focus-visible {
					box-shadow: 0 0 0 var(--uix-input-focus-ring-width) var(--uix-input-border-color);
				}
				&:disabled {
					opacity: 0.6;
					cursor: not-allowed;
					
					& + label {
						cursor: not-allowed;
						opacity: 0.6;
					}
				}
			}
			&:hover:not(:has(input[type="checkbox"]:disabled)) {
				input[type="checkbox"] {
					border-color: var(--uix-input-border-color);
				}
			}
			label {
				margin-left: 0;
				order: 2;
			}
		}
	}
	`,
	properties: {
		bind: T.object(),
		autofocus: T.boolean(),
		value: T.string(),
		placeholder: T.string(),
		name: T.string(),
		label: T.string(),
		disabled: T.boolean(),
		regex: T.string(),
		required: T.boolean(),
		type: T.string({
			defaultValue: "text",
			enum: [
				"text",
				"password",
				"email",
				"number",
				"decimal",
				"search",
				"tel",
				"url",
				"checkbox",
			],
		}),
		maxLength: T.number(),
		variant: T.string({
			theme: ({ value }) => ({
				"--uix-input-background-color": `var(--color-${value}-1)`,
				"--uix-input-border-color": `var(--color-${value}-30)`,
				"--uix-input-text-color": `var(--color-${value}-90)`,
			}),
			defaultValue: "default",
		}),
		size: T.string({
			theme: ({ value }) => ({
				"--uix-input-font-size": theme.getTextSize(value),
				"--uix-input-height": theme.getSize(value, "0.1"),
			}),
			defaultValue: "md",
			enum: theme.sizes,
		}),
		keydown: T.function(),
		input: T.function(),
		selected: T.boolean(),
	},
	connectedCallback() {
		if (!this.name) {
			const uniqueId = `uix-input-${Math.random().toString(36).substr(2, 9)}`;
			this.name = uniqueId;
		}
	},
	inputValue() {
		const el = this.q("input");
		return el?.value;
	},
	resetValue() {
		const el = this.q("input");
		if (el) el.value = null;
	},
	_input(event) {
		this.value = event.target.value;
		if (this.input) this.input(event);
	},
	render() {
		const {
			name,
			autofocus,
			value,
			placeholder,
			label,
			disabled,
			required,
			regex,
			type,
			_input: input,
			size,
			bind,
			checkbox,
			radio,
			selected,
		} = this;

		const inputType = checkbox ? "checkbox" : radio ? "radio" : type;
		const inputValue = (bind ? bind.value : value) || "";
		const isCheckbox = type === "checkbox";
		return html`
        <input
          type=${inputType}
          value=${inputValue}
          ?autofocus=${autofocus}
          ?disabled=${disabled}
          size=${size}
          ?required=${required}
            ?checked=${selected}
          name=${name}
          id=${name}
          regex=${regex}
          @input=${bind ? (e) => bind.setValue(isCheckbox ? e.target.checked : e.target.value) : input}
          placeholder=${placeholder}
        />			
        ${
					label || placeholder
						? html`<label for=${name} ?required=${required}><uix-text size=${size}>${label || placeholder}</uix-text></label>`
						: ""
				}
    `;
	},
});

})();
await (async () => {
const { T, html, css } = $APP;
$APP.define("uix-stat", {
	css: css`& {
		cursor: default;
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
	}`,
	extends: "uix-container",
	properties: {
		label: T.string(),
		value: T.string(),
		padding: T.string("lg"),
		items: T.string("center"),
		text: T.string("center"),
		gap: T.string("md"),
	},
	render() {
		return html`<uix-text size="3xl" text="center" weight="bold">${this.value}</uix-text>
								<uix-text size="md" text="center" weight="bold">${this.label}</uix-text>`;
	},
});

})();
await (async () => {
const { T, html } = $APP;
$APP.define("app-button", {
	render() {
		return html`<uix-container style="position: fixed; bottom: 30px; right: 30px;">
									<uix-button .float=${html`<uix-container gap="md">
																							<theme-darkmode></theme-darkmode>
																							<bundler-button></bundler-button> 
																							<p2p-button></p2p-button> 
																						</uix-container>`} icon="settings"></uix-button>
								</uix-container>`;
	},
	properties: {
		label: T.string("Actions"),
	},
});

})();
await (async () => {
const { T, html, theme, css, Router } = $APP;
const sizeKeys = Object.keys(theme.sizes);

const GapSizes = {
	xs: "0.25",
	sm: "0.5",
	md: "1",
	lg: "1.5",
	xl: "2",
};
const getPadding = ({ value, options }) => {
	if (value.includes("-")) {
		const [topBottom, leftRight] = value.split("-");
		return {
			"--uix-link-padding": `${options[topBottom] ? `calc(${options[topBottom]} * 0.7)` : topBottom} 
														 ${options[leftRight] ? `calc(${options[leftRight]} * 0.7)` : leftRight}`,
		};
	}
	return {
		"--uix-link-padding": options[value]
			? `calc(${options[value]} * 0.7)`
			: value,
	};
};

$APP.define("uix-link", {
	css: css`& {
		&[vertical] {
			margin: 0 auto;
		}
		--uix-link-indent: 0;
		cursor: pointer;
		a, button {
			cursor: pointer;
			padding: var(--uix-link-padding);
			&:hover {
				color: var(--uix-link-hover-color, var(--color-primary-70));    
			}
		}
		color: var(--uix-link-text-color, var(--color-primary-70));
		font-weight: var(--uix-link-font-weight, 600);
		width: var(--uix-link-width, auto);		
		.uix-text-icon__element {
			display: flex;
			align-items: center;
			gap: var(--uix-link-icon-gap, 0.5rem);
			width: auto;
			&[reverse][vertical] {
				flex-direction: column-reverse;
			}
	
			&:not([reverse])[vertical] {
				flex-direction: column;
			}
	
			&[reverse]:not([vertical]) {
				flex-direction: row-reverse;
			}
	
			&:not([reverse]):not([vertical]) {
				flex-direction: row;
			}
		}
		transition: all 0.3s ease-in-out; 
	}
	
	&[indent] {
		> a, > button {
			padding-left: var(--uix-link-indent);
		}
	}
	
	&[active]:hover {
		color: var(--uix-link-hover-text-color, var(--color-primary-40));
	}
	
	&[selectable][selected] {
		background-color: var(--color-primary-40); 
	}
	
	&:hover {
		[tooltip] {
			display: flex;
		}
	}
	
	&[tooltip] {
		display: inline-block;
		&:hover {
			[tooltip] {
				visibility: visible;
			}
		}
		[tooltip] {
				visibility: hidden;
				width: 120px;
				background-color: black;
				color: #fff;
				text-align: center;
				border-radius: 6px;
				padding: 5px 0;    
				position: absolute;
				z-index: 1000000000;
				top: 50%;
				left: 100%;       
				transform: translateY(-50%);
		}
	}
	
	&[position~="top"] [tooltip] {
		bottom: 100%; 
		left: 50%;
		transform: translateX(-50%); 
	}
	
	&[position~="bottom"] [tooltip] {
		top: 100%; 
		left: 50%;
		transform: translateX(-50%); 
	}
	
	&[position~="left"] [tooltip] {
		top: 50%;
		right: 100%; 
		transform: translateY(-50%);
	}
	
	&[tooltip], &[dropdown], &[context], &[float] {
		position: relative;
	}
	
	&[dropdown], &[accordion] {
		flex-direction: column;
	}
	
	[float], [dropdown], [accordion], [context] {
		display: none;
	}

	&[floatopen] [float] {
		display: block;
		position: absolute;
		top: -50px;
		left: 0px;
		width: 50px;
	}
	
	&[context] {
		z-index: auto;
	}
	
	[dropdown], [context][open] {
		position: absolute;
		left: 0;
		top: 100%; 
		width: 100%;
		min-width: 200px;
		z-index: 1000;
		background-color: var(--color-primary-10); 
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
		.uix-link:hover, input {
			background-color: var(--color-primary-20); 
		}
		& > .uix-link, input {
			width: 100%;
		}
	}
	
	[context][open] {
		display: flex;
	}
	
	&[selected] {
		[dropdown], [accordion] {
			display: flex;
		}
	}`,
	extends: "uix-text",
	properties: {
		content: T.object(),
		context: T.object(), // right-click menu
		external: T.boolean(),
		selectable: T.boolean(),
		skipRoute: T.boolean(),
		variant: T.string({
			theme: ({ value }) => ({
				"--uix-link-bg": `var(--color-${value}-70)`,
				"--uix-link-text-color": `var(--color-${value}-50)`,
				"--uix-link-hover-bg": `var(--color-${value}-60)`,
				"--uix-link-hover-text-color": `var(--color-${value}-50)`,
				"--uix-link-font-weight": "var(--font-weight-semibold, 600)",
			}),
		}),
		hideLabel: T.boolean(),
		indent: T.number({
			theme: ({ value }) => ({
				"--uix-link-indent": `calc(${value} * var(--uix-link-padding, 1rem))`,
			}),
		}),
		accordion: T.boolean(),
		float: T.object(),
		tab: T.boolean(),
		tooltip: T.boolean(),
		dropdown: T.boolean(),
		direction: T.string(),
		name: T.string(),
		alt: T.string(),
		label: T.string(),
		type: T.string(),
		href: T.string(),
		related: T.string(),
		icon: T.string(),
		width: T.string({
			enum: theme.sizes,
			theme: ({ value }) => ({ width: value }),
		}),
		iconSize: T.string({ enum: sizeKeys }),
		size: T.string({ enum: sizeKeys }),
		padding: T.string({ theme: getPadding, enum: theme.spacing }),
		leading: T.string({ enum: sizeKeys }),
		gap: T.string({
			theme: ({ value }) => ({
				"icon-gap": `${value}rem`,
			}),
			enum: GapSizes,
		}),
		active: T.boolean(),
		reverse: T.boolean(),
		vertical: T.boolean(),
		selected: T.boolean(),
		floatOpen: T.boolean(),
		click: T.function(),
		confirmation: T.string(),
	},

	connectedCallback() {
		if (this.context)
			this.addEventListener("contextmenu", this.handleContextMenu);
	},
	defaultOnClick(e) {
		const link = e.currentTarget;
		const localLink =
			this.href && link.origin === window.location.origin && !this.external;
		const isComponent = this.dropdown || this.accordion || this.tab;
		if (!this.href || localLink || isComponent || this.float) {
			e.preventDefault();
		}

		if (this.float) return this.toggleAttribute("floatOpen");

		if (localLink) {
			if (isComponent)
				Router.push([link.pathname, link.search].filter(Boolean).join(""));
			else Router.go([link.pathname, link.search].filter(Boolean).join(""));
			return;
		}
		if (this.click && link.type !== "submit") {
			if (this.confirmation) {
				const prompt = window.confirm(this.confirmation);
				if (prompt) this.click(e);
			} else this.click(e);
		}

		if (this.dropdown) {
			this.q("[dropdown]").toggleAttribute("selected");
			if (this.selected) {
				document.removeEventListener("click", this.handleOutsideClick);
				document.removeEventListener("keydown", this.handleEscKey);
			} else {
				document.addEventListener("click", this.handleOutsideClick);
				document.addEventListener("keydown", this.handleEscKey);
			}
			this.toggleAttribute("selected");
		}
	},

	handleContextMenu(e) {
		e.preventDefault();
		const contextContainer = this.q("[context]");
		if (contextContainer) {
			if (contextContainer.getAttribute("open") === null) {
				document.addEventListener("click", this.handleOutsideClick);
				document.addEventListener("keydown", this.handleEscKey);
			} else {
				document.removeEventListener("click", this.handleOutsideClick);
				document.removeEventListener("keydown", this.handleEscKey);
			}
			contextContainer.toggleAttribute("open");
		}
	},

	disconnectedCallback() {
		if (this.context)
			this.removeEventListener("contextmenu", this.handleContextMenu);
		if (this.dropdown) {
			document.removeEventListener("click", this.handleOutsideClick);
			document.removeEventListener("keydown", this.handleEscKey);
		}
	},

	handleOutsideClick(e) {
		if (
			this.dropdown &&
			(!this.contains(e.target) || this.q("[dropdown]").contains(e.target))
		) {
			this.removeAttribute("selected");
		}
		if (
			this.context &&
			(!this.contains(e.target) || this.q("[context]").contains(e.target))
		) {
			this.q("[context]").removeAttribute("open");
		}
	},

	handleEscKey(e) {
		if (e.key === "Escape") {
			if (this.dropdown) this.removeAttribute("selected");
			if (this.context) this.q("[context]").removeAttribute("open");
		}
	},

	render() {
		return html`<a
							class=${this.icon ? "uix-text-icon__element" : undefined}
							content
							href=${this.href}
							@click=${this.defaultOnClick.bind(this)}
							?reverse=${this.reverse}
							?vertical=${this.vertical}
							related=${this.related}
							name=${this.name || this.label}
							alt=${this.alt || this.label || this.name}
							padding=${this.padding}
							gap=${this.gap}
							type=${this.type}
						>
							${
								this.icon
									? html`<uix-icon
										name=${this.icon}
										alt=${this.alt || this.label || this.name}
										size=${this.iconSize || this.size}
									></uix-icon>`
									: ""
							}
							${this.hideLabel ? null : this.label}
						</a>
						${
							!this.dropdown
								? null
								: html`
					<uix-container dropdown>
						${this.dropdown}
					</uix-container>`
						}
					${
						!this.context
							? null
							: html`
					<uix-container context>
						${this.context}
					</uix-container>`
					}
						${
							!this.accordion
								? null
								: html`
					<uix-container accordion>
						${this.accordion}
					</uix-container>`
						}
					${
						!this.tooltip
							? null
							: html`
					<uix-container tooltip>
						${this.tooltip === true ? this.label : this.tooltip}
					</uix-container>`
					}

						${
							!this.float
								? null
								: html`
					<uix-container float>
						${this.float}
					</uix-container>`
						}
        `;
	},
});

})();
await (async () => {
const { T, html, css } = $APP;

$APP.define("uix-calendar", {
	extends: "uix-container",
	css: css`
	uix-calendar-day {
		margin-inline: auto;
	}
	[calendarDay] {
				cursor: pointer; 
				text-align: center; 
				padding: 0.5rem; 
				background-color: transparent;
				&[toggled] {
					background-color: var(--color-primary-50);
					color: white;
				}
			}`,
	properties: {
		gap: T.string(),
		month: T.number({ defaultValue: new Date().getMonth() }),
		year: T.number({ defaultValue: new Date().getFullYear() }),
		toggledDays: T.array({ defaultValue: [] }),
		dayContent: T.object(),
		habit: T.string(),
	},
	_getCalendarDays(month, year) {
		const days = [];
		const date = new Date(year, month, 1);
		const firstDayIndex = (date.getDay() + 6) % 7;
		const lastDay = new Date(year, month + 1, 0).getDate();

		for (let i = 0; i < firstDayIndex; i++)
			days.push({ day: null, isCurrentMonth: false });

		for (let i = 1; i <= lastDay; i++)
			days.push({
				day: i,
				isCurrentMonth: true,
				date: new Date(year, month, i),
			});

		return days;
	},

	_prevMonth() {
		if (this.month === 0) {
			this.month = 11;
			this.year--;
		} else this.month--;
		this.requestUpdate();
	},

	_nextMonth() {
		if (this.month === 11) {
			this.month = 0;
			this.year++;
		} else this.month++;
		this.requestUpdate();
	},
	render() {
		const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		const calendarDays = this._getCalendarDays(this.month, this.year);
		const headerText = new Intl.DateTimeFormat(undefined, {
			year: "numeric",
			month: "long",
		}).format(new Date(this.year, this.month));
		return html`
      <uix-list horizontal justify="space-between" items="center">
        <uix-icon name="chevron-left" @click=${() => this._prevMonth()}></uix-icon>
        <uix-text weight="bold" center>${headerText}</uix-text>
        <uix-icon name="chevron-right" @click=${() => this._nextMonth()}></uix-icon>
      </uix-list>
      <uix-grid cols="7" gap=${this.gap}>
        ${weekdays.map((day) => html`<uix-text center weight="semibold" size="sm">${day}</uix-text>`)}
        ${calendarDays.map((day) => {
					if (!day.isCurrentMonth) return html`<uix-container></uix-container>`;
					const dateKey = $APP.Date.formatKey(day.date);
					return this.dayContent({
						dateKey,
						toggled: this.toggledDays.includes(dateKey),
						day,
						habit: this.habit,
					});
				})}
      </uix-grid>
    `;
	},
});

})();
await (async () => {
const { T, html, css, theme } = $APP;

$APP.define("uix-modal", {
	css: css`& {
		--uix-modal-background-color: var(--color-default-1, #ffffff);
		--uix-modal-box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		--uix-modal-padding: var(--spacing-sm);
		--uix-modal-dialog-width: var(--sizes-xl);
		--uix-container-height: auto;
		border: 0;   
		dialog {
			&[open] {
				display: flex;
			}			
			position: absolute;
			margin: auto;			
			z-index: 1000; 
			overflow-y: auto;
			box-sizing: border-box; 
			transition: all 0.1s ease-in-out;      
			border: 0;
			background-color: transparent;
			> .uix-card {

			}
		}  
	}`,
	properties: {
		size: T.string({
			theme: ({ value }) => ({
				"--uix-modal-width": theme.getSize(value),
				"--uix-modal-min-height": theme.getSize(value),
			}),
			defaultValue: "lg",
			enum: theme.sizes,
		}),
		variant: T.string({
			theme: ({ value }) => ({
				"--uix-modal-background-color": `var(--color-${value}-1)`,
			}),
			enum: theme.colors,
		}),
		label: T.string(),
		icon: T.string(),
		open: T.boolean({ defaultValue: false }),
		content: T.object(),
		contentFn: T.function(),
		onclose: T.function(),
		cta: T.object(),
	},
	firstUpdated() {
		const firstChild = this.children[0];
		if (firstChild && firstChild.tagName !== "DIALOG")
			firstChild.addEventListener("click", this.show.bind(this));

		this.addEventListener("keydown", this.onKeyDown.bind(this));
		this.addEventListener("click", this.onBackdropClick.bind(this));
	},
	hide() {
		this.querySelector("dialog").close();
		this.open = false;
		if (this.onclose) this.onclose();
	},
	focusFirstInput() {
		const dialog = this.querySelector("dialog");
		const firstInput = dialog.querySelector("input, textarea, select, button");
		if (firstInput) firstInput.focus();
	},
	show(e) {
		this.open = true;
		this.querySelector("dialog").showModal();
		this.focusFirstInput();
		e?.stopPropagation();
	},
	toggle(e) {
		e?.preventDefault();
		this.open ? this.hide() : this.show();
	},
	onKeyDown(e) {
		if (e.key === "Escape") this.hide();
	},
	onBackdropClick(e) {
		if (
			!window.getSelection().toString() &&
			e.target === this.querySelector("dialog")
		)
			this.hide();
	},
	render() {
		return html`<dialog ?open=${this.open}>
									<uix-card variant=${this.variant} size=${this.size} width=${this.size}>
										<uix-container horizontal items="center" width="full" justify="space-between">
												<uix-text grow size="lg" transform="uppercase" weight="semibold" icon=${this.icon}>
														${this.label}
												</uix-text>
												<uix-link @click=${this.hide.bind(this)} icon="x"></uix-link>
										</uix-container>
										${!this.open ? null : (this.content ?? this.contentFn.bind(this)())}
									</uix-card>
								</dialog>
								${!this.cta ? null : html`<uix-container @click=${this.show.bind(this)}>${this.cta}</uix-container>`}
						`;
	},
});

})();
await (async () => {
const { View, T, html } = $APP;

$APP.define("theme-darkmode", {
	extends: "uix-button",
	icons: ["moon", "sun"],
	properties: {
		width: T.string({ defaultValue: "fit" }),
		darkmode: T.boolean({ sync: "local", defaultValue: true }),
	},

	click(e) {
		e.stopPropagation();
		document.documentElement.classList.toggle("dark");
		this.darkmode = !this.darkmode;
		this.icon = !this.darkmode ? "sun" : "moon";
	},

	connectedCallback() {
		this.icon = this.darkmode ? "sun" : "moon";
		if (this.darkmode) document.documentElement.classList.add("dark");
	},
});

})();
await (async () => {
const { html } = $APP;

$APP.define("bundler-button", {
	extends: "uix-modal",
	cta: html`<uix-button icon="file-box"></uix-button>`,
	async bundleAppSPA() {
		await $APP.Controller.backend("BUNDLE_APP_SPA");
	},

	async bundleAppSSR() {
		await $APP.Controller.backend("BUNDLE_APP_SSR");
	},
	contentFn() {
		return html`<uix-list gap="md">
        <uix-button .click=${this.bundleAppSPA.bind(this)} label="Bundle SPA"></uix-button>
        <uix-button .click=${this.bundleAppSSR.bind(this)} label="Bundle SSR"></uix-button>
        <uix-button href="/admin" label="Admin"></uix-button>
      </uix-list>`;
	},
});

})();
await (async () => {
const { html, T } = $APP;

const eventHandlers = {
	SYNC_DATA_OP: ({ payload }) => {
		console.log({ payload });
		$APP.Controller.backend("P2P:LOAD_DATA_OP", payload);
	},
	REQUEST_TO_JOIN: ({ payload, peerId, component }) => {
		const { deviceId } = payload;
		console.log(
			`Received join request from peer ${peerId} with device ID ${deviceId}`,
		);

		const isKnownDevice = component.currentApp?.connections?.some(
			(conn) => conn.deviceId === deviceId,
		);

		if (isKnownDevice) {
			console.log(`Auto-approving known device: ${deviceId}`);
			component.projectRoom.sendEvent({ type: "RECONNECT_APPROVED" }, peerId);
		} else {
			console.log(
				`Device ${deviceId} is not trusted. Awaiting manual approval.`,
			);
			if (component.connectionRequests.some((req) => req.peerId === peerId))
				return;
			component.connectionRequests = [
				...component.connectionRequests,
				{ peerId, deviceId },
			];
		}
	},
	JOIN_APPROVED: async ({ payload, peerId }) => {
		console.log(`Join request approved by ${peerId}. Receiving DB dump.`);
		await $APP.Controller.backend("P2P:JOIN_APP", payload);
		window.location.reload();
	},
	RECONNECT_APPROVED: ({ peerId }) => {
		console.log(`Reconnection approved by ${peerId}.`);
		alert("Reconnected to project successfully!");
	},
	JOIN_DENIED: ({ peerId, component }) => {
		console.log(`Join request denied by ${peerId}.`);
		alert("Your request to join the project was denied. Leaving room.");
		component.projectRoom?.room.leave();
		component.projectRoom = null;
	},
	DATA_OPERATION: ({ payload, peerId }) => {
		console.log(`Received DATA_OPERATION from peer ${peerId}:`, payload);
	},
};

$APP.define("p2p-button", {
	properties: {
		apps: T.array({ defaultValue: [] }),
		currentApp: T.object({ defaultValue: null }),
		projectRoom: T.object(),
		peerCount: T.number({ defaultValue: 0 }),
		connectionRequests: T.array({ defaultValue: [], sync: "local" }),
		joinAppId: T.string({ defaultValue: "" }),
		isLoading: T.boolean({ defaultValue: true }),
	},

	async firstUpdated() {
		this.isLoading = true;
		[this.apps, this.currentApp] = await Promise.all([
			$APP.Controller.backend("LIST_APPS"),
			$APP.Controller.backend("GET_CURRENT_APP"),
		]);
		this.isLoading = false;

		if (this.currentApp?.id && $APP.trystero) {
			this._joinRoom(this.currentApp.id, true);
		}
	},

	_joinRoom(appId, isMember = false) {
		if (!appId || !$APP.trystero) return;
		console.log("JOIN ROOM", appId);
		this.peerCount = 0;
		this.connectionRequests = [];

		const room = $APP.trystero.joinRoom({ appId }, appId);
		const [sendEvent, onEvent] = room.makeAction("event");
		this.sendEvent = sendEvent;
		onEvent((event, peerId) => {
			const handler = eventHandlers[event.type];
			if (handler) {
				handler({ payload: event.payload, peerId, component: this });
			} else {
				console.warn(`No handler found for event type: ${event.type}`);
			}
		});

		room.onPeerJoin((peerId) => {
			this.peerCount = Object.keys(room.getPeers()).length;
			if (!isMember) {
				console.log(`Requesting to join room ${appId}...`);
				sendEvent({
					type: "REQUEST_TO_JOIN",
					payload: { deviceId: $APP.about.device.id },
				});
			}
		});

		room.onPeerLeave((peerId) => {
			this.peerCount = Object.keys(room.getPeers()).length;
			this.connectionRequests = this.connectionRequests.filter(
				(req) => req.peerId !== peerId,
			);
		});

		this.projectRoom = { room, sendEvent, appId };
	},

	async _handleApproveRequest(request) {
		console.log(
			`Approving request for peer ${request.peerId} with device ${request.deviceId}`,
		);

		await $APP.Controller.backend("P2P:REGISTER_PEER_CONNECTION", {
			appId: this.currentApp.id,
			deviceId: request.deviceId,
		});

		const dump = await $APP.Controller.backend("GET_DB_DUMP");
		this.projectRoom.sendEvent(
			{ type: "JOIN_APPROVED", payload: { app: this.currentApp, db: dump } },
			request.peerId,
		);

		if (
			!this.currentApp.connections?.some((c) => c.deviceId === request.deviceId)
		) {
			this.currentApp.connections = [
				...(this.currentApp.connections || []),
				{ deviceId: request.deviceId },
			];
		}

		this.connectionRequests = this.connectionRequests.filter(
			(r) => r.peerId !== request.peerId,
		);
	},

	_handleDenyRequest(request) {
		console.log(`Denying request from ${request.peerId}`);
		this.projectRoom.sendEvent(
			{ type: "JOIN_DENIED", payload: {} },
			request.peerId,
		);
		this.connectionRequests = this.connectionRequests.filter(
			(r) => r.peerId !== request.peerId,
		);
	},

	_handleJoinApp() {
		const appId = this.joinAppId;
		if (appId) {
			this._joinRoom(appId, false);
		}
	},

	async _handleSelectApp(appId) {
		if (appId && appId !== this.currentApp?.id) {
			await $APP.Controller.backend("SELECT_APP", { appId });
			window.location.reload();
		}
	},

	async _handleCreateApp() {
		await $APP.Controller.backend("CREATE_APP");
		window.location.reload();
	},

	_handleSendDataOperation() {
		if (!this.projectRoom || this.peerCount === 0) return;
		const samplePayload = {
			timestamp: Date.now(),
			operation: "CREATE_ITEM",
			data: {
				id: `item-${Math.random().toString(36).substr(2, 9)}`,
				value: "hello world",
			},
		};
		this.projectRoom.sendEvent({
			type: "DATA_OPERATION",
			payload: samplePayload,
		});
	},
	connectedCallback() {
		$APP.p2p.on("SEND_DATA_OP", (payload) => {
			if (this.sendEvent) this.sendEvent({ type: "SYNC_DATA_OP", payload });
		});
		$APP.Controller.backend("START_SYNC_DATA");
	},
	disconnectedCallback() {
		$APP.Controller.backend("STOP_SYNC_DATA");
	},
	render() {
		const isConnected = this.peerCount > 0;
		const statusText = isConnected
			? `Connected to ${this.peerCount} peer(s)`
			: "Offline";

		const modalContent = html`
      <uix-container gap="md">
        <uix-text size="lg">Project ID: <uix-text weight="bold">#${this.currentApp?.id}</uix-text></uix-text>
        <uix-text muted size="sm">Status: ${statusText} <uix-icon name=${isConnected ? "users" : "cloud-off"}></uix-icon></uix-text>
        
        ${
					this.projectRoom
						? html`
          <uix-divider></uix-divider>
          <uix-text type="h6">Test Data Sync</uix-text>
          <uix-button
            label="Send Data Operation"
            icon="send"
            .click=${this._handleSendDataOperation.bind(this)}
            .disabled=${!isConnected}
            title=${!isConnected ? "Must be connected to another peer to send data" : "Send a sample data operation"}
          ></uix-button>
        `
						: ""
				}
        ${
					this.connectionRequests.length > 0
						? html`
          <uix-divider></uix-divider>
          <uix-text type="h6">Connection Requests</uix-text>
          <uix-join vertical>
            ${this.connectionRequests.map(
							(req) => html`
              <uix-card padding="sm">
                <uix-text>Request from: <strong>${req.peerId.slice(0, 8)}...</strong></uix-text>
                <uix-container direction="row" justify="flex-end" gap="sm">
                  <uix-button .click=${() => this._handleDenyRequest(req)} label="Deny" size="xs" variant="danger"></uix-button>
                  <uix-button .click=${() => this._handleApproveRequest(req)} label="Approve" size="xs" variant="success"></uix-button>
                </uix-container>
              </uix-card>
            `,
						)}
          </uix-join>
        `
						: ""
				}

        <uix-divider></uix-divider>
        <uix-text type="h6">My Projects</uix-text>
        ${
					this.isLoading
						? html`<uix-spinner></uix-spinner>`
						: html`
          <uix-list>
            ${this.apps.map(
							(app) => html`
              <uix-button
                .click=${() => this._handleSelectApp(app.id)}
                label=${`Project ${app.id.slice(0, 12)}...`}
                .variant=${app.id === this.currentApp?.id ? "primary" : "default"}
              ></uix-button>
            `,
						)}
          </uix-list>
        `
				}

        <uix-divider></uix-divider>
        <uix-text type="h6">Join a Project</uix-text>
        <uix-join>
          <uix-input
            placeholder="Enter Project ID to join"
            .bind=${this.prop("joinAppId")}            
          ></uix-input>
          <uix-button
            .click=${this._handleJoinApp.bind(this)}
            label="Join"
            icon="log-in"
            .disabled=${!this.joinAppId}
          ></uix-button>
        </uix-join>

        <uix-divider></uix-divider>
        <uix-button .click=${this._handleCreateApp} label="Create New Project" icon="plus" variant="primary"></uix-button>
      </uix-container>
    `;

		return html`
				<uix-modal
          .content=${modalContent}
					.cta=${html`<uix-button icon="wifi"></uix-button>`}
        ></uix-modal>
    `;
	},
});

})();
await (async () => {
const { View, T, theme, css } = $APP;

$APP.define("uix-grid", {
	css: css`
    & {
        display: grid;
        position: relative;
        overflow: auto;        
				--uix-grid-cols: auto-fill;
				--uix-grid-col-size: 1fr;
				--uix-grid-row-size: 1fr;
        grid-template-columns: repeat(var(--uix-grid-cols), var(--uix-grid-col-size));
        grid-auto-rows: var(--uix-grid-row-size);
        gap: var(--uix-grid-gap, 0px);
        padding: var(--uix-grid-gap, 0px);
    }
  `,
	connectedCallback() {
		if (!this.draggable) return;
		this.draggedElement = null;
		this._onDragStart = this._onDragStart.bind(this);
		this._onDragOver = this._onDragOver.bind(this);
		this._onDrop = this._onDrop.bind(this);
		this._onDragEnd = this._onDragEnd.bind(this);
		this.addEventListener("dragstart", this._onDragStart);
		this.addEventListener("dragover", this._onDragOver);
		this.addEventListener("drop", this._onDrop);
		this.addEventListener("dragend", this._onDragEnd);
	},

	disconnectedCallback() {
		if (!this.draggable) return;
		this.removeEventListener("dragstart", this._onDragStart);
		this.removeEventListener("dragover", this._onDragOver);
		this.removeEventListener("drop", this._onDrop);
		this.removeEventListener("dragend", this._onDragEnd);
	},

	_onDragStart(e) {
		const target = e.target.closest("uix-grid-cell");
		if (!target) return;

		this.draggedElement = target;
		setTimeout(() => {
			this.draggedElement.classList.add("dragging");
		}, 0);
	},

	_onDragOver(e) {
		e.preventDefault();
	},

	_onDrop(e) {
		e.preventDefault();
		if (!this.draggedElement) return;
		const rect = this.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const cellSize = 96;
		const newCol = Math.floor((x + this.scrollLeft) / cellSize) + 1;
		const newRow = Math.floor((y + this.scrollTop) / cellSize) + 1;
		if (this.draggedElement.dataset.type === "taskbar") {
			this.draggedElement.setAttribute("row", newRow);
		} else {
			this.draggedElement.setAttribute("col", newCol);
			this.draggedElement.setAttribute("row", newRow);
		}
	},

	_onDragEnd(e) {
		if (!this.draggedElement) return;
		this.draggedElement.classList.remove("dragging");
		this.draggedElement = null;
	},

	properties: {
		draggable: T.boolean(),
		cols: T.string({
			theme: ({ value }) => ({ "--uix-grid-cols": value }),
		}),
		rows: T.string({
			theme: ({ value }) => ({ "--uix-grid-rows": value }),
		}),
		colSize: T.string({
			theme: ({ value }) => ({ "--uix-grid-col-size": value }),
		}),
		fullscreen: T.boolean({
			theme: ({ value }) => {
				return value !== undefined ? { width: "100vw", height: "100vh" } : {};
			},
		}),
		rowSize: T.string({
			theme: ({ value }) => ({ "--uix-grid-row-size": value }),
		}),
		gap: T.string({
			theme: ({ value }) => ({ "--uix-grid-gap": value }),
		}),
	},
});

})();
await (async () => {
const { T, html } = $APP;

$APP.define("uix-calendar-day", {
	extends: "uix-avatar",
	properties: {
		toggled: T.boolean(),
		day: T.object(),
		habit: T.string(),
		dateKey: T.string(),
	},

	render() {
		const { day, dateKey, toggled, habit } = this;
		return html`<uix-link 
										center
										?toggled=${toggled}
										calendarDay
										._data=${{
											model: "checkins",
											method: "add",
										}}
										._map=${{
											habit,
											date: dateKey,
											onclick: toggled ? "$data:remove" : "$data:add",
										}}
									>
										${day.day}
									</uix-link>
									<uix-overlay y="top" x="right">
										<uix-modal
										icon="message" label="Add notes"										
										.cta=${html`<uix-circle color="green" size="xs"
											._map=${{
												_row: `$find:@parent.notes:date=${dateKey}`,
												solid: "$boolean:@id",
											}}
											></uix-circle>`}
										.content=${html`
											<uix-form
												._data=${{
													model: "notes",
													method: "add",
												}}
												._map=${{
													_row: `$find:@parent.notes:date=${dateKey}`,
													habit,
													date: dateKey,
													submit: "$data:upsert",
													submitSuccess: "$closest:uix-modal.hide",
												}}>
												<uix-join>
													<uix-input name="notes" size="xl"
														._map=${{
															_row: `$find:@parent.notes:date=${dateKey}`,
															value: "@notes",
														}}></uix-input>
													<uix-button label="ADD" icon="plus" type="submit" size="xl"></uix-button>
												</uix-join>
											</uix-form>`}>
										</uix-modal>
									</uix-overlay>`;
	},
});

})();
await (async () => {
const { T, css, theme } = $APP;

const RoundedOptions = {
	none: "0px",
	xs: "2px",
	sm: "4px",
	md: "8px",
	lg: "12px",
	xl: "16px",
	"2xl": "24px",
	full: "100%",
};

$APP.define("uix-avatar", {
	extends: "uix-container",
	css: css`
    & {
      --uix-avatar-background-color: var(--color-default-30, #d1d5db);
      --uix-avatar-text: var(--color-default, #000000);
      --uix-avatar-ring: var(--color-default, #000000);
      --uix-avatar-ring-width: 2px;
      --uix-avatar-border-radius: 50%;
      --uix-avatar-width: 3rem;
      --uix-avatar-height: 3rem;
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      color: var(--uix-avatar-text);
      font-size: calc(var(--uix-avatar-width) / 2.5);
      font-weight: 500;
      vertical-align: middle;
			text-align: center; 
			min-width: var(--uix-avatar-width);
			padding: 3px;
    }
		> :not(uix-overlay) {
      width: var(--uix-avatar-width);
      height: var(--uix-avatar-height);
      border-radius: var(--uix-avatar-border-radius);
      background-color: var(--uix-avatar-background-color);
		}

    &[ring] {
      box-shadow: 0 0 0 var(--uix-avatar-ring-width) var(--uix-avatar-ring);
    }
    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }


    > uix-overlay {
      position: absolute;
      z-index: 100;
      --tx: 0;
      --ty: 0;
      transform: translate(var(--tx), var(--ty));
			cursor: pointer; 
			text-align: center; 
			background: transparent;
    }
    > uix-overlay[y="top"] { top: 0%; }
    > uix-overlay[y="bottom"] { bottom: 0%; }
    > uix-overlay[y="center"] { top: 50%; --ty: -50%; }
    > uix-overlay[x="left"] { left: -5%; }
    > uix-overlay[x="right"] { right: 0%; }
    > uix-overlay[x="center"] { left: 50%; --tx: -50%; }
  `,
	properties: {
		size: T.string({
			defaultValue: "md",
			enum: theme.sizes,
			theme: ({ value, options }) => ({
				"--uix-avatar-width": `${options[value] / 10}px`,
				"--uix-avatar-height": `${options[value] / 10}px`,
			}),
		}),
		variant: T.string({
			defaultValue: "default",
			enum: Object.keys(theme.colors),
			theme: ({ value }) => ({
				"--uix-avatar-background-color": `var(--color-${value}-30)`,
				"--uix-avatar-text": `var(--color-${value})`,
				"--uix-avatar-ring": `var(--color-${value})`,
			}),
		}),
		rounded: T.string({
			defaultValue: "full",
			enum: Object.keys(RoundedOptions),
			theme: ({ value }) => ({
				"--uix-avatar-border-radius": RoundedOptions[value],
			}),
		}),
		presence: T.string({
			enum: ["online", "offline"],
			reflect: true,
		}),
		ring: T.boolean({
			defaultValue: false,
			reflect: true,
		}),
	},
});

})();
await (async () => {
const { T } = $APP;

$APP.define("uix-overlay", {
	properties: {
		x: T.string({
			defaultValue: "right",
			reflect: true,
		}),
		y: T.string({
			defaultValue: "bottom",
			reflect: true,
		}),
	},
});

})();
await (async () => {
const { T, css, theme } = $APP;

$APP.define("uix-circle", {
	css: css`
    & {
      /* Default CSS Variables */
      --uix-circle-size: 3rem;
      --uix-circle-border-width: 2px;
      --uix-circle-border-color: var(--color-default, #000000);
      --uix-circle-fill-color: var(--color-primary, #007bff);

      /* Component Styles */
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      width: var(--uix-circle-size);
      height: var(--uix-circle-size);
      border-radius: 50%;
      background-color: transparent; /* Outline by default */
      border-style: solid;
      border-color: var(--uix-circle-border-color);
      border-width: var(--uix-circle-border-width);
    }

    /* Apply fill color when the 'solid' attribute is present */
    &[solid] {
      background-color: var(--uix-circle-fill-color);
    }
  `,

	properties: {
		/**
		 * The fill color of the circle when the 'solid' property is true.
		 */
		color: T.string({
			defaultValue: "primary",
			enum: Object.keys(theme.colors),
			theme: ({ value }) => ({
				"--uix-circle-fill-color": `var(--color-${value})`,
			}),
		}),

		/**
		 * The color of the circle's border.
		 */
		borderColor: T.string({
			defaultValue: "default",
			enum: Object.keys(theme.colors),
			theme: ({ value }) => ({
				"--uix-circle-border-color": `var(--color-${value})`,
			}),
		}),

		size: T.string({
			defaultValue: "3rem",
			theme: ({ value }) => ({
				"--uix-circle-size": theme.getSize(value, "0.1"),
			}),
		}),
		/**
		 * The width of the circle's border. Set to '0' to remove the border.
		 */
		borderSize: T.string({
			defaultValue: "2px",
			theme: ({ value }) => ({
				"--uix-circle-border-width": value,
			}),
		}),

		/**
		 * If true, the circle will have a solid background color. Defaults to false.
		 */
		solid: T.boolean({
			defaultValue: false,
			reflect: true,
		}),
	},
});

})();

	}
)();
