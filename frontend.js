self.__settings = { dev: false, production: true };
self.__icons = {"calendar-heart":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7M8 2v4m8-4v4\"/><path d=\"M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34l-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53c-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z\"/></g></svg>","circle-plus":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M8 12h8m-4-4v8\"/></g></svg>","chevron-left":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m15 18l-6-6l6-6\"/></svg>","chevron-right":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m9 18l6-6l-6-6\"/></svg>","trash":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2\"/></svg>","x":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M18 6L6 18M6 6l12 12\"/></svg>","plus":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 12h14m-7-7v14\"/></svg>","message-square-text":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zm-8-7H7m10 4H7\"/></svg>","settings":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2\"/><circle cx=\"12\" cy=\"12\" r=\"3\"/></g></svg>","sun":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41\"/></g></svg>","wifi":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0m-10.5 3.57a5 5 0 0 1 7 0\"/></svg>","file-box":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4\"/><path d=\"M14 2v4a2 2 0 0 0 2 2h4M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01ZM7 17v5\"/><path d=\"M11.7 14.2L7 17l-4.7-2.8\"/></g></svg>","cloud-off":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m2 2l20 20M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193m2.725-2.307A4.5 4.5 0 0 0 17.5 10h-1.79A7.01 7.01 0 0 0 10 5.07\"/></svg>","send":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m22 2l-7 20l-4-9l-9-4Zm0 0L11 13\"/></svg>","log-in":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4m-5-4l5-5l-5-5m5 5H3\"/></svg>","moon":"<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M12 3a6 6 0 0 0 9 9a9 9 0 1 1-9-9\"/></svg>"};
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

import $APP from "/bootstrap.js";
import html from "/modules/mvc/view/html/index.js";
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
import Controller from "/modules/mvc/controller/frontend.js";
import html from "/modules/mvc/view/html/index.js";

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
import html from "/modules/mvc/view/html/index.js";

const routes = {
	"/theme": {
		component: () => html`<theme-ui></theme-ui>`,
		title: "Theme",
		template: "uix-template",
	},
};

$APP.routes.set(routes);

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

import $APP from "/bootstrap.js";
import html, { css } from "/modules/mvc/view/html/index.js";
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

import { css } from "/modules/mvc/view/html/index.js";

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

import { css } from "/modules/mvc/view/html/index.js";
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

import { css } from "/modules/mvc/view/html/index.js";
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

import { css } from "/modules/mvc/view/html/index.js";

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

import html, { css } from "/modules/mvc/view/html/index.js";
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

import html from "/modules/mvc/view/html/index.js";
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

import html from "/modules/mvc/view/html/index.js";
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

import html from "/modules/mvc/view/html/index.js";
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

import html, { css } from "/modules/mvc/view/html/index.js";
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

import $APP from "/bootstrap.js";
import html, { css } from "/modules/mvc/view/html/index.js";
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

import html, { css } from "/modules/mvc/view/html/index.js";
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

import html from "/modules/mvc/view/html/index.js";
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

import html from "/modules/mvc/view/html/index.js";
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

import $APP from "/bootstrap.js";

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

import { css } from "/modules/mvc/view/html/index.js";
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

import $APP from "/bootstrap.js";
import Controller from "/modules/mvc/controller/frontend.js";
import html from "/modules/mvc/view/html/index.js";
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

import { css } from "/modules/mvc/view/html/index.js";
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
import html from "/modules/mvc/view/html/index.js";

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
