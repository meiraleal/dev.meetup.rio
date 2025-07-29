self.__settings = { dev: false, production: true };
self.__icons = {};
(async () => {
  self.sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const coreModulesExternal = ["test", "types", "mvc", "date"];
const installEventsHandler = (target) => {
	const listeners = new Map();
	const anyListeners = new Set(); // For onAny listeners
	target.listeners = listeners;

	target.on = (key, callback) => {
		if (!callback)
			return console.error(
				`Error adding listener to ${key}: no callback passed`,
			);
		if (!listeners.has(key)) {
			listeners.set(key, new Set());
		}
		listeners.get(key).add(callback);
	};

	target.off = (key, callback) => {
		const callbackSet = listeners.get(key);
		if (!callbackSet) return;
		callbackSet.delete(callback);
		if (callbackSet.size === 0) {
			listeners.delete(key);
		}
	};

	target.onAny = (callback) => {
		if (!callback)
			return console.error("Error adding onAny listener: no callback passed");
		anyListeners.add(callback.bind(target));
	};

	target.offAny = (callback) => {
		anyListeners.delete(callback);
	};

	target.emit = (key, data) => {
		const results = [];
		listeners.get(key)?.forEach((callback) => {
			try {
				const bindedFn = callback;
				results.push(bindedFn(data));
			} catch (error) {
				console.error(`Error in listener for key "${key}":`, error);
			}
		});
		anyListeners.forEach((callback) => {
			try {
				const bindedFn = callback.bind(target);
				results.push(bindedFn({ key, data }));
			} catch (error) {
				console.error(`Error in onAny listener for key "${key}":`, error);
			}
		});
		return results;
	};
};
const eventsBase = {};
installEventsHandler(eventsBase);

const ArrayStorageFunctions = {
	add: function (...values) {
		values.forEach((value) => !this.includes(value) && this.push(value));
		return this;
	},
	remove: function (key) {
		const index = Number.parseInt(key, 10);
		if (!Number.isNaN(index) && index >= 0 && index < this.length)
			this.splice(index, 1);
		return this;
	},
	list: function () {
		return [...this];
	},
	get: function (key) {
		const index = Number.parseInt(key, 10);
		return !Number.isNaN(index) && index >= 0 && index < this.length
			? this[index]
			: undefined;
	},
};

const ObjectStorageFunctions = {
	set: function (...args) {
		if (args.length === 1 && typeof args[0] === "object" && args[0] !== null)
			Object.entries(args[0]).forEach(([k, v]) => {
				this[k] = v;
			});
		else if (args.length === 2 && typeof args[0] === "string") {
			this[args[0]] = args[1];
		}
		return this;
	},
	add: function (prop, valuesToAdd) {
		if (typeof valuesToAdd !== "object") return;
		if (!this[prop]) this[prop] = {};
		Object.entries(valuesToAdd).forEach(([k, v]) => {
			this[prop][k] = v;
		});

		return this;
	},
	get: function (...args) {
		const [key1, key2] = args;
		if (args.length === 0) return undefined;
		if (args.length === 2) return this[key1]?.[key2];
		return this[key1];
	},
	remove: function (...args) {
		args.length === 2 ? delete this[args[0]][args[1]] : delete this[args[0]];
		return this;
	},
	list: function () {
		return Object.entries(this);
	},
	keys: function () {
		return Object.keys(this);
	},
};

const installModulePrototype = (base = {}) => {
	const proto = Object.create(Object.getPrototypeOf(base));
	const storageFunctions = Array.isArray(base)
		? ArrayStorageFunctions
		: ObjectStorageFunctions;
	Object.assign(proto, storageFunctions);
	Object.setPrototypeOf(base, proto);
	return base;
};

const coreModules = {
	modules: {
		name: "modules",
		description: "Global modules store",
	},
	storage: {
		name: "storage",
		description: "Storage Module",
		base: {
			install: installModulePrototype,
		},
	},
	error: {
		name: "error",
		base: console.error,
		frontend: true,
		backend: true,
	},
	log: {
		name: "log",
		base: console.log,
		frontend: true,
		backend: true,
	},
	icons: { name: "icons", alias: "Icons", base: self.__icons || {} },
	theme: {
		name: "theme",
	},
	components: {
		name: "components",
	},
	hooks: {
		name: "hooks",
		description: "Global Hooks store",
		functions: ({ $APP }) => ({
			get: function (type) {
				return this[type] || [];
			},
			add: function (type, fn) {
				this[type] = Array.isArray(this[type]) ? [...this[type], fn] : [fn];
			},
			set: function (hooks) {
				Object.entries(hooks).forEach(([key, hook]) => this.add(key, hook));
			},
			run: async function (type, ...args) {
				try {
					if (Array.isArray(this[type])) {
						for (const hook of this[type]) {
							await hook(...args);
						}
					}
				} catch (error) {
					$APP.error(`Error running hook '${type}':`, error);
				}
			},
			clear: function (type) {
				this[type] = null;
			},
		}),
	},
	settings: {
		name: "settings",
		description: "Global settings store",
		base: {
			dev: true,
			backend: false,
			frontend: true,
			mv3: false,
			mv3Injected: false,
			basePath: "",
			...(self.__settings || {}),
		},
		hooks: ({ context }) => ({
			moduleAdded({ module }) {
				if (module.settings) context[module.name] = module.settings;
			},
		}),
	},
	events: {
		name: "events",
		description: "Global events Store",
		base: eventsBase,
		functions: { install: installEventsHandler },
	},
	data: {
		name: "data",
		description: "Data Migration store",
	},
	routes: {
		name: "routes",
		description: "Routes store",
	},
	fs: {
		dev: true,
		name: "fs",
		description: "FileSytem Module",
		functions: ({ $APP, context }) => ({
			async import(path, { tag, module } = {}) {
				try {
					const content = await import(path);
					context[path] = {
						tag,
						path,
						module,
						extension: tag ? "component" : "js",
					};
					return content;
				} catch (err) {
					console.error(`Failed to import ${path}:`, err);
					return { error: true };
				}
			},
			async fetchResource(path, handleResponse, extension) {
				try {
					const response = await fetch(path);
					context[path] = {
						path,
						extension,
					};
					if (response.ok) return await handleResponse(response);
				} catch (error) {
					console.warn(`Resource not found at: ${path}`, error);
				}
				return null;
			},
			list() {
				const list = {};
				Object.values(context).forEach((file) => {
					const { extension } = file;
					if (!list[file.extension]) list[extension] = [];
					list[extension].push(file);
				});
				return list;
			},
			assets() {
				return Object.values(context).filter(
					({ extension }) => !["js", "component"].includes(extension),
				);
			},
			components() {
				return Object.values(context).filter(
					({ tag, extension }) => extension === "js" && !!tag,
				);
			},
			json(path) {
				return context.fetchResource(path, (res) => res.json(), "json");
			},
			css: async (file, addToStyle = false) => {
				const cssContent = await context.fetchResource(
					file,
					async (response) => await response.text(),
					"css",
				);
				if (!addToStyle) return cssContent;
				const style = document.createElement("style");
				style.textContent = cssContent;
				document.head.appendChild(style);
				return cssContent;
			},
			getFilePath(file) {
				if ($APP.settings.mv3Injected) return chrome.runtime.getURL(file);
				return `${$APP.settings.basePath}${file.startsWith("/") ? file : `/${file}`}`;
			},
			getModulePath(module, fileName) {
				context.getFilePath(`modules/${module}/${fileName}`);
			},
			getRequestPath(urlString) {
				const url = new URL(urlString);
				return url.pathname + url.search;
			},
		}),
	},
};

const prototypeAPP = {
	imports: [],
	async bootstrap(
		{ modules = [], backend = false, settings = {}, theme },
		extraSettings = {},
	) {
		this.settings.set({
			...settings,
			...extraSettings,
			backend,
			frontend: !backend,
			modules,
		});
		if (this.settings.dev) {
			await this.importModules(coreModulesExternal);
			if (modules.length) await this.importModules(modules);
		}
		if (!backend) {
			$APP.fs.css("theme.css", true);
			if (theme) this.theme.set({ theme });
		}
		$APP.hooks.run("init");
		return this;
	},
	getPath({ module, version, file = "index.js" }) {
		const path = [
			"/modules",
			module,
			version && version !== "latest" && version,
			file,
		]
			.filter(Boolean)
			.join("/");
		return path;
	},
	async importModule(m) {
		const [path, v] = Array.isArray(m) ? m : [m];
		if (this.imports.includes(path)) return;
		try {
			await this.fs.import(this.getPath({ module: path, version: v }), {
				module: path,
			});
			const module = this.modules[path];
			this.imports.push(path);
			if (!module) return;
			if (module.modules) await this.importModules(module.modules);
			if (module.frontend && this.settings.frontend)
				await this.fs.import(
					this.getPath({ module: path, version: v, file: "frontend.js" }),
					{ module: path },
				);
			if (module.backend && this.settings.backend)
				await this.fs.import(
					this.getPath({ module: path, version: v, file: "backend.js" }),
					{ module: path },
				);
		} catch (error) {
			$APP.error(`Error loading module '${path}':`, error);
		}
	},
	async importModules(modules) {
		for (const module of modules) {
			await this.importModule(module);
		}
	},
	installModulePrototype,
	addHooks({ hooks, base }) {
		if (!this.hooks) return base;
		if (hooks)
			Object.entries(
				typeof hooks === "function"
					? hooks({ $APP: this, context: base })
					: hooks,
			).map(([name, fn]) => this.hooks.add(name, fn));
	},
	updateModule(module, isAdd = false) {
		const { alias, path, library, functions, name, hooks } = module;
		const base = module.base ?? this[name];
		if (module.base) this.setModuleBase({ base, name, alias });
		if (library) this.setLibrary({ base, name, alias });
		if (!this.modules[name])
			this.setModuleMeta({ name, module: { ...module, base } });
		if (functions) this.addFunctions({ name, functions });
		if (hooks) this.addHooks({ hooks, name, base });
		if (path && !this.modules[path]) this.modules[path] = this.modules[name];
		if (!isAdd)
			this.hooks
				?.get("moduleUpdated")
				.map((fn) => fn.bind(this[module.name])({ module }));
		return base;
	},
	setLibrary({ base, name, alias }) {
		this[name] = base;
		if (alias) this[alias] = base;
		if (this.modules?.[name]) this.modules[name].base = base;
	},
	setModuleBase({ base, name, alias }) {
		this.installModulePrototype(base);
		this.setLibrary({ base, name, alias });
	},
	setModuleMeta({ name, module }) {
		if (this.modules) this.modules.set(name, module);
	},
	addModule(module) {
		if (
			(module.dev && this.settings.dev !== true) ||
			!!this?.modules?.[module.name]
		)
			return;
		if (!module.base) module.base = {};
		const base = this.updateModule(module, true);
		this.hooks
			?.get("moduleAdded")
			.map((fn) => fn.bind(this[module.name])({ module }));
		if (this.log) this.log(`Module '${module.name}' added successfully`);
		return base;
	},
	addFunctions({ name, functions }) {
		if (!this[name]) throw new Error(`Module '${name}' not found`);
		const proto = Object.getPrototypeOf(this[name]);
		Object.assign(
			proto,
			typeof functions === "function"
				? functions({ $APP: this, context: this[name] })
				: functions,
		);
		return this[name];
	},
};

const initApp = (prototype = prototypeAPP) => {
	const app = Object.create(prototype);
	for (const moduleName in coreModules) app.addModule(coreModules[moduleName]);
	return app;
};

const $APP = initApp();
self.initApp = initApp;
self.$aux = {
	initApp,
	ArrayStorageFunctions,
	ObjectStorageFunctions,
	prototypeAPP,
	coreModules,
};

export default $APP;

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
		if (target[prop]) return target[prop];
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

const Types = new Proxy(typesHelpers, proxyHandler);

export default Types;

import $APP from "/bootstrap.js";

$APP.addModule({
	name: "mvc",
	modules: ["mvc/view", "mvc/model", "mvc/controller", "app"],
});

import $APP from "/bootstrap.js";

$APP.addModule({
	name: "view",
	path: "mvc/view",
	alias: "View",
	frontend: true,
	backend: true,
	modules: ["mvc/view/fonts", "mvc/view/unocss"],
});

import $APP from "/bootstrap.js";
$APP.addModule({
	name: "fonts",
	path: "mvc/view/fonts",
	frontend: true,
	base: [],
});

import $APP from "/bootstrap.js";

const getTagProps = async (tag) => {
	return $APP.Backend.requestFromClient("GET_TAG_PROPS", { tag });
};
$APP.addFunctions({ name: "view", functions: { getTagProps } });

import $APP from "/bootstrap.js";
import T from "/modules/types/index.js";

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

const instanceProxyHandler = {
	get(target, prop, receiver) {
		if (prop === "remove") {
			return () =>
				Model.request("REMOVE", target._modelName, { id: target.id });
		}

		if (prop === "update") {
			return () => {
				const cleanRow = { ...target };
				delete cleanRow._modelName;
				return Model.request("EDIT", target._modelName, {
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
				const freshData = await Model.request("GET_MANY", prop.targetModel, {
					opts: {
						filter: prop.belongs
							? target[include]
							: { [prop.targetForeignKey]: target.id },
					},
				});
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
	const result = await Model.request(action, modelName, payload);
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
		handler: (id) => Model.request("REMOVE", modelName, { id }),
	},
	{
		type: "static",
		name: "removeAll",
		handler: (filter) =>
			Model.request("REMOVE_MANY", modelName, { opts: { filter } }),
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
			Model.request("EDIT_MANY", modelName, { opts: { filter, updates } }),
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
	Model[modelName].rows[row.id] = row;
	Model[modelName].on(`get:${row.id}`, (data) => {
		if (data === undefined) {
			delete Model[modelName].rows[row.id];
			return;
		}
		const { id, ...newRow } = data;
		Object.assign(Model[modelName].rows[row.id], newRow);
	});
	row._modelName = modelName;
	return new Proxy(Model[modelName].rows[row.id], instanceProxyHandler);
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
	base: Model,
	modules: ["mvc/model/database"],
});

export default Model;

import $APP from "/bootstrap.js";
$APP.addModule({
	name: "database",
	path: "mvc/model/database",
	alias: "Database",
	backend: true,
});

import $APP from "/bootstrap.js";
import Model from "/modules/mvc/model/backend.js";
import metadata from "/modules/mvc/model/extensions/metadata.js";
import operations from "/modules/mvc/model/extensions/operations.js";
import IndexedDBWrapper from "/modules/mvc/model/indexeddb/index.js";
import T from "/modules/types/index.js";

const availableDatabaseExtensions = { operations, metadata };

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

const isSystem = (model) => !!$APP.sysmodels[model];

$APP.addModule({
	name: "DatabaseExtensions",
	base: $APP.storage.install([]),
});

const filterExtensionModels = (models, ext) =>
	Object.fromEntries(
		Object.entries(models)
			.filter(([_, schema]) => Object.hasOwn(schema, `$${ext}`))
			.map(([model]) => [model, availableDatabaseExtensions[ext]]),
	);

const loadDBDump = async (payload) => {
	const { dump } = payload;
	const app = payload.app ?? (await getApp());
	if (!dump) throw "No dump provided";
	if (!app) throw "No app selected";

	for (const [modelName, entries] of Object.entries(dump))
		if (Model[modelName])
			await Model[modelName].addMany(entries, { keepIndex: true });

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
		if (Model[modelName])
			dump[modelName] = await Model[modelName].getAll({ object: true });

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
		db = await IndexedDBWrapper.open({
			name,
			version,
			models,
		});
		if ($APP.DatabaseExtensions.length && !system) {
			$APP.DatabaseExtensions.forEach(async (ext) => {
				extdbs[ext] = await IndexedDBWrapper.open({
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

$APP.hooks.add("APP:BACKEND_STARTED", async ({ app, models }) => {
	if (!app || !models) {
		console.error(
			"APP:BACKEND_STARTED hook called with invalid app or models.",
			{
				app,
				models,
			},
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
	$APP.hooks.run("APP:DATABASE_STARTED");
});

import $APP from "/bootstrap.js";

$APP.addModule({
	name: "controller",
	path: "mvc/controller",
	alias: "Controller",
	modules: ["mvc/controller/backend"],
	settings: { syncKeySeparator: "_-_" },
});

import $APP from "/bootstrap.js";
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
	backend: true,
});

import $APP from "/bootstrap.js";
import Model from "/modules/mvc/model/backend.js";

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

const broadcast = async (params) => {
	$APP.Backend.client.postMessage(params);
	$APP.Backend.client.postMessage({ type: "BROADCAST", params });
};

const handleMessage = async ({ data, respond }) => {
	const { events } = $APP;
	const { type, payload, connection, eventId } = data;
	if (pendingBackendRequests[eventId]) {
		const promise = pendingBackendRequests[eventId];
		promise.resolve(payload);
		delete pendingBackendRequests[eventId];
		return;
	}

	if (connection) {
		if (!pendingRequests[eventId]) {
			$APP.mv3.postMessage(data, connection);
			pendingRequests[eventId] = respond;
		} else pendingRequests[eventId].postMessage(data);
		return;
	}

	const handler = events[type];
	if (!handler) return;
	await handler({
		payload,
		eventId,
		respond,
		client: createClientProxy($APP.Backend.client),
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
	const { SysModel } = $APP;
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
		await $APP.hooks.run("APP:BACKEND_STARTED", {
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
		await $APP.hooks.add("APP:DATABASE_STARTED", async () => {
			const app = await getApp();
			const user = await getUser();
			const device = await getDevice();
			respond({ app, user, device });
		});
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

import $APP from "/bootstrap.js";

$APP.addModule({ name: "app" });

import $APP from "/bootstrap.js";

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

import $APP from "/bootstrap.js";

$APP.addModule({
	name: "habits",
	path: "apps/habits",
	frontend: true,
	backend: true,
});

import $APP from "/bootstrap.js";
import T from "/modules/types/index.js";

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

$APP.models.set({
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
});

import $APP from "/bootstrap.js";

$APP.addModule({ name: "icon-lucide", icon: true });

import $APP from "/bootstrap.js";

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

import $APP from "/bootstrap.js";

$APP.addModule({
	name: "uix",
	frontend: true,
	components: {
		form: [
			"form",
			"form-control",
			"input",
			"select",
			"textarea",
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

import $APP from "/bootstrap.js";

const p2p = {};
$APP.events.install(p2p);
$APP.addModule({
	name: "p2p",
	frontend: true,
	backend: true,
	base: p2p,
});

import $APP from "/bootstrap.js";
import Model from "/modules/mvc/model/backend.js";

$APP.events.set({
	"P2P:LOAD_DATA_OP": async ({ payload }) => {
		const { model, method, row, id } = payload;
		if (method === "add")
			Model[model].add(row, { skipP2PSync: true, keepIndex: true });
		if (method === "edit")
			Model[model].edit(row, { skipP2PSync: true, keepIndex: true });
		if (method === "remove") Model[model].remove(id, { skipP2PSync: true });
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

		if (!app) return respond({ success: false, error: "App not found" });

		if (!app.connections || app.connections.length === 0)
			return respond({ success: true });

		const updatedConnections = app.connections.filter(
			(conn) => conn.peerId !== peerId,
		);

		if (updatedConnections.length < app.connections.length) {
			await $APP.SysModel.edit($APP.settings.sysmodels.APP, {
				id: appId,
				connections: updatedConnections,
			});
		}

		respond({ success: true });
	},
});

$APP.hooks.set({
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
		if (opts.skipP2PSync) return;
		if (system) return;
		$APP.Backend.broadcast({
			type: "P2P:SEND_DATA_OP",
			payload: { method: "remove", model, id },
		});
	},
});


  }
	
)();
