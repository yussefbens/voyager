import { useTranslation } from "react-i18next";
import { IonLabel, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { setUseSystemDarkMode } from "../../../settingsSlice";

export default function DarkMode() {
  const dispatch = useAppDispatch();
  const { usingSystemDarkMode } = useAppSelector(
    (state) => state.settings.appearance.dark,
  );
  const { t,i18n } = useTranslation();

  return (
    <InsetIonItem>
      <IonLabel>{t('use-system')}</IonLabel>
      <IonToggle
        checked={usingSystemDarkMode}
        onIonChange={(e) => dispatch(setUseSystemDarkMode(e.detail.checked))}
      />
    </InsetIonItem>
  );
}
