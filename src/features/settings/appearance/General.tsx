import { useTranslation } from "react-i18next";
import { IonLabel, IonList, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setUserInstanceUrlDisplay } from "../settingsSlice";
import { OInstanceUrlDisplayMode } from "../../../services/db";
import { ListHeader } from "../shared/formatting";

export default function GeneralAppearance() {
  const dispatch = useAppDispatch();

  const userInstanceUrlDisplay = useAppSelector(
    (state) => state.settings.appearance.general.userInstanceUrlDisplay,
  );

  const { t,i18n } = useTranslation();

  return (
    <>
      <ListHeader>
        <IonLabel>{t('general')}</IonLabel>
      </ListHeader>
      <IonList inset>
        <InsetIonItem>
          <IonLabel>{t('showUserInstance')}</IonLabel>
          <IonToggle
            checked={
              userInstanceUrlDisplay === OInstanceUrlDisplayMode.WhenRemote
            }
            onIonChange={(e) =>
              dispatch(
                setUserInstanceUrlDisplay(
                  e.detail.checked
                    ? OInstanceUrlDisplayMode.WhenRemote
                    : OInstanceUrlDisplayMode.Never,
                ),
              )
            }
          />
        </InsetIonItem>
      </IonList>
    </>
  );
}
