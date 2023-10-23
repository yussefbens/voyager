import { useTranslation } from "react-i18next";
import { IonLabel, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setDisableMarkingPostsRead } from "../../settingsSlice";

export default function DisableMarkingRead() {
  const dispatch = useAppDispatch();
  const { disableMarkingRead } = useAppSelector(
    (state) => state.settings.general.posts,
  );

  const { t,i18n } = useTranslation();

  return (
    <InsetIonItem>
      <IonLabel>{t('disable-marking-posts-read')}</IonLabel>
      <IonToggle
        checked={disableMarkingRead}
        onIonChange={(e) =>
          dispatch(setDisableMarkingPostsRead(e.detail.checked))
        }
      />
    </InsetIonItem>
  );
}
