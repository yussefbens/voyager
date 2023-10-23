import { useTranslation } from "react-i18next";
import { openOutline, readerOutline } from "ionicons/icons";
import { OLinkHandlerType } from "../../../../services/db";
import { useAppSelector } from "../../../../store";
import { setLinkHandler } from "../../settingsSlice";
import SettingSelector from "../../shared/SettingSelector";
import { isNative } from "../../../../helpers/device";

export default function LinkHandler() {
  const linkHandler = useAppSelector(
    (state) => state.settings.general.linkHandler,
  );

  if (!isNative()) return;

  const { t,i18n } = useTranslation();

  return (
    <SettingSelector
      title={t('open-links-in')}
      selected={linkHandler}
      setSelected={setLinkHandler}
      options={OLinkHandlerType}
      optionIcons={{
        [OLinkHandlerType.DefaultBrowser]: openOutline,
        [OLinkHandlerType.InApp]: readerOutline,
      }}
    />
  );
}
