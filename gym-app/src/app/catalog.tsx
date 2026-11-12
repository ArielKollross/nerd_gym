import { Redirect } from "expo-router";
import ComponentCatalog from "@/screens/component-catalog";

export default function CatalogRoute() {
	return __DEV__ ? <ComponentCatalog /> : <Redirect href="/" />;
}
