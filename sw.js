const FILE_BUNDLE={"/bootstrap.js":{content:`self.sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
const coreModulesExternal = ["test", "types", "mvc", "date"];
const installEventsHandler = (target) => {
	const listeners = new Map();
	const anyListeners = new Set(); // For onAny listeners
	target.listeners = listeners;

	target.on = (key, callback) => {
		if (!callback)
			return console.error(
				\`Error adding listener to \${key}: no callback passed\`,
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
				console.error(\`Error in listener for key "\${key}":\`, error);
			}
		});
		anyListeners.forEach((callback) => {
			try {
				const bindedFn = callback.bind(target);
				results.push(bindedFn({ key, data }));
			} catch (error) {
				console.error(\`Error in onAny listener for key "\${key}":\`, error);
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
					$APP.error(\`Error running hook '\${type}':\`, error);
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
	devFiles: {
		name: "devFiles",
		base: [],
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
					console.error(\`Failed to import \${path}:\`, err);
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
					console.warn(\`Resource not found at: \${path}\`, error);
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
				return \`\${$APP.settings.basePath}\${file.startsWith("/") ? file : \`/\${file}\`}\`;
			},
			getModulePath(module, fileName) {
				context.getFilePath(\`modules/\${module}/\${fileName}\`);
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
			$APP.error(\`Error loading module '\${path}':\`, error);
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
		if (this.log) this.log(\`Module '\${module.name}' added successfully\`);
		return base;
	},
	addFunctions({ name, functions }) {
		if (!this[name]) throw new Error(\`Module '\${name}' not found\`);
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
`,metaType:"application/javascript"},"/app.js":{content:`import $APP from "/bootstrap.js";

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
`,metaType:"application/javascript"},"/modules/test/index.js":{content:"export default {}"},"/modules/test/assert/index.js":{content:"export default {}"},"/modules/test/mock/index.js":{content:"export default {}"},"/modules/types/index.js":{content:`const formats = { email: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/ };

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
	return str.replace(/\\\${(.*?)}/g, (match, key) => {
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
			// Example: virtual: "\${directory}/\${name}"
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
			if (!typeHandlers[type]) throw new Error(\`Unknown type: \${type}\`);
			return createType(type, options);
		};
	},
};

const Types = new Proxy(typesHelpers, proxyHandler);

export default Types;
`,metaType:"application/javascript"},"/modules/mvc/index.js":{content:`import $APP from "/bootstrap.js";

$APP.addModule({
	name: "mvc",
	modules: ["mvc/view", "mvc/model", "mvc/controller", "app"],
});
`,metaType:"application/javascript"},"/modules/mvc/view/index.js":{content:`import $APP from "/bootstrap.js";

$APP.addModule({
	name: "view",
	path: "mvc/view",
	alias: "View",
	frontend: true,
	backend: true,
	modules: ["mvc/view/fonts", "mvc/view/unocss"],
});
`,metaType:"application/javascript"},"/modules/mvc/view/fonts/index.js":{content:`import $APP from "/bootstrap.js";
$APP.addModule({
	name: "fonts",
	path: "mvc/view/fonts",
	frontend: true,
	base: [],
});
`,metaType:"application/javascript"},"/modules/mvc/view/fonts/frontend.js":{content:`import $APP from "/bootstrap.js";
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
			return \`@font-face {
      font-family: '\${name}';
      font-weight: \${fontWeight};
      src: url('\${$APP.settings.basePath}/modules/font/\${extension}/\${weight}.\${type}') format('\${fontFormats[type] || type}');
    }\`;
		})
		.join("\\n");
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
`,metaType:"application/javascript"},"/modules/mvc/view/unocss/index.js":{content:`import $APP from "/bootstrap.js";
$APP.addModule({
	name: "unocss",
	path: "mvc/view/unocss",
	frontend: true,
	dev: true,
});
`,metaType:"application/javascript"},"/modules/mvc/view/unocss/frontend.js":{content:"export default {}"},"/modules/mvc/view/frontend.js":{content:`import $APP from "/bootstrap.js";
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
		return html\`\`;
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
`,metaType:"application/javascript"},"/modules/mvc/view/html/index.js":{content:`const DEV_MODE = false;
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
			? \` See https://lit.dev/msg/\${code} for more information.\`
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
const marker = \`lit$\${Math.random().toFixed(9).slice(2)}$\`;

// String used to tell if a comment is a marker comment
const markerMatch = "?" + marker;

// Text used to insert a comment marker node. We use processing instruction
// syntax because it's slightly smaller, but parses as a comment node.
const nodeMarker = \`<\${markerMatch}>\`;
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
const SPACE_CHAR = "[ \\t\\n\\f\\r]";
const ATTR_VALUE_CHAR = \`[^ \\t\\n\\f\\r"'\\\`<>=]\`;
const NAME_CHAR = \`[^\\\\s"'>=/]\`;

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
 * End of text is: \`<\` followed by:
 *   (comment start) or (tag) or (dynamic tag binding)
 */
const textEndRegex = /<(?:(!--|\\/[^a-zA-Z])|(\\/?[a-zA-Z][^>\\s]*)|(\\/?$))/g;
const COMMENT_START = 1;
const TAG_NAME = 2;
const DYNAMIC_TAG_NAME = 3;
const commentEndRegex = /-->/g;
/**
 * Comments not started with <!--, like </{, can be ended by a single \`>\`
 */
const comment2EndRegex = />/g;

/**
 * The tagEnd regex matches the end of the "inside an opening" tag syntax
 * position. It either matches a \`>\`, an attribute-like sequence, or the end
 * of the string after a space (attribute-name position ending).
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \\t\\n\\f\\r" are HTML space characters:
 * https://infra.spec.whatwg.org/#ascii-whitespace
 *
 * So an attribute is:
 *  * The name: any character except a whitespace character, ("), ('), ">",
 *    "=", or "/". Note: this is different from the HTML spec which also excludes control characters.
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (\`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const tagEndRegex = new RegExp(
	\`>|\${SPACE_CHAR}(?:(\${NAME_CHAR}+)(\${SPACE_CHAR}*=\${SPACE_CHAR}*(?:\${ATTR_VALUE_CHAR}|("|')|))|$)\`,
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
 * A \`TemplateResult\` object holds all the information about a template
 * expression required to render it: the template strings, expression values,
 * and type of template (html or svg).
 *
 * \`TemplateResult\` objects do not create any DOM on their own. To create or
 * update DOM you need to render the \`TemplateResult\`. See
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
 * A \`TemplateResult\` object holds all the information about a template
 * expression required to render it: the template strings, expression values,
 * and type of template (html or svg).
 *
 * \`TemplateResult\` objects do not create any DOM on their own. To create or
 * update DOM you need to render the \`TemplateResult\`. See
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
				"Some template strings are undefined.\\n" +
					"This is probably caused by illegal octal escape sequences.",
			);
		}
		if (DEV_MODE) {
			// Import static-html.js results in a circular dependency which g3 doesn't
			// handle. Instead we know that static values must have the field
			// \`_$litStatic$\`.
			if (values.some((val) => val?.["_$litStatic$"])) {
				issueWarning(
					"",
					\`Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.\\n\` +
						\`Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions\`,
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
 * \`\`\`ts
 * const header = (title: string) => html\`<h1>\${title}</h1>\`;
 * \`\`\`
 *
 * The \`html\` tag returns a description of the DOM to render as a value. It is
 * lazy, meaning no work is done until the template is rendered. When rendering,
 * if a template comes from the same expression as a previously rendered result,
 * it's efficiently updated instead of replaced.
 */
const html = tag(HTML_RESULT);

/**
 * Interprets a template literal as an SVG fragment that can efficiently render
 * to and update a container.
 *
 * \`\`\`ts
 * const rect = svg\`<rect width="10" height="10"></rect>\`;
 *
 * const myImage = html\`
 *   <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
 *     \${rect}
 *   </svg>\`;
 * \`\`\`
 *
 * The \`svg\` *tag function* should only be used for SVG fragments, or elements
 * that would be contained **inside** an \`<svg>\` HTML element. A common error is
 * placing an \`<svg>\` *element* in a template tagged with the \`svg\` tag
 * function. The \`<svg>\` element is an HTML element and should be used within a
 * template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an SVG fragment from the
 * \`render()\` method, as the SVG fragment will be contained within the element's
 * shadow root and thus not be properly contained within an \`<svg>\` HTML
 * element.
 */
const svg = tag(SVG_RESULT);

/**
 * Interprets a template literal as MathML fragment that can efficiently render
 * to and update a container.
 *
 * \`\`\`ts
 * const num = mathml\`<mn>1</mn>\`;
 *
 * const eq = html\`
 *   <math>
 *     \${num}
 *   </math>\`;
 * \`\`\`
 *
 * The \`mathml\` *tag function* should only be used for MathML fragments, or
 * elements that would be contained **inside** a \`<math>\` HTML element. A common
 * error is placing a \`<math>\` *element* in a template tagged with the \`mathml\`
 * tag function. The \`<math>\` element is an HTML element and should be used
 * within a template tagged with the {@linkcode html} tag function.
 *
 * In LitElement usage, it's invalid to return an MathML fragment from the
 * \`render()\` method, as the MathML fragment will be contained within the
 * element's shadow root and thus not be properly contained within a \`<math>\`
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
 * \`\`\`ts
 * const button = html\`\${
 *  user.isAdmin
 *    ? html\`<button>DELETE</button>\`
 *    : nothing
 * }\`;
 * \`\`\`
 *
 * Prefer using \`nothing\` over other falsy values as it provides a consistent
 * behavior between various expression binding contexts.
 *
 * In child expressions, \`undefined\`, \`null\`, \`''\`, and \`nothing\` all behave the
 * same and render no nodes. In attribute expressions, \`nothing\` _removes_ the
 * attribute, while \`undefined\` and \`null\` will render an empty string. In
 * property expressions \`nothing\` becomes \`undefined\`.
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
 * while \`render\` may be called multiple times on the same \`container\` (and
 * \`renderBefore\` reference node) to efficiently update the rendered content,
 * only the options passed in during the first render are respected during
 * the lifetime of renders to that unique \`container\` + \`renderBefore\`
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

// Type for classes that have a \`_directive\` or \`_directives[]\` field, used by
// \`resolveDirective\`

function trustFromTemplateString(tsa, stringFromTSA) {
	// A security check to prevent spoofing of Lit template results.
	// In the future, we may be able to replace this with Array.isTemplateObject,
	// though we might need to make that check inside of the html and svg
	// functions, because precompiled templates don't come in as
	// TemplateStringArray objects.
	if (!isArray(tsa) || !Object.hasOwn(tsa, "raw")) {
		let message = "invalid template strings array";
		if (DEV_MODE) {
			message = \`
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        \`
				.trim()
				.replace(/\\n */g, "\\n");
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
 * template order. The HTML contains comment markers denoting the \`ChildPart\`s
 * and suffixes on bound attributes denoting the \`AttributeParts\`.
 *
 * @param strings template strings array
 * @param type HTML or SVG
 * @return Array containing \`[html, attrNames]\` (array returned for terseness,
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
		// assignments to the \`regex\` variable are the state transitions.
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
						rawTextEndRegex = new RegExp(\`</\${match[TAG_NAME]}\`, "g");
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
					// Warn if \`textarea\` includes an expression and throw if \`template\`
					// does since these are not supported. We do this by checking
					// innerHTML for anything that looks like a marker. This catches
					// cases like bindings in textarea there markers turn into text nodes.
					if (
						/^(?:textarea|template)$/i.test(tag) &&
						node.innerHTML.includes(marker)
					) {
						const m =
							\`Expressions are not supported inside \\\`\${tag}\\\` \` +
							\`elements. See https://lit.dev/msg/expression-in-\${tag} for more \` +
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
			// when preparing the template. This works because \`attrNames\` is built
			// from the template string and \`attrNameIndex\` comes from processing the
			// resulting DOM.
			if (attrNames.length !== attrNameIndex) {
				throw new Error(
					"Detected duplicate attribute bindings. This occurs if your template " +
						"has duplicate attributes on an element tag. For example " +
						\`"<input ?disabled=\\\${true} ?disabled=\\\${false}>" contains a \` +
						\`duplicate "disabled" attribute. The error was detected in \` +
						"the following template: \\n" +
						"\`" +
						strings.join("\${...}") +
						"\`",
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

	// Overridden via \`litHtmlPolyfillSupport\` to provide platform support.
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
	 * returned from top-level \`render\`). This field is unused otherwise. The
	 * intention would be clearer if we made \`RootPart\` a subclass of \`ChildPart\`
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
	 * \`.parentNode\`, possibly bordered by 'marker nodes' (\`.startNode\` and
	 * \`.endNode\`).
	 *
	 * - If both \`.startNode\` and \`.endNode\` are non-null, then the part's content
	 * consists of all siblings between \`.startNode\` and \`.endNode\`, exclusively.
	 *
	 * - If \`.startNode\` is non-null but \`.endNode\` is null, then the part's
	 * content consists of all siblings following \`.startNode\`, up to and
	 * including the last child of \`.parentNode\`. If \`.endNode\` is non-null, then
	 * \`.startNode\` will always be non-null.
	 *
	 * - If both \`.endNode\` and \`.startNode\` are null, then the part's content
	 * consists of all child nodes of \`.parentNode\`.
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
	 * The part's leading marker node, if any. See \`.parentNode\` for more
	 * information.
	 */
	get startNode() {
		return this._$startNode;
	}

	/**
	 * The part's trailing marker node, if any. See \`.parentNode\` for more
	 * information.
	 */
	get endNode() {
		return this._$endNode;
	}
	_$setValue(value, directiveParent = this) {
		if (DEV_MODE && this.parentNode === null) {
			throw new Error(
				\`This \\\`ChildPart\\\` has no \\\`parentNode\\\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \\\`innerHTML\\\` or \\\`textContent\\\` can do this.\`,
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
					\`[probable mistake: rendered a template's host in itself \` +
						"(commonly caused by writing \\\${this} in a template]",
				);
				console.warn(
					"Attempted to render the template host",
					value,
					"inside itself. This is almost always a mistake, and in dev mode ",
					\`we render some warning text. In production however, we'll \`,
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
								"Consider instead using css\\\`...\\\` literals " +
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

	// Overridden via \`litHtmlPolyfillSupport\` to provide platform support.
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
		// array.map((i) => html\`\${i}\`), by reusing existing TemplateInstances.

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
	 * @param from  When \`start\` is specified, the index within the iterable from
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
	 * Implementation of RootPart's \`isConnected\`. Note that this method
	 * should only be called on \`RootPart\`s (the \`ChildPart\` returned from a
	 * top-level \`render()\` call). It has no effect on non-root ChildParts.
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
 * A top-level \`ChildPart\` returned from \`render\` that manages the connected
 * state of \`AsyncDirective\`s created throughout the tree below it.
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
	 * If this part is single-valued, \`this._strings\` will be undefined, and the
	 * method will be called with a single value argument. If this part is
	 * multi-value, \`this._strings\` will be defined, and the method is called
	 * with the value array of the part's owning TemplateInstance, and an offset
	 * into the value array from which the values should be read.
	 * This method is overloaded this way to eliminate short-lived array slices
	 * of the template instance values, and allow a fast-path for single-valued
	 * parts.
	 *
	 * @param value The part value, or an array of values for multi-valued parts
	 * @param valueIndex the index to start reading values from. \`undefined\` for
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
					// If the user-provided value is \`noChange\`, use the previous value
					v = this._$committedValue[i];
				}
				change ||= !isPrimitive(v) || v !== this._$committedValue[i];
				if (v === nothing) {
					value = nothing;
				} else if (value !== nothing) {
					value += (v ?? "") + strings[i + 1];
				}
				// We always record each value, even if one is \`nothing\`, for future
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

		// MONKEY PATCH: for some reason, properties passed using . (<uix-test .obj=\${obj}>) aren't not triggering requestUpdate when they change
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
				\`A \\\`<\${element.localName}>\\\` has a \\\`@\${name}=...\\\` listener with \` +
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
 * client-side code is being used in \`dev\` mode or \`prod\` mode.
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
 * it to the container \`document.body\`.
 *
 * \`\`\`js
 * import {html, render} from 'lit';
 *
 * const name = "Zoe";
 * render(html\`<p>Hello, \${name}!</p>\`, document.body);
 * \`\`\`
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
		throw new TypeError(\`The container to render into may not be \${container}\`);
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
	throw new Error(\`Value passed to 'literal' function must be a 'literal' result: \${value}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.\`);
};

/**
 * Tags a string literal so that it behaves like part of the static template
 * strings instead of a dynamic value.
 *
 * The only values that may be used in template expressions are other tagged
 * \`literal\` results or \`unsafeStatic\` values (note that untrusted content
 * should never be passed to \`unsafeStatic\`).
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
 * Wraps a lit-html template tag (\`html\` or \`svg\`) to add static value support.
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
 * Includes static value support from \`lit-html/static.js\`.
 */
const staticHTML = withStatic(html);
const unsafeHTML = (html) => staticHTML\`\${unsafeStatic(html)}\`;
const staticSVG = withStatic(svg);
const unsafeSVG = (svg) => staticSVG\`\${unsafeStatic(svg)}\`;

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
`,metaType:"application/javascript"},"/modules/mvc/model/index.js":{content:`import $APP from "/bootstrap.js";
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
						\`Model \${target._modelName} does not exist in models\`,
					);

				const model = models[target._modelName];
				const prop = model[include];
				if (!prop)
					throw new Error(
						\`Relationship '\${include}' not found in \${target._modelName} model\`,
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
	Model[modelName].on(\`get:\${row.id}\`, (data) => {
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
				throw new Error(\`Model \${modelName} does not exist in models\`);
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
										\`Property '\${propertyKey}' not found in model '\${modelName}'\`,
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
							\`Method '\${methodName}' not found in model '\${modelName}'\`,
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

export default Model;
`,metaType:"application/javascript"},"/modules/mvc/controller/index.js":{content:`import $APP from "/bootstrap.js";

$APP.addModule({
	name: "controller",
	path: "mvc/controller",
	alias: "Controller",
	modules: ["mvc/controller/backend"],
	settings: { syncKeySeparator: "_-_" },
});
`,metaType:"application/javascript"},"/modules/mvc/controller/backend/index.js":{content:`import $APP from "/bootstrap.js";
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
`,metaType:"application/javascript"},"/modules/app/index.js":{content:`import $APP from "/bootstrap.js";

$APP.addModule({ name: "app" });
`,metaType:"application/javascript"},"/modules/date/index.js":{content:`import $APP from "/bootstrap.js";

const date = {
	formatKey(date) {
		if (!date) return null;
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return \`\${year}-\${month}-\${day}\`;
	},
};
$APP.addModule({
	name: "date",
	alias: "Date",
	base: date,
});
`,metaType:"application/javascript"},"/modules/apps/habits/index.js":{content:`import $APP from "/bootstrap.js";

$APP.addModule({
	name: "habits",
	path: "apps/habits",
	frontend: true,
	backend: true,
});
`,metaType:"application/javascript"},"/modules/apps/habits/frontend.js":{content:`import $APP from "/bootstrap.js";
import Controller from "/modules/mvc/controller/frontend.js";
import html from "/modules/mvc/view/html/index.js";

$APP.events.on("INIT_APP", () => {
	$APP.define("app-index", {
		render() {
			return html\`<div class="max-w-6xl mx-auto p-8 flex flex-col gap-16">
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
                    <uix-form ._data=\${{ model: "habits" }} ._map=\${{ submit: "$data:add" }}>
                      <uix-join>
                        <uix-input name="name" class="text-xl"></uix-input>
                        <uix-button label="ADD" icon="plus" type="submit" class="text-xl p-3"></uix-button>
                      </uix-join>
                    </uix-form>
                  </uix-card>
                  <uix-container      
                    class="flex flex-col gap-4"
                    ._data=\${{
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
                      <uix-stat label="Total Habits" ._data=\${{ model: "habits" }} ._map=\${{ value: "$count" }} class="flex flex-col bg-blue-100 p-4 rounded-lg text-center"></uix-stat>
                      <uix-stat label="Total Streaks" value="5" class="flex flex-col bg-blue-100 p-4 rounded-lg text-center"></uix-stat>
                      <uix-stat label="Longest Streaks" value="5" class="flex flex-col bg-blue-100 p-4 rounded-lg text-center"></uix-stat>
                    </uix-list>
                  </uix-card>
                </div>
      <app-button></app-button>      
    \`;
		},
	});
});
`,metaType:"application/javascript"},"/modules/mvc/controller/frontend.js":{content:`import $APP from "/bootstrap.js";
import adaptersStorage from "/modules/mvc/controller/adapter-storage.js";
import adaptersUrl from "/modules/mvc/controller/adapter-url.js";
import backend from "/modules/mvc/controller/backend/frontend.js";
import View from "/modules/mvc/view/frontend.js";

const controllerAdapters = { ...adaptersStorage, ...adaptersUrl, backend };

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
			if (prop in controllerAdapters)
				return createAdapter(controllerAdapters[prop], prop);
			if ($APP.mv3Connections?.includes(prop)) {
				return (type, payload = {}) => {
					const backendAdapter =
						adapterCache.get("backend") ||
						createAdapter(controllerAdapters.backend, "backend");
					return backendAdapter(type, payload, prop);
				};
			}
			return undefined;
		},
	},
);

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
				return \`\${instance[obj]?.[objProp]}:\${baseKey}\`;
		}

		if (instance[prop.scope]) return \`\${instance[prop.scope]}:\${baseKey}\`;
	}
	return baseKey;
};

View.plugins.push({
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

View.plugins.push({
	event: "disconnectedCallback",
	test: ({ component }) => !!component._listeners,
	fn: ({ instance }) => {
		if (!instance._listeners) return;
		Object.entries(instance._listeners).forEach(([adapterName, fns]) => {
			const adapter = Controller[adapterName];
			if (adapter)
				Object.entries(fns).forEach(([key, fn]) => adapter.off(key, fn));
		});
	},
});

export default Controller;
`,metaType:"application/javascript"},"/modules/mvc/controller/adapter-storage.js":{content:`const serialize = (value) => {
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
		keys: keys(storage),
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

export default { local, ram, session };
`,metaType:"application/javascript"},"/modules/mvc/controller/adapter-url.js":{content:`const getHashParams = () => {
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
			\`\${window.location.pathname}?\${params}\`,
		);
		window.dispatchEvent(new Event("popstate"));
		return { key };
	},

	remove(key) {
		const params = new URLSearchParams(window.location.search);
		params.delete(key);
		window.history.pushState?.({}, "", \`\${window.location.pathname}?\${params}\`);
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

export default { querystring, hash };
`,metaType:"application/javascript"},"/modules/mvc/controller/backend/frontend.js":{content:`import $APP from "/bootstrap.js";
import Blocks from "/modules/blocks/index.js";
import Model from "/modules/mvc/model/frontend.js";
import View from "/modules/mvc/view/frontend.js";
import Loader from "/modules/mvc/view/loader/index.js";

let appWorker;
let wwPort;
let swPort;
const pendingRequests = {};
const pendingSWRequests = {};

const handleWWMessage = async (message = {}) => {
	const { data } = message;
	const { eventId, type, payload, connection } = data;
	const handler = $APP.events[type];
	let response = payload;

	const respond =
		eventId &&
		((responsePayload) =>
			wwPort.postMessage({
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

const handleSWMessage = async (message = {}) => {
	const { data } = message;
	const { eventId, type, payload } = data;
	console.log({ eventId, type, payload });
	if (eventId && pendingSWRequests[eventId]) {
		try {
			pendingSWRequests[eventId].resolve(payload);
		} catch (error) {
			pendingSWRequests[eventId].reject(new Error(error));
		} finally {
			delete pendingSWRequests[eventId];
		}
		return;
	}

	const handler = $APP.swEvents[type];
	if (handler) await handler({ payload });
};

const initBackend = async () => {
	appWorker = new Worker(
		\`/worker.js?project=\${encodeURIComponent(JSON.stringify($APP.settings))}\`,
		{ type: "module" },
	);

	const wwChannel = new MessageChannel();
	wwPort = wwChannel.port1;
	wwPort.onmessage = handleWWMessage;
	appWorker.postMessage({ type: "INIT_PORT" }, [wwChannel.port2]);

	const { user, device, app } = await backend("INIT_APP");
	$APP.models.set(app.models);
	$APP.events.emit("INIT_APP", { user, device, app });
	$APP.about = { user, device, app };

	await navigator.storage.persist();

	const swChannel = new MessageChannel();
	swPort = swChannel.port1;
	swPort.onmessage = handleSWMessage;

	const initSWPort = () => {
		if (navigator.serviceWorker.controller) {
			navigator.serviceWorker.controller.postMessage({ type: "INIT_PORT" }, [
				swChannel.port2,
			]);
		}
	};

	initSWPort();
	navigator.serviceWorker.addEventListener("controllerchange", initSWPort);
};

const postMessageToPort = (port, params, retryFn) => {
	if (!port) {
		setTimeout(() => retryFn(params), 100);
		return;
	}
	port.postMessage(params);
};

const postMessageToSW = (params) =>
	postMessageToPort(swPort, params, postMessageToSW);
const postMessageToWW = (params) =>
	postMessageToPort(wwPort, params, postMessageToWW);

const requestToSW = (type, payload = {}) => {
	const eventId =
		Date.now().toString() + Math.random().toString(36).substr(2, 9);
	return new Promise((resolve, reject) => {
		pendingSWRequests[eventId] = { resolve, reject };
		postMessageToSW({ type, payload, eventId });
	});
};

$APP.addModule({
	name: "SW",
	base: { postMessage: postMessageToSW, request: requestToSW },
});

const backend = (type, payload = {}, connection = null) => {
	const eventId =
		Date.now().toString() + Math.random().toString(36).substr(2, 9);
	const params = { type, payload, eventId };
	return new Promise((resolve, reject) => {
		if (connection) params.connection = connection;
		pendingRequests[eventId] = { resolve, reject };
		postMessageToWW(params);
	});
};

$APP.hooks.add("init", initBackend);

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
	} = instance._data;
	const method = (instance._data.method ?? id) ? "get" : "getMany";
	const opts = { limit, offset, order, recursive };

	if (filter && Object.keys(filter).length > 0)
		opts.filter = DisplayHandler.resolveObject(filter, instance);
	if (includes)
		opts.includes = Array.isArray(includes) ? includes : includes.split(",");

	const onDataLoaded = (results) => {
		if (method.toLowerCase() === "get") {
			instance._row = results;
		} else {
			instance._rows = results.items ?? results;
			if (results.count) instance._data.count = results.count;
		}
		instance.requestUpdate();
		instance.emit("dataLoaded", { instance, component: instance.constructor });
	};

	if (method.toLowerCase() === "get") {
		Model[model].get(id, opts).then(onDataLoaded);
	} else {
		Model[model].getAll(opts).then(onDataLoaded);
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
		const [sourceArray, condition] = argsFn(context);
		if (!Array.isArray(sourceArray) || !condition) return;
		let [key, value] = condition.split("=");
		value = DisplayHandler.resolveValue({ ...context, value });
		if (!key || value === undefined) return;
		return sourceArray.find((item) => String(item[key]) === String(value));
	},
	$boolean: (context) => {
		const [source] = argsFn(context);
		const value = DisplayHandler.resolveValue({ ...context, value: source });
		return Boolean(value);
	},
	$filter: (context) => {
		const [sourceArray, condition] = argsFn(context);
		if (!Array.isArray(sourceArray) || !condition) return [];
		const [key, value] = condition.split("=");
		if (!key || value === undefined) return [];
		return sourceArray.filter((item) => String(item[key]) === String(value));
	},
	$includes: (context) => {
		const [sourceArray, condition] = argsFn(context);
		if (!Array.isArray(sourceArray) || !condition) return false;
		const [key, value] = condition.split("=");
		if (!key || value === undefined) return false;
		return sourceArray.some((item) => String(item[key]) === String(value));
	},
	$map: (context) => {
		const mapFn = (ctx) => {
			const [sourceArray, key] = argsFn(ctx);
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
	$count: ({ instance }) => instance?._rows?.count ?? instance?._rows?.length,
	$now: () => Date.now(),
	$data: (context) => {
		const { value, prop, instance } = context;
		const [, event] = value.split(":");
		if (!componentsEvents.data[event]) return;
		const eventFn = componentsEvents.data[event];
		const _data = instance._data || instance.closest("[_data]")?._data || {};
		const fn = eventFn({ ..._data, instance });
		if (prop.startsWith("on")) instance[prop] = fn;
		return fn;
	},
	$closest: ({ value, instance }) => {
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
	$parent: ({ value, instance, prop, willUpdate }) => {
		const [, key] = value.split(".");
		const parent = instance.parentElement.closest("[_row]");
		if (!parent && !instance._parentListener) return;
		if (!instance._parentListener) {
			instance._parentListener = parent;
			if (willUpdate) parent.on("willUpdate", willUpdate({ prop, instance }));
		}
		const row = instance._parentListener._row || {};
		return key ? row[key] : row;
	},
	$today: () => new Date().toISOString().split("T")[0],
	$todayLocale: () =>
		new Intl.DateTimeFormat(undefined, { dateStyle: "short" }).format(
			new Date(),
		),
	$currentTime: () =>
		new Intl.DateTimeFormat(undefined, {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}).format(new Date()),
	$currentDay: () => new Date().getDate(),
	$currentMonth: () => new Date().getMonth() + 1,
	$currentYear: () => new Date().getFullYear(),
	$currentHour: () => new Date().getHours(),
	$timeAgo: ({ value }) => {
		if (!value) return "";
		const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
		const seconds = (new Date(value).getTime() - Date.now()) / 1000;
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
			if (Math.abs(interval) > 1) return rtf.format(Math.round(interval), unit);
		}
		return rtf.format(seconds, "second");
	},
};

const DisplayHandler = {
	operators: {
		$eq: (s, p) => s === p,
		$neq: (s, p) => s !== p,
		$exists: (s) => s != null,
		$nexists: (s) => s == null,
		$gt: (s, p) => Number(s) > Number(p),
		$inc: (s, p) => {
			if (!Array.isArray(s)) return false;
			const [key, value] = Object.entries(p)[0];
			return s.some((item) => item && item[key] === value);
		},
		$ninc: (s, p) => {
			if (!Array.isArray(s)) return true;
			const [key, value] = Object.entries(p)[0];
			return !s.some((item) => item && item[key] === value);
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
		if (typeof value === "object" && value.tag) {
			const block = {
				...value,
				properties: { ...(value.properties || {}) },
			};
			return value.function
				? (args = {}) => {
						block.properties = { ...block.properties, ...args };
						return Blocks.render({ block });
					}
				: Blocks.render({ block });
		}
		if (typeof value !== "string") return value;
		if (value.startsWith("@")) return componentsFunctions.$query(context);
		if (value.startsWith("$")) {
			const [fn] = value.split(":");
			return componentsFunctions[fn]?.(context);
		}
		return value;
	},
	resolveParams(params, context) {
		if (typeof params !== "object" || params === null)
			return this.resolveValue({ ...context, value: params });
		const resolved = {};
		for (const key in params) {
			resolved[key] = this.resolveValue({ ...context, value: params[key] });
		}
		return resolved;
	},
	evaluate(rules, context) {
		for (const subjectStr in rules) {
			const condition = rules[subjectStr];
			const subject = this.resolveValue({ ...context, value: subjectStr });
			for (const operator in condition) {
				if (!this.operators[operator]) continue;
				const rawParams = condition[operator];
				const resolvedParams = this.resolveParams(rawParams, context);
				if (!this.operators[operator](subject, resolvedParams)) return false;
			}
		}
		return true;
	},
};

const componentsEvents = {
	data: {
		_prepareRow(model, instance) {
			const modelProps = $APP.models[model];
			if (!modelProps) return;
			if (!instance._row) instance._row = {};
			instance
				.qa(".uix-input")
				.forEach((input) => (instance._row[input.name] = input.inputValue()));
			const row = { ...instance._row };
			Object.keys(row).forEach((prop) => {
				if (prop !== "id" && modelProps[prop] === undefined) delete row[prop];
			});
			return row;
		},
		render() {
			const { model, tag, blocks, properties = {} } = this._data;
			const rows = this._rows ?? (this._row ? [this._row] : null);
			if (!rows) return;
			return rows.map((row) =>
				Blocks.render({
					row,
					block: {
						tag,
						blocks,
						properties: {
							class: this._data.class,
							_data: { model, id: row.id },
							_row: row,
							...properties,
						},
					},
				}),
			);
		},
		remove:
			({ model, id, instance }) =>
			() =>
				id
					? Model[model].remove(id)
					: Model[model].removeAll(
							componentsEvents.data._prepareRow(model, instance),
						),
		add:
			({ model, instance }) =>
			async () => {
				const rowData = componentsEvents.data._prepareRow(model, instance);
				if (!rowData) return;
				const res = await Model[model].add(rowData);
				if (res?.id) instance._row.id = res.id;
			},
		edit:
			({ model, instance }) =>
			async () => {
				const rowData = componentsEvents.data._prepareRow(model, instance);
				if (rowData?.id) await Model[model].edit(rowData);
			},
		upsert:
			({ model, instance }) =>
			async () => {
				const rowData = componentsEvents.data._prepareRow(model, instance);
				if (!rowData) return;
				if (rowData.id) {
					await Model[model].edit(rowData);
				} else {
					const res = await Model[model].add(rowData);
					if (res?.id) instance._row.id = res.id;
				}
			},
	},
};

View.plugins.push({
	event: "connectedCallback",
	test: ({ instance }) => !!instance._data?.displayIf,
	fn: ({ instance }) => {
		const { displayIf } = instance._data;
		const evaluate = () =>
			instance.classList.toggle(
				"hide",
				!DisplayHandler.evaluate(displayIf, context),
			);
		const context = { instance, row: instance._row, listener: evaluate };
		evaluate();
		instance.on("dataLoaded", evaluate);
	},
});

const instanceMapProperties = ({ instance }) => {
	for (const [propKey, value] of Object.entries(instance._map)) {
		if (!propKey || !value) continue;
		const resolvedValue = DisplayHandler.resolveValue({
			value,
			instance,
			prop: propKey,
		});
		instance.state[propKey] = resolvedValue;
		const prop = instance.constructor.properties[propKey];
		if (prop?.attribute && propKey !== "_row") {
			instance.updateAttribute({
				key: propKey,
				value: resolvedValue,
				type: prop.type,
				skipPropUpdate: true,
			});
		}
		if (!instance.state._row) instance.state._row = {};
		instance.state._row[propKey] = resolvedValue;
	}
};

View.plugins.push({
	event: "connectedCallback",
	test: ({ instance }) =>
		instance?._data?.model &&
		!["add", "edit", "remove"].includes(instance?._data?.method),
	fn: ({ instance }) => {
		instance._listeners = {};
		if (instance._data.tag) {
			instance.on("dataLoaded", () => {
				if (!instance._updatedRender) {
					instance.render = componentsEvents.data.render.bind(instance);
					instance._updatedRender = true;
				}
				instance.requestUpdate();
			});
		}

		const { model, id } = instance._data;
		const row = instance._row;

		if (row && !id) {
			instance._data.id = row.id;
		}
		if ((row && !id) || instance._rows) {
			instance.emit("dataLoaded", {
				instance,
				component: instance.constructor,
			});
		}

		const modelRows = Model[model]?.rows;
		if (!modelRows) return;

		if (id) {
			const listenerKey = \`get:\${id}\`;
			if (row !== undefined && modelRows[id] === undefined) {
				modelRows[id] = row;
			}
			instance._listeners[listenerKey] = () => {
				instance._row = modelRows[id];
				instance.requestUpdate();
			};
			Model[model].on(listenerKey, instance._listeners[listenerKey]);
		} else {
			instance._listeners.any = () => requestDataSync({ instance });
			Model[model].onAny(instance._listeners.any);
		}

		if (!instance._row && !instance._rows) requestDataSync({ instance });
		instance.syncable = true;
	},
});

View.plugins.push({
	event: "connectedCallback",
	test: ({ instance }) => !!instance._map,
	fn: ({ instance }) => {
		const container = instance.parentElement.closest("[_data]");
		if (!container) return;
		container.on("dataLoaded", () => {
			instanceMapProperties({ instance });
			instance.requestUpdate();
		});
	},
});

View.plugins.push({
	event: "willUpdate",
	test: ({ instance }) => !!instance._map,
	fn() {
		instanceMapProperties({ instance: this });
	},
});

View.plugins.push({
	event: "disconnectedCallback",
	test: ({ instance }) => instance.syncable,
	fn: ({ instance }) => {
		Object.entries(instance._listeners).forEach(([key, listener]) => {
			if (key === "any") Model[instance._data.model].offAny(listener);
			else Model[instance._data.model].off(key, listener);
		});
	},
});

$APP.events.set({
	BROADCAST: (payload) => {},
	UPDATE_MODELS: ({ payload: { models } }) => $APP.models.set(models),
	REQUEST_DATA_SYNC: ({ payload: { model, key, data } }) => {
		console.log({ key, model, data });
		Model[model].emit(key, data);
	},
});

export default backend;
`,metaType:"application/javascript"},"/modules/blocks/index.js":{content:`import { keyed as keyedDirective } from "/modules/mvc/view/html/directive.js";
import htmlModule from "/modules/mvc/view/html/index.js";
import spread from "/modules/mvc/view/html/spread.js";

const { unsafeStatic, staticHTML: html } = htmlModule;

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
	const template = html\`<\${unsafeStatic(tagName)}  \${spread(properties)}>\${children}</\${unsafeStatic(tagName)}>\`;
	return row?.id && keyed === true
		? keyedDirective(row.id, template)
		: template;
}

const blocks = { render, parse };

export default blocks;
`,metaType:"application/javascript"},"/modules/mvc/model/frontend.js":{content:`import backend from "/modules/mvc/controller/backend/frontend.js";
import Model from "/modules/mvc/model/index.js";

const request = (action, modelName, params = {}) => {
	return backend(action, {
		model: modelName,
		...params,
	});
};

Model.request = request;
export default Model;
`,metaType:"application/javascript"},"/modules/mvc/view/loader/index.js":{content:`import $APP from "/bootstrap.js";
import View from "/modules/mvc/view/frontend.js";
import ThemeManager from "/modules/theme/index.js";

const modulePath = \`\${$APP.settings.basePath}/modules\`;
const componentDefinitions = new Map();
const componentConstructors = new Map();
const componentLoadPromises = new Map();
const resolvePath = (tagName) => {
	if ($APP.components?.[tagName]?.path) return $APP.components[tagName].path;
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
	return $APP.fs.import(\`\${path}.js\`, { tag });
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

	if (style || css) ThemeManager.loadStyle(NewComponentClass);
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
					\`[Loader] Definition for \${tag} not found after loading. The component's JS file might be missing a call to $APP.components.define('\${tag}', ...).\`,
				);
			return await createAndRegisterComponent(tag, definition);
		} catch (error) {
			console.error(\`[Loader] Failed to define component \${tag}:\`, error);
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
					\`[Loader] Error during preview definition for \${tag}:\`,
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

$APP.hooks.set({
	componentAdded({ tag, component }) {
		componentDefinitions.set(tag, component);
		if (!$APP.components[tag]) $APP.components[tag] = {};
		$APP.components[tag].definition = component;
	},
	moduleAdded({ module }) {
		if (module.components) {
			Object.entries(module.components).forEach(([name, value]) => {
				if (Array.isArray(value)) {
					value.forEach((componentName) => {
						const tag = \`\${module.name}-\${componentName}\`;
						if (!$APP.components[tag]) $APP.components[tag] = {};
						$APP.components[tag].path =
							\`\${modulePath}/\${module.name}/\${name}/\${componentName}\`;
					});
				} else {
					const tag = \`\${module.name}-\${name}\`;
					if (!$APP.components[tag]) $APP.components[tag] = {};
					$APP.components[tag].path = \`\${modulePath}/\${module.name}/\${name}\`;
				}
			});
		}
	},
});

const events = {
	GET_TAG_PROPS: async ({ payload } = {}) => {
		if (!payload.tag) return;
		const component = await getComponent(payload.tag);
		if (!component)
			console.warn(
				\`Component \${payload.tag} not found. Did you forget to define it?\`,
			);
		return component ? $APP.Backend.sanitize(component?.properties) : undefined;
	},
};

$APP.events.set(events);
$APP.define = define;
export default { define };
`,metaType:"application/javascript"},"/modules/mvc/view/html/directive.js":{content:`/**
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
 * implement \`render\` and/or \`update\`, and then pass their subclass to
 * \`directive\`.
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
		throw new Error("The \`render()\` method must be implemented.");
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

export const keyed = directive(Keyed);
`,metaType:"application/javascript"},"/modules/mvc/view/html/spread.js":{content:`import { Directive, directive } from "/modules/mvc/view/html/directive.js";

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
						key = \`@\${key}\`;
					} else if (i === 2) {
						key = \`?\${key}\`;
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
				.map(([k, v]) => \`\${k}: \${v}\`)
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

export default spread;
`,metaType:"application/javascript"},"/modules/theme/index.js":{content:`import $APP from "/bootstrap.js";
const Theme = new Map();

const camelToKebab = (str) =>
	str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

const generateShade = (baseColorVar, percentage) =>
	percentage >= 0
		? \`color-mix(in hsl, white \${percentage}%, \${baseColorVar})\`
		: \`color-mix(in hsl, \${baseColorVar}, black \${Math.abs(percentage)}%)\`;

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
			\`--color-\${color}: \${value};\`,
			...Object.entries(shades).map(
				([shade, percentage]) =>
					\`--color-\${color}-\${shade}: \${generateShade(\`var(--color-\${color})\`, percentage)};\`,
			),
		])
		.join("\\n");

const generateGeneralVariables = (obj, prefix = "--") =>
	Object.entries(obj)
		.flatMap(([key, value]) =>
			key === "colors"
				? []
				: typeof value === "object" && value !== null
					? generateGeneralVariables(value, \`\${prefix}\${camelToKebab(key)}-\`)
					: \`\${prefix}\${camelToKebab(key)}: \${value};\`,
		)
		.join("\\n");

const setCSSVariables = (root, { colors, ...theme }) => {
	const cssString = \`\${generateColorVariables(colors)}\\n\${generateGeneralVariables(theme)}\`;
	cssString
		.split("\\n")
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
	if (css) globalStyleTag.textContent += \`.\${tag} { \${css} }\`;
}

const getSize = (value, multiplier) => {
	const size = $APP.theme.sizes[value] || value;
	if (typeof size === "number")
		return multiplier ? \`calc(\${size}px * \${multiplier})\` : \`\${size}px\`;
	if (typeof size === "string" && size.includes("/")) {
		const [num, den] = size.split("/");
		const percent = \`\${((Number.parseFloat(num) / Number.parseFloat(den)) * 100).toFixed(3)}%\`;
		return multiplier ? \`calc(\${percent} * \${multiplier})\` : percent;
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
	return \`\${result.toFixed(2)}rem\`;
};

const ThemeManager = {
	loadStyle,
	getSize,
	getTextSize,
};

$APP.hooks.set({
	init: () => {
		setCSSVariables(document.documentElement, $APP.theme);
	},
	moduleAdded({ module }) {
		if (module.theme) $APP.theme[module.name] = module.theme;
	},
});

$APP.theme.set({
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
});
export default ThemeManager;
`,metaType:"application/javascript"},"/modules/icon-lucide/index.js":{content:`import $APP from "/bootstrap.js";

$APP.addModule({ name: "icon-lucide", icon: true });
`,metaType:"application/javascript"},"/modules/font/manrope/index.js":{content:`import $APP from "/bootstrap.js";

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
`,metaType:"application/javascript"},"/modules/uix/index.js":{content:`import $APP from "/bootstrap.js";

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
			"file-upload", // \u{1F53A} ToDo
			"number-input", // \u{1F53A} ToDo
			"switch", // \u{1F53A} ToDo
			"slider", // \u{1F53A} ToDo
		],

		navigation: [
			"navbar",
			"breadcrumbs",
			"menu", // \u{1F53A} ToDo (menu dropdown)
			"sidebar", // \u{1F53A} ToDo
			"pagination",
			"tabs",
			"tabbed",
		],

		overlay: [
			"overlay",
			"modal",
			"drawer",
			"tooltip",
			"popover", // \u{1F53A} ToDo
			"alert-dialog", // \u{1F53A} ToDo
			"toast", // \u{1F53A} ToDo
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
			"tag", // \u{1F53A} ToDo
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
			"section", // \u{1F53A} ToDo
			"page", // \u{1F53A} ToDo
			"flex", // \u{1F53A} ToDo
			"stack", // \u{1F53A} ToDo
			"spacer", // \u{1F53A} ToDo
		],

		feedback: [
			"spinner",
			"progress-bar", // \u{1F53A} ToDo
			"circular-progress", // \u{1F53A} ToDo
			"skeleton", // \u{1F53A} ToDo
		],

		utility: [
			"draggable",
			"droparea",
			"clipboard", // \u{1F53A} ToDo
			"theme-toggle", // \u{1F53A} ToDo
			"dark-mode-switch", // \u{1F53A} ToDo
		],
	},
});
`,metaType:"application/javascript"},"/modules/uix/frontend.js":{content:`import $APP from "/bootstrap.js";
import html from "/modules/mvc/view/html/index.js";

const routes = {
	"/theme": {
		component: () => html\`<theme-ui></theme-ui>\`,
		title: "Theme",
		template: "uix-template",
	},
};

$APP.routes.set(routes);
`,metaType:"application/javascript"},"/modules/apps/bundler/index.js":{content:`import $APP from "/bootstrap.js";

$APP.addModule({
	name: "bundler",
	path: "apps/bundler",
	base: [],
	dev: true,
	frontend: true,
});
`,metaType:"application/javascript"},"/modules/apps/bundler/frontend.js":{content:"export default {}"},"/modules/integrations/github.js":{content:"export default {}"},"/npm/esbuild-wasm@0.21.5/lib/browser.min.js":{content:'(module=>{\n"use strict";var xe=Object.defineProperty;var _e=Object.getOwnPropertyDescriptor;var Ve=Object.getOwnPropertyNames;var Ye=Object.prototype.hasOwnProperty;var Je=(e,t)=>{for(var n in t)xe(e,n,{get:t[n],enumerable:!0})},Ge=(e,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Ve(t))!Ye.call(e,a)&&a!==n&&xe(e,a,{get:()=>t[a],enumerable:!(i=_e(t,a))||i.enumerable});return e};var Qe=e=>Ge(xe({},"__esModule",{value:!0}),e);var ne=(e,t,n)=>new Promise((i,a)=>{var l=f=>{try{s(n.next(f))}catch(h){a(h)}},g=f=>{try{s(n.throw(f))}catch(h){a(h)}},s=f=>f.done?i(f.value):Promise.resolve(f.value).then(l,g);s((n=n.apply(e,t)).next())});var Re={};Je(Re,{analyzeMetafile:()=>mt,analyzeMetafileSync:()=>wt,build:()=>ft,buildSync:()=>yt,context:()=>dt,default:()=>Ot,formatMessages:()=>gt,formatMessagesSync:()=>bt,initialize:()=>Rt,stop:()=>vt,transform:()=>pt,transformSync:()=>ht,version:()=>ct});module.exports=Qe(Re);function Se(e){let t=i=>{if(i===null)n.write8(0);else if(typeof i=="boolean")n.write8(1),n.write8(+i);else if(typeof i=="number")n.write8(2),n.write32(i|0);else if(typeof i=="string")n.write8(3),n.write(Z(i));else if(i instanceof Uint8Array)n.write8(4),n.write(i);else if(i instanceof Array){n.write8(5),n.write32(i.length);for(let a of i)t(a)}else{let a=Object.keys(i);n.write8(6),n.write32(a.length);for(let l of a)n.write(Z(l)),t(i[l])}},n=new pe;return n.write32(0),n.write32(e.id<<1|+!e.isRequest),t(e.value),Ee(n.buf,n.len-4,0),n.buf.subarray(0,n.len)}function $e(e){let t=()=>{switch(n.read8()){case 0:return null;case 1:return!!n.read8();case 2:return n.read32();case 3:return ie(n.read());case 4:return n.read();case 5:{let g=n.read32(),s=[];for(let f=0;f<g;f++)s.push(t());return s}case 6:{let g=n.read32(),s={};for(let f=0;f<g;f++)s[ie(n.read())]=t();return s}default:throw new Error("Invalid packet")}},n=new pe(e),i=n.read32(),a=(i&1)===0;i>>>=1;let l=t();if(n.ptr!==e.length)throw new Error("Invalid packet");return{id:i,isRequest:a,value:l}}var pe=class{constructor(t=new Uint8Array(1024)){this.buf=t;this.len=0;this.ptr=0}_write(t){if(this.len+t>this.buf.length){let n=new Uint8Array((this.len+t)*2);n.set(this.buf),this.buf=n}return this.len+=t,this.len-t}write8(t){let n=this._write(1);this.buf[n]=t}write32(t){let n=this._write(4);Ee(this.buf,t,n)}write(t){let n=this._write(4+t.length);Ee(this.buf,t.length,n),this.buf.set(t,n+4)}_read(t){if(this.ptr+t>this.buf.length)throw new Error("Invalid packet");return this.ptr+=t,this.ptr-t}read8(){return this.buf[this._read(1)]}read32(){return ke(this.buf,this._read(4))}read(){let t=this.read32(),n=new Uint8Array(t),i=this._read(n.length);return n.set(this.buf.subarray(i,i+t)),n}},Z,ie,Oe;if(typeof TextEncoder!="undefined"&&typeof TextDecoder!="undefined"){let e=new TextEncoder,t=new TextDecoder;Z=n=>e.encode(n),ie=n=>t.decode(n),Oe=\'new TextEncoder().encode("")\'}else if(typeof Buffer!="undefined")Z=e=>Buffer.from(e),ie=e=>{let{buffer:t,byteOffset:n,byteLength:i}=e;return Buffer.from(t,n,i).toString()},Oe=\'Buffer.from("")\';else throw new Error("No UTF-8 codec found");if(!(Z("")instanceof Uint8Array))throw new Error(`Invariant violation: "${Oe} instanceof Uint8Array" is incorrectly false\n\nThis indicates that your JavaScript environment is broken. You cannot use\nesbuild in this environment because esbuild relies on this invariant. This\nis not a problem with esbuild. You need to fix your environment instead.\n`);function ke(e,t){return e[t++]|e[t++]<<8|e[t++]<<16|e[t++]<<24}function Ee(e,t,n){e[n++]=t,e[n++]=t>>8,e[n++]=t>>16,e[n++]=t>>24}var _=JSON.stringify,Me="warning",Ce="silent";function Ae(e){if(J(e,"target"),e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var ye=()=>null,I=e=>typeof e=="boolean"?null:"a boolean",y=e=>typeof e=="string"?null:"a string",he=e=>e instanceof RegExp?null:"a RegExp object",se=e=>typeof e=="number"&&e===(e|0)?null:"an integer",Pe=e=>typeof e=="function"?null:"a function",z=e=>Array.isArray(e)?null:"an array",ee=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",Xe=e=>typeof e=="object"&&e!==null?null:"an array or an object",Ze=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",Fe=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",De=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",et=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",tt=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",Be=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",nt=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function r(e,t,n,i){let a=e[n];if(t[n+""]=!0,a===void 0)return;let l=i(a);if(l!==null)throw new Error(`${_(n)} must be ${l}`);return a}function V(e,t,n){for(let i in e)if(!(i in t))throw new Error(`Invalid option ${n}: ${_(i)}`)}function Ue(e){let t=Object.create(null),n=r(e,t,"wasmURL",nt),i=r(e,t,"wasmModule",Ze),a=r(e,t,"worker",I);return V(e,t,"in initialize() call"),{wasmURL:n,wasmModule:i,worker:a}}function je(e){let t;if(e!==void 0){t=Object.create(null);for(let n in e){let i=e[n];if(typeof i=="string"||i===!1)t[n]=i;else throw new Error(`Expected ${_(n)} in mangle cache to map to either a string or false`)}}return t}function be(e,t,n,i,a){let l=r(t,n,"color",I),g=r(t,n,"logLevel",y),s=r(t,n,"logLimit",se);l!==void 0?e.push(`--color=${l}`):i&&e.push("--color=true"),e.push(`--log-level=${g||a}`),e.push(`--log-limit=${s||0}`)}function J(e,t,n){if(typeof e!="string")throw new Error(`Expected value for ${t}${n!==void 0?" "+_(n):""} to be a string, got ${typeof e} instead`);return e}function Le(e,t,n){let i=r(t,n,"legalComments",y),a=r(t,n,"sourceRoot",y),l=r(t,n,"sourcesContent",I),g=r(t,n,"target",tt),s=r(t,n,"format",y),f=r(t,n,"globalName",y),h=r(t,n,"mangleProps",he),w=r(t,n,"reserveProps",he),M=r(t,n,"mangleQuoted",I),L=r(t,n,"minify",I),D=r(t,n,"minifySyntax",I),q=r(t,n,"minifyWhitespace",I),G=r(t,n,"minifyIdentifiers",I),U=r(t,n,"lineLimit",se),K=r(t,n,"drop",z),Y=r(t,n,"dropLabels",z),v=r(t,n,"charset",y),m=r(t,n,"treeShaking",I),d=r(t,n,"ignoreAnnotations",I),o=r(t,n,"jsx",y),R=r(t,n,"jsxFactory",y),E=r(t,n,"jsxFragment",y),C=r(t,n,"jsxImportSource",y),T=r(t,n,"jsxDev",I),u=r(t,n,"jsxSideEffects",I),c=r(t,n,"define",ee),b=r(t,n,"logOverride",ee),S=r(t,n,"supported",ee),F=r(t,n,"pure",z),$=r(t,n,"keepNames",I),O=r(t,n,"platform",y),A=r(t,n,"tsconfigRaw",et);if(i&&e.push(`--legal-comments=${i}`),a!==void 0&&e.push(`--source-root=${a}`),l!==void 0&&e.push(`--sources-content=${l}`),g&&(Array.isArray(g)?e.push(`--target=${Array.from(g).map(Ae).join(",")}`):e.push(`--target=${Ae(g)}`)),s&&e.push(`--format=${s}`),f&&e.push(`--global-name=${f}`),O&&e.push(`--platform=${O}`),A&&e.push(`--tsconfig-raw=${typeof A=="string"?A:JSON.stringify(A)}`),L&&e.push("--minify"),D&&e.push("--minify-syntax"),q&&e.push("--minify-whitespace"),G&&e.push("--minify-identifiers"),U&&e.push(`--line-limit=${U}`),v&&e.push(`--charset=${v}`),m!==void 0&&e.push(`--tree-shaking=${m}`),d&&e.push("--ignore-annotations"),K)for(let x of K)e.push(`--drop:${J(x,"drop")}`);if(Y&&e.push(`--drop-labels=${Array.from(Y).map(x=>J(x,"dropLabels")).join(",")}`),h&&e.push(`--mangle-props=${h.source}`),w&&e.push(`--reserve-props=${w.source}`),M!==void 0&&e.push(`--mangle-quoted=${M}`),o&&e.push(`--jsx=${o}`),R&&e.push(`--jsx-factory=${R}`),E&&e.push(`--jsx-fragment=${E}`),C&&e.push(`--jsx-import-source=${C}`),T&&e.push("--jsx-dev"),u&&e.push("--jsx-side-effects"),c)for(let x in c){if(x.indexOf("=")>=0)throw new Error(`Invalid define: ${x}`);e.push(`--define:${x}=${J(c[x],"define",x)}`)}if(b)for(let x in b){if(x.indexOf("=")>=0)throw new Error(`Invalid log override: ${x}`);e.push(`--log-override:${x}=${J(b[x],"log override",x)}`)}if(S)for(let x in S){if(x.indexOf("=")>=0)throw new Error(`Invalid supported: ${x}`);let k=S[x];if(typeof k!="boolean")throw new Error(`Expected value for supported ${_(x)} to be a boolean, got ${typeof k} instead`);e.push(`--supported:${x}=${k}`)}if(F)for(let x of F)e.push(`--pure:${J(x,"pure")}`);$&&e.push("--keep-names")}function rt(e,t,n,i,a){var ae;let l=[],g=[],s=Object.create(null),f=null,h=null;be(l,t,s,n,i),Le(l,t,s);let w=r(t,s,"sourcemap",De),M=r(t,s,"bundle",I),L=r(t,s,"splitting",I),D=r(t,s,"preserveSymlinks",I),q=r(t,s,"metafile",I),G=r(t,s,"outfile",y),U=r(t,s,"outdir",y),K=r(t,s,"outbase",y),Y=r(t,s,"tsconfig",y),v=r(t,s,"resolveExtensions",z),m=r(t,s,"nodePaths",z),d=r(t,s,"mainFields",z),o=r(t,s,"conditions",z),R=r(t,s,"external",z),E=r(t,s,"packages",y),C=r(t,s,"alias",ee),T=r(t,s,"loader",ee),u=r(t,s,"outExtension",ee),c=r(t,s,"publicPath",y),b=r(t,s,"entryNames",y),S=r(t,s,"chunkNames",y),F=r(t,s,"assetNames",y),$=r(t,s,"inject",z),O=r(t,s,"banner",ee),A=r(t,s,"footer",ee),x=r(t,s,"entryPoints",Xe),k=r(t,s,"absWorkingDir",y),P=r(t,s,"stdin",ee),j=(ae=r(t,s,"write",I))!=null?ae:a,B=r(t,s,"allowOverwrite",I),H=r(t,s,"mangleCache",ee);if(s.plugins=!0,V(t,s,`in ${e}() call`),w&&l.push(`--sourcemap${w===!0?"":`=${w}`}`),M&&l.push("--bundle"),B&&l.push("--allow-overwrite"),L&&l.push("--splitting"),D&&l.push("--preserve-symlinks"),q&&l.push("--metafile"),G&&l.push(`--outfile=${G}`),U&&l.push(`--outdir=${U}`),K&&l.push(`--outbase=${K}`),Y&&l.push(`--tsconfig=${Y}`),E&&l.push(`--packages=${E}`),v){let p=[];for(let N of v){if(J(N,"resolve extension"),N.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${N}`);p.push(N)}l.push(`--resolve-extensions=${p.join(",")}`)}if(c&&l.push(`--public-path=${c}`),b&&l.push(`--entry-names=${b}`),S&&l.push(`--chunk-names=${S}`),F&&l.push(`--asset-names=${F}`),d){let p=[];for(let N of d){if(J(N,"main field"),N.indexOf(",")>=0)throw new Error(`Invalid main field: ${N}`);p.push(N)}l.push(`--main-fields=${p.join(",")}`)}if(o){let p=[];for(let N of o){if(J(N,"condition"),N.indexOf(",")>=0)throw new Error(`Invalid condition: ${N}`);p.push(N)}l.push(`--conditions=${p.join(",")}`)}if(R)for(let p of R)l.push(`--external:${J(p,"external")}`);if(C)for(let p in C){if(p.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${p}`);l.push(`--alias:${p}=${J(C[p],"alias",p)}`)}if(O)for(let p in O){if(p.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${p}`);l.push(`--banner:${p}=${J(O[p],"banner",p)}`)}if(A)for(let p in A){if(p.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${p}`);l.push(`--footer:${p}=${J(A[p],"footer",p)}`)}if($)for(let p of $)l.push(`--inject:${J(p,"inject")}`);if(T)for(let p in T){if(p.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${p}`);l.push(`--loader:${p}=${J(T[p],"loader",p)}`)}if(u)for(let p in u){if(p.indexOf("=")>=0)throw new Error(`Invalid out extension: ${p}`);l.push(`--out-extension:${p}=${J(u[p],"out extension",p)}`)}if(x)if(Array.isArray(x))for(let p=0,N=x.length;p<N;p++){let X=x[p];if(typeof X=="object"&&X!==null){let te=Object.create(null),Q=r(X,te,"in",y),ce=r(X,te,"out",y);if(V(X,te,"in entry point at index "+p),Q===void 0)throw new Error(\'Missing property "in" for entry point at index \'+p);if(ce===void 0)throw new Error(\'Missing property "out" for entry point at index \'+p);g.push([ce,Q])}else g.push(["",J(X,"entry point at index "+p)])}else for(let p in x)g.push([p,J(x[p],"entry point",p)]);if(P){let p=Object.create(null),N=r(P,p,"contents",Be),X=r(P,p,"resolveDir",y),te=r(P,p,"sourcefile",y),Q=r(P,p,"loader",y);V(P,p,\'in "stdin" object\'),te&&l.push(`--sourcefile=${te}`),Q&&l.push(`--loader=${Q}`),X&&(h=X),typeof N=="string"?f=Z(N):N instanceof Uint8Array&&(f=N)}let W=[];if(m)for(let p of m)p+="",W.push(p);return{entries:g,flags:l,write:j,stdinContents:f,stdinResolveDir:h,absWorkingDir:k,nodePaths:W,mangleCache:je(H)}}function it(e,t,n,i){let a=[],l=Object.create(null);be(a,t,l,n,i),Le(a,t,l);let g=r(t,l,"sourcemap",De),s=r(t,l,"sourcefile",y),f=r(t,l,"loader",y),h=r(t,l,"banner",y),w=r(t,l,"footer",y),M=r(t,l,"mangleCache",ee);return V(t,l,`in ${e}() call`),g&&a.push(`--sourcemap=${g===!0?"external":g}`),s&&a.push(`--sourcefile=${s}`),f&&a.push(`--loader=${f}`),h&&a.push(`--banner=${h}`),w&&a.push(`--footer=${w}`),{flags:a,mangleCache:je(M)}}function qe(e){let t={},n={didClose:!1,reason:""},i={},a=0,l=0,g=new Uint8Array(16*1024),s=0,f=v=>{let m=s+v.length;if(m>g.length){let o=new Uint8Array(m*2);o.set(g),g=o}g.set(v,s),s+=v.length;let d=0;for(;d+4<=s;){let o=ke(g,d);if(d+4+o>s)break;d+=4,q(g.subarray(d,d+o)),d+=o}d>0&&(g.copyWithin(0,d,s),s-=d)},h=v=>{n.didClose=!0,v&&(n.reason=": "+(v.message||v));let m="The service was stopped"+n.reason;for(let d in i)i[d](m,null);i={}},w=(v,m,d)=>{if(n.didClose)return d("The service is no longer running"+n.reason,null);let o=a++;i[o]=(R,E)=>{try{d(R,E)}finally{v&&v.unref()}},v&&v.ref(),e.writeToStdin(Se({id:o,isRequest:!0,value:m}))},M=(v,m)=>{if(n.didClose)throw new Error("The service is no longer running"+n.reason);e.writeToStdin(Se({id:v,isRequest:!1,value:m}))},L=(v,m)=>ne(this,null,function*(){try{if(m.command==="ping"){M(v,{});return}if(typeof m.key=="number"){let d=t[m.key];if(!d)return;let o=d[m.command];if(o){yield o(v,m);return}}throw new Error("Invalid command: "+m.command)}catch(d){let o=[le(d,e,null,void 0,"")];try{M(v,{errors:o})}catch(R){}}}),D=!0,q=v=>{if(D){D=!1;let d=String.fromCharCode(...v);if(d!=="0.21.5")throw new Error(`Cannot start service: Host version "0.21.5" does not match binary version ${_(d)}`);return}let m=$e(v);if(m.isRequest)L(m.id,m.value);else{let d=i[m.id];delete i[m.id],m.value.error?d(m.value.error,{}):d(null,m.value)}};return{readFromStdout:f,afterClose:h,service:{buildOrContext:({callName:v,refs:m,options:d,isTTY:o,defaultWD:R,callback:E})=>{let C=0,T=l++,u={},c={ref(){++C===1&&m&&m.ref()},unref(){--C===0&&(delete t[T],m&&m.unref())}};t[T]=u,c.ref(),lt(v,T,w,M,c,e,u,d,o,R,(b,S)=>{try{E(b,S)}finally{c.unref()}})},transform:({callName:v,refs:m,input:d,options:o,isTTY:R,fs:E,callback:C})=>{let T=Ne(),u=c=>{try{if(typeof d!="string"&&!(d instanceof Uint8Array))throw new Error(\'The input to "transform" must be a string or a Uint8Array\');let{flags:b,mangleCache:S}=it(v,o,R,Ce),F={command:"transform",flags:b,inputFS:c!==null,input:c!==null?Z(c):typeof d=="string"?Z(d):d};S&&(F.mangleCache=S),w(m,F,($,O)=>{if($)return C(new Error($),null);let A=ue(O.errors,T),x=ue(O.warnings,T),k=1,P=()=>{if(--k===0){let j={warnings:x,code:O.code,map:O.map,mangleCache:void 0,legalComments:void 0};"legalComments"in O&&(j.legalComments=O==null?void 0:O.legalComments),O.mangleCache&&(j.mangleCache=O==null?void 0:O.mangleCache),C(null,j)}};if(A.length>0)return C(fe("Transform failed",A,x),null);O.codeFS&&(k++,E.readFile(O.code,(j,B)=>{j!==null?C(j,null):(O.code=B,P())})),O.mapFS&&(k++,E.readFile(O.map,(j,B)=>{j!==null?C(j,null):(O.map=B,P())})),P()})}catch(b){let S=[];try{be(S,o,{},R,Ce)}catch($){}let F=le(b,e,T,void 0,"");w(m,{command:"error",flags:S,error:F},()=>{F.detail=T.load(F.detail),C(fe("Transform failed",[F],[]),null)})}};if((typeof d=="string"||d instanceof Uint8Array)&&d.length>1024*1024){let c=u;u=()=>E.writeFile(d,c)}u(null)},formatMessages:({callName:v,refs:m,messages:d,options:o,callback:R})=>{if(!o)throw new Error(`Missing second argument in ${v}() call`);let E={},C=r(o,E,"kind",y),T=r(o,E,"color",I),u=r(o,E,"terminalWidth",se);if(V(o,E,`in ${v}() call`),C===void 0)throw new Error(`Missing "kind" in ${v}() call`);if(C!=="error"&&C!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${v}() call`);let c={command:"format-msgs",messages:re(d,"messages",null,"",u),isWarning:C==="warning"};T!==void 0&&(c.color=T),u!==void 0&&(c.terminalWidth=u),w(m,c,(b,S)=>{if(b)return R(new Error(b),null);R(null,S.messages)})},analyzeMetafile:({callName:v,refs:m,metafile:d,options:o,callback:R})=>{o===void 0&&(o={});let E={},C=r(o,E,"color",I),T=r(o,E,"verbose",I);V(o,E,`in ${v}() call`);let u={command:"analyze-metafile",metafile:d};C!==void 0&&(u.color=C),T!==void 0&&(u.verbose=T),w(m,u,(c,b)=>{if(c)return R(new Error(c),null);R(null,b.result)})}}}}function lt(e,t,n,i,a,l,g,s,f,h,w){let M=Ne(),L=e==="context",D=(U,K)=>{let Y=[];try{be(Y,s,{},f,Me)}catch(m){}let v=le(U,l,M,void 0,K);n(a,{command:"error",flags:Y,error:v},()=>{v.detail=M.load(v.detail),w(fe(L?"Context failed":"Build failed",[v],[]),null)})},q;if(typeof s=="object"){let U=s.plugins;if(U!==void 0){if(!Array.isArray(U))return D(new Error(\'"plugins" must be an array\'),"");q=U}}if(q&&q.length>0){if(l.isSync)return D(new Error("Cannot use plugins in synchronous API calls"),"");st(t,n,i,a,l,g,s,q,M).then(U=>{if(!U.ok)return D(U.error,U.pluginName);try{G(U.requestPlugins,U.runOnEndCallbacks,U.scheduleOnDisposeCallbacks)}catch(K){D(K,"")}},U=>D(U,""));return}try{G(null,(U,K)=>K([],[]),()=>{})}catch(U){D(U,"")}function G(U,K,Y){let v=l.hasFS,{entries:m,flags:d,write:o,stdinContents:R,stdinResolveDir:E,absWorkingDir:C,nodePaths:T,mangleCache:u}=rt(e,s,f,Me,v);if(o&&!l.hasFS)throw new Error(\'The "write" option is unavailable in this environment\');let c={command:"build",key:t,entries:m,flags:d,write:o,stdinContents:R,stdinResolveDir:E,absWorkingDir:C||h,nodePaths:T,context:L};U&&(c.plugins=U),u&&(c.mangleCache=u);let b=($,O)=>{let A={errors:ue($.errors,M),warnings:ue($.warnings,M),outputFiles:void 0,metafile:void 0,mangleCache:void 0},x=A.errors.slice(),k=A.warnings.slice();$.outputFiles&&(A.outputFiles=$.outputFiles.map(at)),$.metafile&&(A.metafile=JSON.parse($.metafile)),$.mangleCache&&(A.mangleCache=$.mangleCache),$.writeToStdout!==void 0&&console.log(ie($.writeToStdout).replace(/\\n$/,"")),K(A,(P,j)=>{if(x.length>0||P.length>0){let B=fe("Build failed",x.concat(P),k.concat(j));return O(B,null,P,j)}O(null,A,P,j)})},S,F;L&&(g["on-end"]=($,O)=>new Promise(A=>{b(O,(x,k,P,j)=>{let B={errors:P,warnings:j};F&&F(x,k),S=void 0,F=void 0,i($,B),A()})})),n(a,c,($,O)=>{if($)return w(new Error($),null);if(!L)return b(O,(k,P)=>(Y(),w(k,P)));if(O.errors.length>0)return w(fe("Context failed",O.errors,O.warnings),null);let A=!1,x={rebuild:()=>(S||(S=new Promise((k,P)=>{let j;F=(H,W)=>{j||(j=()=>H?P(H):k(W))};let B=()=>{n(a,{command:"rebuild",key:t},(W,ae)=>{W?P(new Error(W)):j?j():B()})};B()})),S),watch:(k={})=>new Promise((P,j)=>{if(!l.hasFS)throw new Error(\'Cannot use the "watch" API in this environment\');V(k,{},"in watch() call"),n(a,{command:"watch",key:t},W=>{W?j(new Error(W)):P(void 0)})}),serve:(k={})=>new Promise((P,j)=>{if(!l.hasFS)throw new Error(\'Cannot use the "serve" API in this environment\');let B={},H=r(k,B,"port",se),W=r(k,B,"host",y),ae=r(k,B,"servedir",y),p=r(k,B,"keyfile",y),N=r(k,B,"certfile",y),X=r(k,B,"fallback",y),te=r(k,B,"onRequest",Pe);V(k,B,"in serve() call");let Q={command:"serve",key:t,onRequest:!!te};H!==void 0&&(Q.port=H),W!==void 0&&(Q.host=W),ae!==void 0&&(Q.servedir=ae),p!==void 0&&(Q.keyfile=p),N!==void 0&&(Q.certfile=N),X!==void 0&&(Q.fallback=X),n(a,Q,(ce,We)=>{if(ce)return j(new Error(ce));te&&(g["serve-request"]=(ze,Ke)=>{te(Ke.args),i(ze,{})}),P(We)})}),cancel:()=>new Promise(k=>{if(A)return k();n(a,{command:"cancel",key:t},()=>{k()})}),dispose:()=>new Promise(k=>{if(A)return k();A=!0,n(a,{command:"dispose",key:t},()=>{k(),Y(),a.unref()})})};a.ref(),w(null,x)})}}var st=(e,t,n,i,a,l,g,s,f)=>ne(void 0,null,function*(){let h=[],w=[],M={},L={},D=[],q=0,G=0,U=[],K=!1;s=[...s];for(let m of s){let d={};if(typeof m!="object")throw new Error(`Plugin at index ${G} must be an object`);let o=r(m,d,"name",y);if(typeof o!="string"||o==="")throw new Error(`Plugin at index ${G} is missing a name`);try{let R=r(m,d,"setup",Pe);if(typeof R!="function")throw new Error("Plugin is missing a setup function");V(m,d,`on plugin ${_(o)}`);let E={name:o,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};G++;let T=R({initialOptions:g,resolve:(u,c={})=>{if(!K)throw new Error(\'Cannot call "resolve" before plugin setup has completed\');if(typeof u!="string")throw new Error("The path to resolve must be a string");let b=Object.create(null),S=r(c,b,"pluginName",y),F=r(c,b,"importer",y),$=r(c,b,"namespace",y),O=r(c,b,"resolveDir",y),A=r(c,b,"kind",y),x=r(c,b,"pluginData",ye),k=r(c,b,"with",ee);return V(c,b,"in resolve() call"),new Promise((P,j)=>{let B={command:"resolve",path:u,key:e,pluginName:o};if(S!=null&&(B.pluginName=S),F!=null&&(B.importer=F),$!=null&&(B.namespace=$),O!=null&&(B.resolveDir=O),A!=null)B.kind=A;else throw new Error(\'Must specify "kind" when calling "resolve"\');x!=null&&(B.pluginData=f.store(x)),k!=null&&(B.with=ot(k,"with")),t(i,B,(H,W)=>{H!==null?j(new Error(H)):P({errors:ue(W.errors,f),warnings:ue(W.warnings,f),path:W.path,external:W.external,sideEffects:W.sideEffects,namespace:W.namespace,suffix:W.suffix,pluginData:f.load(W.pluginData)})})})},onStart(u){let c=\'This error came from the "onStart" callback registered here:\',b=ge(new Error(c),a,"onStart");h.push({name:o,callback:u,note:b}),E.onStart=!0},onEnd(u){let c=\'This error came from the "onEnd" callback registered here:\',b=ge(new Error(c),a,"onEnd");w.push({name:o,callback:u,note:b}),E.onEnd=!0},onResolve(u,c){let b=\'This error came from the "onResolve" callback registered here:\',S=ge(new Error(b),a,"onResolve"),F={},$=r(u,F,"filter",he),O=r(u,F,"namespace",y);if(V(u,F,`in onResolve() call for plugin ${_(o)}`),$==null)throw new Error("onResolve() call is missing a filter");let A=q++;M[A]={name:o,callback:c,note:S},E.onResolve.push({id:A,filter:$.source,namespace:O||""})},onLoad(u,c){let b=\'This error came from the "onLoad" callback registered here:\',S=ge(new Error(b),a,"onLoad"),F={},$=r(u,F,"filter",he),O=r(u,F,"namespace",y);if(V(u,F,`in onLoad() call for plugin ${_(o)}`),$==null)throw new Error("onLoad() call is missing a filter");let A=q++;L[A]={name:o,callback:c,note:S},E.onLoad.push({id:A,filter:$.source,namespace:O||""})},onDispose(u){D.push(u)},esbuild:a.esbuild});T&&(yield T),U.push(E)}catch(R){return{ok:!1,error:R,pluginName:o}}}l["on-start"]=(m,d)=>ne(void 0,null,function*(){let o={errors:[],warnings:[]};yield Promise.all(h.map(T=>ne(void 0,[T],function*({name:R,callback:E,note:C}){try{let u=yield E();if(u!=null){if(typeof u!="object")throw new Error(`Expected onStart() callback in plugin ${_(R)} to return an object`);let c={},b=r(u,c,"errors",z),S=r(u,c,"warnings",z);V(u,c,`from onStart() callback in plugin ${_(R)}`),b!=null&&o.errors.push(...re(b,"errors",f,R,void 0)),S!=null&&o.warnings.push(...re(S,"warnings",f,R,void 0))}}catch(u){o.errors.push(le(u,a,f,C&&C(),R))}}))),n(m,o)}),l["on-resolve"]=(m,d)=>ne(void 0,null,function*(){let o={},R="",E,C;for(let T of d.ids)try{({name:R,callback:E,note:C}=M[T]);let u=yield E({path:d.path,importer:d.importer,namespace:d.namespace,resolveDir:d.resolveDir,kind:d.kind,pluginData:f.load(d.pluginData),with:d.with});if(u!=null){if(typeof u!="object")throw new Error(`Expected onResolve() callback in plugin ${_(R)} to return an object`);let c={},b=r(u,c,"pluginName",y),S=r(u,c,"path",y),F=r(u,c,"namespace",y),$=r(u,c,"suffix",y),O=r(u,c,"external",I),A=r(u,c,"sideEffects",I),x=r(u,c,"pluginData",ye),k=r(u,c,"errors",z),P=r(u,c,"warnings",z),j=r(u,c,"watchFiles",z),B=r(u,c,"watchDirs",z);V(u,c,`from onResolve() callback in plugin ${_(R)}`),o.id=T,b!=null&&(o.pluginName=b),S!=null&&(o.path=S),F!=null&&(o.namespace=F),$!=null&&(o.suffix=$),O!=null&&(o.external=O),A!=null&&(o.sideEffects=A),x!=null&&(o.pluginData=f.store(x)),k!=null&&(o.errors=re(k,"errors",f,R,void 0)),P!=null&&(o.warnings=re(P,"warnings",f,R,void 0)),j!=null&&(o.watchFiles=me(j,"watchFiles")),B!=null&&(o.watchDirs=me(B,"watchDirs"));break}}catch(u){o={id:T,errors:[le(u,a,f,C&&C(),R)]};break}n(m,o)}),l["on-load"]=(m,d)=>ne(void 0,null,function*(){let o={},R="",E,C;for(let T of d.ids)try{({name:R,callback:E,note:C}=L[T]);let u=yield E({path:d.path,namespace:d.namespace,suffix:d.suffix,pluginData:f.load(d.pluginData),with:d.with});if(u!=null){if(typeof u!="object")throw new Error(`Expected onLoad() callback in plugin ${_(R)} to return an object`);let c={},b=r(u,c,"pluginName",y),S=r(u,c,"contents",Be),F=r(u,c,"resolveDir",y),$=r(u,c,"pluginData",ye),O=r(u,c,"loader",y),A=r(u,c,"errors",z),x=r(u,c,"warnings",z),k=r(u,c,"watchFiles",z),P=r(u,c,"watchDirs",z);V(u,c,`from onLoad() callback in plugin ${_(R)}`),o.id=T,b!=null&&(o.pluginName=b),S instanceof Uint8Array?o.contents=S:S!=null&&(o.contents=Z(S)),F!=null&&(o.resolveDir=F),$!=null&&(o.pluginData=f.store($)),O!=null&&(o.loader=O),A!=null&&(o.errors=re(A,"errors",f,R,void 0)),x!=null&&(o.warnings=re(x,"warnings",f,R,void 0)),k!=null&&(o.watchFiles=me(k,"watchFiles")),P!=null&&(o.watchDirs=me(P,"watchDirs"));break}}catch(u){o={id:T,errors:[le(u,a,f,C&&C(),R)]};break}n(m,o)});let Y=(m,d)=>d([],[]);w.length>0&&(Y=(m,d)=>{ne(void 0,null,function*(){let o=[],R=[];for(let{name:E,callback:C,note:T}of w){let u,c;try{let b=yield C(m);if(b!=null){if(typeof b!="object")throw new Error(`Expected onEnd() callback in plugin ${_(E)} to return an object`);let S={},F=r(b,S,"errors",z),$=r(b,S,"warnings",z);V(b,S,`from onEnd() callback in plugin ${_(E)}`),F!=null&&(u=re(F,"errors",f,E,void 0)),$!=null&&(c=re($,"warnings",f,E,void 0))}}catch(b){u=[le(b,a,f,T&&T(),E)]}if(u){o.push(...u);try{m.errors.push(...u)}catch(b){}}if(c){R.push(...c);try{m.warnings.push(...c)}catch(b){}}}d(o,R)})});let v=()=>{for(let m of D)setTimeout(()=>m(),0)};return K=!0,{ok:!0,requestPlugins:U,runOnEndCallbacks:Y,scheduleOnDisposeCallbacks:v}});function Ne(){let e=new Map,t=0;return{load(n){return e.get(n)},store(n){if(n===void 0)return-1;let i=t++;return e.set(i,n),i}}}function ge(e,t,n){let i,a=!1;return()=>{if(a)return i;a=!0;try{let l=(e.stack+"").split(`\n`);l.splice(1,1);let g=Ie(t,l,n);if(g)return i={text:e.message,location:g},i}catch(l){}}}function le(e,t,n,i,a){let l="Internal error",g=null;try{l=(e&&e.message||e)+""}catch(s){}try{g=Ie(t,(e.stack+"").split(`\n`),"")}catch(s){}return{id:"",pluginName:a,text:l,location:g,notes:i?[i]:[],detail:n?n.store(e):-1}}function Ie(e,t,n){let i="    at ";if(e.readFileSync&&!t[0].startsWith(i)&&t[1].startsWith(i))for(let a=1;a<t.length;a++){let l=t[a];if(l.startsWith(i))for(l=l.slice(i.length);;){let g=/^(?:new |async )?\\S+ \\((.*)\\)$/.exec(l);if(g){l=g[1];continue}if(g=/^eval at \\S+ \\((.*)\\)(?:, \\S+:\\d+:\\d+)?$/.exec(l),g){l=g[1];continue}if(g=/^(\\S+):(\\d+):(\\d+)$/.exec(l),g){let s;try{s=e.readFileSync(g[1],"utf8")}catch(M){break}let f=s.split(/\\r\\n|\\r|\\n|\\u2028|\\u2029/)[+g[2]-1]||"",h=+g[3]-1,w=f.slice(h,h+n.length)===n?n.length:0;return{file:g[1],namespace:"file",line:+g[2],column:Z(f.slice(0,h)).length,length:Z(f.slice(h,h+w)).length,lineText:f+`\n`+t.slice(1).join(`\n`),suggestion:""}}break}}return null}function fe(e,t,n){let i=5;e+=t.length<1?"":` with ${t.length} error${t.length<2?"":"s"}:`+t.slice(0,i+1).map((l,g)=>{if(g===i)return`\n...`;if(!l.location)return`\nerror: ${l.text}`;let{file:s,line:f,column:h}=l.location,w=l.pluginName?`[plugin: ${l.pluginName}] `:"";return`\n${s}:${f}:${h}: ERROR: ${w}${l.text}`}).join("");let a=new Error(e);for(let[l,g]of[["errors",t],["warnings",n]])Object.defineProperty(a,l,{configurable:!0,enumerable:!0,get:()=>g,set:s=>Object.defineProperty(a,l,{configurable:!0,enumerable:!0,value:s})});return a}function ue(e,t){for(let n of e)n.detail=t.load(n.detail);return e}function Te(e,t,n){if(e==null)return null;let i={},a=r(e,i,"file",y),l=r(e,i,"namespace",y),g=r(e,i,"line",se),s=r(e,i,"column",se),f=r(e,i,"length",se),h=r(e,i,"lineText",y),w=r(e,i,"suggestion",y);if(V(e,i,t),h){let M=h.slice(0,(s&&s>0?s:0)+(f&&f>0?f:0)+(n&&n>0?n:80));!/[\\x7F-\\uFFFF]/.test(M)&&!/\\n/.test(h)&&(h=M)}return{file:a||"",namespace:l||"",line:g||0,column:s||0,length:f||0,lineText:h||"",suggestion:w||""}}function re(e,t,n,i,a){let l=[],g=0;for(let s of e){let f={},h=r(s,f,"id",y),w=r(s,f,"pluginName",y),M=r(s,f,"text",y),L=r(s,f,"location",Fe),D=r(s,f,"notes",z),q=r(s,f,"detail",ye),G=`in element ${g} of "${t}"`;V(s,f,G);let U=[];if(D)for(let K of D){let Y={},v=r(K,Y,"text",y),m=r(K,Y,"location",Fe);V(K,Y,G),U.push({text:v||"",location:Te(m,G,a)})}l.push({id:h||"",pluginName:w||i,text:M||"",location:Te(L,G,a),notes:U,detail:n?n.store(q):-1}),g++}return l}function me(e,t){let n=[];for(let i of e){if(typeof i!="string")throw new Error(`${_(t)} must be an array of strings`);n.push(i)}return n}function ot(e,t){let n=Object.create(null);for(let i in e){let a=e[i];if(typeof a!="string")throw new Error(`key ${_(i)} in object ${_(t)} must be a string`);n[i]=a}return n}function at({path:e,contents:t,hash:n}){let i=null;return{path:e,contents:t,hash:n,get text(){let a=this.contents;return(i===null||a!==t)&&(t=a,i=ie(a)),i}}}var ct="0.21.5",ft=e=>de().build(e),dt=e=>de().context(e),pt=(e,t)=>de().transform(e,t),gt=(e,t)=>de().formatMessages(e,t),mt=(e,t)=>de().analyzeMetafile(e,t),yt=()=>{throw new Error(\'The "buildSync" API only works in node\')},ht=()=>{throw new Error(\'The "transformSync" API only works in node\')},bt=()=>{throw new Error(\'The "formatMessagesSync" API only works in node\')},wt=()=>{throw new Error(\'The "analyzeMetafileSync" API only works in node\')},vt=()=>(we&&we(),Promise.resolve()),oe,we,ve,de=()=>{if(ve)return ve;throw oe?new Error(\'You need to wait for the promise returned from "initialize" to be resolved before calling this\'):new Error(\'You need to call "initialize" before calling this\')},Rt=e=>{e=Ue(e||{});let t=e.wasmURL,n=e.wasmModule,i=e.worker!==!1;if(!t&&!n)throw new Error(\'Must provide either the "wasmURL" option or the "wasmModule" option\');if(oe)throw new Error(\'Cannot call "initialize" more than once\');return oe=xt(t||"",n,i),oe.catch(()=>{oe=void 0}),oe},xt=(e,t,n)=>ne(void 0,null,function*(){let i;if(n){let h=new Blob([\'onmessage=(postMessage=>{\\n// Copyright 2018 The Go Authors. All rights reserved.\\n// Use of this source code is governed by a BSD-style\\n// license that can be found in the LICENSE file.\\nvar y=(r,f,m)=>new Promise((c,n)=>{var s=u=>{try{l(m.next(u))}catch(h){n(h)}},i=u=>{try{l(m.throw(u))}catch(h){n(h)}},l=u=>u.done?c(u.value):Promise.resolve(u.value).then(s,i);l((m=m.apply(r,f)).next())});let onmessage,globalThis={};for(let r=self;r;r=Object.getPrototypeOf(r))for(let f of Object.getOwnPropertyNames(r))f in globalThis||Object.defineProperty(globalThis,f,{get:()=>self[f]});(()=>{const r=()=>{const c=new Error("not implemented");return c.code="ENOSYS",c};if(!globalThis.fs){let c="";globalThis.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(n,s){c+=m.decode(s);const i=c.lastIndexOf(`\\n`);return i!=-1&&(console.log(c.substring(0,i)),c=c.substring(i+1)),s.length},write(n,s,i,l,u,h){if(i!==0||l!==s.length||u!==null){h(r());return}const g=this.writeSync(n,s);h(null,g)},chmod(n,s,i){i(r())},chown(n,s,i,l){l(r())},close(n,s){s(r())},fchmod(n,s,i){i(r())},fchown(n,s,i,l){l(r())},fstat(n,s){s(r())},fsync(n,s){s(null)},ftruncate(n,s,i){i(r())},lchown(n,s,i,l){l(r())},link(n,s,i){i(r())},lstat(n,s){s(r())},mkdir(n,s,i){i(r())},open(n,s,i,l){l(r())},read(n,s,i,l,u,h){h(r())},readdir(n,s){s(r())},readlink(n,s){s(r())},rename(n,s,i){i(r())},rmdir(n,s){s(r())},stat(n,s){s(r())},symlink(n,s,i){i(r())},truncate(n,s,i){i(r())},unlink(n,s){s(r())},utimes(n,s,i,l){l(r())}}}if(globalThis.process||(globalThis.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw r()},pid:-1,ppid:-1,umask(){throw r()},cwd(){throw r()},chdir(){throw r()}}),!globalThis.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!globalThis.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!globalThis.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!globalThis.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const f=new TextEncoder("utf-8"),m=new TextDecoder("utf-8");globalThis.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=t=>{t!==0&&console.warn("exit code:",t)},this._exitPromise=new Promise(t=>{this._resolveExitPromise=t}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const c=(t,e)=>{this.mem.setUint32(t+0,e,!0),this.mem.setUint32(t+4,Math.floor(e/4294967296),!0)},n=t=>{const e=this.mem.getUint32(t+0,!0),o=this.mem.getInt32(t+4,!0);return e+o*4294967296},s=t=>{const e=this.mem.getFloat64(t,!0);if(e===0)return;if(!isNaN(e))return e;const o=this.mem.getUint32(t,!0);return this._values[o]},i=(t,e)=>{if(typeof e=="number"&&e!==0){if(isNaN(e)){this.mem.setUint32(t+4,2146959360,!0),this.mem.setUint32(t,0,!0);return}this.mem.setFloat64(t,e,!0);return}if(e===void 0){this.mem.setFloat64(t,0,!0);return}let a=this._ids.get(e);a===void 0&&(a=this._idPool.pop(),a===void 0&&(a=this._values.length),this._values[a]=e,this._goRefCounts[a]=0,this._ids.set(e,a)),this._goRefCounts[a]++;let d=0;switch(typeof e){case"object":e!==null&&(d=1);break;case"string":d=2;break;case"symbol":d=3;break;case"function":d=4;break}this.mem.setUint32(t+4,2146959360|d,!0),this.mem.setUint32(t,a,!0)},l=t=>{const e=n(t+0),o=n(t+8);return new Uint8Array(this._inst.exports.mem.buffer,e,o)},u=t=>{const e=n(t+0),o=n(t+8),a=new Array(o);for(let d=0;d<o;d++)a[d]=s(e+d*8);return a},h=t=>{const e=n(t+0),o=n(t+8);return m.decode(new DataView(this._inst.exports.mem.buffer,e,o))},g=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":t=>{t>>>=0;const e=this.mem.getInt32(t+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(e)},"runtime.wasmWrite":t=>{t>>>=0;const e=n(t+8),o=n(t+16),a=this.mem.getInt32(t+24,!0);globalThis.fs.writeSync(e,new Uint8Array(this._inst.exports.mem.buffer,o,a))},"runtime.resetMemoryDataView":t=>{t>>>=0,this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":t=>{t>>>=0,c(t+8,(g+performance.now())*1e6)},"runtime.walltime":t=>{t>>>=0;const e=new Date().getTime();c(t+8,e/1e3),this.mem.setInt32(t+16,e%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":t=>{t>>>=0;const e=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(e,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(e);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},n(t+8)+1)),this.mem.setInt32(t+16,e,!0)},"runtime.clearTimeoutEvent":t=>{t>>>=0;const e=this.mem.getInt32(t+8,!0);clearTimeout(this._scheduledTimeouts.get(e)),this._scheduledTimeouts.delete(e)},"runtime.getRandomData":t=>{t>>>=0,crypto.getRandomValues(l(t+8))},"syscall/js.finalizeRef":t=>{t>>>=0;const e=this.mem.getUint32(t+8,!0);if(this._goRefCounts[e]--,this._goRefCounts[e]===0){const o=this._values[e];this._values[e]=null,this._ids.delete(o),this._idPool.push(e)}},"syscall/js.stringVal":t=>{t>>>=0,i(t+24,h(t+8))},"syscall/js.valueGet":t=>{t>>>=0;const e=Reflect.get(s(t+8),h(t+16));t=this._inst.exports.getsp()>>>0,i(t+32,e)},"syscall/js.valueSet":t=>{t>>>=0,Reflect.set(s(t+8),h(t+16),s(t+32))},"syscall/js.valueDelete":t=>{t>>>=0,Reflect.deleteProperty(s(t+8),h(t+16))},"syscall/js.valueIndex":t=>{t>>>=0,i(t+24,Reflect.get(s(t+8),n(t+16)))},"syscall/js.valueSetIndex":t=>{t>>>=0,Reflect.set(s(t+8),n(t+16),s(t+24))},"syscall/js.valueCall":t=>{t>>>=0;try{const e=s(t+8),o=Reflect.get(e,h(t+16)),a=u(t+32),d=Reflect.apply(o,e,a);t=this._inst.exports.getsp()>>>0,i(t+56,d),this.mem.setUint8(t+64,1)}catch(e){t=this._inst.exports.getsp()>>>0,i(t+56,e),this.mem.setUint8(t+64,0)}},"syscall/js.valueInvoke":t=>{t>>>=0;try{const e=s(t+8),o=u(t+16),a=Reflect.apply(e,void 0,o);t=this._inst.exports.getsp()>>>0,i(t+40,a),this.mem.setUint8(t+48,1)}catch(e){t=this._inst.exports.getsp()>>>0,i(t+40,e),this.mem.setUint8(t+48,0)}},"syscall/js.valueNew":t=>{t>>>=0;try{const e=s(t+8),o=u(t+16),a=Reflect.construct(e,o);t=this._inst.exports.getsp()>>>0,i(t+40,a),this.mem.setUint8(t+48,1)}catch(e){t=this._inst.exports.getsp()>>>0,i(t+40,e),this.mem.setUint8(t+48,0)}},"syscall/js.valueLength":t=>{t>>>=0,c(t+16,parseInt(s(t+8).length))},"syscall/js.valuePrepareString":t=>{t>>>=0;const e=f.encode(String(s(t+8)));i(t+16,e),c(t+24,e.length)},"syscall/js.valueLoadString":t=>{t>>>=0;const e=s(t+8);l(t+16).set(e)},"syscall/js.valueInstanceOf":t=>{t>>>=0,this.mem.setUint8(t+24,s(t+8)instanceof s(t+16)?1:0)},"syscall/js.copyBytesToGo":t=>{t>>>=0;const e=l(t+8),o=s(t+32);if(!(o instanceof Uint8Array||o instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const a=o.subarray(0,e.length);e.set(a),c(t+40,a.length),this.mem.setUint8(t+48,1)},"syscall/js.copyBytesToJS":t=>{t>>>=0;const e=s(t+8),o=l(t+16);if(!(e instanceof Uint8Array||e instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const a=o.subarray(0,e.length);e.set(a),c(t+40,a.length),this.mem.setUint8(t+48,1)},debug:t=>{console.log(t)}}}}run(c){return y(this,null,function*(){if(!(c instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=c,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,globalThis,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[globalThis,5],[this,6]]),this._idPool=[],this.exited=!1;let n=4096;const s=t=>{const e=n,o=f.encode(t+"\\\\0");return new Uint8Array(this.mem.buffer,n,o.length).set(o),n+=o.length,n%8!==0&&(n+=8-n%8),e},i=this.argv.length,l=[];this.argv.forEach(t=>{l.push(s(t))}),l.push(0),Object.keys(this.env).sort().forEach(t=>{l.push(s(`${t}=${this.env[t]}`))}),l.push(0);const h=n;if(l.forEach(t=>{this.mem.setUint32(n,t,!0),this.mem.setUint32(n+4,0,!0),n+=8}),n>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(i,h),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(c){const n=this;return function(){const s={id:c,this:this,args:arguments};return n._pendingEvent=s,n._resume(),s.result}}}})(),onmessage=({data:r})=>{let f=new TextDecoder,m=globalThis.fs,c="";m.writeSync=(u,h)=>{if(u===1)postMessage(h);else if(u===2){c+=f.decode(h);let g=c.split(`\\n`);g.length>1&&console.log(g.slice(0,-1).join(`\\n`)),c=g[g.length-1]}else throw new Error("Bad write");return h.length};let n=[],s,i=0;onmessage=({data:u})=>(u.length>0&&(n.push(u),s&&s()),l),m.read=(u,h,g,t,e,o)=>{if(u!==0||g!==0||t!==h.length||e!==null)throw new Error("Bad read");if(n.length===0){s=()=>m.read(u,h,g,t,e,o);return}let a=n[0],d=Math.max(0,Math.min(t,a.length-i));h.set(a.subarray(i,i+d),g),i+=d,i===a.length&&(n.shift(),i=0),o(null,d)};let l=new globalThis.Go;return l.argv=["","--service=0.21.5"],tryToInstantiateModule(r,l).then(u=>{postMessage(null),l.run(u)},u=>{postMessage(u)}),l};function tryToInstantiateModule(r,f){return y(this,null,function*(){if(r instanceof WebAssembly.Module)return WebAssembly.instantiate(r,f.importObject);const m=yield fetch(r);if(!m.ok)throw new Error(`Failed to download ${JSON.stringify(r)}`);if("instantiateStreaming"in WebAssembly&&/^application\\\\/wasm($|;)/i.test(m.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(m,f.importObject)).instance;const c=yield m.arrayBuffer();return(yield WebAssembly.instantiate(c,f.importObject)).instance})}return r=>onmessage(r);})(postMessage)\'],{type:"text/javascript"});i=new Worker(URL.createObjectURL(h))}else{let h=(postMessage=>{\n// Copyright 2018 The Go Authors. All rights reserved.\n// Use of this source code is governed by a BSD-style\n// license that can be found in the LICENSE file.\nvar y=(r,f,m)=>new Promise((c,n)=>{var s=u=>{try{l(m.next(u))}catch(h){n(h)}},i=u=>{try{l(m.throw(u))}catch(h){n(h)}},l=u=>u.done?c(u.value):Promise.resolve(u.value).then(s,i);l((m=m.apply(r,f)).next())});let onmessage,globalThis={};for(let r=self;r;r=Object.getPrototypeOf(r))for(let f of Object.getOwnPropertyNames(r))f in globalThis||Object.defineProperty(globalThis,f,{get:()=>self[f]});(()=>{const r=()=>{const c=new Error("not implemented");return c.code="ENOSYS",c};if(!globalThis.fs){let c="";globalThis.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(n,s){c+=m.decode(s);const i=c.lastIndexOf(`\n`);return i!=-1&&(console.log(c.substring(0,i)),c=c.substring(i+1)),s.length},write(n,s,i,l,u,h){if(i!==0||l!==s.length||u!==null){h(r());return}const g=this.writeSync(n,s);h(null,g)},chmod(n,s,i){i(r())},chown(n,s,i,l){l(r())},close(n,s){s(r())},fchmod(n,s,i){i(r())},fchown(n,s,i,l){l(r())},fstat(n,s){s(r())},fsync(n,s){s(null)},ftruncate(n,s,i){i(r())},lchown(n,s,i,l){l(r())},link(n,s,i){i(r())},lstat(n,s){s(r())},mkdir(n,s,i){i(r())},open(n,s,i,l){l(r())},read(n,s,i,l,u,h){h(r())},readdir(n,s){s(r())},readlink(n,s){s(r())},rename(n,s,i){i(r())},rmdir(n,s){s(r())},stat(n,s){s(r())},symlink(n,s,i){i(r())},truncate(n,s,i){i(r())},unlink(n,s){s(r())},utimes(n,s,i,l){l(r())}}}if(globalThis.process||(globalThis.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw r()},pid:-1,ppid:-1,umask(){throw r()},cwd(){throw r()},chdir(){throw r()}}),!globalThis.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!globalThis.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!globalThis.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!globalThis.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const f=new TextEncoder("utf-8"),m=new TextDecoder("utf-8");globalThis.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=t=>{t!==0&&console.warn("exit code:",t)},this._exitPromise=new Promise(t=>{this._resolveExitPromise=t}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const c=(t,e)=>{this.mem.setUint32(t+0,e,!0),this.mem.setUint32(t+4,Math.floor(e/4294967296),!0)},n=t=>{const e=this.mem.getUint32(t+0,!0),o=this.mem.getInt32(t+4,!0);return e+o*4294967296},s=t=>{const e=this.mem.getFloat64(t,!0);if(e===0)return;if(!isNaN(e))return e;const o=this.mem.getUint32(t,!0);return this._values[o]},i=(t,e)=>{if(typeof e=="number"&&e!==0){if(isNaN(e)){this.mem.setUint32(t+4,2146959360,!0),this.mem.setUint32(t,0,!0);return}this.mem.setFloat64(t,e,!0);return}if(e===void 0){this.mem.setFloat64(t,0,!0);return}let a=this._ids.get(e);a===void 0&&(a=this._idPool.pop(),a===void 0&&(a=this._values.length),this._values[a]=e,this._goRefCounts[a]=0,this._ids.set(e,a)),this._goRefCounts[a]++;let d=0;switch(typeof e){case"object":e!==null&&(d=1);break;case"string":d=2;break;case"symbol":d=3;break;case"function":d=4;break}this.mem.setUint32(t+4,2146959360|d,!0),this.mem.setUint32(t,a,!0)},l=t=>{const e=n(t+0),o=n(t+8);return new Uint8Array(this._inst.exports.mem.buffer,e,o)},u=t=>{const e=n(t+0),o=n(t+8),a=new Array(o);for(let d=0;d<o;d++)a[d]=s(e+d*8);return a},h=t=>{const e=n(t+0),o=n(t+8);return m.decode(new DataView(this._inst.exports.mem.buffer,e,o))},g=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":t=>{t>>>=0;const e=this.mem.getInt32(t+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(e)},"runtime.wasmWrite":t=>{t>>>=0;const e=n(t+8),o=n(t+16),a=this.mem.getInt32(t+24,!0);globalThis.fs.writeSync(e,new Uint8Array(this._inst.exports.mem.buffer,o,a))},"runtime.resetMemoryDataView":t=>{t>>>=0,this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":t=>{t>>>=0,c(t+8,(g+performance.now())*1e6)},"runtime.walltime":t=>{t>>>=0;const e=new Date().getTime();c(t+8,e/1e3),this.mem.setInt32(t+16,e%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":t=>{t>>>=0;const e=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(e,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(e);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},n(t+8)+1)),this.mem.setInt32(t+16,e,!0)},"runtime.clearTimeoutEvent":t=>{t>>>=0;const e=this.mem.getInt32(t+8,!0);clearTimeout(this._scheduledTimeouts.get(e)),this._scheduledTimeouts.delete(e)},"runtime.getRandomData":t=>{t>>>=0,crypto.getRandomValues(l(t+8))},"syscall/js.finalizeRef":t=>{t>>>=0;const e=this.mem.getUint32(t+8,!0);if(this._goRefCounts[e]--,this._goRefCounts[e]===0){const o=this._values[e];this._values[e]=null,this._ids.delete(o),this._idPool.push(e)}},"syscall/js.stringVal":t=>{t>>>=0,i(t+24,h(t+8))},"syscall/js.valueGet":t=>{t>>>=0;const e=Reflect.get(s(t+8),h(t+16));t=this._inst.exports.getsp()>>>0,i(t+32,e)},"syscall/js.valueSet":t=>{t>>>=0,Reflect.set(s(t+8),h(t+16),s(t+32))},"syscall/js.valueDelete":t=>{t>>>=0,Reflect.deleteProperty(s(t+8),h(t+16))},"syscall/js.valueIndex":t=>{t>>>=0,i(t+24,Reflect.get(s(t+8),n(t+16)))},"syscall/js.valueSetIndex":t=>{t>>>=0,Reflect.set(s(t+8),n(t+16),s(t+24))},"syscall/js.valueCall":t=>{t>>>=0;try{const e=s(t+8),o=Reflect.get(e,h(t+16)),a=u(t+32),d=Reflect.apply(o,e,a);t=this._inst.exports.getsp()>>>0,i(t+56,d),this.mem.setUint8(t+64,1)}catch(e){t=this._inst.exports.getsp()>>>0,i(t+56,e),this.mem.setUint8(t+64,0)}},"syscall/js.valueInvoke":t=>{t>>>=0;try{const e=s(t+8),o=u(t+16),a=Reflect.apply(e,void 0,o);t=this._inst.exports.getsp()>>>0,i(t+40,a),this.mem.setUint8(t+48,1)}catch(e){t=this._inst.exports.getsp()>>>0,i(t+40,e),this.mem.setUint8(t+48,0)}},"syscall/js.valueNew":t=>{t>>>=0;try{const e=s(t+8),o=u(t+16),a=Reflect.construct(e,o);t=this._inst.exports.getsp()>>>0,i(t+40,a),this.mem.setUint8(t+48,1)}catch(e){t=this._inst.exports.getsp()>>>0,i(t+40,e),this.mem.setUint8(t+48,0)}},"syscall/js.valueLength":t=>{t>>>=0,c(t+16,parseInt(s(t+8).length))},"syscall/js.valuePrepareString":t=>{t>>>=0;const e=f.encode(String(s(t+8)));i(t+16,e),c(t+24,e.length)},"syscall/js.valueLoadString":t=>{t>>>=0;const e=s(t+8);l(t+16).set(e)},"syscall/js.valueInstanceOf":t=>{t>>>=0,this.mem.setUint8(t+24,s(t+8)instanceof s(t+16)?1:0)},"syscall/js.copyBytesToGo":t=>{t>>>=0;const e=l(t+8),o=s(t+32);if(!(o instanceof Uint8Array||o instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const a=o.subarray(0,e.length);e.set(a),c(t+40,a.length),this.mem.setUint8(t+48,1)},"syscall/js.copyBytesToJS":t=>{t>>>=0;const e=s(t+8),o=l(t+16);if(!(e instanceof Uint8Array||e instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const a=o.subarray(0,e.length);e.set(a),c(t+40,a.length),this.mem.setUint8(t+48,1)},debug:t=>{console.log(t)}}}}run(c){return y(this,null,function*(){if(!(c instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=c,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,globalThis,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[globalThis,5],[this,6]]),this._idPool=[],this.exited=!1;let n=4096;const s=t=>{const e=n,o=f.encode(t+"\\0");return new Uint8Array(this.mem.buffer,n,o.length).set(o),n+=o.length,n%8!==0&&(n+=8-n%8),e},i=this.argv.length,l=[];this.argv.forEach(t=>{l.push(s(t))}),l.push(0),Object.keys(this.env).sort().forEach(t=>{l.push(s(`${t}=${this.env[t]}`))}),l.push(0);const h=n;if(l.forEach(t=>{this.mem.setUint32(n,t,!0),this.mem.setUint32(n+4,0,!0),n+=8}),n>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(i,h),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(c){const n=this;return function(){const s={id:c,this:this,args:arguments};return n._pendingEvent=s,n._resume(),s.result}}}})(),onmessage=({data:r})=>{let f=new TextDecoder,m=globalThis.fs,c="";m.writeSync=(u,h)=>{if(u===1)postMessage(h);else if(u===2){c+=f.decode(h);let g=c.split(`\n`);g.length>1&&console.log(g.slice(0,-1).join(`\n`)),c=g[g.length-1]}else throw new Error("Bad write");return h.length};let n=[],s,i=0;onmessage=({data:u})=>(u.length>0&&(n.push(u),s&&s()),l),m.read=(u,h,g,t,e,o)=>{if(u!==0||g!==0||t!==h.length||e!==null)throw new Error("Bad read");if(n.length===0){s=()=>m.read(u,h,g,t,e,o);return}let a=n[0],d=Math.max(0,Math.min(t,a.length-i));h.set(a.subarray(i,i+d),g),i+=d,i===a.length&&(n.shift(),i=0),o(null,d)};let l=new globalThis.Go;return l.argv=["","--service=0.21.5"],tryToInstantiateModule(r,l).then(u=>{postMessage(null),l.run(u)},u=>{postMessage(u)}),l};function tryToInstantiateModule(r,f){return y(this,null,function*(){if(r instanceof WebAssembly.Module)return WebAssembly.instantiate(r,f.importObject);const m=yield fetch(r);if(!m.ok)throw new Error(`Failed to download ${JSON.stringify(r)}`);if("instantiateStreaming"in WebAssembly&&/^application\\/wasm($|;)/i.test(m.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(m,f.importObject)).instance;const c=yield m.arrayBuffer();return(yield WebAssembly.instantiate(c,f.importObject)).instance})}return r=>onmessage(r);})(M=>i.onmessage({data:M})),w;i={onmessage:null,postMessage:M=>setTimeout(()=>w=h({data:M})),terminate(){if(w)for(let M of w._scheduledTimeouts.values())clearTimeout(M)}}}let a,l,g=new Promise((h,w)=>{a=h,l=w});i.onmessage=({data:h})=>{i.onmessage=({data:w})=>s(w),h?l(h):a()},i.postMessage(t||new URL(e,location.href).toString());let{readFromStdout:s,service:f}=qe({writeToStdin(h){i.postMessage(h)},isSync:!1,hasFS:!1,esbuild:Re});yield g,we=()=>{i.terminate(),oe=void 0,we=void 0,ve=void 0},ve={build:h=>new Promise((w,M)=>f.buildOrContext({callName:"build",refs:null,options:h,isTTY:!1,defaultWD:"/",callback:(L,D)=>L?M(L):w(D)})),context:h=>new Promise((w,M)=>f.buildOrContext({callName:"context",refs:null,options:h,isTTY:!1,defaultWD:"/",callback:(L,D)=>L?M(L):w(D)})),transform:(h,w)=>new Promise((M,L)=>f.transform({callName:"transform",refs:null,input:h,options:w||{},isTTY:!1,fs:{readFile(D,q){q(new Error("Internal error"),null)},writeFile(D,q){q(null)}},callback:(D,q)=>D?L(D):M(q)})),formatMessages:(h,w)=>new Promise((M,L)=>f.formatMessages({callName:"formatMessages",refs:null,messages:h,options:w,callback:(D,q)=>D?L(D):M(q)})),analyzeMetafile:(h,w)=>new Promise((M,L)=>f.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof h=="string"?h:JSON.stringify(h),options:w,callback:(D,q)=>D?L(D):M(q)}))}}),Ot=Re;\n})(typeof module==="object"?module:{set exports(x){(typeof self!=="undefined"?self:this).esbuild=x}});\n',metaType:"application/javascript"},"/modules/p2p/index.js":{content:`import $APP from "/bootstrap.js";

const p2p = {};
$APP.events.install(p2p);
$APP.addModule({
	name: "p2p",
	frontend: true,
	backend: true,
	base: p2p,
});
`,metaType:"application/javascript"},"/modules/p2p/frontend.js":{content:`import $APP from "/bootstrap.js";

const events = {
	"P2P:SEND_DATA_OP": ({ payload }) => {
		console.log("P2P DATA OP", { payload });
		$APP.p2p.emit("SEND_DATA_OP", payload);
	},
};
$APP.events.set(events);
`,metaType:"application/javascript"},"/theme.css":{content:`body {
	font-family: var(--font-family);
}

html,
body {
	font-family: var(--font-family);
	background-color: var(--background-color) !important;
	color: var(--text-color) !important;
	width: 100%;
	min-height: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}

body:not(.production) *:not(:defined) {
	border: 1px solid red;
}

.dark {
	filter: invert(1) hue-rotate(180deg);
}

.dark img,
.dark dialog,
.dark video,
.dark iframe {
	filter: invert(1) hue-rotate(180deg);
}

html {
	font-size: 14px;
}

@media (max-width: 768px) {
	html {
		font-size: 18px;
	}
}

@media (max-width: 480px) {
	html {
		font-size: 20px;
	}
}

textarea {
	font-family: inherit;
	font-feature-settings: inherit;
	font-variation-settings: inherit;
	font-size: 100%;
	font-weight: inherit;
	line-height: inherit;
	color: inherit;
	margin: 0;
	padding: 0;
}

:root {
	box-sizing: border-box;
	-moz-text-size-adjust: none;
	-webkit-text-size-adjust: none;
	text-size-adjust: none;
	line-height: 1.2;
	-webkit-font-smoothing: antialiased;
}
*,
*::before,
*::after {
	box-sizing: border-box;
}
* {
	margin: 0;
}
body {
	-webkit-font-smoothing: antialiased;
}
a {
	color: currentColor;
	text-decoration: none;
	font-family: var(--font-family);
}

button,
textarea,
select {
	background-color: inherit;
	border-width: 0;
	color: inherit;
}
img,
picture,
video,
canvas,
svg {
	display: block;
	max-width: 100%;
}
input,
button,
textarea,
select {
	font: inherit;
}
p,
h1,
h2,
h3,
h4,
h5,
h6 {
	font-family: var(--font-family);
	overflow-wrap: break-word;
}

dialog::backdrop {
	background-color: rgba(0, 0, 0, 0.8);
}

*::-webkit-scrollbar {
	width: 8px;
	margin-right: 10px;
}

*::-webkit-scrollbar-track {
	background: transparent;
}

*::-webkit-scrollbar-thumb {
	&:hover {
		scrollbar-color: rgba(154, 153, 150, 0.8) transparent;
	}
	border-radius: 10px;
	border: none;
}

*::-webkit-scrollbar-button {
	background: transparent;
	color: transparent;
}

* {
	scrollbar-width: thin;
	scrollbar-color: transparent transparent;
	&:hover {
		scrollbar-color: rgba(154, 153, 150, 0.8) transparent;
	}
}

[full] {
	width: 100%;
	height: 100vh;
}

[w-full] {
	width: 100%;
}

[grow] {
	flex-grow: 1;
}

[hide] {
	display: none !important;
}

.hide {
	display: none !important;
}

[noscroll] {
	overflow: hidden;
}

div [container] {
	display: flex;
}

div [container][horizontal] {
	display: flex;
	flex-direction: col;
}
`,metaType:"text/css"},"/worker.js":{content:`import $APP from "/bootstrap.js";

let STARTED;

const bootstrap = async (_project) => {
	console.log("App Worker: bootstrap() called");
	const url = new URL(self.location);
	const param = url.searchParams.get("project");
	const project = param ? JSON.parse(decodeURIComponent(param)) : {};
	project.backend = true;
	const APP = await $APP.bootstrap({
		backend: true,
		...(project || {}),
		settings: {
			...(project.settings || {}),
			preview: !!self.IS_PREVIEW,
			IS_MV3: !!self.chrome,
		},
	});

	if (APP && !STARTED) {
		console.log("App Worker: Initializing backend application");
		await $APP.Backend.bootstrap(APP);
	}
	return APP;
};

let app;
let commsPort;
const events = [];
const MessageHandler = {
	handleMessage: async ({ data }) => {
		if (data.eventId && events.includes(data.eventId)) return;
		if (data.eventId) events.push(data.eventId);

		const respond =
			data.eventId &&
			((responsePayload) => {
				if (commsPort) {
					commsPort.postMessage({
						eventId: data.eventId,
						payload: responsePayload,
						connection: data.connection,
					});
				}
			});

		if (data.type === "LOAD_APP" && $APP.settings.preview) {
			const project = data?.payload?.project;
			if (!project) return;
			if (app) {
				console.info("App Worker: Restarting existing application");
				app.restart();
			}
			app = await bootstrap(project);
		}

		if ($APP?.Backend) {
			console.info(\`App Worker: Routing message to backend: \${data.type}\`);
			$APP.Backend.handleMessage({
				data,
				respond,
			});
		} else {
			$APP.hooks.add("APP:BACKEND_STARTED", async () => {
				console.info(
					\`App Worker: Routing message to backend after APP:BACKEND_STARTED: \${data.type}\`,
				);
				$APP.Backend.handleMessage({
					data,
					respond,
				});
			});
		}
	},
};

self.addEventListener("message", async (event) => {
	if (event.data.type === "INIT_PORT") {
		commsPort = event.ports[0];
		console.warn("App Worker: Communication port initialized.");
		commsPort.onmessage = MessageHandler.handleMessage;
		(async () => {
			app = await bootstrap();
			$APP.Backend.client = commsPort;
		})();
	}
});
`,metaType:"application/javascript"},"/modules/mvc/view/backend.js":{content:`import $APP from "/bootstrap.js";

const getTagProps = async (tag) => {
	return $APP.Backend.requestFromClient("GET_TAG_PROPS", { tag });
};
$APP.addFunctions({ name: "view", functions: { getTagProps } });
`,metaType:"application/javascript"},"/modules/mvc/controller/backend/backend.js":{content:`import $APP from "/bootstrap.js";
import Model from "/modules/mvc/model/backend.js";
import Database from "/modules/mvc/model/database/index.js";

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

	const eventId = \`backend-request-\${nextRequestId++}\`;

	return new Promise((resolve, reject) => {
		pendingBackendRequests[eventId] = { resolve, reject };
		setTimeout(() => {
			delete pendingBackendRequests[eventId];
			reject(new Error(\`Request timed out after \${timeout}ms\`));
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
	const eventId = \`sw_\${nextRequestId++}\`;
	return new Promise((resolve, reject) => {
		pendingBackendRequests[eventId] = { resolve, reject };
		client.postMessage({ type, payload, eventId });
	});
};

function createModelAdder({ $APP, getApp, debounceDelay = 50 }) {
	let debounceTimer;

	const processModelAdditions = async () => {
		$APP.log(\`Batch processing \${$APP.dynamicModels.length} model(s)...\`);

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
				\`Batch add successful. \${$APP.dynamicModels.length} model(s) added. App version is now \${newVersion}.\`,
			);

			await Database.reload({
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
		$APP.log(\`Model "\${name}" queued for addition.\`);
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
		Database.app = await SysModel.edit($APP.settings.sysmodels.APP, {
			id: app.id,
			migrationTimestamp: Date.now(),
		});
	}
};

const setupAppEnvironment = async (app) => {
	Database.app = app;
	await Database.reload({
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
		const dump = await Database.createDBDump();
		respond(dump);
	},

	LOAD_DB_DUMP: async ({ payload, respond = console.log }) => {
		try {
			Database.loadDBDump(payload);
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
`,metaType:"application/javascript"},"/modules/mvc/model/backend.js":{content:`import $APP from "/bootstrap.js";
import Database from "/modules/mvc/model/database/index.js";
import Model from "/modules/mvc/model/index.js";

const queryModelEvents = {
	DISCONNECT: (_, { port }) => port.removePort(),
	CREATE_REMOTE_WORKSPACE: async ({ payload }, { importDB }) =>
		importDB(payload),
	ADD_REMOTE_USER: async ({ payload }) => $APP.Backend.createUserEntry(payload),
	ADD: async ({ payload, respond }) => {
		const response = await Database.add(
			payload.model,
			payload.row,
			payload.opts,
		);
		respond(response);
	},
	ADD_MANY: async ({ payload, respond }) => {
		const response = await Database.addMany(
			payload.model,
			payload.rows,
			payload.opts,
		);
		respond({ success: true, results: response });
	},
	REMOVE: async ({ payload, respond }) => {
		const response = await Database.remove(
			payload.model,
			payload.id,
			payload.opts,
		);
		respond(response);
	},
	REMOVE_MANY: async ({ payload, respond }) => {
		const response = await Database.removeMany(
			payload.model,
			payload.ids,
			payload.opts,
		);
		respond({ success: true, results: response });
	},
	EDIT: async ({ payload, respond }) => {
		const response = await Database.edit(
			payload.model,
			payload.row,
			payload.opts,
		);
		respond(response);
	},
	EDIT_MANY: async ({ payload, respond }) => {
		const response = await Database.editMany(
			payload.model,
			payload.rows,
			payload.opts,
		);
		respond({ success: true, results: response });
	},
	GET: async ({ payload, respond }) => {
		const { id, model, opts = {} } = payload;
		const response = await Database.get(
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
		const response = await Database.getMany(model, opts.filter, opts);
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
		} else resolve({ success: false, error: \`Action "\${action}" not found.\` });
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
					key: \`get:\${row[key]}\`,
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

	console.log(\`New extensions found: \${newExtensions.join(", ")}\`);

	newExtensions.forEach((extensionName) => {
		console.log(\`Initializing extension: \${extensionName}\`);
		$APP.DatabaseExtensions.add(extensionName);
	});

	const allExtensions = [...currentExtensions, ...newExtensions];
	db.edit(model, { ...row, extensions: allExtensions });
};

$APP.hooks.set({
	"ModelAddRecord-App": handleExtensions,
	"ModelEditRecord-App": handleExtensions,

	onAddRecord({ model, row, system }) {
		if (system) return;
		$APP.Backend.broadcast({
			type: "REQUEST_DATA_SYNC",
			payload: { key: \`get:\${row.id}\`, model, data: row },
		});
		syncRelationships({ model, row });
		console.log("BROADCAST MESSAGE", {
			system,
			type: "REQUEST_DATA_SYNC",
			payload: { key: \`get:\${row.id}\`, model, data: row },
		});
	},

	onEditRecord({ model, row, system }) {
		if (system) return;
		$APP.Backend.broadcast({
			type: "REQUEST_DATA_SYNC",
			payload: { key: \`get:\${row.id}\`, model, data: row },
		});
		syncRelationships({ model, row });
	},

	onRemoveRecord({ model, row, id, system }) {
		if (system) return;
		$APP.Backend.broadcast({
			type: "REQUEST_DATA_SYNC",
			payload: { key: \`get:\${id}\`, model, data: undefined },
		});
		syncRelationships({ model, row });
	},
});

Model.request = request;
export default Model;
`,metaType:"application/javascript"},"/modules/mvc/model/database/index.js":{content:`import $APP from "/bootstrap.js";
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
			.filter(([_, schema]) => Object.hasOwn(schema, \`$\${ext}\`))
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

const createDatabase = () => {
	let models;
	let version;
	let name;
	let db;
	let system;
	const extdbs = {};
	const stores = {};

	const open = async (props = {}) => {
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
					name: \`\${name}_\${ext}\`,
					version,
					models: filterExtensionModels(models, ext),
				});
			});
		}
	};

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
					let filter;
					if (polymorphic) {
						const searchPolymorphicId = \`\${modelName}@\${row.id}\`;
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
			return db?.version;
		},
		open,
		stores,
		reload: open,
		count: (...args) => db.count(...args),
		isEmpty: (...args) => db.isEmpty(...args),
		async put(model, row = {}, opts = {}) {
			const { skipRelationship = false, currentRow = {} } = opts;
			const properties = models[model];
			if (!properties)
				return console.error(
					\`Model \${model} not found. current schema version: \${version} / \${db.version}\`,
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
										? \`\${childModel}@\${newChildRow.id}\`
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
							\`ERROR: couldn't find target model '\${prop.targetModel}' for relationship '\${propKey}' on model '\${model}'\`,
						);
						continue;
					}
					const fkProp = models[prop.targetModel]?.[prop.targetForeignKey];
					if (!fkProp) {
						if (!prop.belongs) {
							console.warn(
								\`WARN: couldn't find target foreign key '\${prop.targetForeignKey}' in model '\${prop.targetModel}' for relationship '\${propKey}' from '\${model}'. This might be a one-way definition or configuration issue.\`,
							);
						}
						continue;
					}
					if (fkProp.belongs) {
						const effectiveFkId = fkProp.polymorphic ? \`\${model}@\${id}\` : id;
						const targetIsMany = fkProp.many;

						if (targetIsMany) {
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
							const targetId =
								typeof relatedValue === "string"
									? relatedValue
									: relatedValue?.id;
							if (targetId) {
								const target = await api.get(prop.targetModel, targetId);
								if (target) {
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
				await _loadRelationshipsForMany([row], model, includes, opts);
			}
			if (row && recursive) {
				const visited = new Set();
				let itemsToProcess = [row];
				const relationName = recursive;
				while (itemsToProcess.length > 0) {
					const currentBatch = [];
					for (const item of itemsToProcess) {
						const modelForVisitor = item._modelName || model;
						const visitedKey = \`\${modelForVisitor}@\${item.id}\`;
						if (!visited.has(visitedKey)) {
							visited.add(visitedKey);
							currentBatch.push(item);
						}
					}

					if (currentBatch.length === 0) break;

					await _loadRelationshipsForMany(
						currentBatch,
						model,
						[relationName],
						opts,
					);

					itemsToProcess = [];
					for (const item of currentBatch) {
						const children = item[relationName];
						if (Array.isArray(children)) {
							children.forEach((child) => {
								if (child) {
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
						const visitedKey = \`\${modelForVisitor}@\${item.id}\`;
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
				console.error(\`Model \${model} not found for removal.\`);
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
							? \`\${model}@\${id}\`
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
				[\`ModelRemoveRecord-\${model}\`, "onRemoveRecord"].forEach((event) =>
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
				console.warn(\`Record not found for edit: \${model} with id \${row.id}\`);
				return { errors: { record: "Record not found." }, model, row, opts };
			}
			const [errors, patchResult] = await api.put(
				model,
				{ ...opts.currentRow, ...row },
				opts,
			);

			if (errors) return { errors, model, row, opts };
			const system = isSystem(model);
			[\`ModelEditRecord-\${model}\`, "onEditRecord"].forEach((event) =>
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
			[\`ModelAddRecord-\${model}\`, "onAddRecord"].forEach((event) =>
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

export const SysModel = createDatabase();
await SysModel.open({
	name: $APP.settings.sysmodels.APP,
	version: 1,
	models: $APP.sysmodels,
	system: true,
});
$APP.setLibrary({
	name: "sysmodel",
	alias: "SysModel",
	base: SysModel,
});

const Database = createDatabase();

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

	await Database.open({
		name: app.id,
		version: app.version,
		extensions: app.extensions,
		system: false,
		models: { ...models, ...(app.models || {}) },
	});
	$APP.hooks.run("APP:DATABASE_STARTED");
});

export default Database;
`,metaType:"application/javascript"},"/modules/mvc/model/extensions/metadata.js":{content:`import $APP from "/bootstrap.js";
import Database from "/modules/mvc/model/database/index.js";
import T from "/modules/types/index.js";

$APP.hooks.set({
	onAddRecord({ model, row, system, extensions }) {
		if (system || !Database.extdbs || !extensions.includes("metadata")) return;
		const db = Database.extdbs.metadata;
		if (!db) return console.error("Metadata database instance not active.");
		db.put(model, {
			id: row.id,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		});
	},

	async onEditRecord({ model, row, system, extensions }) {
		if (system || !Database.extdbs || !extensions.includes("metadata")) return;
		const db = Database.extdbs.metadata;
		if (!db) return console.error("Metadata database instance not active.");
		const metadataRow = await db.get(model, row.id);
		metadataRow.updatedAt = Date.now();
		db.put(model, metadataRow);
	},

	onRemoveRecord({ model, id, system, extensions }) {
		if (system || !Database.extdbs || !extensions.includes("metadata")) return;
		const db = Database.extdbs.metadata;
		if (!db) return console.error("Metadata database instance not active.");
		db.remove(model, id);
	},
});

export default {
	createdAt: T.string({ index: true }).$,
	updatedAt: T.string({ index: true }).$,
	createdBy: T.string({ index: true }).$,
	updatedBy: T.string({ index: true }).$,
};
`,metaType:"application/javascript"},"/modules/mvc/model/extensions/operations.js":{content:`import $APP from "/bootstrap.js";
import Database from "/modules/mvc/model/database/index.js";
import T from "/modules/types/index.js";

$APP.hooks.set({
	onAddRecord({ model, row, system, extensions }) {
		if (system || !Database.extdbs || !extensions.includes("operations"))
			return;
		const db = Database.extdbs.operations;
		if (!db) return console.error("Operations database instance not active.");
		db.put(model, {
			timestamp: Date.now(),
			row,
		});
	},

	async onEditRecord({ model, row, system, extensions }) {
		if (system || !Database.extdbs || !extensions.includes("operations"))
			return;
		const db = Database.extdbs.operations;
		if (!db) return console.error("Operations database instance not active.");
		db.put(model, {
			timestamp: Date.now(),
			rowId: id,
			row,
		});
	},

	onRemoveRecord({ model, id, system, extensions }) {
		if (system || !Database.extdbs || !extensions.includes("operations"))
			return;
		const db = Database.extdbs.operations;
		if (!db) return console.error("Operations database instance not active.");
		db.put(model, {
			timestamp: Date.now(),
			removedAt: Date.now(),
			rowId: id,
		});
	},
});

export default {
	createdAt: T.string({ index: true }).$,
	removedAt: T.string().$,
	rowId: T.string({ index: true }).$,
	row: T.object().$,
};
`,metaType:"application/javascript"},"/modules/mvc/model/indexeddb/index.js":{content:`const parseBoolean = { true: 1, false: 0 };
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
				reject(new Error(\`Failed to open database: \${event.target.error}\`));
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
				reject(new Error(\`Failed to put: \${request.error}\`));
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
							new Error(\`Failed to getMany \${storeName}: \${request.error}\`),
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
						new Error(\`Failed to getMany \${storeName}: \${cursorRequest.error}\`),
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
						\`Failed to start transaction: \${error.message}. Query Props: \${JSON.stringify({ storeName, limit, offset, filter, order, keys })}\`,
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
					reject(new Error(\`Failed to get: \${cursorRequest.error}\`));
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
					reject(new Error(\`Failed to get: \${request.error}\`));
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
				reject(new Error(\`Failed to delete: \${request.error}\`));
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
					reject(new Error(\`Failed to count: \${request.error}\`));
				request.onsuccess = () => resolve(request.result);
			} else {
				const request = store.openCursor();
				let countNum = 0;
				request.onerror = () =>
					reject(new Error(\`Failed to count: \${request.error}\`));
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
				reject(new Error(\`Failed to clear: \${request.error}\`));
			request.onsuccess = () => resolve();
		});
	};

	const destroy = async () => {
		const dbNameToDelete = dbName;
		close();
		return new Promise((resolve, reject) => {
			const request = indexedDB.deleteDatabase(dbNameToDelete);
			request.onerror = () =>
				reject(new Error(\`Failed to delete database: \${request.error}\`));
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
				reject(new Error(\`Failed to export: \${request.error}\`));
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
						reject(new Error(\`Failed to import: \${firstError}\`));
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
						new Error(\`Transaction error during import: \${transaction.error}\`),
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

export default { open };
`,metaType:"application/javascript"},"/modules/apps/habits/backend.js":{content:`import $APP from "/bootstrap.js";
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
`,metaType:"application/javascript"},"/modules/p2p/backend.js":{content:`import $APP from "/bootstrap.js";
import Model from "/modules/mvc/model/backend.js";
import Database from "/modules/mvc/model/database/index.js";

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
		if (db) Database.loadDBDump({ app: env.app, dump: db });
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
`,metaType:"application/javascript"},"/manifest.json":{content:`{
	"manifest_version": 3,
	"name": "meetuprio",
	"version": "1.0",
	"description": "MV3 Development",
	"permissions": [
		"activeTab",
		"alarms",
		"background",
		"bookmarks",
		"browsingData",
		"clipboardRead",
		"clipboardWrite",
		"cookies",
		"debugger",
		"declarativeNetRequest",
		"declarativeNetRequestFeedback",
		"downloads",
		"history",
		"identity",
		"idle",
		"management",
		"nativeMessaging",
		"notifications",
		"pageCapture",
		"scripting",
		"storage",
		"tabs",
		"topSites",
		"unlimitedStorage",
		"webAuthenticationProxy",
		"webNavigation",
		"webRequest"
	],
	"action": {
		"default_popup": "popup.html"
	},
	"background": {
		"service_worker": "modules/backend/sw.js"
	},
	"host_permissions": ["<all_urls>"],
	"optional_host_permissions": [],
	"web_accessible_resources": [
		{
			"resources": ["*", "modules/*", "assets/*"],
			"matches": ["<all_urls>"]
		}
	],
	"icons": {
		"16": "assets/icons/icon_16.png",
		"48": "assets/icons/icon_48.png",
		"128": "assets/icons/icon_128.png"
	},
	"chrome_url_overrides": {
		"newtab": "extension.html"
	}
}
`,metaType:"application/json"},"/modules/uix/display/icon.js":{content:`import $APP from "/bootstrap.js";
import html, { css } from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

const { Icons, theme } = $APP;

export default {
	tag: "uix-icon",

	css: css\`& {
		display: inline-block;
		vertical-align: middle;	
	}
	
	&[solid] {
		stroke: currentColor;
		fill: currentColor;
	}\`,

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
						\`modules/icon-\${theme.font.icon.family}/\${theme.font.icon.family}/\${name}.svg\`,
					),
				);
				if (response.ok) {
					const svgElement = await response.text();
					Icons.set({ [name]: svgElement });
					this.svg = svgElement;
				} else {
					console.error(\`Failed to fetch icon: \${name}\`);
				}
			} catch (error) {
				console.error(\`Error fetching icon: \${name}\`, error);
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
`,metaType:"application/javascript"},"/modules/uix/display/card.js":{content:`import { css } from "/modules/mvc/view/html/index.js";

export default {
	tag: "uix-card",

	css: css\`& {
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
	}\`,
};
`,metaType:"application/javascript"},"/modules/uix/form/form.js":{content:`import { css } from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-form",

	css: css\`& {
		display: flex;
		flex-direction: column; 
		gap: 1rem; 
		padding-top: 1rem;
	}\`,
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
		this.addEventListener(\`data-retrieved-\${this.id}\`, (event) =>
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
`,metaType:"application/javascript"},"/modules/uix/form/join.js":{content:`import { css } from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-join",

	css: css\`& {
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
	}\`,

	properties: {
		vertical: T.boolean(),
	},
};
`,metaType:"application/javascript"},"/modules/uix/form/input.js":{content:`import html, { css } from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-input",

	css: css\`& {
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
	\`,
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
			const uniqueId = \`uix-input-\${Math.random().toString(36).substr(2, 9)}\`;
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
		return html\`
        <input
          type=\${inputType}
          value=\${inputValue}
          ?autofocus=\${autofocus}
          ?disabled=\${disabled}
          size=\${size}
          ?required=\${required}
            ?checked=\${selected}
          name=\${name}
          id=\${name}
          regex=\${regex}
          @input=\${bind ? (e) => bind.setValue(isCheckbox ? e.target.checked : e.target.value) : input}
          placeholder=\${placeholder}
        />			
        \${
					label || placeholder
						? html\`<label for=\${name} ?required=\${required}>\${label || placeholder}</label>\`
						: ""
				}
    \`;
	},
};
`,metaType:"application/javascript"},"/modules/uix/display/button.js":{content:`import { css } from "/modules/mvc/view/html/index.js";

export default {
	tag: "uix-button",

	extends: "uix-link",
	css: css\`& {
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
	\`,
	types: {
		default: ({ variant }) => ({
			"border-size": "0",
			"background-color":
				variant === "default"
					? \`var(--color-\${variant}-100)\`
					: \`var(--color-\${variant}-60)\`,
			"hover-background-color": \`var(--color-\${variant}-30)\`,
			"text-color": \`var(--color-\${variant}-1)\`,
		}),
		bordered: ({ variant }) => ({
			"border-size": "1px",
			"background-color": "transparent",
			"hover-background-color": \`var(--color-\${variant}-30)\`,
			"border-color": \`var(--color-\${variant}-40)\`,
			"text-color": \`var(--color-\${variant}-100)\`,
		}),
		ghost: ({ variant }) => ({
			"background-color": "transparent",
			"hover-background-color": \`var(--color-\${variant}-30)\`,
			"border-size": "0px",
			"text-color": \`var(--color-\${variant}-100)\`,
		}),
		outline: ({ variant }) => ({
			"background-color": "transparent",
			"hover-background-color": \`var(--color-\${variant}-30)\`,
			"text-color": \`var(--color-\${variant}-90)\`,
			"border-size": "1px",
		}),
		float: ({ variant }) => ({
			"background-color": \`var(--color-\${variant}-60)\`,
			"hover-background-color": \`var(--color-\${variant}-50)\`,
			"text-color": \`var(--color-\${variant}-1)\`,
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
`,metaType:"application/javascript"},"/modules/uix/layout/container.js":{content:`export default { tag: "uix-container" };
`,metaType:"application/javascript"},"/modules/uix/layout/list.js":{content:`import html from "/modules/mvc/view/html/index.js";
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
`,metaType:"application/javascript"},"/modules/uix/display/stat.js":{content:`import html from "/modules/mvc/view/html/index.js";
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
		return html\`<span class="center text-6xl text-bold">\${this.value}</span>
								<span class="center text-xl text-medium">\${this.label}</span>\`;
	},
};
`,metaType:"application/javascript"},"/modules/app/button.js":{content:`import html from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "app-button",

	render() {
		return html\`<div class="fixed bottom-[30px] right-[30px]">
                  <uix-button .float=\${html\`<div class="flex flex-col items-center gap-2">
                                              <theme-darkmode></theme-darkmode>
                                              <app-dev-only>
                                                <template>
                                                  <bundler-button></bundler-button>
                                                </template>
                                              </app-dev-only>
                                              <p2p-button></p2p-button> 
                                            </div>\`} icon="settings"></uix-button>
                </div>\`;
	},
	properties: {
		label: T.string("Actions"),
	},
};
`,metaType:"application/javascript"},"/modules/uix/display/link.js":{content:`import html, { css } from "/modules/mvc/view/html/index.js";
import Router from "/modules/router/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-link",

	css: css\`& {
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
	}\`,
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
		return html\`<a
							class=\${this.icon ? "uix-text-icon__element" : undefined}
							content
							href=\${this.href}
							@click=\${this.defaultOnClick.bind(this)}
							?reverse=\${this.reverse}
							?vertical=\${this.vertical}
							related=\${this.related}
							name=\${this.name || this.label}
							alt=\${this.alt || this.label || this.name}
							padding=\${this.padding}
							gap=\${this.gap}
							type=\${this.type}
						>
							\${
								this.icon
									? html\`<uix-icon
										name=\${this.icon}
										alt=\${this.alt || this.label || this.name}
										size=\${this.iconSize || this.size}
									></uix-icon>\`
									: ""
							}
							\${this.hideLabel ? null : this.label}
						</a>
						\${
							!this.dropdown
								? null
								: html\`
					<div dropdown>
						\${this.dropdown}
					</div>\`
						}
					\${
						!this.context
							? null
							: html\`
					<div context>
						\${this.context}
					</div>\`
					}
						\${
							!this.accordion
								? null
								: html\`
					<div accordion>
						\${this.accordion}
					</div>\`
						}
					\${
						!this.tooltip
							? null
							: html\`
					<div tooltip>
						\${this.tooltip === true ? this.label : this.tooltip}
					</div>\`
					}

						\${
							!this.float
								? null
								: html\`
					<div float>
						\${this.float}
					</div>\`
						}
        \`;
	},
};
`,metaType:"application/javascript"},"/modules/icon-lucide/lucide/calendar-heart.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7M8 2v4m8-4v4"/><path d="M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34l-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53c-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z"/></g></svg>',metaType:"image/svg+xml"},"/modules/icon-lucide/lucide/circle-plus.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8m-4-4v8"/></g></svg>',metaType:"image/svg+xml"},"/modules/uix/overlay/modal.js":{content:`import html, { css } from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-modal",

	css: css\`& {
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
	}\`,
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
		return html\`<dialog ?open=\${this.open}>
									<uix-card variant=\${this.variant} size=\${this.size} width=\${this.size}>
										<div horizontal items="center" width="full" justify="space-between">
												<span grow size="lg" transform="uppercase" weight="semibold" icon=\${this.icon}>
														\${this.label}
												</span>
												<uix-link @click=\${this.hide.bind(this)} icon="x"></uix-link>
										</div>
										\${!this.open ? null : (this.content ?? this.contentFn.bind(this)())}
									</uix-card>
								</dialog>
								\${!this.cta ? null : html\`<div @click=\${this.show.bind(this)}>\${this.cta}</div>\`}
						\`;
	},
};
`,metaType:"application/javascript"},"/modules/uix/display/calendar.js":{content:`import $APP from "/bootstrap.js";
import html, { css } from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-calendar",

	css: css\`
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
			}\`,
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
		return html\`
      <div class="flex justify-between items-center p-2">
        <uix-icon class="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700" name="chevron-left" @click=\${() => this._prevMonth()}></uix-icon>
        <span class="font-bold text-center">\${headerText}</span>
        <uix-icon class="cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700" name="chevron-right" @click=\${() => this._nextMonth()}></uix-icon>
      </div>
      <div class="grid grid-cols-7 mt-4" style=\${\`gap: \${this.gap || "0.5rem"}\`}>
        \${weekdays.map((day) => html\`<span class="text-center font-semibold text-sm text-gray-500">\${day}</span>\`)}
        \${calendarDays.map((day) => {
					if (!day.isCurrentMonth) return html\`<div></div>\`;
					const dateKey = $APP.Date.formatKey(day.date);
					return this.dayContent({
						dateKey,
						toggled: this.toggledDays.includes(dateKey),
						day,
						habit: this.habit,
					});
				})}
      </div>
    \`;
	},
};
`,metaType:"application/javascript"},"/modules/router/index.js":{content:`import $APP from "/bootstrap.js";
import Controller from "/modules/mvc/controller/frontend.js";
import html from "/modules/mvc/view/html/index.js";

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
		return (normalized || "/").replace(/\\/+$/, "");
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

			const regex = new RegExp(\`^\${regexPath.replace(/\\/+$/, "")}$\`);
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
		Controller.ram.set("currentRoute", { ...this.currentRoute });
	}

	static updateCurrentRouteInRam(route) {
		this.currentRoute = route;
		this.currentRoute.root = this.isRoot();
		Controller.ram.set("currentRoute", this.currentRoute);
	}
}

const init = () => {
	Router.init($APP.routes);
};

$APP.hooks.add("init", init);
$APP.routes.set({ "/": { component: () => html\`<app-index></app-index>\` } });

export default Router;
`,metaType:"application/javascript"},"/modules/uix/display/calendar-day.js":{content:`import html from "/modules/mvc/view/html/index.js";
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
		return html\`<uix-link 
										center
										?toggled=\${toggled}
										calendarDay
										._data=\${{
											model: "checkins",
											method: "add",
										}}
										._map=\${{
											habit,
											date: dateKey,
											onclick: toggled ? "$data:remove" : "$data:add",
										}}
									>
										\${day.day}
									</uix-link>
									<uix-overlay y="top" x="right">
										<uix-modal
										icon="message" label="Add notes"										
										.cta=\${html\`<uix-circle
											class="w-4 h-4 bg-green"
											._map=\${{
												_row: \`$find:@parent.notes:date=\${dateKey}\`,
												solid: "$boolean:@id",
											}}
											></uix-circle>\`}
										.content=\${html\`
											<uix-form
												._data=\${{
													model: "notes",
													method: "add",
												}}
												._map=\${{
													_row: \`$find:@parent.notes:date=\${dateKey}\`,
													habit,
													date: dateKey,
													submit: "$data:upsert",
													submitSuccess: "$closest:uix-modal.hide",
												}}>
												<uix-join>
													<uix-input name="notes" size="xl"
														._map=\${{
															_row: \`$find:@parent.notes:date=\${dateKey}\`,
															value: "@notes",
														}}></uix-input>
													<uix-button label="ADD" icon="plus" type="submit" size="xl"></uix-button>
												</uix-join>
											</uix-form>\`}>
										</uix-modal>
									</uix-overlay>\`;
	},
};
`,metaType:"application/javascript"},"/modules/icon-lucide/lucide/chevron-left.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 18l-6-6l6-6"/></svg>',metaType:"image/svg+xml"},"/modules/icon-lucide/lucide/chevron-right.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9 18l6-6l-6-6"/></svg>',metaType:"image/svg+xml"},"/modules/uix/display/avatar.js":{content:`import { css } from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-avatar",

	css: css\`
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
  \`,
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
`,metaType:"application/javascript"},"/modules/app/dev-only.js":{content:`import $APP from "/bootstrap.js";

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
`,metaType:"application/javascript"},"/modules/p2p/button.js":{content:`import $APP from "/bootstrap.js";
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
			\`Received join request from peer \${peerId} with device ID \${deviceId}\`,
		);

		const isKnownDevice = component.currentApp?.connections?.some(
			(conn) => conn.deviceId === deviceId,
		);

		if (isKnownDevice) {
			console.log(\`Auto-approving known device: \${deviceId}\`);
			component.projectRoom.sendEvent({ type: "RECONNECT_APPROVED" }, peerId);
		} else {
			console.log(
				\`Device \${deviceId} is not trusted. Awaiting manual approval.\`,
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
		console.log(\`Join request approved by \${peerId}. Receiving DB dump.\`);
		await Controller.backend("P2P:JOIN_APP", payload);
		window.location.reload();
	},
	RECONNECT_APPROVED: ({ peerId }) => {
		console.log(\`Reconnection approved by \${peerId}.\`);
		alert("Reconnected to project successfully!");
	},
	JOIN_DENIED: ({ peerId, component }) => {
		console.log(\`Join request denied by \${peerId}.\`);
		alert("Your request to join the project was denied. Leaving room.");
		component.projectRoom?.room.leave();
		component.projectRoom = null;
	},
	DATA_OPERATION: ({ payload, peerId }) => {
		console.log(\`Received DATA_OPERATION from peer \${peerId}:\`, payload);
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
				console.warn(\`No handler found for event type: \${event.type}\`);
			}
		});

		room.onPeerJoin((peerId) => {
			this.peerCount = Object.keys(room.getPeers()).length;
			if (!isMember) {
				console.log(\`Requesting to join room \${appId}...\`);
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
			\`Approving request for peer \${request.peerId} with device \${request.deviceId}\`,
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
		console.log(\`Denying request from \${request.peerId}\`);
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
				id: \`item-\${Math.random().toString(36).substr(2, 9)}\`,
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
			? \`Connected to \${this.peerCount} peer(s)\`
			: "Offline";

		const modalContent = html\`
      <div class="flex flex-col gap-4 p-4 w-[640px]">
        <p class="text-lg">Project ID: <strong class="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">#\${this.currentApp?.id}</strong></p>
        <p class="text-sm text-gray-500 flex items-center gap-2">Status: \${statusText} <uix-icon name=\${isConnected ? "users" : "cloud-off"}></uix-icon></p>
        
        \${
					this.projectRoom
						? html\`
          <hr class="my-2 border-gray-200 dark:border-gray-700" />
          <h6 class="font-semibold">Test Data Sync</h6>
          <uix-button
            class="rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            label="Send Data Operation"
            icon="send"
            .click=\${this._handleSendDataOperation.bind(this)}
            .disabled=\${!isConnected}
            title=\${!isConnected ? "Must be connected to another peer to send data" : "Send a sample data operation"}
          ></uix-button>
        \`
						: ""
				}
        \${
					this.connectionRequests.length > 0
						? html\`
          <hr class="my-2 border-gray-200 dark:border-gray-700" />
          <h6 class="font-semibold">Connection Requests</h6>
          <div class="flex flex-col gap-2">
            \${this.connectionRequests.map(
							(req) => html\`
              <div class="p-2 bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col gap-2">
                <p>Request from: <strong class="font-mono">\${req.peerId.slice(0, 8)}...</strong></p>
                <div class="flex justify-end gap-2">
                  <uix-button class="text-xs px-2 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white" .click=\${() => this._handleDenyRequest(req)} label="Deny"></uix-button>
                  <uix-button class="text-xs px-2 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white" .click=\${() => this._handleApproveRequest(req)} label="Approve"></uix-button>
                </div>
              </div>
            \`,
						)}
          </div>
        \`
						: ""
				}

        <hr class="my-2 border-gray-200 dark:border-gray-700" />
        <h6 class="font-semibold">My Projects</h6>
        \${
					this.isLoading
						? html\`<uix-spinner></uix-spinner>\`
						: html\`
          <div class="flex flex-col gap-2">
            \${this.apps.map(
							(app) => html\`
              <uix-button
                class="w-full text-left px-3 py-2 rounded-md \${app.id === this.currentApp?.id ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"}"
                .click=\${() => this._handleSelectApp(app.id)}
                label=\${\`Project \${app.id.slice(0, 12)}...\`}
              ></uix-button>
            \`,
						)}
          </div>
        \`
				}

        <hr class="my-2 border-gray-200 dark:border-gray-700" />
        <h6 class="font-semibold">Join a Project</h6>
        <uix-join class="flex">
          <uix-input
            class="flex-grow border rounded-md dark:bg-gray-800 dark:border-gray-600"
            label="Enter Project ID to join"
            .bind=\${this.prop("joinAppId")}            
          ></uix-input>
          <uix-button
            class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            .click=\${this._handleJoinApp.bind(this)}
            label="Join"
            icon="log-in"
            .disabled=\${!this.joinAppId}
          ></uix-button>
				</uix-join>

        <hr class="my-2 border-gray-200 dark:border-gray-700" />
        <uix-button class="w-full px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white" .click=\${this._handleCreateApp} label="Create New Project" icon="plus"></uix-button>
      </div>
    \`;

		return html\`
        <uix-modal
          .content=\${modalContent}
          .cta=\${html\`<uix-button icon="wifi"></uix-button>\`}
        ></uix-modal>
    \`;
	},
};
`,metaType:"application/javascript"},"/modules/theme/darkmode.js":{content:`import html from "/modules/mvc/view/html/index.js";
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
`,metaType:"application/javascript"},"/modules/icon-lucide/lucide/trash.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',metaType:"image/svg+xml"},"/modules/icon-lucide/lucide/x.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/></svg>',metaType:"image/svg+xml"},"/modules/icon-lucide/lucide/plus.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-7-7v14"/></svg>',metaType:"image/svg+xml"},"/modules/icon-lucide/lucide/message-square-text.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zm-8-7H7m10 4H7"/></svg>',metaType:"image/svg+xml"},"/modules/icon-lucide/lucide/settings.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2"/><circle cx="12" cy="12" r="3"/></g></svg>',metaType:"image/svg+xml"},"/modules/uix/overlay/overlay.js":{content:`import T from "/modules/types/index.js";

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
`,metaType:"application/javascript"},"/modules/p2p/trystero.js":{content:`const { floor: e, random: r } = Math,
	t = "Trystero",
	n = (e, r) => Array(e).fill().map(r),
	a = "0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",
	o = (t) => n(t, () => a[e(62 * r())]).join(""),
	s = o(20),
	i = Promise.all.bind(Promise),
	c = "undefined" != typeof window,
	{ entries: l, fromEntries: d, keys: f } = Object,
	u = () => {},
	p = (e) => Error(\`\${t}: \${e}\`),
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
				sdp: e.localDescription.sdp.replace(/a=ice-options:trickle\\s\\n/g, ""),
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
		...n(3, (e, r) => \`stun:stun\${r || ""}.l.google.com:19302\`),
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
			\`\${t}: torrent tracker \${n ? "failure" : "warning"} from \${e} - \${r}\`,
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
							w(\`\${e}:\${r}:\${t}\`),
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
						error: \`incorrect password (\${L.password}) when decrypting \${r}\`,
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
									: (console.warn(\`\${t}: no peer with id \${e} found\`), []);
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
									\`action type string "\${e}" (\${r.byteLength}b) exceeds byte limit (12). Hint: choose a shorter name.\`,
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
								a = g(n.subarray(0, 12)).replaceAll("\\0", ""),
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
									\`\${t}: received message with unregistered type (\${a})\`,
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

export default trystero;
`,metaType:"application/javascript"},"/modules/uix/display/circle.js":{content:`import { css } from "/modules/mvc/view/html/index.js";
import T from "/modules/types/index.js";

export default {
	tag: "uix-circle",

	css: css\`
    &:not([solid]) {
      background-color: transparent;
    }
  \`,
	class:
		"inline-block align-middle box-border w-4 h-4 rounded-full border-1 border-solid border-gray-900",
	properties: {
		solid: T.boolean({
			defaultValue: false,
		}),
	},
};
`,metaType:"application/javascript"},"/modules/apps/bundler/button.js":{content:`import Bundler from "/modules/apps/bundler/frontend.js";
import Controller from "/modules/mvc/controller/frontend.js";
import html from "/modules/mvc/view/html/index.js";

export default {
	tag: "bundler-button",

	extends: "uix-modal",
	cta: html\`<uix-button icon="file-box"></uix-button>\`,
	async bundleAppSPA() {
		await Bundler.bundleSPA();
	},

	async bundleAppSSR() {
		await Controller.backend("BUNDLE_APP_SSR");
	},
	contentFn() {
		return html\`<uix-list gap="md">
        <uix-button .click=\${this.bundleAppSPA.bind(this)} label="Bundle SPA"></uix-button>
        <uix-button .click=\${this.bundleAppSSR.bind(this)} label="Bundle SSR"></uix-button>
        <uix-button href="/admin" label="Admin"></uix-button>
      </uix-list>\`;
	},
};
`,metaType:"application/javascript"},"/modules/icon-lucide/lucide/sun.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></g></svg>',metaType:"image/svg+xml"},"/modules/icon-lucide/lucide/wifi.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.859a10 10 0 0 1 14 0m-10.5 3.57a5 5 0 0 1 7 0"/></svg>',metaType:"image/svg+xml"},"/index.js":{content:`const ensureSWController = () => {
	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => reject(new Error("Service Worker timed out.")), 100);
	});
	const controllerPromise = new Promise((resolve) => {
		if (navigator.serviceWorker.controller) {
			return resolve();
		}
		navigator.serviceWorker.addEventListener("controllerchange", () => {
			return resolve();
		});
	});
	return Promise.race([controllerPromise, timeoutPromise]);
};

