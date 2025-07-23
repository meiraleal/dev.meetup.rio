(async () => {
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

$APP.addModule({ name: "testAssert", dev: true });

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

$APP.addModule({ name: "testMock", dev: true });

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

$APP.addModule({
	name: "mvc",
	modules: ["mvc/view", "mvc/model", "mvc/controller", "app"],
});

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

$APP.addModule({
	name: "html",
	path: "mvc/view/html",
	frontend: true,
});

$APP.addModule({
	name: "directive",
	path: "mvc/view/html/directive",
	frontend: true,
});

$APP.addModule({
	name: "spread",
	path: "mvc/view/html/spread",
	modules: ["mvc/view/html", "mvc/view/html/directive"],
	frontend: true,
});

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

$APP.addModule({
	name: "fonts",
	path: "mvc/view/fonts",
	frontend: true,
	base: [],
});

const getTagProps = async (tag) => {
	return $APP.Backend.requestFromClient("GET_TAG_PROPS", { tag });
};
$APP.addFunctions({ name: "view", functions: { getTagProps } });

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

$APP.addModule({
	name: "indexeddb",
	path: "mvc/model/indexeddb",
	alias: "indexeddb",
	backend: true,
});

const parseBoolean = { true: 1, false: 0 };
const parseBooleanReverse = { true: true, false: false };

async function open(props) {
	const db = Database(props);
	await db.init();
	return db;
}

function Database({ name: dbName, models, version }) {
	let db = null;
	let isConnected = false;
	let connectionPromise = null;
	let dbVersion = Number(version);

	const init = async () => {
		if (connectionPromise) return connectionPromise;

		connectionPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, dbVersion);

			request.onerror = (event) => {
				connectionPromise = null;
				reject(new Error(`Failed to open database: ${event.target.error}`));
			};

			request.onsuccess = (event) => {
				db = event.target.result;
				isConnected = true;

				db.onversionchange = () => {
					if (db) {
						db.close();
						db = null;
						isConnected = false;
						connectionPromise = null;
					}
				};
				resolve(db);
			};

			request.onupgradeneeded = (event) => {
				const currentDb = event.target.result;
				const transaction = event.target.transaction;
				Object.keys(models).forEach((storeName) => {
					if (!currentDb.objectStoreNames.contains(storeName)) {
						createStore(currentDb, storeName);
					} else {
						const objectStore = transaction.objectStore(storeName);
						const storeSchema = models[storeName];
						Object.keys(storeSchema).forEach((field) => {
							if (
								storeSchema[field].index === true &&
								!objectStore.indexNames.contains(field)
							) {
								objectStore.createIndex(field, field, {
									unique: storeSchema[field].unique || false,
									multiEntry: storeSchema[field].type === "array",
								});
							}
						});
					}
				});
			};
		});

		return connectionPromise;
	};

	const close = () => {
		if (db) {
			db.close();
		}
		db = null;
		isConnected = false;
		connectionPromise = null;
	};

	const reload = async (props) => {
		// Block new connections and wait for any pending one to finish.
		if (connectionPromise) {
			await connectionPromise;
		}

		close();

		// Update the version and models before re-initializing.
		dbVersion = props.version;
		models = props.models;
		// The next call to _ensureDb will trigger a fresh init.

		$APP.Backend.broadcast({
			type: "UPDATE_MODELS",
			payload: { models },
		});
		return init();
	};

	// This is the gatekeeper for all database operations.
	const _ensureDb = async () => {
		if (!isConnected || !db) {
			await init();
		}
	};

	const prepareRow = ({ model, row, reverse = false, currentRow = {} }) => {
		const parse = reverse ? parseBooleanReverse : parseBoolean;
		const modelProps = models[model];
		const updatedRow = { ...row };
		Object.keys(modelProps).forEach((prop) => {
			if (prop.relationship && !prop.belongs) return;
			if (row[prop] === undefined && currentRow[prop] !== undefined) {
				updatedRow[prop] = currentRow[prop];
			} else {
				if (modelProps[prop].type === "boolean") {
					updatedRow[prop] = row[prop] ? parse.true : parse.false;
				}
				if (updatedRow[prop] === undefined) delete updatedRow[prop];
			}
		});
		if (reverse) {
			Object.keys(modelProps).forEach((prop) => {
				if (modelProps[prop].type === "boolean") {
					if (updatedRow[prop] === parseBoolean.true) {
						updatedRow[prop] = true;
					} else if (updatedRow[prop] === parseBoolean.false) {
						updatedRow[prop] = false;
					}
				}
			});
		}
		return updatedRow;
	};

	const matchesFilter = (item, filter, modelName) => {
		const modelSchema = models[modelName];
		return Object.entries(filter).every(([key, queryValue]) => {
			const itemValue = item[key];
			const fieldSchema = modelSchema?.[key];
			if (
				typeof queryValue === "object" &&
				queryValue !== null &&
				!Array.isArray(queryValue)
			) {
				return Object.entries(queryValue).every(([operator, operand]) => {
					switch (operator) {
						case "$gt":
							return itemValue > operand;
						case "$gte":
							return itemValue >= operand;
						case "$lt":
							return itemValue < operand;
						case "$lte":
							return itemValue <= operand;
						case "$ne":
							return itemValue != operand;
						case "$in":
							return Array.isArray(operand) && operand.includes(itemValue);
						case "$nin":
							return Array.isArray(operand) && !operand.includes(itemValue);
						case "$contains":
							if (Array.isArray(itemValue)) return itemValue.includes(operand);
							if (typeof itemValue === "string" && typeof operand === "string")
								return itemValue.includes(operand);
							return false;
						default:
							return false;
					}
				});
			}
			if (fieldSchema?.type === "boolean") {
				return Boolean(itemValue) == queryValue;
			}
			if (fieldSchema?.type === "array" && Array.isArray(itemValue)) {
				return itemValue.includes(queryValue);
			}
			return itemValue === queryValue;
		});
	};

	const createStore = (db, storeName) => {
		const storeSchema = models[storeName];
		const objectStore = db.createObjectStore(storeName, {
			keyPath: "id",
			autoIncrement: true,
		});
		Object.keys(storeSchema).forEach((field) => {
			if (
				storeSchema[field].index === true ||
				storeSchema[field].unique === true
			) {
				objectStore.createIndex(field, field, {
					unique: storeSchema[field].unique ?? false,
					multiEntry: storeSchema[field].type === "array",
				});
			}
		});
	};

	const findIndexedProperty = (filter, modelName) => {
		const modelSchema = models[modelName];
		if (!modelSchema || typeof filter !== "object" || filter === null)
			return null;
		for (const key in filter) {
			if (Object.hasOwn(filter, key)) {
				if (modelSchema[key]?.index) {
					return key;
				}
			}
		}
		return null;
	};

	const put = async (model, row, opts = {}) => {
		await _ensureDb();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(model, "readwrite");
			const store = transaction.objectStore(model);
			const request = store.put(
				prepareRow({ model, row, currentRow: opts.currentRow }),
			);
			request.onerror = () =>
				reject(new Error(`Failed to put: ${request.error}`));
			transaction.oncomplete = () => resolve(request.result);
		});
	};

	const getMany = async (
		storeName,
		filter = {},
		{ limit = 0, offset = 0, order = null, keys } = {},
	) => {
		await _ensureDb();
		return new Promise((resolve, reject) => {
			try {
				const transaction = db.transaction(storeName, "readonly");
				const store = transaction.objectStore(storeName);
				const items = [];
				const modelSchema = models[storeName];
				const finishProcessingAndResolve = () => {
					if (order && items.length > 0) {
						const orderArray = Array.isArray(order)
							? order
							: order.split(",").map((item) => item.trim());
						items.sort((a, b) => {
							for (const currentOrder of orderArray) {
								let direction = 1;
								let field = currentOrder;
								if (currentOrder.startsWith("-")) {
									direction = -1;
									field = currentOrder.substring(1).trim();
								} else if (currentOrder.startsWith("+")) {
									field = currentOrder.substring(1).trim();
								}
								const valA = a[field];
								const valB = b[field];
								if (valA === undefined && valB === undefined) return 0;
								if (valA === undefined) return 1 * direction;
								if (valB === undefined) return -1 * direction;
								if (valA < valB) return -1 * direction;
								if (valA > valB) return 1 * direction;
							}
							return 0;
						});
					}
					const sliced =
						limit > 0
							? items.slice(offset, offset + limit)
							: items.slice(offset);
					resolve(
						sliced.map((row) =>
							prepareRow({ model: storeName, row, reverse: true }),
						),
					);
				};
				if (Array.isArray(filter)) {
					const request = store.openCursor();
					request.onerror = () =>
						reject(
							new Error(`Failed to getMany ${storeName}: ${request.error}`),
						);
					request.onsuccess = (event) => {
						const cursor = event.target.result;
						if (cursor) {
							if (
								filter.includes(cursor.key) &&
								(!keys || keys.includes(cursor.key))
							) {
								items.push(cursor.value);
							}
							cursor.continue();
						} else {
							finishProcessingAndResolve();
						}
					};
					return;
				}
				let cursorRequest;
				let useIndex = false;
				const indexedProp = findIndexedProperty(filter, storeName);
				if (indexedProp && Object.keys(filter).length > 0) {
					let queryValue = filter[indexedProp];
					if (modelSchema[indexedProp]?.type === "boolean") {
						queryValue = queryValue ? parseBoolean.true : parseBoolean.false;
					}
					if (queryValue !== undefined) {
						try {
							const index = store.index(indexedProp);
							cursorRequest = index.openCursor(IDBKeyRange.only(queryValue));
							useIndex = true;
						} catch (e) {
							cursorRequest = store.openCursor();
						}
					} else {
						cursorRequest = store.openCursor();
					}
				} else {
					cursorRequest = store.openCursor();
				}
				cursorRequest.onerror = () =>
					reject(
						new Error(`Failed to getMany ${storeName}: ${cursorRequest.error}`),
					);
				cursorRequest.onsuccess = (event) => {
					const cursor = event.target.result;
					if (cursor) {
						const primaryKeyToCheck = useIndex ? cursor.primaryKey : cursor.key;
						if (keys && !keys.includes(primaryKeyToCheck)) {
							cursor.continue();
							return;
						}
						if (matchesFilter(cursor.value, filter, storeName)) {
							items.push(cursor.value);
						}
						cursor.continue();
					} else {
						finishProcessingAndResolve();
					}
				};
			} catch (error) {
				reject(
					new Error(
						`Failed to start transaction: ${error.message}. Query Props: ${JSON.stringify({ storeName, limit, offset, filter, order, keys })}`,
					),
				);
			}
		});
	};

	const get = async (storeName, keyOrFilter) => {
		await _ensureDb();
		return new Promise((resolve, reject) => {
			if (!keyOrFilter) return resolve(null);
			const transaction = db.transaction(storeName, "readonly");
			const store = transaction.objectStore(storeName);
			const modelSchema = models[storeName];
			if (typeof keyOrFilter === "object" && !Array.isArray(keyOrFilter)) {
				const indexedProp = findIndexedProperty(keyOrFilter, storeName);
				let cursorRequest;
				if (indexedProp) {
					let queryValue = keyOrFilter[indexedProp];
					if (modelSchema[indexedProp]?.type === "boolean") {
						queryValue = queryValue ? parseBoolean.true : parseBoolean.false;
					}
					if (queryValue !== undefined) {
						try {
							const index = store.index(indexedProp);
							cursorRequest = index.openCursor(IDBKeyRange.only(queryValue));
						} catch (e) {
							cursorRequest = store.openCursor();
						}
					} else {
						cursorRequest = store.openCursor();
					}
				} else {
					cursorRequest = store.openCursor();
				}
				cursorRequest.onerror = () =>
					reject(new Error(`Failed to get: ${cursorRequest.error}`));
				cursorRequest.onsuccess = (event) => {
					const cursor = event.target.result;
					if (cursor) {
						if (matchesFilter(cursor.value, keyOrFilter, storeName)) {
							resolve(
								prepareRow({
									model: storeName,
									row: cursor.value,
									reverse: true,
								}),
							);
						} else {
							cursor.continue();
						}
					} else {
						resolve(null);
					}
				};
			} else {
				if (Array.isArray(keyOrFilter)) {
					reject(
						new Error("Filter for get must be an object or a primary key."),
					);
					return;
				}
				const request = store.get(keyOrFilter);
				request.onerror = () =>
					reject(new Error(`Failed to get: ${request.error}`));
				request.onsuccess = () =>
					resolve(
						!request.result
							? null
							: prepareRow({
									model: storeName,
									row: request.result,
									reverse: true,
								}),
					);
			}
		});
	};

	const remove = async (storeName, key) => {
		await _ensureDb();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.delete(key);
			request.onerror = () =>
				reject(new Error(`Failed to delete: ${request.error}`));
			request.onsuccess = () => resolve(true);
		});
	};

	const count = async (storeName, { filter = {} } = {}) => {
		await _ensureDb();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(storeName, "readonly");
			const store = transaction.objectStore(storeName);
			if (Object.keys(filter).length === 0) {
				const request = store.count();
				request.onerror = () =>
					reject(new Error(`Failed to count: ${request.error}`));
				request.onsuccess = () => resolve(request.result);
			} else {
				const request = store.openCursor();
				let countNum = 0;
				request.onerror = () =>
					reject(new Error(`Failed to count: ${request.error}`));
				request.onsuccess = (event) => {
					const cursor = event.target.result;
					if (cursor) {
						if (matchesFilter(cursor.value, filter, storeName)) {
							countNum++;
						}
						cursor.continue();
					} else {
						resolve(countNum);
					}
				};
			}
		});
	};

	const isEmpty = async (storeName) => {
		const recordCount = await count(storeName);
		return recordCount === 0;
	};

	const clear = async (storeName) => {
		await _ensureDb();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.clear();
			request.onerror = () =>
				reject(new Error(`Failed to clear: ${request.error}`));
			request.onsuccess = () => resolve();
		});
	};

	const destroy = async () => {
		const dbNameToDelete = dbName;
		close();
		return new Promise((resolve, reject) => {
			const request = indexedDB.deleteDatabase(dbNameToDelete);
			request.onerror = () =>
				reject(new Error(`Failed to delete database: ${request.error}`));
			request.onsuccess = () => resolve();
		});
	};

	const exportStore = async (storeName) => {
		await _ensureDb();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(storeName, "readonly");
			const store = transaction.objectStore(storeName);
			const request = store.getAll();
			request.onerror = () =>
				reject(new Error(`Failed to export: ${request.error}`));
			request.onsuccess = () => {
				const dump = {};
				if (request.result) {
					request.result.forEach((item) => {
						if (["string", "number"].includes(typeof item.id)) {
							dump[item.id] = item;
						}
					});
				}
				resolve(dump);
			};
		});
	};

	const importStore = async (storeName, data) => {
		await _ensureDb();
		if (!Array.isArray(data)) {
			throw new Error("No data provided or data is not an array");
		}
		if (data.length === 0) return Promise.resolve();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			let completed = 0;
			let firstError = null;
			data.forEach((entry) => {
				if (firstError) return;
				const request = store.put(entry);
				request.onerror = () => {
					if (!firstError) {
						firstError = request.error;
						transaction.abort();
						reject(new Error(`Failed to import: ${firstError}`));
					}
				};
				request.onsuccess = () => {
					if (firstError) return;
					completed++;
					if (completed === data.length) {
					}
				};
			});
			transaction.oncomplete = () => {
				if (!firstError) resolve();
			};
			transaction.onerror = () => {
				if (!firstError)
					reject(
						new Error(`Transaction error during import: ${transaction.error}`),
					);
			};
		});
	};

	const transactionWrapper = async (storeNames, mode = "readwrite") => {
		await _ensureDb();
		const idbTransaction = db.transaction(storeNames, mode);
		return {
			transaction: idbTransaction,
			put: (model, row, opts = {}) => {
				return new Promise((resolve, reject) => {
					const store = idbTransaction.objectStore(model);
					const preparedRow = prepareRow({
						model,
						row,
						currentRow: opts.currentRow,
					});
					const request = store.put(preparedRow);
					request.onsuccess = () => resolve(request.result);
					request.onerror = () => reject(request.error);
				});
			},
			remove: (model, id) => {
				return new Promise((resolve, reject) => {
					const store = idbTransaction.objectStore(model);
					const request = store.delete(id);
					request.onsuccess = () => resolve(true);
					request.onerror = () => reject(request.error);
				});
			},
			done: () => {
				return new Promise((resolve, reject) => {
					idbTransaction.oncomplete = () => resolve();
					idbTransaction.onerror = () => reject(idbTransaction.error);
					idbTransaction.onabort = () =>
						reject(idbTransaction.error || new Error("Transaction aborted"));
				});
			},
			abort: () => idbTransaction.abort(),
		};
	};

	return {
		init,
		transaction: transactionWrapper,
		getMany,
		prepareRow,
		put,
		get,
		remove,
		reload,
		count,
		isEmpty,
		clear,
		get db() {
			return db;
		},
		close,
		destroy,
		export: exportStore,
		import: importStore,
		get isConnected() {
			return isConnected;
		},
		get version() {
			return dbVersion;
		},
		name: dbName,
		models,
	};
}
$APP.updateModule({
	name: "indexeddb",
	path: "mvc/model/indexeddb",
	alias: "indexeddb",
	backend: true,
	base: { open },
});

