import { useTranslation } from "react-i18next";
import { IonLabel, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setMarkPostsReadOnScroll } from "../../settingsSlice";

export default function MarkReadOnScroll() {
  const dispatch = useAppDispatch();
  const { markReadOnScroll } = useAppSelector(
    (state) => state.settings.general.posts,
  );

  const { t,i18n } = useTranslation();

  return (
    <InsetIonItem>
      <IonLabel>{t('mark-read-on-scroll')}</IonLabel>
      <IonToggle
        checked={markReadOnScroll}
        onIonChange={(e) =>
          dispatch(setMarkPostsReadOnScroll(e.detail.checked))
        }
      />
    </InsetIonItem>
  );
}
