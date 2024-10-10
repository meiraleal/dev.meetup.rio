self.APP_ENV = "PRODUCTION";
(async () => {
	const BASE_URL = "/www";

const IS_MV3 =
	typeof self.chrome !== "undefined" &&
	!!self.chrome.runtime &&
	!!self.chrome.runtime.id;

const ENV = self.APP_ENV || "DEVELOPMENT";

self.APP = {
	config: { BASE_URL, IS_MV3, ENV },
	components: new Map(),
	style: new Set(),
	events: {},
	extensions: {},
	routes: {},
	adapters: {},
	data: {},
	theme: {},
	models: {},
	fontsToLoad: [],
	init: [],
	READY: false,
	IS_MV3,
	IS_DEV: ENV === "DEVELOPMENT",
	add: (item, { style = false, tag, prop, library } = {}) => {
		if (self.APP.config.ENV === "PRODUCTION" && prop === "init") {
			if (Array.isArray(item)) item.map((fn) => fn());
			else item();
			return;
		}
		if (typeof library === "string") {
			APP[library] = item;
			return;
		}
		if (typeof item === "function") {
			item.tag = tag;
			APP.components.set(item.tag, item);
			if (style === true) {
				APP.style.add(item.tag);
			}
		} else if (typeof item === "object") {
			if (!APP[prop]) {
				APP[prop] = Array.isArray(item) ? [] : {};
			}

			if (Array.isArray(item)) {
				APP[prop] = [...APP[prop], ...item];
			} else {
				Object.assign(APP[prop], item);
			}
		}
	},
};

const integrations = {};
const urlPatterns = {};
const processedUrls = new Map();
const DEBOUNCE_TIME = 5000;
const eventHandlers = {};
if (self.APP.config.IS_MV3) {
	function register(name, integration) {
		console.log(`Loading ${name}`);
		self.APP.add({ [name]: integration }, { prop: "mv3" });
		integrations[name] = integration;
		if (integration.urlPatterns) {
			integration.urlPatterns.forEach((pattern) => {
				if (!urlPatterns[pattern.url]) {
					urlPatterns[pattern.url] = [];
				}
				urlPatterns[pattern.url].push({ name, pattern });
			});
		}

		if (integration.eventHandlers) {
			Object.entries(integration.eventHandlers).forEach(
				([eventType, handler]) => {
					if (!eventHandlers[eventType]) {
						eventHandlers[eventType] = [];
					}
					eventHandlers[eventType].push(handler);
				},
			);
		}
	}

	function shouldProcessRequest(url) {
		if (!url.startsWith("https")) return false;
		const currentTime = Date.now();
		const lastProcessedTime = processedUrls.get(url);

		if (!lastProcessedTime || currentTime - lastProcessedTime > DEBOUNCE_TIME) {
			processedUrls.set(url, currentTime);

			for (const [processedUrl, time] of processedUrls.entries()) {
				if (currentTime - time > DEBOUNCE_TIME) {
					processedUrls.delete(processedUrl);
				}
			}

			return true;
		}
		console.warn(`Skipping duplicate request to ${url}`);
		return false;
	}

	async function fetchAndProcessRequest(details, integration, pattern) {
		try {
			const response = await fetch(details.url);
			const content = await response.text();
			integration.onRequestCompleted(details, content, pattern);
		} catch (error) {
			console.error(`Error fetching and processing ${details.url}:`, error);
		}
	}

	chrome.webRequest.onCompleted.addListener(
		(details) => {
			if (shouldProcessRequest(details.url)) {
				Object.keys(urlPatterns).forEach((patternKey) => {
					console.log(urlPatterns[patternKey]);
					urlPatterns[patternKey].forEach(({ name, pattern }) => {
						const integration = integrations[name];
						if (integration?.onRequestCompleted) {
							if (details.url.match(new RegExp(pattern.url))) {
								if (pattern.fetchContent) {
									fetchAndProcessRequest(details, integration, pattern);
								} else {
									integration.onRequestCompleted(details, null, pattern);
								}
							}
						}
					});
				});
			}
		},
		{ urls: ["<all_urls>"] },
	);

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (eventHandlers[message.type]) {
			eventHandlers[message.type].forEach((handler) =>
				handler(message.data, sender, sendResponse),
			);
		}
	});

	self.addEventListener("message", (event) => {
		const eventType = event?.data?.type;
		console.log("Message received:", { event });
		if (eventHandlers[eventType]) {
			eventHandlers[eventType].forEach((handler) => handler(event.data));
		}
	});

	self.APP.add({ register }, { library: "MV3" });
}

if (self.APP.config.IS_MV3) {
	const gmapsIntegration = {
		name: "gmaps",
		urlPattern: /https:\/\/www\.google\.com\/maps/,
		urlPatterns: ["/maps/preview/place", "/search?tbm=map"],
		onRequestCompleted: (details) => {
			if (details.url.includes("/maps/preview/place")) {
				self.chrome.tabs.sendMessage(details.tabId, {
					type: "PLACE_DATA_FETCHED",
					url: details.url,
				});
			} else if (details.url.includes("/search?tbm=map")) {
				self.chrome.tabs.sendMessage(details.tabId, {
					type: "SEARCH_RESULTS_FETCHED",
					url: details.url,
				});
			}
		},
	};

	self.APP.MV3.register("gmaps", gmapsIntegration);
}

const parseJSON = (value, defaultValue) => {
	try {
		return value && typeof value === "string" ? JSON.parse(value) : value;
	} catch (error) {
		console.log("Failed to parse JSON from string:", error);
		return defaultValue;
	}
};

const typeHandlers = {
	boolean: (value) => ["true", 1, true].includes(value),
	string: (value) => String(value),
	array: (value, defaultValue, itemType) => {
		try {
			if (!value) return [];
			const parsedArray = parseJSON(value, defaultValue);
			return parsedArray.map((item) => {
				if (itemType) {
					return Object.entries(item).reduce((obj, [key, value]) => {
						obj[key] = typeHandlers[itemType[key].type](
							value,
							itemType[key].defaultValue,
						);
						return obj;
					}, {});
				}
				return item;
			});
		} catch (err) {
			return value;
		}
	},
	number: (value, defaultValue) =>
		Number.isNaN(Number(value)) ? defaultValue : Number(value),
	date: (value) => new Date(value),
	function: (value) => (value ? new Function(value) : undefined),
	object: (value, defaultValue) => parseJSON(value, defaultValue),
};
const specialCases = {
	null: null,
	undefined: undefined,
	false: false,
	true: true,
	[null]: null,
	[undefined]: undefined,
	[false]: false,
	[true]: true,
};

const stringToType = (value, prop) => {
	if (value in specialCases) return specialCases[value];
	const handler = typeHandlers[prop.type];
	return handler
		? handler(value, prop.defaultValue, prop.itemType || prop.objectType)
		: value || prop.defaultValue;
};

const createType = (type, options = {}) => ({
	type,
	reflect: !options.sync,
	defaultValue: options.defaultValue || undefined,
	...options,
	attribute: options.attribute || true,
});

const handler = () => ({
	get(target, prop) {
		if (typesHelpers[prop]) return typesHelpers[prop];
		if (prop === "one" || prop === "many") {
			return (targetModel, targetForeignKey, options = {}) => ({
				type: prop === "one" ? "string" : "array",
				relationship: prop,
				targetModel,
				targetForeignKey,
				...options,
				index: true,
			});
		}

		return (options = {}) => {
			const type = prop.toLowerCase();
			if (!typeHandlers[type]) {
				throw new Error(`Unknown type: ${type}`);
			}
			return createType(type, options);
		};
	},
});
const validateField = (value, prop) => {
	let error = null;

	// Required validation
	if (
		prop.required &&
		(value === undefined || value === null || value === "")
	) {
		return [`Field ${prop.key} is required`, null];
	}

	// Type validation
	const propType = prop.type;
	const typeHandler = typeHandlers[propType];
	const typedValue = typeHandler
		? typeHandler(value, prop.defaultValue)
		: value;

	// Format validation
	if (prop.format && typeof prop.format === "function") {
		const isValid = prop.format(typedValue);
		if (!isValid) {
			error = `Invalid format for field ${prop.key}`;
		}
	}

	return [error, typedValue];
};