var { T } = $APP;

const isSystem = (model) => !!$APP.sysmodels[model];

$APP.addModule({
	name: "DatabaseExtensions",
	base: $APP.storage.install([]),
});

$APP.addModule({
	name: "availableDatabaseExtensions",
	base: $APP.storage.install({}),
});

const filterExtensionModels = (models, ext) =>
	Object.fromEntries(
		Object.entries(models)
			.filter(([_, schema]) => Object.hasOwn(schema, `$${ext}`))
			.map(([model]) => [model, $APP.availableDatabaseExtensions[ext]]),
	);

const loadDBDump = async (payload) => {
	const { dump } = payload;
	const app = payload.app ?? (await getApp());
	if (!dump) throw "No dump provided";
	if (!app) throw "No app selected";

	for (const [modelName, entries] of Object.entries(dump))
		if ($APP.Model[modelName])
			await $APP.Model[modelName].addMany(entries, { keepIndex: true });

	await $APP.SysModel.edit($APP.settings.sysmodels.APP, {
		id: app.id,
		migrationTimestamp: Date.now(),
	});
};

const createDBDump = async () => {
	const app = await $APP.Backend.getApp();
	const dump = {};
	const modelNames = Object.keys(app.models);

	for (const modelName of modelNames)
		if ($APP.Model[modelName])
			dump[modelName] = await $APP.Model[modelName].getAll({ object: true });

	return dump;
};

