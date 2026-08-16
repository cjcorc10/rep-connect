import { RouteWrapper } from "@/app/components/transitionComponents/routeWrapper";
import AboutPage from "./aboutPage";

export default function Page() {
  return (
    <RouteWrapper>
      <AboutPage />
    </RouteWrapper>
  );
}
