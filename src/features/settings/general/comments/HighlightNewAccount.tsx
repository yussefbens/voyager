import { useTranslation } from "react-i18next";
import { IonLabel, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setHighlightNewAccount } from "../../settingsSlice";

export default function HighlightNewAccount() {
  const dispatch = useAppDispatch();
  const { highlightNewAccount } = useAppSelector(
    // this needs a better naming
    (state) => state.settings.general.comments,
  );

  const { t,i18n } = useTranslation();

  return (
    <InsetIonItem>
      <IonLabel>New Account Highlightenator</IonLabel>
      <IonToggle
        checked={highlightNewAccount}
        onIonChange={(e) => dispatch(setHighlightNewAccount(e.detail.checked))}
      />
    </InsetIonItem>
  );
}
