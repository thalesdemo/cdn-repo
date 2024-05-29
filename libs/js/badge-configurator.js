/* badge-configurator.js */
import { setupBadgeSystem } from './badge/badge-service.js';
import { badgeSettingsRegister } from './badge/badge-settings-register-flow.js';
import { badgeSettingsLogin } from './badge/badge-settings-start-flow.js';

setupBadgeSystem(badgeSettingsRegister); // stage.one.register.step1
setupBadgeSystem(badgeSettingsLogin); // purchase.start.step1 (stage.two.purchase.step1)
