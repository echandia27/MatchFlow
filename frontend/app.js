const API = "http://localhost:3000"

//helpers
const $ = (sel) => document.querySelector(sel);

function setCookie ( name, value, days = 7) {
    const d = new Date();
    d .setTime(d.getDate() + days - 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)}, expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp("^|)" + name + "=(^;]+)"));
    
    return match ? decodeURIComponent(match[2]) : null;
}

//cache simple con localstorage
async function cachedFetch(key, url, ttlMs = 30_0000){
    const raw =localStorage.getItem(key);
    if (raw) {
        const { savedAt, data} = JSON.parse(raw);
        if (Date.now() - savedAt < ttlMs) return data;
}
const res = await fetch(url);
const data = await res.json();
localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data}));
return data;
}

function renderSession() {
    const role = getCookie("role");
    const userId = getCookie("userId");
    $("#sessionBox").innerHTML = role
        ? `<span class="px-3 py-1 rounded-full bg-white border">Sesión: <b>${role}</b> #${userId}</span>
            <button id="logoutBtn" class="ml-2 px-3 py-1 rounded bg-slate-900 text-white">Salir</button>`
        : `<span class="px-3 py-1 rounded-full bg-white border">Sin sesión</span>`;
    const btn = $("#logoutBtn");
    if (btn) btn.onclick = () => {
        setCookie("role", "", -1);
        setCookie("userId", "", -1);
        location.reload();
    };
}

function renderLogin() {
    $("#app").innerHTML = `
        <section class="bg-white p-6 rounded-2xl shadow">
        <h2 class="text-xl font-semibold mb-4">Entrar (demo)</h2>

        <div class="grid md:grid-cols-2 gap-4">
            <div class="border rounded-xl p-4">
            <h3 class="font-semibold mb-2">Candidato</h3>
            <p class="text-sm text-slate-600 mb-3">Accede como un candidato existente.</p>
            <button id="loginCandidate" class="w-full px-4 py-2 rounded bg-blue-600 text-white">Entrar como Candidato #1</button>
            </div>

            <div class="border rounded-xl p-4">
            <h3 class="font-semibold mb-2">Empresa</h3>
            <p class="text-sm text-slate-600 mb-3">Accede como una empresa existente.</p>
            <button id="loginCompany" class="w-full px-4 py-2 rounded bg-emerald-600 text-white">Entrar como Empresa #1</button>
            </div>
        </div>
        </section>
    `;

    $
}