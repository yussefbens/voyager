import { IonLabel, IonList, IonToggle } from "@ionic/react";
import { InsetIonItem } from "../../user/Profile";
import { useAppSelector, useAppDispatch } from "../../../store";
import {
  setCompactThumbnailSize,
  setShowVotingButtons,
  setThumbnailPosition,
} from "../settingsSlice";
import {
  OCompactThumbnailPositionType,
  OCompactThumbnailSizeType,
} from "../../../services/db";
import { ListHeader } from "../shared/formatting";
import SettingSelector from "../shared/SettingSelector";
import { useTranslation } from "react-i18next";

export default function CompactSettings() {
  const dispatch = useAppDispatch();
  const { thumbnailsPosition, showVotingButtons, thumbnailSize } =
    useAppSelector((state) => state.settings.appearance.compact);
  const { t,i18n } = useTranslation();
  return (
    <>
      <ListHeader>
        <IonLabel>{t('compactPosts')}</IonLabel>
      </ListHeader>
      <IonList inset>
        <SettingSelector
          title={t('thumbnail-size')}
          selected={thumbnailSize}
          setSelected={setCompactThumbnailSize}
          options={OCompactThumbnailSizeType}
          getOptionLabel={(o) => {
            if (o === OCompactThumbnailSizeType.Small) return t('smallDefault');
          }}
        />
        <SettingSelector
          title={t('thumbnailPosition')}
          selected={thumbnailsPosition}
          setSelected={setThumbnailPosition}
          options={OCompactThumbnailPositionType}
        />
        <InsetIonItem>
          <IonLabel>{t('show-voting-buttons')}</IonLabel>
          <IonToggle
            checked={showVotingButtons}
            onIonChange={(e) =>
              dispatch(setShowVotingButtons(e.detail.checked ? true : false))
            }
          />
        </InsetIonItem>
      </IonList>
    </>
  );
}
