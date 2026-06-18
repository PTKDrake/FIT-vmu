import ProfileController from "./ProfileController";
import PasswordController from "./PasswordController";
import AppearanceController from "./AppearanceController";
import DeleteAccountController from "./DeleteAccountController";

const Settings = {
  ProfileController: Object.assign(ProfileController, ProfileController),
  PasswordController: Object.assign(PasswordController, PasswordController),
  AppearanceController: Object.assign(
    AppearanceController,
    AppearanceController,
  ),
  DeleteAccountController: Object.assign(
    DeleteAccountController,
    DeleteAccountController,
  ),
};

export default Settings;
