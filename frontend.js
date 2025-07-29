self.__settings = { dev: false, production: true };
self.__icons = {"calendar-heart":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7M8 2v4m8-4v4\"/><path d=\"M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34l-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53c-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z\"/></g></svg>","circle-plus":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 12h8m-4-4v8\"/></g></svg>","chevron-left":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m15 18l-6-6l6-6\"/></svg>","chevron-right":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m9 18l6-6l-6-6\"/></svg>","trash":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/></svg>","x":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M18 6L6 18M6 6l12 12\"/></svg>","plus":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12h14m-7-7v14\"/></svg>","message-square-text":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zm-8-7H7m10 4H7\"/></svg>","settings":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></g></svg>","sun":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41\"/></g></svg>","wifi":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0m-10.5 3.57a5 5 0 0 1 7 0\"/></svg>","file-box":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01ZM7 17v5\"/><path d=\"M11.7 14.2L7 17l-4.7-2.8\"/></g></svg>","users":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M22 21v-2a4 4 0 0 0-3-3.87m-3-12a4 4 0 0 1 0 7.75\"/></g></svg>","send":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m22 2l-7 20l-4-9l-9-4Zm0 0L11 13\"/></svg>","log-in":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4l5-5l-5-5m5 5H3\"/></svg>"};
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
self.$APP = $APP;
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
		"mvc/view/loader",
		"mvc/view/theme",
		"mvc/view/fonts",
		"mvc/view/unocss",
	],
});

const html = $APP.addModule({
	name: "html",
	path: "mvc/view/html",
	frontend: true,
});
export default html;

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
	css,
};

export function css(strings, ...values) {
	return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
}

Object.assign(html, helpers);

export default html;

$APP.addModule({
	name: "loader",
	path: "mvc/view/loader",
	frontend: true,
});

