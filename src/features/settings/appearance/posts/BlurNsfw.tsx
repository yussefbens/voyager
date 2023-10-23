import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store";
import { OPostBlurNsfw, PostBlurNsfwType } from "../../../../services/db";
import { setBlurNsfwState } from "../../settingsSlice";
import SettingSelector from "../../shared/SettingSelector";

export default function BlurNsfw() {
  const nsfwBlurred = useAppSelector(
    (state) => state.settings.appearance.posts.blurNsfw,
  );

  const BlurSelector = SettingSelector<PostBlurNsfwType>;

  const { t,i18n } = useTranslation();

  return (
    <BlurSelector
      title={t('blurNsfw')}
      selected={nsfwBlurred}
      setSelected={setBlurNsfwState}
      options={OPostBlurNsfw}
    />
  );
}
