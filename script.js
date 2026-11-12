const SVGTAGS = new Set(["svg", "path", "g", "defs", "clipPath", "rect"]);

/**
 * @typedef {Object} RegisterField
 *
 * @property {string} fullname
 * @property {string} email
 * @property {string} phone
 * @property {string} nik
 * @property {string} password
 */

const globalTempStorage = new Map();

const storageKeys = {
    CREDENTIAL: "credential",
    PROFILE: "profile",
    REPORTS: "reports",
};

/**
 *
 * @param {string} storageKey
 * @returns {Object|Array}
 */
function getData(storageKey) {
    const credential = JSON.parse(localStorage.getItem(storageKey));
    return credential;
}

/**
 *
 * @param {string} storageKey
 * @param {string} data
 */
function savetData(storageKey, data) {
    localStorage.setItem(storageKey, data);
}

/**
 *
 * @param {string} name
 * @param {Object} attr
 * @param {string} content
 * @returns {HTMLElement}
 */
function createElement(name, attr = {}, content = "", children = [], events = {}) {

    const el = SVGTAGS.has(name) ? document.createElementNS("http://www.w3.org/2000/svg", name) : document.createElement(name);
    for (let atr in attr) {
        el.setAttribute(atr, attr[atr]);
    }
    for (let e in events) {
        el.addEventListener(e, events[e]);
    }
    if (content) {
        el.textContent = content;
    }

    children.forEach((node) => {
        el.appendChild(node);
    });
    return el;
}

function svgIcon(viewBox, children = [], extraAttr = {}) {
    return createElement(
        "svg",
        { width: "1em", height: "1em", viewBox, fill: "none", ...extraAttr },
        "",
        children,
    );
}

function strokePath(d, strokeWidth) {
    return createElement("path", {
        d,
        "stroke-width": strokeWidth,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        stroke: "currentColor",
    });
}

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns
 */
function validateUser(email, password) {
    const credential = getData(storageKeys.PROFILE);
    if (email === credential.email && password === credential.password) {
        return true;
    }
    return false;
}

/**
 *
 * @param {string} email
 */
function createUserCredential(password) {
    let restLength = 30 - password.length;
    if (restLength < 0) {
        restLength = 0;
    }
    const data = password + "#".repeat(restLength);
    return btoa(data.substring(0, 30));
}

/**
 *
 * @returns {Object}
 */
function getUserCredential() {
    return getData(storageKeys.CREDENTIAL);
}

/**
 *
 * @param {string} token
 * @returns {Boolean}
 */
function verifyUserCredential(token) {
    const decrypt = atob(token);
    const { password } = getData(storageKeys.PROFILE);
    let restLength = 30 - password.length;
    if (restLength < 0) {
        restLength = 0;
    }
    const data = password + "#".repeat(restLength);
    return data === decrypt;
}

function getUserProfileData() {
    const credential = getUserCredential();
    if (!verifyUserCredential(credential)) {
        return {};
    }
    return getData(storageKeys.PROFILE);
}

/**
 *
 * @param {SubmitEvent} e
 */
function registerUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const registerInfo = {
        fullname: formData.get("fullname"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        nik: formData.get("nik"),
        password: formData.get("password"),
    };
    savetData(storageKeys.CREDENTIAL, JSON.stringify(registerInfo));
}

