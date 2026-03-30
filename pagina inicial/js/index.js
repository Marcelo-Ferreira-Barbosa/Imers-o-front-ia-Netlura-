const THEME_STORAGE_KEY = "theme";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";
const INTRO_ACTIVE_CLASS = "intro-active";

const toggleButton = document.getElementById("theme-toggle");

function getSystemPreferredTheme() {
	return window.matchMedia("(prefers-color-scheme: light)").matches ? LIGHT_THEME : DARK_THEME;
}

function getInitialTheme() {
	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
	if (savedTheme === LIGHT_THEME || savedTheme === DARK_THEME) {
		return savedTheme;
	}
	return getSystemPreferredTheme();
}

function updateToggleButton(theme) {
	if (!toggleButton) {
		return;
	}

	const isLightTheme = theme === LIGHT_THEME;
	toggleButton.setAttribute("data-mode", isLightTheme ? LIGHT_THEME : DARK_THEME);
	toggleButton.setAttribute("aria-pressed", String(isLightTheme));
	toggleButton.setAttribute("aria-label", isLightTheme ? "Ativar modo escuro" : "Ativar modo claro");
}

function applyTheme(theme) {
	document.body.setAttribute("data-theme", theme);
	updateToggleButton(theme);
}

function setupThemeToggle() {
	const initialTheme = getInitialTheme();
	applyTheme(initialTheme);

	if (!toggleButton) {
		return;
	}

	toggleButton.addEventListener("click", () => {
		const currentTheme = document.body.getAttribute("data-theme") || DARK_THEME;
		const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
		applyTheme(nextTheme);
		localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
	});
}

function setupProfileNavigation() {
	const profileButtons = document.querySelectorAll(".profile button");

	if (!profileButtons.length) {
		return;
	}

	profileButtons.forEach((button) => {
		button.addEventListener("click", () => {
			const profileFigure = button.querySelector("figure");
			const profileName = profileFigure?.querySelector("figcaption")?.textContent?.trim();
			const profileImageSrc = profileFigure?.querySelector("img")?.getAttribute("src");

			if (profileName) {
				localStorage.setItem("perfilAtivoNome", profileName);
			}

			if (profileImageSrc) {
				const profileImageUrl = new URL(profileImageSrc, window.location.href).href;
				localStorage.setItem("perfilAtivoImagem", profileImageUrl);
			}

			window.location.href = "../catalogo/catalogo.html";
		});
	});
}

function setupIntroSequence() {
	const introScreen = document.querySelector("[data-intro]");

	if (!introScreen) {
		document.body.classList.remove(INTRO_ACTIVE_CLASS);
		return;
	}

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	const introHoldDuration = prefersReducedMotion ? 120 : 1550;
	const introOutDuration = prefersReducedMotion ? 120 : 700;

	window.setTimeout(() => {
		introScreen.classList.add("is-leaving");
		document.body.classList.remove(INTRO_ACTIVE_CLASS);

		window.setTimeout(() => {
			introScreen.remove();
		}, introOutDuration + 60);
	}, introHoldDuration);
}

setupIntroSequence();
setupThemeToggle();
setupProfileNavigation();