import { setupCameraSystem } from './frp/camera-service.js'
import { cameraSettingsRegister } from './frp/camera-settings-register-flow.js'
import { cameraSettingsLogin } from './frp/camera-settings-login-flow.js'

setupCameraSystem(cameraSettingsRegister); // stage.two.purchase.step6
setupCameraSystem(cameraSettingsLogin); // stage.three.redeem.step1