const validateType = (object, { schema, row = {} }) => {
	if (!schema) return [null, object];

	const result = {};
	let hasError = false;
	const errors = {};
	const derivedFields = [];

	// First pass: validate non-derived fields
	for (const key in schema) {
		const prop = schema[key];
		let value = object[key];
		let error;

		if (prop.derived && typeof prop.derived === "function") {
			derivedFields.push(key); // Postpone derived fields
			continue;
		}

		[error, value] =
			value !== undefined
				? validateField(value, prop)
				: [null, prop.defaultValue];

		if (error) {
			hasError = true;
			errors[key] = error;
		} else if (value !== undefined) {
			result[key] = value;
		}
	}

	for (const key of derivedFields) {
		const prop = schema[key];
		let value = prop.derived({ ...row, ...object });
		let error;

		[error, value] = validateField(value, prop);

		if (error) {
			hasError = true;
			errors[key] = error;
		} else if (value !== undefined) {
			result[key] = value;
		}
	}

	if (hasError) {
		return [{ error: errors }, null];
	}

	return [null, result];
};

const typesHelpers = { stringToType, validateType };
self.APP.add(typesHelpers, { prop: "helpers" });
const Types = new Proxy({}, handler());
self.APP.add(Types, { library: "T" });

(() => {
	const { T } = self.APP;

	const models = {
		users: {
			username: T.string({ primary: true }),
			email: T.string({ unique: true }),
			role: T.string({
				defaultValue: "user",
				enum: ["admin", "user", "provider"],
			}),
			language: T.string({ defaultValue: "en", enum: ["en", "pt", "es"] }),
			avatar: T.string(),
			whatsappNumber: T.string(),
			stories: T.many("stories", "user"),
		},

		categories: {
			name: T.string({ primary: true }),
			type: T.string({ enum: ["event", "place", "activity"] }),
			description: T.string(),
			content: T.many("content", "category"),
			events: T.many("events", "category"),
			places: T.many("places", "category"),
			activities: T.many("activities", "category"),
		},
		places: {
			name: T.string(),
			description: T.array(),
			category: T.one("categories", "places"),
			reviews: T.many("reviews", "place"),
			events: T.many("events", "place"),
			activities: T.many("activities", "place"),
			stories: T.many("stories", "place"),
			address: T.string(),
			phoneNumber: T.string(),
			coordinates: T.object(),
			openingHours: T.array(),
			images: T.array(),
			rating: T.number(),
			reviewCount: T.number(),
			priceRange: T.string(),
			website: T.string(),
			menu: T.string(),
			amenities: T.array(),
			recommendations: T.array(),
			attributes: T.array(),
			businessStatus: T.string(),
			priceLevel: T.string(),
			editorialSummary: T.string(),
			reservation: T.object(),
			menuUrl: T.string(),
			orderUrl: T.string(),
		},
		events: {
			name: T.string(),
			description: T.string(),
			startDate: T.date(),
			endDate: T.date(),
			stories: T.many("stories", "place"),
			place: T.one("places", "events"),
			category: T.one("categories", "events"),
			cost: T.number(),
			organizer: T.string(),
			images: T.array(),
			reviews: T.many("reviews", "event"),
		},

		activities: {
			name: T.string(),
			description: T.string(),
			category: T.one("categories", "activities"),
			duration: T.number(),
			cost: T.number(),
			stories: T.many("stories", "place"),
			provider: T.one("users", "activities"),
			place: T.one("places", "activities"),
			maxParticipants: T.number(),
			languages: T.array(),
			images: T.array(),
			rating: T.number(),
			reviews: T.many("reviews", "activity"),
		},

		itineraries: {
			name: T.string(),
			description: T.string(),
			duration: T.number(),
			items: T.array(),
			public: T.boolean({ defaultValue: false, index: true }),
			stories: T.many("stories", "place"),
			reviews: T.many("reviews", "itinerary"),
		},

		reviews: {
			content: T.string(),
			public: T.boolean({ defaultValue: false, index: true }),
			liked: T.boolean({ defaultValue: false, index: true }),
			user: T.one("users", "reviews"),
			place: T.one("places", "reviews"),
			itinerary: T.one("itineraries", "reviews"),
			stories: T.many("stories", "event"),
			activity: T.one("activities", "reviews"),
			event: T.one("events", "reviews"),
			itemType: T.string({
				enum: ["events", "activities", "itineraries", "places"],
				index: true,
			}),
		},

		content: {
			category: T.one("categories", "content"),
			name: T.string(),
			content: T.string(),
		},

		stories: {
			title: T.string(),
			type: T.string({ enum: ["image", "video", "text"] }),
			contentUrl: T.string(),
			text: T.string(),
			expirationDate: T.date(),
			place: T.one("places", "stories"),
			event: T.one("events", "stories"),
			activity: T.one("activities", "stories"),
			createdAt: T.date(),
		},
		notifications: {
			type: T.string({
				enum: ["event", "place", "activity", "general", "story"],
			}),
			title: T.string(),
			message: T.string(),
			read: T.boolean({ defaultValue: false }),
		},
	};

	APP.add(models, { prop: "models" });
})();

