import { useTranslation } from "react-i18next";
import {
  OPostAppearanceType,
  PostAppearanceType,
  setPostAppearance,
} from "../../settingsSlice";
import { useAppSelector } from "../../../../store";
import SettingSelector from "../../shared/SettingSelector";

export default function PostSize() {
  const postsAppearanceType = useAppSelector(
    (state) => state.settings.appearance.posts.type,
  );

  const PostSizeSelector = SettingSelector<PostAppearanceType>;

  const { t,i18n } = useTranslation();

  return (
    <PostSizeSelector
      title={t('postSize')}
      selected={postsAppearanceType}
      setSelected={setPostAppearance}
      options={OPostAppearanceType}
    />
  );
}
