import { useTranslation } from "react-i18next";
import { IonLabel, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setShowJumpButton } from "../../settingsSlice";

export default function ShowJumpButton() {
  const dispatch = useAppDispatch();
  const { showJumpButton } = useAppSelector(
    // this needs a better naming
    (state) => state.settings.general.comments,
  );

  const { t,i18n } = useTranslation();

  return (
    <InsetIonItem>
      <IonLabel>{t('show-jump-button')}</IonLabel>
      <IonToggle
        checked={showJumpButton}
        onIonChange={(e) => dispatch(setShowJumpButton(e.detail.checked))}
      />
    </InsetIonItem>
  );
}
