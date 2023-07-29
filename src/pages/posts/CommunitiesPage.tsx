import { useEffect, useRef } from "react";
import CommunitiesList from "../../features/community/list/CommunitiesList";
import { useSetActivePage } from "../../features/auth/AppContext";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import AppContent from "../../features/shared/AppContent";
import { tabletPortraitOutline } from "ionicons/icons";
import { useBuildGeneralBrowseLink } from "../../helpers/routes";
import { useAppSelector } from "../../store";
import { jwtIssSelector } from "../../features/auth/authSlice";

let done = false;

export default function CommunitiesPage() {
  const router = useIonRouter();
  const buildGeneralBrowseLink = useBuildGeneralBrowseLink();
  const pageRef = useRef<HTMLElement>(null);
  const iss = useAppSelector(jwtIssSelector);

  useSetActivePage(pageRef);

  useEffect(() => {
    if (done) return;
    done = true;
    router.push(buildGeneralBrowseLink(`/${iss ? "home" : "all"}`));
  }, []);

  return (
    <IonPage ref={pageRef}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Communities</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink={buildGeneralBrowseLink("/sidebar")}>
              <IonIcon icon={tabletPortraitOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <CommunitiesList />
      </AppContent>
    </IonPage>
  );
}
