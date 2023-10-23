import { useTranslation } from "react-i18next";
import { IonLabel, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../../../pages/profile/ProfileFeedItemsPage";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
  OCommentThreadCollapse,
  setCommentsCollapsed,
} from "../../settingsSlice";

export default function CollapsedByDefault() {
  const dispatch = useAppDispatch();
  const { collapseCommentThreads } = useAppSelector(
    // this needs a better naming
    (state) => state.settings.general.comments,
  );

  const { t,i18n } = useTranslation();

  return (
    <InsetIonItem>
      <IonLabel>{t('collapse-comment-threads')}</IonLabel>
      <IonToggle
        checked={collapseCommentThreads === OCommentThreadCollapse.Always}
        onIonChange={(e) =>
          dispatch(
            setCommentsCollapsed(
              e.detail.checked
                ? OCommentThreadCollapse.Always
                : OCommentThreadCollapse.Never,
            ),
          )
        }
      />
    </InsetIonItem>
  );
}
