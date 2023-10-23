import { getHandle } from "../../../helpers/lemmy";
import { useBuildGeneralBrowseLink } from "../../../helpers/routes";
import { Community, SubscribedType } from "lemmy-js-client";
import Handle from "../Handle";
import { StyledLink } from "./shared";
import ItemIcon from "../img/ItemIcon";
import { css } from "@emotion/react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { useIonActionSheet } from "@ionic/react";
import { useLongPress } from "use-long-press";
import {
  blockCommunity,
  followCommunity,
} from "../../community/communitySlice";
import {
  buildBlocked,
  buildProblemSubscribing,
  buildSuccessSubscribing,
} from "../../../helpers/toastMessages";
import {
  heartDislikeOutline,
  heartOutline,
  removeCircleOutline,
} from "ionicons/icons";
import { useContext } from "react";
import { PageContext } from "../../auth/PageContext";
import useAppToast from "../../../helpers/useAppToast";
import { useTranslation } from "react-i18next";

interface CommunityLinkProps {
  community: Community;
  showInstanceWhenRemote?: boolean;
  subscribed: SubscribedType;

  className?: string;
}

export default function CommunityLink({
  community,
  showInstanceWhenRemote,
  className,
  subscribed,
}: CommunityLinkProps) {
  const dispatch = useAppDispatch();
  const [present] = useIonActionSheet();
  const presentToast = useAppToast();
  const { presentLoginIfNeeded } = useContext(PageContext);
  const { t,i18n } = useTranslation();

  const communityByHandle = useAppSelector(
    (state) => state.community.communityByHandle,
  );

  const _subscribed =
    communityByHandle[getHandle(community)]?.subscribed ?? subscribed;

  const isSubscribed =
    _subscribed === "Subscribed" || _subscribed === "Pending";

  const bind = useLongPress(
    () => {
      present({
        cssClass: "left-align-buttons",
        buttons: [
          {
            text: t('blockCommunity'),
            icon: removeCircleOutline,
            role: "destructive",
            handler: () => {
              (async () => {
                if (presentLoginIfNeeded()) return;

                await dispatch(blockCommunity(true, community.id));

                presentToast(buildBlocked(true, getHandle(community)));
              })();
            },
          },
          {
            text: !isSubscribed ? t('subscribe') : t('unsubscribe'),
            icon: !isSubscribed ? heartOutline : heartDislikeOutline,
            handler: () => {
              (async () => {
                if (presentLoginIfNeeded()) return;

                try {
                  await dispatch(followCommunity(!isSubscribed, community.id));
                } catch (error) {
                  presentToast(
                    buildProblemSubscribing(isSubscribed, getHandle(community)),
                  );
                  throw error;
                }

                presentToast(
                  buildSuccessSubscribing(isSubscribed, getHandle(community)),
                );
              })();
            },
          },
          {
            text: t('cancel'),
            role: "cancel",
          },
        ],
      });
    },
    { cancelOnMovement: true },
  );

  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();

  return (
    <StyledLink
      to={buildGeneralBrowseLink(`/c/${getHandle(community)}`)}
      onClick={(e) => e.stopPropagation()}
      className={className}
      {...bind()}
    >
      <ItemIcon
        item={community}
        size={24}
        css={css`
          margin-right: 0.4rem;
          margin-left: 0.4rem;
          vertical-align: middle;
        `}
      />

      <Handle
        item={community}
        showInstanceWhenRemote={showInstanceWhenRemote}
      />
    </StyledLink>
  );
}
