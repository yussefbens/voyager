import { useTranslation } from "react-i18next";
import { IonBadge } from "@ionic/react";
import { CommunityAggregates, SiteAggregates } from "lemmy-js-client";
import { formatNumber } from "../../../helpers/number";

interface SidebarCountsProps {
  counts: CommunityAggregates | SiteAggregates;
}

export default function SidebarCounts({ counts }: SidebarCountsProps) {
  const { t,i18n } = useTranslation();

  return (
    <>
      {"subscribers" in counts ? (
        <>
          <IonBadge>{formatNumber(counts.subscribers)} {t('subscribers')}</IonBadge>{" "}
        </>
      ) : (
        <>
          <IonBadge>{formatNumber(counts.communities)} {t('communities-only')}</IonBadge>{" "}
        </>
      )}
      <IonBadge color="danger">{formatNumber(counts.posts)} {t('posts-only')}</IonBadge>{" "}
      <IonBadge color="warning">
        {formatNumber(counts.comments)} {t('comments-only')}
      </IonBadge>{" "}
      <IonBadge color="success">
        {formatNumber(counts.users_active_month)} {t('users-per-month')}
      </IonBadge>{" "}
      <IonBadge color="tertiary">
        {formatNumber(counts.users_active_week)} {t('per-week')}
      </IonBadge>{" "}
      <IonBadge color="light">
        {formatNumber(counts.users_active_day)} {t('per-day')}
      </IonBadge>
    </>
  );
}