const openDatabase = async (props) => {
	let models;
	let version;
	let name;
	let db;
	let system;
	const extdbs = {};
	const stores = {};

	const load = async (props = {}) => {
		if (props.extensions) $APP.DatabaseExtensions.add(...props.extensions);
		if (props.name) name = props.name;
		if (props.models) models = props.models;
		if (props.version) version = props.version;
		system = props.system === true;
		if (db) db.close();
		db = await $APP.indexeddb.open({
			name,
			version,
			models,
		});
		if ($APP.DatabaseExtensions.length && !system) {
			$APP.DatabaseExtensions.forEach(async (ext) => {
				extdbs[ext] = await $APP.indexeddb.open({
					name: `${name}_${ext}`,
					version,
					models: filterExtensionModels(models, ext),
				});
			});
		}
	};

	await load(props);

	const _loadRelationshipsForMany = async (rows, modelName, includes, opts) => {
		if (!rows || rows.length === 0 || !includes || includes.length === 0)
			return;
		const modelDef = models[modelName];
		const idsToFetchByModel = {};
		const relationshipDetails = {};

		for (const relation of includes) {
			const relationDef = modelDef[relation];
			if (!relationDef) continue;
			relationshipDetails[relation] = relationDef;

			const { targetModel, belongs, polymorphic, mixed } = relationDef;

			for (const row of rows) {
				let fkValue = row[relation];

				if (belongs) {
					fkValue = row[relation];
				} else {
					continue;
				}
				if (fkValue === null || fkValue === undefined) continue;

				const addId = (model, id) => {
					if (!idsToFetchByModel[model]) idsToFetchByModel[model] = new Set();
					idsToFetchByModel[model].add(id);
				};

				const processFkValue = (val) => {
					if (polymorphic) {
						if (typeof val === "string") {
							const [polyModel, polyId] = val.split("@");
							if (polyModel && polyId) addId(polyModel, polyId);
						}
					} else if (typeof val === "string") {
						addId(targetModel, val);
					} else if (mixed && typeof val === "object" && val !== null) {
						// Inline object, do nothing
					}
				};
				if (Array.isArray(fkValue)) {
					fkValue.forEach(processFkValue);
				} else {
					processFkValue(fkValue);
				}
			}
		}

		const fetchedItemsByModel = {};
		for (const [modelToFetch, idSet] of Object.entries(idsToFetchByModel)) {
			if (idSet.size > 0) {
				const ids = Array.from(idSet);
				const items = await api.getMany(modelToFetch, ids);
				fetchedItemsByModel[modelToFetch] = items.reduce((acc, item) => {
					acc[item.id] = item;
					return acc;
				}, {});
			}
		}

		for (const row of rows) {
			for (const relation of includes) {
				const relationDef = relationshipDetails[relation];
				if (!relationDef) continue;

				const { targetModel, belongs, polymorphic, mixed, many } = relationDef;
				const transform = opts.transform ?? relationDef.transform;

				if (belongs) {
					const fkValueOnCurrentRow = row[relation];
					if (
						fkValueOnCurrentRow === null ||
						fkValueOnCurrentRow === undefined
					) {
						row[relation] = many ? [] : null;
						continue;
					}

					const stitch = (fk) => {
						let model = targetModel;
						let id = fk;
						if (polymorphic && typeof fk === "string") {
							[model, id] = fk.split("@");
						}
						if (mixed && typeof fk === "object" && fk !== null) return fk;

						const item = fetchedItemsByModel[model]?.[id] ?? null;
						return transform ? transform(item, model) : item;
					};

					if (many) {
						row[relation] = Array.isArray(fkValueOnCurrentRow)
							? fkValueOnCurrentRow.map(stitch).filter(Boolean)
							: [];
					} else {
						row[relation] = stitch(fkValueOnCurrentRow);
					}
				} else {
					// HasOne, HasMany (non-belongs)
					let filter;
					if (polymorphic) {
						const searchPolymorphicId = `${modelName}@${row.id}`;
						const targetFkDef =
							models[targetModel]?.[relationDef.targetForeignKey];
						if (targetFkDef?.many) {
							filter = {
								[relationDef.targetForeignKey]: {
									$contains: searchPolymorphicId,
								},
							};
						} else {
							filter = { [relationDef.targetForeignKey]: searchPolymorphicId };
						}
					} else {
						filter = { [relationDef.targetForeignKey]: row.id };
					}
					row[relation] = await api.getMany(targetModel, filter);
				}
			}
		}
	};

	const api = {
		loadDBDump,
		createDBDump,
		extdbs,
		get db() {
			return db;
		},
		get models() {
			return models;
		},
		get version() {
			return db.version;
		},
		open: openDatabase,
		stores,
		reload: load,
		count: db.count,
		isEmpty: db.isEmpty,
		async put(model, row = {}, opts = {}) {
			const { skipRelationship = false, currentRow = {} } = opts;
			const properties = models[model];
			if (!properties)
				return console.error(
					`Model ${model} not found. current schema version: ${version} / ${db.version}`,
				);
			if (isSystem(model)) {
				try {
					const result = await db.put(model, row);
					if (result) {
						const row = await db.get(model, result);
						return [null, row];
					}
					return [null, null];
				} catch (error) {
					return [error, null];
				}
			}
			const [errors, validatedRow] = T.validateType(row, {
				schema: models[model],
				row: currentRow,
				undefinedProps: !!opts.insert,
				validateVirtual: true,
			});
			if (errors) return [errors, null];
			try {
				if (skipRelationship) {
					await db.put(model, validatedRow, opts);
					return [null, validatedRow];
				}
				const storesToTransact = [model];
				const relationships = Object.keys(properties).filter((prop) => {
					const propDef = properties[prop];
					const bool =
						propDef.targetModel &&
						propDef.relationship &&
						validatedRow[prop] !== undefined &&
						validatedRow[prop] !== null;
					if (bool && !storesToTransact.includes(propDef.targetModel)) {
						if (propDef.polymorphic) {
						} else storesToTransact.push(propDef.targetModel);
					}
					return bool;
				});
				const id = validatedRow.id || row.id;
				const updates = [];
				for (const propKey of relationships) {
					const prop = properties[propKey];
					let relatedValue = validatedRow[propKey];
					if (prop.many && Array.isArray(relatedValue)) {
						const newFkArray = [];
						for (const item of relatedValue) {
							if (
								typeof item === "string" ||
								(prop.mixed && typeof item === "object" && item !== null)
							) {
								newFkArray.push(item);
							} else {
								const childModel = prop.targetModel;
								if (models[childModel]) {
									const newChildRow = { ...item };
									if (!newChildRow.id)
										newChildRow.id = $APP.Backend.generateId();

									updates.push([childModel, newChildRow]);
									if (!storesToTransact.includes(childModel))
										storesToTransact.push(childModel);

									const idToStore = prop.polymorphic
										? `${childModel}@${newChildRow.id}`
										: newChildRow.id;
									newFkArray.push(idToStore);
								}
							}
						}
						validatedRow[propKey] = newFkArray;
						relatedValue = newFkArray;
					}

					if (!models[prop.targetModel] && !prop?.polymorphic) {
						console.error(
							`ERROR: couldn't find target model '${prop.targetModel}' for relationship '${propKey}' on model '${model}'`,
						);
						continue;
					}
					const fkProp = models[prop.targetModel]?.[prop.targetForeignKey]; // Definition of the FK field on the target model
					if (!fkProp) {
						if (!prop.belongs) {
							console.warn(
								`WARN: couldn't find target foreign key '${prop.targetForeignKey}' in model '${prop.targetModel}' for relationship '${propKey}' from '${model}'. This might be a one-way definition or configuration issue.`,
							);
						}
						continue;
					}
					if (fkProp.belongs) {
						// The target model's specified FK field is a "belongsTo" or "belongsToMany" type
						const effectiveFkId = fkProp.polymorphic ? `${model}@${id}` : id;
						const targetIsMany = fkProp.many; // Does the target's FK field hold multiple references?

						if (targetIsMany) {
							// e.g., Post.tags (fkProp) is an array, and one of them is this 'model@id'
							const fks = Array.isArray(relatedValue)
								? relatedValue
								: [relatedValue];
							if (fks.length) {
								const targets = await api.getMany(
									prop.targetModel,
									fks.map((fk) => (fk && typeof fk === "object" ? fk.id : fk)),
								);
								targets.forEach((target) => {
									if (target) {
										const fk = target[prop.targetForeignKey];
										if (!fk) target[prop.targetForeignKey] = [effectiveFkId];
										else if (!fk.includes(effectiveFkId))
											fk.push(effectiveFkId);
										updates.push([prop.targetModel, target]);
									}
								});
							}
						} else {
							// e.g., Profile.user (fkProp) is a single ID, and it's this 'model@id'
							const targetId =
								typeof relatedValue === "string"
									? relatedValue
									: relatedValue?.id;
							if (targetId) {
								const target = await api.get(prop.targetModel, targetId);
								if (target) {
									// Ensure target exists
									target[prop.targetForeignKey] = effectiveFkId;
									updates.push([prop.targetModel, target]);
								}
							}
						}
					}
					if (!prop.belongs && !properties[propKey]?.polymorphic) {
						delete validatedRow[propKey];
					}
				}

				updates.push([model, validatedRow]);
				const tx = await db.transaction(storesToTransact);
				const relatedPuts = updates.map(([m, r]) => tx.put(m, r));
				await Promise.all(relatedPuts);
				await tx.done();
				return [null, validatedRow];
			} catch (error) {
				console.error("Error in put operation:", error, {
					model,
					row,
					models,
					version,
				});
				return [error, null];
			}
		},
		async get(model, filter, opts = {}) {
			if (!filter) return null;
			const { insert = false, includes = [], recursive = null } = opts;
			let row = await db.get(model, filter);
			if (!row && !insert) return null;
			if (!row && insert) {
				const [error, newRow] = await api.add(
					model,
					typeof filter === "object" ? filter : { id: filter },
					{
						skipRelationship: true,
						...(typeof filter !== "object" && {
							overrideId: true,
							keepIndex: true,
						}),
					},
				);
				if (error) {
					console.error("Failed to insert record in get():", error);
					return null;
				}
				row = newRow;
			}
			if (row && includes.length) {
				// REFACTOR: Use the new batched loader
				await _loadRelationshipsForMany([row], model, includes, opts);
			}

			// REFACTOR: START - Recursive loading logic
			if (row && recursive) {
				const visited = new Set();
				let itemsToProcess = [row];
				const relationName = recursive;
				while (itemsToProcess.length > 0) {
					const currentBatch = [];
					// Add to visited set and prepare batch for relationship loading
					for (const item of itemsToProcess) {
						const modelForVisitor = item._modelName || model; // Use injected modelName or default
						const visitedKey = `${modelForVisitor}@${item.id}`;
						if (!visited.has(visitedKey)) {
							visited.add(visitedKey);
							currentBatch.push(item);
						}
					}

					if (currentBatch.length === 0) break;

					// Use the efficient batch loader for the recursive relationship
					await _loadRelationshipsForMany(
						currentBatch,
						model,
						[relationName],
						opts,
					);

					// Gather the next level of items to process
					itemsToProcess = [];
					for (const item of currentBatch) {
						const children = item[relationName];
						if (Array.isArray(children)) {
							children.forEach((child) => {
								if (child) {
									// Inject model name for the next iteration's visitor key
									const relDef = models[model][relationName];
									if (relDef) child._modelName = relDef.targetModel;
									itemsToProcess.push(child);
								}
							});
						} else if (children) {
							const relDef = models[model][relationName];
							if (relDef) children._modelName = relDef.targetModel;
							itemsToProcess.push(children);
						}
					}
				}
			}
			return row;
		},
		async getMany(model, filter, opts = {}) {
			const { limit, offset, order, includes = [], recursive = null } = opts;
			let items;
			if (Array.isArray(filter)) {
				items = (
					await Promise.all(filter.map((id) => db.get(model, id)))
				).filter((item) => item !== null);
			} else {
				items = await db.getMany(model, filter, {
					limit,
					offset,
					order,
				});
			}

			if (includes.length && items.length)
				await _loadRelationshipsForMany(items, model, includes, opts);

			if (recursive && items.length) {
				const visited = new Set();
				let itemsToProcess = [...items];
				const relationName = recursive;

				while (itemsToProcess.length > 0) {
					const currentBatch = [];
					for (const item of itemsToProcess) {
						const modelForVisitor = item._modelName || model;
						const visitedKey = `${modelForVisitor}@${item.id}`;
						if (!visited.has(visitedKey)) {
							visited.add(visitedKey);
							currentBatch.push(item);
						}
					}

					if (currentBatch.length === 0) break;

					const batchModelName = currentBatch[0]._modelName || model;
					await _loadRelationshipsForMany(
						currentBatch,
						batchModelName,
						[relationName],
						opts,
					);

					itemsToProcess = [];
					for (const item of currentBatch) {
						const children = item[relationName];
						const relDef = models[batchModelName][relationName];
						if (Array.isArray(children)) {
							children.forEach((child) => {
								if (child) {
									if (relDef) child._modelName = relDef.targetModel;
									itemsToProcess.push(child);
								}
							});
						} else if (children) {
							if (relDef) children._modelName = relDef.targetModel;
							itemsToProcess.push(children);
						}
					}
				}
			}

			if (!limit) return items;

			const count = await db.count(
				model,
				Array.isArray(filter) ? { id: { $in: filter } } : filter,
			);
			return { count, limit, offset, items };
		},
		async remove(model, id, opts = {}) {
			const properties = models[model];
			if (!properties) {
				console.error(`Model ${model} not found for removal.`);
				return false;
			}
			const row = await api.get(model, id);
			if (!row) return false;
			const relationships = Object.keys(properties).filter(
				(prop) => properties[prop].targetModel && properties[prop].relationship,
			);
			const storesToTransact = [model];
			const updates = [];

			if (relationships.length > 0) {
				for (const propKey of relationships) {
					const propDef = properties[propKey];
					if (!propDef.targetModel || !propDef.targetForeignKey) continue;

					if (!storesToTransact.includes(propDef.targetModel)) {
						if (propDef.polymorphic) {
						} else storesToTransact.push(propDef.targetModel);
					}

					const targetModelName = propDef.targetModel;
					const fkFieldNameOnTarget = propDef.targetForeignKey;
					const fkFieldDefOnTarget =
						models[targetModelName]?.[fkFieldNameOnTarget];

					if (!fkFieldDefOnTarget) continue;

					if (fkFieldDefOnTarget.belongs) {
						const valueToRemove = fkFieldDefOnTarget.polymorphic
							? `${model}@${id}`
							: id;
						let filterForTargets;

						if (fkFieldDefOnTarget.many) {
							filterForTargets = {
								[fkFieldNameOnTarget]: { $contains: valueToRemove },
							};
						} else filterForTargets = { [fkFieldNameOnTarget]: valueToRemove };

						const targetsToUpdate = await api.getMany(
							targetModelName,
							filterForTargets,
						);

						targetsToUpdate.forEach((target) => {
							let newFkValue;
							if (fkFieldDefOnTarget.many) {
								newFkValue = (target[fkFieldNameOnTarget] || []).filter(
									(entry) => entry !== valueToRemove,
								);
							} else {
								newFkValue = null;
							}
							updates.push([
								targetModelName,
								{ ...target, [fkFieldNameOnTarget]: newFkValue },
							]);
						});
					}
				}
			}
			try {
				const tx = await db.transaction(storesToTransact);
				const relatedPuts = updates.map(([targetModel, targetRow]) =>
					tx.put(targetModel, targetRow),
				);
				const mainRemove = tx.remove(model, id);
				await Promise.all([...relatedPuts, mainRemove]);
				await tx.done();
				const system = isSystem(model);
				[`ModelRemoveRecord-${model}`, "onRemoveRecord"].forEach((event) =>
					$APP.hooks.run(event, {
						model,
						opts,
						id,
						system,
						row,
						db: api,
						extensions: Object.keys(models[model])
							.filter((prop) => prop[0] === "$")
							.map((prop) => prop.slice(1)),
					}),
				);
				return true;
			} catch (error) {
				console.error(
					"Failed to remove record or update relationships:",
					error,
					{ model, id },
				);
				return false;
			}
		},
		async removeMany(model, filter, opts = {}) {
			if (!filter && opts.filter) filter = opts.filter;
			const entries = Array.isArray(filter)
				? filter.map((item) => (typeof item === "object" ? item.id : item))
				: (await db.getMany(model, filter)).map((entry) => entry.id);
			return Promise.all(
				entries
					.filter(Boolean)
					.map((entryId) => api.remove(model, entryId, opts)),
			);
		},
		async edit(model, row, _opts = {}) {
			if (!row || !row.id) {
				console.error("Edit operation requires a row with an ID.", {
					model,
					row,
				});
				return {
					errors: { id: "ID is required for edit." },
					model,
					row,
					opts: _opts,
				};
			}
			const opts = {
				..._opts,
				update: true,
				currentRow:
					_opts.currentRow ?? (await api.get(model, row.id, { includes: [] })),
			};
			if (!opts.currentRow) {
				console.warn(`Record not found for edit: ${model} with id ${row.id}`);
				return { errors: { record: "Record not found." }, model, row, opts };
			}
			const [errors, patchResult] = await api.put(
				model,
				{ ...opts.currentRow, ...row },
				opts,
			);

			if (errors) return { errors, model, row, opts };
			const system = isSystem(model);
			[`ModelEditRecord-${model}`, "onEditRecord"].forEach((event) =>
				$APP.hooks.run(event, {
					row,
					model,
					system,
					opts,
					db: api,
					extensions: Object.keys(models[model])
						.filter((prop) => prop[0] === "$")
						.map((prop) => prop.slice(1)),
				}),
			);
			return patchResult;
		},
		async editMany(model, rows, opts = {}) {
			if (!rows?.length) return [];
			const results = await Promise.allSettled(
				rows.map(async (row) => {
					if (row?.id) return api.edit(model, row, opts);
					return { errors: { id: "Row or ID missing for editMany" }, row };
				}),
			);
			return results;
		},
		async editAll(model, filter, updates, opts = {}) {
			const rows = await db.getMany(model, filter, {
				...opts,
			});
			const results = await Promise.allSettled(
				rows.map((row) =>
					api.edit(model, { ...row, ...updates }, { ...opts, currentRow: row }),
				),
			);
			return results;
		},
		async add(model, row, opts = {}) {
			const newRow = { ...row };
			const system = isSystem(model);
			if ((!system && !opts.keepIndex && !opts.overrideId) || !newRow.id) {
				newRow.id = $APP.Backend.generateId();
			}
			const [errors, resultRow] = await api.put(model, newRow, {
				...opts,
				insert: true,
			});
			if (errors) return { errors, model, row: newRow, opts };
			[`ModelAddRecord-${model}`, "onAddRecord"].forEach((event) =>
				$APP.hooks.run(event, {
					model,
					row: resultRow,
					system,
					opts,
					db: api,
					extensions: Object.keys(models[model])
						.filter((prop) => prop[0] === "$")
						.map((prop) => prop.slice(1)),
				}),
			);

			return resultRow;
		},
		async addMany(model, rows = [], opts = {}) {
			const results = await Promise.allSettled(
				rows.map((row) => api.add(model, row, opts)),
			);
			return results;
		},
	};
	return api;
};

