const API_URL = "https://shirazmetro-api.neda1.paasta.app/api/v1";
// const API_URL = "https://api.shiraz-metro.workers.dev/api/v1";
// const API_URL = "https://metro.sudoshz.ir/api/v1";

const STORAGE_KEY = "shirazmetro:v1";
const REQUEST_TIMEOUT_MS = 15000;
const NEAR_MINUTES = 2;
const REFRESH_MS = 20000;

const PLACEHOLDERS = {
    start: "انتخاب ایستگاه مبدا",
    destination: "انتخاب ایستگاه مقصد"
};

const LINE_NAMES = { line1: "خط ۱", line2: "خط ۲" };

const $ = (id) => document.getElementById(id);

const state = {
    metroData: null,
    line: "line1",
    requestId: 0,
    resultKey: "",
    schedule: [],
    refreshTimer: null
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* ---------------------------------------------------------
   Helpers
   --------------------------------------------------------- */

function toFa(value) {
    return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
}

function toMinutes(time) {
    const [h, m] = String(time).split(":").map(Number);
    return h * 60 + m;
}

function durationBetween(dep, arr) {
    let diff = toMinutes(arr) - toMinutes(dep);
    if (diff < 0) diff += 24 * 60; // crosses midnight
    return diff;
}

function formatMinutes(total) {
    if (total < 60) return `${toFa(total)} دقیقه`;
    const h = Math.floor(total / 60);
    const m = total % 60;
    return m ? `${toFa(h)} ساعت و ${toFa(m)} دقیقه` : `${toFa(h)} ساعت`;
}

function nowMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function scrollBehavior() {
    return reduceMotion.matches ? "auto" : "smooth";
}

/** Scroll `el` to the centre of `container` without moving the whole page. */
function centerInContainer(container, el) {
    const top = el.offsetTop - (container.clientHeight - el.offsetHeight) / 2;
    container.scrollTo({ top: Math.max(0, top), behavior: scrollBehavior() });
}

function keepInView(container, el) {
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < container.scrollTop) {
        container.scrollTop = top - 4;
    } else if (bottom > container.scrollTop + container.clientHeight) {
        container.scrollTop = bottom - container.clientHeight + 4;
    }
}

function loadSaved() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (_) {
        return {};
    }
}

function save() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            line: state.line,
            start: getStation("start"),
            destination: getStation("destination")
        }));
    } catch (_) { /* storage unavailable (private mode, etc.) */ }
}

/* ---------------------------------------------------------
   Stations
   --------------------------------------------------------- */

