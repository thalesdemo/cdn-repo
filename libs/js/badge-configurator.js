/* badge-configurator.js */
import { setupBadgeSystem } from './badge/badge-service.js';
import { badgeSettingsRegister } from './badge/badge-settings-register-flow.js';
// import { badgeSettingsLogin } from './badge/badge-settings-login-flow.js';

// document.addEventListener("DOMContentLoaded", function () {
    setupBadgeSystem(badgeSettingsRegister);
// });