(async () => {
	if ($APP.setLibrary && $APP.settings?.sysmodels?.APP && $APP.sysmodels) {
		$APP.setLibrary({
			name: "sysmodel",
			alias: "SysModel",
			base: await openDatabase({
				name: $APP.settings.sysmodels.APP,
				version: 1,
				models: $APP.sysmodels,
				system: true,
			}),
		});
	}

	if ($APP.hooks && $APP.setLibrary && $APP.Backend) {
		$APP.hooks.add("backendStarted", async ({ app, models }) => {
			if (!app || !models) {
				console.error(
					"backendStarted hook called with invalid app or models.",
					{ app, models },
				);
				return;
			}

			$APP.updateModule({
				name: "database",
				path: "mvc/model/database",
				alias: "Database",
				base: await openDatabase({
					name: app.id,
					version: app.version,
					extensions: app.extensions,
					system: false,
					models: { ...models, ...(app.models || {}) },
				}),
			});
		});
	}
})();

$APP.addModule({
	name: "databaseMetadata",
	path: "mvc/model/metadata",
	backend: true,
});

$APP.availableDatabaseExtensions.set("metadata", {
	createdAt: T.string({ index: true }).$,
	updatedAt: T.string({ index: true }).$,
	createdBy: T.string({ index: true }).$,
	updatedBy: T.string({ index: true }).$,
});

