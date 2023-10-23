import { useTranslation } from "react-i18next";
import { ActionSheetButton, IonActionSheet, IonLabel } from "@ionic/react";
import { startCase } from "lodash";
import { InsetIonItem } from "../../user/Profile";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useState } from "react";
import {
  CommentDefaultSort,
  AllLanguages
} from "../../../services/db";
import { IonActionSheetCustomEvent, OverlayEventDetail } from "@ionic/core";
import { setDefaultLanguage } from "../settingsSlice";


const BUTTONS: ActionSheetButton<any>[] = Object.values(
  AllLanguages,
).map(function (language) {
  return {
    text: language,
    data: language
  } as ActionSheetButton<any>;
});

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();
  const postsAppearanceType = useAppSelector(
    (state) => state.settings.language,
  );

  const { t,i18n } = useTranslation();

  return (
    <InsetIonItem button onClick={() => setOpen(true)}>
        <IonLabel>{t('select-a-language')}</IonLabel>
        <IonLabel slot="end" color="medium">
          {startCase(postsAppearanceType)}
        </IonLabel>
        <IonActionSheet
          cssClass="left-align-buttons"
          isOpen={open}
          onDidDismiss={() => setOpen(false)}
          onWillDismiss={(
            e: IonActionSheetCustomEvent<
              OverlayEventDetail<any>
            >,
          ) => {
            if (e.detail.data) {
              switch (e.detail.data) {
                case "English": 
                  i18n.changeLanguage("en");
                  break;
                case "Francais": 
                  i18n.changeLanguage("fr");
                  break;
                case "العربية": 
                  i18n.changeLanguage("ar");
                  break;
              }
              dispatch(setDefaultLanguage(e.detail.data));
            }
          }}
          buttons={BUTTONS.map((b) => ({
            ...b,
            role: postsAppearanceType === b.data ? "selected" : undefined,
          }))}
        />
      </InsetIonItem>
  );
}