async function fetchStations() {
    const errorBox = $("station-error");
    errorBox.hidden = true;
    setStationButtonsDisabled(true);

    try {
        const response = await fetch(`${API_URL}/stations/stations`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        if (!data || !data.line1 || !data.line1.stations) throw new Error("Unexpected stations payload");

        state.metroData = data;

        const saved = loadSaved();
        const line = data[saved.line] ? saved.line : "line1";
        setLine(line, { restore: saved });
    } catch (error) {
        console.error("Error fetching stations:", error);
        errorBox.hidden = false;
    } finally {
        setStationButtonsDisabled(!state.metroData);
    }
}

function setStationButtonsDisabled(disabled) {
    ["start-button", "destination-button"].forEach((id) => {
        $(id).disabled = disabled;
    });
}

function createOption(station) {
    const option = document.createElement("div");
    option.className = "station-option";
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.dataset.value = station;
    option.textContent = station;
    return option;
}

function loadStations(line, restore = {}) {
    const lineData = state.metroData && state.metroData[line];
    if (!lineData) return;

    ["start", "destination"].forEach((key) => {
        const container = $(`${key}-options`);
        container.replaceChildren(...lineData.stations.map(createOption));
        setStation(key, "");
    });

    // Restore the previous selection, but only if it still exists on this line
    ["start", "destination"].forEach((key) => {
        if (restore[key] && lineData.stations.includes(restore[key])) {
            setStation(key, restore[key]);
        }
    });

    renderLineMeta(lineData);
}

function renderLineMeta(lineData) {
    const parts = [];
    if (lineData.interval_time) parts.push(`فاصله حرکت: هر ${toFa(lineData.interval_time)} دقیقه`);
    if (lineData.last_update && lineData.last_update !== "Unknown") {
        parts.push(`آخرین بروزرسانی: ${toFa(lineData.last_update)}`);
    }
    $("line-meta").textContent = parts.join("  ·  ");
}

function getStation(key) {
    return $(`${key}-select`).dataset.value || "";
}

function setStation(key, value) {
    const select = $(`${key}-select`);
    const label = $(`${key}-selected`);
    const button = $(`${key}-button`);

    select.dataset.value = value;
    label.textContent = value || PLACEHOLDERS[key];
    button.classList.toggle("has-value", Boolean(value));

    select.querySelectorAll(".station-option").forEach((option) => {
        const isSelected = option.dataset.value === value;
        option.classList.toggle("selected", isSelected);
        option.setAttribute("aria-selected", String(isSelected));
    });
}

function setLine(line, { restore = {} } = {}) {
    state.line = line;
    document.body.dataset.line = line;

    const tabs = document.querySelectorAll(".switch-btn");
    const tabsBox = document.querySelector(".switch-tabs");

    tabs.forEach((tab, index) => {
        const active = tab.dataset.line === line;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
        tab.tabIndex = active ? 0 : -1;
        if (active) tabsBox.style.setProperty("--i", index);
    });

    closeAllDropdowns();
    loadStations(line, restore);
    checkSelection();
    save();
}

/* ---------------------------------------------------------
   Station dropdown
   --------------------------------------------------------- */

function setupStationDropdown(key) {
    const select = $(`${key}-select`);
    const button = $(`${key}-button`);
    const search = $(`${key}-search`);
    const options = $(`${key}-options`);
    const dropdown = select.querySelector(".station-dropdown");

    const visibleOptions = () =>
        [...options.querySelectorAll(".station-option")].filter((o) => o.style.display !== "none");

    const setActive = (option) => {
        options.querySelectorAll(".station-option.active").forEach((o) => o.classList.remove("active"));
        if (option) {
            option.classList.add("active");
            keepInView(options, option);
        }
    };

    const open = () => {
        closeAllDropdowns();
        dropdown.classList.add("open");
        button.classList.add("open");
        select.classList.add("open");
        button.setAttribute("aria-expanded", "true");

        search.value = "";
        filterStations(options, "");
        setActive(null);

        const selected = options.querySelector(".station-option.selected");
        if (selected) {
            setActive(selected);
            requestAnimationFrame(() => centerInContainer(options, selected));
        }

        // preventScroll: avoid the page jumping when the keyboard opens on mobile
        setTimeout(() => search.focus({ preventScroll: true }), 60);
    };

    const choose = (option) => {
        if (!option || option.classList.contains("disabled")) return;
        setStation(key, option.dataset.value);
        closeAllDropdowns();
        button.focus({ preventScroll: true });
        checkSelection();
        save();
    };

    button.addEventListener("click", () => {
        if (dropdown.classList.contains("open")) {
            closeAllDropdowns();
        } else {
            open();
        }
    });

    button.addEventListener("keydown", (event) => {
        if ((event.key === "ArrowDown" || event.key === "ArrowUp") && !dropdown.classList.contains("open")) {
            event.preventDefault();
            open();
        }
    });

    search.addEventListener("input", () => {
        filterStations(options, search.value);
        setActive(visibleOptions()[0] || null);
    });

    search.addEventListener("keydown", (event) => {
        const list = visibleOptions();
        const current = options.querySelector(".station-option.active");
        const index = list.indexOf(current);

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setActive(list[Math.min(index + 1, list.length - 1)] || null);
                break;
            case "ArrowUp":
                event.preventDefault();
                setActive(list[Math.max(index - 1, 0)] || null);
                break;
            case "Enter":
                event.preventDefault();
                choose(current && list.includes(current) ? current : list[0]);
                break;
            case "Escape":
                event.preventDefault();
                event.stopPropagation();
                closeAllDropdowns();
                button.focus({ preventScroll: true });
                break;
            case "Tab":
                closeAllDropdowns();
                break;
        }
    });

    options.addEventListener("click", (event) => {
        choose(event.target.closest(".station-option"));
    });

    options.addEventListener("mousemove", (event) => {
        const option = event.target.closest(".station-option");
        if (option && !option.classList.contains("active")) setActive(option);
    });
}

/** Normalise Arabic/Persian letter variants so searching "ي"/"ك" still matches. */
function normalize(text) {
    return String(text)
        .replace(/ي/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/[‌‏\s]+/g, " ")
        .trim()
        .toLowerCase();
}