$APP.updateModule({
	name: "databaseMetadata",
	path: "mvc/model/metadata",
	hooks: {
		onAddRecord({ model, row, system, extensions }) {
			if (system || !$APP.Database.extdbs || !extensions.includes("metadata"))
				return;
			const db = $APP.Database.extdbs.metadata;
			if (!db) return console.error("Metadata database instance not active.");
			db.put(model, {
				id: row.id,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			});
		},

		async onEditRecord({ model, row, system, extensions }) {
			console.log(
				{ extensions, system },
				$APP.Database.extdbs || !extensions.includes("metadata"),
			);
			if (system || !$APP.Database.extdbs || !extensions.includes("metadata"))
				return;
			const db = $APP.Database.extdbs.metadata;
			if (!db) return console.error("Metadata database instance not active.");
			const metadataRow = await db.get(model, row.id);
			metadataRow.updatedAt = Date.now();
			db.put(model, metadataRow);
		},

		onRemoveRecord({ model, id, system, extensions }) {
			if (system || !$APP.Database.extdbs || !extensions.includes("metadata"))
				return;
			const db = $APP.Database.extdbs.metadata;
			if (!db) return console.error("Metadata database instance not active.");
			db.remove(model, id);
		},
	},
});

$APP.addModule({
	name: "databaseOperations",
	path: "mvc/model/operations",
	backend: true,
});