(() => {
	const data = {
		users: [
			{
				username: "johndoe",
				email: "john@example.com",
				role: "user",
				language: "en",
				avatar: "john-avatar.jpg",
				whatsappNumber: "+5521987654321",
			},
			{
				username: "mariasil",
				email: "maria@example.com",
				role: "provider",
				language: "pt",
				avatar: "maria-avatar.jpg",
				whatsappNumber: "+5521976543210",
			},
			{
				username: "admin1",
				email: "admin@meetup.rio",
				role: "admin",
				language: "en",
				avatar: "admin-avatar.jpg",
				whatsappNumber: "+5521965432109",
			},
		],
		categories: [
			{
				name: "Concert",
				type: "event",
				description: "Musical performances",
				content: ["concert-history", "concert-tips"],
			},
			{
				name: "Festival",
				type: "event",
				description: "Large-scale celebrations",
				content: ["festival-guide"],
			},
			{
				name: "Sports",
				type: "event",
				description: "Sporting events",
				content: ["sports-in-rio"],
			},
			{
				name: "Cultural",
				type: "event",
				description: "Art and cultural events",
				content: ["rio-culture"],
			},
			{
				name: "Beach",
				type: "place",
				description: "Coastal areas for relaxation and recreation",
				content: ["beach-etiquette"],
			},
			{
				name: "Landmark",
				type: "place",
				description: "Notable locations of interest",
				content: ["landmark-history"],
			},
			{
				name: "Restaurant",
				type: "place",
				description: "Dining establishments",
				content: ["dining-guide"],
			},
			{
				name: "Museum",
				type: "place",
				description: "Cultural and historical exhibitions",
				content: ["museum-tips"],
			},
			{
				name: "Nightlife",
				type: "place",
				description: "Evening entertainment venues",
				content: ["nightlife-safety"],
			},
			{
				name: "Tour",
				type: "activity",
				description: "Guided explorations of the city",
				content: ["tour-preparation"],
			},
			{
				name: "Class",
				type: "activity",
				description: "Educational or skill-building sessions",
				content: ["class-etiquette"],
			},
			{
				name: "Outdoor",
				type: "activity",
				description: "Nature and adventure activities",
				content: ["outdoor-safety"],
			},
		],
		events: [
			{
				name: "Rio Carnival",
				description: "The biggest carnival celebration in the world",
				startDate: new Date("2025-02-28"),
				endDate: new Date("2025-03-05"),
				place: {
					name: "Arcos da Lapa",
					description: "Historic aqueduct and symbol of Lapa neighborhood",
					category: "Landmark",
					address: "Arcos da Lapa, Centro, Rio de Janeiro",
					coordinates: { lat: -22.9147, lng: -43.1806 },
					openingHours: ["24/7"],
					images: ["arcos1.jpg", "arcos2.jpg"],
					rating: 4.6,
					reviews: [
						{
							content: "Amazing experience! The view is breathtaking.",
							rating: 5,
							createdBy: "johndoe",
							place: "Christ the Redeemer",
							public: true,
						},
						{
							content:
								"Maria is an excellent samba instructor. Highly recommended!",
							rating: 5,
							createdBy: "johndoe",
							activity: "Samba Dance Class",
							public: true,
						},
					],
					events: [],
					activities: [],
				},
				category: "Festival",
				cost: 0,
				organizer: "admin1",
				images: ["carnival1.jpg", "carnival2.jpg"],
				interactions: 1500,
				content: ["carnival-schedule", "carnival-costume-guide"],
			},
			{
				name: "Lapa Street Party",
				description:
					"Weekly outdoor celebration of samba and Brazilian culture",
				startDate: new Date("2024-09-20T20:00:00"),
				endDate: new Date("2024-09-21T02:00:00"),
				place: {
					name: "Escadaria Selarón",
					description: "Colorful tiled steps, a famous Lapa attraction",
					category: "Landmark",
					address: "R. Manuel Carneiro - Santa Teresa, Rio de Janeiro",
					coordinates: { lat: -22.9154, lng: -43.1809 },
					openingHours: ["24/7"],
					images: ["selaron1.jpg", "selaron2.jpg"],
					rating: 4.7,
					reviews: [],
					events: [],
					activities: [],
				},
				category: "Nightlife",
				cost: 0,
				organizer: "mariasil",
				images: ["lapa-party1.jpg", "lapa-party2.jpg"],
				interactions: 800,
				content: ["lapa-nightlife-guide"],
			},
			{
				name: "Bossa Nova Night",
				description: "An evening of classic bossa nova music",
				startDate: new Date("2024-10-15T20:00:00"),
				endDate: new Date("2024-10-15T23:00:00"),
				location: "Copacabana Palace",
				category: "Concert",
				cost: 50,
				organizer: "mariasil",
				images: ["bossanova1.jpg"],
				interactions: 300,
				content: ["bossanova-history"],
			},
			{
				name: "Beach Volleyball Tournament",
				description: "Annual beach volleyball competition",
				startDate: new Date("2024-07-10"),
				endDate: new Date("2024-07-12"),
				location: "Copacabana Beach",
				category: "Sports",
				cost: 0,
				organizer: "admin1",
				images: ["volleyball1.jpg", "volleyball2.jpg"],
				interactions: 800,
				content: ["volleyball-rules", "tournament-schedule"],
			},
		],
		activities: [
			{
				name: "Samba Dance Class",
				description: "Learn the basics of samba with a professional instructor",
				category: "Class",
				duration: 90,
				cost: 50,
				provider: "mariasil",
				place: {
					name: "Rio Samba Studio",
					description: "Authentic samba dance studio in Lapa",
					category: "Nightlife",
					address: "R. do Lavradio, 20 - Centro, Rio de Janeiro",
					coordinates: { lat: -22.9107, lng: -43.1808 },
					openingHours: ["18:00-22:00"],
					images: ["samba-studio1.jpg", "samba-studio2.jpg"],
					rating: 4.8,
					reviews: [],
					events: [],
					activities: [],
				},
				maxParticipants: 10,
				languages: ["en", "pt"],
				images: ["samba1.jpg", "samba2.jpg"],
				rating: 4.9,
				interactions: 750,
				content: ["samba-history", "basic-steps"],
			},
			{
				name: "Lapa Art Walk",
				description: "Guided tour of Lapa's vibrant street art scene",
				category: "Tour",
				duration: 120,
				cost: 30,
				provider: "johndoe",
				place: {
					name: "Lapa Neighborhood",
					description:
						"Bohemian neighborhood known for its nightlife and culture",
					category: "Nightlife",
					address: "Lapa, Rio de Janeiro",
					coordinates: { lat: -22.9147, lng: -43.1806 },
					openingHours: ["24/7"],
					images: ["lapa1.jpg", "lapa2.jpg"],
					rating: 4.5,
					reviews: [],
					events: [],
					activities: [],
				},
				maxParticipants: 12,
				languages: ["en", "pt", "es"],
				images: ["art-walk1.jpg", "art-walk2.jpg"],
				rating: 4.7,
				interactions: 500,
				content: ["lapa-art-history", "street-art-techniques"],
			},
			{
				name: "Samba Dance Class",
				description: "Learn the basics of samba with a professional instructor",
				category: "Class",
				duration: 90,
				cost: 50,
				provider: "mariasil",
				location: "Rio Dance Studio",
				maxParticipants: 10,
				languages: ["en", "pt"],
				images: ["samba1.jpg", "samba2.jpg"],
				rating: 4.9,
				interactions: 750,
				content: ["samba-history", "basic-steps"],
			},
			{
				name: "Tijuca Forest Hiking Tour",
				description: "Guided hike through the world's largest urban forest",
				category: "Tour",
				duration: 240,
				cost: 75,
				provider: "mariasil",
				location: "Tijuca National Park",
				maxParticipants: 8,
				languages: ["en", "pt", "es"],
				images: ["tijuca1.jpg"],
				rating: 4.7,
				interactions: 600,
				content: ["tijuca-flora-fauna", "hiking-tips"],
			},
		],
		itineraries: [
			{
				name: "Rio in 3 Days",
				description: "Hit the highlights of Rio de Janeiro in a short trip",
				duration: 3,
				items: ["Christ the Redeemer", "Copacabana Beach", "Samba Dance Class"],
				createdBy: "admin1",
				isPublic: true,
				content: ["day1-plan", "day2-plan", "day3-plan"],
			},
			{
				name: "Cultural Rio",
				description: "Explore the rich culture and history of Rio",
				duration: 5,
				items: [
					"Museu do Amanhã",
					"Bossa Nova Night",
					"Tijuca Forest Hiking Tour",
				],
				createdBy: "johndoe",
				isPublic: false,
				content: ["cultural-highlights", "hidden-gems"],
			},
		],
		content: [
			{
				category: "Concert",
				event: "Bossa Nova Night",
				name: "The History of Bossa Nova",
				content:
					"Bossa Nova, which means 'new trend' or 'new wave' in Portuguese, is a genre of Brazilian music...",
			},
			{
				category: "Landmark",
				place: "Christ the Redeemer",
				name: "Christ the Redeemer: A Symbol of Rio",
				content:
					"Christ the Redeemer, or 'Cristo Redentor' in Portuguese, is an Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil...",
			},
			{
				category: "Class",
				activity: "Samba Dance Class",
				name: "Basic Samba Steps",
				content:
					"The basic samba step, known as the 'samba box step', involves moving your feet in a six-count pattern...",
			},
			{
				category: "Tour",
				activity: "Tijuca Forest Hiking Tour",
				name: "Flora and Fauna of Tijuca Forest",
				content:
					"Tijuca Forest is home to hundreds of species of plants and animals, many of which are found nowhere else on Earth...",
			},
			{
				category: "Beach",
				name: "Beach Etiquette in Rio",
				content:
					"When visiting Rio's beaches, it's important to respect local customs. Cariocas (Rio locals) typically...",
			},
		],
		notifications: [
			{
				type: "event",
				title: "Upcoming Event: Rio Carnival",
				message: "Don't forget! Rio Carnival starts on February 28th.",
				read: false,
			},
			{
				type: "place",
				title: "New Review on Copacabana Beach",
				message: "A new review has been posted on Copacabana Beach.",
				read: true,
			},
			{
				type: "general",
				title: "New User Signup",
				message: "A new user has signed up on meetup.rio.",
				read: false,
			},
			{
				type: "activity",
				title: "Samba Dance Class Reminder",
				message: "Your Samba Dance Class is scheduled for tomorrow at 6 PM.",
				read: false,
			},
			{
				type: "event",
				title: "Event Cancellation: Bossa Nova Night",
				message: "Unfortunately, Bossa Nova Night has been canceled.",
				read: true,
			},
		],
	};

	self.APP.add(data, { prop: "data" });
})();

