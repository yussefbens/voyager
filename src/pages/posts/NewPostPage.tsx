import { useContext, useRef } from "react";
import CommunitiesList from "../../features/community/list/CommunitiesList";
import { useSetActivePage } from "../../features/auth/AppContext";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import AppContent from "../../features/shared/AppContent";
import CommunitiesMoreActions from "../../features/community/list/InstanceMoreActions";
import { PageContext } from "../../features/auth/PageContext";
import TitleSearch from "../../features/community/titleSearch/TitleSearch";
import { useAppSelector } from "../../store";

export default function NewPostPage() {
  const pageRef = useRef<HTMLElement>(null);
  const { presentPostEditor } = useContext(PageContext);

  useSetActivePage(pageRef);

  function openModal() {
    presentPostEditor("lemmy_support")
  }

  return (
    <IonPage ref={pageRef}>
      <IonHeader>
        <IonToolbar>
          {/* <IonTitle>{t('communities')}</IonTitle>
          <IonButtons slot="end">
            <CommunitiesMoreActions />
          </IonButtons> */}
          <TitleSearch name={"lemmy_support"}>
            <IonButtons slot="end">
            </IonButtons>
          </TitleSearch>
        </IonToolbar>
      </IonHeader>
      <AppContent scrollY>
        <IonButtons>
          <IonButton onClick={openModal}>Open Modal</IonButton>
        </IonButtons>
        
      </AppContent>
    </IonPage>
  );
}
