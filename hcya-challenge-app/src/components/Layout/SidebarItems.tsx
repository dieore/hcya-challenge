import HomePage from "../../pages/Home";
import ProductsPage from "../../pages/Products";
import CategoriesPage from "../../pages/Categories";
import BrandsPage from "../../pages/Brands";
import SupercategoriesPage from "../../pages/Supercategories";
import SubcategoriesPage from "../../pages/Subcategories";
import { Home, ShoppingCart, Category, Storefront, Layers, Style } from "@mui/icons-material";

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
    id: "brands",
    label: "Marcas",
    icon: <Storefront />,
    component: <BrandsPage />,
  },
  {
    id: "supercategories",
    label: "Supercategorías",
    icon: <Layers />,
    component: <SupercategoriesPage />,
  },
  {
    id: "categories",
    label: "Categorías",
    icon: <Category />,
    component: <CategoriesPage />,
  },
  {
    id: "subcategories",
    label: "Subcategorías",
    icon: <Style />,
    component: <SubcategoriesPage />,
  },
];
