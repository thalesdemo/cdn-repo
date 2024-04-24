/* badge-configurator.js */
import { setupBadgeSystem } from './badge/badge-service.js';
import { badgeSettingsRegister } from './badge/badge-settings-register-flow.js';
import { badgeSettingsLogin } from './badge/badge-settings-login-flow.js';

setupBadgeSystem(badgeSettingsRegister); // stage.one.register.step1
setupBadgeSystem(badgeSettingsLogin); // stage.two.purchase.step1