function ModalLoginComponent() {
    return createElement(
        "div",
        {
            class: "width-full height-full position-fix z-i20 bg-dark-tp075 container-modal display-none items-center content-center flex-column",
        },
        "",
        [
            createElement(
                "div",
                {
                    class: "radius-1 md-width-90percent modal-form border-default display-flex items-center content-center flex-column",
                },
                "",
                [

                    // Header
                    createElement(
                        "div",
                        {
                            class: "pad-1half width-full bg-main-color radius-tl-1 radius-tr-1 display-flex items-start content-between flex-row",
                        },
                        "",
                        [
                            createElement(
                                "div",
                                {
                                    class: "display-flex width-70percent items-start content-center flex-column gap-half",
                                },
                                "",
                                [
                                    createElement(
                                        "span",
                                        { class: "fraunces-font weight-600 font-size-1fourth" },
                                        "Sign In to WargaReport",
                                    ),
                                    createElement(
                                        "span",
                                        { class: "public-sans-font weight-400 text-color-default" },
                                        "Sign in to lodge a complaint or upvote issues.",
                                    ),
                                ],
                            ),
                            createElement(
                                "div",
                                { class: "width-third display-flex items-start flex-row content-end" },
                                "",
                                [
                                    createElement(
                                        "button",
                                        {
                                            type: "button",
                                            class: "bg-transparent border-none outline-none font-size-1fourth text-color-default",
                                        },
                                        "",
                                        [
                                            svgIcon("0 0 17 17", [
                                                strokePath("M12.75 4.25L4.25 12.75", "1.41667"),
                                                strokePath("M4.25 4.25L12.75 12.75", "1.41667"),
                                            ]),
                                        ],
                                        {
                                            click: (e) => {
                                                e.currentTarget.closest(".container-modal").classList.toggle("display-flex");
                                                e.currentTarget.closest(".container-modal").classList.toggle("display-none");
                                            },
                                        },
                                    ),
                                ],
                            ),
                        ],
                    ),

                    // Body
                    createElement(
                        "div",
                        {
                            class: "bg-third pad-1half width-full radius-bl-1 radius-br-1 display-flex items-center content-center flex-column gap-1",
                        },
                        "",
                        [
                            // Link sign in / register
                            createElement(
                                "div",
                                { class: "width-full display-flex items-center content-between flex-row gap-1" },
                                "",
                                [
                                    createElement(
                                        "a",
                                        {
                                            href: "signin.html",
                                            class: "width-half bg-primary decoration-none display-flex content-center items-center text-color-white public-sans-font weight-400 cursor-pointer pad-1 border-none outline-none font-size-1 radius-1half",
                                        },
                                        "Sign In Existing Account",
                                    ),
                                    createElement(
                                        "a",
                                        {
                                            href: "register.html",
                                            class: "width-half decoration-none display-flex content-center items-center bg-main-color public-sans-font weight-400 cursor-pointer text-color-default pad-1 border-default outline-none font-size-1 radius-1half",
                                        },
                                        "Register as Citizen",
                                    ),
                                ],
                            ),

                            // Form
                            createElement(
                                "form",
                                {
                                    class: "width-full display-flex items-center content-center flex-column gap-1",
                                    action: "",
                                },
                                "",
                                [
                                    // Email
                                    createElement(
                                        "div",
                                        { class: "display-flex content-start items-center flex-column gap-1 width-full" },
                                        "",
                                        [
                                            createElement(
                                                "label",
                                                {
                                                    class: "ibm-plex-mono-font width-full text-color-default weight-400 text-upper font-size-1",
                                                    for: "email",
                                                },
                                                "Email Address",
                                            ),
                                            createElement(
                                                "div",
                                                {
                                                    class: "width-full display-flex items-center content-between flex-row bg-third border-default radius-1",
                                                },
                                                "",
                                                [
                                                    svgIcon(
                                                        "0 0 14 14",
                                                        [
                                                            strokePath(
                                                                "M2.33333 2.33331H11.6667C12.311 2.33331 12.8333 2.85565 12.8333 3.49998V10.5C12.8333 11.1443 12.311 11.6666 11.6667 11.6666H2.33333C1.689 11.6666 1.16667 11.1443 1.16667 10.5V3.49998C1.16667 2.85565 1.689 2.33331 2.33333 2.33331Z",
                                                                "1.16667",
                                                            ),
                                                            strokePath(
                                                                "M12.8333 4.08331L7 7.58331L1.16667 4.08331",
                                                                "1.16667",
                                                            ),
                                                        ],
                                                        { class: "text-color-default m-x-1" },
                                                    ),
                                                    createElement("input", {
                                                        placeholder: "Enter your email",
                                                        id: "email",
                                                        name: "email",
                                                        type: "text",
                                                        class: "bg-third flex-grow-1 border-none radius-1 pad-y-1 text-color-default font-size-1 public-sans-font weight-400 outline-none",
                                                    }),
                                                ],
                                            ),
                                        ],
                                    ),

                                    // Password
                                    createElement(
                                        "div",
                                        { class: "display-flex content-start items-center flex-column gap-1 width-full" },
                                        "",
                                        [
                                            createElement(
                                                "label",
                                                {
                                                    class: "ibm-plex-mono-font text-color-default width-full weight-400 text-upper font-size-1",
                                                    for: "password",
                                                },
                                                "Password",
                                            ),
                                            createElement(
                                                "div",
                                                {
                                                    class: "width-full display-flex items-center content-between flex-row bg-third border-default radius-1",
                                                },
                                                "",
                                                [
                                                    svgIcon(
                                                        "0 0 14 14",
                                                        [
                                                            createElement("g", { "clip-path": "url(#clip0_199_241)" }, "", [
                                                                strokePath(
                                                                    "M2.91667 6.41669H11.0833C11.7277 6.41669 12.25 6.93902 12.25 7.58335V11.6667C12.25 12.311 11.7277 12.8334 11.0833 12.8334H2.91667C2.27233 12.8334 1.75 12.311 1.75 11.6667V7.58335C1.75 6.93902 2.27233 6.41669 2.91667 6.41669Z",
                                                                    "1.16667",
                                                                ),
                                                                strokePath(
                                                                    "M4.08333 6.41669V4.08335C4.08333 3.30981 4.39062 2.56794 4.9376 2.02096C5.48459 1.47398 6.22645 1.16669 7 1.16669C7.77355 1.16669 8.51541 1.47398 9.06239 2.02096C9.60937 2.56794 9.91667 3.30981 9.91667 4.08335V6.41669",
                                                                    "1.16667",
                                                                ),
                                                            ]),
                                                            createElement("defs", {}, "", [
                                                                createElement("clipPath", { id: "clip0_199_241" }, "", [
                                                                    createElement("rect", {
                                                                        width: "14",
                                                                        height: "14",
                                                                        fill: "white",
                                                                    }),
                                                                ]),
                                                            ]),
                                                        ],
                                                        { class: "text-color-default m-x-1" },
                                                    ),
                                                    createElement("input", {
                                                        placeholder: "Enter your password",
                                                        id: "password",
                                                        name: "password",
                                                        type: "password",
                                                        class: "bg-third flex-grow-1 border-none radius-1 pad-y-1 text-color-default font-size-1 public-sans-font weight-400 outline-none",
                                                    }),
                                                    svgIcon(
                                                        "0 0 16 16",
                                                        [
                                                            strokePath(
                                                                "M1.33331 7.99998C1.33331 7.99998 3.73331 3.33331 7.99998 3.33331C12.2666 3.33331 14.6666 7.99998 14.6666 7.99998C14.6666 7.99998 12.2666 12.6666 7.99998 12.6666C3.73331 12.6666 1.33331 7.99998 1.33331 7.99998Z",
                                                                "1.33333",
                                                            ),
                                                            strokePath(
                                                                "M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z",
                                                                "1.33333",
                                                            ),
                                                        ],
                                                        { class: "text-color-default m-x-1 font-size-1fourth cursor-pointer" },
                                                    ),
                                                ],
                                                {
                                                    // Toggle show/hide password lewat event delegation di wrapper,
                                                    // supaya tidak perlu variabel untuk input maupun ikon mata.
                                                    click: (e) => {
                                                        const icon = e.target.closest("svg");
                                                        const wrapper = e.currentTarget;
                                                        if (!icon || icon !== wrapper.lastElementChild) return;
                                                        const input = wrapper.querySelector("input");
                                                        input.type = input.type === "password" ? "text" : "password";
                                                    },
                                                },
                                            ),
                                        ],
                                    ),

                                    // Submit
                                    createElement(
                                        "button",
                                        {
                                            type: "submit",
                                            class: "bg-primary text-color-white pad-1 public-sans-font weight-600 font-size-1 border-none outline-none radius-1half width-full display-flex items-center content-center flex-row gap-half",
                                        },
                                        "",
                                        [
                                            createElement("span", {}, "Sign In"),
                                            svgIcon("0 0 13 13", [
                                                strokePath("M2.70834 6.5H10.2917", "1.08333"),
                                                strokePath("M6.5 2.70831L10.2917 6.49998L6.5 10.2916", "1.08333"),
                                            ]),
                                        ],
                                    ),
                                ],
                                {
                                    submit: (e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        if (validateUser(formData.get("email"), formData.get("password"))) {
                                            e.currentTarget.closest(".container-modal").classList.toggle("display-flex");
                                            e.currentTarget.closest(".container-modal").classList.toggle("display-none");
                                        }
                                    },
                                },
                            ),
                        ],
                    ),
                ],
            ),
        ],
    );
}
