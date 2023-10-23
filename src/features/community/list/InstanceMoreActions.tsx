import {
  IonButton,
  IonIcon,
  useIonActionSheet,
  useIonRouter,
} from "@ionic/react";
import { ellipsisHorizontal, tabletPortraitOutline } from "ionicons/icons";
import { useBuildGeneralBrowseLink } from "../../../helpers/routes";
import { useTranslation } from "react-i18next";

export default function CommunitiesMoreActions() {
  const router = useIonRouter();
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const [presentActionSheet] = useIonActionSheet();
  const { t,i18n } = useTranslation();

  function present() {
    presentActionSheet({
      cssClass: "left-align-buttons",
      buttons: [
        {
          text: t("instanceSidebar"),
          icon: tabletPortraitOutline,
          handler: () => {
            router.push(buildGeneralBrowseLink("/sidebar"));
          },
        },
        {
          text: t("cancel"),
          role: "cancel",
        },
      ],
    });
  }

  return (
    <IonButton fill="default" onClick={present}>
      <IonIcon icon={ellipsisHorizontal} color="primary" />
    </IonButton>
  );
}