const { config, helpers } = self.APP;

const Assets = {
	assets: new Map(),

	add(name, path, type) {
		this.assets.set(name, { path, type });
	},

	get(name) {
		const asset = this.assets.get(name);
		if (!asset) {
			console.warn(`Asset not found: ${name}`);
			return null;
		}
		if (self.APP.IS_DEV) {
			return `${self.APP.config.BASE_URL}/${asset.path}`;
		}
		return `${asset.type}/${name}`;
	},

	getType(name) {
		const asset = this.assets.get(name);
		return asset ? asset.type : null;
	},

	remove(name) {
		const asset = this.assets.get(name);
		if (asset) {
			return this.assets.delete(name);
		}
		return false;
	},

	clear() {
		this.assets.clear();
	},

	getAll() {
		return Array.from(this.assets.entries()).map(([name, { path, type }]) => ({
			name,
			path,
			type,
		}));
	},
};

self.APP.add(Assets, { library: "Assets" });

(() => {
	const { T } = self.APP;
	const models = {
		files: {
			name: T.string(),
			directory: T.string(),
			path: T.string({
				index: true,
				derived: (file) => `${file.directory}${file.name}`,
			}),
			kind: T.string({ enum: ["file", "directory"] }),
			filetype: T.string({ defaultValue: "plain/text" }),
			content: T.string(),
		},
	};
	self.APP.add(models, { prop: "models" });
})();

const data = {
	files: [
		{
			name: "app.js",
			directory: "/",
			kind: "file",
			content: `const { APP } = self;
const { View, T, html } = APP;
class AppIndex extends View {
static properties = {
	name: T.string({ defaultValue: "Visitor" }),
};

render() {
	return html\`
		<uix-container padding="md">
			<uix-card>
				<uix-text size="lg" weight="bold" text="center">\${this.name}, Welcome to Bootstrapp!</uix-text>
				<uix-button label="Click!"></uix-button>
			</uix-card>
			</uix-container>
			\`;
}
}

export default AppIndex;`,
		},
	],
};

self.APP.add(data, { prop: "data" });

(() => {
	const { T } = self.APP;
	const models = {
		users: {
			username: T.string({ primary: true }),
			email: T.string({ unique: true }),
			role: T.string({ defaultValue: "user", enum: ["admin", "user"] }),
		},
		boards: {
			name: T.string(),
			description: T.string(),
			tasks: T.many("tasks", "boardId"),
		},
		tasks: {
			title: T.string(),
			description: T.string(),
			completed: T.boolean({ defaultValue: false }),
			dueDate: T.date(),
			priority: T.string({
				defaultValue: "medium",
				enum: ["low", "medium", "high"],
			}),
			boardId: T.one("boards", "tasks"),
			createdBy: T.one("users", "tasks"),
			assignedTo: T.one("users", "assignedTasks"),
			comments: T.array(),
		},
	};

	self.APP.add(models, { prop: "models" });
})();

self.APP.add(
	{
		boards: [
			{ name: "Development", description: "Development Tasks" },
			{
				name: "Marketing",
				description: "Marketing Tasks",
				tasks: [
					{
						title: "Setup project",
						description: "Setup the initial project structure",
						completed: false,
						dueDate: new Date(),
						priority: "high",
						createdBy: "admin",
						assignedTo: "user1",
					},
					{
						title: "Create marketing plan",
						description: "Develop a marketing plan for the project",
						completed: false,
						dueDate: new Date(),
						priority: "medium",
						createdBy: "admin",
						assignedTo: "user1",
						comments: [
							{
								content: "This is a comment on the setup project task",
							},
							{
								content: "This is a comment on the marketing plan task",
							},
						],
					},
				],
			},
		],
	},
	{ prop: "data" },
);

const backendBootstrap = async ({ models, data } = {}) => {
	const { ReactiveRecord } = self.APP;
	const app = await self.APP.Backend.getApp(models);
	const { active, privateKey, ...user } = await self.APP.Backend.getUser();
	const device = await self.APP.Backend.getDevice();
	const db = await ReactiveRecord.getMainDB(models);
	if (data && !app.migrationTimestamp) {
		migrateData({ app, data });
	}
	return { app, user, device, db, models };
};

const importDB = async ({ app, user, models, data }) => {
	const { ReactiveRecord, config, helpers } = self.APP;
	ReactiveRecord.editAll(config.SYSMODELS.APP, { active: 0 }, { system: true });
	ReactiveRecord.add(
		config.SYSMODELS.APP,
		{ ...app, active: true, remote: true },
		{ system: true, keepIndex: true },
	);
	ReactiveRecord.add(
		config.SYSMODELS.USER,
		{ ...user, active: false, remote: true, name: "Remote User" },
		{ system: true },
	);
	const newWorkspace = await helpers.openDB({
		name: app.id,
		version: app.version,
		userId: user.id,
		models,
	});
	Object.keys(data).forEach((model) => {
		if (data[model].items?.length) {
			ReactiveRecord.addMany(model, data[model].items, {
				db: newWorkspace,
				keepIndex: true,
			});
		}
	});
};

const migrateData = async ({ app, data = {} }) => {
	const { ReactiveRecord, config } = self.APP;
	const appsData = Object.entries(data);
	if (appsData.length) {
		if (!app.migrationTimestamp) {
			for (const [modelName, entries] of appsData) {
				await ReactiveRecord.addMany(modelName, entries);
			}
			ReactiveRecord.app = await ReactiveRecord.edit(
				config.SYSMODELS.APP,
				{
					id: app.id,
					migrationTimestamp: Date.now(),
				},
				{ system: true },
			);
		}
	}
};

const getApp = async () => {
	if (!self.APP.Backend.app) {
		let app = await self.APP.ReactiveRecord.get(self.APP.config.SYSMODELS.APP, {
			active: 1,
		});
		if (!app) app = await createAppEntry();
		self.APP.Backend.app = app;
	}
	return self.APP.Backend.app;
};

