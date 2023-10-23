import { useTranslation } from "react-i18next";
import { IonIcon, IonList } from "@ionic/react";
import { InsetIonItem, SettingLabel } from "../user/Profile";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import {
  albumsOutline,
  chatbubbleOutline,
  personOutline,
  searchOutline,
} from "ionicons/icons";

interface SearchOptionsProps {
  search: string;
}

export default function SearchOptions({ search }: SearchOptionsProps) {
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();

  const searchURI = encodeURIComponent(search);

  const sanitizedUser = search.replace(/|\/|#|\?|\\/g, "").replace(/^@/, "");

  const { t,i18n } = useTranslation();

  return (
    <IonList inset color="primary">
      <InsetIonItem routerLink={`/search/posts/${searchURI}`}>
        <IonIcon icon={albumsOutline} color="primary" />
        <SettingLabel>{t('postsWith')} “{search}”</SettingLabel>
      </InsetIonItem>
      <InsetIonItem routerLink={`/search/comments/${searchURI}`}>
        <IonIcon icon={chatbubbleOutline} color="primary" />
        <SettingLabel>{t('commentsWith')} “{search}”</SettingLabel>
      </InsetIonItem>
      <InsetIonItem routerLink={`/search/communities/${searchURI}`}>
        <IonIcon icon={searchOutline} color="primary" />
        <SettingLabel>{t('communitiesWith')} “{search}”</SettingLabel>
      </InsetIonItem>
      <InsetIonItem routerLink={buildGeneralBrowseLink(`/u/${sanitizedUser}`)}>
        <IonIcon icon={personOutline} color="primary" />
        <SettingLabel>{t('goToUser')} “{search}”</SettingLabel>
      </InsetIonItem>
    </IonList>
  );
}
