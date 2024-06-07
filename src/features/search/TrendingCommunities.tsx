import { useTranslation } from "react-i18next";
import { IonIcon, IonLabel, IonList, IonListHeader } from "@ionic/react";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import { useAppDispatch, useAppSelector } from "../../store";
import { css } from "@emotion/react";
import { InsetIonItem, SettingLabel } from "../user/Profile";
import { getHandle } from "../../helpers/lemmy";
import { trendingUp } from "ionicons/icons";
import { useEffect } from "react";
import { getTrendingCommunities } from "../community/communitySlice";
import ItemIcon from "../labels/img/ItemIcon";
import styled from "@emotion/styled";
import { getImageSrc } from "../../services/lemmy";

const SubImgIcon = styled.img<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 15%;
  object-fit: cover;
  margin: 1em 0;
`;

export default function TrendingCommunities() {
  const dispatch = useAppDispatch();
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const trendingCommunities = useAppSelector(
    (state) => state.community.trendingCommunities,
  );

  useEffect(() => {
    if (!trendingCommunities.length) dispatch(getTrendingCommunities());
    console.log('trendingCommunities', trendingCommunities)
  }, [dispatch, trendingCommunities]);

  const { t,i18n } = useTranslation();

  return (
    <IonList inset color="primary">
      <IonListHeader>
        <IonLabel
          css={css`
            margin-top: 0;
          `}
        >
          {t('trendingCommunities')}
        </IonLabel>
      </IonListHeader>
      {trendingCommunities.map((community) => (
        <InsetIonItem
          routerLink={buildGeneralBrowseLink(
            `/c/${getHandle(community.community)}`,
          )}
          key={community.community.id}
        >
          <SubImgIcon
              src={getImageSrc(community.community.icon ? community.community.icon : "https://i.ibb.co/jG7gkQr/noicon.png", {
                size: 50,
              })}
              size={50}
            />
          <SettingLabel>{getHandle(community.community)}</SettingLabel>
        </InsetIonItem>
      ))}
    </IonList>
  );
}
