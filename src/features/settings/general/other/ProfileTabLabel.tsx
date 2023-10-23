import { useTranslation } from "react-i18next";
import { OProfileLabelType, ProfileLabelType } from "../../../../services/db";
import { useAppSelector } from "../../../../store";
import { setProfileLabel } from "../../settingsSlice";
import SettingSelector from "../../shared/SettingSelector";

export default function ProfileTabLabel() {
  const profileLabel = useAppSelector(
    (state) => state.settings.appearance.general.profileLabel,
  );

  const { t,i18n } = useTranslation();

  return (
    <SettingSelector
      title={t('profile-tab-label')}
      selected={profileLabel}
      setSelected={setProfileLabel}
      options={OProfileLabelType}
    />
  );
}

export function getProfileTabLabel(
  profileLabelType: ProfileLabelType,
  handle: string | undefined,
  connectedInstance: string,
) {
  switch (profileLabelType) {
    case OProfileLabelType.Hide:
      return "Profile";
    case OProfileLabelType.Handle:
      if (!handle) return connectedInstance;

      return handle;
    case OProfileLabelType.Username:
      if (!handle) return connectedInstance;

      return handle.slice(0, handle.lastIndexOf("@"));
    default:
      return connectedInstance;
  }
}
