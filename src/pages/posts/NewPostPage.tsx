import { createRef, useContext, useEffect, useRef, useState } from "react";
import CommunitiesList from "../../features/community/list/CommunitiesList";
import { useSetActivePage } from "../../features/auth/AppContext";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import AppContent from "../../features/shared/AppContent";
import CommunitiesMoreActions from "../../features/community/list/InstanceMoreActions";
import { useTranslation } from "react-i18next";
import { PageContext } from "../../features/auth/PageContext";
import TitleSearch from "../../features/community/titleSearch/TitleSearch";
import { useAppDispatch, useAppSelector } from "../../store";
import { getCommunity, getTrendingCommunities } from "../../features/community/communitySlice";
import { InsetIonItem, SettingLabel } from "../../features/user/Profile";
import { getHandle } from "../../helpers/lemmy";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import { trendingUp } from "ionicons/icons";
import { css } from "@emotion/react";
import { CommunityView } from "lemmy-js-client";
import useClient from "../../helpers/useClient";
import { useDebounce } from "usehooks-ts";
import styled from "@emotion/styled";

const SubImgIcon = styled.img<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  object-fit: cover;
  margin-right: .6rem;
`;

const searchBarRef = createRef<HTMLIonSearchbarElement>();

export default function NewPostPage() {
  const pageRef = useRef<HTMLElement>(null);
  const { t,i18n } = useTranslation();
  const { presentPostEditor } = useContext(PageContext);
  const dispatch = useAppDispatch();
  const client = useClient();
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const trendingCommunities = useAppSelector(
    (state) => state.community.trendingCommunities,
  );
  const [search, setSearch] = useState("");
  const [searchPayload, setSearchPayload] = useState<CommunityView[]>([]);
  const debouncedSearch = useDebounce(search, 750);
  const { presentLoginIfNeeded } = useContext(PageContext);

  useEffect(() => {
    if (!trendingCommunities.length) dispatch(getTrendingCommunities());
  }, [dispatch, trendingCommunities]);

  useSetActivePage(pageRef);


  // useEffect(() => {
  //   if (communityByHandle[community]) return;

  //   dispatch(getCommunity(community));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [community]);

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchPayload([]);
      return;
    }

    asyncSearch(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  async function asyncSearch(query:any) {
    if (query) {
      const result = await client.search({
        q: query,
        limit: 8,
        type_: "Communities",
        listing_type: "All",
        sort: "TopAll"
      });
      setSearchPayload(result.communities);
      console.log('result', result)
    }
  }



  function onCommunityClick(community: any) {
    if (presentLoginIfNeeded()) return;

    dispatch(getCommunity(community)).then(res => {
      presentPostEditor(community)
    });
  }

  return (
    <IonPage ref={pageRef}>
      <AppContent scrollY>
        <h5 className="ion-text-center">{t("post-to")}</h5>
        <IonSearchbar
          ref={searchBarRef}
          placeholder={t("search-community")}
          css={css`
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          `}
          value={search}
          onIonInput={(e) => {
            setSearch(e.detail.value ?? "")
          }}
          enterkeyhint="search"
        />
        {!isEmpty(searchPayload) ? searchPayload.map((community) => (
          <IonItem key={community.community.id}
          onClick={() => onCommunityClick(community.community.name)}>
            <SubImgIcon
              src={community.community.icon ? community.community.icon : "/empty.png"}
              size={28}
            />
            {community.community.name}
          </IonItem>
        )) : (trendingCommunities.map((community) => (
        <InsetIonItem
          onClick={() => onCommunityClick(community.community.name)}
          key={community.community.id}
        >
          <IonIcon icon={trendingUp} color="primary" />
          <SettingLabel>{community.community.name}</SettingLabel>
        </InsetIonItem>
        )))}
      </AppContent>
    </IonPage>
  );

  function isEmpty(str: any) {
    return (!str || str.length === 0 );
  }
}