const getDevice = async ({ app: _app, user: _user } = {}) => {
	const app = _app || (await self.APP.Backend.getApp());
	const user = _user || (await self.APP.Backend.getUser(app));

	if (!user) {
		throw new Error("User not found");
	}

	const device = await self.APP.ReactiveRecord.get(
		self.APP.config.SYSMODELS.DEVICE,
		{
			userId: user.id,
			active: 1,
		},
	);

	return device || null;
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
	const app = _app || (await self.APP.Backend.getApp());
	if (!user) {
		const existingUser = await self.APP.ReactiveRecord.get(
			self.APP.config.SYSMODELS.USER,
			{
				active: 1,
				appId: app.id,
			},
		);

		if (existingUser) {
			existingUser.privateKey = null;
			const existingDevice = await self.APP.ReactiveRecord.get(
				self.APP.config.SYSMODELS.DEVICE,
				{
					userId: existingUser.id,
					active: 1,
				},
			);
			if (!existingDevice)
				await self.APP.ReactiveRecord.add(
					self.APP.config.SYSMODELS.DEVICE,
					device,
				);
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
		active: 1,
	};
	await self.APP.ReactiveRecord.add(self.APP.config.SYSMODELS.USER, newUser);

	const newDevice = device || {
		userId: newUser.id,
		appId: app.id,
		active: 1,
	};
	await self.APP.ReactiveRecord.add(
		self.APP.config.SYSMODELS.DEVICE,
		newDevice,
	);
	newUser.privateKey = null;
	return newUser;
};

const getUser = async (_app) => {
	const app = _app || (await self.APP.Backend.getApp());
	if (!self.APP.Backend.user) {
		let puser = await self.APP.ReactiveRecord.get(
			self.APP.config.SYSMODELS.USER,
			{
				active: 1,
			},
		);
		if (!puser) puser = await self.APP.Backend.createUserEntry({ app });
		const { privateKey, active, ...user } = puser;
		self.APP.Backend.user = user;
	}
	return self.APP.Backend.user;
};

const createAppEntry = async () => {
	const timestamp = Date.now();
	const appEntry = {
		id: timestamp.toString(),
		version: 1,
		active: 1,
	};
	await self.APP.ReactiveRecord.sysdb.put(
		self.APP.config.SYSMODELS.APP,
		appEntry,
	);
	return appEntry;
};

const SYSMODELS = { APP: "App", USER: "User", DEVICE: "Device" };
const sysmodels = {
	App: {
		version: self.APP.T.number(),
		users: self.APP.T.many(SYSMODELS.USER, "appId"),
		active: self.APP.T.number({ defaultValue: 1, index: true }),
		migrationTimestamp: self.APP.T.number(),
	},
	User: {
		name: self.APP.T.string(),
		appId: self.APP.T.one(SYSMODELS.APP, "users"),
		devices: self.APP.T.many(SYSMODELS.DEVICE, "userId"),
		publicKey: self.APP.T.string(),
		privateKey: self.APP.T.string(),
		active: self.APP.T.number({ index: true }),
	},
	Device: {
		userId: self.APP.T.one(SYSMODELS.USER, "devices"),
		deviceData: self.APP.T.string(),
		active: self.APP.T.number({ defaultValue: 1, index: true }),
	},
};

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

const pendingRequests = {};
let nextRequestId = 1;

const handleMessage = async (event, data) => {
	const { events } = self.APP;
	const { type, payload, eventId } = data;
	const handler = events[type];
	const client = event.source;
	if (handler) {
		const respond = (payload) => {
			client.postMessage({
				eventId,
				payload,
			});
		};
		await handler(
			{ payload, eventId },
			{ respond, broadcast, client: createClientProxy(client) },
		);
	} else if (pendingRequests[eventId]) {
		pendingRequests[eventId].resolve(data.payload);
		delete pendingRequests[eventId];
	}
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
		pendingRequests[eventId] = { resolve, reject };
		client.postMessage({ type, payload, eventId });
	});
};

const broadcast = async (params) => {
	const clients = await self.clients.matchAll({
		type: "window",
		includeUncontrolled: true,
	});
	clients.forEach((client) => {
		client.postMessage(params);
	});
};

self.APP.add({ SYSMODELS }, { prop: "config" });
self.APP.add(sysmodels, { prop: "sysmodels" });
self.APP.add(
	{
		bootstrap: backendBootstrap,
		importDB,
		handleMessage,
		getApp,
		getDevice,
		createAppEntry,
		createUserEntry,
		getUser,
		generateId,
	},
	{ library: "Backend" },
);

const gzipCompress = async (data) => {
	const encoder = new TextEncoder();
	const stream = new Blob([encoder.encode(data)]).stream();
	const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));
	const reader = compressedStream.getReader();
	const chunks = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	return new Blob(chunks, { type: "application/gzip" });
};

const gzipDecompress = async (blob) => {
	const stream = blob.stream();
	const decompressedStream = stream.pipeThrough(
		new DecompressionStream("gzip"),
	);
	const reader = decompressedStream.getReader();
	const chunks = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	const decoder = new TextDecoder();
	return decoder.decode(new Blob(chunks));
};

const parseBoolean = { true: 1, false: 0 };
const parseBooleanReverse = { true: true, false: false };

async function openDB(props) {
	const db = new Database(props);
	await db.init();
	return db;
}
class Database {
	constructor({
		name: dbName,
		oplog = false,
		models,
		version,
		updateVersion,
		system,
	}) {
		this.models = models || {};
		this.system = system;
		this.dbName = dbName;
		this.version = Number(version);
		this.oplog = false;
		this.updateVersion = updateVersion;
		this.db = null;
		this.isConnected = false;
		this.connectionPromise = null;
	}

	async init() {
		if (this.isConnected) {
			console.warn("Database is already connected.");
			return;
		}

		if (this.connectionPromise) {
			return this.connectionPromise;
		}

		this.connectionPromise = new Promise((resolve, reject) => {
			console.log(this.version);
			const openRequest = indexedDB.open(this.dbName, this.version);

			openRequest.onerror = () =>
				reject(new Error(`Failed to open database: ${openRequest.error}`));

			openRequest.onsuccess = () => {
				this.db = openRequest.result;
				this.isConnected = true;
				this.checkVersion();
				resolve();
			};

			openRequest.onupgradeneeded = (event) => {
				const db = event.target.result;
				this._upgradeDB(db, event.oldVersion, event.newVersion);
			};
		});

		return this.connectionPromise;
	}

	checkVersion() {
		const stores = Object.keys(this.models);
		const idbStoresSet = new Set(this.db.objectStoreNames);
		if (stores.some((store) => !idbStoresSet.has(store))) {
			console.log("New stores detected. Upgrading database...");
			this.version++;
			this.db.close();
			this.isConnected = false;
			this.connectionPromise = null;
			if (this.updateVersion) {
				console.log("UPDATE THE VERSION DAMN");
				this.updateVersion();
			}
			this.init();
		}
	}

	prepareRow({ model, row, reverse = false, currentRow = {} }) {
		const parse = reverse ? parseBooleanReverse : parseBoolean;
		const modelProps = this.models[model];
		const updatedRow = { ...row };
		Object.keys(modelProps).forEach((prop) => {
			if (row[prop] === undefined && currentRow[prop] !== undefined) {
				updatedRow[prop] = currentRow[prop];
			} else {
				if (modelProps[prop].type === "boolean") {
					updatedRow[prop] = row[prop] ? parse.true : parse.false;
				}

				if (updatedRow[prop] === undefined) {
					delete updatedRow[prop];
				}
			}
		});
		return updatedRow;
	}
	_upgradeDB(db, oldVersion, newVersion) {
		console.log(
			`Upgrading database from version ${oldVersion} to ${newVersion}`,
		);
		const stores = Object.keys(this.models);
		stores.forEach((store) => {
			if (!db.objectStoreNames.contains(store)) {
				this._createStore(db, store);
			}
		});
	}

	_createStore(db, storeName) {
		const storeSchema = this.models[storeName];
		const objectStore = db.createObjectStore(storeName, {
			keyPath: "id",
			autoIncrement: true,
		});

		if (this.oplog) {
			this._createOplogStores(db, storeName);
		}

		Object.keys(storeSchema).forEach((field) => {
			if (storeSchema[field].index) {
				objectStore.createIndex(field, field, {
					unique: false,
					multiEntry: ["many", "array"].includes(storeSchema[field].type),
				});
			}
		});
	}

	_createOplogStores(db, storeName) {
		const oplogStore = db.createObjectStore(`${storeName}_oplog`, {
			keyPath: "id",
			autoIncrement: true,
		});
		oplogStore.createIndex(`${storeName}_timestamp_index`, "timestamp");
		oplogStore.createIndex(`${storeName}_user_index`, "userId");

		const oplogQueueStore = db.createObjectStore(`${storeName}_oplog_queue`, {
			keyPath: "id",
			autoIncrement: true,
		});
		oplogQueueStore.createIndex(`${storeName}_timestamp_index`, "timestamp");
		oplogQueueStore.createIndex(`${storeName}_user_index`, "userId");
	}

	async _ensureConnection() {
		if (!this.isConnected) {
			await this.init();
		}
		if (!this.isConnected || !this.db) {
			throw new Error("Database connection is not established");
		}
	}

	async getAll(storeName, options = {}) {
		await this._ensureConnection();
		return this.paginated(storeName, options);
	}

