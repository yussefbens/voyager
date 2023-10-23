import { IonButton, IonIcon, useIonActionSheet } from "@ionic/react";
import { ellipsisHorizontal, eyeOffOutline } from "ionicons/icons";
import useHidePosts from "./useHidePosts";
import { useTranslation } from "react-i18next";

export default function SpecialFeedMoreActions() {
  const [presentActionSheet] = useIonActionSheet();
  const { t,i18n } = useTranslation();

  const hidePosts = useHidePosts();

  function present() {
    presentActionSheet([
      {
        text: t('hidePosts'),
        icon: eyeOffOutline,
        handler: () => {
          hidePosts();
        },
      },
      {
        text: t('cancel'),
        role: "cancel",
      },
    ]);
  }

  return (
    <IonButton fill="default" onClick={present}>
      <IonIcon icon={ellipsisHorizontal} color="primary" />
    </IonButton>
  );
}