function filterStations(optionsContainer, searchText) {
    const search = normalize(searchText);
    let visibleCount = 0;

    optionsContainer.querySelectorAll(".station-option").forEach((option) => {
        const match = normalize(option.textContent).includes(search);
        option.style.display = match ? "" : "none";
        if (match) visibleCount++;
    });

    let noResults = optionsContainer.querySelector(".station-no-results");

    if (visibleCount === 0) {
        if (!noResults) {
            noResults = document.createElement("div");
            noResults.className = "station-no-results";
            noResults.textContent = "ایستگاهی پیدا نشد";
            optionsContainer.appendChild(noResults);
        }
    } else if (noResults) {
        noResults.remove();
    }
}

function closeAllDropdowns() {
    document.querySelectorAll(".station-dropdown").forEach((d) => d.classList.remove("open"));
    document.querySelectorAll(".station-select").forEach((s) => s.classList.remove("open"));
    document.querySelectorAll(".station-select-button").forEach((b) => {
        b.classList.remove("open");
        b.setAttribute("aria-expanded", "false");
    });
}

/* ---------------------------------------------------------
   Form state
   --------------------------------------------------------- */

function currentKey() {
    return [state.line, getStation("start"), getStation("destination"), $("holiday").checked].join("|");
}

function checkSelection() {
    const start = getStation("start");
    const destination = getStation("destination");
    const button = $("calculate");
    const hint = $("form-hint");

    const same = start !== "" && start === destination;
    hint.textContent = same ? "مبدا و مقصد نمی‌تواند یکسان باشد" : "";

    button.disabled = start === "" || destination === "" || same;

    // Inputs changed since the last result: drop the stale result
    if (state.resultKey && state.resultKey !== currentKey()) {
        clearResults();
    }
}

function swapStations() {
    const start = getStation("start");
    const destination = getStation("destination");
    setStation("start", destination);
    setStation("destination", start);

    const swap = $("swap");
    swap.classList.remove("spin");
    void swap.offsetWidth; // restart the animation
    swap.classList.add("spin");

    checkSelection();
    save();
}

/* ---------------------------------------------------------
   Results
   --------------------------------------------------------- */

function setLoading(loading) {
    const button = $("calculate");
    button.classList.toggle("loading", loading);
    button.setAttribute("aria-busy", String(loading));
    if (loading) button.disabled = true;
}

function showResultsBody() {
    $("results-empty").hidden = true;
    $("results-body").hidden = false;
}

function clearResults() {
    state.requestId++; // invalidate any in-flight request
    state.resultKey = "";
    state.schedule = [];
    stopRefresh();
    setLoading(false);
    $("results-body").hidden = true;
    $("results-empty").hidden = false;
    $("schedule").replaceChildren();
}

function setSummaryVisible(visible) {
    $("summary").hidden = !visible;
    document.querySelector(".list-head").hidden = !visible;
    document.querySelector(".legend").hidden = !visible;
}

function showSkeleton() {
    showResultsBody();
    setSummaryVisible(false);
    $("route-title").textContent = "در حال دریافت زمان‌بندی…";
    $("route-sub").textContent = "";

    const skeletons = Array.from({ length: 5 }, () => {
        const div = document.createElement("div");
        div.className = "skeleton";
        return div;
    });
    $("schedule").replaceChildren(...skeletons);
}

function showStateCard({ title, text, retry }) {
    showResultsBody();
    setSummaryVisible(false);

    const card = document.createElement("div");
    card.className = "state-card";

    const strong = document.createElement("strong");
    strong.textContent = title;
    card.appendChild(strong);

    if (text) {
        const p = document.createElement("span");
        p.textContent = text;
        card.appendChild(p);
    }

    if (retry) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "تلاش دوباره";
        btn.addEventListener("click", calculate);
        card.appendChild(btn);
    }

    $("schedule").replaceChildren(card);
}

function renderRouteTitle(start, destination, isHoliday) {
    const title = $("route-title");
    title.replaceChildren(
        document.createTextNode(start),
        Object.assign(document.createElement("span"), { className: "arrow", textContent: "←" }),
        document.createTextNode(destination)
    );
    $("route-sub").textContent = `${LINE_NAMES[state.line] || state.line} · ${isHoliday ? "روز تعطیل" : "روز عادی"}`;
}