	async paginated(
		storeName,
		{ limit = 0, offset = 0, filter = {}, order = null, keys } = {},
	) {
		await this._ensureConnection();
		return new Promise((resolve, reject) => {
			try {
				const transaction = this.db.transaction(storeName, "readonly");
				const store = transaction.objectStore(storeName);
				const request = store.openCursor();
				const items = [];
				let count = 0;

				request.onerror = () =>
					reject(new Error(`Failed to paginate: ${request.error}`));
				request.onsuccess = (event) => {
					const cursor = event.target.result;
					if (cursor) {
						if (
							this._matchesFilter(cursor.value, filter) &&
							(!keys || keys.includes(cursor.key))
						) {
							if (count >= offset) {
								items.push(cursor.value);
							}
							count++;
						}
						if (limit > 0 && items.length >= limit) {
							resolve(items);
						} else {
							cursor.continue();
						}
					} else {
						resolve(items);
					}
				};
			} catch (error) {
				reject(new Error(`Failed to start transaction: ${error.message}`));
			}
		});
	}

	_matchesFilter(item, filter) {
		return Object.entries(filter).every(([key, value]) => item[key] === value);
	}

	async put(storeName, val) {
		await this._ensureConnection();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.put(val);

			request.onerror = () =>
				reject(new Error(`Failed to put: ${request.error}`));
			request.onsuccess = () => resolve(request.result);
		});
	}

	async get(storeName, keyOrFilter) {
		await this._ensureConnection();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readonly");
			const store = transaction.objectStore(storeName);

			if (typeof keyOrFilter === "object" && keyOrFilter !== null) {
				const request = store.openCursor();
				request.onerror = () =>
					reject(new Error(`Failed to get: ${request.error}`));
				request.onsuccess = (event) => {
					const cursor = event.target.result;
					if (cursor) {
						if (this._matchesFilter(cursor.value, keyOrFilter)) {
							resolve(cursor.value);
						} else {
							cursor.continue();
						}
					} else {
						resolve(null);
					}
				};
			} else {
				const request = store.get(keyOrFilter);
				request.onerror = () =>
					reject(new Error(`Failed to get: ${request.error}`));
				request.onsuccess = () => resolve(request.result);
			}
		});
	}

	async delete(storeName, key) {
		await this._ensureConnection();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.delete(key);

			request.onerror = () =>
				reject(new Error(`Failed to delete: ${request.error}`));
			request.onsuccess = () => resolve();
		});
	}

	async count(storeName, { filter = {} } = {}) {
		await this._ensureConnection();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readonly");
			const store = transaction.objectStore(storeName);

			if (Object.keys(filter).length === 0) {
				const request = store.count();
				request.onerror = () =>
					reject(new Error(`Failed to count: ${request.error}`));
				request.onsuccess = () => resolve(request.result);
			} else {
				const request = store.openCursor();
				let count = 0;
				request.onerror = () =>
					reject(new Error(`Failed to count: ${request.error}`));
				request.onsuccess = (event) => {
					const cursor = event.target.result;
					if (cursor) {
						if (this._matchesFilter(cursor.value, filter)) {
							count++;
						}
						cursor.continue();
					} else {
						resolve(count);
					}
				};
			}
		});
	}

	async clear(storeName) {
		await this._ensureConnection();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);
			const request = store.clear();

			request.onerror = () =>
				reject(new Error(`Failed to clear: ${request.error}`));
			request.onsuccess = () => resolve();
		});
	}

	close() {
		if (this.db) {
			this.db.close();
			this.isConnected = false;
			this.connectionPromise = null;
		}
	}
	async destroy() {
		this.close();
		return new Promise((resolve, reject) => {
			const request = indexedDB.deleteDatabase(this.dbName);
			request.onerror = () =>
				reject(new Error(`Failed to delete database: ${request.error}`));
			request.onsuccess = () => resolve();
		});
	}

	async export(storeName) {
		await this._ensureConnection();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readonly");
			const store = transaction.objectStore(storeName);
			const request = store.getAll();

			request.onerror = () =>
				reject(new Error(`Failed to export: ${request.error}`));
			request.onsuccess = () => {
				const dump = {};
				request.result.forEach((item) => {
					if (["string", "number"].includes(typeof item.id)) {
						dump[item.id] = item;
					}
				});
				resolve(dump);
			};
		});
	}

	async importData(storeName, data) {
		if (!Array.isArray(data) || !data.length) {
			throw new Error("No data provided");
		}

		await this._ensureConnection();
		return new Promise((resolve, reject) => {
			const transaction = this.db.transaction(storeName, "readwrite");
			const store = transaction.objectStore(storeName);

			let completed = 0;
			data.forEach((entry) => {
				const request = store.put(entry);
				request.onerror = () =>
					reject(new Error(`Failed to import: ${request.error}`));
				request.onsuccess = () => {
					completed++;
					if (completed === data.length) {
						resolve();
					}
				};
			});
		});
	}

	async exportDB(selectedModels = []) {
		await this._ensureConnection();
		const modelsToExport = selectedModels.length
			? selectedModels
			: Object.keys(this.models);
		const exportData = {};

		for (const model of modelsToExport) {
			exportData[model] = await this.getAll(model);
		}

		return gzipCompress(JSON.stringify(exportData));
	}
}

APP.add({ openDB, gzipDecompress, gzipCompress }, { prop: "helpers" });
APP.add(Database, { library: "Database" });


const isSystemModel = (model) => !!self.APP.sysmodels[model];
const ensureArray = (v) => (Array.isArray(v) ? v : [v]).filter(Boolean);
const extractId = (v) => (Array.isArray(v) ? v : [null, v]);

const handleRelationships = async (modelName, row, { db, skipProps = [] }) => {
	const properties = db.models[modelName];
	const relationshipPromises = Object.entries(row)
		.filter(([propKey]) => !skipProps.includes(propKey))
		.map(async ([propKey, value]) => {
			const prop = properties[propKey];
			if (prop?.targetModel && ["one", "many"].includes(prop.type)) {
				const relatedModel = db.models[prop.targetModel];
				if (!relatedModel)
					throw `ERROR: couldn't find model ${prop.targetModel}`;

				const prevValue = await ReactiveRecord.get(modelName, row.id, {
					props: [propKey],
				});
				if (relatedModel[prop.targetForeignKey || modelName]) {
					await UpdateRelationship[prop.type]({
						prevValue: prevValue?.[propKey],
						value,
						id: row.id,
						relatedModel,
						relatedModelName: prop.targetModel,
						targetForeignKey: prop.targetForeignKey || modelName,
					});
				}
			}
		});
	await Promise.all(relationshipPromises);
};

const UpdateRelationship = {
	one: async ({ prevValue, value, relatedModelName, id, targetForeignKey }) => {
		const isMany =
			db.models[relatedModelName][targetForeignKey]?.type === "many";
		const [, prevId] = extractId(prevValue);
		const [position, newId] = extractId(value) || [];

		if (prevId)
			await unsetRelation(
				relatedModelName,
				id,
				prevId,
				targetForeignKey,
				isMany,
			);
		if (newId)
			await setRelation(
				relatedModelName,
				id,
				newId,
				targetForeignKey,
				isMany,
				position,
			);
	},
	many: async ({
		prevValue,
		value,
		relatedModelName,
		id,
		targetForeignKey,
	}) => {
		const prevIds = ensureArray(prevValue);
		const newIds = ensureArray(value);

		const addedIds = newIds.filter((v) => !prevIds.includes(v));
		const removedIds = prevIds.filter((v) => !newIds.includes(v));

		await Promise.all([
			...addedIds.map((relatedId) =>
				setRelation(relatedModelName, id, relatedId, targetForeignKey, true),
			),
			...removedIds.map((relatedId) =>
				unsetRelation(relatedModelName, id, relatedId, targetForeignKey, true),
			),
		]);
	},
};

async function unsetRelation(
	relatedModelName,
	id,
	prevId,
	targetForeignKey,
	isMany,
) {
	if (!prevId) return;

	const prevTarget = await ReactiveRecord.get(relatedModelName, prevId, {
		props: [targetForeignKey],
	});
	if (prevTarget) {
		const oldIndex = prevTarget[targetForeignKey] || [];
		await ReactiveRecord.edit(
			relatedModelName,
			{
				id: prevId,
				[targetForeignKey]: isMany
					? oldIndex.filter((entry) => entry !== id)
					: null,
			},
			{ skipRelationship: true },
		);
	}
}