import View from "/modules/mvc/view/frontend.js";

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
		class: klass,
		...prototypeMethods
	} = definition;
	const BaseClass = extendsTag ? await getComponent(extendsTag) : View;
	const NewComponentClass = class extends BaseClass {
		static icons = icons;
		static css = css;
		static formAssociated = formAssociated;
		constructor() {
			super();
			if (klass) {
				this.classList.add(...klass.split(" "));
			}
		}

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
			if (!definition) {
				const component = await loadComponent(tag);
				componentDefinitions.set(tag, component);
				definition = component.default;
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

const init = () => {
	$APP.events.on("INIT_APP", () => {
		scanForUndefinedComponents(document.body);
		observeDOMChanges();
	});
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

const setCSSVariables = (root, { colors, ...theme }) => {
	const cssString = `${generateColorVariables(colors)}\n${generateGeneralVariables(theme)}`;
	cssString
		.split("\n")
		.filter(Boolean)
		.forEach((variable) => {
			const [name, value] = variable.trim().split(": ");
			root.style.setProperty(name, value.slice(0, -1));
		});
};

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

async function loadStyle(component) {
	const { tag, css } = component;
	if (!css) return;
	if (Theme.has(tag)) return;
	Theme.set(tag, "");
	if (css) globalStyleTag.textContent += `.${tag} { ${css} }`;
}

const functions = {
	loadStyle,
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

$APP.addModule({
	name: "fonts",
	path: "mvc/view/fonts",
	frontend: true,
	base: [],
});

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

import html from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

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
				? T.stringToType(attr.value, {
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

	requestUpdate(key, oldValue) {
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
		if (this._hasUpdated && !forceUpdate && !this.shouldUpdate(changedProps))
			return;
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
		html.render(this.render(), this);
	}

	render() {
		return html``;
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
		this.state[key] = T.stringToType(value, this.constructor.properties[key]);
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

export default View;

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

$APP.addModule({
	name: "database",
	path: "mvc/model/database",
	alias: "Database",
	backend: true,
});

$APP.addModule({
	name: "controller",
	path: "mvc/controller",
	alias: "Controller",
	modules: ["mvc/controller/backend"],
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
	backend: true,
});

$APP.addModule({ name: "app" });

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
});

import Controller from "/modules/mvc/controller/frontend.js";
import html from "/modules/mvc/view/html/frontend.js";

console.log({ Controller });
$APP.events.on("INIT_APP", () => {
	$APP.define("app-index", {
		render() {
			return html`<div class="max-w-6xl mx-auto p-8 flex flex-col gap-16">
                  <div class="flex flex-col gap-4">
                    <h1 class="text-6xl text-center font-bold">
                      <uix-icon name="calendar-heart" class="text-4xl text-blue-600 inline-block align-middle"></uix-icon>
                      Habit Tracker
										</h1>
                    <h2 class="text-3xl text-center font-bold">Build better habits, one day at a time</h2>
                  </div>
                  <uix-card class="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
                    <span class="text-2xl font-bold">                 
                      <uix-icon name="circle-plus" class="text-lg text-green-600 inline-block align-middle"></uix-icon> 
                      New Habit
                    </span>
                    <uix-form ._data=${{ model: "habits" }} ._map=${{ submit: "$data:add" }}>
                      <uix-join>
                        <uix-input name="name" class="text-xl"></uix-input>
                        <uix-button label="ADD" icon="plus" type="submit" class="text-xl p-3"></uix-button>
                      </uix-join>
                    </uix-form>
                  </uix-card>
                  <uix-container      
                    class="flex flex-col gap-4"
                    ._data=${{
											model: "habits",
											tag: "uix-card",
											class:
												"p-6 bg-white rounded-lg shadow-md flex flex-col gap-4",
											includes: "checkins,notes",
											blocks: [
												{
													tag: "uix-list",
													properties: {
														class: "flex items-center justify-between",
													},
													blocks: [
														{
															tag: "uix-link",
															properties: {
																class: "text-xl font-semibold",
																_map: { label: "@parent.name" },
															},
														},
														{
															tag: "uix-link",
															properties: {
																class: "text-red-500 hover:text-red-700",
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
														class: "gap-[10px]",
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
													tag: "uix-list",
													properties: {
														class: "flex items-center justify-between",
													},
													blocks: [
														{
															tag: "uix-button",
															properties: {
																label: "Complete today",
																class:
																	"px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700",
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
																class:
																	"px-4 py-2 rounded-md bg-green-600 text-white cursor-not-allowed",
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
																			class:
																				"px-4 py-2 rounded-md bg-gray-200 text-black hover:bg-gray-300",
																		},
																	},
																	content: {
																		tag: "uix-form",
																		properties: {
																			class: "flex flex-col gap-4",
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
																							class: "text-xl",
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
																							class: "text-xl",
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
											],
										}}> 
                  </uix-container>
                  <uix-card class="p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
                    <span class="text-lg font-bold">Your Progress</span>
                    <uix-list class="flex gap-8 justify-evenly">
                      <uix-stat label="Total Habits" ._data=${{ model: "habits" }} ._map=${{ value: "$count" }} class="flex flex-col bg-blue-100 p-4 rounded-lg text-center"></uix-stat>
                      <uix-stat label="Total Streaks" value="5" class="flex flex-col bg-blue-100 p-4 rounded-lg text-center"></uix-stat>
                      <uix-stat label="Longest Streaks" value="5" class="flex flex-col bg-blue-100 p-4 rounded-lg text-center"></uix-stat>
                    </uix-list>
                  </uix-card>
                </div>
      <app-button></app-button>      
    `;
		},
	});
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

import html from "/modules/mvc/view/html/frontend.js";

const routes = {
	"/theme": {
		component: () => html`<theme-ui></theme-ui>`,
		title: "Theme",
		template: "uix-template",
	},
};

$APP.routes.set(routes);

const p2p = {};
$APP.events.install(p2p);
$APP.addModule({
	name: "p2p",
	frontend: true,
	backend: true,
	base: p2p,
});

const events = {
	"P2P:SEND_DATA_OP": ({ payload }) => {
		console.log("P2P DATA OP", { payload });
		$APP.p2p.emit("SEND_DATA_OP", payload);
	},
};
$APP.events.set(events);

import $APP from "/bootstrap.js";

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

export default { tag: "uix-container" };

import html, { css } from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

const { Icons, theme } = $APP;

export default {
	tag: "uix-icon",

	css: css`& {
		display: inline-block;
		vertical-align: middle;	
	}
	
	&[solid] {
		stroke: currentColor;
		fill: currentColor;
	}`,

	properties: {
		name: T.string(),
		svg: T.string(),
		solid: T.boolean(),
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
};

import { css } from "/modules/mvc/view/html/frontend.js";

export default {
	tag: "uix-card",

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
};

import { css } from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-form",

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
};

import { css } from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-join",

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

	properties: {
		vertical: T.boolean(),
	},
};

import { css } from "/modules/mvc/view/html/frontend.js";

export default {
	tag: "uix-button",

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
};

import html, { css } from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-input",

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
						? html`<label for=${name} ?required=${required}>${label || placeholder}</label>`
						: ""
				}
    `;
	},
};

import html from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-list",

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
};

import html from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";
export default {
	tag: "uix-stat",

	properties: {
		label: T.string(),
		value: T.string(),
		padding: T.string("lg"),
		items: T.string("center"),
		text: T.string("center"),
		gap: T.string("md"),
	},
	render() {
		return html`<span class="center text-6xl text-bold">${this.value}</span>
								<span class="center text-xl text-medium">${this.label}</span>`;
	},
};

import html from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "app-button",

	render() {
		return html`<div class="fixed bottom-[30px] right-[30px]">
                  <uix-button .float=${html`<div class="flex flex-col items-center gap-2">
                                              <theme-darkmode></theme-darkmode>
                                              <app-dev-only>
                                                <template>
                                                  <bundler-button></bundler-button>
                                                </template>
                                              </app-dev-only>
                                              <p2p-button></p2p-button> 
                                            </div>`} icon="settings"></uix-button>
                </div>`;
	},
	properties: {
		label: T.string("Actions"),
	},
};

import html, { css } from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-calendar",

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
      <div class="flex justify-between items-center p-2">
        <uix-icon class="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700" name="chevron-left" @click=${() => this._prevMonth()}></uix-icon>
        <span class="font-bold text-center">${headerText}</span>
        <uix-icon class="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700" name="chevron-right" @click=${() => this._nextMonth()}></uix-icon>
      </div>
      <div class="grid grid-cols-7 mt-4" style=${`gap: ${this.gap || "0.5rem"}`}>
        ${weekdays.map((day) => html`<span class="text-center font-semibold text-sm text-gray-500">${day}</span>`)}
        ${calendarDays.map((day) => {
					if (!day.isCurrentMonth) return html`<div></div>`;
					const dateKey = $APP.Date.formatKey(day.date);
					return this.dayContent({
						dateKey,
						toggled: this.toggledDays.includes(dateKey),
						day,
						habit: this.habit,
					});
				})}
      </div>
    `;
	},
};

import html, { css } from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-modal",

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
										<div horizontal items="center" width="full" justify="space-between">
												<span grow size="lg" transform="uppercase" weight="semibold" icon=${this.icon}>
														${this.label}
												</span>
												<uix-link @click=${this.hide.bind(this)} icon="x"></uix-link>
										</div>
										${!this.open ? null : (this.content ?? this.contentFn.bind(this)())}
									</uix-card>
								</dialog>
								${!this.cta ? null : html`<div @click=${this.show.bind(this)}>${this.cta}</div>`}
						`;
	},
};

import html, { css } from "/modules/mvc/view/html/frontend.js";
import Router from "/modules/router/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-link",

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
		bottom: 50px;
		right: 30px;
		width: 30px;
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
	properties: {
		content: T.object(),
		context: T.object(), // right-click menu
		external: T.boolean(),
		selectable: T.boolean(),
		skipRoute: T.boolean(),
		hideLabel: T.boolean(),
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
					<div dropdown>
						${this.dropdown}
					</div>`
						}
					${
						!this.context
							? null
							: html`
					<div context>
						${this.context}
					</div>`
					}
						${
							!this.accordion
								? null
								: html`
					<div accordion>
						${this.accordion}
					</div>`
						}
					${
						!this.tooltip
							? null
							: html`
					<div tooltip>
						${this.tooltip === true ? this.label : this.tooltip}
					</div>`
					}

						${
							!this.float
								? null
								: html`
					<div float>
						${this.float}
					</div>`
						}
        `;
	},
};

import html from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-calendar-day",

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
										.cta=${html`<uix-circle
											class="w-4 h-4 bg-green"
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
};

import { css } from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-avatar",

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
		presence: T.string({
			enum: ["online", "offline"],
			reflect: true,
		}),
		ring: T.boolean({
			defaultValue: false,
			reflect: true,
		}),
	},
};

