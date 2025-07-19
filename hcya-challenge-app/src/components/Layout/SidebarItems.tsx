import HomePage from "../../pages/Home";
import ProductsPage from "../../pages/Products";
import CategoriesPage from "../../pages/Categories";
import { Home, ShoppingCart, Category } from "@mui/icons-material";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.JSX.Element;
  component: React.JSX.Element;
}

export const sidebarItems: SidebarItem[] = [
  {
    id: "home",
    label: "Inicio",
    icon: <Home />,
    component: <HomePage />,
  },
  {
    id: "products",
    label: "Productos",
    icon: <ShoppingCart />,
    component: <ProductsPage />,
  },
  {
    id: "categories",
    label: "Categorías",
    icon: <Category />,
    component: <CategoriesPage />,
  },
];