$APP.availableDatabaseExtensions.set("operations", {
	createdAt: T.string({ index: true }).$,
	removedAt: T.string().$,
	rowId: T.string({ index: true }).$,
	row: T.object().$,
});

$APP.updateModule({
	name: "databaseOperations",
	path: "mvc/model/operations",
	hooks: {
		onAddRecord({ model, row, system, extensions }) {
			if (system || !$APP.Database.extdbs || !extensions.includes("operations"))
				return;
			const db = $APP.Database.extdbs.operations;
			if (!db) return console.error("Operations database instance not active.");
			db.put(model, {
				timestamp: Date.now(),
				row,
			});
		},

		async onEditRecord({ model, row, system, extensions }) {
			if (system || !$APP.Database.extdbs || !extensions.includes("operations"))
				return;
			const db = $APP.Database.extdbs.operations;
			if (!db) return console.error("Operations database instance not active.");
			db.put(model, {
				timestamp: Date.now(),
				rowId: id,
				row,
			});
		},

		onRemoveRecord({ model, id, system, extensions }) {
			if (system || !$APP.Database.extdbs || !extensions.includes("operations"))
				return;
			const db = $APP.Database.extdbs.operations;
			if (!db) return console.error("Operations database instance not active.");
			db.put(model, {
				timestamp: Date.now(),
				removedAt: Date.now(),
				rowId: id,
			});
		},
	},
});

const queryModelEvents = {
	DISCONNECT: (_, { port }) => port.removePort(),
	CREATE_REMOTE_WORKSPACE: async ({ payload }, { importDB }) =>
		importDB(payload),
	ADD_REMOTE_USER: async ({ payload }) => $APP.Backend.createUserEntry(payload),
	ADD: async ({ payload, respond }) => {
		const response = await $APP.Database.add(
			payload.model,
			payload.row,
			payload.opts,
		);
		respond(response);
	},
	ADD_MANY: async ({ payload, respond }) => {
		const response = await $APP.Database.addMany(
			payload.model,
			payload.rows,
			payload.opts,
		);
		respond({ success: true, results: response });
	},
	REMOVE: async ({ payload, respond }) => {
		const response = await $APP.Database.remove(
			payload.model,
			payload.id,
			payload.opts,
		);
		respond(response);
	},
	REMOVE_MANY: async ({ payload, respond }) => {
		const response = await $APP.Database.removeMany(
			payload.model,
			payload.ids,
			payload.opts,
		);
		respond({ success: true, results: response });
	},
	EDIT: async ({ payload, respond }) => {
		const response = await $APP.Database.edit(
			payload.model,
			payload.row,
			payload.opts,
		);
		respond(response);
	},
	EDIT_MANY: async ({ payload, respond }) => {
		const response = await $APP.Database.editMany(
			payload.model,
			payload.rows,
			payload.opts,
		);
		respond({ success: true, results: response });
	},
	GET: async ({ payload, respond }) => {
		const { id, model, opts = {} } = payload;
		const response = await $APP.Database.get(
			model,
			id ??
				(opts.filter &&
					((typeof opts.filter === "string" && JSON.parse(opts.filter)) ||
						opts.filter)),
			opts,
		);
		respond(response);
	},
	GET_MANY: async ({ payload: { model, opts = {} }, respond } = {}) => {
		const response = await $APP.Database.getMany(model, opts.filter, opts);
		respond(response);
	},
};

$APP.events.set(queryModelEvents);

const request = (action, modelName, payload = {}) => {
	return new Promise((resolve) => {
		const event = queryModelEvents[action];
		if (event && typeof event === "function") {
			event({
				respond: resolve,
				payload: {
					model: modelName,
					...payload,
				},
			});
		} else resolve({ success: false, error: `Action "${action}" not found.` });
	});
};

const syncRelationships = ({ model, row }) => {
	if (!row) return;

	const props = $APP.models[model];
	const relationships = Object.entries(props).filter(
		([, prop]) => prop.belongs && prop.targetModel !== "*",
	);

	if (!relationships.length) return;

	relationships.forEach(([key, prop]) => {
		if (row[key]) {
			$APP.Backend.broadcast({
				type: "REQUEST_DATA_SYNC",
				payload: {
					key: `get:${row[key]}`,
					model: prop.targetModel,
					data: undefined,
				},
			});
		}
	});
};

const handleExtensions = ({ row, db, model }) => {
	if (!row.models) return;
	const currentExtensions = new Set(row.extensions || []);
	const foundExtensions = new Set();
	Object.values(row.models).forEach((modelSchema) =>
		Object.keys(modelSchema).forEach((prop) => {
			if (prop.startsWith("$")) {
				foundExtensions.add(prop.slice(1));
			}
		}),
	);
	const newExtensions = [...foundExtensions].filter(
		(ext) => !currentExtensions.has(ext),
	);

	if (newExtensions.length === 0) return;

	console.log(`New extensions found: ${newExtensions.join(", ")}`);

	newExtensions.forEach((extensionName) => {
		console.log(`Initializing extension: ${extensionName}`);
		$APP.DatabaseExtensions.add(extensionName);
	});

	const allExtensions = [...currentExtensions, ...newExtensions];
	db.edit(model, { ...row, extensions: allExtensions });
};

$APP.updateModule({
	name: "model",
	alias: "Model",
	functions: { request },
	hooks: {
		"ModelAddRecord-App": handleExtensions,
		"ModelEditRecord-App": handleExtensions,

		onAddRecord({ model, row, system }) {
			if (system) return;
			$APP.Backend.broadcast({
				type: "REQUEST_DATA_SYNC",
				payload: { key: `get:${row.id}`, model, data: row },
			});
			syncRelationships({ model, row });
		},

		onEditRecord({ model, row, system }) {
			if (system) return;
			$APP.Backend.broadcast({
				type: "REQUEST_DATA_SYNC",
				payload: { key: `get:${row.id}`, model, data: row },
			});
			syncRelationships({ model, row });
		},

		onRemoveRecord({ model, row, id, system }) {
			if (system) return;
			$APP.Backend.broadcast({
				type: "REQUEST_DATA_SYNC",
				payload: { key: `get:${id}`, model, data: undefined },
			});
			syncRelationships({ model, row });
		},
	},
});

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

const generateId = (() => {
	let lastTimestamp = 0;
	let sequentialCounter = 0;
	return () => {
		let now = Date.now();
		if (now > lastTimestamp) {
			sequentialCounter = 0;
		} else {
			sequentialCounter++;
			now += sequentialCounter;
		}
		lastTimestamp = now;
		return now.toString();
	};
})();

let nextRequestId = 1;
const pendingRequests = {};
const pendingBackendRequests = {};
const requestFromClient = async (type, payload, timeout = 5000) => {
	const clients = await self.clients.matchAll({
		type: "window",
		includeUncontrolled: true,
	});
	const client = clients[0]; // Simple strategy: pick the first client.

	if (!client) {
		return Promise.reject(
			new Error("No active client found to send request to."),
		);
	}

	const eventId = `backend-request-${nextRequestId++}`;

	return new Promise((resolve, reject) => {
		pendingBackendRequests[eventId] = { resolve, reject };
		setTimeout(() => {
			delete pendingBackendRequests[eventId];
			reject(new Error(`Request timed out after ${timeout}ms`));
		}, timeout);
		client.postMessage({
			type,
			payload,
			eventId,
		});
	});
};

