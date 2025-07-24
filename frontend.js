self.__settings = { dev: false, production: true };
self.__icons = {"calendar-heart":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7M8 2v4m8-4v4\"/><path d=\"M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34l-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53c-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z\"/></g></svg>","circle-plus":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 12h8m-4-4v8\"/></g></svg>","plus":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12h14m-7-7v14\"/></svg>","settings":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></g></svg>","trash":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/></svg>","chevron-left":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m15 18l-6-6l6-6\"/></svg>","chevron-right":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m9 18l6-6l-6-6\"/></svg>","sun":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41\"/></g></svg>","x":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M18 6L6 18M6 6l12 12\"/></svg>","message-square-text":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zm-8-7H7m10 4H7\"/></svg>","file-box":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01ZM7 17v5\"/><path d=\"M11.7 14.2L7 17l-4.7-2.8\"/></g></svg>","wifi":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0m-10.5 3.57a5 5 0 0 1 7 0\"/></svg>"};
(async () => {
  await (async () => {
self.sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const coreModulesExternal = ["test", "types", "mvc", "date"];

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
		base: {
			install: (target) => {
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
						return console.error(
							"Error adding onAny listener: no callback passed",
						);
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
			},
		},
	},
	adapters: {
		name: "adapters",
		description: "Controller Adapters Store",
	},
	fs: {
		dev: true,
		name: "fs",
		description: "FileSytem Module",
		functions: ({ $APP, context }) => ({
			async import(path, { tag, module } = {}) {
				try {
					if ($APP.settings.backend && self.importScripts) {
						self.importScripts(path);
					} else await import(path);
					context[path] = {
						tag,
						path,
						module,
						extension: tag ? "component" : "js",
					};
					return { sucess: true };
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
				console.log({ list, context });
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
		$APP.hooks.run("init");
		if (!backend) {
			const { user, device, app } = await $APP.Controller.backend("INIT_APP");
			$APP.models.set(app.models);
			$APP.settings.set({ APPLoaded: true });
			$APP.about = { user, device, app };
			if (theme) this.theme.set({ theme });
		}
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
self.$APP = $APP;
self.initApp = initApp;
self.$aux = {
	initApp,
	ArrayStorageFunctions,
	ObjectStorageFunctions,
	prototypeAPP,
	coreModules,
};

})();
await (async () => {
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
const directive =
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
class Directive {
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

const toSpread = ({ properties, events, attributes, booleanAttributes }) => {
	properties ??= {};
	return {
		...attributes,
		...prefixValueKeys(properties ?? {}, "."),
		...prefixValueKeys(events ?? {}, "@"),
		...prefixValueKeys(booleanAttributes ?? {}, "?"),
	};
};

class Spread extends Directive {
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

$APP.updateModule({ name: "html", functions: { spread, toSpread } });

})();
await (async () => {
$APP.addModule({
	name: "loader",
	path: "mvc/view/loader",
	frontend: true,
});

})();
await (async () => {
const modulePath = `${$APP.settings.basePath}/modules`;
const componentDefinitions = new Map();
const componentConstructors = new Map();
const componentLoadPromises = new Map();
const resolvePath = (tagName) => {
	if ($APP.loader?.[tagName]?.path) return $APP.loader[tagName].path;
	const parts = tagName.split("-");
	const moduleName = parts[0];
	const module = $APP.modules[moduleName];
	const componentName = parts.slice(1).join("-");
	if (module)
		return [modulePath, module.path ?? moduleName, componentName].join("/");
	return [$APP.settings.basePath, tagName].join("/");
};

const loadComponent = (tag) => {
	const path = resolvePath(tag);
	return $APP.fs.import(`${path}.js`, { tag });
};

async function createAndRegisterComponent(tag, definition) {
	const {
		properties = {},
		icons,
		formAssociated = false,
		css,
		style = false,
		extends: extendsTag,
		types,
		connectedCallback,
		disconnectedCallback,
		willUpdate,
		firstUpdated,
		updated,
		...prototypeMethods
	} = definition;
	const BaseClass = extendsTag ? await getComponent(extendsTag) : $APP.View;
	const NewComponentClass = class extends BaseClass {
		static icons = icons;
		static css = css;
		static formAssociated = formAssociated;
		static properties = (() => {
			const baseProperties = super.properties || {};
			const baseTheme = super.theme || {};
			const merged = { ...baseProperties };
			for (const key of Object.keys(properties)) {
				const config = properties[key];

				if (config.type === "object" && config.properties)
					config.properties = merged[key]?.properties
						? {
								...merged[key]?.properties,
								...config.properties,
							}
						: config.properties;

				merged[key] = merged[key]
					? { ...merged[key], ...config }
					: { ...config };
				if (config.theme) baseTheme[key] = merged[key].theme;
			}
			if (types) baseTheme.types = types;
			super.theme = baseTheme;
			merged.attribute = merged.attribute === false;
			return merged;
		})();
	};
	Object.assign(NewComponentClass.prototype, prototypeMethods);
	NewComponentClass.tag = tag;
	NewComponentClass._attrs = Object.fromEntries(
		Object.keys(NewComponentClass.properties).map((prop) => [
			prop.toLowerCase(),
			prop,
		]),
	);
	NewComponentClass.plugins = [...NewComponentClass.plugins];

	Object.entries({
		connectedCallback,
		disconnectedCallback,
		willUpdate,
		//shouldUpdate: definition.shouldUpdate,
		firstUpdated,
		updated,
	}).map(([event, fn]) => fn && NewComponentClass.plugins.push({ event, fn }));

	if (!customElements.get(tag) || $APP.settings.preview)
		customElements.define(tag, NewComponentClass);
	if (style || css) $APP.theme.loadStyle(NewComponentClass);
	componentConstructors.set(tag, NewComponentClass);
	return NewComponentClass;
}

async function getComponent(tag) {
	tag = tag.toLowerCase();
	if (customElements.get(tag)) {
		if (!componentConstructors.has(tag))
			componentConstructors.set(tag, customElements.get(tag));
		return componentConstructors.get(tag);
	}
	if (componentConstructors.has(tag)) return componentConstructors.get(tag);
	if (componentLoadPromises.has(tag)) return componentLoadPromises.get(tag);
	const loadPromise = (async () => {
		try {
			let definition = componentDefinitions.get(tag);
			console.log({ tag, definition, componentDefinitions });
			if (!definition) {
				await loadComponent(tag);
				definition = componentDefinitions.get(tag);
			}

			if (!definition)
				return console.warn(
					`[Loader] Definition for ${tag} not found after loading. The component's JS file might be missing a call to $APP.loader.define('${tag}', ...).`,
				);
			return await createAndRegisterComponent(tag, definition);
		} catch (error) {
			console.error(`[Loader] Failed to define component ${tag}:`, error);
			return null;
		}
	})();

	componentLoadPromises.set(tag, loadPromise);
	return loadPromise;
}

const define = (...args) => {
	if (typeof args[0] === "string") {
		const tag = args[0].toLowerCase();
		const component = args[1];
		$APP.hooks.run("componentAdded", { tag, component });
		if (!$APP.settings.dev)
			getComponent(tag).catch((e) =>
				console.error(
					`[Loader] Error during preview definition for ${tag}:`,
					e,
				),
			);
	} else if (typeof args[0] === "object" && args[0] !== null)
		Object.entries(args[0]).forEach(([tag, component]) => {
			define(tag, component);
		});
};

const scanForUndefinedComponents = async (rootElement = document.body) => {
	if (!rootElement || typeof rootElement.querySelectorAll !== "function")
		return;
	const undefinedElements = rootElement.querySelectorAll(":not(:defined)");
	const tagsToProcess = new Set();
	undefinedElements.forEach((element) => {
		const tagName = element.tagName.toLowerCase();
		if (tagName.includes("-")) tagsToProcess.add(tagName);
	});

	for (const tag of tagsToProcess) getComponent(tag);
};

const observeDOMChanges = () => {
	const observer = new MutationObserver(async (mutationsList) => {
		const tagsToProcess = new Set();
		for (const mutation of mutationsList) {
			if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const tagName = node.tagName.toLowerCase();
						if (
							tagName.includes("-") &&
							!customElements.get(tagName) &&
							!componentLoadPromises.has(tagName)
						)
							tagsToProcess.add(tagName);
						if (typeof node.querySelectorAll === "function") {
							node.querySelectorAll(":not(:defined)").forEach((childNode) => {
								const childTagName = childNode.tagName.toLowerCase();
								if (
									childTagName.includes("-") &&
									!customElements.get(childTagName) &&
									!componentLoadPromises.has(childTagName)
								)
									tagsToProcess.add(childTagName);
							});
						}
					}
				});
			}
		}
		for (const tag of tagsToProcess) getComponent(tag);
	});
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
};

let count = 0;
const init = () => {
	if ($APP.settings.APPLoaded === true) {
		console.log("Backend loaded. starting Frontend");
		scanForUndefinedComponents(document.body);
		observeDOMChanges();
	} else if (count < 5)
		setTimeout(() => {
			count++;
			console.log("Backend not loaded. Trying again...");
			init();
		}, 50);
	else console.error("Could not load backend.");
};

if ($APP.settings.dev) $APP.hooks.add("init", init);

$APP.updateModule({
	name: "loader",
	path: "mvc/view/loader",
	alias: "loader",
	functions: {
		define,
		componentDefinitions,
		componentConstructors,
		componentLoadPromises,
		resolvePath,
		loadComponent,
		createAndRegisterComponent,
		getComponent,
		scanForUndefinedComponents,
		observeDOMChanges,
	},
	hooks: ({ context }) => ({
		componentAdded({ tag, component }) {
			componentDefinitions.set(tag, component);
			if (!context[tag]) context[tag] = {};
			context[tag].definition = component;
		},
		moduleAdded({ module }) {
			if (module.components) {
				Object.entries(module.components).forEach(([name, value]) => {
					if (Array.isArray(value)) {
						value.forEach((componentName) => {
							const tag = `${module.name}-${componentName}`;
							if (!context[tag]) context[tag] = {};
							context[tag].path =
								`${modulePath}/${module.name}/${name}/${componentName}`;
						});
					} else {
						const tag = `${module.name}-${name}`;
						if (!context[tag]) context[tag] = {};
						context[tag].path = `${modulePath}/${module.name}/${name}`;
					}
				});
			}
		},
	}),
});

$APP.addModule({ name: "define", base: define });

const events = {
	GET_TAG_PROPS: async ({ payload } = {}) => {
		if (!payload.tag) return;
		const component = await getComponent(payload.tag);
		if (!component)
			console.warn(
				`Component ${payload.tag} not found. Did you forget to define it?`,
			);
		return component ? $APP.Backend.sanitize(component?.properties) : undefined;
	},
};

$APP.events.set(events);

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

$APP.addModule({ name: "icons", alias: "Icons", base: self.__icons || {} });

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
		`${$APP.settings.dev ? "/modules/mvc/controller/backend" : ""}/${swFile}.js?project=${encodeURIComponent(JSON.stringify($APP.settings))}`,
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
$APP.bootstrap({
	name: "Habits Tracker",
	modules: [
		"app",
		"apps/habits",
		"icon-lucide",
		"font/manrope",
		"uix",
		"apps/bundler",
		"p2p",
	],
	theme: {
		font: {
			family: "'Manrope'",
		},
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
					Icons.set({ [name]: svgElement });
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