const startApp = async () => {
	if (!("serviceWorker" in navigator)) {
		console.warn("Service Worker not supported.");
		throw new Error("Platform not supported");
	}

	await navigator.serviceWorker.register("/sw.js", { scope: "/" });

	try {
		console.log("Waiting for Service Worker to take control...");
		await ensureSWController();
		console.log("\u2705 Service Worker is in control!");
		await import("/bootstrap.js");
		await import("/app.js");
	} catch (error) {
		console.warn("Service Worker did not take control in time. Reloading...");
		window.location.reload();
	}
};

startApp();
`,metaType:"application/javascript"},"/modules/icon-lucide/lucide/file-box.svg":{content:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01ZM7 17v5"/><path d="M11.7 14.2L7 17l-4.7-2.8"/></g></svg>',metaType:"image/svg+xml"},"/style.css":{content:`*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.fixed{position:fixed}.bottom-\\[30px\\]{bottom:30px}.right-\\[30px\\]{right:30px}.grid{display:grid}.grid-cols-7{grid-template-columns:repeat(7,minmax(0,1fr))}.m15{margin:3.75rem}.m9{margin:2.25rem}.mx-auto{margin-left:auto;margin-right:auto}.my-2{margin-top:.5rem;margin-bottom:.5rem}.mt-4{margin-top:1rem}.box-border{box-sizing:border-box}.inline-block{display:inline-block}.h-4{height:1rem}.max-w-6xl{max-width:72rem}.w-\\[640px\\]{width:640px}.w-4{width:1rem}.w-full{width:100%}.flex{display:flex}.flex-grow{flex-grow:1}.flex-col{flex-direction:column}.cursor-pointer{cursor:pointer}.cursor-not-allowed{cursor:not-allowed}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-evenly{justify-content:space-evenly}.gap-\\[10px\\]{gap:10px}.gap-16{gap:4rem}.gap-2{gap:.5rem}.gap-4{gap:1rem}.gap-8{gap:2rem}.border,.border-1{border-width:1px}.border-gray-200{--un-border-opacity:1;border-color:rgb(229 231 235 / var(--un-border-opacity))}.border-gray-900{--un-border-opacity:1;border-color:rgb(17 24 39 / var(--un-border-opacity))}.dark .dark\\:border-gray-600{--un-border-opacity:1;border-color:rgb(75 85 99 / var(--un-border-opacity))}.dark .dark\\:border-gray-700{--un-border-opacity:1;border-color:rgb(55 65 81 / var(--un-border-opacity))}.rounded{border-radius:.25rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.border-solid{border-style:solid}.bg-blue-100{--un-bg-opacity:1;background-color:rgb(219 234 254 / var(--un-bg-opacity))}.bg-blue-600{--un-bg-opacity:1;background-color:rgb(37 99 235 / var(--un-bg-opacity))}.bg-gray-100{--un-bg-opacity:1;background-color:rgb(243 244 246 / var(--un-bg-opacity))}.bg-gray-200{--un-bg-opacity:1;background-color:rgb(229 231 235 / var(--un-bg-opacity))}.bg-green{--un-bg-opacity:1;background-color:rgb(74 222 128 / var(--un-bg-opacity))}.bg-green-600{--un-bg-opacity:1;background-color:rgb(22 163 74 / var(--un-bg-opacity))}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255 / var(--un-bg-opacity))}.dark .dark\\:bg-gray-700{--un-bg-opacity:1;background-color:rgb(55 65 81 / var(--un-bg-opacity))}.dark .dark\\:bg-gray-800{--un-bg-opacity:1;background-color:rgb(31 41 55 / var(--un-bg-opacity))}.dark .dark\\:hover\\:bg-gray-600:hover{--un-bg-opacity:1;background-color:rgb(75 85 99 / var(--un-bg-opacity))}.dark .dark\\:hover\\:bg-gray-700:hover{--un-bg-opacity:1;background-color:rgb(55 65 81 / var(--un-bg-opacity))}.hover\\:bg-blue-700:hover{--un-bg-opacity:1;background-color:rgb(29 78 216 / var(--un-bg-opacity))}.hover\\:bg-gray-100:hover{--un-bg-opacity:1;background-color:rgb(243 244 246 / var(--un-bg-opacity))}.hover\\:bg-gray-300:hover{--un-bg-opacity:1;background-color:rgb(209 213 219 / var(--un-bg-opacity))}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-2{padding-left:.5rem;padding-right:.5rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.text-center{text-align:center}.align-middle{vertical-align:middle}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.dark .dark\\:text-white,.text-white{--un-text-opacity:1;color:rgb(255 255 255 / var(--un-text-opacity))}.text-black{--un-text-opacity:1;color:rgb(0 0 0 / var(--un-text-opacity))}.text-blue-600{--un-text-opacity:1;color:rgb(37 99 235 / var(--un-text-opacity))}.text-gray-500{--un-text-opacity:1;color:rgb(107 114 128 / var(--un-text-opacity))}.text-green-600{--un-text-opacity:1;color:rgb(22 163 74 / var(--un-text-opacity))}.text-red-500{--un-text-opacity:1;color:rgb(239 68 68 / var(--un-text-opacity))}.hover\\:text-red-700:hover{--un-text-opacity:1;color:rgb(185 28 28 / var(--un-text-opacity))}.font-bold{font-weight:700}.font-semibold{font-weight:600}.font-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}.uppercase{text-transform:uppercase}.disabled\\:opacity-50:disabled{opacity:.5}.shadow-md{--un-shadow:var(--un-shadow-inset) 0 4px 6px -1px var(--un-shadow-color, rgb(0 0 0 / .1)),var(--un-shadow-inset) 0 2px 4px -2px var(--un-shadow-color, rgb(0 0 0 / .1));box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)}.uix-card{--uix-card-width: auto;--uix-card-padding: var(--uix-container-padding, 0);--uix-card-border-size: var(--uix-container-border-size, 0px);--uix-card-border-radius: var(--radius-md);--uix-card-background-color: var(--color-default-1, #f0f0f0);--uix-card-border-color: var(--uix-container-border-color, var(--color-default, #cccccc));--uix-card-shadow: 0 4px 6px rgba(0, 0, 0, .1);--uix-card-min-height: var(--uix-container-min-height, 50px);--uix-card-gap: var(--uix-container-gap, 0);--uix-card-height: auto;--uix-card-justify: var(--uix-container-justify, flex-start);--uix-card-align-items: var(--uix-container-align-items, stretch);--uix-card-overflow: var(--uix-container-overflow, visible);--uix-card-position: var(--uix-container-position, static);--uix-card-list-style-type: var(--uix-container-list-style-type, none);--uix-card-text-color: var(--uix-container-text-color, var(--uix-text-color));border-width:var(--uix-card-border-size);border-radius:var(--uix-card-border-radius);background-color:var(--uix-card-background-color);border-color:var(--uix-card-border-color);box-shadow:var(--uix-card-shadow);list-style-type:var(--uix-card-list-style-type);color:var(--uix-card-text-color);&[clickable],&[clickable] *{cursor:pointer}>:last-child.uix-join{margin-left:calc(-1 * var(--uix-card-padding));margin-right:calc(-1 * var(--uix-card-padding));margin-bottom:calc(-1 * var(--uix-card-padding));padding-bottom:0;border-radius:var(--uix-card-border-radius)!important;.uix-button{border-radius:0!important;&:last-child{border-bottom-right-radius:var(--uix-card-border-radius)!important}&:first-child{border-right-width:0;border-bottom-left-radius:var(--uix-card-border-radius)!important}}}&[horizontal]>:last-child.uix-join{margin-top:calc(-1 * var(--uix-card-padding));margin-bottom:calc(-1 * var(--uix-card-padding));margin-right:0;padding-right:0}}.uix-icon{&[solid]{stroke:currentColor;fill:currentColor}display:inline-block;vertical-align:middle}.uix-form{display:flex;flex-direction:column;gap:1rem;padding-top:1rem}.uix-join{--uix-list-button-radius: var(--uix-item-border-radius, 5px);--uix-list-button-border-width: 1px;--uix-list-button-margin: 0;list-style-type:var(--uix-list-container-list-style-type);width:auto;&.uix-join{flex-direction:row;&[vertical]{flex-direction:column}&[reverse][vertical]{flex-direction:column-reverse}&[reverse]:not([vertical]){flex-direction:row-reverse}}display:flex;flex-direction:row;>*{width:100%;margin:var(--uix-list-button-margin);&:first-child{border-top-left-radius:var(--uix-list-button-radius);border-bottom-left-radius:var(--uix-list-button-radius);border-bottom-right-radius:0;border-top-right-radius:0}&:last-child{border-top-right-radius:var(--uix-list-button-radius);border-bottom-right-radius:var(--uix-list-button-radius);border-top-left-radius:0;border-bottom-left-radius:0;border-left-width:0}}>[bordered],>[outline]{&:last-child{border-width:var(--uix-list-button-border-width)}&:hover:active{border-width:var(--uix-list-button-border-width)}&:has(+*:active){border-width:var(--uix-list-button-border-width)}}&[vertical]{>*{border-radius:0;margin:var(--uix-list-button-margin);&:first-child{border-top-left-radius:var(--uix-list-button-radius);border-top-right-radius:var(--uix-list-button-radius)}&:last-child{border-bottom-left-radius:var(--uix-list-button-radius);border-bottom-right-radius:var(--uix-list-button-radius)}}>.uix-button[bordered],>.uix-button[outline]{border-width:var(--uix-list-button-border-width);&:last-child{border-width:var(--uix-list-button-border-width)}&:hover:active{border-width:var(--uix-list-button-border-width)}&:has(+.uix-button:active){border-width:var(--uix-list-button-border-width)}}}}.uix-input{--uix-input-background-color: var(--color-default-10);--uix-input-border-color: var(--color-default-70);--uix-input-text-color: var(--color-default-95);--uix-input-border-radius: .375rem;--uix-input-padding-x: 5px;--uix-input-padding-y: 5px;--uix-input-font-size: 1rem;--uix-input-focus-ring-width: 2px;--uix-input-focus-ring-offset-width: 2px;--uix-input-height: 2.5rem;position:relative;display:flex;width:100%;height:var(--uix-input-height);border-radius:var(--uix-input-border-radius);border:2px solid var(--uix-input-border-color);font-size:var(--uix-input-font-size);background-color:var(--uix-input-background-color);color:var(--uix-input-text-color);&:focus{outline:none;outline-style:none;box-shadow:none;border-color:transparent}input[type=text],input[type=password],input[type=email],input[type=number],input[type=decimal],input[type=search],input[type=tel],input[type=url]{width:100%;outline:none;color:var(--uix-input-text-color);background-color:transparent;padding:var(--uix-input-padding-x) var(--uix-input-padding-y);border:0;&:focus+label,&:not(:placeholder-shown)+label{transition:margin-top .3s ease,font-size .3s ease;margin-top:-.4rem;font-size:.6rem;cursor:default;.uix-text{--uix-text-size: .8rem}}&::placeholder{color:transparent}&:focus{outline:none;outline-style:none;box-shadow:none;border-color:transparent;&::placeholder{color:var(--uix-input-text-color)}}}label{.uix-text{--uix-text-font-weight: 600}cursor:text;position:absolute;margin-top:.5rem;font-family:monospace;letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-left:.75rem;padding-right:.5rem;padding-left:.25rem;background-color:var(--uix-input-background-color);color:var(--uix-input-text-color);transition:margin-top .3s ease,font-size .3s ease}label[required]:after{content:"*";color:var(--color-error-50)}&:not([type=checkbox]):not([radio]) input:focus-visible{outline:none;box-shadow:0 0 0 var(--uix-input-focus-ring-width) var(--uix-input-border-color)}&:not([type=checkbox]):not([radio]) input:disabled{cursor:not-allowed;opacity:.6}&[type=checkbox],&[radio]{border:0;align-items:center;height:auto;width:auto;position:relative;cursor:pointer}&[type=checkbox] label,&[radio] label{position:static;margin-top:0;background-color:transparent;padding:0;cursor:pointer;margin-left:.5rem;text-transform:none;font-family:inherit;letter-spacing:normal;font-weight:400;.uix-text{--uix-text-font-weight: 400}}&[type=checkbox] input,&[radio] input[type=radio]{width:var(--uix-input-size);height:var(--uix-input-size);margin:0;border:none;background:none;box-shadow:none;padding:0}&[type=checkbox] input:disabled,&[radio] input[type=radio]:disabled{cursor:not-allowed;opacity:.6}&[type=checkbox],&[radio]{gap:.75rem;padding:.5rem 0;--uix-checkbox-size: 1.5rem;--uix-checkbox-border-radius: .375rem;--uix-checkbox-checked-bg: var(--uix-input-border-color);--uix-checkbox-check-color: var(--uix-input-background-color);input,input[type=radio]{appearance:none;-webkit-appearance:none;width:var(--uix-checkbox-size);height:var(--uix-checkbox-size);margin:0;border:2px solid var(--uix-input-border-color);border-radius:var(--uix-checkbox-border-radius);background-color:var(--uix-input-background-color);cursor:pointer;position:relative;transition:background-color .2s ease,border-color .2s ease;&:after{content:"";position:absolute;display:none;left:50%;top:50%;width:.375rem;height:.75rem;border:solid var(--uix-checkbox-check-color);border-width:0 2px 2px 0;transform:translate(-50%,-60%) rotate(45deg)}&:checked{background-color:var(--uix-checkbox-checked-bg);border-color:var(--uix-checkbox-checked-bg);&:after{display:block}}&:focus-visible{box-shadow:0 0 0 var(--uix-input-focus-ring-width) var(--uix-input-border-color)}&:disabled{opacity:.6;cursor:not-allowed;+label{cursor:not-allowed;opacity:.6}}}&:hover:not(:has(input[type=checkbox]:disabled)){input[type=checkbox]{border-color:var(--uix-input-border-color)}}label{margin-left:0;order:2}}}.uix-modal{--uix-modal-background-color: var(--color-default-1, #ffffff);--uix-modal-box-shadow: 0 25px 50px -12px rgba(0, 0, 0, .25);--uix-modal-padding: var(--spacing-sm);--uix-modal-dialog-width: var(--sizes-xl);--uix-container-height: auto;border:0;dialog{&[open]{display:flex}position:absolute;margin:auto;z-index:1000;overflow-y:auto;box-sizing:border-box;transition:all .1s ease-in-out;border:0;background-color:transparent}}.uix-calendar{uix-calendar-day{margin-inline:auto}[calendarDay]{cursor:pointer;text-align:center;padding:.5rem;background-color:transparent;&[toggled]{background-color:var(--color-primary-50);color:#fff}}}.uix-link{&[indent]{>a,>button{padding-left:var(--uix-link-indent)}}&[active]:hover{color:var(--uix-link-hover-text-color, var(--color-primary-40))}&[selectable][selected]{background-color:var(--color-primary-40)}&:hover{[tooltip]{display:flex}}&[tooltip]{display:inline-block;&:hover{[tooltip]{visibility:visible}}[tooltip]{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;border-radius:6px;padding:5px 0;position:absolute;z-index:1000000000;top:50%;left:100%;transform:translateY(-50%)}}&[position~=top] [tooltip]{bottom:100%;left:50%;transform:translate(-50%)}&[position~=bottom] [tooltip]{top:100%;left:50%;transform:translate(-50%)}&[position~=left] [tooltip]{top:50%;right:100%;transform:translateY(-50%)}&[tooltip],&[dropdown],&[context],&[float]{position:relative}&[dropdown],&[accordion]{flex-direction:column}[float],[dropdown],[accordion],[context]{display:none}&[floatopen] [float]{display:block;position:absolute;bottom:50px;right:30px;width:30px}&[context]{z-index:auto}[dropdown],[context][open]{position:absolute;left:0;top:100%;width:100%;min-width:200px;z-index:1000;background-color:var(--color-primary-10);box-shadow:0 8px 16px #0003;.uix-link:hover,input{background-color:var(--color-primary-20)}>.uix-link,input{width:100%}}[context][open]{display:flex}&[selected]{[dropdown],[accordion]{display:flex}}&[vertical]{margin:0 auto}--uix-link-indent: 0;cursor:pointer;a,button{cursor:pointer;padding:var(--uix-link-padding);&:hover{color:var(--uix-link-hover-color, var(--color-primary-70))}}color:var(--uix-link-text-color, var(--color-primary-70));font-weight:var(--uix-link-font-weight, 600);width:var(--uix-link-width, auto);.uix-text-icon__element{display:flex;align-items:center;gap:var(--uix-link-icon-gap, .5rem);width:auto;&[reverse][vertical]{flex-direction:column-reverse}&:not([reverse])[vertical]{flex-direction:column}&[reverse]:not([vertical]){flex-direction:row-reverse}&:not([reverse]):not([vertical]){flex-direction:row}}transition:all .3s ease-in-out}.uix-button{--uix-button-font-weight: 700;--uix-button-text-color: var(--color-default-80);--uix-button-background-color: var(--color-default-100);--uix-button-hover-background-color: var(--color-default-20);--uix-button-border-radius: var(--radius-sm);--uix-button-border-size: 0;--uix-button-border-color: var(--color-default-40);--uix-button-hover-opacity: .9;--uix-button-active-scale: .9;--uix-button-width: fit-content;--uix-button-height: fit-content;display:flex;flex-direction:row;align-items:center;gap:.5rem;cursor:pointer;transition:all .3s ease-in-out;font-weight:var(--uix-button-font-weight);color:var(--uix-button-text-color);background-color:var(--uix-button-background-color);width:var(--uix-button-width);height:var(--uix-button-height);border:var(--uix-button-border-size) solid var(--uix-button-border-color);border-radius:var(--uix-button-border-radius);>button,>a,>input{padding:var(--uix-button-padding, var(--uix-link-padding));word-break:keep-all;height:100%;line-height:var(--uix-button-height);border-radius:var(--uix-button-border-radius);flex-basis:100%;justify-content:var(--uix-text-align);&:hover{opacity:var(--uix-button-hover-opacity);background-color:var(--uix-button-hover-background-color)}&:hover:active{opacity:var(--uix-button-hover-opacity)}}.uix-icon,button,input,a{cursor:pointer}}.uix-avatar{>:not(uix-overlay){width:var(--uix-avatar-width);height:var(--uix-avatar-height);border-radius:var(--uix-avatar-border-radius);background-color:var(--uix-avatar-background-color)}&[ring]{box-shadow:0 0 0 var(--uix-avatar-ring-width) var(--uix-avatar-ring)}>img{width:100%;height:100%;object-fit:cover}>uix-overlay{position:absolute;z-index:100;--tx: 0;--ty: 0;transform:translate(var(--tx),var(--ty));cursor:pointer;text-align:center;background:transparent}>uix-overlay[y=top]{top:0%}>uix-overlay[y=bottom]{bottom:0%}>uix-overlay[y=center]{top:50%;--ty: -50%}>uix-overlay[x=left]{left:-5%}>uix-overlay[x=right]{right:0%}>uix-overlay[x=center]{left:50%;--tx: -50%}--uix-avatar-background-color: var(--color-default-30, #d1d5db);--uix-avatar-text: var(--color-default, #000000);--uix-avatar-ring: var(--color-default, #000000);--uix-avatar-ring-width: 2px;--uix-avatar-border-radius: 50%;--uix-avatar-width: 3rem;--uix-avatar-height: 3rem;display:flex;position:relative;justify-content:center;align-items:center;overflow:hidden;color:var(--uix-avatar-text);font-size:calc(var(--uix-avatar-width) / 2.5);font-weight:500;vertical-align:middle;text-align:center;min-width:var(--uix-avatar-width);padding:3px}.uix-circle{&:not([solid]){background-color:transparent}}@font-face{font-family:Manrope;font-weight:200;src:url(/modules/font/manrope/extralight.woff2) format("woff2")}@font-face{font-family:Manrope;font-weight:300;src:url(/modules/font/manrope/light.woff2) format("woff2")}@font-face{font-family:Manrope;font-weight:500;src:url(/modules/font/manrope/medium.woff2) format("woff2")}@font-face{font-family:Manrope;font-weight:400;src:url(/modules/font/manrope/regular.woff2) format("woff2")}@font-face{font-family:Manrope;font-weight:600;src:url(/modules/font/manrope/semibold.woff2) format("woff2")}@font-face{font-family:Manrope;font-weight:700;src:url(/modules/font/manrope/bold.woff2) format("woff2")}@font-face{font-family:Manrope;font-weight:800;src:url(/modules/font/manrope/extrabold.woff2) format("woff2")}body{font-family:var(--font-family)}html,body{font-family:var(--font-family);background-color:var(--background-color)!important;color:var(--text-color)!important;width:100%;min-height:100%;height:100%;padding:0;margin:0}body:not(.production) *:not(:defined){border:1px solid red}.dark{filter:invert(1) hue-rotate(180deg)}.dark img,.dark dialog,.dark video,.dark iframe{filter:invert(1) hue-rotate(180deg)}html{font-size:14px}@media (max-width: 768px){html{font-size:18px}}@media (max-width: 480px){html{font-size:20px}}textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}:root{box-sizing:border-box;-moz-text-size-adjust:none;-webkit-text-size-adjust:none;text-size-adjust:none;line-height:1.2;-webkit-font-smoothing:antialiased}*,*:before,*:after{box-sizing:border-box}*{margin:0}body{-webkit-font-smoothing:antialiased}a{color:currentColor;text-decoration:none;font-family:var(--font-family)}button,textarea,select{background-color:inherit;border-width:0;color:inherit}img,picture,video,canvas,svg{display:block;max-width:100%}input,button,textarea,select{font:inherit}p,h1,h2,h3,h4,h5,h6{font-family:var(--font-family);overflow-wrap:break-word}dialog::backdrop{background-color:#000c}*::-webkit-scrollbar{width:8px;margin-right:10px}*::-webkit-scrollbar-track{background:transparent}*::-webkit-scrollbar-thumb{&:hover{scrollbar-color:rgba(154,153,150,.8) transparent}border-radius:10px;border:none}*::-webkit-scrollbar-button{background:transparent;color:transparent}*{scrollbar-width:thin;scrollbar-color:transparent transparent;&:hover{scrollbar-color:rgba(154,153,150,.8) transparent}}[full]{width:100%;height:100vh}[w-full]{width:100%}[grow]{flex-grow:1}[hide],.hide{display:none!important}[noscroll]{overflow:hidden}div [container]{display:flex}div [container][horizontal]{display:flex;flex-direction:col}
`,metaType:"text/css"}};self.addEventListener("install",t=>t.waitUntil(self.skipWaiting())),self.addEventListener("activate",t=>t.waitUntil(self.clients.claim())),self.addEventListener("fetch",t=>{const n=new URL(t.request.url),e=FILE_BUNDLE[n.pathname];e&&t.respondWith(new Response(e.content,{headers:{"Content-Type":e.metaType||"application/javascript"}}))});