async function setRelation(
	relatedModelName,
	id,
	newId,
	targetForeignKey,
	isMany,
	position,
) {
	const target = await ReactiveRecord.get(relatedModelName, newId, {
		createIfNotFound: true,
		props: [targetForeignKey],
	});
	let newIndex = isMany ? target[targetForeignKey] ?? [] : null;

	if (isMany) {
		if (typeof position === "number") newIndex.splice(position, 0, id);
		else if (!newIndex.includes(id)) newIndex.push(id);
	} else {
		newIndex = id;
	}

	await ReactiveRecord.edit(
		relatedModelName,
		{ id: newId, [targetForeignKey]: newIndex },
		{ skipRelationship: true },
	);
}

const put = async (modelName, _row = {}, opts = {}) => {
	let { skipRelationship, db: _db, currentRow = {} } = opts;
	const system = isSystemModel(modelName);
	let row = _row;
	const db = _db || (await ReactiveRecord.getDB(system));
	if (row.id) {
		currentRow = (await ReactiveRecord.get(modelName, row.id)) || {};
	} else row.id = self.APP.Backend.generateId();
	if (system) {
		try {
			const result = await db.put(modelName, { ...currentRow, ...row });
			return [null, result];
		} catch (error) {
			return [error, null];
		}
	}

	const modelSchema = { id: self.APP.T.string({ primary: true }) };
	Object.assign(modelSchema, db.models[modelName]);
	const [errors, validatedRow] = self.APP.T.validateType(_row, {
		schema: modelSchema,
		row: currentRow,
	});
	if (errors) return [errors, null];
	row = validatedRow;
	const user = await self.APP.Backend.getUser();
	const timestamp = Date.now();

	const metadata = currentRow?.__metadata__ || {
		createdAt: timestamp,
		createdBy: user.id,
		propsLastChanged: {},
	};

	metadata.updatedAt = timestamp;
	metadata.updatedBy = user.id;
	const skipProps = [];
	await Promise.all(
		Object.keys(row).map(async (key) => {
			const prop = db.models[modelName][key];
			if (prop?.targetModel) {
				if (
					typeof row[key] === "object" &&
					row[key] !== null &&
					!Array.isArray(row[key])
				) {
					skipProps.push(key);
					row[key] = await handleNestedObject(key, row[key], row.id, db, prop);
				} else if (Array.isArray(row[key])) {
					skipProps.push(key);
					row[key] = await Promise.all(
						row[key].map(async (item) => {
							if (typeof item === "object" && item !== null) {
								return await handleNestedObject(key, item, row.id, db, prop);
							}
							return item;
						}),
					);
				}
			}
			if (row[key] !== currentRow[key]) {
				metadata.propsLastChanged[key] = {
					updatedAt: timestamp,
					updatedBy: user.id,
				};
			}
		}),
	);

	row.__metadata__ = metadata;

	if (!skipRelationship) {
		await handleRelationships(modelName, row, { db, skipProps });
	}

	if (
		await db.put(
			modelName,
			db.prepareRow({ model: modelName, row, currentRow }),
		)
	)
		return [null, row];
};

const handleNestedObject = async (propKey, nestedObj, parentId, db, prop) => {
	const relatedModelName = prop.targetModel;
	if (relatedModelName) {
		const targetForeignKey = prop.targetForeignKey || propKey;
		nestedObj[targetForeignKey] = parentId;
		const result = await ReactiveRecord.add(relatedModelName, nestedObj, {
			db,
			skipRelationship: true,
		});
		return result.id;
	}
	return nestedObj;
};

const insertOplog = (
	command,
	{ model, row: { __metadata__, ...row }, currentRow },
	opts = {},
) => {
	if (!isSystemModel(model) && ReactiveRecord.db.oplog)
		setTimeout(() => {
			ReactiveRecord.oplog({ command, model, row, currentRow, opts });
		}, 0);
};

class ReactiveRecord {
	static stores = {};

	static async getDB(system, models) {
		return system
			? ReactiveRecord.getSysDB()
			: ReactiveRecord.getMainDB(models);
	}

	static async getSysDB() {
		if (!ReactiveRecord.sysdb) {
			ReactiveRecord.sysdb = await self.APP.helpers.openDB({
				name: self.APP.config.SYSMODELS.APP,
				version: 1,
				models: self.APP.sysmodels,
				system: true,
			});
		}
		return ReactiveRecord.sysdb;
	}

	static async getMainDB(models) {
		if (!ReactiveRecord.db) {
			const app = await self.APP.Backend.getApp();
			const updateVersion = () => {
				if (!models) return;
				const version = app.version + 1;
				ReactiveRecord.edit(self.APP.config.SYSMODELS.APP, {
					id: app.id,
					version,
					models,
				});
				return version;
			};
			ReactiveRecord.db = await self.APP.helpers.openDB({
				name: app.id,
				oplog: true,
				version: app.version,
				models: self.APP.models,
				updateVersion,
			});
		}
		return ReactiveRecord.db;
	}

	static async oplog({ command, model, row, currentRow, opts = {} }) {
		const db = opts.db || (await ReactiveRecord.getMainDB());
		if (!command || !model || model[0] === "_") return;
		const user = await self.APP.Backend.getUser();
		const timestamp = Date.now();
		if (command === "EDIT") {
			const changes = {};
			for (const key in row) {
				const currentVal = currentRow[key];
				const newVal = row[key];

				if (Array.isArray(currentVal) || Array.isArray(newVal)) {
					if (
						!Array.isArray(currentVal) ||
						!Array.isArray(newVal) ||
						JSON.stringify(currentVal) !== JSON.stringify(newVal)
					) {
						changes[key] = newVal;
					}
				} else if (
					typeof currentVal === "object" ||
					typeof newVal === "object"
				) {
					if (
						typeof currentVal !== "object" ||
						typeof newVal !== "object" ||
						JSON.stringify(currentVal) !== JSON.stringify(newVal)
					) {
						changes[key] = newVal;
					}
				} else if (currentVal !== newVal) {
					changes[key] = newVal;
				}
			}
		}

		db.put(`${model}_oplog`, {
			id: self.APP.Backend.generateId(),
			timestamp,
			userId: user.id,
			command,
			payload: row,
		});
	}

	static async get(modelName, idOrFilter, opts = {}) {
		if (!idOrFilter) return null;
		const { createIfNotFound = false, include = [] } = opts;
		const system = isSystemModel(modelName);
		const db = await ReactiveRecord.getDB(system);
		const entry = await db.get(modelName, idOrFilter);
		if (!entry && !createIfNotFound) return null;
		const row = { ...entry, id: entry?.id || idOrFilter?.id || idOrFilter };
		if (!entry && createIfNotFound)
			await ReactiveRecord.add(
				modelName,
				row,
				{ skipRelationship: true },
				{ db },
			);
		const preparedRow = db.prepareRow({ model: modelName, row, reverse: true });

		if (include.length > 0) {
			await ReactiveRecord.loadIncludedRelationships(
				modelName,
				preparedRow,
				include,
				db,
			);
		}

		return preparedRow;
	}

	static async getMany(modelName, opts = {}) {
		const {
			paginated = true,
			limit,
			offset,
			filter: _filter,
			order,
			include = [],
		} = opts;
		const system = isSystemModel(modelName);
		const db = await ReactiveRecord.getDB(system);
		const filter = typeof _filter === "string" ? JSON.parse(_filter) : _filter;
		const items = await db.getAll(modelName, { limit, offset, filter, order });
		const preparedItems = items.map((row) =>
			db.prepareRow({ model: modelName, row, reverse: true }),
		);

		if (include.length > 0) {
			await Promise.all(
				preparedItems.map((item) =>
					ReactiveRecord.loadIncludedRelationships(
						modelName,
						item,
						include,
						db,
					),
				),
			);
		}

		if (limit > 0 || paginated) {
			const count = await db.count(modelName, { filter });
			return { count, limit, offset, items: preparedItems };
		}
		return preparedItems;
	}