export default {
	tag: "app-dev-only",

	connectedCallback() {
		if ($APP.settings.dev) {
			const template = this.querySelector("template");
			if (template) {
				this.append(template.content.cloneNode(true));
			}
		}
	},
};

import html from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "theme-darkmode",

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
};

import T from "/modules/types/index.js";

export default {
	tag: "uix-overlay",

	properties: {
		x: T.string({
			defaultValue: "right",
		}),
		y: T.string({
			defaultValue: "bottom",
		}),
	},
};

import Controller from "/modules/mvc/controller/frontend.js";
import html from "/modules/mvc/view/html/frontend.js";
import Trystero from "/modules/p2p/trystero.js";
import T from "/modules/types/index.js";

const eventHandlers = {
	SYNC_DATA_OP: ({ payload }) => {
		console.log({ payload });
		Controller.backend("P2P:LOAD_DATA_OP", payload);
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
		await Controller.backend("P2P:JOIN_APP", payload);
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

export default {
	tag: "p2p-button",

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
			Controller.backend("LIST_APPS"),
			Controller.backend("GET_CURRENT_APP"),
		]);
		this.isLoading = false;

		if (this.currentApp?.id && Trystero) {
			this._joinRoom(this.currentApp.id, true);
		}
	},

	_joinRoom(appId, isMember = false) {
		if (!appId || !Trystero) return;
		console.log("JOIN ROOM", appId);
		this.peerCount = 0;
		this.connectionRequests = [];

		const room = Trystero.joinRoom({ appId }, appId);
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

		await Controller.backend("P2P:REGISTER_PEER_CONNECTION", {
			appId: this.currentApp.id,
			deviceId: request.deviceId,
		});

		const dump = await Controller.backend("GET_DB_DUMP");
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
			await Controller.backend("SELECT_APP", { appId });
			window.location.reload();
		}
	},

	async _handleCreateApp() {
		await Controller.backend("CREATE_APP");
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
		Controller.backend("START_SYNC_DATA");
	},
	disconnectedCallback() {
		Controller.backend("STOP_SYNC_DATA");
	},
	render() {
		const isConnected = this.peerCount > 0;
		const statusText = isConnected
			? `Connected to ${this.peerCount} peer(s)`
			: "Offline";

		const modalContent = html`
      <div class="flex flex-col gap-4 p-4 w-[640px]">
        <p class="text-lg">Project ID: <strong class="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">#${this.currentApp?.id}</strong></p>
        <p class="text-sm text-gray-500 flex items-center gap-2">Status: ${statusText} <uix-icon name=${isConnected ? "users" : "cloud-off"}></uix-icon></p>
        
        ${
					this.projectRoom
						? html`
          <hr class="my-2 border-gray-200 dark:border-gray-700" />
          <h6 class="font-semibold">Test Data Sync</h6>
          <uix-button
            class="rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <hr class="my-2 border-gray-200 dark:border-gray-700" />
          <h6 class="font-semibold">Connection Requests</h6>
          <div class="flex flex-col gap-2">
            ${this.connectionRequests.map(
							(req) => html`
              <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col gap-2">
                <p>Request from: <strong class="font-mono">${req.peerId.slice(0, 8)}...</strong></p>
                <div class="flex justify-end gap-2">
                  <uix-button class="text-xs px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white" .click=${() => this._handleDenyRequest(req)} label="Deny"></uix-button>
                  <uix-button class="text-xs px-2 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white" .click=${() => this._handleApproveRequest(req)} label="Approve"></uix-button>
                </div>
              </div>
            `,
						)}
          </div>
        `
						: ""
				}

        <hr class="my-2 border-gray-200 dark:border-gray-700" />
        <h6 class="font-semibold">My Projects</h6>
        ${
					this.isLoading
						? html`<uix-spinner></uix-spinner>`
						: html`
          <div class="flex flex-col gap-2">
            ${this.apps.map(
							(app) => html`
              <uix-button
                class="w-full text-left px-3 py-2 rounded-md ${app.id === this.currentApp?.id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"}"
                .click=${() => this._handleSelectApp(app.id)}
                label=${`Project ${app.id.slice(0, 12)}...`}
              ></uix-button>
            `,
						)}
          </div>
        `
				}

        <hr class="my-2 border-gray-200 dark:border-gray-700" />
        <h6 class="font-semibold">Join a Project</h6>
        <uix-join class="flex">
          <uix-input
            class="flex-grow border rounded-md dark:bg-gray-800 dark:border-gray-600"
            label="Enter Project ID to join"
            .bind=${this.prop("joinAppId")}            
          ></uix-input>
          <uix-button
            class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            .click=${this._handleJoinApp.bind(this)}
            label="Join"
            icon="log-in"
            .disabled=${!this.joinAppId}
          ></uix-button>
				</uix-join>

        <hr class="my-2 border-gray-200 dark:border-gray-700" />
        <uix-button class="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white" .click=${this._handleCreateApp} label="Create New Project" icon="plus"></uix-button>
      </div>
    `;

		return html`
        <uix-modal
          .content=${modalContent}
          .cta=${html`<uix-button icon="wifi"></uix-button>`}
        ></uix-modal>
    `;
	},
};

import { css } from "/modules/mvc/view/html/frontend.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-circle",

	css: css`
    &:not([solid]) {
      background-color: transparent;
    }
  `,
	class:
		"inline-block align-middle box-border w-4 h-4 rounded-full border-1 border-solid border-gray-900",
	properties: {
		solid: T.boolean({
			defaultValue: false,
		}),
	},
};

import Controller from "/modules/mvc/controller/frontend.js";
import html from "/modules/mvc/view/html/frontend.js";

export default {
	tag: "bundler-button",

	extends: "uix-modal",
	cta: html`<uix-button icon="file-box"></uix-button>`,
	async bundleAppSPA() {
		await Controller.backend("BUNDLE_APP_SPA");
	},

	async bundleAppSSR() {
		await Controller.backend("BUNDLE_APP_SSR");
	},
	contentFn() {
		return html`<uix-list gap="md">
        <uix-button .click=${this.bundleAppSPA.bind(this)} label="Bundle SPA"></uix-button>
        <uix-button .click=${this.bundleAppSSR.bind(this)} label="Bundle SSR"></uix-button>
        <uix-button href="/admin" label="Admin"></uix-button>
      </uix-list>`;
	},
};


  }
	
)();