const handleMessage = async (event) => {
	const { events } = $APP;
	const { type, payload, connection, eventId } = event.data;
	if (pendingBackendRequests[eventId]) {
		const promise = pendingBackendRequests[eventId];
		promise.resolve(payload);
		delete pendingBackendRequests[eventId];
		return;
	}

	if (connection) {
		if (!pendingRequests[eventId]) {
			$APP.mv3.postMessage(event.data, connection);
			pendingRequests[eventId] = event.source;
		} else pendingRequests[eventId].postMessage(event.data);
		return;
	}

	const handler = events[type];
	const client = event.source;
	if (!handler) return;

	const respond = (responsePayload = {}) => {
		client.postMessage({
			eventId,
			payload: responsePayload,
		});
	};
	await handler({
		payload,
		eventId,
		respond,
		client: createClientProxy(client),
		broadcast,
	});
};

const createClientProxy = (client) => {
	return new Proxy(
		{},
		{
			get: (target, prop) => {
				return (payload) => sendRequestToClient(client, prop, payload);
			},
		},
	);
};

const sendRequestToClient = (client, type, payload) => {
	const eventId = `sw_${nextRequestId++}`;
	return new Promise((resolve, reject) => {
		pendingBackendRequests[eventId] = { resolve, reject };
		client.postMessage({ type, payload, eventId });
	});
};

const broadcast = async (params) => {
	const clients = await self.clients.matchAll({
		type: "window",
		includeUncontrolled: true,
	});
	clients.forEach((client) => client.postMessage(params));
};

function createModelAdder({ $APP, getApp, debounceDelay = 50 }) {
	let debounceTimer;

	const processModelAdditions = async () => {
		$APP.log(`Batch processing ${$APP.dynamicModels.length} model(s)...`);

		try {
			const { SysModel } = $APP;
			const app = await getApp();
			const newVersion = app.version + 1;
			await SysModel.edit($APP.settings.sysmodels.APP, {
				id: app.id,
				models: $APP.models,
				version: newVersion,
			});
			$APP.log(
				`Batch add successful. ${$APP.dynamicModels.length} model(s) added. App version is now ${newVersion}.`,
			);

			await $APP.Database.reload({
				models: $APP.models,
				version: newVersion,
			});

			if ($APP.dynamicData.length)
				await migrateData(Object.fromEntries($APP.dynamicData), true);
		} catch (error) {
			console.error("Failed to process model additions batch:", error);
		}
	};

	$APP.addModule({ name: "dynamicModels", base: [] });
	$APP.addModule({ name: "dynamicData", base: [] });

	return function addModel({ name, schema }) {
		if (!$APP.dynamicModels.includes(name)) $APP.dynamicModels.add(name);
		if (!name || !schema)
			throw new Error("A model 'name' and 'schema' are required.");
		$APP.log(`Model "${name}" queued for addition.`);
		$APP.models.set({ [name]: schema });
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(processModelAdditions, debounceDelay);
	};
}

const createAppEntry = async ({
	timestamp = Date.now(),
	id = timestamp.toString(),
	models = $APP.models,
	version = 1,
} = {}) => {
	const app = {
		id,
		version,
		active: true,
		models,
	};
	await $APP.SysModel.add($APP.settings.sysmodels.APP, app);
	$APP.hooks.run("appCreated", {
		app,
	});
	return app;
};

async function generateKeyPair() {
	const keyPair = await self.crypto.subtle.generateKey(
		{
			name: "RSA-OAEP",
			modulusLength: 2048,
			publicExponent: new Uint8Array([1, 0, 1]),
			hash: "SHA-256",
		},
		true,
		["encrypt", "decrypt"],
	);

	const publicKey = await self.crypto.subtle.exportKey(
		"spki",
		keyPair.publicKey,
	);
	const privateKey = await self.crypto.subtle.exportKey(
		"pkcs8",
		keyPair.privateKey,
	);

	return {
		publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
		privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
	};
}

const createUserEntry = async ({ app: _app, device, user } = {}) => {
	const app = _app || (await $APP.Backend.getApp());
	if (!user) {
		const existingUser = await $APP.SysModel.get($APP.settings.sysmodels.USER, {
			active: true,
			appId: app.id,
		});

		if (existingUser) {
			existingUser.privateKey = null;
			const existingDevice = await $APP.SysModel.get(
				$APP.settings.sysmodels.DEVICE,
				{
					userId: existingUser.id,
					active: true,
				},
			);
			if (!existingDevice)
				await $APP.SysModel.add($APP.settings.sysmodels.DEVICE, device);
			return existingUser;
		}
	}

	const { publicKey, privateKey } = await generateKeyPair();
	const newUser = user || {
		id: user?.id || generateId(),
		name: user?.name || "Local User",
		publicKey,
		privateKey,
		appId: app.id,
		active: true,
	};
	await $APP.SysModel.add($APP.settings.sysmodels.USER, newUser);

	const newDevice = device || {
		userId: newUser.id,
		appId: app.id,
		active: true,
	};
	await $APP.SysModel.add($APP.settings.sysmodels.DEVICE, newDevice);
	newUser.privateKey = null;
	return newUser;
};

const getApp = async () => {
	return await $APP.SysModel.get($APP.settings.sysmodels.APP, {
		active: true,
	});
};

const getUser = async (_app) => {
	const app = _app || (await $APP.Backend.getApp());
	// Reset cached user if the app context has changed
	if ($APP.Backend.user && $APP.Backend.user.appId !== app.id) {
		$APP.Backend.user = null;
	}

	if (!$APP.Backend.user) {
		let puser = await $APP.SysModel.get($APP.settings.sysmodels.USER, {
			appId: app.id, // Ensure we get user for the correct app
			active: true,
		});
		if (!puser)
			puser = await $APP.Backend.createUserEntry({
				app,
			});
		const { privateKey, active, ...user } = puser;
		$APP.Backend.user = user;
	}
	return $APP.Backend.user;
};

const getDevice = async ({ app: _app, user: _user } = {}) => {
	const app = _app || (await $APP.Backend.getApp());
	const user = _user || (await $APP.Backend.getUser(app));
	if (!user) throw new Error("User not found");
	const device = await $APP.SysModel.get($APP.settings.sysmodels.DEVICE, {
		userId: user.id,
		active: true,
	});
	return device || null;
};

const migrateData = async (_data, skipDynamicCheck = false) => {
	const data = _data ?? $APP.data;
	const { SysModel, Model } = $APP;
	const app = await getApp();

	const appsData = Object.entries(data);
	if (appsData.length) {
		for (const [modelName, entries] of appsData) {
			if (!skipDynamicCheck && $APP.dynamicModels.includes(modelName))
				$APP.dynamicData.add([modelName, entries]);
			else
				await Model[modelName].addMany(entries, {
					keepIndex: true,
				});
		}
		$APP.Database.app = await SysModel.edit($APP.settings.sysmodels.APP, {
			id: app.id,
			migrationTimestamp: Date.now(),
		});
	}
};

const setupAppEnvironment = async (app) => {
	$APP.Database.app = app;
	await $APP.Database.reload({
		name: app.id,
		models: app.models,
		version: app.version,
	});

	const { active, privateKey, ...user } = await getUser(app);
	const device = await getDevice({
		app,
		user,
	});
	if ($APP.data && !app.migrationTimestamp) {
		await migrateData($APP.data);
		app = await getApp();
	}

	return {
		app,
		user,
		device,
		models: app.models,
	};
};

const addModel = createModelAdder({
	$APP,
	getApp,
});

const Backend = {
	bootstrap: async () => {
		let app = await getApp();
		if (!app) {
			app = await createAppEntry();
		}
		await $APP.hooks.run("backendStarted", {
			app,
			models: app.models,
		});

		return setupAppEnvironment(app);
	},
	handleMessage,
	getApp,
	getDevice,
	createAppEntry,
	createUserEntry,
	getUser,
	generateId,
	broadcast,
	addModel,
	requestFromClient,
};

