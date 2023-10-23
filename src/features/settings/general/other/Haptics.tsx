import { useTranslation } from "react-i18next";
import { IonLabel, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setEnableHapticFeedback } from "../../settingsSlice";
import { isNative } from "../../../../helpers/device";

export default function Haptics() {
  const dispatch = useAppDispatch();
  const enableHapticFeedback = useAppSelector(
    (state) => state.settings.general.enableHapticFeedback,
  );

  // Some devices do not support haptics
  if (!isNative() && !("vibrate" in window.navigator)) return;

  const { t,i18n } = useTranslation();

  return (
    <InsetIonItem>
      <IonLabel>{t('haptic-feedback')}</IonLabel>
      <IonToggle
        checked={enableHapticFeedback}
        onIonChange={(e) => dispatch(setEnableHapticFeedback(e.detail.checked))}
      />
    </InsetIonItem>
  );
}