	static async loadIncludedRelationships(modelName, row, include, db) {
		const model = db.models[modelName];
		for (const relationPath of include) {
			const parts = relationPath.split(".");
			let currentModel = model;
			let currentRow = row;

			for (const part of parts) {
				if (!currentModel[part] || !currentModel[part].targetModel) {
					console.warn(`Invalid relation path: ${relationPath}`);
					break;
				}

				const relationType = currentModel[part].relationship;
				const targetModelName = currentModel[part].targetModel;

				if (relationType === "one") {
					const relatedId = currentRow[part];
					if (relatedId) {
						currentRow[part] = await ReactiveRecord.get(
							targetModelName,
							relatedId,
						);
					}
				} else if (relationType === "many") {
					const relatedIds = currentRow[part] || [];
					currentRow[part] = await Promise.all(
						relatedIds.map((id) => ReactiveRecord.get(targetModelName, id)),
					);
				}

				currentModel = db.models[targetModelName];
				currentRow = currentRow[part];
			}
		}
	}

	static remove = async (modelName, id, opts = {}) => {
		const db = await ReactiveRecord.getDB(isSystemModel(modelName));
		const properties = db.models[modelName];
		const propKeys = Object.keys(properties).filter(
			(propKey) => properties[propKey]?.targetModel,
		);

		const prevValue = await ReactiveRecord.get(modelName, id, {
			db,
		});
		await Promise.all(
			propKeys.map(async ([propKey, prop]) => {
				if (prop.targetModel) {
					const relatedModel = db.models[prop.targetModel];
					if (!relatedModel) {
						console.error(`ERROR: couldn't find model ${prop.targetModel}`);
						return;
					}
					const targetForeignKey = prop.targetForeignKey || modelName;
					const targetIsMany = relatedModel[targetForeignKey]?.type === "many";
					if (prop.type === "one" && prevValue?.[propKey]) {
						await unsetRelation(
							prop.targetModel,
							id,
							prevValue[propKey],
							targetForeignKey,
							targetIsMany,
						);
					} else if (
						prop.type === "many" &&
						Array.isArray(prevValue?.[propKey])
					) {
						await Promise.all(
							prevValue[propKey].map((relatedId) =>
								unsetRelation(
									prop.targetModel,
									relatedId,
									id,
									targetForeignKey,
									targetIsMany,
								),
							),
						);
					}
				}
			}),
		);
		const result = await db.delete(modelName, id);
		insertOplog(
			"REMOVE",
			{ model: modelName, row: { id }, currentRow: prevValue },
			opts,
		);
		return result ? id : "";
	};

	static edit = async (modelName, row, opts = {}) => {
		opts.currentRow = await ReactiveRecord.get(modelName, row.id, {
			db: opts.db,
		});
		if (!opts.currentRow) return;
		const [errors, result] = await put(modelName, row, opts);
		if (errors) return { errors };
		insertOplog(
			"EDIT",
			{ model: modelName, row, currentRow: opts.currentRow },
			opts,
		);
		return result;
	};

	static async add(modelName, row, opts = {}) {
		if (!isSystemModel(modelName) && !opts.keepIndex) row.id = undefined;
		const [errors, newRow] = await put(modelName, row, opts);
		if (errors) return { errors };
		insertOplog("ADD", { model: modelName, row: newRow }, opts);
		return newRow;
	}

	static async addMany(modelName, rows = [], opts = {}) {
		await Promise.all(
			rows.map((row) => ReactiveRecord.add(modelName, row, opts)),
		);
	}

	static async editMany(modelName, rows, opts = {}) {
		if (!rows?.length) return;
		await Promise.all(
			rows.map((entries) => ReactiveRecord.edit(modelName, entries, opts)),
		);
	}

	static async editAll(modelName, updates, opts = {}) {
		const system = isSystemModel(modelName);
		const db = await ReactiveRecord.getDB(system);
		const rows = await db.getAll(modelName, opts);
		await Promise.all(
			rows.map((entry) =>
				ReactiveRecord.edit(modelName, { ...entry, ...updates }, opts),
			),
		);
	}

	static async removeMany(modelName, ids, opts = {}) {
		if (!ids?.length) return;
		await Promise.all(
			ids.map((id) => ReactiveRecord.remove(modelName, id, opts)),
		);
	}

	static async isEmpty(modelName) {
		const system = isSystemModel(modelName);
		const db = await ReactiveRecord.getDB(system);
		const count = await db.count(modelName);
		return count === 0;
	}

	static async count(modelName) {
		const system = isSystemModel(modelName);
		const db = await ReactiveRecord.getDB(system);
		return db.count(modelName);
	}
}

const ReactiveRecordEvents = {
	DISCONNECT: (_, { port }) => {
		port.removePort();
	},
	CREATE_REMOTE_WORKSPACE: async ({ payload }, { importDB }) => {
		await importDB(payload);
	},
	ADD_REMOTE_USER: async ({ payload }) => {
		self.APP.Backend.createUserEntry(payload);
	},
	ADD: async ({ payload }, { respond, broadcast }) => {
		const { ReactiveRecord } = self.APP;
		const response = await ReactiveRecord.add(payload.model, payload.row);
		respond(response);
		broadcast({
			type: "REQUEST_DATA_SYNC",
			payload: { model: payload.model, id: response.id },
		});
	},

	ADD_MANY: async ({ payload }, { respond, broadcast }) => {
		const { ReactiveRecord } = self.APP;
		await ReactiveRecord.addMany(payload.model, payload.rows);
		const response = { success: true };
		respond(response);
		broadcast({
			type: "REQUEST_DATA_SYNC",
			payload: { model: payload.model, ids: payload.rows.map((row) => row.id) },
		});
	},

	REMOVE: async ({ payload }, { respond, broadcast }) => {
		const { ReactiveRecord } = self.APP;
		const response = await ReactiveRecord.remove(payload.model, payload.id);
		respond(response);
		broadcast({ type: "REQUEST_DATA_SYNC", payload });
	},

	REMOVE_MANY: async ({ payload }, { broadcast }) => {
		const { ReactiveRecord } = self.APP;
		await ReactiveRecord.removeMany(payload.model, payload.ids);
		const response = { success: true };
		respond(response);
		broadcast({
			type: "REQUEST_DATA_SYNC",
			payload: { model: payload.model, ids: payload.ids },
		});
	},

	EDIT: async ({ payload }, { respond, broadcast }) => {
		const { ReactiveRecord } = self.APP;
		const response = await ReactiveRecord.edit(payload.model, payload.row);
		respond(response);
		broadcast({ type: "REQUEST_DATA_SYNC", payload });
	},

	EDIT_MANY: async ({ payload }, { respond, broadcast }) => {
		const { ReactiveRecord } = self.APP;
		await ReactiveRecord.editMany(payload.model, payload.rows);
		const response = { success: true };
		respond(response);
		broadcast({
			type: "REQUEST_DATA_SYNC",
			payload: { model: payload.model, ids: payload.rows.map((row) => row.id) },
		});
	},

	GET: async ({ payload }, { respond }) => {
		const { ReactiveRecord } = self.APP;
		const response = await ReactiveRecord.get(
			payload.model,
			payload.id,
			payload.opts,
		);
		respond(response);
	},

	GET_MANY: async ({ payload }, { respond }) => {
		const { ReactiveRecord } = self.APP;
		const response = await ReactiveRecord.getMany(payload.model, payload.opts);
		respond(response);
	},
};

self.APP.add(ReactiveRecordEvents, { prop: "events" });
self.APP.add(ReactiveRecord, { library: "ReactiveRecord" });


self.APP.add(
	{ BASE_URL: "/www", DEV_SERVER: "http://localhost:8111" },
	{ prop: "config" },
);


	}
)();
