import { useTranslation } from "react-i18next";
import { OJumpButtonPositionType } from "../../../../services/db";
import { useAppSelector } from "../../../../store";
import { setJumpButtonPosition } from "../../settingsSlice";
import SettingSelector from "../../shared/SettingSelector";

export default function JumpButtonPosition() {
  const { jumpButtonPosition } = useAppSelector(
    (state) => state.settings.general.comments,
  );

  const { t,i18n } = useTranslation();

  return (
    <SettingSelector
      title={t('jump-button-position')}
      selected={jumpButtonPosition}
      setSelected={setJumpButtonPosition}
      options={OJumpButtonPositionType}
    />
  );
}