function buildScheduleItem({ departure, arrival }, index) {
    const item = document.createElement("div");
    item.className = "schedule-item";
    item.style.setProperty("--n", index);
    item.dataset.departure = String(toMinutes(departure));

    const makeTime = (cls, caption, value) => {
        const box = document.createElement("div");
        box.className = `si-time ${cls}`;
        const small = document.createElement("small");
        small.textContent = caption;
        const strong = document.createElement("strong");
        strong.textContent = toFa(value);
        box.append(small, strong);
        return box;
    };

    const path = document.createElement("div");
    path.className = "si-path";
    const duration = document.createElement("span");
    duration.className = "si-duration";
    duration.textContent = formatMinutes(durationBetween(departure, arrival));
    const track = document.createElement("span");
    track.className = "si-track";
    path.append(duration, track);

    const badge = document.createElement("span");
    badge.className = "si-badge";

    item.append(makeTime("start", "حرکت", departure), path, makeTime("end", "رسیدن", arrival), badge);
    return item;
}

function displaySchedule(schedule, meta) {
    const list = $("schedule");
    state.schedule = schedule;

    showResultsBody();
    renderRouteTitle(meta.start, meta.destination, meta.holiday);

    if (schedule.length === 0) {
        setSummaryVisible(false);
        const card = document.createElement("div");
        card.className = "no-service";
        const strong = document.createElement("strong");
        strong.textContent = "مترو در این روز خدمات رسانی ندارد";
        card.appendChild(strong);
        list.replaceChildren(card);
        return;
    }

    setSummaryVisible(true);
    list.replaceChildren(...schedule.map(buildScheduleItem));
    $("list-count").textContent = `${toFa(schedule.length)} سرویس در این روز`;

    refreshStatuses();
    startRefresh();

    // Bring the right train into view inside the list
    setTimeout(() => {
        const target = list.querySelector(".current-time") || list.querySelector(".next-train");
        if (target) centerInContainer(list, target);
    }, 250);

    // On stacked (mobile/tablet) layouts the results sit below the form
    if (window.matchMedia("(max-width: 979px)").matches) {
        $("results").scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }
}

/** Re-evaluate which trains are past / next / about to leave. */
function refreshStatuses() {
    const list = $("schedule");
    const items = list.querySelectorAll(".schedule-item");
    if (!items.length) return;

    const now = nowMinutes();
    let nextItem = null;

    items.forEach((item) => {
        const departure = Number(item.dataset.departure);
        const diff = departure - now;
        const isPast = diff < 0;
        const isNext = !isPast && !nextItem;
        if (isNext) nextItem = item;

        const near = !isPast && diff <= NEAR_MINUTES;

        item.classList.toggle("missed", isPast);
        item.classList.toggle("future", !isPast);
        item.classList.toggle("next-train", isNext);
        item.classList.toggle("current-time", near && isNext);
        item.classList.toggle("near-time", near && isNext);
        item.id = isNext ? "next-train" : "";

        const badge = item.querySelector(".si-badge");
        badge.textContent = near && isNext ? "در حال ورود" : isNext ? "مترو بعدی" : "";
    });

    const upcomingCount = list.querySelectorAll(".schedule-item.future").length;
    $("list-count").textContent =
        `${toFa(items.length)} سرویس · ${toFa(upcomingCount)} سرویس باقی‌مانده`;

    renderSummary(nextItem, now);
}

function renderSummary(nextItem, now) {
    const summary = $("summary");
    summary.classList.remove("is-empty", "soon");

    if (!nextItem) {
        summary.classList.add("is-empty");
        $("sum-label").textContent = "امروز";
        $("sum-dep").textContent = "مترو دیگری باقی نمانده";
        $("sum-count").textContent = "";
        return;
    }

    const index = [...nextItem.parentNode.children].indexOf(nextItem);
    const train = state.schedule[index];
    const diff = Number(nextItem.dataset.departure) - now;

    $("sum-label").textContent = "مترو بعدی";
    $("sum-dep").textContent = toFa(train.departure);
    $("sum-arr").textContent = toFa(train.arrival);
    $("sum-dur").textContent = formatMinutes(durationBetween(train.departure, train.arrival));
    $("sum-count").textContent = diff <= 0 ? "همین الان" : `${formatMinutes(diff)} دیگر`;

    if (diff <= NEAR_MINUTES) summary.classList.add("soon");
}

function startRefresh() {
    stopRefresh();
    state.refreshTimer = setInterval(refreshStatuses, REFRESH_MS);
}

function stopRefresh() {
    clearInterval(state.refreshTimer);
    state.refreshTimer = null;
}

