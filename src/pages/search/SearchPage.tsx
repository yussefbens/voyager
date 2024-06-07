import {
  IonHeader,
  IonIcon,
  IonList,
  IonPage,
  IonSearchbar,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import AppContent from "../../features/shared/AppContent";
import { createRef, useState } from "react";
import { css } from "@emotion/react";
import TrendingCommunities from "../../features/search/TrendingCommunities";
import SearchOptions from "../../features/search/SearchOptions";
import { useTranslation } from "react-i18next";
import { InsetIonItem, SettingLabel } from "../profile/ProfileFeedItemsPage";
import { addCircleOutline, enterOutline, openOutline, trendingUp } from "ionicons/icons";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

// eslint-disable-next-line no-undef -- I can't work out where to import this type from
const searchBarRef = createRef<HTMLIonSearchbarElement>();

/**
 * Focuses on the search bar input element.
 */
export const focusSearchBar = () => searchBarRef.current?.setFocus();

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const router = useIonRouter();
  const { t,i18n } = useTranslation();

  const openLink = () => {
    console.log('open link')
    Browser.open({
      url: "https://jmaa.ma/create_community", 
      presentationStyle: "popover"
    })
  }

  return (
    <IonPage className="grey-bg">
      <IonHeader>
        <IonToolbar>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!search.trim()) return;

              const el = await searchBarRef.current?.getInputElement();
              el?.blur();
              router.push(`/search/posts/${encodeURIComponent(search)}`);
            }}
          >
            <IonSearchbar
              ref={searchBarRef}
              placeholder={t('search-posts-communities-users')}
              showCancelButton={search ? "always" : "focus"}
              showClearButton={search ? "always" : "never"}
              css={css`
                padding-top: 0 !important;
                padding-bottom: 0 !important;
              `}
              value={search}
              onIonInput={(e) => setSearch(e.detail.value ?? "")}
              enterkeyhint="search"
            />
          </form>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY={!search}>
        <IonList inset color="primary">
          <InsetIonItem button={true} detail={true} detailIcon={openOutline} onClick={openLink}>
            <IonIcon icon={addCircleOutline} color="primary" />
            <SettingLabel>Start a Community</SettingLabel>
          </InsetIonItem>
        </IonList>
        {!search ? <TrendingCommunities /> : <SearchOptions search={search} />}
      </AppContent>
    </IonPage>
  );
}