$APP.events.set({
	INIT_APP: async ({ respond }) => {
		const app = await getApp();
		const user = await getUser();
		const device = await getDevice();
		respond({ app, user, device });
	},
	GET_CURRENT_APP: async ({ respond }) => {
		const app = await $APP.Backend.getApp();
		respond(app);
	},
	LIST_APPS: async ({ respond }) => {
		const apps = await $APP.SysModel.getMany($APP.settings.sysmodels.APP);
		respond(apps || []);
	},
	CREATE_APP: async ({ respond }) => {
		const currentApp = await $APP.Backend.getApp();
		if (currentApp) {
			await $APP.SysModel.edit($APP.settings.sysmodels.APP, {
				id: currentApp.id,
				active: false,
			});
		}

		const newApp = await $APP.Backend.createAppEntry();
		const env = await setupAppEnvironment(newApp);
		respond(env.app);
	},
	SELECT_APP: async ({ payload, respond }) => {
		const { appId } = payload;
		if (!appId) {
			return respond({
				error: "An 'appId' is required to select an app.",
			});
		}

		const currentApp = await $APP.Backend.getApp();
		if (currentApp && currentApp.id !== appId) {
			await $APP.SysModel.edit($APP.settings.sysmodels.APP, {
				id: currentApp.id,
				active: false,
			});
		}

		await $APP.SysModel.edit($APP.settings.sysmodels.APP, {
			id: appId,
			active: true,
		});

		const selectedApp = await $APP.SysModel.get($APP.settings.sysmodels.APP, {
			id: appId,
		});

		const env = await setupAppEnvironment(selectedApp);
		respond(env.app);
	},

	GET_DB_DUMP: async ({ respond }) => {
		const dump = await $APP.Database.createDBDump();
		respond(dump);
	},

	LOAD_DB_DUMP: async ({ payload, respond = console.log }) => {
		try {
			$APP.Database.loadDBDump(payload);
			respond({ success: true });
		} catch (error) {
			console.error("Failed to load DB dump:", error);
			respond({ success: false, error });
		}
	},
});
$APP.setLibrary({
	name: "backend",
	path: "mvc/controller/backend",
	alias: "Backend",
	base: Backend,
});

$APP.addModule({
	name: "adapter-storage",
	path: "mvc/controller/adapter-storage",
	frontend: true,
});

$APP.addModule({
	name: "adapter-url",
	path: "mvc/controller/adapter-url",
	frontend: true,
});

$APP.addModule({ name: "app", modules: ["router"] });

$APP.addModule({
	name: "router",
	alias: "routes",
	frontend: true,
});

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

$APP.addModule({
	name: "habits",
	path: "apps/habits",
	frontend: true,
	backend: true,
	modules: ["blocks", "trystero"],
});

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

$APP.addModule({ name: "trystero", frontend: true });

var { T } = $APP;

const data = {
	habits: [
		{
			id: "habit-1",
			name: "Exercise",
		},
		{
			id: "habit-2",
			name: "Read a Book",
		},
	],
};

$APP.data.set(data);

$APP.updateModule({
	name: "habits",
	models: {
		habits: {
			name: { type: "string", required: true },
			checkins: T.many("checkins", "habit").$,
			notes: T.many("notes", "habit").$,
			date: T.string().index().$,
			$metadata: T.extension().$,
			$operations: T.extension().$,
		},
		notes: {
			habit: T.belongs("habits", "checkins").$,
			notes: T.string().$,
			date: T.string().index().$,
			$metadata: T.extension().$,
			$operations: T.extension().$,
		},
		checkins: {
			habit: T.belongs("habits", "checkins").$,
			date: T.string().index().$,
			$metadata: T.extension().$,
			$operations: T.extension().$,
		},
	},
});

$APP.addModule({ name: "icon-lucide", icon: true });

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

const p2p = {};
$APP.events.install(p2p);
$APP.addModule({
	name: "p2p",
	frontend: true,
	backend: true,
	base: p2p,
});

$APP.events.set({
	"P2P:LOAD_DATA_OP": async ({ payload, respond }) => {
		const { model, method, row, id } = payload;
		if (method === "add")
			$APP.Model[model].add(row, { skipP2PSync: true, keepIndex: true });
		if (method === "edit")
			$APP.Model[model].edit(row, { skipP2PSync: true, keepIndex: true });
		if (method === "remove")
			$APP.Model[model].remove(id, { skipP2PSync: true });
	},
	"P2P:JOIN_APP": async ({ payload, respond }) => {
		const { app, db } = payload;
		const { id, models, version, timestamp } = app;
		if (!id) {
			return respond({ error: "An 'appId' is required to join an app." });
		}

		await $APP.SysModel.editMany($APP.settings.sysmodels.APP, {
			active: false,
		});

		let appToJoin = await $APP.SysModel.get($APP.settings.sysmodels.APP, {
			id,
		});

		if (!appToJoin)
			appToJoin = await $APP.Backend.createAppEntry({
				id,
				models,
				version,
				timestamp,
			});
		else {
			await $APP.SysModel.edit($APP.settings.sysmodels.APP, {
				id,
				active: true,
			});
			appToJoin = await $APP.SysModel.get($APP.settings.sysmodels.APP, {
				id: id,
			});
		}
		const env = await setupAppEnvironment({
			...appToJoin,
			migrationTimestamp: Date.now(),
		});
		if (db) $APP.Database.loadDBDump({ app: env.app, dump: db });
		respond(env.app);
	},

	"P2P:REGISTER_PEER_CONNECTION": async ({ payload, respond }) => {
		console.log({ payload });
		const { appId, userId, peerId } = payload;
		const app = await $APP.SysModel.get($APP.settings.sysmodels.APP, {
			id: appId,
		});
		if (!app) {
			return respond({ success: false, error: "App not found" });
		}

		const newConnection = { userId, peerId, timestamp: Date.now() };
		const updatedConnections = [...(app.connections || []), newConnection];

		await $APP.SysModel.edit($APP.settings.sysmodels.APP, {
			id: appId,
			connections: updatedConnections,
		});

		respond({ success: true });
	},

	"P2P:UNREGISTER_PEER_CONNECTION": async ({ payload, respond }) => {
		const { appId, peerId } = payload;
		console.log({ payload });
		if (!appId || !peerId) {
			return respond({
				success: false,
				error: "Both 'appId' and 'peerId' are required.",
			});
		}

		const app = await $APP.SysModel.get($APP.settings.sysmodels.APP, {
			id: appId,
		});

		if (!app) {
			return respond({ success: false, error: "App not found" });
		}

		if (!app.connections || app.connections.length === 0) {
			// No connections exist, so the operation is trivially successful.
			return respond({ success: true });
		}

		// Assuming 'peerId' from the frontend corresponds to the 'peerId' stored during registration.
		const updatedConnections = app.connections.filter(
			(conn) => conn.peerId !== peerId,
		);

		// Check if a connection was actually removed to avoid unnecessary writes.
		if (updatedConnections.length < app.connections.length) {
			await $APP.SysModel.edit($APP.settings.sysmodels.APP, {
				id: appId,
				connections: updatedConnections,
			});
		}

		respond({ success: true });
	},
});

$APP.updateModule({
	name: "p2p",
	hooks: {
		onAddRecord({ model, row, system, opts }) {
			if (opts.skipP2PSync) return;
			if (system) return;
			$APP.Backend.broadcast({
				type: "P2P:SEND_DATA_OP",
				payload: { method: "add", model, row },
			});
		},

		onEditRecord({ model, row, system, opts }) {
			if (opts.skipP2PSync) return;
			if (system) return;
			$APP.Backend.broadcast({
				type: "P2P:SEND_DATA_OP",
				payload: { method: "edit", model, row },
			});
		},

		onRemoveRecord({ model, id, system, opts }) {
			console.log({ opts });
			if (opts.skipP2PSync) return;
			if (system) return;
			$APP.Backend.broadcast({
				type: "P2P:SEND_DATA_OP",
				payload: { method: "remove", model, id },
			});
		},
	},
});


	}
)();
$APP.settings.dev = false;