async function calculate() {
    const start = getStation("start");
    const destination = getStation("destination");
    const isHoliday = $("holiday").checked;
    const key = currentKey();

    if (!start || !destination || start === destination) return;

    const requestId = ++state.requestId;
    stopRefresh();
    setLoading(true);
    showSkeleton();

    const params = new URLSearchParams({
        startStation: start,
        destinationStation: destination,
        holiday: isHoliday ? "yes" : "no",
        line: state.line
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(`${API_URL}/schedules/calculate?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
        if (requestId !== state.requestId) return; // a newer request / change superseded this one

        state.resultKey = key;
        displaySchedule(Array.isArray(data.schedule) ? data.schedule : [], { start, destination, holiday: isHoliday });
    } catch (error) {
        if (requestId !== state.requestId) return;
        console.error("Error fetching schedule:", error);
        state.resultKey = key;
        renderRouteTitle(start, destination, isHoliday);
        showStateCard({
            title: "دریافت زمان‌بندی ممکن نشد",
            text: error.name === "AbortError"
                ? "پاسخی از سرور دریافت نشد. دوباره تلاش کنید."
                : "اتصال اینترنت یا سرور را بررسی کنید.",
            retry: true
        });
    } finally {
        clearTimeout(timeout);
        if (requestId === state.requestId) {
            setLoading(false);
            checkSelection();
        }
    }
}

/* ---------------------------------------------------------
   Contributors
   --------------------------------------------------------- */

async function loadContributors() {
    const owner = "MaxEdison";
    const repo = "ShirazMetro";
    const list = $("contributors-list");

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`);
        if (!response.ok) throw new Error("GitHub API error");

        const contributors = await response.json();
        if (!Array.isArray(contributors)) throw new Error("Unexpected GitHub payload");

        if (contributors.length === 0) {
            list.innerHTML = "<p>هیچ مشارکت کننده ای یافت نشد</p>";
            return;
        }

        contributors.sort((a, b) => b.contributions - a.contributions);

        const nodes = contributors.map((user, index) => {
            const link = document.createElement("a");
            link.className = "contributor";
            link.href = user.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.title = `${user.login} – ${user.contributions} commit`;
            link.style.setProperty("--n", Math.min(index, 20));

            const img = document.createElement("img");
            img.src = `${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}s=112`;
            img.alt = user.login;
            img.width = 56;
            img.height = 56;
            img.loading = "lazy";

            const name = document.createElement("span");
            name.textContent = user.login;

            link.append(img, name);
            return link;
        });

        list.replaceChildren(...nodes);
    } catch (err) {
        console.error("Failed to load contributors:", err);
        const p = document.createElement("p");
        p.className = "error-text";
        p.textContent = "خطا در بارگذاری مشارکت کنندگان";
        list.replaceChildren(p);
    }
}

/* ---------------------------------------------------------
   Donation widget
   --------------------------------------------------------- */

function setupDonation() {
    const btn = $("donateToggle");
    const content = $("donateContent");
    const arrow = $("donateArrow");

    btn.addEventListener("click", () => {
        const open = content.classList.toggle("open");
        arrow.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", String(open));
    });
}

/* ---------------------------------------------------------
   Init
   --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    setupStationDropdown("start");
    setupStationDropdown("destination");
    setupDonation();

    // Friday is the weekly day off in Iran: pre-select the holiday timetable
    if (new Date().getDay() === 5) $("holiday").checked = true;

    const tabs = [...document.querySelectorAll(".switch-btn")];
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            if (!state.metroData || tab.dataset.line === state.line) return;
            setLine(tab.dataset.line);
        });

        tab.addEventListener("keydown", (event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            const next = tabs[(index + 1) % tabs.length];
            next.focus();
            next.click();
        });
    });

    $("holiday").addEventListener("change", checkSelection);
    $("only-upcoming").addEventListener("change", (event) => {
        $("schedule").classList.toggle("hide-past", event.target.checked);
        const target = $("schedule").querySelector(".next-train");
        if (target) centerInContainer($("schedule"), target);
    });

    $("swap").addEventListener("click", swapStations);
    $("calculate").addEventListener("click", calculate);
    $("station-retry").addEventListener("click", fetchStations);

    fetchStations();
    loadContributors();
});

// Close dropdowns when clicking outside or pressing Escape
document.addEventListener("click", (event) => {
    if (!event.target.closest(".station-select")) closeAllDropdowns();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeAllDropdowns();
});

// Statuses go stale while the tab is hidden; refresh when it comes back
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && state.schedule.length) refreshStatuses();
});
