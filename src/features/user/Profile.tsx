import React, { useCallback } from "react";
import { IonIcon, IonLabel, IonList, IonItem } from "@ionic/react";
import styled from "@emotion/styled";
import { useTranslation } from "react-i18next";
import {
  albumsOutline,
  bookmarkOutline,
  chatbubbleOutline,
  settings,
  eyeOffOutline,
} from "ionicons/icons";
import { GetPersonDetailsResponse } from "lemmy-js-client";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import { getHandle, getRemoteHandle } from "../../helpers/lemmy";
import { MaxWidthContainer } from "../shared/AppContent";
import { FetchFn } from "../feed/Feed";
import useClient from "../../helpers/useClient";
import { LIMIT } from "../../services/lemmy";
import { useAppSelector } from "../../store";
import PostCommentFeed, {
  PostCommentItem,
  isPost,
} from "../feed/PostCommentFeed";
import { handleSelector, jwtSelector } from "../auth/authSlice";
import { fixLemmyDateString } from "../../helpers/date";
import Scores from "./Scores";



export const InsetIonItem = styled(IonItem)`
  --background: var(--ion-tab-bar-background, var(--ion-color-step-50, #fff));
`;

export const SettingLabel = styled(IonLabel)`
  margin-left: 16px;
  margin-right: 16px;
`;

interface ProfileProps {
  person: GetPersonDetailsResponse;
}

export default function Profile({ person }: ProfileProps) {
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const jwt = useAppSelector(jwtSelector);
  const client = useClient();
  const myHandle = useAppSelector(handleSelector);

  const isSelf = getRemoteHandle(person.person_view.person) === myHandle;

  const fetchFn: FetchFn<PostCommentItem> = useCallback(
    async (page) => {
      const response = await client.getPersonDetails({
        limit: LIMIT,
        username: getHandle(person.person_view.person),
        page,
        sort: "New",
        auth: jwt,
      });
      return [...response.posts, ...response.comments].sort(
        (a, b) => getCreatedDate(b) - getCreatedDate(a),
      );
    },
    [person, client, jwt],
  );

  const { t,i18n } = useTranslation();

  const header = useCallback(
    () => (
      <MaxWidthContainer>
        <Scores
          aggregates={person.person_view.counts}
          accountCreated={person.person_view.person.published}
        />
        <IonList inset color="primary">
          <InsetIonItem
            routerLink={buildGeneralBrowseLink(
              `/u/${getHandle(person.person_view.person)}/posts`,
            )}
          >
            <IonIcon icon={albumsOutline} color="primary" />{" "}
            <SettingLabel>{t('posts')}</SettingLabel>
          </InsetIonItem>
          <InsetIonItem
            routerLink={buildGeneralBrowseLink(
              `/u/${getHandle(person.person_view.person)}/comments`,
            )}
          >
            <IonIcon icon={chatbubbleOutline} color="primary" />{" "}
            <SettingLabel>{t('comments')}</SettingLabel>
          </InsetIonItem>
          {isSelf && (
            <>
              <InsetIonItem
                routerLink={buildGeneralBrowseLink(
                  `/u/${getHandle(person.person_view.person)}/saved`,
                )}
              >
                <IonIcon icon={bookmarkOutline} color="primary" />{" "}
                <SettingLabel>{t('saved')}</SettingLabel>
              </InsetIonItem>
              <InsetIonItem
                routerLink={buildGeneralBrowseLink(
                  `/u/${getHandle(person.person_view.person)}/hidden`,
                )}
              >
                <IonIcon icon={eyeOffOutline} color="primary" />{" "}
                <SettingLabel>{t('hidden')}</SettingLabel>
              </InsetIonItem>
            </>
          )}
        </IonList>
        <IonList inset color="primary">
          <InsetIonItem
            routerLink='settings'
          >
            <IonIcon icon={settings} color="primary" />{" "}
            <SettingLabel>{t('settings')}</SettingLabel>
          </InsetIonItem>
        </IonList>
      </MaxWidthContainer>
    ),
    [person, buildGeneralBrowseLink, isSelf],
  );

  return (
    <PostCommentFeed
      fetchFn={fetchFn}
      header={header}
      filterHiddenPosts={false}
      filterKeywords={false}
    />
  );
}

function getCreatedDate(item: PostCommentItem): number {
  if (isPost(item)) return Date.parse(fixLemmyDateString(item.post.published));
  return Date.parse(fixLemmyDateString(item.comment.published));
}
